import type { Metadata } from "next";
import { getHomepage } from "@/lib/api/homepage";
import { getLatestNews } from "@/lib/api/news";
import { getUpcomingEvents } from "@/lib/api/events";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import StatsSection from "@/components/sections/StatsSection";
import ContactsSection from "@/components/sections/ContactsSection";
import NewsSectionWrapper from "@/components/sections/NewsSectionWrapper";
import EventsSectionWrapper from "@/components/sections/EventsSectionWrapper";
import AnimatedSection from "@/components/layout/AnimatedSection";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const hp = await getHomepage();
    return {
      title: hp.Hero?.title ?? "Головна",
      description: hp.Hero?.subtitle ?? undefined,
    };
  } catch {
    return { title: "Головна" };
  }
}

export default async function HomePage() {
  const [homepage, news, events] = await Promise.all([
    getHomepage(),
    getLatestNews(3),
    getUpcomingEvents(4),
  ]);

  return (
    <>
      <HeroSection data={homepage.Hero} />
      <AnimatedSection delay={0}>
        <AboutSection data={homepage.About} />
      </AnimatedSection>
      <AnimatedSection delay={0}>
        <StatsSection data={homepage.Stats} />
      </AnimatedSection>
      <AnimatedSection delay={0}>
        <NewsSectionWrapper feed={homepage.News} posts={news} />
      </AnimatedSection>
      <AnimatedSection delay={0}>
        <EventsSectionWrapper feed={homepage.Events} events={events} />
      </AnimatedSection>
      <AnimatedSection delay={0}>
        <ContactsSection data={homepage.Contacts} />
      </AnimatedSection>
    </>
  );
}
