import { Metadata } from "next";
import CTA from "@/components/Common/CTA";
import Features from "@/components/Common/Features";
import GradientIntroSection from "@/components/Common/GradientIntroSection";

export const metadata: Metadata = {
    title: "About Elevu - Reinventing Employee Performance Reviews",
    description: "Learn how Elevu turns clunky annual reviews into continuous 360-degree feedback, empowering teams with actionable insights and a culture of growth.",
};

export default function AboutPage() {
    return (
        <>
            <GradientIntroSection
                title="Reinventing Performance Reviews for Modern Teams"
                subtitle="Elevu turns once-a-year reviews into a continuous, automated feedback loop. Our platform matches peers, sends smart reminders, and delivers 360-degree insights—giving every team clear data to recognize strengths, close skill gaps, and sustain growth."
                fromColor="#2842eb"
                toColor="#73b2ff"
            />
            <Features />
            <CTA />
        </>
    );
}