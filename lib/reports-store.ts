// TODO(future): replace this in-memory store with a real DB once we have one.
// Lives in module scope so it survives between requests within a single Node
// process. In serverless deployments each instance has its own store — fine
// for the MVP because data is mock-only and resets on deploy.

import { loadSeedReports } from '@/lib/data';
import type { VerificationReport, Vote } from '@/lib/types';

const reportsByOffer = new Map<string, VerificationReport[]>();
let seeded = false;

function ensureSeeded() {
  if (seeded) return;
  for (const r of loadSeedReports()) {
    const list = reportsByOffer.get(r.offerId);
    if (list) list.push(r);
    else reportsByOffer.set(r.offerId, [r]);
  }
  seeded = true;
}

export function getAllReports(): VerificationReport[] {
  ensureSeeded();
  return Array.from(reportsByOffer.values()).flat();
}

export function getReportsFor(offerId: string): VerificationReport[] {
  ensureSeeded();
  return reportsByOffer.get(offerId) ?? [];
}

export function hasVoted(offerId: string, anonId: string): boolean {
  ensureSeeded();
  const list = reportsByOffer.get(offerId);
  if (!list) return false;
  return list.some((r) => r.anonId === anonId);
}

export interface AddReportInput {
  offerId: string;
  vote: Vote;
  comment?: string;
  anonId: string;
  now?: Date;
}

export function addReport(input: AddReportInput): VerificationReport {
  ensureSeeded();
  const createdAt = (input.now ?? new Date()).toISOString();
  const report: VerificationReport = {
    id: `rpt_${createdAt}_${input.anonId.slice(0, 6)}`,
    offerId: input.offerId,
    vote: input.vote,
    comment: input.comment,
    anonId: input.anonId,
    createdAt,
  };
  const list = reportsByOffer.get(input.offerId);
  if (list) list.push(report);
  else reportsByOffer.set(input.offerId, [report]);
  return report;
}

export interface ReportTally {
  worked: number;
  didntWork: number;
  total: number;
}

export function tallyFor(offerId: string): ReportTally {
  const list = getReportsFor(offerId);
  let worked = 0;
  let didntWork = 0;
  for (const r of list) {
    if (r.vote === 'WORKED') worked += 1;
    else didntWork += 1;
  }
  return { worked, didntWork, total: list.length };
}
