'use client';

import { useState, useEffect } from 'react';
import { useReminders } from '@/hooks/useReminders';
import ReminderCard from '@/components/ReminderCard';
import NewReminderForm from '@/components/NewReminderForm';
import SetupGuide from '@/components/SetupGuide';

const SETUP_KEY = 'ezremind_setup';
const THEME_KEY = 'ezremind_theme';

export default function Home() {
  const { active, done, add, markDone, remove } = useReminders();
  const [showForm, setShowForm] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Register SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Check setup guide
    const setupVal = localStorage.getItem(SETUP_KEY);
    if (!setupVal || setupVal === 'later') {
      setShowSetup(true);
    }

    // Load theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (!savedTheme) {
      // Follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setDark(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
    }
  };

  const dismissSetup = (remindLater: boolean) => {
    localStorage.setItem(SETUP_KEY, remindLater ? 'later' : 'done');
    setShowSetup(false);
  };

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
      <header style={{ marginBottom: '28px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '32px',
              fontWeight: 400,
              color: 'var(--text)',
              margin: '0 0 4px 0',
              letterSpacing: '-0.5px',
            }}
          >
            EZ Remind
          </h1>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '13px',
              color: 'var(--text-faint)',
              margin: 0,
              fontWeight: 500,
            }}
          >
            No olvides nada.
          </p>
        </div>
        <button
          onClick={toggleDark}
          aria-label="Cambiar tema"
          style={{
            background: 'none',
            border: '1.5px solid var(--border)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '4px',
            transition: 'border-color 0.2s ease',
          }}
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Setup Guide */}
      {showSetup && <SetupGuide onDismiss={dismissSetup} />}

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
            color: 'var(--highlight-text)',
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
                background: 'var(--highlight-bg)',
                borderRadius: '3px',
                transform: 'rotate(-0.5deg)',
                zIndex: 0,
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>+ Nuevo Recordatorio</span>
          </span>
        </button>
      )}

      {/* Form */}
      {showForm && (
        <NewReminderForm
          onSubmit={(text, delayMs, intervalMs, imageDataUrl, link) => {
            add(text, delayMs, intervalMs, imageDataUrl, link);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Active */}
      {active.length > 0 && (
        <section>
          <h2
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-faintest)',
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
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.4 }}>📝</div>
          <p
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '18px',
              color: 'var(--text-faintest)',
              margin: 0,
            }}
          >
            Sin recordatorios activos
          </p>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '13px',
              color: 'var(--text-placeholder)',
              margin: '6px 0 0',
            }}
          >
            Tocá el botón para agregar uno
          </p>
        </div>
      )}

      {/* Done */}
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
              color: 'var(--text-faintest)',
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
