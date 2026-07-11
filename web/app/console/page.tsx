import type { Metadata } from "next";
import Console from "@/components/console/Console";

export const metadata: Metadata = {
  title: "Praxis AI — Command Center",
  description: "Run your whole company through agents — the founder's cockpit.",
};

export default function ConsolePage() {
  return <Console />;
}
