import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import ManualVsAutopilot from "@/components/ManualVsAutopilot";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import StudioPreview from "@/components/StudioPreview";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import LandingAnalytics from "@/components/LandingAnalytics";

export default function Home() {
    return (
        <>
            <Header />
            <LandingAnalytics />
            <main>
                {/* ATTENTION - Hook */}
                <Hero />

                {/* TRUST - Immediate credibility */}
                <SocialProof />

                {/* COMPARISON - Manual vs Automated */}
                <ManualVsAutopilot />

                {/* SIMPLIFY - Show it's easy */}
                <HowItWorks />

                {/* REINFORCE - Social proof after demo */}
                <Testimonials />

                {/* DESIRE - Show the product */}
                <StudioPreview />

                {/* ACTION - After desire is built */}
                <Pricing />

                {/* OBJECTIONS - Handle doubts */}
                <FAQ />
            </main>
            <Footer />
        </>
    );
}
