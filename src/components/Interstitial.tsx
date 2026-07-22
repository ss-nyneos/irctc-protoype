export default function Interstitial() {
  return (
    <section className="relative isolate flex h-[clamp(420px,62vh,640px)] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* px-media extends beyond the frame so parallax never reveals an edge */}
        <img
          src="/img/ladakh.jpg"
          alt="A high mountain pass in Ladakh"
          className="px-media object-cover"
          data-parallax="30"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.32)_46%,rgba(0,0,0,0.12)_100%)]" />
      </div>
      <div className="wrap w-full">
        {/* 64px is the desktop size; it steps down on narrow viewports or a
            single line would run well past the screen edge. */}
        <h2
          className="max-w-[18ch] font-sans text-display leading-[0.98] font-extrabold text-white
                     [text-shadow:0_4px_40px_rgba(0,0,0,0.4)]
                     max-[900px]:text-[48px] max-[560px]:text-[34px]"
        >
          Every great journey<br />begins at a platform.
        </h2>
      </div>
    </section>
  )
}
