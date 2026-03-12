'use client';

import { useState, useRef } from 'react';

interface Props {
  onSubmit: (text: string, delayMs: number, intervalMs: number, imageDataUrl?: string, link?: string) => void;
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
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [link, setLink] = useState('');
  const [showExtras, setShowExtras] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

    const finalLink = link.trim() || undefined;
    onSubmit(text.trim(), delayMs, INTERVAL_OPTIONS[intervalIdx].ms, imageDataUrl, finalLink);
  };

  const handleImagePick = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Resize to max 400px to save localStorage space
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = 400;
        let w = img.width;
        let h = img.height;
        if (w > max || h > max) {
          if (w > h) { h = (h / w) * max; w = max; }
          else { w = (w / h) * max; h = max; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        setImageDataUrl(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageDataUrl(undefined);
    if (fileRef.current) fileRef.current.value = '';
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '20px',
    border: active ? '2px solid var(--chip-active-border)' : '1.5px solid var(--chip-border)',
    background: active ? 'var(--highlight-chip)' : 'transparent',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '13px',
    fontWeight: active ? 700 : 500,
    color: active ? 'var(--chip-active-text)' : 'var(--chip-text)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
  });

  const smallBtnStyle: React.CSSProperties = {
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1.5px solid var(--border-input)',
    background: 'transparent',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      style={{
        padding: '20px 16px',
        marginBottom: '20px',
        borderRadius: '10px',
        background: 'var(--bg-form)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 12px var(--shadow)',
      }}
    >
      {/* Input */}
      <label
        style={{
          display: 'block',
          fontFamily: "'Nunito', sans-serif",
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-faint)',
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
          border: '1.5px solid var(--border-input)',
          fontFamily: "'Patrick Hand', cursive",
          fontSize: '18px',
          color: 'var(--text)',
          background: 'var(--bg-input)',
          outline: 'none',
          boxSizing: 'border-box',
          marginBottom: '12px',
        }}
      />

      {/* Extras toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={handleImagePick} style={smallBtnStyle}>
          📷 Foto
        </button>
        <button onClick={() => setShowExtras(!showExtras)} style={smallBtnStyle}>
          🔗 Link
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Image preview */}
      {imageDataUrl && (
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <img
            src={imageDataUrl}
            alt="Preview"
            style={{
              width: '100%',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          />
          <button
            onClick={removeImage}
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Link input */}
      {showExtras && (
        <div style={{ marginBottom: '14px' }}>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1.5px solid var(--border-input)',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '14px',
              color: 'var(--text)',
              background: 'var(--bg-input)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* Delay */}
      <label
        style={{
          display: 'block',
          fontFamily: "'Nunito', sans-serif",
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text-faint)',
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
            border: '1.5px solid var(--border-input)',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '15px',
            color: 'var(--text)',
            background: 'var(--bg-input)',
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
          color: 'var(--text-faint)',
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
            color: text.trim() ? 'var(--highlight-text)' : 'var(--text-faintest)',
            background: text.trim() ? 'var(--highlight-btn)' : 'var(--bg-input)',
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
            border: '1.5px solid var(--chip-border)',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
            color: 'var(--text-faint)',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
