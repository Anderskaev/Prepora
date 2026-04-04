import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage-service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // ── Приватное состояние ─────────────────────────────────────────────────
  private cryptoKey: CryptoKey | null = null;
  private hiddenAt:  number | null    = null;

  readonly isUnlocked = signal(false);

  private readonly PBKDF2_ITERATIONS = 310_000;
  private readonly LOCK_TIMEOUT_MS   = 5 * 60 * 1000; // 5 минут

  constructor(private storage: StorageService) {}

  // ── Публичный доступ к ключу ────────────────────────────────────────────
  getKey(): CryptoKey {
    if (!this.cryptoKey) throw new Error('App is locked');
    return this.cryptoKey;
  }

  setKey(key: CryptoKey): void {
    this.cryptoKey  = key;
    this.isUnlocked.set(true);
  }

  lock(): void {
    this.cryptoKey = null;
    this.isUnlocked.set(false);
  }

  // ── Деривация ключа из пароля (PBKDF2) ─────────────────────────────────
  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    // 1. Импортируем пароль как raw материал
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    // 2. Дериваем AES-GCM 256-bit ключ
    return crypto.subtle.deriveKey(
      {
        name:       'PBKDF2',
        salt,
        iterations: this.PBKDF2_ITERATIONS,
        hash:       'SHA-256'
      } as Pbkdf2Params,
      keyMaterial,
      { name: 'AES-GCM', length: 256 } as AesKeyGenParams,
      true,
      ['encrypt', 'decrypt']
    );
  }

  // ── Разблокировка паролем ───────────────────────────────────────────────
  async unlockWithPassword(password: string): Promise<boolean> {
    try {
      const salt = await this.storage.loadSalt();
      if (!salt) return false;

      const key = await this.deriveKey(password, salt);

      // Проверяем что пароль верный — пробуем расшифровать blob
      const blob = await this.storage.loadBlob();
      if (!blob) return false;

      await this.verifyKey(key, blob); // бросит если ключ неверный

      this.setKey(key);
      return true;
    } catch {
      return false;
    }
  }

  // ── Проверка ключа (пробная расшифровка) ────────────────────────────────
  private async verifyKey(key: CryptoKey, blob: ArrayBuffer): Promise<void> {
    const arr = new Uint8Array(blob);
    const iv  = arr.slice(0, 12);
    const enc = arr.slice(12);
    // Если ключ неверный — subtle.decrypt бросит DOMException
    await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, enc);
  }

  // ── Смена пароля ────────────────────────────────────────────────────────
  // Перешифровывает данные новым ключом
  async changePassword(
    oldPassword: string,
    newPassword: string,
    currentBlob: ArrayBuffer
  ): Promise<ArrayBuffer> {
    const salt   = await this.storage.loadSalt();
    if (!salt) throw new Error('Salt not found');

    // 1. Расшифровываем старым ключом
    const oldKey   = await this.deriveKey(oldPassword, salt);
    const arr      = new Uint8Array(currentBlob);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: arr.slice(0, 12) },
      oldKey,
      arr.slice(12)
    );

    // 2. Генерируем новую соль
    const newSalt = crypto.getRandomValues(new Uint8Array(16));
    await this.storage.saveSalt(newSalt);

    // 3. Шифруем новым ключом
    const newKey = await this.deriveKey(newPassword, newSalt);
    const iv     = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      newKey,
      decrypted
    );

    // 4. Обновляем ключ в памяти
    this.setKey(newKey);

    // 5. Возвращаем новый blob (IV + данные)
    const result = new Uint8Array(12 + encrypted.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encrypted), 12);
    return result.buffer;
  }


}