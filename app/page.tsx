import { HeroSection } from "@/components/hero-section";
import { preload } from "react-dom";

export default function HomePage() {
  preload("/assets/james-hero-engraving.jpg?v=mbe-20260716-1", {
    as: "image",
    type: "image/jpeg",
    fetchPriority: "high"
  });

  return (
    <main>
      <HeroSection />
    </main>
  );
}
