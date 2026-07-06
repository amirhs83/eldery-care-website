import { Navbar } from "@/components/aramsan/navbar";
import { Hero } from "@/components/aramsan/hero";
import { StoryScrollytelling } from "@/components/aramsan/story-scrollytelling";
import { ProductShowcase } from "@/components/aramsan/product-showcase";
import { Features } from "@/components/aramsan/features";
import { AppPreview } from "@/components/aramsan/app-preview";
import { Statistics } from "@/components/aramsan/statistics";
import { Comparison } from "@/components/aramsan/comparison";
import { WallOfLove } from "@/components/aramsan/wall-of-love";
import { Waitlist } from "@/components/aramsan/waitlist";
import { Faq } from "@/components/aramsan/faq";
import { StickyMobileCta } from "@/components/aramsan/sticky-mobile-cta";
import { Footer } from "@/components/aramsan/footer";
import { BlogOverlay } from "@/components/aramsan/blog-overlay";
import { AdminOverlay } from "@/components/aramsan/admin-overlay";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Navbar />
      <main className="relative flex-1">
        <Hero />
        <StoryScrollytelling />
        <ProductShowcase />
        <Features />
        <AppPreview />
        <Statistics />
        <Comparison />
        <WallOfLove />
        <Waitlist />
        <Faq />
      </main>
      <Footer />
      <StickyMobileCta />
      <BlogOverlay />
      <AdminOverlay />
    </div>
  );
}
