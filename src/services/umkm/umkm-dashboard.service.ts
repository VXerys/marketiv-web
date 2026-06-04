import { DATA_SOURCE_CONFIG } from "@/config/data-source.config";
import { mockDelay } from "@/lib/mock-delay";
import {
  ServiceResult,
  UmkmProfile,
  UmkmDashboardSummary,
  Campaign,
  CampaignSubmission,
  CreatorProfile,
  RateCardPackage,
  NegotiationOrder,
  ChatMessage,
  Transaction,
} from "@/types/umkm-dashboard.types";
import {
  mockUmkmProfile,
  mockCampaigns,
  mockSubmissions,
  mockCreators,
  mockRateCardPackages,
  mockNegotiations,
  mockChatMessages,
  mockTransactions,
  getCalculatedDashboardSummary,
} from "@/mocks/umkm";
import {
  getUmkmProfileFromAppwrite,
  getDashboardSummaryFromAppwrite,
  getCampaignsFromAppwrite,
  getCampaignByIdFromAppwrite,
  getCampaignSubmissionsFromAppwrite,
  getPendingSubmissionsFromAppwrite,
  getCreatorsFromAppwrite,
  getCreatorByIdFromAppwrite,
  getCreatorRateCardsFromAppwrite,
  getNegotiationsFromAppwrite,
  getNegotiationByIdFromAppwrite,
  getMessagesByOrderIdFromAppwrite,
  getTransactionsFromAppwrite,
} from "./umkm-appwrite.service";

export async function getUmkmProfile(): Promise<ServiceResult<UmkmProfile>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    return { success: true, data: mockUmkmProfile };
  }
  return getUmkmProfileFromAppwrite();
}

export async function getDashboardSummary(): Promise<ServiceResult<UmkmDashboardSummary>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    return { success: true, data: getCalculatedDashboardSummary() };
  }
  return getDashboardSummaryFromAppwrite();
}

export async function getCampaigns(): Promise<ServiceResult<Campaign[]>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    return { success: true, data: mockCampaigns };
  }
  return getCampaignsFromAppwrite();
}

export async function getCampaignById(id: string): Promise<ServiceResult<Campaign>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    const campaign = mockCampaigns.find((c) => c.id === id);
    if (!campaign) {
      return { success: false, data: null, error: "Campaign tidak ditemukan" };
    }
    return { success: true, data: campaign };
  }
  return getCampaignByIdFromAppwrite(id);
}

export async function getCampaignSubmissions(campaignId: string): Promise<ServiceResult<CampaignSubmission[]>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    const submissions = mockSubmissions.filter((s) => s.campaignId === campaignId);
    return { success: true, data: submissions };
  }
  return getCampaignSubmissionsFromAppwrite(campaignId);
}

export async function getPendingSubmissions(): Promise<ServiceResult<CampaignSubmission[]>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    const submissions = mockSubmissions.filter((s) => s.validationStatus === "pending");
    return { success: true, data: submissions };
  }
  return getPendingSubmissionsFromAppwrite();
}

export async function getCreators(): Promise<ServiceResult<CreatorProfile[]>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    return { success: true, data: mockCreators };
  }
  return getCreatorsFromAppwrite();
}

export async function getCreatorById(id: string): Promise<ServiceResult<CreatorProfile>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    const creator = mockCreators.find((c) => c.id === id);
    if (!creator) {
      return { success: false, data: null, error: "Kreator tidak ditemukan" };
    }
    return { success: true, data: creator };
  }
  return getCreatorByIdFromAppwrite(id);
}

export async function getCreatorRateCards(creatorId: string): Promise<ServiceResult<RateCardPackage[]>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    const packages = mockRateCardPackages.filter((p) => p.creatorId === creatorId && p.isActive);
    return { success: true, data: packages };
  }
  return getCreatorRateCardsFromAppwrite(creatorId);
}

export async function getNegotiations(): Promise<ServiceResult<NegotiationOrder[]>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    return { success: true, data: mockNegotiations };
  }
  return getNegotiationsFromAppwrite();
}

export async function getNegotiationById(id: string): Promise<ServiceResult<NegotiationOrder>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    const order = mockNegotiations.find((n) => n.id === id);
    if (!order) {
      return { success: false, data: null, error: "Negosiasi tidak ditemukan" };
    }
    return { success: true, data: order };
  }
  return getNegotiationByIdFromAppwrite(id);
}

export async function getMessagesByOrderId(orderId: string): Promise<ServiceResult<ChatMessage[]>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    const messages = mockChatMessages[orderId] || [];
    return { success: true, data: messages };
  }
  return getMessagesByOrderIdFromAppwrite(orderId);
}

export async function getTransactions(): Promise<ServiceResult<Transaction[]>> {
  if (DATA_SOURCE_CONFIG.useMockData) {
    await mockDelay(300);
    return { success: true, data: mockTransactions };
  }
  return getTransactionsFromAppwrite();
}
