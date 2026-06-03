import Image from "next/image";
import { UmkmDashboardChrome } from "@/components/features/dashboard/UmkmDashboardChrome";
import { UmkmViewsChartCard } from "@/components/features/dashboard/UmkmViewsChartCard";
import { UMKM_DASHBOARD_MOCK_DATA } from "@/data/umkmDashboard";

const CAMPAIGN_THUMBNAIL_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAyf1KY8klccty8IMDWFK-BlEo9nmtsXVTGH2L8AHPvyZwlK2Tt5p1E63SRAwkJttok9Z5sBdY4QQrDVSgjDXWrV3PbzUfs8qnLx3PSp_vaXqA-sHNfkdpVfAJCFzJbfyscn_582cxG3ERa1oXj2LctbNbA_Ym2VnFMbbGjCzdHwMf71p0nA6cns9agJd-9AWNyhBw5GGMHA5EZuwJVFvVFifp9rmT0TjD__tLgDygzBUL7HgFmAG-6M7Mmk1IITUYY4CVJ-7wSG8wk";

export default function UmkmDashboardPage() {
  const data = UMKM_DASHBOARD_MOCK_DATA;
  const { campaign, escrow, submissions, chartData } = data;

  return (
    <UmkmDashboardChrome businessName={data.businessName}>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Welcome Header */}
        <div className="mb-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 mb-2 tracking-tight leading-tight">{data.greeting}</h2>
          <p className="text-base lg:text-lg text-neutral-500 font-semibold">{data.subtitle}</p>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">

          {/* 1. Main Campaign Summary (Large Bento Card) */}
          <div className="bento-card col-span-12 lg:col-span-7 relative overflow-hidden group">
            {/* Blur accent glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-500 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 z-10 relative">
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] overflow-hidden shadow-md border border-border-subtle shrink-0">
                  <Image
                    alt="Sambal Matah"
                    className="w-full h-full object-cover"
                    src={CAMPAIGN_THUMBNAIL_IMAGE_URL}
                    width={64}
                    height={64}
                    sizes="(max-width: 640px) 56px, 64px"
                    quality={75}
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl text-neutral-900 font-extrabold tracking-tight leading-tight">{campaign.title}</h3>
                    <span className="bg-green-50 text-green-700 text-[11px] px-3 py-0.5 rounded-full border border-green-200/60 shadow-sm flex items-center gap-1.5 font-bold uppercase tracking-wider shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {campaign.status}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-neutral-500 font-bold uppercase tracking-wider leading-relaxed">{campaign.description}</p>
                </div>
              </div>

              {/* Visual Icon Menu */}
              <button className="text-neutral-400 hover:text-primary transition-colors w-8 h-8 rounded-full hover:bg-neutral-50 flex items-center justify-center shadow-sm border border-neutral-100 bg-white">
                {/* Three Dots Icon SVG */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {/* Glass Sub-card for Metrics */}
            <div className="glass-panel rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 mb-8 mt-2 z-10 relative shadow-sm border border-white/60">
              <div className="relative border-b sm:border-b-0 border-neutral-200/60 pb-4 sm:pb-0 sm:after:content-[''] sm:after:absolute sm:after:right-0 sm:after:top-1/2 sm:after:-translate-y-1/2 sm:after:h-12 sm:after:w-px sm:after:bg-neutral-200/80">
                <p className="text-[10px] font-bold text-neutral-500 mb-1.5 uppercase tracking-wider">Total Views</p>
                <p className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-none">{campaign.totalViews.toLocaleString("id-ID")}</p>
                <p className="text-[10px] text-green-600 font-bold mt-1.5 flex items-center gap-0.5 uppercase tracking-wider">
                  {/* Trending Up SVG */}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8L13 14l-4-4-6 6" />
                  </svg>
                  {campaign.viewsTrend}
                </p>
              </div>

              <div className="relative border-b sm:border-b-0 border-neutral-200/60 pb-4 sm:pb-0 sm:after:content-[''] sm:after:absolute sm:after:right-0 sm:after:top-1/2 sm:after:-translate-y-1/2 sm:after:h-12 sm:after:w-px sm:after:bg-neutral-200/80">
                <p className="text-[10px] font-bold text-neutral-500 mb-1.5 uppercase tracking-wider">Budget Terpakai</p>
                <p className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-none">Rp {(campaign.budgetUsed / 1000000).toFixed(1)}Jt</p>
                <p className="text-[10px] text-neutral-400 font-bold mt-1.5 uppercase tracking-wider">Dari Rp {(campaign.budgetTotal / 1000000).toFixed(1)}Jt</p>
              </div>

              <div className="relative pt-2 sm:pt-0">
                <p className="text-[10px] font-bold text-neutral-500 mb-1.5 uppercase tracking-wider">Kreator Aktif</p>
                <div className="flex items-baseline gap-0.5 leading-none">
                  <p className="text-2xl font-extrabold text-neutral-900 tracking-tight">{campaign.activeCreatorsCount}</p>
                  <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">/ {campaign.targetCreatorsCount}</p>
                </div>
                {/* Avatar stack */}
                <div className="flex -space-x-2.5 mt-2.5">
                  <div className="w-6 h-6 rounded-full bg-primary border-2 border-white shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-secondary border-2 border-white shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-neutral-300 border-2 border-white shadow-sm"></div>
                  <div className="w-6 h-6 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-[9px] font-bold text-neutral-500 shadow-sm">+5</div>
                </div>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="mt-auto z-10 relative">
              <div className="flex justify-between text-xs mb-3 font-bold">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Progress Budget</span>
                <span className="text-primary bg-primary-50 border border-primary-100/50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">{campaign.progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200/60 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full relative overflow-hidden"
                  style={{ width: `${campaign.progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full animate-[shimmer_2.5s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Escrow Budget (Premium Financial Card) (col-span-5) */}
          <div className="bento-card col-span-12 lg:col-span-5 glass-panel-dark text-white relative overflow-hidden shadow-[0_20px_50px_rgba(16,32,51,0.2)]">
            {/* Subtle watermark shield lock background */}
            <div className="absolute right-2 top-2 opacity-[0.03] text-white pointer-events-none transform translate-x-4 -translate-y-4 scale-125">
              <svg className="w-48 h-48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-8">
                {/* Glassy badge */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                  <span>
                    {/* Shield Check SVG */}
                    <svg className="w-4 h-4 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <h3 className="text-[10px] text-primary-200 uppercase tracking-widest font-extrabold">Escrow Balance</h3>
                </div>

                <span className="relative">
                  {/* Glowing Spark/Star from example image 3 */}
                  <svg className="w-5 h-5 text-primary-300 animate-[pulse_3s_infinite] filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                  </svg>
                </span>
              </div>

              <div className="my-auto py-2">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Total Saldo Aman</p>
                <p className="text-4xl lg:text-[44px] mb-4 font-extrabold tracking-tight leading-none drop-shadow-sm">
                  Rp {escrow.totalAmount.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-white/70 leading-relaxed max-w-[90%] border-l-2 border-primary/50 pl-3">
                  {escrow.infoText}
                </p>
              </div>

              <button className="mt-8 w-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm py-3.5 rounded-xl transition-all border border-white/15 backdrop-blur-md shadow-lg flex items-center justify-center gap-2 group hover:shadow-xl">
                <span>Riwayat Transaksi</span>
                <span>
                  {/* Simple Right Arrow SVG */}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* 3. Submission Review Card (col-span-5) */}
          <div className="bento-card col-span-12 lg:col-span-5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg text-neutral-900 font-extrabold flex items-center gap-3">
                <span>Review Bukti</span>
                <span className="bg-red-50 text-red-600 text-xs w-6 h-6 rounded-full flex items-center justify-center border border-red-200/80 font-bold shadow-sm">
                  {submissions.length}
                </span>
              </h3>
              <button className="text-primary text-xs font-bold hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider">
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3.5">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-neutral-50/80 transition-all cursor-pointer border border-neutral-100 hover:border-white group hover:shadow-[0_8px_24px_rgba(16,32,51,0.03)] bg-white/50"
                >
                  {/* Platform SVG */}
                  {sub.platform === "tiktok" ? (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-955 font-bold group-hover:text-primary transition-colors">{sub.creatorName}</p>
                    <p className="text-xs text-neutral-500 font-semibold truncate mt-0.5">{sub.campaignTitle}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-200/50 shadow-sm">
                      {sub.status}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-semibold">{sub.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <UmkmViewsChartCard chartData={chartData} />

        </div>
      </div>
    </UmkmDashboardChrome>
  );
}
