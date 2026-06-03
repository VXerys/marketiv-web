"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

const PROFILE_AVATAR_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCDJh8BEYVCLcj-BjHUl0GKUwUU0yp9_SB65sdKYxzbuAY-yJMGqbV0NTcoy03pdf7Gq7G3fCt8XLHyNCLfcN3ONcIaSvcJia5eLMQI8_5P9bt9bLx1k-PYinTGRB5RY7ZoL6AzYLgTXS8P7LumfH-nfAwAtWUF5bDgFn5Kio2Vk1NthhmuSRHYqV_bhFB2-KxjJxJ716MpYQqTL5KX76AFPKsUXks7Q-BM5PlUYMSUDzj_2_y1uGXTXvL4yRg4NHCy_Pj6j6rZSIzX";

type SidebarNavIcon = "dashboard" | "campaign" | "plus" | "users" | "chat" | "wallet";

interface SidebarNavItem {
  label: string;
  href: string;
  icon: SidebarNavIcon;
  isActive?: boolean;
}

const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { label: "Dashboard", href: "/dashboard/umkm", icon: "dashboard", isActive: true },
  { label: "Campaign Saya", href: "#", icon: "campaign" },
  { label: "Buat Campaign", href: "#", icon: "plus" },
  { label: "Kreator", href: "#", icon: "users" },
  { label: "Negosiasi", href: "#", icon: "chat" },
  { label: "Keuangan", href: "#", icon: "wallet" },
];

interface UmkmDashboardChromeProps {
  businessName: string;
  children: ReactNode;
}

interface SidebarIconProps {
  icon: SidebarNavIcon;
}

function SidebarIcon({ icon }: SidebarIconProps) {
  switch (icon) {
    case "dashboard":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "campaign":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    case "plus":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
        </svg>
      );
    case "users":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "chat":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case "wallet":
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
  }
}

export function UmkmDashboardChrome({ businessName, children }: UmkmDashboardChromeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen dashboard-wrapper relative overflow-x-hidden text-neutral-900 antialiased selection:bg-primary-100 selection:text-primary-900 font-sans">
      {/* Styles Block for premium bento glassmorphic dashboard animations and styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-wrapper {
          background: var(--bg-main);
        }

        .topbar-glass {
          background: rgba(247, 243, 238, 0.4);
          border-bottom: 1px solid var(--border-soft);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .sidebar-premium {
          background: linear-gradient(180deg, var(--navy-soft) 0%, var(--navy-card) 52%, var(--navy-main) 100%);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset -1px 0 0 rgba(255, 255, 255, 0.04),
            4px 0 24px rgba(16, 32, 51, 0.03);
        }

        .nav-item-active {
          background: rgba(255, 255, 255, 0.10) !important;
          border: 1px solid rgba(249, 115, 22, 0.32) !important;
          box-shadow: inset 3px 0 0 #F97316;
          border-radius: 12px;
          color: #ffffff !important;
        }

        .nav-item-inactive {
          color: rgba(255, 255, 255, 0.66) !important;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .nav-item-inactive:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff !important;
        }

        .nav-item-inactive .icon-container {
          color: rgba(255, 255, 255, 0.46);
          transition: all 0.2s ease;
        }

        .nav-item-inactive:hover .icon-container {
          color: #ffffff;
        }

        .bento-card {
          background: var(--bg-section);
          border-radius: 28px;
          border: 1px solid var(--border-soft);
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
          padding: 20px; /* Reduced for mobile */
          display: flex;
          flex-direction: column;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }

        @media (min-width: 640px) {
          .bento-card {
            padding: 28px;
          }
        }

        .bento-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.1);
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: minmax(100px, auto);
          gap: 16px; /* Reduced for mobile */
        }

        @media (min-width: 640px) {
          .bento-grid {
            gap: 24px;
          }
        }

        /* Premium chart bar styling */
        .chart-bar {
          background: linear-gradient(180deg, rgba(249, 115, 22, 0.8) 0%, rgba(249, 115, 22, 0.3) 100%);
          border-radius: 12px 12px 0 0;
          width: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .chart-bar::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 100%;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%);
        }

        .chart-bar:hover {
          background: linear-gradient(180deg, #ea580c 0%, rgba(234, 88, 12, 0.5) 100%);
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
        }

        .glass-panel {
          background: var(--surface-card-soft);
          border: 1px solid var(--border-soft);
        }

        .glass-panel-dark {
          background:
            radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(31, 127, 212, 0.2) 0%, transparent 60%),
            linear-gradient(135deg, var(--navy-soft) 0%, var(--navy-card) 50%, var(--navy-main) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 1px rgba(255, 255, 255, 0.05),
            0 20px 40px rgba(2, 9, 18, 0.15);
        }

        @keyframes shimmer {
          100% {
            transform: skew(-12deg) translateX(200%);
          }
        }
      `}} />

      {/* SideNavBar backdrop on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SideNavBar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-[280px] sidebar-premium flex flex-col py-8 z-50 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:flex",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header / Brand Logo */}
        <div className="px-6 mb-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.3)]">
              <span className="font-extrabold text-lg text-white">M</span>
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white leading-none tracking-wide">Marketiv</h1>
              <p className="text-[10px] text-white/40 mt-1.5 font-medium tracking-widest uppercase">{businessName}</p>
            </div>
          </div>
          <button
            className="lg:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            {/* Close Icon SVG */}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4">
          <ul className="space-y-1.5">
            {SIDEBAR_NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 group",
                    item.isActive
                      ? "nav-item-active relative overflow-hidden"
                      : "nav-item-inactive rounded-xl text-sm"
                  )}
                  href={item.href}
                >
                  <span
                    className={
                      item.isActive
                        ? "text-primary group-hover:scale-105 transition-transform duration-200"
                        : "icon-container group-hover:scale-110 transition-all duration-200"
                    }
                  >
                    <SidebarIcon icon={item.icon} />
                  </span>
                  <span className={item.isActive ? "text-sm font-bold tracking-wide" : "font-semibold"}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer Section */}
        <div className="mt-auto px-4 pb-4">
          <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06] backdrop-blur-md mb-4">
            <Link className="flex items-center gap-3 text-white/60 hover:text-white py-2 transition-colors text-sm group font-semibold" href="#">
              <span className="text-white/40 group-hover:text-white group-hover:rotate-12 transition-transform duration-200">
                {/* Question Mark SVG */}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.286 7.008c.531-.692 1.41-1.008 2.314-1.008 1.833 0 3.32 1.343 3.32 3 0 1.258-.87 2.062-1.92 2.656-.632.357-.999.85-.999 1.48v.86M12 17h.01" />
                </svg>
              </span>
              <span>Bantuan</span>
            </Link>

            <Link className="flex items-center gap-3 text-white/60 hover:text-white py-2 transition-colors text-sm group font-semibold" href="#">
              <span className="text-white/40 group-hover:text-white group-hover:rotate-90 transition-transform duration-500">
                {/* Gear SVG */}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31 .826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <span>Pengaturan</span>
            </Link>
          </div>

          <Link className="flex items-center gap-3 text-red-300 hover:text-white px-4 py-2 hover:bg-white/[0.04] rounded-xl transition-colors text-sm group font-semibold" href="/">
            <span className="text-red-400/60 group-hover:text-white group-hover:-translate-x-1 transition-transform duration-200">
              {/* Log Out SVG */}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            <span>Keluar</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="lg:ml-[280px] lg:w-[calc(100%_-_280px)] w-full min-w-0 min-h-screen flex flex-col">
        {/* TopNavBar */}
        <header className="topbar-glass sticky top-0 z-40 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 shadow-[0_2px_12px_rgba(16,32,51,0.01)] h-[76px]">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for mobile */}
            <button
              className="lg:hidden p-2 -ml-2 rounded-xl text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              {/* Menu Icon SVG */}
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                {/* Mobile Branding */}
                <div className="lg:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-md">
                  <span className="font-extrabold text-sm text-white">M</span>
                </div>
                <h1 className="font-extrabold text-base lg:text-xl text-neutral-900 leading-none tracking-tight">Dashboard</h1>
              </div>
              <p className="hidden md:block text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1.5">
                Ringkasan performa campaign UMKM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* Notifications Button */}
            <button className="relative text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 transition-all p-3 rounded-full bg-bg-section shadow-sm border border-border-soft group cursor-pointer">
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-bg-section animate-pulse"></span>
              <span>
                {/* Bell Icon SVG */}
                <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </span>
            </button>

            {/* CTA button */}
            <button className="hidden md:inline-flex bg-gradient-to-r from-primary to-primary-600 text-white font-bold text-xs lg:text-sm px-5 lg:px-6 py-2.5 lg:py-3 rounded-full hover:shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all border border-white/20 shadow-md cursor-pointer">
              Buat Campaign Baru
            </button>

            {/* Profile Avatar Card */}
            <div className="w-11 h-11 rounded-full border-2 border-white shadow-[0_4px_12px_rgba(16,32,51,0.08)] overflow-hidden cursor-pointer hover:scale-105 transition-all">
              <Image
                alt="Dapur Sehat Sukabumi"
                className="w-full h-full object-cover"
                src={PROFILE_AVATAR_IMAGE_URL}
                width={44}
                height={44}
                sizes="44px"
                quality={75}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {children}
      </main>
    </div>
  );
}
