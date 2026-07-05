import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ValidationGap from "@/components/ValidationGap";
import DashboardReveal from "@/components/DashboardReveal";
import AgenticCapabilities from "@/components/AgenticCapabilities";
import OrgChart from "@/components/OrgChart";
import DailyBriefing from "@/components/DailyBriefing";
import TrustGuardrails from "@/components/TrustGuardrails";
import Integrations from "@/components/Integrations";
import FinalCTA from "@/components/FinalCTA";
import ScrollMotion from "@/components/ScrollMotion";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-obsidian text-frost">
      {/* Exposed 1px technical grid — the structural skeleton */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(243,244,246,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,244,246,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <ScrollMotion />
      <Header />
      <main>
        <Hero />
        <ValidationGap />
        <DashboardReveal />
        <AgenticCapabilities />
        <OrgChart />
        <DailyBriefing />
        <TrustGuardrails />
        <Integrations />
        <FinalCTA />
      </main>
    </div>
  );
}
