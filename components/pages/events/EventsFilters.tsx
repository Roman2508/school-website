"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

import Select from "@/components/ui/Select";

interface MonthOption {
  value: string;
  label: string;
}

interface Props {
  months: MonthOption[];
  selectedMonth?: string;
}

export default function EventsFilters({ months, selectedMonth }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const baseParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(baseParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const clearFilters = () => {
    const next = new URLSearchParams(baseParams);
    next.delete("month");
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <div className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] p-5 md:p-6 shadow-card">
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[hsl(0_0%_40%)] text-sm font-semibold">
            <Filter className="w-4 h-4 text-[hsl(84_55%_45%)]" />
            Фільтри
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-[hsl(84_55%_45%)] hover:underline underline-offset-4 cursor-pointer"
          >
            Скинути
          </button>
        </div>

        <div className="grid gap-4">
          <Select
            label="Місяць"
            placeholder="Всі місяці"
            options={months}
            value={selectedMonth}
            onChange={(value) => updateParam("month", value)}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
