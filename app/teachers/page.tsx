import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import TeacherCard from "@/components/features/teacher-card";
import { getAllStaff } from "@/lib/api/staff";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Педагогічний склад",
    description: "Вчителі та працівники школи.",
  };
}

export default async function TeachersPage() {
  const staff = await getAllStaff();

  return (
    <>
      <section className="relative py-10 md:py-12 overflow-visible overflow-x-clip bg-white">
        <div className="absolute -top-24 -right-24 w-[260px] h-[260px] bg-[hsl(84_55%_45%/0.08)] rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-[240px] h-[240px] bg-[hsl(50_100%_50%/0.12)] rounded-full blur-3xl" />
        <div className="container relative z-10 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(84_55%_45%)] hover:underline underline-offset-4"
          >
            <ArrowLeft className="w-4 h-4" />
            На головну
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl md:text-4xl font-black text-[hsl(0_0%_21%)]">
                Педагогічний склад
              </h1>
              <span className="inline-flex items-center rounded-full bg-[hsl(80_30%_93%)] px-3 py-1 text-xs font-semibold text-[hsl(0_0%_40%)]">
                {staff.length} працівників
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container">
          {staff.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
                <TeacherCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] p-10 text-center shadow-card">
              <p className="text-lg font-semibold text-[hsl(0_0%_21%)]">
                Поки що немає працівників для відображення
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
