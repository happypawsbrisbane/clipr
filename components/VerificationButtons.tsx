'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface VerificationButtonsProps {
  offerId: string;
  initialWorked: number;
  initialDidntWork: number;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'voted'; worked: number; didntWork: number }
  | { kind: 'already-voted'; worked: number; didntWork: number }
  | { kind: 'error'; message: string };

export function VerificationButtons({
  offerId,
  initialWorked,
  initialDidntWork,
}: VerificationButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function submitVote(vote: 'WORKED' | 'DIDNT_WORK') {
    setStatus({ kind: 'submitting' });
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId, vote }),
      });
      const data = (await res.json()) as {
        tally?: { worked: number; didntWork: number };
        error?: string;
      };
      if (res.ok && data.tally) {
        setStatus({
          kind: 'voted',
          worked: data.tally.worked,
          didntWork: data.tally.didntWork,
        });
        startTransition(() => router.refresh());
      } else if (res.status === 409 && data.tally) {
        setStatus({
          kind: 'already-voted',
          worked: data.tally.worked,
          didntWork: data.tally.didntWork,
        });
      } else {
        setStatus({ kind: 'error', message: data.error ?? 'Could not record your vote.' });
      }
    } catch {
      setStatus({ kind: 'error', message: 'Network error. Try again.' });
    }
  }

  const worked = status.kind === 'voted' || status.kind === 'already-voted' ? status.worked : initialWorked;
  const didntWork =
    status.kind === 'voted' || status.kind === 'already-voted' ? status.didntWork : initialDidntWork;
  const disabled =
    status.kind === 'submitting' ||
    status.kind === 'voted' ||
    status.kind === 'already-voted' ||
    isPending;

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Did this work for you?
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => submitVote('WORKED')}
          disabled={disabled}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Report that this offer worked"
        >
          Worked ({worked})
        </button>
        <button
          type="button"
          onClick={() => submitVote('DIDNT_WORK')}
          disabled={disabled}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Report that this offer did not work"
        >
          Didn&apos;t work ({didntWork})
        </button>
        {status.kind === 'voted' && (
          <span className="text-xs text-slate-500">Thanks — your vote was recorded.</span>
        )}
        {status.kind === 'already-voted' && (
          <span className="text-xs text-slate-500">You&apos;ve already voted on this offer.</span>
        )}
        {status.kind === 'error' && (
          <span className="text-xs text-rose-600">{status.message}</span>
        )}
      </div>
    </div>
  );
}
