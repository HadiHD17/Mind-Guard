import "./howItWorksCard.css";

export default function HowItWorksCard({ step, title, children }) {
  return (
    <div className="hiw-card">
      <div className="hiw-card__step">{step}</div>
      <div className="hiw-card__title">{title}</div>
      <p className="hiw-card__text">{children}</p>
    </div>
  );
}
