'use client';

import { Reminder } from '@/lib/storage';

interface Props {
  reminder: Reminder;
  onDone: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('es-UY', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function intervalLabel(ms: number) {
  const min = ms / 60000;
  if (min < 60) return `${min} min`;
  return `${min / 60} h`;
}

export default function ReminderCard({ reminder, onDone, onDelete }: Props) {
  const isActive = !reminder.done;

  return (
    <div
      className={`reminder-card ${reminder.done ? 'done' : ''}`}
      style={{
        position: 'relative',
        padding: '20px 18px 16px',
        marginBottom: '14px',
        borderRadius: '6px',
        backgroundColor: reminder.done ? 'rgba(200, 210, 200, 0.12)' : 'rgba(255,255,255,0.85)',
        border: '1px solid rgba(180, 190, 200, 0.25)',
        transition: 'all 0.3s ease',
        opacity: reminder.done ? 0.55 : 1,
      }}
    >
      {/* Delete button */}
      <button
        onClick={() => onDelete(reminder.id)}
        aria-label="Eliminar"
        style={{
          position: 'absolute',
          top: '8px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '16px',
          color: '#b0a8a0',
          cursor: 'pointer',
          padding: '4px',
          lineHeight: 1,
        }}
      >
        ×
      </button>

      {/* Text */}
      <p
        style={{
          fontFamily: "'Patrick Hand', cursive",
          fontSize: '19px',
          color: '#2c2926',
          margin: '0 0 8px 0',
          textDecoration: reminder.done ? 'line-through' : 'none',
          lineHeight: 1.4,
          paddingRight: '20px',
        }}
      >
        {reminder.text}
      </p>

      {/* Meta */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          fontSize: '12px',
          fontFamily: "'Nunito', sans-serif",
          color: '#8a8580',
          marginBottom: isActive ? '14px' : '0',
        }}
      >
        <span>Empieza: {formatTime(reminder.startAt)}</span>
        <span>Cada: {intervalLabel(reminder.intervalMs)}</span>
      </div>

      {/* Done button */}
      {isActive && (
        <button
          onClick={() => onDone(reminder.id)}
          style={{
            display: 'block',
            width: '100%',
            padding: '12px 0',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#2a6e3f',
            background: 'linear-gradient(180deg, rgba(130, 240, 140, 0.35) 0%, rgba(100, 220, 120, 0.25) 100%)',
            position: 'relative',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          ✓ Hecho
        </button>
      )}
    </div>
  );
}
