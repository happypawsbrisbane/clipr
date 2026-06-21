// Client + pet data store for the management screens.
//
// v1 persists to localStorage and is seeded from the mock data, so CRUD works
// end-to-end in the browser without a backend. The pure reducer functions below
// are backend-agnostic and unit-tested.
//
// TODO(future): replace the localStorage persistence with calls to the Express
// + Prisma API. The reducer signatures already match the intended REST shape.

import { useCallback, useEffect, useState } from 'react';
import type { Booking, BookingStatus, Client, Pet } from '@/types';
import {
  bookings as seedBookings,
  clients as seedClients,
  pets as seedPets,
} from '@/data/mock';

export interface StoreState {
  clients: Client[];
  pets: Pet[];
  bookings: Booking[];
}

const STORAGE_KEY = 'petsitter-data-v1';

export function seedState(): StoreState {
  return { clients: [...seedClients], pets: [...seedPets], bookings: [...seedBookings] };
}

// ---- Pure reducers (no React, no IO) -------------------------------------

export function addClient(state: StoreState, client: Omit<Client, 'id'>): StoreState {
  const newClient: Client = { ...client, id: newId('c') };
  return { ...state, clients: [...state.clients, newClient] };
}

export function updateClient(state: StoreState, id: string, patch: Partial<Omit<Client, 'id'>>): StoreState {
  return {
    ...state,
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  };
}

export function deleteClient(state: StoreState, id: string): StoreState {
  return {
    clients: state.clients.filter((c) => c.id !== id),
    // Cascade: a client's pets and bookings go with them.
    pets: state.pets.filter((p) => p.clientId !== id),
    bookings: state.bookings.filter((b) => b.clientId !== id),
  };
}

export function addPet(state: StoreState, pet: Omit<Pet, 'id'>): StoreState {
  const newPet: Pet = { ...pet, id: newId('p') };
  return { ...state, pets: [...state.pets, newPet] };
}

export function updatePet(state: StoreState, id: string, patch: Partial<Omit<Pet, 'id' | 'clientId'>>): StoreState {
  return {
    ...state,
    pets: state.pets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
  };
}

export function deletePet(state: StoreState, id: string): StoreState {
  return { ...state, pets: state.pets.filter((p) => p.id !== id) };
}

export function petsForClient(state: StoreState, clientId: string): Pet[] {
  return state.pets.filter((p) => p.clientId === clientId);
}

export function addBooking(state: StoreState, booking: Omit<Booking, 'id'>): StoreState {
  const newBooking: Booking = { ...booking, id: newId('b') };
  return { ...state, bookings: [...state.bookings, newBooking] };
}

export function updateBooking(
  state: StoreState,
  id: string,
  patch: Partial<Omit<Booking, 'id'>>,
): StoreState {
  return {
    ...state,
    bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
  };
}

export function setBookingStatus(state: StoreState, id: string, status: BookingStatus): StoreState {
  return updateBooking(state, id, { status });
}

export function deleteBooking(state: StoreState, id: string): StoreState {
  return { ...state, bookings: state.bookings.filter((b) => b.id !== id) };
}

function newId(prefix: string): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${rand}`;
}

// ---- React binding -------------------------------------------------------

function load(): StoreState {
  if (typeof window === 'undefined') return seedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as StoreState;
    if (!Array.isArray(parsed.clients) || !Array.isArray(parsed.pets)) return seedState();
    // Backfill bookings for stores saved before the bookings feature shipped.
    if (!Array.isArray(parsed.bookings)) parsed.bookings = [...seedBookings];
    return parsed;
  } catch {
    return seedState();
  }
}

/** Stateful store hook with localStorage persistence. */
export function useStore() {
  const [state, setState] = useState<StoreState>(load);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return {
    state,
    addClient: useCallback((c: Omit<Client, 'id'>) => setState((s) => addClient(s, c)), []),
    updateClient: useCallback((id: string, patch: Partial<Omit<Client, 'id'>>) => setState((s) => updateClient(s, id, patch)), []),
    deleteClient: useCallback((id: string) => setState((s) => deleteClient(s, id)), []),
    addPet: useCallback((p: Omit<Pet, 'id'>) => setState((s) => addPet(s, p)), []),
    updatePet: useCallback((id: string, patch: Partial<Omit<Pet, 'id' | 'clientId'>>) => setState((s) => updatePet(s, id, patch)), []),
    deletePet: useCallback((id: string) => setState((s) => deletePet(s, id)), []),
    addBooking: useCallback((b: Omit<Booking, 'id'>) => setState((s) => addBooking(s, b)), []),
    setBookingStatus: useCallback((id: string, status: BookingStatus) => setState((s) => setBookingStatus(s, id, status)), []),
    deleteBooking: useCallback((id: string) => setState((s) => deleteBooking(s, id)), []),
    reset: useCallback(() => setState(seedState()), []),
  };
}
