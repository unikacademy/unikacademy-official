"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    // Named lenisInstance (not `lenis`) — the lenis package itself already
    // declares window.lenis as small debug metadata, not the instance.
    lenisInstance?: Lenis;
  }
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    history.scrollRestoration = "manual";

    const lenis = new Lenis({ lerp: 0.08, duration: 1.2 });
    lenisRef.current = lenis;
    // Exposed so in-page "scroll to section" CTAs can drive Lenis directly —
    // calling native scrollIntoView/window.scrollTo while Lenis is active
    // fights its own RAF-driven scroll position and causes jitter.
    window.lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.normalizeScroll(false);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      lenisRef.current = null;
      window.lenisInstance = undefined;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname]);

  return <>{children}</>;
}
