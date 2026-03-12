export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function scheduleReminder(
  id: string,
  text: string,
  delayMs: number,
  intervalMs: number
): Promise<void> {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        reg.active.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          payload: { id, text, delayMs, intervalMs },
        });
        return;
      }
    } catch (err) {
      console.warn('SW scheduling failed, using fallback:', err);
    }
  }

  // Fallback: in-page timers (only works while tab is open)
  fallbackSchedule(id, text, delayMs, intervalMs);
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

// Fallback for browsers without SW support
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
    new Notification('Recordatorios', {
      body: `🔔 ${text}`,
      icon: '/icon-192.png',
    });
  }
}
