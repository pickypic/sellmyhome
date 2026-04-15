import { Link } from "react-router";
import { MapPin, Clock, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { propertiesApi, Property, authStorage } from "@/api/client";

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
  if (Array.isArray(bids) && bids.length > 0 && typeof bids[0]?.count === "number")
    return bids[0].count;
  if (typeof bids?.count === "number") return bids.count;
  return 0;
}

const STATUS_MAP: Record<string, string> = {
  pending_verification: "인증 대기",
  verified: "경매 시작 전",
  auction_open: "auction_open",  // 필터 키와 맞추기 위해 별도 처리
  selection_pending: "selection_pending",
  no_bids: "입찰 없음",
  matched: "매칭 완료",
  completed: "completed",
  cancelled: "취소됨",
};

type FilterKey = "all" | "auction_open" | "completed" | "others";

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "auction_open", label: "입찰중" },
  { key: "completed", label: "완료" },
  { key: "others", label: "기타" },
];

function matchFilter(status: string, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "auction_open") return status === "auction_open";
  if (filter === "completed") return ["matched", "completed"].includes(status);
  // others: pending_verification, verified, no_bids, selection_pending ...
  return !["auction_open", "matched", "completed"].includes(status);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "auction_open":
      return (
        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3" />
          입찰중
        </span>
      );
    case "selection_pending":
      return (
        <span className="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-md">
          중개사 선택 대기
        </span>
      );
    case "matched":
      return (
        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-md">
          매칭 완료
        </span>
      );
    case "completed":
      return (
        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-md">
          거래 완료
        </span>
      );
    case "no_bids":
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
          입찰 없음
        </span>
      );
    case "pending_verification":
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-md">
          인증 대기
        </span>
      );
    case "verified":
      return (
        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-md">
          경매 시작 전
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
          {status}
        </span>
      );
  }
}

export function SellerListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    propertiesApi
      .getMySeller()
      .then(setProperties)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStartAuction = async (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setStartingId(propertyId);
    try {
      const updated = await propertiesApi.startAuction(propertyId);
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, ...updated } : p))
      );
      toast.success("역경매가 시작되었습니다!");
    } catch (err: any) {
      toast.error(err.message || "경매 시작에 실패했습니다.");
    } finally {
      setStartingId(null);
    }
  };

  const filtered = properties.filter((p) => {
    const matchSearch =
      !search ||
      p.apartment_name.includes(search) ||
      p.address.includes(search);
    return matchSearch && matchFilter(p.status, filter);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="매물 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-5 py-3 mb-2 overflow-x-auto">
        <div className="flex gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Properties List */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-600">
            총 <span className="font-bold text-gray-900">{loading ? "-" : filtered.length}</span>개
          </h3>
          <Link
            to="/seller/add-property"
            className="flex items-center gap-1 text-blue-600 text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            새 매물 등록
          </Link>
        </div>

        {loading && (
          <div className="py-10 text-center text-gray-400 text-sm">불러오는 중...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500 mb-2">매물이 없습니다</p>
            <p className="text-sm text-gray-400">새 매물을 등록해보세요</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((property) => {
            const bidsCount = getBidsCount((property as any).bids);
            const isAuction = property.status === "auction_open";
            const isDone = ["matched", "completed"].includes(property.status);
            const isVerified = property.status === "verified";

            return (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="block bg-white border border-gray-200 rounded-xl overflow-hidden active:bg-gray-50"
              >
                {/* Property Image */}
                <div className="relative h-40 bg-gray-200 flex items-center justify-center">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.apartment_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MapPin className="w-8 h-8 text-gray-400" />
                  )}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(property.status)}
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {property.apartment_name}
                  </h4>
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
                        <div className="font-bold text-blue-600">{bidsCount}건</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-600">남은 기간</span>
                        <div className="font-bold text-gray-900 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {daysLeft(property.auction_end_at)}일
                        </div>
                      </div>
                    </div>
                  )}

                  {isDone && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <span className="text-xs text-gray-600">거래 진행중 또는 완료</span>
                    </div>
                  )}

                  {isVerified && (
                    <button
                      onClick={(e) => handleStartAuction(e, property.id)}
                      disabled={startingId === property.id}
                      className="w-full mt-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold active:bg-blue-700 disabled:opacity-60"
                    >
                      {startingId === property.id ? "시작 중..." : "역경매 시작하기"}
                    </button>
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
