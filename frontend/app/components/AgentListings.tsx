import { Link } from "react-router";
import { MapPin, Clock, Search, Filter } from "lucide-react";
import { useState } from "react";

// Mock data
const mockProperties = [
  {
    id: 1,
    address: "서울특별시 강남구 역삼동 123-45",
    apartmentName: "역삼래미안",
    area: "84㎡",
    price: "12억 5천만원",
    daysLeft: 2,
    totalBids: 5,
    hasBid: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
  },
  {
    id: 3,
    address: "서울특별시 강남구 삼성동 456-78",
    apartmentName: "삼성아이파크",
    area: "102㎡",
    price: "15억원",
    daysLeft: 1,
    totalBids: 3,
    hasBid: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
  },
  {
    id: 4,
    address: "서울특별시 서초구 반포동 789-12",
    apartmentName: "반포자이",
    area: "134㎡",
    price: "22억원",
    daysLeft: 3,
    totalBids: 8,
    hasBid: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400",
  },
];

export function AgentListings() {
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'mybids'>('all');

  const filteredProperties = mockProperties.filter(p => {
    if (filter === 'new') return p.isNew;
    if (filter === 'mybids') return p.hasBid;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="지역, 단지명으로 검색"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-5 py-3 mb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            {[
              { key: 'all', label: '전체' },
              { key: 'new', label: '신규' },
              { key: 'mybids', label: '내 입찰' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            필터
          </button>
        </div>
      </div>

      {/* Properties List */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-gray-600">
            총 <span className="font-bold text-gray-900">{filteredProperties.length}</span>개
          </h3>
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
                {property.isNew && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white rounded-md text-xs font-semibold">
                    NEW
                  </div>
                )}
                {property.hasBid && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-green-600 text-white rounded-md text-xs font-semibold">
                    입찰 완료
                  </div>
                )}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white rounded-md text-xs font-semibold">
                  {property.daysLeft}일 남음
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

                <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="text-xs text-gray-600">마감 </span>
                      <span className="font-bold text-gray-900">{property.daysLeft}일</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-600">현재 입찰 </span>
                    <span className="font-bold text-gray-900">{property.totalBids}건</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter Bottom Sheet */}
      {showFilter && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilter(false)}
          ></div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-5 pt-4 pb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-5">필터</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    지역
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['강남구', '서초구', '송파구', '강동구'].map((region) => (
                      <button
                        key={region}
                        className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium active:bg-gray-200"
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    가격대
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['5억 이하', '5-10억', '10-15억', '15억 이상'].map((price) => (
                      <button
                        key={price}
                        className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium active:bg-gray-200"
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                  >
                    적용하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
