'use client';

import { useState } from 'react';
import { Reminder, Urgency } from '@/lib/storage';

interface Props {
  reminder: Reminder;
  onDone: (id: string) => void;
  onDelete: (id: string) => void;
  activeMarker: Urgency;
  onHighlight: (id: string) => void;
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

const highlightColors: Record<string, string> = {
  red: 'rgba(255, 70, 70, 0.3)',
  yellow: 'rgba(255, 230, 60, 0.35)',
  green: 'rgba(100, 220, 100, 0.3)',
};

export default function ReminderCard({ reminder, onDone, onDelete, activeMarker, onHighlight }: Props) {
  const isActive = !reminder.done;
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (activeMarker && isActive) {
      setAnimating(true);
      setTimeout(() => {
        onHighlight(reminder.id);
        setAnimating(false);
      }, 500);
    }
  };

  const highlightColor = reminder.urgency ? highlightColors[reminder.urgency] : 'transparent';
  const showHighlight = reminder.urgency !== null;

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        padding: '20px 18px 16px',
        marginBottom: '14px',
        borderRadius: '6px',
        backgroundColor: reminder.done ? 'var(--bg-card-done)' : 'var(--bg-card)',
        border: '1px solid var(--border)',
        transition: 'all 0.3s ease',
        opacity: reminder.done ? 0.55 : 1,
        cursor: activeMarker && isActive ? 'pointer' : 'default',
        transform: activeMarker && isActive ? 'scale(1)' : undefined,
      }}
    >
      {/* Delete */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(reminder.id); }}
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
          zIndex: 2,
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
            maxHeight: '200px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginBottom: '10px',
            border: '1px solid var(--border)',
          }}
        />
      )}

      {/* Text with highlight underline */}
      <p
        style={{
          fontFamily: "'Patrick Hand', cursive",
          fontSize: '19px',
          color: 'var(--text)',
          margin: '0 0 8px 0',
          textDecoration: reminder.done ? 'line-through' : 'none',
          lineHeight: 1.4,
          paddingRight: '20px',
          position: 'relative',
          display: 'inline-block',
        }}
      >
        {/* Highlighter underline effect */}
        {showHighlight && (
          <span
            style={{
              position: 'absolute',
              left: '-2px',
              right: '-2px',
              bottom: '2px',
              height: '40%',
              background: highlightColor,
              borderRadius: '2px',
              transform: 'rotate(-0.3deg)',
              zIndex: 0,
              animation: animating ? 'highlightDraw 0.5s ease-out forwards' : undefined,
            }}
          />
        )}
        {/* Animating highlight for new application */}
        {animating && activeMarker && (
          <span
            style={{
              position: 'absolute',
              left: '-2px',
              bottom: '2px',
              height: '40%',
              background: highlightColors[activeMarker] || 'transparent',
              borderRadius: '2px',
              transform: 'rotate(-0.3deg)',
              zIndex: 0,
              animation: 'highlightDraw 0.5s ease-out forwards',
            }}
          />
        )}
        <span style={{ position: 'relative', zIndex: 1 }}>{reminder.text}</span>
      </p>

      {/* Link */}
      {reminder.link && (
        <a
          href={reminder.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
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
          onClick={(e) => { e.stopPropagation(); onDone(reminder.id); }}
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
        >
          ✓ Hecho
        </button>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes highlightDraw {
          0% { width: 0; opacity: 0.8; }
          100% { width: calc(100% + 4px); opacity: 1; }
        }
      `}} />
    </div>
  );
}
