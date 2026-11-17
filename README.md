# JobTrip

A job application tracker for fresh graduates in Malaysia, with a **Jira-style Board** (drag & drop) and a sortable **List** view.

## Features
- Board view with 5 columns: Wishlist → Applied → Interview → Offer → Rejected (drag cards between columns)
- List view with sortable columns and inline status change
- Applied → Interview → Offer progress stepper (click a step in the editor to change stage)
- Jira-style status labels, priority tags and an "+ Add job" button per column
- Malaysia-focused: salary in RM/month, local job portals (JobStreet, Hiredly, MyFutureJobs, Maukerja…), free-text work location, graduate programmes
- Salary inputs format as you type (4000 → 4,000); long job links are shown shortened but stored in full
- Search + one-click filter panel and summary stats
- Stage-specific pages for each status: apply-by date and checklist (Wishlist), HR contact and reply (Applied), interview rounds with Google Calendar / .ics export and prep checklist (Interview), offer details and reply deadline (Offer), feedback notes (Rejected)
- Timeline of every status change plus your own updates
- Insights page: funnel, applications per week, which source works best, average days to first reply, and what is coming up
- Take-home pay calculator for Malaysia (EPF, SOCSO, EIS, PCB estimates) with side-by-side offer comparison
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
