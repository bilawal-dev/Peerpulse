import { Metadata } from "next";
import GradientIntroSection from "@/components/Common/GradientIntroSection";
import ContactForm from "@/components/Contact/ContactForm";
import CTA from "@/components/Common/CTA";

export const metadata: Metadata = {
    title: "Contact PeerPulse - Talk to Our Performance Review Experts",
    description: "Reach out to PeerPulse for questions about automated 360-degree feedback, pricing, partnerships, or product support. Our team is ready to help.",
};

export default function ContactPage() {
    return (
        <>
            <GradientIntroSection
                title="Get in Touch with PeerPulse"
                subtitle="Curious about automating 360-degree feedback or need help choosing the right plan? Drop us a line and our team will guide you through everything PeerPulse can do to simplify reviews, boost engagement, and grow your people."
                fromColor="#EE4660"
                viaColor="#EE6135"
                toColor="#EBA112"
            />
            <ContactForm />
            <CTA />
        </>
    );
}