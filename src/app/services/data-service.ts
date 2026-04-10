// core/services/data.service.ts
import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from './auth-service';
import { StorageService } from './storage-service';
import {
  AppData, Scenario, VaultItem,
  Reminder, Category, ReminderSchedule,
  ExportFile
} from '../models/app-models';

import { ReminderService } from './reminder-service'; //раскомментировать при добавлении ReminderService

const EMPTY_APP_DATA: AppData = {
  version:            1,
  updatedAt:          new Date().toISOString(),
  scenarios:          [],
  vaultItems:         [],
  reminders:          [],
  scenarioCategories: [],
  vaultCategories:    [],
};

@Injectable({ providedIn: 'root' })
export class DataService {

  // ── Состояние ───────────────────────────────────────────────────────────
  // Используем signals для реактивности в шаблонах
  readonly scenarios          = signal<Scenario[]>([]);
  readonly vaultItems         = signal<VaultItem[]>([]);
  readonly reminders          = signal<Reminder[]>([]);
  readonly scenarioCategories = signal<Category[]>([]);
  readonly vaultCategories    = signal<Category[]>([]);
  readonly isLoaded           = signal(false);

  // Внутренний объект — полный AppData
  private data: AppData = { ...EMPTY_APP_DATA };

  // Subject для debounced сохранения
  private readonly persist$ = new Subject<AppData>();

  constructor(
    private auth:     AuthService,
    private storage:  StorageService,
    private reminder: ReminderService
  ) {
    // Подписываемся на persist$ с debounce
    // Шифрование происходит не чаще раза в секунду
    this.persist$.pipe(
      debounceTime(1000)
    ).subscribe(data => this.saveToStorage(data));
  }

  // ── Загрузка при разблокировке ──────────────────────────────────────────
  async load(): Promise<void> {
    const blob = await this.storage.loadBlob();
    if (!blob) return;

    const decrypted = await this.decrypt(blob);
    this.applyData(decrypted);
    this.isLoaded.set(true);
  }

  // ── Инициализация пустых данных (Setup) ─────────────────────────────────
  async initEmpty(): Promise<void> {
    this.data = {
      ...EMPTY_APP_DATA,
      updatedAt: new Date().toISOString()
    };
    this.applyData(this.data);
    await this.saveToStorage(this.data); // сохраняем сразу без debounce
    this.isLoaded.set(true);
  }

  // ── SCENARIOS ───────────────────────────────────────────────────────────
  addScenario(scenario: Omit<Scenario, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newItem: Scenario = {
      ...scenario,
      id:        crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mutate(data => ({
      ...data,
      scenarios: [...data.scenarios, newItem]
    }));
  }

  updateScenario(updated: Scenario): void {
    this.mutate(data => ({
      ...data,
      scenarios: data.scenarios.map(s =>
        s.id === updated.id
          ? { ...updated, updatedAt: new Date().toISOString() }
          : s
      )
    }));
  }

  deleteScenario(id: string): void {
    this.mutate(data => ({
      ...data,
      scenarios: data.scenarios.filter(s => s.id !== id)
    }));
  }

  getScenario(id: string): Scenario | undefined {
    return this.data.scenarios.find(s => s.id === id);
  }

  // ── VAULT ITEMS ─────────────────────────────────────────────────────────
  addVaultItem(item: Omit<VaultItem, 'id' | 'createdAt'>): void {
    const newItem: VaultItem = {
      ...item,
      id:        crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.mutate(data => ({
      ...data,
      vaultItems: [...data.vaultItems, newItem]
    }));
  }

  updateVaultItem(updated: VaultItem): void {
    this.mutate(data => ({
      ...data,
      vaultItems: data.vaultItems.map(v =>
        v.id === updated.id ? updated : v
      )
    }));
  }

  deleteVaultItem(id: string): void {
    this.mutate(data => ({
      ...data,
      vaultItems: data.vaultItems.filter(v => v.id !== id)
    }));
  }

  // ── REMINDERS ───────────────────────────────────────────────────────────
  addReminder(reminder: Omit<Reminder, 'id'>): void {
    const newItem: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
    };
    this.mutate(data => ({
      ...data,
      reminders: [...data.reminders, newItem]
    }));
    // Синхронизируем незашифрованное расписание для Service Worker
    this.syncReminderSchedule(newItem);
  }

  updateReminder(updated: Reminder): void {
    this.mutate(data => ({
      ...data,
      reminders: data.reminders.map(r =>
        r.id === updated.id ? updated : r
      )
    }));
    this.syncReminderSchedule(updated);
  }

  deleteReminder(id: string): void {
    this.mutate(data => ({
      ...data,
      reminders: data.reminders.filter(r => r.id !== id)
    }));
    this.reminder.removeSchedule(id); //раскомментировать при добавлении ReminderService
  }

  // ── CATEGORIES ──────────────────────────────────────────────────────────
  addScenarioCategory(category: Omit<Category, 'id'>): void {
    const newItem: Category = { ...category, id: crypto.randomUUID() };
    this.mutate(data => ({
      ...data,
      scenarioCategories: [...data.scenarioCategories, newItem]
    }));
  }

  updateScenarioCategory(updated: Category): void {
    this.mutate(data => ({
      ...data,
      scenarioCategories: data.scenarioCategories.map(c =>
        c.id === updated.id ? updated : c
      )
    }));
  }

  deleteScenarioCategory(id: string): void {
    this.mutate(data => ({
      ...data,
      scenarioCategories: data.scenarioCategories.filter(c => c.id !== id),
      // Удаляем сценарии этой категории
      scenarios: data.scenarios.filter(s => s.category !== id)
    }));
  }

  addVaultCategory(category: Omit<Category, 'id'>): void {
    const newItem: Category = { ...category, id: crypto.randomUUID() };
    this.mutate(data => ({
      ...data,
      vaultCategories: [...data.vaultCategories, newItem]
    }));
  }

  deleteVaultCategory(id: string): void {
    this.mutate(data => ({
      ...data,
      vaultCategories: data.vaultCategories.filter(c => c.id !== id),
      vaultItems: data.vaultItems.filter(v => v.category !== id)
    }));
  }

  // ── Экспорт / Импорт ────────────────────────────────────────────────────
// Экспорт — отдельный пароль для файла
async exportBlob(exportPassword: string): Promise<Blob> {
  // 1. Генерируем новую соль специально для этого файла
  const fileSalt = crypto.getRandomValues(new Uint8Array(16));

  // 2. Дериваем ключ из пароля файла + новой соли
  const fileKey = await this.auth.deriveKey(exportPassword, fileSalt);

  // 3. Шифруем данные ключом файла
  const iv      = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(this.data));
  const cipher  = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv } as AesGcmParams, fileKey, encoded
  );

  // 4. В файл идёт: соль файла + IV + данные
  //    Ключ приложения ВООБЩЕ не участвует
  const exportFile: ExportFile = {
    version: 1,
    salt:    Array.from(fileSalt),   // соль только для этого файла
    iv:      Array.from(iv),
    data:    Array.from(new Uint8Array(cipher)),
  };

  return new Blob(
    [JSON.stringify(exportFile)],
    { type: 'application/json' }
  );
}

// Импорт — расшифровываем ключом файла, сохраняем своим ключом
async importBlob(file: File, exportPassword: string): Promise<void> {
  const exportFile = JSON.parse(await file.text()) as ExportFile;

  // 1. Дериваем ключ из пароля + соли ИЗ ФАЙЛА
  const fileSalt = new Uint8Array(exportFile.salt);
  const fileKey  = await this.auth.deriveKey(exportPassword, fileSalt);

  // 2. Расшифровываем ключом файла
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(exportFile.iv) } as AesGcmParams,
    fileKey,
    new Uint8Array(exportFile.data)
  );

  const appData = JSON.parse(new TextDecoder().decode(decrypted)) as AppData;

  // 3. Сохраняем СВОИМ текущим ключом приложения
  //    Ключ файла здесь уже не нужен и нигде не сохраняется
  await this.saveToStorage(appData);
  this.applyData(appData);
}

  // ── Приватные методы ────────────────────────────────────────────────────

  // Единая точка мутации состояния
  private mutate(fn: (data: AppData) => AppData): void {
    this.data = fn({
      ...this.data,
      updatedAt: new Date().toISOString()
    });
    this.applyData(this.data);    // обновляем signals мгновенно
    this.persist$.next(this.data); // debounced сохранение
  }

  // Применяет данные к signals (обновляет UI)
  private applyData(data: AppData): void {
    this.data = data;
    this.scenarios.set(data.scenarios);
    this.vaultItems.set(data.vaultItems);
    this.reminders.set(data.reminders);
    this.scenarioCategories.set(data.scenarioCategories);
    this.vaultCategories.set(data.vaultCategories);
  }

  // Шифрует и сохраняет в IndexedDB
  private async saveToStorage(data: AppData): Promise<void> {
    try {
      const key     = this.auth.getKey();
      const iv      = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(JSON.stringify(data));

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv } as AesGcmParams,
        key,
        encoded
      );

      const blob = new Uint8Array(12 + encrypted.byteLength);
      blob.set(iv, 0);
      blob.set(new Uint8Array(encrypted), 12);

      await this.storage.saveBlob(blob.buffer);
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  // Расшифровывает blob из IndexedDB
  private async decrypt(buf: ArrayBuffer): Promise<AppData> {
    const key = this.auth.getKey();
    const arr = new Uint8Array(buf);
    const iv  = arr.slice(0, 12);
    const enc = arr.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv } as AesGcmParams,
      key,
      enc
    );

    return JSON.parse(new TextDecoder().decode(decrypted)) as AppData;
  }

  // Синхронизирует незашифрованное расписание для Service Worker
  private syncReminderSchedule(reminder: Reminder): void {
    const schedule: ReminderSchedule = {
      id:          reminder.id,
      scheduledAt: reminder.date,
      repeat:      reminder.repeat
    };
    this.reminder.saveSchedule(schedule); //раскомментировать при добавлении ReminderService
  }
}