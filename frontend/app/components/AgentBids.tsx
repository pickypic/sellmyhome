import { Link } from "react-router";
import { MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { bidsApi, BidWithProperty } from "@/api/client";

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

export function AgentBids() {
  const [bids, setBids] = useState<BidWithProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bidsApi.getMyBids()
      .then(setBids)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (bidId: string) => {
    if (!confirm("입찰을 취소하시겠습니까?")) return;
    try {
      await bidsApi.cancel(bidId);
      setBids((prev) => prev.filter((b) => b.id !== bidId));
      toast.success("입찰이 취소되었습니다.");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">선택됨</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1 text-blue-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">대기중</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-gray-400">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">미선택</span>
          </div>
        );
    }
  };

  const accepted = bids.filter((b) => b.status === "accepted").length;
  const pending = bids.filter((b) => b.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Summary Card */}
      <div className="bg-white px-5 py-6 mb-2">
        <h3 className="text-sm text-gray-600 mb-3">지원 통계</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600 mb-1">{loading ? "-" : accepted}</div>
            <div className="text-xs text-gray-600">매칭</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600 mb-1">{loading ? "-" : pending}</div>
            <div className="text-xs text-gray-600">지원중</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-600 mb-1">{loading ? "-" : bids.length}</div>
            <div className="text-xs text-gray-600">총 지원</div>
          </div>
        </div>
      </div>

      {/* Bids List */}
      <div className="px-5 py-4">
        <h3 className="text-base font-bold text-gray-900 mb-4">내 지원 내역</h3>

        {loading && <div className="py-10 text-center text-gray-400 text-sm">불러오는 중...</div>}

        {!loading && bids.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500">아직 지원한 매물이 없습니다</p>
          </div>
        )}

        <div className="space-y-3">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Image placeholder */}
              <div className="relative h-32 bg-gray-200 flex items-center justify-center">
                {bid.property?.images?.[0] ? (
                  <img src={bid.property.images[0]} alt={bid.property.apartment_name} className="w-full h-full object-cover" />
                ) : (
                  <MapPin className="w-6 h-6 text-gray-400" />
                )}
                <div className="absolute top-3 right-3">{getStatusBadge(bid.status)}</div>
              </div>

              {/* Bid Info */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {bid.property?.apartment_name ?? "-"} {bid.property?.area ? `${bid.property.area}㎡` : ""}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{bid.property?.address ?? "-"}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">매매가</span>
                    <div className="font-semibold text-gray-900">
                      {bid.property?.asking_price ? formatPrice(bid.property.asking_price) : "-"}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">제안 수수료</span>
                    <div className="font-semibold text-green-600">{bid.commission_rate}%</div>
                  </div>
                </div>

                {bid.status === "pending" && bid.property?.auction_end_at && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-gray-900">
                        {daysLeft(bid.property.auction_end_at)}일 남음
                      </span>
                    </div>
                  </div>
                )}

                {bid.status === "accepted" && (
                  <div className="bg-green-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-green-800 font-medium">
                      🎉 축하합니다! 매도인이 회원님을 선택했습니다.
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    to={`/property/${bid.property_id}`}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg text-center font-semibold text-sm"
                  >
                    매물 보기
                  </Link>
                  {bid.status === "pending" && (
                    <button
                      onClick={() => handleCancel(bid.id)}
                      className="flex-1 py-3 border border-red-300 text-red-600 rounded-lg font-semibold text-sm"
                    >
                      취소
                    </button>
                  )}
                  {bid.status === "accepted" && (
                    <Link
                      to="/agent/transactions"
                      className="flex-1 py-3 bg-green-600 text-white rounded-lg text-center font-semibold text-sm"
                    >
                      거래 진행
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="px-5 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-2">💡 지원 팁</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>경쟁력 있는 수수료와 전문성을 어필하세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>해당 지역 거래 경험을 상세히 작성하세요</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
