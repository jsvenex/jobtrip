import { useEffect, useMemo, useRef, useState } from 'react';
import BoardView from './components/BoardView';
import ListView from './components/ListView';
import JobModal from './components/JobModal';
import { JOB_TYPES, PRIORITIES, STATUSES, STATUS_LABEL, type Job, type Status } from './types';
import { useJobs } from './useJobs';

type View = 'board' | 'list';
type ModalState = { job: Job | null; status: Status } | null;
type Filters = { status: string; priority: string; type: string; location: string; source: string };
const NO_FILTERS: Filters = { status: 'all', priority: 'all', type: 'all', location: 'all', source: 'all' };

const readView = (): View => {
  try {
    return localStorage.getItem('jobtrip:view') === 'list' ? 'list' : 'board';
  } catch {
    return 'board';
  }
};

export default function App() {
  const { jobs, save, move, remove, reset } = useJobs();
  const [view, setView] = useState<View>(readView);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [modal, setModal] = useState<ModalState>(null);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showFilters) return;
    const close = (e: MouseEvent) => {
      if (!filterRef.current?.contains(e.target as Node)) setShowFilters(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showFilters]);
  const setFilter =(k: keyof Filters, v: string) => setFilters((f) => ({ ...f, [k]: v }));
  const activeFilters = Object.values(filters).filter((v) => v !== 'all').length;

  const changeView = (v: View) => {
    setView(v);
    try {
      localStorage.setItem('jobtrip:view', v);
    } catch {
      /* ignore */
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter(
      (j) =>
        (filters.status === 'all' || j.status === filters.status) &&
        (filters.priority === 'all' || j.priority === filters.priority) &&
        (filters.type === 'all' || j.type === filters.type) &&
        (filters.location === 'all' || j.location === filters.location) &&
        (filters.source === 'all' || j.source === filters.source) &&
        (!q || [j.company, j.role, j.key, j.location, j.source].some((f) => f.toLowerCase().includes(q))),
    );
  }, [jobs, query, filters]);

  const options = useMemo(
    () => ({
      location: [...new Set(jobs.map((j) => j.location))].sort(),
      source: [...new Set(jobs.map((j) => j.source))].sort(),
    }),
    [jobs],
  );

  const stats = useMemo(() => {
    const applied = jobs.filter((j) => j.status !== 'wishlist').length;
    return {
      total: jobs.length,
      applied,
      interviews: jobs.filter((j) => j.status === 'interview').length,
      offers: jobs.filter((j) => j.status === 'offer').length,
    };
  }, [jobs]);

  const confirmDelete = (j: Job) => {
    if (confirm(`Delete ${j.key} – ${j.role} at ${j.company}?`)) remove(j.id);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">🧭</span> JobTrip
        </div>
        <button className="btn primary" onClick={() => setModal({ job: null, status: 'applied' })}>
          + Create
        </button>
      </header>

      <main className="page">
        <p className="crumbs">Projects / My Job Hunt 2026</p>
        <h1>Applications</h1>
        <p className="subtitle">Track every application from first click to offer letter.</p>

        <section className="stats" aria-label="Summary">
          <Stat label="Total jobs" value={stats.total} tone="slate" />
          <Stat label="Applied" value={stats.applied} tone="blue" />
          <Stat label="Interviews" value={stats.interviews} tone="purple" />
          <Stat label="Offers" value={stats.offers} tone="green" />
        </section>

        <div className="toolbar">
          <input
            className="search"
            type="search"
            placeholder="Search company, role, key…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search applications"
          />
          <div className="filter-wrap" ref={filterRef}>
            <button
              className={`btn filter-btn${activeFilters ? ' active' : ''}`}
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
            >
              Filters{activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}
            </button>
            {showFilters && (
              <div className="filter-panel" role="dialog" aria-label="Filters">
                <FilterSelect label="Status" value={filters.status} onChange={(v) => setFilter('status', v)}
                  options={STATUSES.map((s) => [s, STATUS_LABEL[s]])} />
                <FilterSelect label="Priority" value={filters.priority} onChange={(v) => setFilter('priority', v)}
                  options={PRIORITIES.map((p) => [p, p[0].toUpperCase() + p.slice(1)])} />
                <FilterSelect label="Job type" value={filters.type} onChange={(v) => setFilter('type', v)}
                  options={JOB_TYPES.map((t) => [t, t])} />
                <FilterSelect label="Location" value={filters.location} onChange={(v) => setFilter('location', v)}
                  options={options.location.map((l) => [l, l])} />
                <FilterSelect label="Source" value={filters.source} onChange={(v) => setFilter('source', v)}
                  options={options.source.map((s) => [s, s])} />
                <div className="filter-actions">
                  <button className="link" onClick={() => setFilters(NO_FILTERS)} disabled={!activeFilters}>Clear all</button>
                  <button className="btn primary" onClick={() => setShowFilters(false)}>Done</button>
                </div>
              </div>
            )}
          </div>
          <span className="spacer" />
          <div className="toggle" role="tablist" aria-label="View">
            <button role="tab" aria-selected={view === 'board'} className={view === 'board' ? 'active' : ''} onClick={() => changeView('board')}>
              ▦ Board
            </button>
            <button role="tab" aria-selected={view === 'list'} className={view === 'list' ? 'active' : ''} onClick={() => changeView('list')}>
              ☰ List
            </button>
          </div>
        </div>

        {view === 'board' ? (
          <BoardView
            jobs={filtered}
            onMove={move}
            onOpen={(job) => setModal({ job, status: job.status })}
            onCreate={(status) => setModal({ job: null, status })}
          />
        ) : (
          <ListView jobs={filtered} onMove={move} onOpen={(job) => setModal({ job, status: job.status })} onDelete={confirmDelete} />
        )}

        <footer className="page-foot">
          Data is saved in your browser only.{' '}
          <button className="link" onClick={() => confirm('Replace everything with sample data?') && reset()}>
            Reset sample data
          </button>
        </footer>
      </main>

      {modal && (
        <JobModal
          key={modal.job?.id ?? 'new'}
          job={modal.job}
          initialStatus={modal.status}
          onSave={save}
          onDelete={confirmDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return (
    <div className={`stat tone-${tone}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[][];
}) {
  return (
    <label>
      {label}
      <select className={value !== 'all' ? 'filter active' : 'filter'} value={value}
        onChange={(e) => onChange(e.target.value)}>
        <option value="all">All</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}
