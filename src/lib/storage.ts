export type Urgency = 'green' | 'yellow' | 'red' | null;

export interface Reminder {
  id: string;
  text: string;
  imageDataUrl?: string;
  link?: string;
  urgency: Urgency;
  createdAt: number;
  startAt: number;
  intervalMs: number;
  done: boolean;
  doneAt?: number;
}

const STORAGE_KEY = 'ezremind_data';

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

// Sort: red first, yellow second, green third, null last
const urgencyOrder: Record<string, number> = { red: 0, yellow: 1, green: 2 };

function sortByUrgency(reminders: Reminder[]): Reminder[] {
  return [...reminders].sort((a, b) => {
    const aOrder = a.urgency ? urgencyOrder[a.urgency] : 3;
    const bOrder = b.urgency ? urgencyOrder[b.urgency] : 3;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return b.createdAt - a.createdAt;
  });
}

export const storage = {
  getAll(): Reminder[] {
    return read();
  },

  getActive(): Reminder[] {
    return sortByUrgency(read().filter((r) => !r.done));
  },

  getDone(): Reminder[] {
    return read().filter((r) => r.done);
  },

  add(reminder: Reminder) {
    const all = read();
    all.unshift(reminder);
    write(all);
  },

  update(id: string, updates: Partial<Reminder>) {
    const all = read();
    const r = all.find((x) => x.id === id);
    if (r) Object.assign(r, updates);
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
