"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UMKM_DASHBOARD_MOCK_DATA } from "@/data/umkmDashboard";
import { cn } from "@/lib/utils";

export default function UmkmDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7 Hari Terakhir");
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const data = UMKM_DASHBOARD_MOCK_DATA;
  const { campaign, escrow, submissions, chartData } = data;

  const chartData7d = chartData;
  const chartData30d = [
    { day: "01-05", value: "95k", percent: 55, active: false },
    { day: "06-10", value: "115k", percent: 65, active: false },
    { day: "11-15", value: "140k", percent: 80, active: false },
    { day: "16-20", value: "130k", percent: 75, active: false },
    { day: "21-25", value: "165k", percent: 95, active: false },
    { day: "26-30", value: "184k", percent: 100, active: true },
    { day: "Hari Ini", value: "42k", percent: 30, active: false }
  ];

  const activeChartData = selectedTimeRange === "7 Hari Terakhir" ? chartData7d : chartData30d;

  // click outside to close dropdown
  useEffect(() => {
    if (!isTimeDropdownOpen) return;
    const handleClose = () => setIsTimeDropdownOpen(false);
    document.addEventListener("click", handleClose);
    return () => document.removeEventListener("click", handleClose);
  }, [isTimeDropdownOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTimeDropdownOpen(!isTimeDropdownOpen);
  };

  const handleSelect = (option: string) => {
    setSelectedTimeRange(option);
    setIsTimeDropdownOpen(false);
  };

  return (
    <div className="flex min-h-screen dashboard-wrapper relative text-neutral-900 antialiased selection:bg-primary-100 selection:text-primary-900 font-sans">
      {/* Styles Block for premium bento glassmorphic dashboard animations and styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-wrapper {
          background: var(--bg-main);
          background-attachment: fixed;
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
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
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
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
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
              <p className="text-[10px] text-white/40 mt-1.5 font-medium tracking-widest uppercase">{data.businessName}</p>
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
            <li>
              <Link className="flex items-center gap-3 nav-item-active px-4 py-3 relative overflow-hidden group" href="/dashboard/umkm">
                <span className="text-primary group-hover:scale-105 transition-transform duration-200">
                  {/* Dashboard Grid SVG */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </span>
                <span className="text-sm font-bold tracking-wide">Dashboard</span>
              </Link>
            </li>
            
            <li>
              <Link className="flex items-center gap-3 nav-item-inactive px-4 py-3 rounded-xl text-sm group" href="#">
                <span className="icon-container group-hover:scale-110 transition-all duration-200">
                  {/* Campaign Megaphone SVG */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </span>
                <span className="font-semibold">Campaign Saya</span>
              </Link>
            </li>
            
            <li>
              <Link className="flex items-center gap-3 nav-item-inactive px-4 py-3 rounded-xl text-sm group" href="#">
                <span className="icon-container group-hover:scale-110 transition-all duration-200">
                  {/* Buat Campaign Plus Circle SVG */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
                  </svg>
                </span>
                <span className="font-semibold">Buat Campaign</span>
              </Link>
            </li>
            
            <li>
              <Link className="flex items-center gap-3 nav-item-inactive px-4 py-3 rounded-xl text-sm group" href="#">
                <span className="icon-container group-hover:scale-110 transition-all duration-200">
                  {/* Kreator Users SVG */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span className="font-semibold">Kreator</span>
              </Link>
            </li>
            
            <li>
              <Link className="flex items-center gap-3 nav-item-inactive px-4 py-3 rounded-xl text-sm group" href="#">
                <span className="icon-container group-hover:scale-110 transition-all duration-200">
                  {/* Negosiasi Handshake SVG */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
                <span className="font-semibold">Negosiasi</span>
              </Link>
            </li>
            
            <li>
              <Link className="flex items-center gap-3 nav-item-inactive px-4 py-3 rounded-xl text-sm group" href="#">
                <span className="icon-container group-hover:scale-110 transition-all duration-200">
                  {/* Keuangan Wallet SVG */}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </span>
                <span className="font-semibold">Keuangan</span>
              </Link>
            </li>
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
      <main className="lg:ml-[280px] lg:w-[calc(100%-280px)] w-full min-h-screen flex flex-col">
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                alt="Dapur Sehat Sukabumi" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDJh8BEYVCLcj-BjHUl0GKUwUU0yp9_SB65sdKYxzbuAY-yJMGqbV0NTcoy03pdf7Gq7G3fCt8XLHyNCLfcN3ONcIaSvcJia5eLMQI8_5P9bt9bLx1k-PYinTGRB5RY7ZoL6AzYLgTXS8P7LumfH-nfAwAtWUF5bDgFn5Kio2Vk1NthhmuSRHYqV_bhFB2-KxjJxJ716MpYQqTL5KX76AFPKsUXks7Q-BM5PlUYMSUDzj_2_y1uGXTXvL4yRg4NHCy_Pj6j6rZSIzX"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      alt="Sambal Matah" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyf1KY8klccty8IMDWFK-BlEo9nmtsXVTGH2L8AHPvyZwlK2Tt5p1E63SRAwkJttok9Z5sBdY4QQrDVSgjDXWrV3PbzUfs8qnLx3PSp_vaXqA-sHNfkdpVfAJCFzJbfyscn_582cxG3ERa1oXj2LctbNbA_Ym2VnFMbbGjCzdHwMf71p0nA6cns9agJd-9AWNyhBw5GGMHA5EZuwJVFvVFifp9rmT0TjD__tLgDygzBUL7HgFmAG-6M7Mmk1IITUYY4CVJ-7wSG8wk"
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

            {/* 4. Performance Views Chart Card (col-span-7) */}
            <div className="bento-card col-span-12 lg:col-span-7 relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-50/40 pointer-events-none rounded-2xl z-0"></div>
              
              <div className="flex justify-between items-center mb-8 relative z-20">
                <div>
                  <h3 className="text-lg text-neutral-900 font-extrabold">Performa Views</h3>
                  <p className="text-xs text-neutral-400 mt-1 font-bold uppercase tracking-wider">Total akumulasi dari semua platform</p>
                </div>
                
                {/* Beautiful custom styled dropdown */}
                <div className="relative inline-block text-left">
                  <button
                    onClick={toggleDropdown}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all duration-300 rounded-full border cursor-pointer select-none",
                      isTimeDropdownOpen
                        ? "bg-primary-50 border-primary text-primary shadow-[0_0_12px_rgba(249,115,22,0.15)] scale-102"
                        : "bg-bg-section/80 hover:bg-bg-section border-primary hover:border-primary-600 hover:shadow-sm text-neutral-700"
                    )}
                  >
                    <span>{selectedTimeRange}</span>
                    <svg 
                      className={cn(
                        "w-3 h-3 transition-transform duration-300", 
                        isTimeDropdownOpen ? "rotate-180 text-primary" : "text-neutral-400"
                      )} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu List */}
                  {isTimeDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2.5 w-48 origin-top-right rounded-2xl bg-bg-section border border-border-soft p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl z-30 animate-in fade-in slide-in-from-top-2 duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleSelect("7 Hari Terakhir")}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between",
                          selectedTimeRange === "7 Hari Terakhir"
                            ? "bg-primary-50 text-primary"
                            : "text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                        )}
                      >
                        <span>7 Hari Terakhir</span>
                        {selectedTimeRange === "7 Hari Terakhir" && (
                          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleSelect("30 Hari Terakhir")}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between mt-1",
                          selectedTimeRange === "30 Hari Terakhir"
                            ? "bg-primary-50 text-primary"
                            : "text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                        )}
                      >
                        <span>30 Hari Terakhir</span>
                        {selectedTimeRange === "30 Hari Terakhir" && (
                          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Chart Grid & Rounded Bars */}
              <div className="h-56 w-full flex items-end justify-between gap-1.5 sm:gap-3 px-1 sm:px-2 mt-auto relative z-10">
                {/* Horizontal Dashed Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none pb-8 opacity-25">
                  <div className="w-full border-t border-dashed border-neutral-300"></div>
                  <div className="w-full border-t border-dashed border-neutral-300"></div>
                  <div className="w-full border-t border-dashed border-neutral-300"></div>
                  <div className="w-full border-t border-dashed border-neutral-300"></div>
                </div>

                {/* Day Bars */}
                {activeChartData.map((bar, i) => (
                  <div key={i} className="w-full flex flex-col justify-end items-center group/bar relative h-full z-10">
                    {/* Tooltip on Hover */}
                    <div className={`absolute -top-10 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform group-hover/bar:-translate-y-1 shadow-lg font-bold after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent ${
                      bar.active 
                        ? "bg-gradient-to-r from-primary to-primary-700 after:border-t-primary shadow-[0_4px_12px_rgba(249,115,22,0.3)]" 
                        : "bg-secondary-800 after:border-t-secondary-800"
                    }`}>
                      {bar.value}
                    </div>

                    {/* Bar graphic */}
                    <div 
                      className={`chart-bar transition-all duration-300 rounded-t-xl ${
                        bar.active 
                          ? "bg-gradient-to-t from-primary-700 to-primary shadow-[0_0_20px_rgba(249,115,22,0.3)]" 
                          : ""
                      }`} 
                      style={{ height: `${bar.percent}%` }}
                    >
                      {bar.active && (
                        <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full animate-[shimmer_3s_infinite]"></div>
                      )}
                    </div>
                    
                    {/* Day label */}
                    <span className={`text-[10px] sm:text-[11px] mt-3 font-bold transition-all duration-200 ${
                      bar.active 
                        ? "text-primary bg-primary-50 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-primary-100/50" 
                        : "text-neutral-500"
                    }`}>
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
