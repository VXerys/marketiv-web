"use client";

import { EscrowOverview } from "@/types/umkm-dashboard.types";
import { DashboardCard } from "../shared/DashboardCard";
import { formatCurrency } from "@/lib/formatters";

interface EscrowOverviewCardProps {
  overview: EscrowOverview;
}

export function EscrowOverviewCard({ overview }: EscrowOverviewCardProps) {
  // Escrow flow steps definitions
  const steps = [
    { number: "1", title: "Deposit Pembayaran", desc: "UMKM bayar lunas di depan" },
    { number: "2", title: "Sistem Escrow", desc: "Dana dikunci aman platform" },
    { number: "3", title: "Validasi Post / Deal", desc: "Kreator submit posting/collab" },
    { number: "4", title: "Dana Rilis / Refund", desc: "Pecah saldo ke dompet kreator" },
  ];

  return (
    <DashboardCard variant="default" className="p-5 sm:p-6 space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-text-primary tracking-tight">
            Sistem Perlindungan Escrow (Rekening Bersama)
          </h2>
          <p className="text-xs text-text-muted">
            Bagaimana platform mengamankan dana kolaborasi Anda hingga pekerjaan selesai.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-soft text-success-strong text-[11px] font-bold border border-success-soft shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Escrow Terlindungi
        </span>
      </div>

      {/* Stepper Diagram */}
      <div className="relative py-4 bg-neutral-50/50 rounded-2xl border border-neutral-200/40 p-4 overflow-x-auto select-none">
        <div className="flex items-start justify-between min-w-[640px] gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center text-center relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="absolute top-4.5 left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] h-0.5 bg-neutral-200" />
              )}
              
              {/* Step Circle */}
              <div className="w-9 h-9 rounded-full bg-white border-2 border-primary/20 text-primary flex items-center justify-center font-extrabold text-xs shadow-2xs shrink-0 z-10 transition-all hover:border-primary">
                {step.number}
              </div>

              {/* Step Label */}
              <div className="mt-2.5 space-y-0.5 max-w-[150px]">
                <h4 className="text-[11px] font-extrabold text-text-secondary leading-snug">{step.title}</h4>
                <p className="text-[9.5px] text-text-muted leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campaign Mode Escrow Info */}
        <div className="p-4 bg-neutral-50/60 rounded-xl border border-neutral-200/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-coral/5 border border-brand-coral/10 flex items-center justify-center shrink-0 text-primary">
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex justify-between items-baseline gap-2">
              <h4 className="text-xs font-black text-text-primary">Campaign Mode</h4>
              <span className="text-[10px] font-extrabold text-text-muted">Fee Platform 15%</span>
            </div>
            <p className="text-[10.5px] text-text-muted leading-normal">
              Pay-per-view. Budget campaign didepositkan di awal dan dipotong platform fee 15%. Dana dirilis ke dompet kreator sebanding dengan tayangan (views) postingan yang valid diakumulasikan.
            </p>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-text-secondary font-medium">Dana Escrow Campaign:</span>
              <strong className="text-text-primary font-extrabold">{formatCurrency(overview.campaignEscrow)}</strong>
            </div>
          </div>
        </div>

        {/* Rate Card Mode Escrow Info */}
        <div className="p-4 bg-neutral-50/60 rounded-xl border border-neutral-200/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-navy/5 border border-brand-navy/10 flex items-center justify-center shrink-0 text-brand-navy">
            <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex justify-between items-baseline gap-2">
              <h4 className="text-xs font-black text-text-primary">Rate Card Mode</h4>
              <span className="text-[10px] font-extrabold text-text-muted">Fee Platform 10%</span>
            </div>
            <p className="text-[10.5px] text-text-muted leading-normal">
              Harga tetap & negosiasi langsung. Dana pesanan dikunci di escrow (dipotong platform fee 10%). Rilis dana dilakukan setelah kreator mengunggah tautan Instagram/TikTok Collab Post.
            </p>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-text-secondary font-medium">Dana Escrow Rate Card:</span>
              <strong className="text-text-primary font-extrabold">{formatCurrency(overview.rateCardEscrow)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow summary numbers */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4.5 pt-1.5 text-center text-xs">
        <div className="p-3 bg-brand-coral/5 rounded-xl border border-brand-coral/10">
          <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Total Aktif Escrow</span>
          <strong className="text-sm font-black text-primary block mt-1">{formatCurrency(overview.activeEscrow)}</strong>
        </div>
        <div className="p-3 bg-neutral-100/60 rounded-xl border border-neutral-200/30">
          <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Menunggu Rilis</span>
          <strong className="text-sm font-black text-text-primary block mt-1">{formatCurrency(overview.pendingRelease)}</strong>
        </div>
        <div className="p-3 bg-neutral-100/60 rounded-xl border border-neutral-200/30">
          <span className="text-[9px] font-extrabold text-text-muted uppercase tracking-wider block">Bisa Di-refund</span>
          <strong className="text-sm font-black text-text-primary block mt-1">{formatCurrency(overview.refundEligible)}</strong>
        </div>
      </div>
    </DashboardCard>
  );
}
