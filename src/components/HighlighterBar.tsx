'use client';

import { Urgency } from '@/lib/storage';

interface Props {
  activeMarker: Urgency;
  onSelect: (color: Urgency) => void;
}

const markers: { color: Urgency; img: string; label: string }[] = [
  { color: 'red', img: '/marker-red.png', label: 'Urgente' },
  { color: 'yellow', img: '/marker-yellow.png', label: 'Importante' },
  { color: 'green', img: '/marker-green.png', label: 'Tranqui' },
];

export default function HighlighterBar({ activeMarker, onSelect }: Props) {
  return (
    <>
      {/* Instruction text when marker is active */}
      {activeMarker && (
        <div
          style={{
            position: 'fixed',
            bottom: '105px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            background: 'var(--bg-card)',
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 10px var(--shadow)',
            zIndex: 100,
            whiteSpace: 'nowrap',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          Tocá un recordatorio para subrayarlo
        </div>
      )}

      {/* Marker bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '16px',
          padding: '12px 20px 20px',
          background: 'linear-gradient(transparent, var(--bg) 30%)',
          zIndex: 99,
          pointerEvents: 'none',
        }}
      >
        {markers.map((m) => {
          const isActive = activeMarker === m.color;
          return (
            <button
              key={m.color}
              onClick={() => onSelect(isActive ? null : m.color)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                pointerEvents: 'auto',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isActive ? 'translateY(-12px) scale(1.15)' : 'translateY(0) scale(1)',
                filter: isActive ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
              }}
            >
              <img
                src={m.img}
                alt={m.label}
                style={{
                  width: '70px',
                  height: 'auto',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
              {isActive && (
                <span
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    animation: 'fadeIn 0.2s ease-out',
                  }}
                >
                  {m.label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(4px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}} />
    </>
  );
}
