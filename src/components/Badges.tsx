import { STATUS_LABEL, type Priority, type Status } from '../types';

export function StatusLozenge({ status }: { status: Status }) {
  return <span className={`lozenge lozenge-${status}`}>{STATUS_LABEL[status]}</span>;
}

export function PriorityIcon({ priority }: { priority: Priority }) {
  return (
    <span className={`priority priority-${priority}`} title={`${priority} priority`}>
      {priority[0].toUpperCase() + priority.slice(1)}
    </span>
  );
}

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const hue = [...name].reduce((h, c) => h + c.charCodeAt(0), 0) % 360;
  return (
    <span className="avatar" style={{ background: `hsl(${hue} 55% 42%)` }} aria-hidden>
      {initials}
    </span>
  );
}
