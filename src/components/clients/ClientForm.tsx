import { useState } from 'react';
import { TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { isValidAuPhone } from '@/lib/validation';

export interface ClientFormValues {
  name: string;
  email: string;
  phone: string;
  suburb: string;
}

function validate(v: ClientFormValues): Partial<Record<keyof ClientFormValues, string>> {
  const errors: Partial<Record<keyof ClientFormValues, string>> = {};
  if (!v.name.trim()) errors.name = 'Name is required.';
  if (!v.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'Enter a valid email.';
  if (v.phone.trim() && !isValidAuPhone(v.phone)) errors.phone = 'Enter a valid Australian phone number.';
  return errors;
}

export function ClientForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<ClientFormValues>;
  submitLabel: string;
  onSubmit: (values: ClientFormValues) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ClientFormValues>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    suburb: initial?.suburb ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormValues, string>>>({});

  const set = (key: keyof ClientFormValues) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        suburb: values.suburb.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField id="client-name" label="Full name" value={values.name} onChange={set('name')} error={errors.name} required />
      <TextField id="client-email" label="Email" type="email" value={values.email} onChange={set('email')} error={errors.email} required />
      <TextField
        id="client-phone"
        label="Phone"
        value={values.phone}
        onChange={set('phone')}
        error={errors.phone}
        hint="e.g. 0412 345 678"
      />
      <TextField id="client-suburb" label="Suburb / state" value={values.suburb} onChange={set('suburb')} placeholder="e.g. Toorak, VIC" />
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
