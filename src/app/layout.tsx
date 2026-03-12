import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'EZ Remind',
  description: 'No olvides nada. Recordatorios simples para estudiantes.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EZ Remind',
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
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg: #FDFBF7;
            --bg-card: rgba(255,255,255,0.85);
            --bg-card-done: rgba(200,210,200,0.12);
            --bg-form: rgba(255,255,255,0.9);
            --bg-input: rgba(253,251,247,0.8);
            --bg-warn: rgba(255,230,80,0.15);
            --text: #2c2926;
            --text-secondary: #4a4540;
            --text-muted: #8a8580;
            --text-faint: #a09a94;
            --text-faintest: #b0a8a0;
            --text-placeholder: #c5c0ba;
            --border: rgba(180,190,200,0.25);
            --border-input: rgba(180,185,190,0.4);
            --line-color: rgba(185,200,220,0.18);
            --margin-color: rgba(220,120,120,0.15);
            --highlight-bg: linear-gradient(90deg, rgba(255,230,60,0.55), rgba(255,210,40,0.4));
            --highlight-chip: linear-gradient(180deg, rgba(255,230,80,0.35), rgba(255,220,60,0.18));
            --highlight-btn: linear-gradient(180deg, rgba(255,235,80,0.6), rgba(255,220,50,0.35));
            --done-btn: linear-gradient(180deg, rgba(130,240,140,0.35), rgba(100,220,120,0.25));
            --chip-border: rgba(180,180,170,0.4);
            --chip-active-border: #f0c430;
            --chip-text: #7a756e;
            --chip-active-text: #6b5a10;
            --done-text: #2a6e3f;
            --highlight-text: #5a4a05;
            --warn-border: rgba(240,196,48,0.3);
            --warn-text: #6b5a10;
            --link-color: #2a7ae8;
            --shadow: rgba(0,0,0,0.04);
          }

          [data-theme="dark"] {
            --bg: #1a1a1e;
            --bg-card: rgba(40,40,45,0.9);
            --bg-card-done: rgba(35,35,38,0.8);
            --bg-form: rgba(40,40,45,0.95);
            --bg-input: rgba(50,50,55,0.8);
            --bg-warn: rgba(80,65,20,0.35);
            --text: #e8e4e0;
            --text-secondary: #c5c0b8;
            --text-muted: #8a8580;
            --text-faint: #706b65;
            --text-faintest: #5a5550;
            --text-placeholder: #4a4540;
            --border: rgba(80,80,85,0.5);
            --border-input: rgba(80,80,85,0.6);
            --line-color: rgba(80,85,95,0.2);
            --margin-color: rgba(150,70,70,0.12);
            --highlight-bg: linear-gradient(90deg, rgba(200,170,30,0.4), rgba(180,150,20,0.3));
            --highlight-chip: linear-gradient(180deg, rgba(180,160,40,0.25), rgba(160,140,30,0.15));
            --highlight-btn: linear-gradient(180deg, rgba(200,175,40,0.45), rgba(180,155,30,0.3));
            --done-btn: linear-gradient(180deg, rgba(60,160,80,0.3), rgba(50,140,70,0.2));
            --chip-border: rgba(80,80,85,0.5);
            --chip-active-border: #b8960a;
            --chip-text: #8a8580;
            --chip-active-text: #d4c060;
            --done-text: #60c878;
            --highlight-text: #d4c060;
            --warn-border: rgba(160,130,30,0.35);
            --warn-text: #d4c060;
            --link-color: #5a9af0;
            --shadow: rgba(0,0,0,0.2);
          }

          body {
            margin: 0;
            padding: 0;
            min-height: 100dvh;
            font-family: 'Nunito', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            -webkit-font-smoothing: antialiased;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}} />
      </head>
      <body>
        {/* Notebook lines */}
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
                var(--line-color) 31px,
                var(--line-color) 32px
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
            backgroundColor: 'var(--margin-color)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
