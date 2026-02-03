import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Comparison from "@/components/Comparison";
import HowItWorks from "@/components/HowItWorks";
import DemoVideo from "@/components/DemoVideo";
import Testimonials from "@/components/Testimonials";
import StudioPreview from "@/components/StudioPreview";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* ATTENTION - Hook */}
        <Hero />

        {/* TRUST - Immediate credibility */}
        <SocialProof />

        {/* PROBLEM/SOLUTION - Pain point + solution */}
        <Comparison />

        {/* SIMPLIFY - Show it's easy */}
        <HowItWorks />

        {/* SHOW - Visual proof */}
        <DemoVideo />

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
