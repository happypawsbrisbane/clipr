import Image from "next/image";
import { COLOURS, DARK_TONES, type ColourKey } from "@/lib/catalogue";
import { Mark } from "./Wordmark";

type Props = {
  tone: ColourKey;
  /** Describes the photograph this slot is for. Used as alt text once a `src` exists. */
  alt: string;
  /** Small caption shown on the temporary treatment. */
  caption?: string;
  src?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
  /** Scale of the faint mark in the temporary treatment. */
  mark?: "sm" | "md" | "lg" | "none";
  /** Fill the nearest positioned ancestor instead of sitting in flow. */
  fill?: boolean;
};

/**
 * An image slot. Until photography is supplied it renders a flat brand
 * colour with fine grain, a hairline inset and a caption, so layouts read as
 * intended and every slot is obvious to replace: pass `src`.
 */
export function Frame({
  tone,
  alt,
  caption,
  src,
  sizes = "100vw",
  priority,
  className = "",
  children,
  mark = "md",
  fill = false,
}: Props) {
  const dark = DARK_TONES.has(tone);
  const markClass = { sm: "w-[22%]", md: "w-[34%]", lg: "w-[52%]", none: "hidden" }[mark];
  return (
    <div
      className={`overflow-hidden ${fill ? "absolute inset-0" : "relative"} ${className}`}
      style={{ backgroundColor: COLOURS[tone].hex }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div aria-hidden="true" className="absolute inset-0">
          <div className="grain absolute inset-0 opacity-30 mix-blend-multiply" />
          <div className={`absolute inset-3 border ${dark ? "border-chalk/15" : "border-ink/10"}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Mark className={`${markClass} ${dark ? "text-chalk/[0.13]" : "text-ink/[0.09]"}`} />
          </div>
          {caption ? (
            <span
              className={`label absolute bottom-5 left-5 max-w-[80%] ${
                dark ? "text-chalk/60" : "text-ink/50"
              }`}
            >
              {caption}
            </span>
          ) : null}
        </div>
      )}
      {!src ? <span className="sr-only">{alt}</span> : null}
      {children}
    </div>
  );
}
