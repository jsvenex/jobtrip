import { DECISIONS, INTERVIEW_MODES, INTERVIEW_ROUNDS, type Decision, type Interview, type Job } from '../types';
import type { JobDraft } from '../useJobs';
import { googleCalendarUrl } from '../calendar';
import { daysBetween, todayISO } from '../utils';
import { Checklist, MoneyInput } from './fields';

interface Props {
  form: JobDraft;
  set: <K extends keyof JobDraft>(k: K, v: JobDraft[K]) => void;
  onOpenCalculator: (gross: number | undefined, label: string) => void;
}

/** Extra details that only matter at the Interview and Offer stages. */
export default function StageDetails({ form, set, onOpenCalculator }: Props) {
  if (form.status === 'interview') return <InterviewStage form={form} set={set} />;
  if (form.status !== 'offer') return null;

  const left = form.offerDeadline ? daysBetween(todayISO(), form.offerDeadline) : null;
  const gross = form.offerSalary ?? form.salaryMax ?? form.salaryMin;
  const open = form.decision !== 'Accepted' && form.decision !== 'Declined';

  return (
    <div className="stage">
      <div className="grid">
        <label>Your decision
          <select value={form.decision ?? 'Pending'} onChange={(e) => set('decision', e.target.value as Decision)}>
            {DECISIONS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label>
          <span className="label-row">
            Reply by
            {left !== null && open && (
              <span className={`hint${left <= 3 ? ' urgent' : ''}`}>
                {left < 0 ? `${-left} days past` : left === 0 ? 'Due today' : `${left} days left`}
              </span>
            )}
          </span>
          <input type="date" value={form.offerDeadline ?? ''} onChange={(e) => set('offerDeadline', e.target.value)} />
        </label>
        <label>Offered salary (RM / month)
          <MoneyInput value={form.offerSalary} onChange={(v) => set('offerSalary', v)} />
        </label>
        <label>Allowances (RM / month)
          <MoneyInput value={form.allowance} onChange={(v) => set('allowance', v)} />
        </label>
        <label>Start date
          <input type="date" value={form.startDate ?? ''} onChange={(e) => set('startDate', e.target.value)} />
        </label>
        <label>Probation period
          <input value={form.probation ?? ''} onChange={(e) => set('probation', e.target.value)} placeholder="Length of probation" />
        </label>
      </div>
      <label>Benefits and other terms
        <textarea rows={3} value={form.benefits ?? ''} onChange={(e) => set('benefits', e.target.value)} placeholder="Medical, leave, bonus, working hours, notice period…" />
      </label>
      <div>
        <button type="button" className="btn" onClick={() => onOpenCalculator(gross, `${form.company || 'This'} offer`)}>
          Estimate take-home pay
        </button>
      </div>
    </div>
  );
}

function InterviewStage({ form, set }: Pick<Props, 'form' | 'set'>) {
  const list = form.interviews ?? [];
  const update = (id: string, patch: Partial<Interview>) => set('interviews', list.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const add = () =>
    set('interviews', [
      ...list,
      { id: crypto.randomUUID(), round: INTERVIEW_ROUNDS[Math.min(list.length, INTERVIEW_ROUNDS.length - 1)], date: '', time: '', mode: 'Online', where: '', interviewer: '', done: false },
    ]);

  return (
    <div className="stage">
      {list.map((iv) => (
        <fieldset key={iv.id} className={`round${iv.done ? ' done' : ''}`}>
          <div className="round-row">
            <select value={iv.round} onChange={(e) => update(iv.id, { round: e.target.value })} aria-label="Interview round" className="r-round">
              {INTERVIEW_ROUNDS.map((r) => <option key={r}>{r}</option>)}
            </select>
            <input type="date" value={iv.date} onChange={(e) => update(iv.id, { date: e.target.value })} aria-label="Interview date" className="r-date" />
            <input type="time" value={iv.time} onChange={(e) => update(iv.id, { time: e.target.value })} aria-label="Interview time" className="r-time" />
            <select value={iv.mode} onChange={(e) => update(iv.id, { mode: e.target.value })} aria-label="Interview mode" className="r-mode">
              {INTERVIEW_MODES.map((m) => <option key={m}>{m}</option>)}
            </select>
            <label className="check">
              <input type="checkbox" checked={iv.done} onChange={(e) => update(iv.id, { done: e.target.checked })} />
              <span>Done</span>
            </label>
            <button type="button" className="icon-btn" aria-label="Remove interview" onClick={() => set('interviews', list.filter((i) => i.id !== iv.id))}>✕</button>
          </div>
          <div className="round-row">
            <input
              value={iv.where}
              onChange={(e) => update(iv.id, { where: e.target.value })}
              aria-label="Meeting link, address or phone"
              placeholder={iv.mode === 'Online' ? 'Meeting link' : iv.mode === 'On-site' ? 'Address' : 'Phone number'}
              className="r-where"
            />
            <input value={iv.interviewer} onChange={(e) => update(iv.id, { interviewer: e.target.value })} aria-label="Interviewer" placeholder="Interviewer" className="r-who" />
            {iv.date && (
              <a className="cal-link" href={googleCalendarUrl(form as Job, iv)} target="_blank" rel="noreferrer">Add to Google Calendar ↗</a>
            )}
          </div>
        </fieldset>
      ))}
      <div>
        <button type="button" className="btn" onClick={add}>+ Add interview round</button>
      </div>

      <Checklist
        title="Interview preparation"
        items={form.prep}
        onChange={(v) => set('prep', v)}
        suggestions={['Research the company', 'Review the job description', 'Practice common questions', 'Prepare questions to ask them', 'Plan your route or test your camera and mic']}
      />
    </div>
  );
}
