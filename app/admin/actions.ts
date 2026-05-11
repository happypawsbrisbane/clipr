'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { isAdmin, loginAdmin, logoutAdmin } from '@/lib/admin-auth';
import { loadOffers } from '@/lib/data';
import { clearStatusOverride, setStatusOverride } from '@/lib/offers-overrides';
import type { OfferStatus } from '@/lib/types';

export async function adminLoginAction(formData: FormData): Promise<void> {
  const password = String(formData.get('password') ?? '');
  const ok = await loginAdmin(password);
  if (!ok) {
    redirect('/admin?error=invalid');
  }
  redirect('/admin');
}

export async function adminLogoutAction(): Promise<void> {
  await logoutAdmin();
  redirect('/admin');
}

export async function setOfferStatusAction(formData: FormData): Promise<void> {
  if (!(await isAdmin())) {
    redirect('/admin');
  }
  const offerId = String(formData.get('offerId') ?? '');
  const status = String(formData.get('status') ?? '') as OfferStatus | 'RESET';
  if (!offerId) return;

  if (status === 'RESET') {
    clearStatusOverride(offerId);
  } else if (['ACTIVE', 'PENDING', 'EXPIRED', 'REMOVED'].includes(status)) {
    const offer = loadOffers().find((o) => o.id === offerId);
    if (!offer) return;
    setStatusOverride(offerId, status as OfferStatus);
  }
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/stores');
  revalidatePath('/stores/[slug]', 'page');
  revalidatePath('/search');
}
