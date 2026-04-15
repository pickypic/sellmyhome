import { useParams, Link } from "react-router";
import { useNavigate } from "react-router";
import { Star, Award, MapPin, Phone, Mail, ArrowLeft } from "lucide-react";

// Mock data
const mockReviews = [
  {
    id: 1,
    sellerName: "김**",
    rating: 5,
    property: "강남구 역삼동 아파트",
    comment: "매우 전문적이고 신속하게 처리해주셨습니다. 추천합니다!",
    date: "2026-02-15",
  },
  {
    id: 2,
    sellerName: "이**",
    rating: 5,
    property: "강남구 삼성동 아파트",
    comment: "해당 지역에 대한 지식이 풍부하고 성실하게 대응해주셨어요.",
    date: "2026-01-20",
  },
  {
    id: 3,
    sellerName: "박**",
    rating: 4,
    property: "강남구 대치동 아파트",
    comment: "좋은 조건으로 빠르게 거래를 마칠 수 있었습니다.",
    date: "2025-12-10",
  },
];

export function AgentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const agent = {
    id: Number(id),
    name: "김중개",
    experience: "10년",
    rating: 4.8,
    reviewCount: 45,
    totalDeals: 120,
    specialties: ["강남구 전문", "아파트 거래", "고액 매물"],
    regions: ["강남구", "서초구", "송파구"],
    introduction: "안녕하세요. 강남권에서 10년간 활동해온 김중개입니다. 고객님의 소중한 자산 거래를 책임감 있게 진행하겠습니다.",
    qualifications: [
      "공인중개사 자격증 보유",
      "부동산 컨설팅 전문가",
      "중개 보증 보험 가입",
    ],
    phoneDisplay: "010-****-1234",
    email: "agent@example.com",
    office: "서울특별시 강남구 역삼동 123-45 1층",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center z-10">
        <button onClick={handleBack} className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-base font-semibold text-gray-900 ml-2">중개사 프로필</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {agent.name.charAt(0)}
          </div>
          <div className="flex-1 pt-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {agent.name}
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{agent.rating}</span>
                <span className="text-sm text-gray-500">({agent.reviewCount})</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              경력 {agent.experience} · 거래 {agent.totalDeals}건
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2">
          {agent.specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{agent.totalDeals}</div>
            <div className="text-xs text-gray-600">총 거래</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{agent.rating}</div>
            <div className="text-xs text-gray-600">평균 평점</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{agent.experience}</div>
            <div className="text-xs text-gray-600">경력</div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-semibold text-gray-900 mb-3">소개</h3>
        <p className="text-gray-700 leading-relaxed text-sm">{agent.introduction}</p>
      </div>

      {/* Qualifications */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-semibold text-gray-900 mb-3">자격 및 인증</h3>
        <div className="space-y-2">
          {agent.qualifications.map((qual, index) => (
            <div key={index} className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
              <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{qual}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Regions */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-semibold text-gray-900 mb-3">활동 지역</h3>
        <div className="flex flex-wrap gap-2">
          {agent.regions.map((region, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm"
            >
              <MapPin className="w-4 h-4" />
              {region}
            </span>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-semibold text-gray-900 mb-3">연락처</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="text-xs text-gray-600">전화번호</div>
              <div className="font-semibold text-gray-900 text-sm">{agent.phoneDisplay}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="text-xs text-gray-600">이메일</div>
              <div className="font-semibold text-gray-900 text-sm">{agent.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="text-xs text-gray-600">사무소</div>
              <div className="font-semibold text-gray-900 text-sm">{agent.office}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            거래 후기 ({mockReviews.length})
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-sm">{agent.rating}</span>
          </div>
        </div>

        <div className="space-y-3">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{review.sellerName}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{review.property}</p>
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Padding */}
      <div className="h-20"></div>
    </div>
  );
}