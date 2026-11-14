import { useCallback, useEffect, useState } from 'react';
import type { Job, Status } from './types';
import { SEED_JOBS } from './seed';

const STORAGE_KEY = 'jobtrip:jobs:v1';
const today = () => new Date().toISOString().slice(0, 10);

function load(): Job[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Job[];
  } catch {
    /* ignore corrupt storage */
  }
  return SEED_JOBS;
}

export type JobDraft = Omit<Job, 'id' | 'key'> & { id?: string };

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
      if (draft.id) return prev.map((j) => (j.id === draft.id ? { ...j, ...draft, id: j.id } : j));
      const next = prev.reduce((m, j) => Math.max(m, Number(j.key.split('-')[1]) || 0), 0) + 1;
      return [{ ...draft, id: crypto.randomUUID(), key: `JT-${next}` }, ...prev];
    });
  }, []);

  const move = useCallback((id: string, status: Status) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status, dateApplied: j.dateApplied || (status === 'wishlist' ? '' : today()) }
          : j,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => setJobs((prev) => prev.filter((j) => j.id !== id)), []);
  const reset = useCallback(() => setJobs(SEED_JOBS), []);

  return { jobs, save, move, remove, reset };
}
