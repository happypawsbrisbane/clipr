interface RankBadgeProps {
  rank: number;
  reason: string;
}

export function RankBadge({ rank, reason }: RankBadgeProps) {
  return (
    <div className="flex items-start gap-2">
      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-ink px-2 text-xs font-semibold text-white">
        #{rank}
      </span>
      <p className="text-xs leading-relaxed text-slate-600">{reason}</p>
    </div>
  );
}
