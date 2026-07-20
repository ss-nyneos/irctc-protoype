import './Interstitial.css'

export default function Interstitial() {
  return (
    <section className="interstitial">
      <div className="interstitial__media">
        <img
          src="/img/ladakh.jpg"
          alt="A high mountain pass in Ladakh"
          className="px-media interstitial__img"
          data-parallax="30"
          loading="lazy"
        />
        <div className="interstitial__scrim" />
      </div>
      <div className="wrap interstitial__inner">
        <h2 className="interstitial__title">
          Every great journey<br />begins at a platform.
        </h2>
      </div>
    </section>
  )
}
