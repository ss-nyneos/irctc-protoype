import Hero from '../components/Hero.tsx'
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
import AppPromo from '../components/AppPromo.tsx'
import ExploreCta from '../components/ExploreCta.tsx'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Offers />
      <Stats />
      <Trending />
      <Experiences />
      <Interstitial />
      <Destinations />
      <Trains />
      <Pilgrimage />
      <MonthlyTrips />
      <Faq />
      <AppPromo />
      <ExploreCta />
    </main>
  )
}
