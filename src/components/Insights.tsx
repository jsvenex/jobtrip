import { useMemo } from 'react';
import type { Job } from '../types';
import { reached } from '../utils';

const weekStart = (d: Date) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // Monday
  return x;
};

export default function Insights({ jobs }: { jobs: Job[] }) {
  const data = useMemo(() => {
    const applied = jobs.filter((j) => j.status !== 'wishlist');
    const interviews = jobs.filter((j) => reached(j, 'interview'));
    const offers = jobs.filter((j) => reached(j, 'offer'));

    const funnel = [
      { label: 'Saved', n: jobs.length },
      { label: 'Applied', n: applied.length },
      { label: 'Interview', n: interviews.length },
      { label: 'Offer', n: offers.length },
    ];

    // Applications per week, last 8 weeks.
    const thisWeek = weekStart(new Date());
    const weeks = Array.from({ length: 8 }, (_, i) => {
      const start = new Date(thisWeek);
      start.setDate(start.getDate() - (7 - i) * 7);
      return { start, n: 0 };
    });
    for (const j of applied) {
      if (!j.dateApplied) continue;
      const w = weekStart(new Date(j.dateApplied + 'T00:00:00')).getTime();
      const slot = weeks.find((x) => x.start.getTime() === w);
      if (slot) slot.n++;
    }

    // By source.
    const bySource = new Map<string, { applied: number; interviews: number; offers: number }>();
    for (const j of applied) {
      const s = bySource.get(j.source) ?? { applied: 0, interviews: 0, offers: 0 };
      s.applied++;
      if (reached(j, 'interview')) s.interviews++;
      if (reached(j, 'offer')) s.offers++;
      bySource.set(j.source, s);
    }
    const sources = [...bySource.entries()].sort((a, b) => b[1].interviews - a[1].interviews || b[1].applied - a[1].applied);

    return { funnel, weeks, sources };
  }, [jobs]);

  const maxFunnel = Math.max(1, data.funnel[0].n);
  const maxWeek = Math.max(1, ...data.weeks.map((w) => w.n));

  return (
    <div className="insights">
      <div className="insight-grid">
        <section className="panel">
          <h2>Application funnel</h2>
          <div className="funnel">
            {data.funnel.map((f, i) => {
              const prev = i > 0 ? data.funnel[i - 1].n : 0;
              return (
                <div key={f.label} className="funnel-row">
                  <span className="funnel-label">{f.label}</span>
                  <div className="bar-track">
                    <div className={`bar bar-${i}`} style={{ width: `${(f.n / maxFunnel) * 100}%` }} />
                  </div>
                  <span className="funnel-n">
                    {f.n}
                    {i > 0 && prev > 0 && <small> {Math.round((f.n / prev) * 100)}%</small>}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="muted">Percentages show how many moved on from the step above.</p>
        </section>

        <section className="panel">
          <h2>Applications per week</h2>
          <div className="columns" role="img" aria-label="Applications per week, last 8 weeks">
            {data.weeks.map((w) => (
              <div key={w.start.toISOString()} className="col">
                <span className="col-n">{w.n || ''}</span>
                <div className="col-bar" style={{ height: `${(w.n / maxWeek) * 100}%` }} />
                <span className="col-label">{w.start.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Which source works best?</h2>
          {data.sources.length === 0 ? (
            <p className="muted">Apply to a few jobs to see this.</p>
          ) : (
            <table className="mini">
              <thead>
                <tr><th>Source</th><th>Applied</th><th>Interviews</th><th>Offers</th></tr>
              </thead>
              <tbody>
                {data.sources.map(([name, s]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{s.applied}</td>
                    <td>{s.interviews}</td>
                    <td>{s.offers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
