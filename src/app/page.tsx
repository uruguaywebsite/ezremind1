'use client';

import { useState, useEffect } from 'react';
import { useReminders } from '@/hooks/useReminders';
import { Urgency } from '@/lib/storage';
import ReminderCard from '@/components/ReminderCard';
import NewReminderForm from '@/components/NewReminderForm';
import SetupGuide from '@/components/SetupGuide';
import HighlighterBar from '@/components/HighlighterBar';

const SETUP_KEY = 'ezremind_setup';
const THEME_KEY = 'ezremind_theme';
const DND_KEY = 'ezremind_dnd_prompted';

export default function Home() {
  const { active, done, add, markDone, remove, setUrgency } = useReminders();
  const [showForm, setShowForm] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showDndPrompt, setShowDndPrompt] = useState(false);
  const [dark, setDark] = useState(false);
  const [activeMarker, setActiveMarker] = useState<Urgency>(null);

  useEffect(() => {
    setMounted(true);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    const setupVal = localStorage.getItem(SETUP_KEY);
    if (!setupVal || setupVal === 'later') {
      setShowSetup(true);
    }

    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        setDark(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, []);

  // Show DND prompt on first reminder creation
  const handleAdd = async (text: string, delayMs: number, intervalMs: number, imageDataUrl?: string, link?: string) => {
    await add(text, delayMs, intervalMs, imageDataUrl, link);
    setShowForm(false);

    const dndPrompted = localStorage.getItem(DND_KEY);
    if (!dndPrompted) {
      setShowDndPrompt(true);
      localStorage.setItem(DND_KEY, 'true');
    }
  };

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

  const handleHighlight = async (id: string) => {
    if (!activeMarker) return;
    await setUrgency(id, activeMarker);
    setActiveMarker(null);
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '24px 20px 140px',
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

      {/* DND Prompt */}
      {showDndPrompt && (
        <div
          style={{
            padding: '16px',
            marginBottom: '20px',
            borderRadius: '10px',
            background: 'var(--bg-form)',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px var(--shadow)',
          }}
        >
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 0 8px 0',
            }}
          >
            🔕 Modo No Molestar
          </p>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '13px',
              color: 'var(--text-muted)',
              margin: '0 0 6px 0',
              lineHeight: 1.6,
            }}
          >
            Para que tus recordatorios te lleguen siempre, excluí esta app del modo No Molestar:
          </p>
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '12px',
              color: 'var(--text-secondary)',
              margin: '0 0 14px 0',
              lineHeight: 1.6,
              padding: '10px 12px',
              borderRadius: '6px',
              background: 'var(--bg-input)',
            }}
          >
            <strong>iPhone:</strong> Ajustes → Modos de concentración → No molestar → Apps → Agregar EZ Remind<br />
            <strong>Android:</strong> Ajustes → Sonido → No molestar → Excepciones → Apps → EZ Remind
          </p>
          <button
            onClick={() => setShowDndPrompt(false)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 0',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              color: 'var(--highlight-text)',
              background: 'var(--highlight-btn)',
            }}
          >
            Entendido
          </button>
        </div>
      )}

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
          }}
        >
          <span style={{ position: 'relative', display: 'inline-block', padding: '2px 8px' }}>
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0, right: 0, bottom: '0px',
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
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Active hint when marker is selected */}
      {activeMarker && active.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '14px', color: 'var(--text-muted)' }}>
            No hay recordatorios para subrayar. Creá uno primero.
          </p>
        </div>
      )}

      {/* Active Reminders */}
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
            <ReminderCard
              key={r.id}
              reminder={r}
              onDone={markDone}
              onDelete={remove}
              activeMarker={activeMarker}
              onHighlight={handleHighlight}
            />
          ))}
        </section>
      )}

      {/* Empty state */}
      {active.length === 0 && !showForm && !activeMarker && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.4 }}>📝</div>
          <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '18px', color: 'var(--text-faintest)', margin: 0 }}>
            Sin recordatorios activos
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '13px', color: 'var(--text-placeholder)', margin: '6px 0 0' }}>
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
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif", fontSize: '11px', fontWeight: 700,
              color: 'var(--text-faintest)', textTransform: 'uppercase', letterSpacing: '1.5px',
              padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
            }}
          >
            <span style={{ display: 'inline-block', transition: 'transform 0.2s ease', transform: showDone ? 'rotate(90deg)' : 'rotate(0deg)', fontSize: '10px' }}>▶</span>
            Completados ({done.length})
          </button>
          {showDone && done.slice(0, 10).map((r) => (
            <ReminderCard key={r.id} reminder={r} onDone={markDone} onDelete={remove} activeMarker={null} onHighlight={() => {}} />
          ))}
        </section>
      )}

      {/* Highlighter toolbar */}
      <HighlighterBar activeMarker={activeMarker} onSelect={setActiveMarker} />
    </div>
  );
}
