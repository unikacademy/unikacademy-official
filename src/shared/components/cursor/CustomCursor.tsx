"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!window.matchMedia("(hover: none)").matches) setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    document.body.classList.add("has-custom-cursor");

    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;
    let glowX = 0,
      glowY = 0;
    let rafId: number;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
    }

    function tick() {
      // Ring lerps at 0.12
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
      }
      // Glow lerps slower at 0.06
      glowX += (mouseX - glowX) * 0.06;
      glowY += (mouseY - glowY) * 0.06;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowX - 32}px, ${glowY - 32}px)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    function onEnterInteractive() {
      if (ringRef.current) {
        ringRef.current.style.width = "52px";
        ringRef.current.style.height = "52px";
        ringRef.current.style.marginLeft = "-10px";
        ringRef.current.style.marginTop = "-10px";
        ringRef.current.style.borderColor = "#d4bc72";
        ringRef.current.style.opacity = "1";
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = "0";
      }
    }

    function onLeaveInteractive() {
      if (ringRef.current) {
        ringRef.current.style.width = "32px";
        ringRef.current.style.height = "32px";
        ringRef.current.style.marginLeft = "0";
        ringRef.current.style.marginTop = "0";
        ringRef.current.style.borderColor = "#c0a84f";
        ringRef.current.style.opacity = "0.7";
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
      }
    }

    // Attach to interactive elements
    function attachListeners() {
      const els = document.querySelectorAll<HTMLElement>(
        "a, button, [data-magnetic], input, select, textarea, [role=button]",
      );
      els.forEach((el) => {
        el.addEventListener("mouseenter", onEnterInteractive);
        el.addEventListener("mouseleave", onLeaveInteractive);
      });
    }

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(tick);
    attachListeners();

    // Re-attach after route changes (SPA navigation)
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      document.body.classList.remove("has-custom-cursor");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#c0a84f",
          pointerEvents: "none",
          zIndex: 99999,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1.5px solid #c0a84f",
          opacity: 0.7,
          pointerEvents: "none",
          zIndex: 99998,
          transition:
            "width 0.25s, height 0.25s, opacity 0.2s, border-color 0.2s",
          willChange: "transform",
        }}
      />
      {/* Glow trail */}
      <div
        ref={glowRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(192,168,79,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 99997,
          willChange: "transform",
        }}
      />
    </>
  );
}
