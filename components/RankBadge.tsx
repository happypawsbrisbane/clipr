interface RankReasonProps {
  rank: number;
  reason: string;
  highlighted?: boolean;
}

export function RankReason({ rank, reason, highlighted = false }: RankReasonProps) {
  return (
    <div
      className={
        'mt-4 flex items-start gap-3 border-l-2 pl-3 ' +
        (highlighted ? 'border-accent' : 'border-hairline')
      }
    >
      <span
        className={
          'mt-0.5 font-serif text-sm leading-none ' +
          (highlighted ? 'text-accent' : 'text-mute')
        }
      >
        #{rank}
      </span>
      <p className="text-sm leading-relaxed text-ink">{reason}</p>
    </div>
  );
}
