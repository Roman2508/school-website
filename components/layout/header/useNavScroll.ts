"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useNavScroll() {
  const navScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);

  const updateNavScrollState = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 1;
    const canScrollLeft = el.scrollLeft > 0;
    const canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    setShowScrollLeft(hasOverflow && canScrollLeft);
    setShowScrollRight(hasOverflow && canScrollRight);
  }, []);

  const scrollNavBy = useCallback((direction: "left" | "right") => {
    const el = navScrollRef.current;
    if (!el) return;
    const amount = Math.max(220, Math.floor(el.clientWidth * 0.6));
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;
    updateNavScrollState();
    const handleScroll = () => updateNavScrollState();
    el.addEventListener("scroll", handleScroll, { passive: true });
    const ro = new ResizeObserver(() => updateNavScrollState());
    ro.observe(el);
    window.addEventListener("resize", updateNavScrollState);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      ro.disconnect();
      window.removeEventListener("resize", updateNavScrollState);
    };
  }, [updateNavScrollState]);

  return {
    navScrollRef,
    showScrollLeft,
    showScrollRight,
    scrollNavBy,
  };
}
