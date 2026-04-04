import { openDB, IDBPDatabase } from 'idb';
import { ReminderSchedule } from '../models/app-models';

export interface PreporaDB {
  vault: {        // зашифрованный blob с данными
    key: string;
    value: ArrayBuffer;
  };
  meta: {         // соль, версия схемы, настройки
    key: string;
    value: any;
  };
  reminders: {    // незашифрованные расписания для SW
    key: string;
    value: ReminderSchedule;
  };
}

export async function openPreporaDB(): Promise<IDBPDatabase<PreporaDB>> {
  return openDB<PreporaDB>('prepora-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('vault')) {
        db.createObjectStore('vault');
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta');
      }
      if (!db.objectStoreNames.contains('reminders')) {
        db.createObjectStore('reminders');
      }
    }
  });
}