import { PIPELINE, STATUS_LABEL, type Status } from '../types';

interface Props {
  status: Status;
  compact?: boolean;
  onSelect?: (s: Status) => void;
}

/** Applied → Interview → Offer progress indicator (from the design reference). */
export default function StatusStepper({ status, compact, onSelect }: Props) {
  const current = PIPELINE.indexOf(status); // -1 for wishlist / rejected
  const rejected = status === 'rejected';

  return (
    <ol className={`stepper${compact ? ' compact' : ''}${rejected ? ' is-rejected' : ''}`} aria-label="Application progress">
      {PIPELINE.map((step, i) => {
        const state = rejected ? 'muted' : i < current ? 'done' : i === current ? 'current' : 'todo';
        const content = (
          <>
            <span className="dot" />
            <span className="label">{STATUS_LABEL[step]}</span>
          </>
        );
        return (
          <li key={step} className={`step ${state}`}>
            {onSelect ? (
              <button type="button" onClick={() => onSelect(step)} aria-current={state === 'current'}>
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
}
