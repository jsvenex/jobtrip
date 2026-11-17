import { useEffect, useState, type FormEvent } from 'react';
import {
  JOB_TYPES, PRIORITIES, SOURCES, STATUSES, STATUS_LABEL,
  type Job, type Status,
} from '../types';
import type { JobDraft } from '../useJobs';
import { todayISO } from '../utils';
import StatusStepper from './StatusStepper';
import StageDetails from './StageDetails';
import Timeline from './Timeline';
import { MoneyInput } from './fields';

interface Props {
  job: Job | null; // null → creating
  initialStatus: Status;
  onSave: (draft: JobDraft) => void;
  onDelete?: (job: Job) => void;
  onClose: () => void;
  onOpenCalculator: (gross: number | undefined, label: string) => void;
}

type Tab = 'overview' | 'stage' | 'timeline';

export default function JobModal({ job, initialStatus, onSave, onDelete, onClose, onOpenCalculator }: Props) {
  const [form, setForm] = useState<JobDraft>(
    job ?? {
      company: '', role: '', location: '', source: 'LinkedIn',
      type: 'Full-time', priority: 'medium', status: initialStatus,
      dateApplied: initialStatus === 'wishlist' ? '' : todayISO(), url: '', notes: '',
    },
  );
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = <K extends keyof JobDraft>(k: K, v: JobDraft[K]) => setForm((f) => ({ ...f, [k]: v }));

  const setStatus = (status: Status) => {
    setForm((f) => ({ ...f, status, dateApplied: f.dateApplied || (status === 'wishlist' ? '' : todayISO()) }));
    setTab(status === 'interview' || status === 'offer' ? 'stage' : 'overview');
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ ...form, company: form.company.trim(), role: form.role.trim(), url: form.url.trim() });
    onClose();
  };

  const salaryInvalid = !!form.salaryMin && !!form.salaryMax && form.salaryMin > form.salaryMax;
  const hasLink = /^https?:\/\//i.test(form.url.trim());
  const hasStage = form.status === 'interview' || form.status === 'offer';
  const tabs: [Tab, string][] = [
    ['overview', 'Overview'],
    ...(hasStage ? ([['stage', `${STATUS_LABEL[form.status]} details`]] as [Tab, string][]) : []),
    ...(job ? ([['timeline', 'Timeline']] as [Tab, string][]) : []),
  ];

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-label={job ? `Edit ${job.role}` : 'Create application'}>
        <header className="modal-head">
          <h2>{job ? job.role : 'Create application'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="modal-body">
          <div className="stepper-row">
            <StatusStepper status={form.status} onSelect={setStatus} />
            <select value={form.status} onChange={(e) => setStatus(e.target.value as Status)} aria-label="Status">
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>

          <div className="tabs" role="tablist">
            {tabs.map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <>
              <div className="grid">
                <label>Role *
                  <input required autoFocus value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Job title" />
                </label>
                <label>Company *
                  <input required value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Company name" />
                </label>
                <label>Work location
                  <input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="City or area" />
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
                  <MoneyInput value={form.salaryMin} onChange={(v) => set('salaryMin', v)} />
                </label>
                <label>Salary max (RM / month)
                  <MoneyInput value={form.salaryMax} onChange={(v) => set('salaryMax', v)} invalid={salaryInvalid} />
                </label>
                <label>Date applied
                  <input type="date" value={form.dateApplied} onChange={(e) => set('dateApplied', e.target.value)} />
                </label>
                <label>Job posting link
                  <input type="url" className="link-input" value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="Paste the link here" />
                  {hasLink && (
                    <a className="link-preview" href={form.url.trim()} target="_blank" rel="noreferrer" title={form.url}>
                      Open link ↗
                    </a>
                  )}
                </label>
              </div>
              {salaryInvalid && <p className="error">Minimum salary can't be higher than maximum.</p>}

              <label>Notes
                <textarea rows={4} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Anything you want to remember" />
              </label>
            </>
          )}

          {tab === 'stage' && hasStage && (
            <StageDetails
              form={form}
              set={set}
              onOpenCalculator={(gross, label) => {
                onClose();
                onOpenCalculator(gross, label);
              }}
            />
          )}

          {tab === 'timeline' && <Timeline history={form.history} onChange={(h) => set('history', h)} />}
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
