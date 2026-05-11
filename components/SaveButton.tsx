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
        className="border border-hairline bg-paper px-3 py-1.5 font-sans text-sm font-medium text-ink opacity-50"
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
        'border px-3 py-1.5 font-sans text-sm font-medium transition ' +
        (saved
          ? 'border-accent bg-accent-soft text-ink'
          : 'border-hairline bg-paper text-ink hover:border-accent')
      }
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
