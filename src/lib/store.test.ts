import { describe, expect, it } from 'vitest';
import {
  addClient,
  addPet,
  deleteClient,
  deletePet,
  petsForClient,
  seedState,
  updateClient,
  updatePet,
} from './store';

describe('client reducers', () => {
  it('adds a client with a generated id', () => {
    const start = { clients: [], pets: [] };
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

  it('deleting a client cascades to their pets', () => {
    const seeded = seedState();
    const clientId = seeded.pets[0].clientId;
    const next = deleteClient(seeded, clientId);
    expect(next.clients.some((c) => c.id === clientId)).toBe(false);
    expect(next.pets.some((p) => p.clientId === clientId)).toBe(false);
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
