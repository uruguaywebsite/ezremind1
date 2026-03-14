'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage, Reminder, Urgency } from '@/lib/storage';
import {
  scheduleReminder,
  cancelReminder as cancelNotif,
  requestNotificationPermission,
  restoreReminders,
  updateUrgencyText,
} from '@/lib/notifications';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

export function useReminders() {
  const [active, setActive] = useState<Reminder[]>([]);
  const [done, setDone] = useState<Reminder[]>([]);

  const refresh = useCallback(() => {
    setActive(storage.getActive());
    setDone(storage.getDone());
  }, []);

  useEffect(() => {
    refresh();
    // Restore all active reminder timers on page load
    const allActive = storage.getActive();
    restoreReminders(allActive);
  }, [refresh]);

  const add = useCallback(
    async (text: string, delayMs: number, intervalMs: number, imageDataUrl?: string, link?: string) => {
      await requestNotificationPermission();

      const id = generateId();
      const now = Date.now();
      const reminder: Reminder = {
        id,
        text,
        imageDataUrl,
        link,
        urgency: null,
        createdAt: now,
        startAt: now + delayMs,
        intervalMs,
        done: false,
      };

      storage.add(reminder);
      scheduleReminder(id, text, delayMs, intervalMs, null);
      refresh();
    },
    [refresh]
  );

  const setUrgency = useCallback(
    (id: string, urgency: Urgency) => {
      const r = active.find((x) => x.id === id);
      if (!r) return;
      storage.update(id, { urgency });
      updateUrgencyText(id, r.text, r.intervalMs, urgency);
      refresh();
    },
    [active, refresh]
  );

  const markDone = useCallback(
    (id: string) => {
      storage.markDone(id);
      cancelNotif(id);
      refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      storage.delete(id);
      cancelNotif(id);
      refresh();
    },
    [refresh]
  );

  return { active, done, add, markDone, remove, setUrgency };
}
