import stripImg from '../assets/footer-strip.png'

/* full-bleed photo strip band that sits below the footer */
export default function FooterStrip() {
  return (
    <div className="w-full leading-[0]" aria-hidden="true">
      <img
        src={stripImg}
        alt=""
        loading="lazy"
        className="block h-[clamp(120px,13vw,200px)] w-full object-cover object-center"
      />
    </div>
  )
}
