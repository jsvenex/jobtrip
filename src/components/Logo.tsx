/** JobTrip mark: a winding route from a start point to a destination. */
export default function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="jobtrip-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b6cf6" />
          <stop offset="1" stopColor="#7c5cf0" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#jobtrip-logo)" />
      <path d="M8.5 23c3.5 0 3-7.5 7.5-7.5s3.5-6.5 7.5-6.5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="8.5" cy="23" r="2" fill="#fff" />
      <circle cx="23.5" cy="9" r="3" fill="#fff" />
    </svg>
  );
}
