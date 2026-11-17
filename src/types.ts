export const STATUSES = ['wishlist', 'applied', 'interview', 'offer', 'rejected'] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

/** The three steps shown in the progress stepper. */
export const PIPELINE: Status[] = ['applied', 'interview', 'offer'];

export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const JOB_TYPES = ['Graduate Programme', 'Full-time', 'Part-time', 'Internship', 'Contract'] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const SOURCES = [
  'JobStreet',
  'LinkedIn',
  'Hiredly',
  'MyFutureJobs',
  'Maukerja',
  'Indeed',
  'Glassdoor',
  'Company Website',
  'Career Fair',
  'Referral',
  'Other',
] as const;

export interface Job {
  id: string;
  company: string;
  role: string;
  location: string;
  source: string;
  type: JobType;
  priority: Priority;
  status: Status;
  salaryMin?: number; // MYR / month
  salaryMax?: number;
  dateApplied: string; // yyyy-mm-dd or ''
  url: string;
  notes: string;

  /** Timeline of status changes and manual updates. */
  history?: HistoryEntry[];

  // Interview stage
  interviews?: Interview[];
  prep?: ChecklistItem[];
  // Offer stage
  decision?: Decision;
  offerDeadline?: string;
  offerSalary?: number; // MYR / month
  allowance?: number; // MYR / month
  startDate?: string;
  probation?: string;
  benefits?: string;
}

export interface HistoryEntry {
  id: string;
  date: string; // yyyy-mm-dd
  kind: 'status' | 'note';
  status?: Status;
  text?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export const INTERVIEW_ROUNDS = [
  'HR screening',
  'Online assessment',
  'Technical interview',
  'Panel interview',
  'Final interview',
  'Other',
] as const;
export const INTERVIEW_MODES = ['Online', 'On-site', 'Phone'] as const;

export interface Interview {
  id: string;
  round: string;
  date: string;
  time: string; // HH:MM
  mode: string;
  where: string; // meeting link or address
  interviewer: string;
  done: boolean;
}

export const DECISIONS = ['Pending', 'Negotiating', 'Accepted', 'Declined'] as const;
export type Decision = (typeof DECISIONS)[number];
