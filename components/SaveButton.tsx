'use client';

import { useEffect, useState } from 'react';
import { isOfferSaved, saveOffer, unsaveOffer } from '@/lib/storage';

interface SaveButtonProps {
  offerId: string;
}

export function SaveButton({ offerId }: SaveButtonProps) {
  const [saved, setSaved] = useState<boolean | null>(null);

  useEffect(() => {
    setSaved(isOfferSaved(offerId));
  }, [offerId]);

  function toggle() {
    if (saved) {
      unsaveOffer(offerId);
      setSaved(false);
    } else {
      saveOffer(offerId);
      setSaved(true);
    }
  }

  // Render an inert placeholder until we know the saved state, so the button
  // doesn't flicker between "Save" and "Saved" on first paint.
  if (saved === null) {
    return (
      <button
        type="button"
        disabled
        aria-hidden="true"
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium opacity-50"
      >
        Save
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={
        'rounded-md border px-3 py-1.5 text-sm font-medium transition ' +
        (saved
          ? 'border-accent bg-accent/10 text-ink'
          : 'border-slate-300 bg-white text-ink hover:border-accent')
      }
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
