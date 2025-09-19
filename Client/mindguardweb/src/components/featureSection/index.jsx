import "./featureSection.css";
import FeatureCard from "../featureCard";
import { FiActivity, FiClock, FiAlertTriangle } from "react-icons/fi";

export default function FeaturesSection() {
  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Understand Your Mental Wellness</h2>
        <p className="section-sub">
          MindGuard allows you to log moods and write journal entries. Our AI
          analyzes them to provide personalized insights and support for your
          journey.
        </p>

        <div className="features__grid">
          <FeatureCard
            icon={<FiActivity aria-hidden />}
            title="Mood Map Visualization">
            See your emotional patterns over time with beautiful, intuitive
            charts that help you understand your mental health trends.
          </FeatureCard>

          <FeatureCard
            icon={<FiClock aria-hidden />}
            title="Smart Routine Creation">
            Build personalized wellness routines for specific days and times,
            tailored to your lifestyle and mental health needs.
          </FeatureCard>

          <FeatureCard
            icon={<FiAlertTriangle aria-hidden />}
            title="High-Risk Day Detection">
            Our ML identifies challenging days in advance, offering proactive
            tips and support when you need it most.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
