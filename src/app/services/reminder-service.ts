import { Injectable } from '@angular/core';
import { StorageService } from './storage-service';
import { ReminderSchedule } from '../models/app-models';

@Injectable({ providedIn: 'root' })
export class ReminderService {

  constructor(private storage: StorageService) {}

  // ── Запрос разрешения ───────────────────────────────────────────────────
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied')  return false;

    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  hasPermission(): boolean {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  // ── Сохранить расписание (незашифрованное, для SW) ──────────────────────
  async saveSchedule(schedule: ReminderSchedule): Promise<void> {
    await this.storage.saveReminderSchedule(schedule);
    await this.scheduleNotification(schedule);
  }

  // ── Удалить расписание ──────────────────────────────────────────────────
  async removeSchedule(id: string): Promise<void> {
    await this.storage.removeReminderSchedule(id);
    await this.cancelNotification(id);
  }

  // ── Пересинхронизировать все расписания ─────────────────────────────────
  // Вызывать при старте приложения после разблокировки
  async syncAll(schedules: ReminderSchedule[]): Promise<void> {
    for (const s of schedules) {
      await this.scheduleNotification(s);
    }
  }

  // ── Запланировать уведомление через SW ──────────────────────────────────
  private async scheduleNotification(schedule: ReminderSchedule): Promise<void> {
    if (!this.hasPermission()) return;

    const sw = await this.getServiceWorker(); 
    if (!sw) {
      // Fallback: setTimeout если SW недоступен
      this.scheduleWithTimeout(schedule);
      return;
    }
 
    // Отправляем сообщение Service Worker
    sw.postMessage({
      type:     'SCHEDULE_NOTIFICATION',
      id:       schedule.id,
      date:     schedule.scheduledAt,
      repeat:   schedule.repeat,
    });
  }

  // ── Отменить уведомление ─────────────────────────────────────────────────
  private async cancelNotification(id: string): Promise<void> {
    const sw = await this.getServiceWorker();
    if (!sw) return;
    sw.postMessage({ type: 'CANCEL_NOTIFICATION', id });
  }

  // ── Получить активный Service Worker ────────────────────────────────────
  private async getServiceWorker(): Promise<ServiceWorker | null> {
    if (!('serviceWorker' in navigator)) return null;
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    return reg?.active ?? null;
  }

  // ── Fallback: setTimeout для коротких интервалов (<= 5 мин) ─────────────
  private timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  private scheduleWithTimeout(schedule: ReminderSchedule): void {
    const existing = this.timeouts.get(schedule.id);
    if (existing) clearTimeout(existing);

    const delay = new Date(schedule.scheduledAt).getTime() - Date.now();
    if (delay <= 0 || delay > 5 * 60 * 1000) return; // только если скоро

    const timeout = setTimeout(() => {
      new Notification('Prepora', {
        body: `Напоминание`,
        icon: '/icons/icon-192x192.png',
      });
      this.timeouts.delete(schedule.id);
    }, delay);

    this.timeouts.set(schedule.id, timeout);
  }
}