import Image from "next/image";
import landingPageBg from "@/assets/images/landing-page.png";

interface DashboardHeroProps {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}

export function DashboardHero({
  title,
  subtitle,
  searchPlaceholder,
}: DashboardHeroProps) {
  return (
    <section className="relative w-full h-[320px] sm:h-[380px] md:h-[450px] lg:h-[434px] flex flex-col items-center justify-center overflow-hidden pt-20 md:pt-24 lg:pt-28 pb-6 lg:pb-8">
      {/* Background Image */}
      <Image
        src={landingPageBg}
        alt="Background banner"
        fill
        priority
        className="object-cover object-[center_35%]"
        sizes="100vw"
        quality={100}
      />

      {/* Gradient Overlay Matching Figma */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(238deg, rgba(248, 244, 11, 0.2) 41%, rgba(255, 140, 0, 0.2) 50%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col items-center text-center">
        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white drop-shadow-lg leading-tight capitalize max-w-4xl whitespace-pre-line">
          {title}
        </h1>
        
        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg font-medium text-white/95 mt-3 sm:mt-4 max-w-2xl lg:max-w-3xl drop-shadow-md">
          {subtitle}
        </p>
 
        {/* Search Bar */}
        <div className="mt-5 sm:mt-6 md:mt-8 w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl flex items-center bg-white rounded-[30px] overflow-hidden shadow-2xl h-12 sm:h-12 md:h-14 lg:h-[60px]">
          <div className="pl-5 md:pl-6 text-[#cbc6c6] flex items-center justify-center">
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="flex-1 px-3 md:px-4 text-sm md:text-base lg:text-lg font-semibold text-text-main outline-none bg-transparent placeholder:text-[#cbc6c6] capitalize"
          />
          <button className="bg-brand-coral hover:bg-brand-coral/90 text-white px-5 md:px-[26px] lg:px-[33px] h-full transition-colors cursor-pointer flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
