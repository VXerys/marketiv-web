import Image from "next/image";
import { Button } from "@/components/ui/Button";
import landingPageBg from "@/assets/images/landing-page.png";
import { LANDING_CONTENT } from "@/data/content";

export function HeroSection() {
  const { hero } = LANDING_CONTENT;
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <Image
        src={landingPageBg}
        alt="UMKM dan Konten Kreator berkolaborasi"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        quality={100}
      />

      {/* Gradient Overlay Matching Figma */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(238deg, rgba(248,244,11,0.20) 41%, rgba(255,140,0,0.20) 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto pt-16 sm:pt-20">
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white drop-shadow-xl max-w-2xl md:max-w-3xl lg:max-w-4xl whitespace-pre-line leading-tight">
          {hero.title}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/95 mt-4 sm:mt-5 md:mt-6 max-w-xl md:max-w-2xl drop-shadow-lg">
          {hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-12 sm:mt-16 md:mt-20 lg:mt-24">
          <Button variant="primary" size="xl" href="/umkm">
            {hero.ctaUmkm}
          </Button>
          <Button variant="outline" size="xl" href="/creator">
            {hero.ctaCreator}
          </Button>
        </div>

        {/* Trust Line */}
        <p className="text-sm sm:text-base md:text-lg font-semibold text-white/70 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
          {hero.trustLine}
        </p>
      </div>

      {/* Floating AI Bot FAB */}
      <button
        type="button"
        aria-label="Toggle AI Message Bot"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px] rounded-full bg-brand-coral shadow-2xl hover:scale-110 transition-transform duration-200 border-4 border-white/20"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
        >
          <path d="M12 2C8.686 2 6 4.686 6 8v1H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v1c0 3.314 2.686 6 6 6s6-2.686 6-6v-1h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2V8c0-3.314-2.686-6-6-6z" />
          <path d="M9 13v-2" />
          <path d="M15 13v-2" />
          <path d="M10 17h4" />
        </svg>
      </button>
    </section>
  );
}
