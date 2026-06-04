"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Campaign } from "@/types/umkm-dashboard.types";
import { formatCurrency, formatCompactNumber, formatDate } from "@/lib/formatters";
import {
  DashboardCard,
  DashboardBadge,
  DashboardActionMenu,
  DashboardButton,
  ActionMenuItem
} from "../shared";

interface CampaignTableProps {
  campaigns: Campaign[];
  submissionCounts: Record<string, { pending: number; valid: number; dispute: number }>;
  onDuplicate: (campaign: Campaign) => void;
  onCancel: (campaign: Campaign) => void;
  onExport: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
}

export function CampaignTable({
  campaigns,
  submissionCounts,
  onDuplicate,
  onCancel,
  onExport,
  onEdit,
}: CampaignTableProps) {
  const router = useRouter();

  return (
    <DashboardCard variant="default" className="w-full overflow-x-auto rounded-2xl">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-border-soft bg-neutral-50/50 text-[10px] sm:text-xs font-bold text-text-secondary uppercase tracking-wider">
            <th className="py-4 px-6">Campaign</th>
            <th className="py-4 px-4">Status</th>
            <th className="py-4 px-4">Niche</th>
            <th className="py-4 px-4 text-right">Views</th>
            <th className="py-4 px-4 text-right">Budget (Terpakai/Total)</th>
            <th className="py-4 px-4 text-center">Kuota Kreator</th>
            <th className="py-4 px-4 text-center">Submissions</th>
            <th className="py-4 px-4">Dibuat</th>
            <th className="py-4 px-6 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft">
          {campaigns.map((campaign) => {
            const counts = submissionCounts[campaign.id] || { pending: 0, valid: 0, dispute: 0 };
            const detailUrl = `/dashboard/umkm/campaign/${campaign.id}`;

            const isCancelDisabled = campaign.status === "completed" || campaign.status === "cancelled";
            const isEditVisible = campaign.status === "draft";

            const actionItems: ActionMenuItem[] = [
              {
                label: "Lihat Detail",
                onClick: () => router.push(detailUrl),
              },
              ...(isEditVisible ? [{
                label: "Edit Draft",
                onClick: () => onEdit(campaign),
              }] : []),
              {
                label: "Duplikasi Campaign",
                onClick: () => onDuplicate(campaign),
              },
              {
                label: "Unduh Laporan",
                onClick: () => onExport(campaign),
              },
              ...(!isCancelDisabled ? [{
                label: "Batalkan Campaign",
                onClick: () => onCancel(campaign),
                danger: true,
              }] : []),
            ];

            return (
              <tr key={campaign.id} className="hover:bg-neutral-50/50 transition-colors text-xs text-text-primary">
                {/* Campaign Title & Thumbnail info */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3 max-w-[280px]">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-border-soft shrink-0 relative">
                      {campaign.thumbnailUrl ? (
                        <img
                          src={campaign.thumbnailUrl}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-neutral-400 font-bold">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link href={detailUrl} className="font-bold text-text-primary hover:text-primary transition-colors truncate block">
                        {campaign.title}
                      </Link>
                      <span className="text-[10px] text-text-muted mt-0.5 block truncate">ID: {campaign.id}</span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <DashboardBadge type="status" value={campaign.status} />
                </td>

                {/* Niche */}
                <td className="py-4 px-4">
                  <DashboardBadge type="category" value={campaign.niche} />
                </td>

                {/* Views */}
                <td className="py-4 px-4 text-right font-extrabold text-text-secondary">
                  {formatCompactNumber(campaign.totalViews)}
                </td>

                {/* Budget */}
                <td className="py-4 px-4 text-right">
                  <span className="font-bold text-text-primary block">{formatCurrency(campaign.usedBudget)}</span>
                  <span className="text-[10px] text-text-muted block mt-0.5">dari {formatCurrency(campaign.totalBudgetEscrow)}</span>
                </td>

                {/* Quota */}
                <td className="py-4 px-4 text-center">
                  <span className="font-bold text-text-primary">{campaign.usedQuota}</span>
                  <span className="text-text-muted"> / {campaign.creatorQuota}</span>
                </td>

                {/* Submissions summary */}
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <DashboardBadge tone="amber" className="h-4.5 px-1.5 text-[9px] font-bold">
                      {counts.pending} P
                    </DashboardBadge>
                    <DashboardBadge tone="green" className="h-4.5 px-1.5 text-[9px] font-bold">
                      {counts.valid} V
                    </DashboardBadge>
                    {counts.dispute > 0 && (
                      <DashboardBadge tone="red" className="h-4.5 px-1.5 text-[9px] font-bold">
                        {counts.dispute} D
                      </DashboardBadge>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-4 text-text-muted">
                  {formatDate(campaign.createdAt)}
                </td>

                {/* Action Menu */}
                <td className="py-4 px-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <DashboardButton
                      variant="secondary"
                      size="sm"
                      href={detailUrl}
                      className="px-3 py-1 text-[10px] h-7.5"
                    >
                      Buka
                    </DashboardButton>
                    <DashboardActionMenu items={actionItems} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DashboardCard>
  );
}
