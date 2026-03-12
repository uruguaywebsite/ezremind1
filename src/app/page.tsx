'use client';

import { useState, useEffect } from 'react';
import { useReminders } from '@/hooks/useReminders';
import ReminderCard from '@/components/ReminderCard';
import NewReminderForm from '@/components/NewReminderForm';

export default function Home() {
  const { active, done, add, markDone, remove } = useReminders();
  const [showForm, setShowForm] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Register service worker
  useEffect(() => {
    setMounted(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '24px 20px 100px',
        minHeight: '100dvh',
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: '28px', paddingTop: '12px' }}>
        <h1
          style={{
            fontFamily: "'Patrick Hand', cursive",
            fontSize: '32px',
            fontWeight: 400,
            color: '#2c2926',
            margin: '0 0 4px 0',
            letterSpacing: '-0.5px',
          }}
        >
          Recordatorios
        </h1>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '13px',
            color: '#a09a94',
            margin: 0,
            fontWeight: 500,
          }}
        >
          No olvides nada.
        </p>
      </header>

      {/* New Reminder CTA */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'block',
            width: '100%',
            padding: '16px 0',
            marginBottom: '24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#5a4a05',
            background: 'transparent',
            position: 'relative',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          {/* Highlighter effect behind text */}
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              padding: '2px 8px',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: '0px',
                height: '55%',
                background: 'linear-gradient(90deg, rgba(255,230,60,0.55), rgba(255,210,40,0.4))',
                borderRadius: '3px',
                transform: 'rotate(-0.5deg)',
                zIndex: 0,
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>+ Nuevo Recordatorio</span>
          </span>
        </button>
      )}

      {/* New Reminder Form */}
      {showForm && (
        <NewReminderForm
          onSubmit={(text, delayMs, intervalMs) => {
            add(text, delayMs, intervalMs);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Active Reminders */}
      {active.length > 0 && (
        <section>
          <h2
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              color: '#b0a8a0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '12px',
            }}
          >
            Activos ({active.length})
          </h2>
          {active.map((r) => (
            <ReminderCard key={r.id} reminder={r} onDone={markDone} onDelete={remove} />
          ))}
        </section>
      )}

      {/* Empty state */}
      {active.length === 0 && !showForm && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.4 }}>📝</div>
          <p
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '18px',
              color: '#b0a8a0',
              margin: 0,
            }}
          >
            Sin recordatorios activos
          </p>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '13px',
              color: '#c5c0ba',
              margin: '6px 0 0',
            }}
          >
            Toca el botón para agregar uno
          </p>
        </div>
      )}

      {/* Done Section */}
      {done.length > 0 && (
        <section style={{ marginTop: '28px' }}>
          <button
            onClick={() => setShowDone(!showDone)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              color: '#b0a8a0',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              padding: '4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transition: 'transform 0.2s ease',
                transform: showDone ? 'rotate(90deg)' : 'rotate(0deg)',
                fontSize: '10px',
              }}
            >
              ▶
            </span>
            Completados ({done.length})
          </button>
          {showDone &&
            done.slice(0, 10).map((r) => (
              <ReminderCard key={r.id} reminder={r} onDone={markDone} onDelete={remove} />
            ))}
        </section>
      )}
    </div>
  );
}
