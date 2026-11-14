import { useState } from 'react';
import { STATUSES, STATUS_LABEL, type Job, type Status } from '../types';
import { formatSalary } from '../utils';
import { PriorityIcon } from './Badges';

interface Props {
  jobs: Job[];
  onMove: (id: string, status: Status) => void;
  onOpen: (job: Job) => void;
  onCreate: (status: Status) => void;
}

export default function BoardView({ jobs, onMove, onOpen, onCreate }: Props) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);

  return (
    <div className="board">
      {STATUSES.map((status) => {
        const col = jobs.filter((j) => j.status === status);
        return (
          <section
            key={status}
            className={`column col-${status}${overCol === status ? ' drop-target' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(status);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverCol(null);
            }}
            onDrop={() => {
              if (dragId) onMove(dragId, status);
              setDragId(null);
              setOverCol(null);
            }}
          >
            <header className="column-head">
              <h2>
                {STATUS_LABEL[status]} <span className="count">{col.length}</span>
              </h2>
            </header>

            <div className="column-body">
              {col.map((job) => (
                <article
                  key={job.id}
                  className={`card${dragId === job.id ? ' dragging' : ''}`}
                  draggable
                  tabIndex={0}
                  onDragStart={() => setDragId(job.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverCol(null);
                  }}
                  onClick={() => onOpen(job)}
                  onKeyDown={(e) => e.key === 'Enter' && onOpen(job)}
                >
                  <h3 className="card-title">{job.role}</h3>
                  <p className="card-company">{job.company}</p>
                  <div className="card-meta">
                    <span>📍 {job.location}</span>
                    <span>{formatSalary(job)}</span>
                  </div>
                  <footer className="card-foot">
                    <span className="issue-key">{job.key}</span>
                    <span className="chip">{job.type}</span>
                    <PriorityIcon priority={job.priority} />
                  </footer>
                </article>
              ))}
              {col.length === 0 && <p className="empty">Drop a card here</p>}
            </div>

            <button className="create-btn" onClick={() => onCreate(status)}>
              + Create
            </button>
          </section>
        );
      })}
    </div>
  );
}
