import { CampaignStatus, SubmissionStatus, NegotiationOrder, TransactionStatus } from "@/types/umkm-dashboard.types";

export function getCampaignStatusLabel(status: CampaignStatus): string {
  const map: Record<CampaignStatus, string> = {
    draft: "Draft",
    active: "Aktif",
    full: "Kuota Penuh",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };
  return map[status] || status;
}

export function getCampaignStatusVariant(status: CampaignStatus): "secondary" | "success" | "warning" | "info" | "danger" {
  const map: Record<CampaignStatus, "secondary" | "success" | "warning" | "info" | "danger"> = {
    draft: "secondary",
    active: "success",
    full: "warning",
    completed: "info",
    cancelled: "danger",
  };
  return map[status] || "secondary";
}

export function getSubmissionStatusLabel(status: SubmissionStatus): string {
  const map: Record<SubmissionStatus, string> = {
    pending: "Menunggu Validasi",
    valid: "Valid",
    fraud: "Terindikasi Fraud",
    dispute: "Sengketa",
  };
  return map[status] || status;
}

export function getSubmissionStatusVariant(status: SubmissionStatus): "secondary" | "success" | "warning" | "danger" {
  const map: Record<SubmissionStatus, "secondary" | "success" | "warning" | "danger"> = {
    pending: "warning",
    valid: "success",
    fraud: "danger",
    dispute: "danger",
  };
  return map[status] || "secondary";
}

export function getNegotiationStatusLabel(status: NegotiationOrder["status"]): string {
  const map: Record<NegotiationOrder["status"], string> = {
    negotiation: "Negosiasi",
    waiting_payment: "Menunggu Pembayaran",
    escrow: "Dana di Escrow",
    revision: "Revisi",
    waiting_verification: "Menunggu Verifikasi",
    completed: "Selesai",
    cancelled: "Dibatalkan",
    dispute: "Sengketa",
  };
  return map[status] || status;
}

export function getNegotiationStatusVariant(status: NegotiationOrder["status"]): "secondary" | "success" | "warning" | "info" | "danger" {
  const map: Record<NegotiationOrder["status"], "secondary" | "success" | "warning" | "info" | "danger"> = {
    negotiation: "secondary",
    waiting_payment: "warning",
    escrow: "info",
    revision: "warning",
    waiting_verification: "warning",
    completed: "success",
    cancelled: "secondary",
    dispute: "danger",
  };
  return map[status] || "secondary";
}

export function getTransactionStatusLabel(status: TransactionStatus): string {
  const map: Record<TransactionStatus, string> = {
    pending: "Menunggu Pembayaran",
    escrow: "Dana Ditahan (Escrow)",
    success: "Berhasil",
    failed: "Gagal",
    refunded: "Dikembalikan (Refund)",
  };
  return map[status] || status;
}

export function getTransactionStatusVariant(status: TransactionStatus): "secondary" | "success" | "warning" | "danger" {
  const map: Record<TransactionStatus, "secondary" | "success" | "warning" | "danger"> = {
    pending: "warning",
    escrow: "warning",
    success: "success",
    failed: "danger",
    refunded: "secondary",
  };
  return map[status] || "secondary";
}
