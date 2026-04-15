import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { propertiesApi, PropertyDetail, BidWithAgent } from "@/api/client";
import {
  Star,
  MapPin,
  CheckCircle2,
  XCircle,
  Building2,
  Award,
  Clock,
  Shield,
  User,
  ChevronLeft,
} from "lucide-react";

function formatPrice(price: number): string {
  const eok = Math.floor(price / 100000000);
  const man = Math.floor((price % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man}만원`;
}

function daysLeft(endAt?: string): number {
  if (!endAt) return 0;
  return Math.max(0, Math.ceil((new Date(endAt).getTime() - Date.now()) / 86400000));
}

export function ProposalDetail() {
  // Route: /seller/proposals/:propertyId  OR  /seller/proposals/:propertyId/:bidId
  const { propertyId, bidId: bidIdParam, id } = useParams<{
    propertyId?: string;
    bidId?: string;
    id?: string;
  }>();
  const navigate = useNavigate();

  // Support both /seller/proposals/:id and /seller/proposals/:propertyId/:bidId
  const resolvedPropertyId = propertyId ?? id ?? "";

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [selectedBid, setSelectedBid] = useState<BidWithAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!resolvedPropertyId) return;
    propertiesApi
      .getOne(resolvedPropertyId)
      .then((detail) => {
        setProperty(detail);
        const bids = (detail.bids as BidWithAgent[] | undefined) ?? [];
        // If a specific bidId is given, show that bid; otherwise show the first pending bid
        if (bidIdParam) {
          setSelectedBid(bids.find((b) => b.id === bidIdParam) ?? bids[0] ?? null);
        } else {
          setSelectedBid(bids[0] ?? null);
        }
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [resolvedPropertyId, bidIdParam]);

  const handleAccept = async () => {
    if (!property || !selectedBid) return;
    if (!window.confirm(`${selectedBid.agent?.name ?? "이 중개사"}를 선택하시겠습니까?`)) return;
    setAccepting(true);
    try {
      await propertiesApi.selectAgent(property.id, selectedBid.id);
      toast.success("중개사를 선택했습니다!");
      navigate("/seller/proposals");
    } catch (err: any) {
      toast.error(err.message || "선택에 실패했습니다.");
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = () => {
    // 중개사 거절은 다른 중개사를 선택하는 것으로 처리됨 (개별 거절 API 없음)
    toast.info("다른 중개사를 선택해 주세요.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">매물 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 font-semibold"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const bids = (property.bids as BidWithAgent[] | undefined) ?? [];

  // If no bids at all
  if (bids.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 px-5">
        <p className="text-gray-500">아직 제안서가 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 font-semibold"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const bid = selectedBid ?? bids[0];
  const agent = bid.agent;
  const isPending = property.status === "auction_open" || property.status === "selection_pending";

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Bid Selector (if multiple bids) */}
      {bids.length > 1 && (
        <div className="bg-white px-5 py-3 mb-2 overflow-x-auto">
          <div className="flex gap-2">
            {bids.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBid(b)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  bid.id === b.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {b.agent?.name ?? "중개사"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Property Info */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-start gap-2 text-blue-600 mb-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 mb-0.5">
              {property.apartment_name} · {property.area}㎡
            </div>
            <div className="text-sm font-medium text-gray-900">
              {property.address}
            </div>
          </div>
        </div>
        {property.auction_end_at && (
          <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
            <Clock className="w-3 h-3" />
            경매 마감까지 {daysLeft(property.auction_end_at)}일 남음
          </div>
        )}
      </div>

      {/* Agent Profile */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-2xl overflow-hidden flex-shrink-0">
            {agent?.profile_image ? (
              <img
                src={agent.profile_image}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
            ) : (
              agent?.name?.charAt(0) ?? "중"
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {agent?.name ?? "-"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">
                  {agent?.avg_rating ? agent.avg_rating.toFixed(1) : "신규"}
                </span>
              </div>
              <span>·</span>
              <span>리뷰 {agent?.review_count ?? 0}건</span>
            </div>
          </div>
        </div>

        {/* License */}
        {agent?.license_number && (
          <div className="border-t border-gray-100 pt-4 pb-4">
            <div className="flex items-start gap-2 mb-3">
              <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 text-sm mb-0.5">
                  자격증 번호
                </div>
                <div className="text-xs text-gray-600">{agent.license_number}</div>
              </div>
            </div>
          </div>
        )}

        {/* View Agent Profile Button */}
        {agent?.id && (
          <Link
            to={`/agent/${agent.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold active:bg-gray-200"
          >
            <User className="w-4 h-4" />
            중개사 상세 프로필 보기
          </Link>
        )}
      </div>

      {/* Proposal Summary */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">제안 조건</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-xs text-blue-600 mb-1">중개 수수료</div>
            <div className="text-xl font-bold text-blue-600">
              {bid.commission_rate}%
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-xs text-green-600 mb-1">매물 희망가</div>
            <div className="text-xl font-bold text-green-600">
              {formatPrice(property.asking_price)}
            </div>
          </div>
        </div>

        {/* Bid Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">제안 상태:</span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              bid.status === "pending"
                ? "bg-blue-50 text-blue-600"
                : bid.status === "accepted"
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {bid.status === "pending"
              ? "검토중"
              : bid.status === "accepted"
              ? "수락됨"
              : "거절됨"}
          </span>
        </div>
      </div>

      {/* Message */}
      {bid.message && (
        <div className="bg-white px-5 py-5 mb-2">
          <h3 className="font-bold text-gray-900 mb-3">중개사 메시지</h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {bid.message}
          </p>
        </div>
      )}

      {/* Certifications */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-3">자격 및 인증</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
            <Award className="w-3 h-3" />
            공인중개사
          </div>
          {agent?.license_number && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
              <Shield className="w-3 h-3" />
              자격 인증 완료
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isPending && bid.status === "pending" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold active:bg-gray-50"
            >
              <XCircle className="w-5 h-5" />
              보류
            </button>
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold active:bg-blue-700 disabled:opacity-60"
            >
              <CheckCircle2 className="w-5 h-5" />
              {accepting ? "처리중..." : "이 중개사 선택"}
            </button>
          </div>
        </div>
      )}

      {bid.status === "accepted" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
          <div className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            선택된 중개사입니다
          </div>
        </div>
      )}
    </div>
  );
}
