import { Injectable } from '@angular/core';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class PinService {

  private readonly STORAGE_KEY    = 'pin_protected_key';
  private readonly MAX_ATTEMPTS   = 3;
  private attempts                = 0;

  constructor(private auth: AuthService) {}

  // ── Проверяет есть ли сохранённый ПИН-ключ ─────────────────────────────
  hasPinKey(): boolean {
    return !!sessionStorage.getItem(this.STORAGE_KEY);
  }

  // ── Сохранить ключ зашифрованным ПИНом ─────────────────────────────────
  async saveKeyWithPin(pin: string): Promise<void> {
    const cryptoKey = this.auth.getKey(); // берём текущий ключ из памяти

    // 1. Экспортируем CryptoKey в raw bytes
    const rawKey = await crypto.subtle.exportKey('raw', cryptoKey);

    // 2. Дериваем ключ из ПИН
    const pinSalt = crypto.getRandomValues(new Uint8Array(16));
    const pinKey  = await this.derivePinKey(pin, pinSalt);

    // 3. Шифруем rawKey ключом из ПИН
    const iv        = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      pinKey,
      rawKey
    );

    // 4. Сохраняем в sessionStorage
    // sessionStorage автоматически очищается при закрытии вкладки
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv:        Array.from(iv),
      pinSalt:   Array.from(pinSalt)
    }));

    this.attempts = 0;
  }

  // ── Разблокировка по ПИН ────────────────────────────────────────────────
  async unlockWithPin(pin: string): Promise<CryptoKey | null> {
    if (this.isBlocked()) {
      throw new Error('PIN_BLOCKED');
    }

    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;

    try {
      const { encrypted, iv, pinSalt } = JSON.parse(stored);

      const pinKey = await this.derivePinKey(
        pin,
        new Uint8Array(pinSalt)
      );

      const rawKey = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        pinKey,
        new Uint8Array(encrypted)
      );

      // Успех — сбрасываем счётчик попыток
      this.attempts = 0;

      return crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: 'AES-GCM' } as AesKeyAlgorithm,
        true,
        ['encrypt', 'decrypt']
      );

    } catch {
      this.attempts++;

      if (this.isBlocked()) {
        // Удаляем ПИН-ключ — потребуется мастер-пароль
        this.clearPin();
        throw new Error('PIN_BLOCKED');
      }

      return null;
    }
  }

  // ── Удалить ПИН (при смене пароля или сбросе) ──────────────────────────
  clearPin(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.attempts = 0;
  }

  // ── Сколько попыток осталось ────────────────────────────────────────────
  attemptsLeft(): number {
    return this.MAX_ATTEMPTS - this.attempts;
  }

  isBlocked(): boolean {
    return this.attempts >= this.MAX_ATTEMPTS;
  }

  // ── Приватное: деривация ключа из ПИН ──────────────────────────────────
  private async derivePinKey(
    pin:     string,
    pinSalt: Uint8Array
  ): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(pin),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name:       'PBKDF2',
        salt:       pinSalt,
        iterations: 100_000, // меньше чем для мастер-пароля — ПИН короткий
        hash:       'SHA-256'
      } as Pbkdf2Params,
      keyMaterial,
      { name: 'AES-GCM', length: 256 } as AesKeyGenParams,
      false,
      ['encrypt', 'decrypt']
    );
  }
}