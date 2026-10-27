"use client";

import { useEffect, useRef } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export function SiteHeader({ locale, languageLabel }: { locale: Locale; languageLabel: string }) {
  const headerRef = useRef<HTMLElement>(null);
  const m = getMessages(locale);

  useEffect(() => {
    const header = headerRef.current;
    const hero = document.getElementById("ocean");
    if (!header || !hero) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = hero.clientHeight * 0.6;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 1;
      header.style.setProperty("--header-progress", String(reducedMotion.matches || hero.dataset.dismissed !== undefined ? 1 : progress));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    // A sticky hero can otherwise retain focus behind the opaque content panel.
    const revealHero = () => {
      if (!hero.inert) window.scrollTo({ top: 0, behavior: "instant" });
    };
    hero.dataset.enhanced = "";
    hero.addEventListener("focusin", revealHero);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      delete hero.dataset.enhanced;
      hero.removeEventListener("focusin", revealHero);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header">
      <div className="site-header-inner">
        <a href={`/${locale}`} className="wordmark" aria-label={`Simhae — ${m.headerDefinition}`}>
          <span className="wordmark-name">Simhae</span>
          <span className="wordmark-definition">{m.headerDefinition}</span>
        </a>
        <LanguageSwitcher locale={locale} label={languageLabel} />
      </div>
    </header>
  );
}
