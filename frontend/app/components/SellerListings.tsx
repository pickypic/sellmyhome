import { Link } from "react-router";
import { MapPin, Clock, Plus, Search } from "lucide-react";
import { useState } from "react";

// Mock data
const mockProperties = [
  {
    id: 1,
    address: "서울특별시 강남구 역삼동 123-45",
    apartmentName: "역삼래미안",
    area: "84㎡",
    price: "12억 5천만원",
    status: "bidding",
    bidsCount: 5,
    daysLeft: 2,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
  },
  {
    id: 2,
    address: "서울특별시 서초구 서초동 678-90",
    apartmentName: "서초푸르지오",
    area: "59㎡",
    price: "9억 8천만원",
    status: "completed",
    selectedAgent: "김중개",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
  },
  {
    id: 3,
    address: "서울특별시 송파구 잠실동 123-45",
    apartmentName: "잠실엘스",
    area: "115㎡",
    price: "18억원",
    status: "draft",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400",
  },
];

export function SellerListings() {
  const [filter, setFilter] = useState<'all' | 'bidding' | 'completed' | 'draft'>('all');

  const filteredProperties = filter === 'all' 
    ? mockProperties 
    : mockProperties.filter(p => p.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "bidding":
        return <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md">입찰중</span>;
      case "completed":
        return <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-md">완료</span>;
      case "draft":
        return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">임시저장</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="매물 검색"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-5 py-3 mb-2 overflow-x-auto">
        <div className="flex gap-2">
          {[
            { key: 'all', label: '전체' },
            { key: 'bidding', label: '입찰중' },
            { key: 'completed', label: '완료' },
            { key: 'draft', label: '임시저장' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
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
            총 <span className="font-bold text-gray-900">{filteredProperties.length}</span>개
          </h3>
          <Link
            to="/seller/add-property"
            className="flex items-center gap-1 text-blue-600 text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            새 매물 등록
          </Link>
        </div>

        <div className="space-y-3">
          {filteredProperties.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              className="block bg-white border border-gray-200 rounded-xl overflow-hidden active:bg-gray-50"
            >
              <div className="relative h-40 bg-gray-100">
                <img
                  src={property.image}
                  alt={property.apartmentName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  {getStatusBadge(property.status)}
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {property.apartmentName}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{property.address}</span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500">매매가</span>
                    <div className="font-bold text-gray-900">{property.price}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">전용면적</span>
                    <div className="font-bold text-gray-900">{property.area}</div>
                  </div>
                </div>

                {property.status === "bidding" && (
                  <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-600">받은 입찰</span>
                      <div className="font-bold text-blue-600">{property.bidsCount}건</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-600">남은 기간</span>
                      <div className="font-bold text-gray-900 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {property.daysLeft}일
                      </div>
                    </div>
                  </div>
                )}

                {property.status === "completed" && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <span className="text-xs text-gray-600">선택한 중개사</span>
                    <div className="font-semibold text-gray-900">{property.selectedAgent}</div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
