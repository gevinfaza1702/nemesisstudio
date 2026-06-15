import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LogoCloud from "./components/LogoCloud";
import FeaturesSection from "./components/FeaturesSection";
import SectionDivider from "./components/SectionDivider";
import Footer from "./components/Footer";

// Dynamic import ParticleBackground (CSS-only, but client component)
const ParticleBackground = dynamic(() => import("./components/ParticleBackground"), {
  ssr: false,
  loading: () => <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 0 }} />,
});

// Scroll-to-top button (client component)
const ScrollToTop = dynamic(() => import("./components/ScrollToTop"), {
  ssr: false,
});

// Lazy load heavier components for better initial load
const UseCaseSection = dynamic(() => import("./components/UseCaseSection"), {
  loading: () => <div style={{ minHeight: 300 }} />,
});

const HowItWorks = dynamic(() => import("./components/HowItWorks"), {
  loading: () => <div style={{ minHeight: 300 }} />,
});

const ShowcaseSection = dynamic(() => import("./components/ShowcaseSection"), {
  loading: () => <div style={{ minHeight: 400 }} />,
});

const TestimonialSection = dynamic(() => import("./components/TestimonialSection"), {
  loading: () => <div style={{ minHeight: 300 }} />,
});

const PricingSection = dynamic(() => import("./components/PricingSection"), {
  loading: () => <div style={{ minHeight: 500 }} />,
});

const FAQSection = dynamic(() => import("./components/FAQSection"), {
  loading: () => <div style={{ minHeight: 300 }} />,
});

export const metadata = {
  title: "Nemesis Studio",
  description: "Platform AI video generator terdepan di Indonesia. Tanpa skill editing, tanpa ribet. UGC, Video Ads, Konten TikTok/Reels — cukup prompt, langsung jadi.",
};

export default function LandingPage() {
  return (
    <div style={{ position: 'relative', background: '#000', minHeight: '100vh' }}>
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <LogoCloud />
      <SectionDivider />
      <UseCaseSection />
      <SectionDivider flip />
      <FeaturesSection />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider flip />
      <ShowcaseSection />
      <SectionDivider />
      <TestimonialSection />
      <SectionDivider flip />
      <PricingSection />
      <SectionDivider />
      <FAQSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
