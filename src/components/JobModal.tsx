import { useEffect, useState, type FormEvent } from 'react';
import {
  JOB_TYPES, LOCATIONS, PRIORITIES, SOURCES, STATUSES, STATUS_LABEL,
  type Job, type Status,
} from '../types';
import type { JobDraft } from '../useJobs';
import StatusStepper from './StatusStepper';

interface Props {
  job: Job | null; // null → creating
  initialStatus: Status;
  onSave: (draft: JobDraft) => void;
  onDelete?: (job: Job) => void;
  onClose: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function JobModal({ job, initialStatus, onSave, onDelete, onClose }: Props) {
  const [form, setForm] = useState<JobDraft>(
    job ?? {
      company: '', role: '', location: 'Kuala Lumpur', source: 'LinkedIn',
      type: 'Full-time', priority: 'medium', status: initialStatus,
      dateApplied: initialStatus === 'wishlist' ? '' : today(), url: '', notes: '',
    },
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = <K extends keyof JobDraft>(k: K, v: JobDraft[K]) => setForm((f) => ({ ...f, [k]: v }));
  const num = (v: string) => (v === '' ? undefined : Math.max(0, Number(v)));

  const setStatus = (status: Status) =>
    setForm((f) => ({ ...f, status, dateApplied: f.dateApplied || (status === 'wishlist' ? '' : today()) }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ ...form, company: form.company.trim(), role: form.role.trim() });
    onClose();
  };

  const salaryInvalid = !!form.salaryMin && !!form.salaryMax && form.salaryMin > form.salaryMax;

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-label={job ? `Edit ${job.key}` : 'Create application'}>
        <header className="modal-head">
          <h2>{job ? <><span className="issue-key">{job.key}</span> {job.role}</> : 'Create application'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="modal-body">
          <div className="stepper-row">
            <StatusStepper status={form.status} onSelect={setStatus} />
            <select value={form.status} onChange={(e) => setStatus(e.target.value as Status)} aria-label="Status">
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>

          <div className="grid">
            <label>Role *
              <input required autoFocus value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Junior Frontend Developer" />
            </label>
            <label>Company *
              <input required value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company Sdn Bhd" />
            </label>
            <label>Location
              <select value={form.location} onChange={(e) => set('location', e.target.value)}>
                {[...new Set([form.location, ...LOCATIONS])].map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label>Source
              <select value={form.source} onChange={(e) => set('source', e.target.value)}>
                {[...new Set([form.source, ...SOURCES])].map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>Job type
              <select value={form.type} onChange={(e) => set('type', e.target.value as Job['type'])}>
                {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>Priority
              <select value={form.priority} onChange={(e) => set('priority', e.target.value as Job['priority'])}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
              </select>
            </label>
            <label>Salary min (RM / month)
              <input type="number" min={0} step={100} value={form.salaryMin ?? ''} onChange={(e) => set('salaryMin', num(e.target.value))} />
            </label>
            <label>Salary max (RM / month)
              <input type="number" min={0} step={100} value={form.salaryMax ?? ''} onChange={(e) => set('salaryMax', num(e.target.value))} aria-invalid={salaryInvalid} />
            </label>
            <label>Date applied
              <input type="date" value={form.dateApplied} onChange={(e) => set('dateApplied', e.target.value)} />
            </label>
            <label>Job posting URL
              <input type="url" value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://…" />
            </label>
          </div>
          {salaryInvalid && <p className="error">Minimum salary can't be higher than maximum.</p>}

          <label>Notes
            <textarea rows={4} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Interview dates, contacts, things to prepare…" />
          </label>
        </div>

        <footer className="modal-foot">
          {job && onDelete && (
            <button type="button" className="btn danger" onClick={() => { onDelete(job); onClose(); }}>Delete</button>
          )}
          <span className="spacer" />
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary" disabled={salaryInvalid}>{job ? 'Save' : 'Create'}</button>
        </footer>
      </form>
    </div>
  );
}
