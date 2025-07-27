// src/app/landing/page.tsx

import Hero from "./Hero";
import Features from "./Features";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#fafbf8] font-sans">
      <div className="flex flex-col items-center px-4 sm:px-10 lg:px-40 py-10">
        <div className="max-w-[960px] w-full">
          <Hero />
          <Features />
          <Footer />
        </div>
      </div>
    </main>
  );
}
