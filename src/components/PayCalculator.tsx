import { useState } from 'react';
import { estimatePay, type PayResult } from '../payroll';
import { formatRM } from '../utils';
import { MoneyInput } from './fields';

export interface Scenario {
  id: string;
  label: string;
  gross?: number;
  epfRate: number;
}

export const newScenario = (label: string, gross?: number): Scenario => ({ id: crypto.randomUUID(), label, gross, epfRate: 0.11 });

export default function PayCalculator({ initial }: { initial: Scenario[] }) {
  const [items, setItems] = useState<Scenario[]>(initial.length ? initial : [newScenario('Offer 1')]);
  const update = (id: string, patch: Partial<Scenario>) => setItems((l) => l.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const results = items.map((s) => (s.gross ? estimatePay(s.gross, s.epfRate) : null));
  const best = Math.max(0, ...results.map((r) => r?.net ?? 0));

  return (
    <div className="pay">
      <p className="subtitle">
        Compare what you'd actually receive each month after EPF, SOCSO, EIS and income tax (PCB).
      </p>

      <div className="pay-grid">
        {items.map((s, i) => {
          const r = results[i];
          return (
            <section key={s.id} className={`panel pay-card${r && r.net === best && items.length > 1 ? ' best' : ''}`}>
              <div className="pay-card-head">
                <input value={s.label} onChange={(e) => update(s.id, { label: e.target.value })} aria-label="Offer name" className="pay-name" />
                <button type="button" className="icon-btn" aria-label={`Remove ${s.label}`} onClick={() => setItems((l) => l.filter((x) => x.id !== s.id))}>✕</button>
              </div>
              {r && r.net === best && items.length > 1 && <span className="best-tag">Highest take-home</span>}

              <label>Gross salary (RM / month)
                <MoneyInput value={s.gross} onChange={(v) => update(s.id, { gross: v })} />
              </label>
              <label>Your EPF contribution
                <select value={s.epfRate} onChange={(e) => update(s.id, { epfRate: Number(e.target.value) })}>
                  <option value={0.11}>11% (standard)</option>
                  <option value={0.09}>9% (reduced)</option>
                </select>
              </label>

              {r ? <Breakdown r={r} /> : <p className="muted">Enter a salary to see the breakdown.</p>}
            </section>
          );
        })}

        {items.length < 4 && (
          <button type="button" className="panel add-card" onClick={() => setItems((l) => [...l, newScenario(`Offer ${l.length + 1}`)])}>
            + Compare another offer
          </button>
        )}
      </div>

      <details className="disclaimer">
        <summary>How is this calculated?</summary>
        <p>
        Estimates only, for comparing offers. Assumes a Malaysian citizen or PR under 60, tax resident, single with no dependants, no other income
        or tax reliefs. Uses EPF 11%/9% (employer 13% up to RM5,000, otherwise 12%), SOCSO 0.5% and EIS 0.2% on wages up to RM6,000, and YA2025
        resident tax rates with the RM9,000 personal relief, EPF relief up to RM4,000, SOCSO/EIS relief up to RM350 and the RM400 rebate. Real payslips
        use official contribution tables and PCB schedules and may differ slightly. Check with LHDN, KWSP and PERKESO for exact figures.
        </p>
      </details>
    </div>
  );
}

function Breakdown({ r }: { r: PayResult }) {
  return (
    <>
      <table className="mini pay-table">
        <tbody>
          <tr><td>Gross salary</td><td>{formatRM(r.gross)}</td></tr>
          <tr className="minus"><td>EPF (employee)</td><td>− {formatRM(r.epf)}</td></tr>
          <tr className="minus"><td>SOCSO</td><td>− {formatRM(r.socso)}</td></tr>
          <tr className="minus"><td>EIS</td><td>− {formatRM(r.eis)}</td></tr>
          <tr className="minus"><td>Income tax (PCB)</td><td>− {formatRM(r.pcb)}</td></tr>
        </tbody>
      </table>
      <div className="net">
        <span>Take-home pay</span>
        <strong>{formatRM(r.net)}</strong>
      </div>
      <details className="employer">
        <summary>What your employer also pays</summary>
        <table className="mini">
          <tbody>
            <tr><td>EPF</td><td>{formatRM(r.employerEpf)}</td></tr>
            <tr><td>SOCSO</td><td>{formatRM(r.employerSocso)}</td></tr>
            <tr><td>EIS</td><td>{formatRM(r.employerEis)}</td></tr>
          </tbody>
        </table>
        <p className="muted">Your EPF savings per month in total: {formatRM(r.epf + r.employerEpf)}</p>
      </details>
    </>
  );
}
