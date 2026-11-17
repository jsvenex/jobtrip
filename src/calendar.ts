import type { Interview, Job } from './types';

/** Interview start/end as UTC stamps (Malaysia is UTC+8, no daylight saving). 1 hour long. */
function stamps(iv: Interview): [string, string] {
  const [y, m, d] = iv.date.split('-').map(Number);
  const [hh, mm] = (iv.time || '09:00').split(':').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, hh - 8, mm));
  const end = new Date(start.getTime() + 3_600_000);
  const f = (x: Date) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return [f(start), f(end)];
}

const title = (job: Job, iv: Interview) => `${iv.round} – ${job.company}`;
const details = (job: Job, iv: Interview) =>
  [`Role: ${job.role}`, iv.interviewer && `Interviewer: ${iv.interviewer}`, iv.mode && `Mode: ${iv.mode}`].filter(Boolean).join('\n');

export function googleCalendarUrl(job: Job, iv: Interview): string {
  const [s, e] = stamps(iv);
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: title(job, iv),
    dates: `${s}/${e}`,
    details: details(job, iv),
    location: iv.where,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}
