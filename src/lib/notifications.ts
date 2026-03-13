import type { Urgency } from './storage';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationText(text: string, urgency: Urgency): string {
  switch (urgency) {
    case 'red':
      return `🚨 URGENTE: ${text} — ¡Hacelo YA!`;
    case 'yellow':
      return `⚡ Hey, no te olvides: ${text}`;
    case 'green':
    default:
      return `🔔 ${text}`;
  }
}

export async function scheduleReminder(
  id: string,
  text: string,
  delayMs: number,
  intervalMs: number,
  urgency: Urgency = null
): Promise<void> {
  if (typeof window === 'undefined') return;

  const notifText = getNotificationText(text, urgency);
  const isUrgent = urgency === 'red';

  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          payload: { id, text: notifText, delayMs, intervalMs, urgent: isUrgent },
        });
        return;
      }
    } catch (err) {
      console.warn('SW scheduling failed, using fallback:', err);
    }
  }

  fallbackSchedule(id, notifText, delayMs, intervalMs);
}

export async function cancelReminder(id: string): Promise<void> {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({
          type: 'CANCEL_NOTIFICATION',
          payload: { id },
        });
        return;
      }
    } catch (err) {
      console.warn('SW cancel failed, using fallback:', err);
    }
  }

  fallbackCancel(id);
}

// Re-schedule with new urgency text (when user highlights a task)
export async function rescheduleWithUrgency(
  id: string,
  text: string,
  intervalMs: number,
  urgency: Urgency
): Promise<void> {
  await cancelReminder(id);
  // Schedule with 0 delay (start immediately) since it's already active
  await scheduleReminder(id, text, 0, intervalMs, urgency);
}

const fallbackTimers: Record<string, { timeout?: ReturnType<typeof setTimeout>; interval?: ReturnType<typeof setInterval> }> = {};

function fallbackSchedule(id: string, text: string, delayMs: number, intervalMs: number) {
  fallbackCancel(id);
  const timeout = setTimeout(() => {
    showFallbackNotification(text);
    const interval = setInterval(() => {
      showFallbackNotification(text);
    }, intervalMs);
    fallbackTimers[id] = { interval };
  }, delayMs);
  fallbackTimers[id] = { timeout };
}

function fallbackCancel(id: string) {
  const t = fallbackTimers[id];
  if (!t) return;
  if (t.timeout) clearTimeout(t.timeout);
  if (t.interval) clearInterval(t.interval);
  delete fallbackTimers[id];
}

function showFallbackNotification(text: string) {
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('EZ Remind', {
      body: text,
      icon: '/icon-192.png',
    });
  }
}
