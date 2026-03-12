'use client';

import { useState } from 'react';

type Tab = 'apple' | 'android';

interface Props {
  onDismiss: (remindLater: boolean) => void;
}

export default function SetupGuide({ onDismiss }: Props) {
  const [tab, setTab] = useState<Tab>('apple');

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 0',
    border: 'none',
    borderBottom: active ? '2.5px solid var(--chip-active-border)' : '2.5px solid transparent',
    background: 'transparent',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '14px',
    fontWeight: active ? 700 : 500,
    color: active ? 'var(--text)' : 'var(--text-faint)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const stepNumStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'var(--highlight-chip)',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '12px',
    fontWeight: 800,
    color: 'var(--chip-active-text)',
    flexShrink: 0,
  };

  const stepRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '16px',
  };

  const stepTextStyle: React.CSSProperties = {
    fontFamily: "'Nunito', sans-serif",
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    margin: 0,
    paddingTop: '1px',
  };

  const boldStyle: React.CSSProperties = {
    fontWeight: 700,
    color: 'var(--text)',
  };

  return (
    <div
      style={{
        padding: '24px 20px',
        marginBottom: '20px',
        borderRadius: '12px',
        background: 'var(--bg-form)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 16px var(--shadow)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📲</div>
        <h2
          style={{
            fontFamily: "'Patrick Hand', cursive",
            fontSize: '22px',
            fontWeight: 400,
            color: 'var(--text)',
            margin: '0 0 6px 0',
          }}
        >
          Instalá la app
        </h2>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '13px',
            color: 'var(--text-muted)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Para recibir notificaciones y guardar tus recordatorios, necesitás instalar la app en tu teléfono.
        </p>
      </div>

      {/* Warning */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: '8px',
          background: 'var(--bg-warn)',
          border: '1px solid var(--warn-border)',
          marginBottom: '18px',
        }}
      >
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--warn-text)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          ⚠️ Sin instalar, las notificaciones no van a funcionar y tus recordatorios se pueden perder al cerrar el navegador.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setTab('apple')} style={tabStyle(tab === 'apple')}>
          🍎 iPhone
        </button>
        <button onClick={() => setTab('android')} style={tabStyle(tab === 'android')}>
          🤖 Android
        </button>
      </div>

      {/* Apple */}
      {tab === 'apple' && (
        <div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>1</span>
            <p style={stepTextStyle}>
              Abrí esta página en <span style={boldStyle}>Safari</span> (no funciona desde Chrome u otros navegadores en iPhone).
            </p>
          </div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>2</span>
            <p style={stepTextStyle}>
              Tocá el botón <span style={boldStyle}>Compartir</span> (el cuadrado con flecha ⬆️) en la barra inferior.
            </p>
          </div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>3</span>
            <p style={stepTextStyle}>
              Buscá y tocá <span style={boldStyle}>&quot;Agregar a Inicio&quot;</span>.
            </p>
          </div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>4</span>
            <p style={stepTextStyle}>
              Tocá <span style={boldStyle}>&quot;Agregar&quot;</span> arriba a la derecha. Va a aparecer en tu pantalla como una app.
            </p>
          </div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>5</span>
            <p style={stepTextStyle}>
              Abrila desde el ícono y <span style={boldStyle}>permití las notificaciones</span> cuando te lo pida.
            </p>
          </div>
        </div>
      )}

      {/* Android */}
      {tab === 'android' && (
        <div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>1</span>
            <p style={stepTextStyle}>
              Abrí esta página en <span style={boldStyle}>Chrome</span>.
            </p>
          </div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>2</span>
            <p style={stepTextStyle}>
              Tocá los <span style={boldStyle}>tres puntos ⋮</span> arriba a la derecha.
            </p>
          </div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>3</span>
            <p style={stepTextStyle}>
              Tocá <span style={boldStyle}>&quot;Instalar app&quot;</span> o <span style={boldStyle}>&quot;Agregar a pantalla de inicio&quot;</span>.
            </p>
          </div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>4</span>
            <p style={stepTextStyle}>
              Confirmá tocando <span style={boldStyle}>&quot;Instalar&quot;</span>. Va a aparecer en tu pantalla como una app.
            </p>
          </div>
          <div style={stepRowStyle}>
            <span style={stepNumStyle}>5</span>
            <p style={stepTextStyle}>
              Abrila desde el ícono y <span style={boldStyle}>permití las notificaciones</span> cuando te lo pida.
            </p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <button
        onClick={() => onDismiss(false)}
        style={{
          display: 'block',
          width: '100%',
          padding: '14px 0',
          marginTop: '8px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 800,
          fontSize: '14px',
          letterSpacing: '0.5px',
          color: 'var(--highlight-text)',
          background: 'var(--highlight-btn)',
          transition: 'transform 0.15s ease',
        }}
      >
        ¡Listo, ya la instalé!
      </button>
      <button
        onClick={() => onDismiss(true)}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px 0',
          marginTop: '6px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 500,
          fontSize: '12px',
          color: 'var(--text-faintest)',
        }}
      >
        Ahora no, recordarme después
      </button>
    </div>
  );
}
