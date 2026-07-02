"use client";

import dynamic from "next/dynamic";
import HeroFallback from "./HeroFallback";

// `ssr:false` is only permitted inside a Client Component in Next.js 16 -- this thin
// wrapper exists so the R3F Canvas (which touches window/WebGL) never runs during SSR,
// while app/page.tsx itself stays a Server Component.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export default function HeroSceneLoader() {
  return <HeroScene />;
}
