'use client';

import { Urgency } from '@/lib/storage';

interface Props {
  activeMarker: Urgency;
  onSelect: (color: Urgency) => void;
}

const markers: { color: Urgency; img: string }[] = [
  { color: 'red', img: '/marker-red.png' },
  { color: 'yellow', img: '/marker-yellow.png' },
  { color: 'green', img: '/marker-green.png' },
];

export default function HighlighterBar({ activeMarker, onSelect }: Props) {
  return (
    <>
      {/* Instruction when marker selected */}
      {activeMarker && (
        <div
          style={{
            position: 'fixed',
            bottom: '85px',
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
          }}
        >
          Tocá un recordatorio para subrayarlo
        </div>
      )}

      {/* Marker bar - clips bottom half */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70px',
          overflow: 'hidden',
          zIndex: 99,
        }}
      >
        {/* Fade background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 0%, var(--bg) 40%)',
            pointerEvents: 'none',
          }}
        />

        {/* Markers container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '20px',
            paddingTop: '10px',
            height: '140px',
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
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  width: '50px',
                  transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: isActive ? 'translateY(-20px)' : 'translateY(0)',
                  filter: isActive ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' : 'none',
                }}
              >
                <img
                  src={m.img}
                  alt={m.color || ''}
                  style={{
                    height: '120px',
                    width: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
