import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { FieldShell } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import type { Pet } from '@/types';

export interface PetFormValues {
  name: string;
  species: Pet['species'];
  breed: string;
  careFlags: string;
}

export function PetForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<PetFormValues>;
  submitLabel: string;
  onSubmit: (values: { name: string; species: Pet['species']; breed: string; careFlags: string[] }) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<PetFormValues>({
    name: initial?.name ?? '',
    species: initial?.species ?? 'dog',
    breed: initial?.breed ?? '',
    careFlags: initial?.careFlags ?? '',
  });
  const [error, setError] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim()) {
      setError('Pet name is required.');
      return;
    }
    onSubmit({
      name: values.name.trim(),
      species: values.species,
      breed: values.breed.trim(),
      careFlags: values.careFlags
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField id="pet-name" label="Name" value={values.name} onChange={(v) => setValues((s) => ({ ...s, name: v }))} error={error} required />
      <FieldShell label="Species" htmlFor="pet-species">
        <select
          id="pet-species"
          value={values.species}
          onChange={(e) => setValues((s) => ({ ...s, species: e.target.value as Pet['species'] }))}
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-white/10 dark:bg-white/5 dark:text-white"
        >
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="other">Other</option>
        </select>
      </FieldShell>
      <TextField id="pet-breed" label="Breed" value={values.breed} onChange={(v) => setValues((s) => ({ ...s, breed: v }))} placeholder="e.g. Cavoodle" />
      <TextField
        id="pet-flags"
        label="Care flags"
        value={values.careFlags}
        onChange={(v) => setValues((s) => ({ ...s, careFlags: v }))}
        hint="Comma-separated, e.g. senior, anxiety"
      />
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
