importScripts('./ngsw-worker.js');

const scheduledNotifications = new Map();

self.addEventListener('message', (event) => {
  const { type, id, date, repeat } = event.data;

  if (type === 'test') {
    console.log('Testing notification scheduling...', { id, date, repeat });
    
    const timeout = setTimeout(async () => {
      console.log('Showing test notification...');
      await self.registration.showNotification('Prepora', {
        body:    'Тестовое уведомление',
        icon:    '/icons/icon-192x192.png',
        badge:   '/icons/badge-72x72.png',
        tag:     id,
        data:    { id, repeat, date },
        actions: [
          { action: 'open',    title: 'Открыть' },
          { action: 'dismiss', title: 'Закрыть' },
        ],
      });
      console.log('Shown test notification');
    },10);
  }

  if (type === 'SCHEDULE_NOTIFICATION') {
    // Очищаем старый таймер если есть
    if (scheduledNotifications.has(id)) {
      clearTimeout(scheduledNotifications.get(id));
    }  
    
    const delay = new Date(date).getTime() - new Date().getTime();
    if (delay <= 0) return;
    

    const timeout = setTimeout(async () => {
      await self.registration.showNotification('Prepora', {
        body:    'Напоминание',
        icon:    '/icons/icon-192x192.png',
        badge:   '/icons/badge-72x72.png',
        tag:     id,
        data:    { id, repeat, date },
        actions: [
          { action: 'open',    title: 'Открыть' },
          { action: 'dismiss', title: 'Закрыть' },
        ],
      });

      scheduledNotifications.delete(id);

      // Автоматически перепланировать если повторяющееся
      if (repeat === 'monthly' || repeat === 'yearly') {
        const nextDate = getNextDate(new Date(date), repeat);
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({
            type: 'RESCHEDULE',
            id,
            nextDate: nextDate.toISOString(),
            repeat,
          }));
        });
      }
    }, delay);

    scheduledNotifications.set(id, timeout);
  }

  if (type === 'CANCEL_NOTIFICATION') {
    if (scheduledNotifications.has(id)) {
      clearTimeout(scheduledNotifications.get(id));
      scheduledNotifications.delete(id);
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length > 0) {
        clients[0].focus();
        clients[0].navigate('/control');
      } else {
        self.clients.openWindow('/control');
      }
    })
  );
});

function getNextDate(date, repeat) {
  const next = new Date(date);
  if (repeat === 'monthly') next.setMonth(next.getMonth() + 1);
  if (repeat === 'yearly')  next.setFullYear(next.getFullYear() + 1);
  return next;
}