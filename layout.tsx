import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Recordatorios',
  description: 'No olvides nada. Recordatorios simples para estudiantes.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Recordatorios',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FDFBF7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: '100dvh',
          fontFamily: "'Nunito', sans-serif",
          backgroundColor: '#FDFBF7',
          color: '#2c2926',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* Notebook lines background */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            backgroundImage: `
              repeating-linear-gradient(
                180deg,
                transparent,
                transparent 31px,
                rgba(185, 200, 220, 0.18) 31px,
                rgba(185, 200, 220, 0.18) 32px
              )
            `,
            backgroundSize: '100% 32px',
            backgroundPosition: '0 16px',
          }}
        />

        {/* Red margin line */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: '44px',
            width: '1.5px',
            backgroundColor: 'rgba(220, 120, 120, 0.15)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
