import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Footer from "../../components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-[#fafbf8] font-sans text-[#141b0e]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-20 py-10">
        <Hero />
        <Features />
        <Footer />
      </div>
    </main>
  );
}
