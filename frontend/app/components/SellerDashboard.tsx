import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, MapPin, Clock, ChevronRight, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { propertiesApi, Property } from "@/api/client";

// 가격 포맷: 1_250_000_000 → "12억 5천만원"
function formatPrice(price: number): string {
  const eok = Math.floor(price / 100000000);
  const man = Math.floor((price % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man}만원`;
}

// 남은 일수 계산
function daysLeft(endAt?: string): number {
  if (!endAt) return 0;
  return Math.max(0, Math.ceil((new Date(endAt).getTime() - Date.now()) / 86400000));
}

// bids(count) aggregate 응답에서 숫자 추출
function getBidsCount(bids: any): number {
  if (!bids) return 0;
  if (Array.isArray(bids)) return bids[0]?.count ?? 0;
  return bids.count ?? 0;
}

const STATUS_LABEL: Record<string, string> = {
  pending_verification: "인증 대기",
  verified: "경매 시작 전",
  auction_open: "입찰중",
  selection_pending: "중개사 선택 대기",
  no_bids: "입찰 없음",
  matched: "매칭 완료",
  completed: "거래 완료",
};

export function SellerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertiesApi.getMySeller()
      .then(setProperties)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPrice = properties.reduce((s, p) => s + (p.asking_price || 0), 0);
  const auctionOpen = properties.filter((p) => p.status === "auction_open");
  const totalBids = auctionOpen.reduce((s, p) => s + getBidsCount((p as any).bids), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Summary Section */}
      <div className="bg-white px-5 py-6 mb-2">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-gray-600 mb-1">총 매물가</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? "..." : totalPrice > 0 ? formatPrice(totalPrice) : "-"}
            </p>
          </div>
          <Link
            to="/seller/listings"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold active:bg-blue-700"
          >
            상세보기
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Link to="/seller/listings" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-1">{loading ? "-" : properties.length}</div>
            <div className="text-xs text-gray-600">전체 매물</div>
          </Link>
          <Link to="/seller/listings" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-blue-600 mb-1">{loading ? "-" : auctionOpen.length}</div>
            <div className="text-xs text-gray-600">입찰중</div>
          </Link>
          <Link to="/seller/proposals" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-green-600 mb-1">{loading ? "-" : totalBids}</div>
            <div className="text-xs text-gray-600">받은 제안</div>
          </Link>
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-white px-5 py-4 mb-2">
        <Link
          to="/seller/add-property"
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          새 매물 등록하기
        </Link>
      </div>

      {/* Market Analysis Quick Link */}
      <div className="bg-white px-5 py-4 mb-2">
        <Link
          to="/market-analysis"
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl active:opacity-80"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-0.5">시장 분석 리포트</div>
              <div className="text-xs text-gray-600">우리 동네 시세를 확인하세요</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      {/* Properties List */}
      <div className="bg-white px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">내 매물</h3>
          <Link to="/seller/listings" className="text-sm text-gray-600 flex items-center gap-1">
            전체보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading && (
          <div className="py-10 text-center text-gray-400 text-sm">불러오는 중...</div>
        )}

        {!loading && properties.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500 mb-2">등록한 매물이 없습니다</p>
            <p className="text-sm text-gray-400">새 매물을 등록해보세요</p>
          </div>
        )}

        <div className="space-y-3">
          {properties.slice(0, 3).map((property) => {
            const bidsCount = getBidsCount((property as any).bids);
            const isAuction = property.status === "auction_open";
            const isDone = ["matched", "completed"].includes(property.status);

            return (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="block border border-gray-200 rounded-xl overflow-hidden active:bg-gray-50"
              >
                {/* Property Image */}
                <div className="relative h-36 bg-gray-200 flex items-center justify-center">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.apartment_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MapPin className="w-8 h-8 text-gray-400" />
                  )}
                  {isAuction && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white rounded-md text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      입찰중
                    </div>
                  )}
                  {isDone && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white rounded-md text-xs font-semibold">
                      완료
                    </div>
                  )}
                  {!isAuction && !isDone && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-gray-600 text-white rounded-md text-xs font-semibold">
                      {STATUS_LABEL[property.status] ?? property.status}
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{property.apartment_name}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span className="line-clamp-1">{property.address}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs text-gray-500">매매가</span>
                      <div className="font-bold text-gray-900">{formatPrice(property.asking_price)}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">전용면적</span>
                      <div className="font-bold text-gray-900">{property.area}㎡</div>
                    </div>
                  </div>

                  {isAuction && (
                    <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-600">받은 입찰</span>
                        <div className="text-lg font-bold text-blue-600">{bidsCount}건</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-600">남은 기간</span>
                        <div className="text-lg font-bold text-gray-900">{daysLeft(property.auction_end_at)}일</div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
