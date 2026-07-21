import { Link } from 'react-router-dom'
import { Pin } from './Icons.tsx'
import skyline from '../assets/explore/skyline.svg'
import skylineReflection from '../assets/explore/skyline-reflection.svg'
import boat from '../assets/explore/boat.svg'

/* position + drift timing per float; each is hidden below 820px where the
   cards would collide with the copy */
const floats = [
  {
    id: 'a',
    state: 'Gujarat',
    tours: 125,
    img: '/img/jaipur-hd.jpg',
    pillFirst: false,
    place: 'left-[2%] top-[2%] min-[1101px]:left-[5%] min-[1101px]:top-[4%] [animation-duration:6.2s]',
  },
  {
    id: 'b',
    state: 'Madhya Pradesh',
    tours: 125,
    img: '/img/temple-gopuram.jpg',
    pillFirst: false,
    place: 'right-[2%] top-0 min-[1101px]:right-[6%] min-[1101px]:top-[1%] [animation-duration:7.6s] [animation-delay:0.9s]',
  },
  {
    id: 'c',
    state: 'Tamil Nadu',
    tours: 125,
    img: '/img/kerala-waterfall.jpg',
    pillFirst: true,
    place: 'right-[4%] top-[34%] min-[1101px]:right-[9%] min-[1101px]:top-[32%] [animation-duration:6.8s] [animation-delay:1.7s]',
  },
]

const pill =
  'inline-flex items-center gap-[0.55rem] rounded-[14px] bg-white px-[1.05rem] py-[0.6rem] ' +
  'whitespace-nowrap shadow-[0_14px_30px_-12px_rgba(20,30,60,0.35)] ' +
  '[&_svg]:flex-none [&_svg]:text-[1.25rem] [&_svg]:text-[#f2751f]'

export default function ExploreCta() {
  return (
    /* margin-bottom gives breathing room before the footer */
    <section className="relative isolate mb-[clamp(2.5rem,5vw,4.5rem)] overflow-hidden bg-paper pt-[clamp(5rem,9vw,8.5rem)]">
      <div className="wrap relative z-[3] text-center">
        <h2 className="h2 [&_span]:text-blue">
          Ready To Explore The <span>World?</span>
        </h2>
        <p className="mx-auto mt-[1.1rem] max-w-[48ch] text-[clamp(1rem,0.95rem+0.25vw,1.12rem)] leading-relaxed text-ink-soft">
          Start your next adventure today — find hidden gems, plan your trip, and
          make memories that last a lifetime.
        </p>
        <Link
          to="/packages"
          className="mt-[clamp(1.6rem,3vw,2.4rem)] inline-block rounded-[14px] bg-blue px-[2.4rem]
                     py-[1.05rem] text-[1.05rem] font-bold text-white
                     shadow-[0_16px_34px_-14px_rgba(36,117,238,0.85)]
                     transition-[background,transform] duration-250 ease-brand
                     hover:-translate-y-0.5 hover:bg-blue-deep"
        >
          Book Ticket
        </Link>
      </div>

      {/* floating destination cards */}
      {floats.map((f) => (
        <figure
          key={f.id}
          className={`absolute z-[2] m-0 hidden w-[clamp(120px,15vw,160px)] animate-floaty
                      motion-reduce:animate-none min-[821px]:flex min-[1101px]:w-[clamp(148px,14.5vw,205px)]
                      ${f.pillFirst ? 'flex-col-reverse items-end' : 'flex-col items-start'} ${f.place}`}
        >
          <img
            className="aspect-square w-full rounded-[22px] object-cover shadow-[0_22px_44px_-20px_rgba(20,30,60,0.5)]"
            src={f.img}
            alt={f.state}
            loading="lazy"
          />
          {/* pill tucks over the image edge */}
          <figcaption
            className={`${pill} ${
              f.pillFirst ? 'relative z-[1] mr-[1.1rem] -mb-[1.4rem]' : 'ml-[1.1rem] -mt-[1.4rem]'
            }`}
          >
            <Pin />
            <span className="flex flex-col leading-tight">
              <strong className="text-[0.95rem] font-bold text-[#1b3a6b]">{f.state}</strong>
              <small className="text-[0.8rem] text-ink-soft">{f.tours} Tours</small>
            </span>
          </figcaption>
        </figure>
      ))}

      {/* skyline + its reflection in the water */}
      <div className="relative z-[1] mt-[clamp(1.5rem,5vw,4rem)]" aria-hidden="true">
        <img src={skyline} alt="" className="block h-auto w-full" />
        <img
          src={skylineReflection}
          alt=""
          className="-mt-px block h-auto w-full opacity-[0.92]
                     [mask-image:linear-gradient(180deg,#000_0%,rgba(0,0,0,0.82)_60%,rgba(0,0,0,0.45)_100%)]"
        />
        <img
          src={boat}
          alt=""
          className="absolute bottom-[-1%] left-0 z-[2] h-auto w-[clamp(80px,18vw,120px)]
                     animate-explore-bob motion-reduce:animate-none min-[821px]:w-[clamp(96px,12vw,210px)]"
        />
      </div>
    </section>
  )
}
