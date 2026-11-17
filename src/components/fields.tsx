import { useState } from 'react';
import type { ChecklistItem } from '../types';

/** Number input that shows thousands separators while typing (4000 → 4,000). */
export function MoneyInput({
  value,
  onChange,
  invalid,
  placeholder = 'Amount',
}: {
  value?: number;
  onChange: (v?: number) => void;
  invalid?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      inputMode="numeric"
      placeholder={placeholder}
      value={value === undefined ? '' : value.toLocaleString('en-MY')}
      aria-invalid={invalid}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, '');
        onChange(digits === '' ? undefined : Number(digits));
      }}
    />
  );
}

export function Checklist({
  title,
  items = [],
  suggestions,
  onChange,
}: {
  title: string;
  items?: ChecklistItem[];
  suggestions: string[];
  onChange: (items: ChecklistItem[]) => void;
}) {
  const [text, setText] = useState('');
  const add = (t: string) => {
    const v = t.trim();
    if (v) onChange([...items, { id: crypto.randomUUID(), text: v, done: false }]);
  };
  const done = items.filter((i) => i.done).length;

  return (
    <div className="checklist">
      <div className="checklist-head">
        <strong>{title}</strong>
        {items.length > 0 && <span className="muted">{done}/{items.length} done</span>}
      </div>
      {items.length === 0 && (
        <button type="button" className="link" onClick={() => onChange(suggestions.map((s) => ({ id: crypto.randomUUID(), text: s, done: false })))}>
          Add suggested items
        </button>
      )}
      <ul>
        {items.map((it) => (
          <li key={it.id} className={it.done ? 'done' : ''}>
            <label className="check">
              <input type="checkbox" checked={it.done} onChange={() => onChange(items.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)))} />
              <span>{it.text}</span>
            </label>
            <button type="button" className="icon-btn" aria-label={`Remove ${it.text}`} onClick={() => onChange(items.filter((x) => x.id !== it.id))}>✕</button>
          </li>
        ))}
      </ul>
      <div className="checklist-add">
        <input
          value={text}
          placeholder="Add an item"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(text);
              setText('');
            }
          }}
        />
        <button type="button" className="btn" onClick={() => { add(text); setText(''); }}>Add</button>
      </div>
    </div>
  );
}
