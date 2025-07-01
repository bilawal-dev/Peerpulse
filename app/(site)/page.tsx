import { Metadata } from "next";
import CTA from "@/components/Common/CTA";
import Faq from "@/components/Common/Faq";
import Features from "@/components/Common/Features";
import Hero from "@/components/Home/HeroSection";
import BrandSlider from "@/components/Home/BrandSlider";

export const metadata: Metadata = {
  title: "PeerPulse - Peer-Powered Performance Reviews",
  description: "PeerPulse is an employee performance management platform that automates 360-degree peer reviews, feedback workflows, and insightful performance reports for teams.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <BrandSlider />
      <Features />
      <Faq />
      <CTA />
    </>
  );
}