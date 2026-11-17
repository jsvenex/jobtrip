import { useCallback, useEffect, useState } from 'react';
import type { HistoryEntry, Job, Status } from './types';
import { SEED_JOBS } from './seed';
import { todayISO } from './utils';

const STORAGE_KEY = 'jobtrip:jobs:v1';

function load(): Job[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Job[];
  } catch {
    /* ignore corrupt storage */
  }
  return SEED_JOBS;
}

export type JobDraft = Omit<Job, 'id'> & { id?: string };

const statusEntry = (status: Status, date = todayISO()): HistoryEntry => ({
  id: crypto.randomUUID(),
  date,
  kind: 'status',
  status,
});

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch {
      /* storage full / unavailable */
    }
  }, [jobs]);

  const save = useCallback((draft: JobDraft) => {
    setJobs((prev) => {
      const old = draft.id ? prev.find((j) => j.id === draft.id) : undefined;
      let history = draft.history ?? old?.history ?? [];
      if (!old) {
        history = [...history, statusEntry(draft.status, draft.status === 'applied' && draft.dateApplied ? draft.dateApplied : undefined)];
      } else if (old.status !== draft.status) {
        history = [...history, statusEntry(draft.status)];
      }
      if (old) return prev.map((j) => (j.id === old.id ? { ...j, ...draft, id: j.id, history } : j));
      return [{ ...draft, id: crypto.randomUUID(), history }, ...prev];
    });
  }, []);

  const move = useCallback((id: string, status: Status) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id && j.status !== status
          ? {
              ...j,
              status,
              dateApplied: j.dateApplied || (status === 'wishlist' ? '' : todayISO()),
              history: [...(j.history ?? []), statusEntry(status)],
            }
          : j,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => setJobs((prev) => prev.filter((j) => j.id !== id)), []);
  const reset = useCallback(() => setJobs(SEED_JOBS), []);

  return { jobs, save, move, remove, reset };
}
