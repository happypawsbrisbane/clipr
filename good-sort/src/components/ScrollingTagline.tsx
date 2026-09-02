import { Mark } from "./Wordmark";

const ITEMS = ["Made for your kind.", "Australian wearables for dogs & humans", "Est. 2024"];

/** A slow, restrained marquee. Pauses on hover and stops under reduced motion. */
export function ScrollingTagline() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {ITEMS.map((item) => (
        <li key={item} className="label flex items-center gap-10 pr-10">
          <span>{item}</span>
          <Mark className="h-2.5 w-auto" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y border-ink/10 py-4" aria-label="Made for your kind. Australian wearables for dogs and humans. Est. 2024">
      <div className="marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
