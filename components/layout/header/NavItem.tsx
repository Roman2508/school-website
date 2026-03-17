"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import type { NavItemLevel1 } from "@/types/strapi";
import Level2Dropdown from "./Level2Dropdown";

export default function NavItem({ item }: { item: NavItemLevel1 }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>(
    { top: 0, left: 0 },
  );
  const hasChildren = item.submenu && item.submenu.length > 0;
  const hasLink = Boolean(item.link);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const unmountTimerRef = useRef<number | null>(null);
  const canUseDOM = typeof window !== "undefined";

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const clearUnmountTimer = () => {
    if (unmountTimerRef.current) {
      window.clearTimeout(unmountTimerRef.current);
      unmountTimerRef.current = null;
    }
  };

  const updateDropdownPosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el || !canUseDOM) return;
    const rect = el.getBoundingClientRect();
    const top = rect.bottom + 8;
    const viewportWidth = window.innerWidth;
    const padding = 12;
    const dropdownWidth =
      dropdownRef.current?.offsetWidth && dropdownRef.current.offsetWidth > 0
        ? dropdownRef.current.offsetWidth
        : 320;
    let left = rect.left;
    if (left + dropdownWidth > viewportWidth - padding) {
      left = Math.max(padding, rect.right - dropdownWidth);
    }
    if (left < padding) left = padding;
    setDropdownPos({ top, left });
  }, [canUseDOM]);

  const openDropdown = () => {
    if (!hasChildren) return;
    clearCloseTimer();
    clearUnmountTimer();
    updateDropdownPosition();
    setIsMounted(true);
    requestAnimationFrame(() => setIsVisible(true));
  };

  const scheduleClose = () => {
    clearCloseTimer();
    clearUnmountTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      unmountTimerRef.current = window.setTimeout(() => {
        setIsMounted(false);
      }, 140);
    }, 60);
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
      clearUnmountTimer();
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const id = requestAnimationFrame(() => updateDropdownPosition());
    return () => cancelAnimationFrame(id);
  }, [isMounted, updateDropdownPosition]);

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={openDropdown}
      onMouseLeave={scheduleClose}
    >
      {hasLink ? (
        <Link
          href={item.link as string}
          className="flex items-center gap-1 px-1 py-2 text-sm font-medium text-dark hover:text-[hsl(84_55%_45%)] rounded-xl transition-colors"
        >
          {item.title}
          {hasChildren && (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${isVisible ? "rotate-180" : ""}`}
            />
          )}
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-1 py-2 text-sm font-medium text-dark rounded-xl cursor-default">
          {item.title}
          {hasChildren && (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${isVisible ? "rotate-180" : ""}`}
            />
          )}
        </span>
      )}
      {hasChildren &&
        isMounted &&
        item.submenu &&
        canUseDOM &&
        createPortal(
          <div
            className={`fixed z-[60] transform-gpu will-change-[opacity,transform] transition-[opacity,transform] ease-out ${
              isVisible
                ? "opacity-100 translate-y-0 duration-200"
                : "opacity-0 -translate-y-2 duration-100 pointer-events-none"
            }`}
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleClose}
            ref={dropdownRef}
          >
            <Level2Dropdown items={item.submenu} />
          </div>,
          document.body,
        )}
    </div>
  );
}
