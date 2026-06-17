// Domain types for PetSitter Pro.
// These mirror the intended Prisma schema so the mock layer can be swapped for
// a real API/database without changing component code.
// TODO(future): generate these from the Prisma schema once the backend lands.

export type ServiceType = 'overnight' | 'drop_in' | 'day_care' | 'dog_walking';

export type BookingStatus = 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Client {
  id: string;
  name: string;
  suburb: string;
  /** ISO date the client first booked. */
  since: string;
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  /** Free-text flags such as "senior", "anxiety", "diabetic". */
  careFlags: string[];
}

export interface Booking {
  id: string;
  clientId: string;
  petIds: string[];
  service: ServiceType;
  status: BookingStatus;
  /** ISO datetime. */
  startAt: string;
  /** ISO datetime. */
  endAt: string;
  /** Total in cents, AUD, GST-inclusive. */
  totalCents: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  bookingId: string;
  status: InvoiceStatus;
  /** Total in cents, AUD, GST-inclusive. */
  totalCents: number;
  /** ISO date the invoice is due. */
  dueDate: string;
}

export interface RevenuePoint {
  /** Short month label, e.g. "Jan". */
  label: string;
  /** Revenue in cents, AUD. */
  amountCents: number;
}

export type ActivityKind = 'check_in' | 'photo' | 'journal' | 'payment' | 'request';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  message: string;
  /** ISO datetime. */
  at: string;
}
