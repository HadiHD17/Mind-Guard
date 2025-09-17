import "./howitWorks.css";
import HowItWorksCard from "../howItWorksCard";

export default function HowItWorks() {
  return (
    <section className="hiw">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-sub">Simple steps to better mental wellness</p>

        <div className="hiw__grid">
          <HowItWorksCard step="1" title="Log Your Mood">
            Record your daily emotions and thoughts with quick checks or journal
            entries.
          </HowItWorksCard>
          <HowItWorksCard step="2" title="AI Analysis">
            Our system analyzes your patterns and maps your emotional journey
            over time.
          </HowItWorksCard>
          <HowItWorksCard step="3" title="Get Guidance">
            Receive personalized routines, insights, and proactive support
            tailored to you.
          </HowItWorksCard>
        </div>

        <h2 className="section-title">Why Choose MindGuard?</h2>
        <p className="section-sub">
          Advanced AI meets compassionate mental health support
        </p>

        <div className="hiw__grid hiw__grid--mini">
          <HowItWorksCard step="★" title="AI-Powered Personalization">
            Every insight and recommendation is tailored to your unique
            patterns.
          </HowItWorksCard>
          <HowItWorksCard step="★" title="Proactive Mental Health">
            Don’t wait for difficult days. Get early warnings and preventive
            support.
          </HowItWorksCard>
          <HowItWorksCard step="★" title="Beautiful Visualization">
            Transform complex emotions into clear, intuitive charts.
          </HowItWorksCard>
        </div>
      </div>
    </section>
  );
}
