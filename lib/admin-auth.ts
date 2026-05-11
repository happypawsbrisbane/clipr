// Single-password admin gate for v1. Reads ADMIN_PASSWORD from env.
// TODO(future): replace with a real auth provider when accounts land.

import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'csa_admin';
const SESSION_HOURS = 8;

function expectedPassword(): string | undefined {
  const v = process.env.ADMIN_PASSWORD;
  return v && v.length > 0 ? v : undefined;
}

function tokenFor(password: string): string {
  return Buffer.from(password).toString('base64url');
}

export function isAdminConfigured(): boolean {
  return expectedPassword() !== undefined;
}

export async function isAdmin(): Promise<boolean> {
  const expected = expectedPassword();
  if (!expected) return false;
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === tokenFor(expected);
}

export async function loginAdmin(password: string): Promise<boolean> {
  const expected = expectedPassword();
  if (!expected) return false;
  if (password !== expected) return false;
  const c = await cookies();
  c.set(ADMIN_COOKIE, tokenFor(expected), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * SESSION_HOURS,
  });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
}
