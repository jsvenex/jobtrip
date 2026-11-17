import { useState } from 'react';
import { STATUS_LABEL, type HistoryEntry } from '../types';
import { formatDate, todayISO } from '../utils';

export default function Timeline({ history = [], onChange }: { history?: HistoryEntry[]; onChange: (h: HistoryEntry[]) => void }) {
  const [text, setText] = useState('');
  const addNote = () => {
    const t = text.trim();
    if (!t) return;
    onChange([...history, { id: crypto.randomUUID(), date: todayISO(), kind: 'note', text: t }]);
    setText('');
  };
  const entries = [...history].reverse();

  return (
    <div className="stage">
      <div className="checklist-add">
        <input
          value={text}
          placeholder="Add an update, e.g. called HR, sent thank-you email"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addNote();
            }
          }}
        />
        <button type="button" className="btn" onClick={addNote}>Add</button>
      </div>

      {entries.length === 0 ? (
        <p className="muted">History starts once you save this application.</p>
      ) : (
        <ol className="timeline">
          {entries.map((e) => (
            <li key={e.id} className={e.kind === 'status' ? `tl-status tl-${e.status}` : 'tl-note'}>
              <div className="tl-text">
                {e.kind === 'status' ? <>Moved to <strong>{STATUS_LABEL[e.status!]}</strong></> : e.text}
              </div>
              <div className="muted">{formatDate(e.date)}</div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
