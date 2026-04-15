import { useParams, Link, useNavigate } from "react-router";
import {
  MapPin,
  Calendar,
  Home,
  ChevronRight,
  User,
  Star,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Clock,
  Phone,
} from "lucide-react";
import { useState } from "react";

// MVP: 매도인은 최대 3명의 에이전트만 선택 가능
const MAX_SELECTED_AGENTS = 3;

// Mock data
const mockBids = [
  {
    id: 1,
    agentName: "김중개",
    agentId: 1,
    commission: "0.5%",
    experience: "10년",
    rating: 4.8,
    reviewCount: 45,
    specialties: ["강남구 전문", "아파트 거래 200건+"],
    message: "해당 단지 거래 경험이 풍부하며, 빠른 매매를 위한 마케팅 전략을 보유하고 있습니다.",
    phoneDisplay: "010-****-1234",
    bidDate: "2026-03-01",
  },
  {
    id: 2,
    agentName: "이부동산",
    agentId: 2,
    commission: "0.6%",
    experience: "15년",
    rating: 4.9,
    reviewCount: 78,
    specialties: ["프리미엄 매물 전문", "고액 거래"],
    message: "15년간 고가 아파트 전문으로 활동해왔으며, 검증된 매수자 네트워크를 보유하고 있습니다.",
    phoneDisplay: "010-****-5678",
    bidDate: "2026-03-01",
  },
  {
    id: 3,
    agentName: "박공인",
    agentId: 3,
    commission: "0.55%",
    experience: "8년",
    rating: 4.7,
    reviewCount: 32,
    specialties: ["역삼동 전문", "빠른 거래"],
    message: "역삼동 지역에서 8년간 활동하며 해당 단지 거래 30건 이상의 실적을 보유하고 있습니다.",
    phoneDisplay: "010-****-9012",
    bidDate: "2026-03-02",
  },
];

export function PropertyDetail() {
  const { id } = useParams();
  const [selectedAgent, setSelectedAgent] = useState<typeof mockBids[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  // Check user role from localStorage
  const userRole = localStorage.getItem("userRole");
  const isSeller = userRole === "seller";
  const isAgent = userRole === "agent";

  const property = {
    id: Number(id),
    address: "서울특별시 강남구 역삼동 123-45",
    apartmentName: "역삼래미안",
    area: "84㎡",
    price: "12억 5천만원",
    floor: "15층",
    direction: "남향",
    buildYear: "2015년",
    features: ["리모델링 완료", "한강 조망", "역세권 5분"],
    daysLeft: 2,
    totalBids: mockBids.length,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
  };

  const handleSelectAgent = (agent: typeof mockBids[0]) => {
    setSelectedAgent(agent);
  };

  // Check if agent has already bid
  const userHasBid = isAgent && mockBids.some(bid => bid.id === 1); // Mock check

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
        <img
          src={property.image}
          alt={property.apartmentName}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
          <h2 className="text-xl font-bold text-white mb-1">
            {property.apartmentName}
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
            <div className="text-2xl font-bold text-gray-900">{property.price}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">남은 시간</div>
            <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
              <Clock className="w-5 h-5 text-blue-600" />
              {property.daysLeft}일
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">현재 받은 제안</div>
            <div className="text-2xl font-bold text-blue-600">{property.totalBids}건</div>
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
              <div className="font-semibold text-gray-900">{property.area}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">층수</div>
              <div className="font-semibold text-gray-900">{property.floor}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">방향</div>
              <div className="font-semibold text-gray-900">{property.direction}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">준공년도</div>
              <div className="font-semibold text-gray-900">{property.buildYear}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">매물 특징</div>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* For Sellers: Bids List */}
      {isSeller && (
        <div className="bg-white px-5 py-5">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            중개사 제안 ({mockBids.length})
          </h3>
          
          <div className="space-y-3">
            {mockBids.map((bid) => (
              <div key={bid.id} className="border border-gray-200 rounded-xl p-4">
                {/* Agent Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {bid.agentName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {bid.agentName}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-sm">{bid.rating}</span>
                        <span className="text-xs text-gray-500">({bid.reviewCount})</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">경력 {bid.experience}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {bid.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Commission */}
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">제안 수수료</span>
                    <span className="text-2xl font-bold text-green-600">{bid.commission}</span>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1">제안 메시지</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{bid.message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/agent/${bid.agentId}`}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg text-center font-semibold text-sm"
                  >
                    프로필 보기
                  </Link>
                  <button
                    onClick={() => handleSelectAgent(bid)}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold text-sm"
                  >
                    선택하기
                  </button>
                </div>
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
                <div className="text-2xl font-bold text-blue-600">{property.totalBids}건</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">마감까지</div>
                <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                  <Clock className="w-5 h-5" />
                  2일
                </div>
              </div>
            </div>
          </div>

          {userHasBid ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800 font-medium text-center">
                ✓ 지원을 완료했습니다
              </p>
            </div>
          ) : null}

          {!userHasBid && (
            <Link
              to={`/property/${id}/bid`}
              className="block w-full py-4 bg-green-600 text-white rounded-lg font-semibold text-center"
            >
              지원하기
            </Link>
          )}

          <p className="text-xs text-gray-500 text-center mt-3">
            지원 후에도 마감 전까지 수정 가능합니다
          </p>
        </div>
      )}

      {/* Selection Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedAgent(null)}
          ></div>
          
          <div className="relative w-full bg-white rounded-t-2xl">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-5 pt-4 pb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                중개사 선택 확인
              </h2>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedAgent.agentName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedAgent.agentName}</div>
                    <div className="text-sm text-gray-600">
                      ⭐ {selectedAgent.rating} ({selectedAgent.reviewCount}개)
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">제안 수수료</span>
                    <span className="font-bold text-green-600">{selectedAgent.commission}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">{selectedAgent.phoneDisplay}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-5">
                선택 후 중개사와 직접 연락하여 계약을 진행하게 됩니다.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setSelectedAgent(null);
                    alert('중개사 선택이 완료되었습니다!');
                  }}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}