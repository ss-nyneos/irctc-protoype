import Hero from '../components/Hero.tsx'
import TripGenieStrip from '../components/TripGenieStrip.tsx'
import Services from '../components/Services.tsx'
import Offers from '../components/Offers.tsx'
import Stats from '../components/Stats.tsx'
import Trending from '../components/Trending.tsx'
import Experiences from '../components/Experiences.tsx'
import Interstitial from '../components/Interstitial.tsx'
import Destinations from '../components/Destinations.tsx'
import Trains from '../components/Trains.tsx'
import Pilgrimage from '../components/Pilgrimage.tsx'
import MonthlyTrips from '../components/MonthlyTrips.tsx'
import Faq from '../components/Faq.tsx'
import ExploreCta from '../components/ExploreCta.tsx'
import { LuxuryTrainsSection } from "@/components/home/LuxuryTrainsSection";
import { VandeBharatScrollMorph } from "@/components/home/VandeBharatScrollMorph";
import vandeBharatPhoto from "@/assets/cta/vande-bharat.png";


import { CustomScrollbar } from '@/components/common/CustomScrollbar'

export default function Home() {
  return (
    <main>
      <CustomScrollbar />
      <Hero />
      <Services />

      <Offers />
      {/* <Stats /> */}
      <Trending />
      <TripGenieStrip />
      <Experiences />
      <Interstitial />
      <Destinations />
      {/* <Trains /> */}
      <LuxuryTrainsSection />
      {/* section wrapper: main > section gets z-index so sticky morph sits above sticky hero */}
      <section className="relative z-[1]">
        <VandeBharatScrollMorph imageSrc={vandeBharatPhoto} headline="INDIAN RAIL" />
      </section>
      <Pilgrimage />
      <MonthlyTrips />
      <Faq />
      <ExploreCta />
    </main>
  )
}
