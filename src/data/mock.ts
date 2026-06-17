// Mock data for the dashboard. Shapes match src/types.ts so this module can be
// replaced by API calls later without touching components.
// TODO(future): swap for a typed data client backed by the Express API.

import type {
  ActivityItem,
  Booking,
  Client,
  Invoice,
  Pet,
  RevenuePoint,
} from '@/types';

export const clients: Client[] = [
  { id: 'c1', name: 'Annabelle Fitzgerald', suburb: 'Toorak, VIC', since: '2023-02-11' },
  { id: 'c2', name: 'Hugo Ashworth', suburb: 'Mosman, NSW', since: '2023-06-04' },
  { id: 'c3', name: 'Priya Raghunathan', suburb: 'New Farm, QLD', since: '2024-01-19' },
  { id: 'c4', name: 'Marco De Luca', suburb: 'Cottesloe, WA', since: '2024-09-02' },
];

export const pets: Pet[] = [
  { id: 'p1', clientId: 'c1', name: 'Maximilian', species: 'dog', breed: 'Standard Poodle', careFlags: ['senior', 'arthritis meds'] },
  { id: 'p2', clientId: 'c1', name: 'Coco', species: 'cat', breed: 'Ragdoll', careFlags: ['anxiety'] },
  { id: 'p3', clientId: 'c2', name: 'Biscuit', species: 'dog', breed: 'Cavoodle', careFlags: ['separation anxiety'] },
  { id: 'p4', clientId: 'c3', name: 'Saffron', species: 'dog', breed: 'Whippet', careFlags: ['diabetic', 'insulin 2x daily'] },
  { id: 'p5', clientId: 'c4', name: 'Olive', species: 'cat', breed: 'British Shorthair', careFlags: ['senior'] },
];

// "Now" is pinned so the mock dashboard is deterministic.
export const now = new Date('2026-06-17T09:00:00+10:00');

export const bookings: Booking[] = [
  {
    id: 'b1', clientId: 'c1', petIds: ['p1', 'p2'], service: 'overnight', status: 'in_progress',
    startAt: '2026-06-16T17:00:00+10:00', endAt: '2026-06-20T10:00:00+10:00', totalCents: 124000,
  },
  {
    id: 'b2', clientId: 'c2', petIds: ['p3'], service: 'overnight', status: 'confirmed',
    startAt: '2026-06-18T16:00:00+10:00', endAt: '2026-06-21T09:00:00+10:00', totalCents: 96000,
  },
  {
    id: 'b3', clientId: 'c3', petIds: ['p4'], service: 'drop_in', status: 'confirmed',
    startAt: '2026-06-17T12:00:00+10:00', endAt: '2026-06-17T13:00:00+10:00', totalCents: 9500,
  },
  {
    id: 'b4', clientId: 'c4', petIds: ['p5'], service: 'overnight', status: 'requested',
    startAt: '2026-06-22T16:00:00+10:00', endAt: '2026-06-25T10:00:00+10:00', totalCents: 78000,
  },
  {
    id: 'b5', clientId: 'c1', petIds: ['p1'], service: 'dog_walking', status: 'confirmed',
    startAt: '2026-06-19T07:30:00+10:00', endAt: '2026-06-19T08:30:00+10:00', totalCents: 6500,
  },
];

export const invoices: Invoice[] = [
  { id: 'i1', number: 'INV-1042', clientId: 'c2', bookingId: 'b2', status: 'sent', totalCents: 96000, dueDate: '2026-06-21' },
  { id: 'i2', number: 'INV-1039', clientId: 'c3', bookingId: 'b3', status: 'overdue', totalCents: 28500, dueDate: '2026-06-10' },
  { id: 'i3', number: 'INV-1037', clientId: 'c4', bookingId: 'b4', status: 'overdue', totalCents: 78000, dueDate: '2026-06-05' },
  { id: 'i4', number: 'INV-1044', clientId: 'c1', bookingId: 'b1', status: 'sent', totalCents: 124000, dueDate: '2026-06-24' },
];

export const revenueByMonth: RevenuePoint[] = [
  { label: 'Jan', amountCents: 1840000 },
  { label: 'Feb', amountCents: 2120000 },
  { label: 'Mar', amountCents: 1990000 },
  { label: 'Apr', amountCents: 2460000 },
  { label: 'May', amountCents: 2810000 },
  { label: 'Jun', amountCents: 3050000 },
];

export const activity: ActivityItem[] = [
  { id: 'a1', kind: 'check_in', message: 'Checked in for Maximilian & Coco overnight stay', at: '2026-06-17T08:35:00+10:00' },
  { id: 'a2', kind: 'photo', message: 'Uploaded 4 photos for Biscuit', at: '2026-06-17T08:10:00+10:00' },
  { id: 'a3', kind: 'payment', message: 'Payment received — INV-1041 ($1,120.00)', at: '2026-06-17T07:50:00+10:00' },
  { id: 'a4', kind: 'request', message: 'New booking request from Marco De Luca', at: '2026-06-16T19:22:00+10:00' },
  { id: 'a5', kind: 'journal', message: 'Daily journal added for Saffron (insulin given)', at: '2026-06-16T18:05:00+10:00' },
];

export const clientById = (id: string): Client | undefined => clients.find((c) => c.id === id);
export const petById = (id: string): Pet | undefined => pets.find((p) => p.id === id);
