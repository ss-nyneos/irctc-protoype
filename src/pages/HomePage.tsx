import { useReveal } from "@/hooks/useReveal";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { SpecialOffersSection } from "@/components/home/SpecialOffersSection";
import { TrendingPackagesSection } from "@/components/home/TrendingPackagesSection";
import { ModesSection } from "@/components/home/ModesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { LuxuryTrainsSection } from "@/components/home/LuxuryTrainsSection";
import { TripsByMonthSection } from "@/components/home/TripsByMonthSection";
import { ExploreWorldSection } from "@/components/home/ExploreWorldSection";
import { VandeBharatScrollMorph } from "@/components/home/VandeBharatScrollMorph";
import vandeBharatPhoto from "@/assets/cta/vande-bharat.png";

export function HomePage() {
  const ref = useReveal();

  return (
    <div ref={ref}>
      <HeroSection />
      <ServicesSection />
      <SpecialOffersSection />
      <StatsSection />
      <TrendingPackagesSection />
      <ModesSection />

      <LuxuryTrainsSection />

      <VandeBharatScrollMorph imageSrc={vandeBharatPhoto} headline="INDIAN RAIL" />

      <TripsByMonthSection />

      <ExploreWorldSection />
    </div>
  );
}
