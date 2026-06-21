import { useCallback, useEffect, useState } from 'react';

// Minimal hash-based router — avoids a routing dependency for the handful of
// screens in v1. Routes look like "#/clients" or "#/clients/c1".
// TODO(future): swap for a real router (e.g. react-router) if nested layouts
// or data loaders are needed.

function currentPath(): string {
  if (typeof window === 'undefined') return '/dashboard';
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/dashboard';
}

export function navigate(path: string): void {
  window.location.hash = path;
}

export function useHashRoute() {
  const [path, setPath] = useState<string>(currentPath);

  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return { path, navigate: useCallback(navigate, []) };
}

/** Splits a path into non-empty segments, e.g. "/clients/c1" -> ["clients","c1"]. */
export function segments(path: string): string[] {
  return path.split('/').filter(Boolean);
}
