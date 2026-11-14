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
  'Company Website',
  'Career Fair',
  'Referral',
  'Other',
] as const;

export const LOCATIONS = [
  'Kuala Lumpur',
  'Petaling Jaya',
  'Cyberjaya',
  'Shah Alam',
  'Penang',
  'Johor Bahru',
  'Melaka',
  'Remote',
  'Other',
] as const;

export interface Job {
  id: string;
  key: string; // Jira-style issue key, e.g. JT-12
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
}
