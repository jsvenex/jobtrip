# 🧭 JobTrip

A job application tracker for fresh graduates in Malaysia, with a **Jira-style Board** (drag & drop) and a sortable **List** view.

## Features
- Board view with 5 columns: Wishlist → Applied → Interview → Offer → Rejected (drag cards between columns)
- List view with sortable columns and inline status change
- Applied → Interview → Offer progress stepper (click a step in the editor to change stage)
- Jira-style issue keys (JT-1, JT-2…), priority icons, lozenges, "+ Create" per column
- Malaysia-focused: salary in RM/month, local job portals (JobStreet, Hiredly, MyFutureJobs, Maukerja…), local cities, graduate programmes
- Search + job-type filter, summary stats and response rate
- Data persisted in `localStorage` (no backend)

## Tech
React 18 · TypeScript · Vite · plain CSS · native HTML5 drag & drop

## Run
```bash
npm install
npm run dev
```

## Ideas for next steps
Backend + auth (Supabase/Firebase), CSV export, interview calendar reminders, dark mode, tests (Vitest + Testing Library).
