import "./hero.css";

export default function Hero() {
  return (
    <header className="hero">
      <div className="container hero__inner">
        <img src="/logo.png" alt="MindGuard logo" className="hero__logo" />
        <div className="hero__brand">
          MIND<span className="light">GUARD</span>
        </div>
        <p className="hero__tagline">Your AI companion for mental wellness</p>

        <button className="hero__cta" type="button">
          Coming Soon
        </button>
      </div>
    </header>
  );
}
