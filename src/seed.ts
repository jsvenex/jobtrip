import type { Job } from './types';

const d = (daysAgo: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() - daysAgo);
  return dt.toISOString().slice(0, 10);
};

/** Sample data so the app looks alive on first load. Companies are illustrative. */
export const SEED_JOBS: Job[] = [
  { id: 's1', key: 'JT-1', company: 'Petronas Digital', role: 'Graduate Software Engineer', location: 'Kuala Lumpur', source: 'Company Website', type: 'Graduate Programme', priority: 'high', status: 'interview', salaryMin: 4500, salaryMax: 5500, dateApplied: d(12), url: '', notes: 'Technical interview on Thursday. Revise data structures + REST basics.' },
  { id: 's2', key: 'JT-2', company: 'Grab', role: 'Junior Frontend Developer', location: 'Petaling Jaya', source: 'LinkedIn', type: 'Full-time', priority: 'high', status: 'applied', salaryMin: 5000, salaryMax: 6500, dateApplied: d(5), url: '', notes: 'Tailored CV to React + TypeScript projects.' },
  { id: 's3', key: 'JT-3', company: 'Shopee', role: 'Software Engineer (Fresh Grad)', location: 'Kuala Lumpur', source: 'JobStreet', type: 'Full-time', priority: 'medium', status: 'applied', salaryMin: 4800, salaryMax: 6000, dateApplied: d(8), url: '', notes: '' },
  { id: 's4', key: 'JT-4', company: 'Maybank', role: 'Technology Associate Programme', location: 'Kuala Lumpur', source: 'Career Fair', type: 'Graduate Programme', priority: 'medium', status: 'offer', salaryMin: 4200, salaryMax: 4200, dateApplied: d(30), url: '', notes: 'Offer letter received. Reply by end of month.' },
  { id: 's5', key: 'JT-5', company: 'Carsome', role: 'Full-Stack Developer (Junior)', location: 'Petaling Jaya', source: 'Hiredly', type: 'Full-time', priority: 'medium', status: 'wishlist', salaryMin: 4000, salaryMax: 5500, dateApplied: '', url: '', notes: 'Need to finish portfolio first.' },
  { id: 's6', key: 'JT-6', company: 'Intel Malaysia', role: 'Software Intern', location: 'Penang', source: 'MyFutureJobs', type: 'Internship', priority: 'low', status: 'rejected', salaryMin: 1500, salaryMax: 1500, dateApplied: d(25), url: '', notes: 'Position filled. Ask for feedback.' },
  { id: 's7', key: 'JT-7', company: 'Touch \'n Go Digital', role: 'Frontend Engineer (Entry Level)', location: 'Kuala Lumpur', source: 'LinkedIn', type: 'Full-time', priority: 'high', status: 'wishlist', salaryMin: 4500, salaryMax: 6000, dateApplied: '', url: '', notes: '' },
];
