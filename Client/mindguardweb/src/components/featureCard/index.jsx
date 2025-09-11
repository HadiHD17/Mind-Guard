import "./featureCard.css";

export default function FeatureCard({ icon, title, children }) {
  return (
    <div className="feature-card">
      <div className="feature-card__icon">{icon}</div>
      <div className="feature-card__title">{title}</div>
      <p className="feature-card__text">{children}</p>
    </div>
  );
}
