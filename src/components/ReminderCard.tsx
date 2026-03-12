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

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export default function ReminderCard({ reminder, onDone, onDelete }: Props) {
  const isActive = !reminder.done;

  return (
    <div
      style={{
        position: 'relative',
        padding: '20px 18px 16px',
        marginBottom: '14px',
        borderRadius: '6px',
        backgroundColor: reminder.done ? 'var(--bg-card-done)' : 'var(--bg-card)',
        border: '1px solid var(--border)',
        transition: 'all 0.3s ease',
        opacity: reminder.done ? 0.55 : 1,
      }}
    >
      {/* Delete */}
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
          color: 'var(--text-faintest)',
          cursor: 'pointer',
          padding: '4px',
          lineHeight: 1,
        }}
      >
        ×
      </button>

      {/* Image */}
      {reminder.imageDataUrl && (
        <img
          src={reminder.imageDataUrl}
          alt=""
          style={{
            width: '100%',
            maxHeight: '160px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginBottom: '10px',
            border: '1px solid var(--border)',
          }}
        />
      )}

      {/* Text */}
      <p
        style={{
          fontFamily: "'Patrick Hand', cursive",
          fontSize: '19px',
          color: 'var(--text)',
          margin: '0 0 8px 0',
          textDecoration: reminder.done ? 'line-through' : 'none',
          lineHeight: 1.4,
          paddingRight: '20px',
        }}
      >
        {reminder.text}
      </p>

      {/* Link */}
      {reminder.link && (
        <a
          href={reminder.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '12px',
            color: 'var(--link-color)',
            textDecoration: 'none',
            marginBottom: '8px',
            padding: '4px 10px',
            borderRadius: '4px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
          }}
        >
          🔗 {extractDomain(reminder.link)}
        </a>
      )}

      {/* Meta */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          fontSize: '12px',
          fontFamily: "'Nunito', sans-serif",
          color: 'var(--text-muted)',
          marginBottom: isActive ? '14px' : '0',
          marginTop: reminder.link ? '8px' : '0',
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
            color: 'var(--done-text)',
            background: 'var(--done-btn)',
            transition: 'transform 0.15s ease',
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
