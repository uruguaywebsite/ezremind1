// Types
export interface Reminder {
  id: string;
  text: string;
  createdAt: number;
  startAt: number;       // timestamp when first notification fires
  intervalMs: number;    // repeat interval in ms
  done: boolean;
  doneAt?: number;
}

// Storage abstraction — swap localStorage for Supabase later
const STORAGE_KEY = 'recordatorios_data';

function read(): Reminder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function write(reminders: Reminder[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

// Public API
export const storage = {
  getAll(): Reminder[] {
    return read();
  },

  getActive(): Reminder[] {
    return read().filter((r) => !r.done);
  },

  getDone(): Reminder[] {
    return read().filter((r) => r.done);
  },

  add(reminder: Reminder) {
    const all = read();
    all.unshift(reminder);
    write(all);
  },

  markDone(id: string) {
    const all = read();
    const r = all.find((x) => x.id === id);
    if (r) {
      r.done = true;
      r.doneAt = Date.now();
    }
    write(all);
  },

  delete(id: string) {
    write(read().filter((x) => x.id !== id));
  },
};
