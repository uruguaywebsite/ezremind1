'use client';

import { useState } from 'react';

interface Props {
  onSubmit: (text: string, delayMs: number, intervalMs: number) => void;
  onCancel: () => void;
}

const DELAY_OPTIONS = [
  { label: '10 min', ms: 10 * 60 * 1000 },
  { label: '30 min', ms: 30 * 60 * 1000 },
  { label: '1 hora', ms: 60 * 60 * 1000 },
];

const INTERVAL_OPTIONS = [
  { label: 'Cada 5 min', ms: 5 * 60 * 1000 },
  { label: 'Cada 10 min', ms: 10 * 60 * 1000 },
  { label: 'Cada 15 min', ms: 15 * 60 * 1000 },
];

export default function NewReminderForm({ onSubmit, onCancel }: Props) {
  const [text, setText] = useState('');
  const [delayIdx, setDelayIdx] = useState(0);
  const [intervalIdx, setIntervalIdx] = useState(1);
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;

    let delayMs: number;
    if (useCustomTime && customTime) {
      const [h, m] = customTime.split(':').map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(h, m, 0, 0);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      delayMs = target.getTime() - now.getTime();
    } else {
      delayMs = DELAY_OPTIONS[delayIdx].ms;
    }

    onSubmit(text.trim(), delayMs, INTERVAL_OPTIONS[intervalIdx].ms);
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '20px',
    border: active ? '2px solid #f0c430' : '1.5px solid rgba(180,180,170,0.4)',
    background: active
      ? 'linear-gradient(180deg, rgba(255,230,80,0.35), rgba(255,220,60,0.18))'
      : 'rgba(255,255,255,0.6)',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '13px',
    fontWeight: active ? 700 : 500,
    color: active ? '#6b5a10' : '#7a756e',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <div
      style={{
        padding: '20px 16px',
        marginBottom: '20px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(200, 200, 190, 0.35)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
    >
      {/* Input */}
      <label
        style={{
          display: 'block',
          fontFamily: "'Nunito', sans-serif",
          fontSize: '13px',
          fontWeight: 600,
          color: '#9a9590',
          marginBottom: '8px',
          letterSpacing: '0.3px',
        }}
      >
        ¿Qué no quieres olvidar?
      </label>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder="Estudiar química, comprar bebida..."
        onKeyDown={(e) => e.key === 'Enter' && text.trim() && handleSubmit()}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: '8px',
          border: '1.5px solid rgba(180,185,190,0.4)',
          fontFamily: "'Patrick Hand', cursive",
          fontSize: '18px',
          color: '#2c2926',
          background: 'rgba(253,251,247,0.8)',
          outline: 'none',
          boxSizing: 'border-box',
          marginBottom: '18px',
        }}
      />

      {/* Delay */}
      <label
        style={{
          display: 'block',
          fontFamily: "'Nunito', sans-serif",
          fontSize: '12px',
          fontWeight: 600,
          color: '#9a9590',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
        }}
      >
        Empezar a recordar en
      </label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
        {DELAY_OPTIONS.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => { setDelayIdx(i); setUseCustomTime(false); }}
            style={chipStyle(!useCustomTime && delayIdx === i)}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={() => setUseCustomTime(true)}
          style={chipStyle(useCustomTime)}
        >
          Hora exacta
        </button>
      </div>

      {useCustomTime && (
        <input
          type="time"
          value={customTime}
          onChange={(e) => setCustomTime(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1.5px solid rgba(180,185,190,0.4)',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '15px',
            color: '#2c2926',
            background: 'rgba(253,251,247,0.8)',
            marginBottom: '6px',
            marginTop: '6px',
          }}
        />
      )}

      {/* Interval */}
      <label
        style={{
          display: 'block',
          fontFamily: "'Nunito', sans-serif",
          fontSize: '12px',
          fontWeight: 600,
          color: '#9a9590',
          marginBottom: '8px',
          marginTop: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
        }}
      >
        Repetir
      </label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {INTERVAL_OPTIONS.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => setIntervalIdx(i)}
            style={chipStyle(intervalIdx === i)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          style={{
            flex: 1,
            padding: '14px 0',
            borderRadius: '8px',
            border: 'none',
            cursor: text.trim() ? 'pointer' : 'default',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.8px',
            color: text.trim() ? '#5a4a05' : '#b0a890',
            background: text.trim()
              ? 'linear-gradient(180deg, rgba(255,235,80,0.6), rgba(255,220,50,0.35))'
              : 'rgba(230,225,215,0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          Guardar
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '14px 24px',
            borderRadius: '8px',
            border: '1.5px solid rgba(180,180,170,0.35)',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            color: '#9a9590',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
