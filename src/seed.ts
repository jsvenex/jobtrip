import type { HistoryEntry, Job, Status } from './types';
import { todayISO } from './utils';

const offset = (days: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + days);
  return todayISO(dt);
};
const ago = (n: number) => offset(-n);
const ahead = (n: number) => offset(n);

let n = 0;
const h = (status: Status, daysAgo: number): HistoryEntry => ({ id: `h${++n}`, date: ago(daysAgo), kind: 'status', status });
const item = (text: string, done = false) => ({ id: `c${++n}`, text, done });

/** Sample data so the app looks alive on first load. Companies are illustrative. */
export const SEED_JOBS: Job[] = [
  {
    id: 's1', company: 'Petronas Digital', role: 'Graduate Software Engineer', location: 'Kuala Lumpur', source: 'Company Website',
    type: 'Graduate Programme', priority: 'high', status: 'interview', salaryMin: 4500, salaryMax: 5500, dateApplied: ago(14), url: '',
    notes: 'Revise data structures and REST basics.',
    history: [h('wishlist', 18), h('applied', 14), h('interview', 6)],
    interviews: [
      { id: 'i1', round: 'HR screening', date: ago(6), time: '10:00', mode: 'Online', where: 'Google Meet', interviewer: 'HR team', done: true },
      { id: 'i2', round: 'Technical interview', date: ahead(3), time: '14:30', mode: 'On-site', where: 'Petronas Twin Towers, KL', interviewer: 'Engineering lead', done: false },
    ],
    prep: [item('Research the company', true), item('Review the job description', true), item('Practice coding questions'), item('Prepare questions to ask them')],
  },
  {
    id: 's2', company: 'Grab', role: 'Junior Frontend Developer', location: 'Petaling Jaya', source: 'LinkedIn',
    type: 'Full-time', priority: 'high', status: 'applied', salaryMin: 5000, salaryMax: 6500, dateApplied: ago(5), url: '', notes: '',
    history: [h('wishlist', 9), h('applied', 5)],
  },
  {
    id: 's3', company: 'Shopee', role: 'Software Engineer (Fresh Grad)', location: 'Kuala Lumpur', source: 'JobStreet',
    type: 'Full-time', priority: 'medium', status: 'applied', salaryMin: 4800, salaryMax: 6000, dateApplied: ago(8), url: '', notes: '',
    history: [h('applied', 8)],
  },
  {
    id: 's4', company: 'Maybank', role: 'Technology Associate Programme', location: 'Kuala Lumpur', source: 'Career Fair',
    type: 'Graduate Programme', priority: 'medium', status: 'offer', salaryMin: 4200, salaryMax: 4200, dateApplied: ago(30), url: '',
    notes: 'Offer letter received by email.',
    history: [h('applied', 30), h('interview', 18), h('offer', 5)],
    interviews: [{ id: 'i3', round: 'Final interview', date: ago(12), time: '09:30', mode: 'On-site', where: 'Head office', interviewer: 'Panel', done: true }],
    decision: 'Pending', offerDeadline: ahead(4), offerSalary: 4200, allowance: 300, startDate: ahead(35), probation: '6 months',
    benefits: 'Medical, 18 days annual leave, yearly bonus',
  },
  {
    id: 's5', company: 'Carsome', role: 'Full-Stack Developer (Junior)', location: 'Petaling Jaya', source: 'Hiredly',
    type: 'Full-time', priority: 'medium', status: 'wishlist', salaryMin: 4000, salaryMax: 5500, dateApplied: '', url: '', notes: '',
    history: [h('wishlist', 2)],
  },
  {
    id: 's6', company: 'Intel Malaysia', role: 'Software Intern', location: 'Penang', source: 'MyFutureJobs',
    type: 'Internship', priority: 'low', status: 'rejected', salaryMin: 1500, salaryMax: 1500, dateApplied: ago(25), url: '', notes: '',
    history: [h('applied', 25), h('rejected', 10)],
  },
  {
    id: 's7', company: "Touch 'n Go Digital", role: 'Frontend Engineer (Entry Level)', location: 'Kuala Lumpur', source: 'LinkedIn',
    type: 'Full-time', priority: 'high', status: 'wishlist', salaryMin: 4500, salaryMax: 6000, dateApplied: '', url: '', notes: '',
    history: [h('wishlist', 1)],
  },
];
