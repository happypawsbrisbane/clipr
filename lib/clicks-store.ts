// TODO(future): swap this in-memory tally for a real analytics sink
// (e.g. PostHog, a database table, or a server-side log).

type ClickKind = 'AFFILIATE' | 'DIRECT';

interface ClickRecord {
  offerId: string;
  kind: ClickKind;
  anonId: string;
  at: string;
}

const clicks: ClickRecord[] = [];

export function recordClick(input: Omit<ClickRecord, 'at'>): void {
  clicks.push({ ...input, at: new Date().toISOString() });
}

export interface ClickTally {
  total: number;
  affiliate: number;
  direct: number;
}

export function tallyClicksFor(offerId: string): ClickTally {
  let total = 0;
  let affiliate = 0;
  let direct = 0;
  for (const c of clicks) {
    if (c.offerId !== offerId) continue;
    total += 1;
    if (c.kind === 'AFFILIATE') affiliate += 1;
    else direct += 1;
  }
  return { total, affiliate, direct };
}

export function getAllClicks(): ReadonlyArray<ClickRecord> {
  return clicks;
}
