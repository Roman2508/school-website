"use client";

import { useRouter } from "next/navigation";
import Select from "@/components/ui/Select";

interface MonthOption {
  value: string;
  label: string;
}

interface Props {
  months: MonthOption[];
}

export default function ArchiveSelect({ months }: Props) {
  const router = useRouter();

  const onChange = (value: string) => {
    if (!value) return;
    router.push(`/news?month=${value}`);
  };

  return (
    <Select
      label="Виберіть місяць"
      placeholder="Оберіть період"
      options={months}
      onChange={onChange}
      fullWidth
    />
  );
}
