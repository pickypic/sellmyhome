import { useParams, Link, useNavigate } from "react-router";
import {
  MapPin,
  ArrowLeft,
  Clock,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { propertiesApi, authStorage, PropertyDetail as PropertyDetailType, BidWithAgent } from "@/api/client";

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

export function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBid, setSelectedBid] = useState<BidWithAgent | null>(null);
  const [selecting, setSelecting] = useState(false);

  const { user } = authStorage.get();
  const isSeller = user?.role === "seller";
  const isAgent = user?.role === "agent";

  useEffect(() => {
    if (!id) return;
    propertiesApi.getOne(id)
      .then(setProperty)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelectAgent = async () => {
    if (!selectedBid || !id) return;
    setSelecting(true);
    try {
      await propertiesApi.selectAgent(id, selectedBid.id);
      toast.success("중개사 선택이 완료되었습니다!");
      setSelectedBid(null);
      // Reload to reflect updated status
      const updated = await propertiesApi.getOne(id);
      setProperty(updated);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSelecting(false);
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">매물을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const bids = (property.bids ?? []) as BidWithAgent[];
  const myBid = property.my_bid;
  const userHasBid = isAgent && !!myBid;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center z-10">
        <button onClick={() => window.history.back()} className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-base font-semibold text-gray-900 ml-2">매물 상세</h1>
      </div>

      {/* Property Image */}
      <div className="relative h-56 bg-gray-200">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.apartment_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
          <h2 className="text-xl font-bold text-white mb-1">
            {property.apartment_name}
          </h2>
          <div className="flex items-center gap-1 text-white text-sm">
            <MapPin className="w-3 h-3" />
            <span>{property.address}</span>
          </div>
        </div>
      </div>

      {/* Price and Status */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">매매 희망가</div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(property.asking_price)}</div>
          </div>
          {property.auction_end_at && (
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">남은 시간</div>
              <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
                <Clock className="w-5 h-5 text-blue-600" />
                {daysLeft(property.auction_end_at)}일
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">현재 받은 제안</div>
            <div className="text-2xl font-bold text-blue-600">{bids.length}건</div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
          >
            상세정보
          </button>
        </div>
      </div>

      {/* Property Details (Collapsible) */}
      {showDetails && (
        <div className="bg-white px-5 py-5 mb-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">전용면적</div>
              <div className="font-semibold text-gray-900">{property.area}㎡</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">층수</div>
              <div className="font-semibold text-gray-900">{property.floor}층</div>
            </div>
          </div>
        </div>
      )}

      {/* For Sellers: Bids List */}
      {isSeller && (
        <div className="bg-white px-5 py-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            중개사 제안 ({bids.length})
          </h3>

          {bids.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-gray-500">아직 제안이 없습니다</p>
            </div>
          )}

          <div className="space-y-3">
            {bids.map((bid) => (
              <div key={bid.id} className="border border-gray-200 rounded-xl p-4">
                {/* Agent Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {bid.agent?.name?.charAt(0) ?? "?"}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {bid.agent?.name ?? "-"}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-sm">{bid.agent?.avg_rating?.toFixed(1) ?? "-"}</span>
                        <span className="text-xs text-gray-500">({bid.agent?.review_count ?? 0})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commission */}
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">제안 수수료</span>
                    <span className="text-2xl font-bold text-green-600">{bid.commission_rate}%</span>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1">제안 메시지</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{bid.message}</p>
                </div>

                {/* Actions */}
                {property.status === "selection_pending" && (
                  <div className="flex gap-2">
                    <Link
                      to={`/agent/${bid.agent_id}`}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg text-center font-semibold text-sm"
                    >
                      프로필 보기
                    </Link>
                    <button
                      onClick={() => setSelectedBid(bid)}
                      className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold text-sm"
                    >
                      선택하기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* For Agents: Property Info & Bid Button */}
      {isAgent && (
        <div className="bg-white px-5 py-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">지원 정보</h3>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">현재 지원</div>
                <div className="text-2xl font-bold text-blue-600">{bids.length}건</div>
              </div>
              {property.auction_end_at && (
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">마감까지</div>
                  <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    {daysLeft(property.auction_end_at)}일
                  </div>
                </div>
              )}
            </div>
          </div>

          {userHasBid ? (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium text-center">
                  ✓ 지원을 완료했습니다
                </p>
                <div className="mt-2 text-center text-sm text-gray-600">
                  제안 수수료: <span className="font-semibold text-green-700">{myBid.commission_rate}%</span>
                </div>
              </div>
            </div>
          ) : (
            property.status === "auction_open" && (
              <Link
                to={`/property/${id}/bid`}
                className="block w-full py-4 bg-green-600 text-white rounded-lg font-semibold text-center"
              >
                지원하기
              </Link>
            )
          )}

          <p className="text-xs text-gray-500 text-center mt-3">
            지원 후에도 마감 전까지 수정 가능합니다
          </p>
        </div>
      )}

      {/* Selection Confirm Modal */}
      {selectedBid && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedBid(null)}
          />

          <div className="relative w-full bg-white rounded-t-2xl">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="px-5 pt-4 pb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                중개사 선택 확인
              </h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedBid.agent?.name?.charAt(0) ?? "?"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedBid.agent?.name ?? "-"}</div>
                    <div className="text-sm text-gray-600">
                      ⭐ {selectedBid.agent?.avg_rating?.toFixed(1) ?? "-"} ({selectedBid.agent?.review_count ?? 0}개)
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">제안 수수료</span>
                    <span className="font-bold text-green-600">{selectedBid.commission_rate}%</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-5">
                선택 후 중개사와 직접 연락하여 계약을 진행하게 됩니다.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBid(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={handleSelectAgent}
                  disabled={selecting}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold disabled:opacity-60"
                >
                  {selecting ? "처리중..." : "확인"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
