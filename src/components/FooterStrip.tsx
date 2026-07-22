/* Full-bleed photo strip band that sits below the footer. A seamless row of
   iconic Indian destinations — tiles butt together with no gaps, mirroring the
   original single-image strip. Purely decorative, so the band is aria-hidden. */
const STRIP = [
  { img: '/img/taj-dawn.jpg', place: 'Agra' },
  { img: '/img/kashmir-hd.jpg', place: 'Kashmir' },
  { img: '/img/varanasi-ghats.jpg', place: 'Varanasi' },
  { img: '/img/goa.jpg', place: 'Goa' },
  { img: '/img/hawa-mahal.jpg', place: 'Jaipur' },
  { img: '/img/kerala-backwaters.jpg', place: 'Kerala' },
  { img: '/img/golden-temple.jpg', place: 'Amritsar' },
]

export default function FooterStrip() {
  return (
    <div className="flex w-full leading-[0]" aria-hidden="true">
      {STRIP.map((s) => (
        <img
          key={s.place}
          src={s.img}
          alt=""
          loading="lazy"
          className="block h-[clamp(120px,13vw,200px)] w-0 min-w-0 flex-1 object-cover object-center"
        />
      ))}
    </div>
  )
}
