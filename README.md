# 📝 Recordatorios

A mobile-first PWA reminder app for students who forget homework, meetings, and plans.

Built with a school-notebook aesthetic — clean, fast, minimal.

## Tech Stack

- **Next.js 14** + React + TypeScript
- **PWA**: Service Worker, Web Push Notifications, installable
- **Storage**: LocalStorage (Supabase-ready abstraction in `src/lib/storage.ts`)
- **Fonts**: Patrick Hand (handwriting), Nunito (UI)

## Features

- Quick reminder creation with one tap
- Configurable start delay (10 min, 30 min, 1 hour, or custom time)
- Repeating notifications every 5/10/15 minutes until marked done
- Persistent push notifications via Service Worker
- Works offline
- Installable on mobile home screen

---

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

> **Note**: Push notifications require HTTPS in production. In dev, they work on `localhost`.
> To test notifications, your browser must grant permission when prompted.

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B: GitHub Integration

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click **Deploy** — no config needed

Vercel auto-detects Next.js. The app will be live with HTTPS (required for PWA/notifications).

---

## Project Structure

```
recordatorios/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker (notifications + cache)
│   ├── icon-192.png           # App icon
│   └── icon-512.png           # App icon (large)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout, fonts, notebook background
│   │   └── page.tsx           # Main page (client component)
│   ├── components/
│   │   ├── ReminderCard.tsx   # Individual reminder card
│   │   └── NewReminderForm.tsx # Create reminder form
│   ├── hooks/
│   │   └── useReminders.ts   # State management hook
│   └── lib/
│       ├── storage.ts         # Storage abstraction (swap for Supabase)
│       └── notifications.ts   # Notification scheduling helpers
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Adding Supabase Later

The storage layer is abstracted in `src/lib/storage.ts`. To migrate:

1. Install `@supabase/supabase-js`
2. Create a `reminders` table in Supabase
3. Replace the `read()` and `write()` functions with Supabase queries
4. The rest of the app stays unchanged

---

## License

MIT
