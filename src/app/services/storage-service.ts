import { Injectable } from '@angular/core';
import { openPreporaDB } from '../db/database';
import { ReminderSchedule } from '../models/app-models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private dbPromise = openPreporaDB();
  // Проверяет завершён ли первый запуск
  async hasData(): Promise<boolean> {
    const db = await this.dbPromise;
    const setup = await db.get('meta', 'setup');
    return setup === true;
  }

  // Соль для PBKDF2
  async saveSalt(salt: Uint8Array): Promise<void> {
    const db = await this.dbPromise;
    await db.put('meta', salt, 'salt');
  }

  async loadSalt(): Promise<Uint8Array | undefined> {
    const db = await this.dbPromise;
    return db.get('meta', 'salt');
  }

  // Зашифрованный blob
  async saveBlob(blob: ArrayBuffer): Promise<void> {
    const db = await this.dbPromise;
    await db.put('vault', blob, 'data');
  }

  async loadBlob(): Promise<ArrayBuffer | undefined> {
    const db = await this.dbPromise;
    return db.get('vault', 'data');
  }

  // Пометить что Setup завершён
  async markSetupComplete(): Promise<void> {
    const db = await this.dbPromise;
    await db.put('meta', true, 'setup');
  }

  async saveReminderSchedule(s: ReminderSchedule): Promise<void> {
    (await this.dbPromise).put('reminders', s, s.id);
  }

  async removeReminderSchedule(id: string): Promise<void> {
    (await this.dbPromise).delete('reminders', id);
  }

  async getAllRemindersSchedules(): Promise<ReminderSchedule[]> {
    const db   = await this.dbPromise;
    const keys = await db.getAllKeys('reminders');
    const all  = await Promise.all(keys.map(k => db.get('reminders', k)));
    return all.filter(Boolean) as ReminderSchedule[];
  }
  
   // Полный сброс (для тестов или смены пароля)
  async clearAll(): Promise<void> {
    const db = await this.dbPromise;
    await db.clear('vault');
    await db.clear('meta');
    await db.clear('reminders');
  }
}
