import { describe, expect, it } from 'vitest';
import {
  addBooking,
  addClient,
  addPet,
  deleteBooking,
  deleteClient,
  deletePet,
  petsForClient,
  seedState,
  setBookingStatus,
  updateClient,
  updatePet,
} from './store';

describe('client reducers', () => {
  it('adds a client with a generated id', () => {
    const start = { clients: [], pets: [], bookings: [] };
    const next = addClient(start, { name: 'Test', suburb: 'Bondi, NSW', since: '2026-01-01' });
    expect(next.clients).toHaveLength(1);
    expect(next.clients[0].id).toBeTruthy();
    expect(next.clients[0].name).toBe('Test');
  });

  it('updates a client by id', () => {
    const seeded = seedState();
    const id = seeded.clients[0].id;
    const next = updateClient(seeded, id, { suburb: 'Updated, VIC' });
    expect(next.clients.find((c) => c.id === id)?.suburb).toBe('Updated, VIC');
  });

  it('deleting a client cascades to their pets and bookings', () => {
    const seeded = seedState();
    const clientId = seeded.bookings[0].clientId;
    const next = deleteClient(seeded, clientId);
    expect(next.clients.some((c) => c.id === clientId)).toBe(false);
    expect(next.pets.some((p) => p.clientId === clientId)).toBe(false);
    expect(next.bookings.some((b) => b.clientId === clientId)).toBe(false);
  });
});

describe('booking reducers', () => {
  it('adds a booking with a generated id', () => {
    const seeded = seedState();
    const before = seeded.bookings.length;
    const next = addBooking(seeded, {
      clientId: seeded.clients[0].id,
      petIds: [],
      service: 'drop_in',
      status: 'confirmed',
      startAt: '2026-07-01T12:00:00+10:00',
      endAt: '2026-07-01T13:00:00+10:00',
      totalCents: 9500,
    });
    expect(next.bookings).toHaveLength(before + 1);
    expect(next.bookings.at(-1)?.id).toBeTruthy();
  });

  it('changes status and deletes', () => {
    const seeded = seedState();
    const id = seeded.bookings[0].id;
    expect(setBookingStatus(seeded, id, 'cancelled').bookings.find((b) => b.id === id)?.status).toBe('cancelled');
    expect(deleteBooking(seeded, id).bookings.some((b) => b.id === id)).toBe(false);
  });
});

describe('pet reducers', () => {
  it('adds and lists pets for a client', () => {
    const seeded = seedState();
    const clientId = seeded.clients[0].id;
    const before = petsForClient(seeded, clientId).length;
    const next = addPet(seeded, { clientId, name: 'Rex', species: 'dog', breed: 'Kelpie', careFlags: [] });
    expect(petsForClient(next, clientId)).toHaveLength(before + 1);
  });

  it('updates and deletes a pet', () => {
    const seeded = seedState();
    const petId = seeded.pets[0].id;
    const updated = updatePet(seeded, petId, { breed: 'Mixed' });
    expect(updated.pets.find((p) => p.id === petId)?.breed).toBe('Mixed');
    const removed = deletePet(updated, petId);
    expect(removed.pets.some((p) => p.id === petId)).toBe(false);
  });
});
