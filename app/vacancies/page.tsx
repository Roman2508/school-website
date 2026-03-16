import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import RichTextContent from "@/components/blocks/RichTextContent";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Вакансії",
    description: "Актуальні вакансії школи.",
  };
}

const vacancies = [
  {
    id: 1,
    title: "Вчитель української мови та літератури",
    body: "### Обов'язки\n- Проведення уроків\n- Підготовка навчальних матеріалів\n\n**Вимоги:**\n- Педагогічна освіта\n- Досвід роботи від 1 року",
  },
  {
    id: 2,
    title: "Педагог-організатор",
    body: "### Обов'язки\n- Організація шкільних заходів\n- Співпраця з учнями та батьками\n\n**Вимоги:**\n- Комунікабельність\n- Вміння працювати в команді",
  },
  {
    id: 3,
    title: "Вчитель математики",
    body: "### Обов'язки\n- Проведення уроків\n- Перевірка домашніх завдань\n\n**Вимоги:**\n- Профільна освіта\n- Бажано досвід роботи",
  },
];

export default function VacanciesPage() {
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
                Вакансії
              </h1>
              <span className="inline-flex items-center rounded-full bg-[hsl(80_30%_93%)] px-3 py-1 text-xs font-semibold text-[hsl(0_0%_40%)]">
                {vacancies.length} вакансії
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {vacancies.map((vacancy) => (
              <article
                key={vacancy.id}
                className="bg-white rounded-2xl border border-[hsl(80_15%_88%)] p-6 shadow-card"
              >
                <h2 className="font-heading text-xl font-black text-[hsl(0_0%_21%)] mb-4">
                  {vacancy.title}
                </h2>
                <RichTextContent body={vacancy.body} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
