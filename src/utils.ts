import type { Job } from './types';

export function formatSalary(j: Pick<Job, 'salaryMin' | 'salaryMax'>): string {
  const { salaryMin: a, salaryMax: b } = j;
  const f = (n: number) => n.toLocaleString('en-MY');
  if (!a && !b) return '—';
  if (a && b && a !== b) return `RM ${f(a)} – ${f(b)}`;
  return `RM ${f((a || b) as number)}`;
}

export const formatRM = (n: number) =>
  `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Short label for a long link. Display only; the stored link is untouched. */
export function shortUrl(url: string, max = 32): string {
  const s = url.trim().replace(/^https?:\/\/(www\.)?/i, '').replace(/[?#].*$/, '').replace(/\/$/, '');
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

/** Local yyyy-mm-dd (not UTC, so "today" is right in Malaysia). */
export function todayISO(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const toDate = (iso: string) => new Date(iso + 'T00:00:00');

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  return toDate(iso).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatShortDate(iso: string): string {
  return toDate(iso).toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatTime(t: string): string {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Whole days from a to b (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86_400_000);
}

export interface NextStep {
  label: string;
  date: string;
  time?: string;
  overdue: boolean;
  days: number; // days from today (negative = overdue)
}

/** The next thing that needs attention for a job, based on its current stage. */
export function nextStep(job: Job, today = todayISO()): NextStep | null {
  const make = (label: string, date?: string, time?: string): NextStep | null => {
    if (!date) return null;
    const days = daysBetween(today, date);
    return { label, date, time, overdue: days < 0, days };
  };
  switch (job.status) {
    case 'interview': {
      const open = (job.interviews ?? []).filter((i) => !i.done && i.date).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      return open[0] ? make(open[0].round, open[0].date, open[0].time) : null;
    }
    case 'offer':
      return job.decision === 'Accepted' || job.decision === 'Declined' ? null : make('Reply to offer', job.offerDeadline);
    default:
      return null;
  }
}

export function describeNext(n: NextStep): string {
  const when = n.days === 0 ? 'Today' : n.days === 1 ? 'Tomorrow' : n.overdue ? `${-n.days}d overdue` : formatShortDate(n.date);
  return `${n.label} · ${when}${n.time ? `, ${formatTime(n.time)}` : ''}`;
}

/** Has this job ever reached the given stage (using history, not just current status)? */
export function reached(job: Job, stage: 'interview' | 'offer'): boolean {
  if (job.status === stage || (stage === 'interview' && job.status === 'offer')) return true;
  if ((job.history ?? []).some((h) => h.kind === 'status' && h.status === stage)) return true;
  return stage === 'interview' && (job.interviews?.length ?? 0) > 0;
}
