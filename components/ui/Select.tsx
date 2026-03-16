"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  placeholder: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

export default function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
  fullWidth = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${fullWidth ? "w-full" : ""}`}>
      <label className="flex flex-col gap-2 text-xs font-semibold text-[hsl(0_0%_40%)]">
        {label}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full rounded-xl border border-[hsl(80_15%_88%)] bg-white px-3 py-2.5 pr-10 text-sm text-left text-[hsl(0_0%_21%)] relative min-h-[44px] cursor-pointer"
          aria-expanded={open}
        >
          {selected?.label ?? placeholder}
          <ChevronDown className="w-4 h-4 text-[hsl(0_0%_45%)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </button>
      </label>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-[hsl(80_15%_88%)] bg-white shadow-card max-h-64 overflow-auto py-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[hsl(80_30%_93%)] cursor-pointer"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
