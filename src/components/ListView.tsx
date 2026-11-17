import { useMemo, useState } from 'react';
import { STATUSES, STATUS_LABEL, type Job, type Status } from '../types';
import { describeNext, formatDate, formatSalary, nextStep } from '../utils';
import { Avatar, PriorityIcon } from './Badges';
import StatusStepper from './StatusStepper';

type SortKey = 'company' | 'status' | 'dateApplied' | 'salaryMax';

interface Props {
  jobs: Job[];
  onMove: (id: string, status: Status) => void;
  onOpen: (job: Job) => void;
  onDelete: (job: Job) => void;
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'company', label: 'Role / Company' },
  { key: 'status', label: 'Status' },
  { key: 'dateApplied', label: 'Applied' },
  { key: 'salaryMax', label: 'Salary / month' },
];

export default function ListView({ jobs, onMove, onOpen, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('dateApplied');
  const [asc, setAsc] = useState(false);

  const sorted = useMemo(() => {
    const val = (j: Job) =>
      sortKey === 'status' ? STATUSES.indexOf(j.status)
      : sortKey === 'salaryMax' ? j.salaryMax ?? j.salaryMin ?? 0
      : j[sortKey];
    return [...jobs].sort((a, b) => {
      const x = val(a), y = val(b);
      const r = x < y ? -1 : x > y ? 1 : 0;
      return asc ? r : -r;
    });
  }, [jobs, sortKey, asc]);

  const toggle = (k: SortKey) => {
    if (k === sortKey) setAsc(!asc);
    else {
      setSortKey(k);
      setAsc(true);
    }
  };

  if (jobs.length === 0) return <p className="empty-state">No applications match your filters.</p>;

  return (
    <div className="table-wrap">
      <table className="list">
        <thead>
          <tr>
            {COLUMNS.map((c) => [
              <th key={c.key} onClick={() => toggle(c.key)} aria-sort={sortKey === c.key ? (asc ? 'ascending' : 'descending') : 'none'}>
                {c.label} {sortKey === c.key && (asc ? '↑' : '↓')}
              </th>,
              c.key === 'status' && <th key="progress" className="no-sort">Progress</th>,
              c.key === 'status' && <th key="next" className="no-sort">Next step</th>,
            ])}
            <th className="no-sort">Location / Source</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((j) => (
            <tr key={j.id} onClick={() => onOpen(j)}>
              <td>
                <div className="role-cell">
                  <Avatar name={j.company} />
                  <div>
                    <div className="role">{j.role}</div>
                    <div className="muted">
                      {j.company}
                      {j.url && (
                        <>
                          {' · '}
                          <a className="row-link" href={j.url} target="_blank" rel="noreferrer" title={j.url} onClick={(e) => e.stopPropagation()}>Open ↗</a>
                        </>
                      )}
                    </div>
                  </div>
                  <PriorityIcon priority={j.priority} />
                </div>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <select
                  className={`status-select lozenge-${j.status}`}
                  value={j.status}
                  aria-label={`Status for ${j.role}`}
                  onChange={(e) => onMove(j.id, e.target.value as Status)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </td>
              <td className="progress-cell">
                {j.status === 'wishlist' ? <span className="muted">Not applied yet</span> : <StatusStepper status={j.status} compact />}
              </td>
              <td>
                {(() => {
                  const step = nextStep(j);
                  return step ? <span className={`next-chip${step.overdue ? ' overdue' : step.days <= 2 ? ' soon' : ''}`}>{describeNext(step)}</span> : <span className="muted">—</span>;
                })()}
              </td>
              <td>{formatDate(j.dateApplied)}</td>
              <td>{formatSalary(j)}</td>
              <td>
                <div>{j.location || '—'}</div>
                <div className="muted">{j.source}</div>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <button className="row-delete" aria-label={`Delete ${j.role}`} onClick={() => onDelete(j)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
