import { Link } from "react-router";
import { MapPin, Clock, ChevronRight, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { propertiesApi, bidsApi, Property, BidWithProperty } from "@/api/client";

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

export function AgentDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [myBids, setMyBids] = useState<BidWithProperty[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      propertiesApi.getOpenAuctions(),
      bidsApi.getMyBids(),
    ])
      .then(([props, bids]) => {
        setProperties(props);
        setMyBids(bids);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const myBidPropertyIds = new Set(myBids.map((b) => b.property_id));
  const pendingBids = myBids.filter((b) => b.status === "pending");
  const acceptedBids = myBids.filter((b) => b.status === "accepted");

  // 내가 이미 입찰한 매물에는 hasBid 표시
  const enrichedProperties = properties.map((p) => ({
    ...p,
    hasBid: myBidPropertyIds.has(p.id),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Summary Section */}
      <div className="bg-white px-5 py-6 mb-2">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-gray-600 mb-1">내 입찰 현황</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? "..." : `${myBids.length}건`}
            </p>
          </div>
          <Link
            to="/settings/profile-edit"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold active:bg-gray-200"
          >
            프로필 편집
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Link to="/agent/listings" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-1">{loading ? "-" : properties.length}</div>
            <div className="text-xs text-gray-600">신규</div>
          </Link>
          <Link to="/agent/bids" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-blue-600 mb-1">{loading ? "-" : pendingBids.length}</div>
            <div className="text-xs text-gray-600">입찰중</div>
          </Link>
          <Link to="/agent/transactions" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-green-600 mb-1">{loading ? "-" : acceptedBids.length}</div>
            <div className="text-xs text-gray-600">낙찰</div>
          </Link>
          <Link to="/agent/reviews" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-orange-600 mb-1">-</div>
            <div className="text-xs text-gray-600">평점</div>
          </Link>
        </div>
      </div>

      {/* Available Properties Section */}
      <div className="bg-white px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">
            새로운 매물 <span className="text-blue-600">{loading ? "..." : enrichedProperties.length}</span>
          </h3>
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            필터
          </button>
        </div>

        {loading && (
          <div className="py-10 text-center text-gray-400 text-sm">불러오는 중...</div>
        )}

        {!loading && enrichedProperties.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500 mb-2">현재 입찰 가능한 매물이 없습니다</p>
            <p className="text-sm text-gray-400">새로운 매물이 등록되면 알림을 보내드립니다</p>
          </div>
        )}

        <div className="space-y-3">
          {enrichedProperties.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              className="block border border-gray-200 rounded-xl overflow-hidden active:bg-gray-50"
            >
              <div className="relative h-36 bg-gray-200 flex items-center justify-center">
                {property.images?.[0] ? (
                  <img src={property.images[0]} alt={property.apartment_name} className="w-full h-full object-cover" />
                ) : (
                  <MapPin className="w-8 h-8 text-gray-400" />
                )}
                {property.hasBid && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white rounded-md text-xs font-semibold">
                    입찰 완료
                  </div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white rounded-md text-xs font-semibold">
                  {daysLeft(property.auction_end_at)}일 남음
                </div>
              </div>

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

                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-600">마감 </span>
                    <span className="font-bold text-gray-900">{daysLeft(property.auction_end_at)}일</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link to="/agent/listings" className="block mt-4 py-3 text-center text-gray-600 text-sm font-medium">
          전체 매물 보기 →
        </Link>
      </div>

      {/* Quick Tips */}
      <div className="bg-white px-5 py-5 mt-2">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          💡 입찰 성공 팁
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>프로필에 해당 지역 거래 경험을 자세히 작성하세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>적정 수수료로 경쟁력을 확보하세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>빠른 응답으로 성의를 보여주세요</span>
          </li>
        </ul>
      </div>

      {/* Filter Bottom Sheet */}
      {showFilter && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilter(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-5 pt-4 pb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-5">필터</h2>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowFilter(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                  초기화
                </button>
                <button onClick={() => setShowFilter(false)} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold">
                  적용하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
