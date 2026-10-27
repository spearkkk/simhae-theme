"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function InformationPanel({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;
    const header = document.querySelector<HTMLElement>(".site-header");
    const hero = document.getElementById("ocean");
    const oceanReturn = document.querySelector<HTMLElement>(".ocean-return");
    if (!stage || !panel || !content || !header || !hero || !oceanReturn) return;

    let frame = 0;
    let entered = false;
    let headerHeight = 0;
    let dockAt = 0;
    let maxTravel = 0;
    let returnInDistance = 0;
    let returnOutDistance = 0;
    let returnStart = 0;
    const progressAt = (position: number, start: number, distance: number) => {
      const progress = (position - start) / distance;
      return progress >= 0.995 ? 1 : Math.max(0, progress);
    };
    const update = () => {
      frame = 0;
      if (!entered && window.scrollY >= Math.round(dockAt)) {
        const travel = Math.max(0, window.scrollY - dockAt);
        entered = true;
        // Remove the introductory scroll distance rather than fighting wheel/touch input.
        if (hero.contains(document.activeElement)) panel.focus({ preventScroll: true });
        hero.inert = true;
        hero.dataset.dismissed = "";
        hero.style.height = `${headerHeight}px`;
        header.style.setProperty("--header-progress", "1");
        dockAt = stage.getBoundingClientRect().top + window.scrollY - headerHeight;
        returnStart = dockAt + maxTravel;
        window.scrollTo({ top: travel, behavior: "instant" });
      }
      const travel = Math.min(maxTravel, Math.max(0, window.scrollY - dockAt));
      content.style.transform = `translate3d(0, ${-travel}px, 0)`;
      const returnProgress = progressAt(window.scrollY, returnStart, returnInDistance);
      const fadeOutProgress = progressAt(window.scrollY, returnStart + returnInDistance, returnOutDistance);
      content.style.setProperty("--return-progress", String(returnProgress));
      oceanReturn.style.setProperty("--return-progress", String(returnProgress));
      oceanReturn.style.setProperty("--return-fade-out", String(fadeOutProgress));
      header.style.setProperty("--return-progress", String(returnProgress));
      header.style.pointerEvents = returnProgress >= 0.98 ? "none" : "";
    };
    const measure = () => {
      headerHeight = header.getBoundingClientRect().height;
      if (entered) hero.style.height = `${headerHeight}px`;
      stage.style.setProperty("--header-height", `${headerHeight}px`);
      stage.style.height = `${Math.max(content.scrollHeight, panel.clientHeight)}px`;
      dockAt = stage.getBoundingClientRect().top + window.scrollY - headerHeight;
      maxTravel = Math.max(0, content.scrollHeight - panel.clientHeight);
      returnInDistance = Math.max(window.innerHeight * 0.8, 1);
      returnOutDistance = Math.max(window.innerHeight * 0.8, 1);
      oceanReturn.style.height = `${returnInDistance + returnOutDistance}px`;
      returnStart = dockAt + maxTravel;
      update();
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const revealFocus = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement) || event.target === panel) return;
      const rect = event.target.getBoundingClientRect();
      const bottom = panel.getBoundingClientRect().bottom;
      const delta = rect.top < headerHeight ? rect.top - headerHeight - 24
        : rect.bottom > bottom ? rect.bottom - bottom + 24 : 0;
      if (delta) {
        window.scrollBy({ top: delta, behavior: "instant" });
        update();
      }
    };
    const revealFragment = () => {
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target || !content.contains(target)) return;
      const offset = target.getBoundingClientRect().top - content.getBoundingClientRect().top;
      window.scrollTo({ top: dockAt + Math.min(maxTravel, Math.max(0, offset - 24)), behavior: "instant" });
      update();
    };

    // Native document scrolling drives both the arrival and the content travel.
    stage.dataset.enhanced = "";
    measure();
    const initialFragmentFrame = window.requestAnimationFrame(revealFragment);
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    observer.observe(header);
    observer.observe(panel);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("pageshow", measure);
    window.addEventListener("load", revealFragment);
    window.addEventListener("hashchange", revealFragment);
    panel.addEventListener("focusin", revealFocus);
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(initialFragmentFrame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pageshow", measure);
      window.removeEventListener("load", revealFragment);
      window.removeEventListener("hashchange", revealFragment);
      panel.removeEventListener("focusin", revealFocus);
      delete stage.dataset.enhanced;
      stage.style.removeProperty("height");
      stage.style.removeProperty("--header-height");
      oceanReturn.style.removeProperty("height");
      oceanReturn.style.removeProperty("--return-progress");
      oceanReturn.style.removeProperty("--return-fade-out");
      header.style.removeProperty("--return-progress");
      header.style.removeProperty("pointer-events");
      content.style.removeProperty("transform");
      content.style.removeProperty("--return-progress");
      delete hero.dataset.dismissed;
      hero.inert = false;
      hero.style.removeProperty("height");
    };
  }, []);

  return (
    <div ref={stageRef} className="information-stage">
      <div ref={panelRef} id="information" className="information" tabIndex={-1}>
        <div ref={contentRef} className="information-inner">{children}</div>
      </div>
    </div>
  );
}
