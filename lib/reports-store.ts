// Reports persistence. When DATABASE_URL is set we go through Prisma so
// votes survive serverless cold starts. Otherwise we fall back to an
// in-memory store seeded from data/reports.seed.json — fine for local
// dev without a DB and for unit tests.

import { loadSeedReports } from '@/lib/data';
import { isDbConfigured, prisma } from '@/lib/prisma';
import type { VerificationReport, Vote } from '@/lib/types';

export interface AddReportInput {
  offerId: string;
  vote: Vote;
  comment?: string;
  anonId: string;
  now?: Date;
}

export interface ReportTally {
  worked: number;
  didntWork: number;
  total: number;
}

// ---- in-memory backend (dev without DB, and tests) ----

const memReports = new Map<string, VerificationReport[]>();
let memSeeded = false;

function ensureSeeded() {
  if (memSeeded) return;
  for (const r of loadSeedReports()) {
    const list = memReports.get(r.offerId);
    if (list) list.push(r);
    else memReports.set(r.offerId, [r]);
  }
  memSeeded = true;
}

// ---- public API (async; DB-or-memory) ----

export async function getAllReports(): Promise<VerificationReport[]> {
  if (isDbConfigured()) {
    const rows = await prisma.verificationReport.findMany();
    return rows.map(rowToDomain);
  }
  ensureSeeded();
  return Array.from(memReports.values()).flat();
}

export async function getReportsFor(offerId: string): Promise<VerificationReport[]> {
  if (isDbConfigured()) {
    const rows = await prisma.verificationReport.findMany({ where: { offerId } });
    return rows.map(rowToDomain);
  }
  ensureSeeded();
  return memReports.get(offerId) ?? [];
}

export async function hasVoted(offerId: string, anonId: string): Promise<boolean> {
  if (isDbConfigured()) {
    const existing = await prisma.verificationReport.findUnique({
      where: { offerId_anonId: { offerId, anonId } },
    });
    return existing !== null;
  }
  ensureSeeded();
  const list = memReports.get(offerId);
  return list ? list.some((r) => r.anonId === anonId) : false;
}

export async function addReport(input: AddReportInput): Promise<VerificationReport> {
  const createdAt = input.now ?? new Date();
  if (isDbConfigured()) {
    const row = await prisma.verificationReport.create({
      data: {
        offerId: input.offerId,
        vote: input.vote,
        comment: input.comment,
        anonId: input.anonId,
        createdAt,
      },
    });
    return rowToDomain(row);
  }
  ensureSeeded();
  const report: VerificationReport = {
    id: `rpt_${createdAt.toISOString()}_${input.anonId.slice(0, 6)}`,
    offerId: input.offerId,
    vote: input.vote,
    comment: input.comment,
    anonId: input.anonId,
    createdAt: createdAt.toISOString(),
  };
  const list = memReports.get(input.offerId);
  if (list) list.push(report);
  else memReports.set(input.offerId, [report]);
  return report;
}

export async function tallyFor(offerId: string): Promise<ReportTally> {
  if (isDbConfigured()) {
    const rows = await prisma.verificationReport.findMany({
      where: { offerId },
      select: { vote: true },
    });
    let worked = 0;
    let didntWork = 0;
    for (const r of rows) {
      if (r.vote === 'WORKED') worked += 1;
      else didntWork += 1;
    }
    return { worked, didntWork, total: rows.length };
  }
  ensureSeeded();
  const list = memReports.get(offerId) ?? [];
  let worked = 0;
  let didntWork = 0;
  for (const r of list) {
    if (r.vote === 'WORKED') worked += 1;
    else didntWork += 1;
  }
  return { worked, didntWork, total: list.length };
}

interface PrismaReportRow {
  id: string;
  offerId: string;
  vote: string;
  comment: string | null;
  anonId: string;
  createdAt: Date;
}

function rowToDomain(row: PrismaReportRow): VerificationReport {
  return {
    id: row.id,
    offerId: row.offerId,
    vote: row.vote as Vote,
    comment: row.comment ?? undefined,
    anonId: row.anonId,
    createdAt: row.createdAt.toISOString(),
  };
}
