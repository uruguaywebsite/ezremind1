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
      return '🚨 URGENTE: ' + text + ' — ¡Hacelo YA!';
    case 'yellow':
      return '⚡ Hey, no te olvides: ' + text;
    case 'green':
    default:
      return '🔔 ' + text;
  }
}

// Show a notification right now via SW
async function showNotificationNow(id: string, text: string, urgent: boolean): Promise<void> {
  if (typeof window === 'undefined') return;

  // Try via SW first
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: { id, text, urgent },
        });
        return;
      }
    } catch (e) {
      // fallback below
    }
  }

  // Fallback: direct Notification API
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('EZ Remind', {
      body: text,
      icon: '/icon-192.png',
    });
  }
}

// --- In-page timer system ---
// This runs while the page/app is open. Each reminder gets its own interval.

interface TimerEntry {
  timeout?: ReturnType<typeof setTimeout>;
  interval?: ReturnType<typeof setInterval>;
}

const timers: Record<string, TimerEntry> = {};

export function scheduleReminder(
  id: string,
  text: string,
  delayMs: number,
  intervalMs: number,
  urgency: Urgency = null
): void {
  cancelReminder(id);

  const notifText = getNotificationText(text, urgency);
  const isUrgent = urgency === 'red';

  const timeout = setTimeout(() => {
    // Fire first notification
    showNotificationNow(id, notifText, isUrgent);

    // Then repeat
    const interval = setInterval(() => {
      showNotificationNow(id, notifText, isUrgent);
    }, intervalMs);

    timers[id] = { interval };
  }, delayMs);

  timers[id] = { timeout };
}

export function cancelReminder(id: string): void {
  const t = timers[id];
  if (!t) return;
  if (t.timeout) clearTimeout(t.timeout);
  if (t.interval) clearInterval(t.interval);
  delete timers[id];
}

// Re-schedule all active reminders (called on page load to restore timers)
export function restoreReminders(reminders: Array<{
  id: string;
  text: string;
  startAt: number;
  intervalMs: number;
  urgency: Urgency;
  done: boolean;
}>): void {
  const now = Date.now();

  for (const r of reminders) {
    if (r.done) continue;
    if (timers[r.id]) continue; // already scheduled

    const delayMs = Math.max(0, r.startAt - now);
    scheduleReminder(r.id, r.text, delayMs, r.intervalMs, r.urgency);
  }
}

// Update urgency text without changing timing
export function updateUrgencyText(
  id: string,
  text: string,
  intervalMs: number,
  urgency: Urgency
): void {
  const t = timers[id];
  if (!t) return;

  // We need to cancel and reschedule with new text but keep remaining timing
  // Since we can't read remaining time from setInterval, just reschedule with 0 delay
  // but DON'T fire immediately - just update the interval text
  cancelReminder(id);

  const notifText = getNotificationText(text, urgency);
  const isUrgent = urgency === 'red';

  // Restart the interval (next fire will use new text)
  const interval = setInterval(() => {
    showNotificationNow(id, notifText, isUrgent);
  }, intervalMs);

  timers[id] = { interval };
}
