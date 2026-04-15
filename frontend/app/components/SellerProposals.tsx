import { Link } from "react-router";
import { Star, MapPin, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { propertiesApi, Property, BidWithAgent } from "@/api/client";

// 개별 입찰에 매물 정보를 붙인 타입
interface ProposalItem {
  bidId: string;
  propertyId: string;
  apartmentName: string;
  propertyAddress: string;
  agentName: string;
  agentPhoto?: string;
  agentRating: number;
  agentReviewCount: number;
  commissionRate: number;
  askingPrice: number;
  status: string; // pending | accepted | rejected | cancelled
}

function formatPrice(price: number): string {
  const eok = Math.floor(price / 100000000);
  const man = Math.floor((price % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man}만원`;
}

function getBidsCount(bids: any): number {
  if (!bids) return 0;
  if (Array.isArray(bids) && bids.length > 0 && typeof bids[0]?.count === "number") return bids[0].count;
  return 0;
}

export function SellerProposals() {
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  useEffect(() => {
    async function load() {
      // 1. 내 매물 목록 조회
      const properties = await propertiesApi.getMySeller();

      // 2. 입찰이 있는 매물만 상세 조회 (auction_open | selection_pending)
      const withBids = properties.filter(
        (p) =>
          ["auction_open", "selection_pending", "matched"].includes(p.status) &&
          getBidsCount((p as any).bids) > 0
      );

      const details = await Promise.all(withBids.map((p) => propertiesApi.getOne(p.id)));

      // 3. 입찰 목록 플래팅
      const items: ProposalItem[] = [];
      for (const detail of details) {
        const bids = (detail.bids as BidWithAgent[] | undefined) ?? [];
        for (const bid of bids) {
          items.push({
            bidId: bid.id,
            propertyId: detail.id,
            apartmentName: detail.apartment_name,
            propertyAddress: detail.address,
            agentName: bid.agent?.name ?? "중개사",
            agentPhoto: bid.agent?.profile_image,
            agentRating: bid.agent?.avg_rating ?? 0,
            agentReviewCount: bid.agent?.review_count ?? 0,
            commissionRate: bid.commission_rate,
            askingPrice: detail.asking_price,
            status: bid.status,
          });
        }
      }
      setProposals(items);
    }

    load()
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = proposals.filter((p) =>
    filter === "all" ? true : p.status === filter
  );

  const pendingCount = proposals.filter((p) => p.status === "pending").length;
  const acceptedCount = proposals.filter((p) => p.status === "accepted").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <h1 className="text-xl font-bold text-gray-900 mb-1">받은 제안서</h1>
        <p className="text-sm text-gray-600">중개사들의 제안을 검토하고 선택하세요</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "전체" },
            { key: "pending", label: "대기중" },
            { key: "accepted", label: "수락" },
            { key: "rejected", label: "거절" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === tab.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{loading ? "-" : pendingCount}</div>
            <div className="text-xs text-gray-600">검토 대기</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{loading ? "-" : acceptedCount}</div>
            <div className="text-xs text-gray-600">수락됨</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{loading ? "-" : proposals.length}</div>
            <div className="text-xs text-gray-600">전체</div>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="bg-white px-5 py-5">
        {loading && <div className="py-10 text-center text-gray-400 text-sm">불러오는 중...</div>}

        <div className="space-y-4">
          {filtered.map((proposal) => (
            <Link
              key={proposal.bidId}
              to={`/seller/proposals/${proposal.propertyId}`}
              className="block border border-gray-200 rounded-xl p-4 active:bg-gray-50"
            >
              {/* Property Info */}
              <div className="flex items-start gap-3 mb-3 pb-3 border-b border-gray-100">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">{proposal.apartmentName}</div>
                  <div className="text-sm font-medium text-gray-900 truncate">{proposal.propertyAddress}</div>
                </div>
              </div>

              {/* Agent Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg overflow-hidden">
                  {proposal.agentPhoto ? (
                    <img src={proposal.agentPhoto} alt={proposal.agentName} className="w-full h-full object-cover" />
                  ) : (
                    proposal.agentName.charAt(0)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 mb-0.5">{proposal.agentName}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium">
                        {proposal.agentRating > 0 ? proposal.agentRating.toFixed(1) : "신규"}
                      </span>
                    </div>
                    <span>·</span>
                    <span>리뷰 {proposal.agentReviewCount}건</span>
                  </div>
                </div>
                <div className={`px-2 py-1 text-xs font-semibold rounded ${
                  proposal.status === "pending" ? "bg-blue-50 text-blue-600" :
                  proposal.status === "accepted" ? "bg-green-50 text-green-600" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {proposal.status === "pending" ? "검토중" :
                   proposal.status === "accepted" ? "수락됨" : "거절됨"}
                </div>
              </div>

              {/* Proposal Details */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">중개 수수료</div>
                  <div className="text-base font-bold text-gray-900">{proposal.commissionRate}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">매물 희망가</div>
                  <div className="text-base font-bold text-gray-900">{formatPrice(proposal.askingPrice)}</div>
                </div>
              </div>

              <div className="flex items-center justify-end text-sm text-blue-600 font-semibold">
                제안서 상세보기
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500 mb-2">제안서가 없습니다</p>
            <p className="text-sm text-gray-400">매물을 등록하면 중개사들의 제안을 받을 수 있습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
