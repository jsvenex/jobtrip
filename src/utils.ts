import type { Job } from './types';

export function formatSalary(j: Pick<Job, 'salaryMin' | 'salaryMax'>): string {
  const { salaryMin: a, salaryMax: b } = j;
  const f = (n: number) => n.toLocaleString('en-MY');
  if (!a && !b) return '—';
  if (a && b && a !== b) return `RM ${f(a)} – ${f(b)}`;
  return `RM ${f((a || b) as number)}`;
}

export function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function daysSince(iso: string): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso + 'T00:00:00').getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
