"use client";

import { useState } from "react";
import Link from "next/link";
import { CreatorActiveWork } from "@/types/creator-dashboard";
import { CreatorPageHeader } from "./CreatorPageHeader";
import { CreatorMetricCard } from "./CreatorMetricCard";
import { CreatorStatusBadge } from "./CreatorStatusBadge";
import { CreatorEmptyState } from "./CreatorEmptyState";
import { CreatorErrorState } from "./CreatorErrorState";
import { CreatorCardSkeleton, CreatorMetricSkeleton } from "./CreatorSkeleton";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface PekerjaanAktifViewProps {
  initialWorks: CreatorActiveWork[];
}

export function PekerjaanAktifView({ initialWorks }: PekerjaanAktifViewProps) {
  const [works] = useState<CreatorActiveWork[]>(initialWorks);

  // Filters & Sorting state
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDeadline, setSelectedDeadline] = useState("all"); // 'all' | 'soon' | 'later'
  const [sortBy, setSortBy] = useState("nearest-deadline"); // 'nearest-deadline' | 'latest-claimed'

  // Slicing State Simulators (DoD)
  const [isLoadingSimulated, setIsLoadingSimulated] = useState(false);
  const [isErrorSimulated, setIsErrorSimulated] = useState(false);
  const [isEmptySimulated, setIsEmptySimulated] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedStatus("all");
    setSelectedDeadline("all");
    setSortBy("nearest-deadline");
  };

  // Helper: check submission status
  const getSubStatusLabel = (work: CreatorActiveWork): string => {
    if (work.submissionStatus) {
      if (work.submissionStatus === "Pending") return "Menunggu Validasi";
      if (work.submissionStatus === "Valid") return "Valid";
      if (work.submissionStatus === "Fraud") return "Fraud";
      if (work.submissionStatus === "Dispute") return "Dispute";
      if (work.submissionStatus === "Rejected") return "Rejected";
    }
    if (work.status === "Selesai") return "Selesai";
    return "Belum Submit";
  };

  // Summary counts
  const countBelumSubmit = works.filter(w => !w.submissionStatus && w.status === "Aktif").length;
  const countPending = works.filter(w => w.submissionStatus === "Pending").length;
  const countValid = works.filter(w => w.submissionStatus === "Valid" || w.status === "Selesai").length;
  const countReviewFraud = works.filter(w => w.submissionStatus === "Fraud" || w.submissionStatus === "Dispute" || w.submissionStatus === "Rejected").length;

  const getDaysRemaining = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Melewati batas", days: diffDays };
    if (diffDays === 0) return { text: "Hari ini", days: 0 };
    return { text: `${diffDays} hari lagi`, days: diffDays };
  };

  // Filtering & Sorting logic
  const filteredWorks = works
    .filter((w) => {
      const matchesSearch =
        w.title.toLowerCase().includes(search.toLowerCase()) ||
        w.brandName.toLowerCase().includes(search.toLowerCase()) ||
        w.brief.toLowerCase().includes(search.toLowerCase());

      const subStatus = getSubStatusLabel(w);
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "belum-submit" && subStatus === "Belum Submit") ||
        (selectedStatus === "pending" && subStatus === "Menunggu Validasi") ||
        (selectedStatus === "valid" && (subStatus === "Valid" || subStatus === "Selesai")) ||
        (selectedStatus === "review-fraud" && (subStatus === "Fraud" || subStatus === "Dispute" || subStatus === "Rejected"));

      const { days } = getDaysRemaining(w.deadline);
      const matchesDeadline =
        selectedDeadline === "all" ||
        (selectedDeadline === "soon" && days >= 0 && days <= 5) ||
        (selectedDeadline === "later" && days > 5);

      return matchesSearch && matchesStatus && matchesDeadline;
    })
    .sort((a, b) => {
      if (sortBy === "nearest-deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      // default: latest-claimed
      return new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime();
    });

  const hasActiveFilters = search !== "" || selectedStatus !== "all" || selectedDeadline !== "all";

  // Error simulation
  if (isErrorSimulated) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-center items-center min-h-[80vh]">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4.5 mb-8 max-w-md w-full flex items-center justify-between shadow-sm text-xs font-semibold text-red-800">
          <span>Mode Uji Coba Error Aktif.</span>
          <button
            onClick={() => setIsErrorSimulated(false)}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all cursor-pointer font-bold"
          >
            Matikan Mode Error
          </button>
        </div>
        <CreatorErrorState
          errorMsg="Gagal memuat pekerjaan aktif Anda karena masalah koneksi database."
          onRetry={() => {
            setIsErrorSimulated(false);
            showToast("Data pekerjaan aktif berhasil dipulihkan!");
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs font-bold py-3 px-5 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2">
          <svg className="w-4.5 h-4.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Simulator Control Panel */}
      <div className="mb-6 bg-white/70 backdrop-blur-md border border-neutral-200/50 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-xs font-bold text-neutral-700 shrink-0">
        <div className="flex items-center gap-2 text-neutral-900">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
          <span>Panel Simulator State (Pekerjaan Aktif Slicing):</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsLoadingSimulated(!isLoadingSimulated)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer",
              isLoadingSimulated
                ? "bg-primary text-white border-primary-600"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
            )}
          >
            {isLoadingSimulated ? "Matikan Shimmer" : "Simulasi Shimmer"}
          </button>
          <button
            onClick={() => setIsEmptySimulated(!isEmptySimulated)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer",
              isEmptySimulated
                ? "bg-primary text-white border-primary-600"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
            )}
          >
            {isEmptySimulated ? "Matikan Empty" : "Simulasi Empty"}
          </button>
          <button
            onClick={() => setIsErrorSimulated(true)}
            className="px-3.5 py-1.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            Simulasi Error
          </button>
        </div>
      </div>

      {isLoadingSimulated ? (
        <div>
          <CreatorMetricSkeleton />
          <div className="h-10 bg-white border border-neutral-200/50 rounded-xl animate-pulse w-full mb-6"></div>
          <CreatorCardSkeleton count={3} />
        </div>
      ) : (
        <div>
          {/* Header */}
          <CreatorPageHeader
            title="Pekerjaan Aktif"
            description="Pantau campaign yang sudah kamu klaim."
          />

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <CreatorMetricCard
              label="Belum Submit"
              value={countBelumSubmit}
              helperText="Butuh posting bukti"
              icon={
                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
            <CreatorMetricCard
              label="Menunggu Validasi"
              value={countPending}
              helperText="Sedang diaudit"
              variant="orange"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <CreatorMetricCard
              label="Valid"
              value={countValid}
              helperText="Reward siap cair"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <CreatorMetricCard
              label="Perlu Review / Fraud"
              value={countReviewFraud}
              helperText="Ada kendala konten"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              }
            />
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6 bg-white/80 border border-neutral-200/50 p-4 rounded-2xl">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari pekerjaan / brand..."
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-neutral-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-neutral-800 placeholder-neutral-400"
                />
              </div>

              {/* Status Select */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200/60 rounded-xl text-sm font-bold text-neutral-700 cursor-pointer focus:outline-none min-w-[150px]"
              >
                <option value="all">Semua Status</option>
                <option value="belum-submit">Belum Submit</option>
                <option value="pending">Menunggu Validasi</option>
                <option value="valid">Valid / Selesai</option>
                <option value="review-fraud">Review / Fraud / Dispute</option>
              </select>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Deadline Filter */}
              <select
                value={selectedDeadline}
                onChange={(e) => setSelectedDeadline(e.target.value)}
                className="px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200/60 rounded-xl text-xs font-bold text-neutral-700 cursor-pointer focus:outline-none min-w-[140px]"
              >
                <option value="all">Semua Batas Waktu</option>
                <option value="soon">Segera (≤ 5 hari)</option>
                <option value="later">Masih Lama (&gt; 5 hari)</option>
              </select>

              {/* Sorting Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200/60 rounded-xl text-xs font-bold text-neutral-700 cursor-pointer focus:outline-none min-w-[150px]"
              >
                <option value="nearest-deadline">Urutan Deadline Terdekat</option>
                <option value="latest-claimed">Baru Diklaim</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Grid Content */}
          {isEmptySimulated || filteredWorks.length === 0 ? (
            <CreatorEmptyState
              title="Belum ada pekerjaan aktif"
              description={
                isEmptySimulated
                  ? "Kamu belum mengklaim campaign apa pun dari pool pekerjaan."
                  : "Tidak ada pekerjaan aktif yang cocok dengan filter pencarianmu."
              }
              actionButton={
                isEmptySimulated ? (
                  <Link
                    href="/dashboard/kreator/job-pool"
                    className="bg-primary hover:bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all border border-primary-600/10 shadow-md inline-block"
                  >
                    Cari Job di Job Pool
                  </Link>
                ) : (
                  <button
                    onClick={handleClearFilters}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs px-5 py-2.5 rounded-full transition-all border border-neutral-300"
                  >
                    Reset Filter
                  </button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => {
                const subStatus = getSubStatusLabel(work);
                const hasSubmitted = !!work.contentUrl;
                const { text: deadlineText, days } = getDaysRemaining(work.deadline);

                // Set estimated earning label
                let earningLabel = "Estimasi Pendapatan";
                let earningVal = work.ratePerThousandViews * 50; // default mock views 50k
                if (subStatus === "Valid" || subStatus === "Selesai") {
                  earningLabel = "Pendapatan Dirilis";
                  earningVal = work.earnings || 0;
                }

                return (
                  <div
                    key={work.id}
                    className="bg-white/95 border border-neutral-200/50 shadow-sm rounded-3xl p-6 hover:shadow-md transition-all flex flex-col justify-between h-full group"
                  >
                    <div>
                      {/* Brand Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl border border-neutral-200/30 overflow-hidden shrink-0 bg-neutral-50 flex items-center justify-center">
                          {work.brandAvatar ? (
                            <img
                              src={work.brandAvatar}
                              alt={work.brandName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-bold text-neutral-400">B</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-neutral-900 group-hover:text-primary transition-colors text-sm truncate leading-tight">
                            {work.title}
                          </h4>
                          <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-wider">
                            {work.brandName}
                          </p>
                        </div>
                        
                        <CreatorStatusBadge
                          status={subStatus}
                          type="claim"
                        />
                      </div>

                      {/* Brief preview */}
                      <p className="text-xs text-neutral-500 font-semibold leading-relaxed mb-4 line-clamp-2">
                        {work.brief}
                      </p>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-3 py-3 px-4 rounded-2xl bg-neutral-50 border border-neutral-200/20 mb-4 text-xs font-semibold">
                        <div>
                          <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Deadline</span>
                          <span
                            className={cn(
                              "block font-black mt-0.5",
                              days < 0 ? "text-red-500" : days <= 3 && !hasSubmitted ? "text-amber-600" : "text-neutral-900"
                            )}
                          >
                            {deadlineText}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{earningLabel}</span>
                          <span className="block font-black text-neutral-900 mt-0.5">
                            {formatCurrency(earningVal)}
                          </span>
                        </div>
                      </div>

                      {/* URL Preview if available */}
                      {work.contentUrl && (
                        <div className="bg-neutral-50/50 border border-neutral-100 rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[9px] text-neutral-400 uppercase tracking-wider">Link Video</span>
                          <a
                            href={work.contentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-primary truncate max-w-[180px] hover:underline"
                          >
                            {work.contentUrl}
                          </a>
                        </div>
                      )}

                      {/* Fraud alert if present */}
                      {work.submissionStatus === "Fraud" && work.rejectedReason && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-[10px] font-bold text-red-800">
                          ⚠️ {work.rejectedReason}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                      <Link
                        href={`/dashboard/kreator/pekerjaan-aktif/${work.id}`}
                        className="w-full text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-extrabold text-xs py-3 rounded-xl transition-all border border-neutral-300/40"
                      >
                        Lihat Detail
                      </Link>
                      
                      {!hasSubmitted ? (
                        <Link
                          href={`/dashboard/kreator/pekerjaan-aktif/${work.id}`}
                          className="w-full text-center bg-primary hover:bg-primary-600 text-white font-extrabold text-xs py-3 rounded-xl transition-all border border-primary-600/10 shadow-sm"
                        >
                          Submit Bukti
                        </Link>
                      ) : (
                        <div className="w-full flex items-center justify-center bg-neutral-50 border border-neutral-200/50 text-[10px] font-black uppercase text-neutral-400 rounded-xl tracking-wider select-none text-center">
                          Sudah Kirim
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
