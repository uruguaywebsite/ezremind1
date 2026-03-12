'use client';

import { useState, useEffect, useCallback } from 'react';
import { storage, Reminder } from '@/lib/storage';
import {
  scheduleReminder,
  cancelReminder as cancelNotif,
  requestNotificationPermission,
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
  }, [refresh]);

  const add = useCallback(
    async (text: string, delayMs: number, intervalMs: number) => {
      await requestNotificationPermission();

      const id = generateId();
      const now = Date.now();
      const reminder: Reminder = {
        id,
        text,
        createdAt: now,
        startAt: now + delayMs,
        intervalMs,
        done: false,
      };

      storage.add(reminder);
      await scheduleReminder(id, text, delayMs, intervalMs);
      refresh();
    },
    [refresh]
  );

  const markDone = useCallback(
    async (id: string) => {
      storage.markDone(id);
      await cancelNotif(id);
      refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      storage.delete(id);
      await cancelNotif(id);
      refresh();
    },
    [refresh]
  );

  return { active, done, add, markDone, remove };
}
