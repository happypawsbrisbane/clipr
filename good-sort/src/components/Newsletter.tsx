"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "./Icons";
import { Reveal } from "./Reveal";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setState("error");
      return;
    }
    // TODO(future): send to the email provider. Client-side only for now.
    setState("done");
  };

  return (
    <section id="join" className="scroll-mt-16 bg-citron px-5 py-20 text-ink md:px-8 md:py-28" aria-labelledby="join-title">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-7">
          <h2 id="join-title" className="display text-[14vw] md:text-[7vw]">
            Join the good sorts.
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-snug md:text-[19px]">
            New drops, walk recommendations and occasional dog photos. Nothing ruff.
          </p>
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.1}>
          {state === "done" ? (
            <p className="flex items-center gap-3 text-[17px]" role="status">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-citron">
                <CheckIcon size={16} />
              </span>
              You&rsquo;re in. Talk soon.
            </p>
          ) : (
            <form onSubmit={submit} noValidate>
              <label htmlFor="newsletter-email" className="label">
                Email
              </label>
              <div className="mt-2 flex items-center border-b border-ink">
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  placeholder="you@somewhere.com.au"
                  aria-invalid={state === "error"}
                  aria-describedby={state === "error" ? "newsletter-error" : "newsletter-note"}
                  className="min-h-12 w-full bg-transparent text-[17px] outline-none placeholder:text-ink/40"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 hover:bg-ink hover:text-citron"
                  aria-label="Join the list"
                >
                  <ArrowRightIcon size={20} />
                </button>
              </div>
              {state === "error" ? (
                <p id="newsletter-error" className="mt-3 text-[13px]" role="alert">
                  That email doesn&rsquo;t look right. Check it and try again.
                </p>
              ) : (
                <p id="newsletter-note" className="mt-3 text-[12px] text-ink/70">
                  One or two a month. Unsubscribe any time.
                </p>
              )}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
