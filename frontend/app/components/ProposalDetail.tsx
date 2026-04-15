import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";
import {
  Star,
  MapPin,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Building2,
  Award,
  TrendingUp,
  Clock,
  Shield,
  User,
} from "lucide-react";

export function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const proposal = {
    id: 1,
    agentId: 1, // Agent ID for profile link
    propertyAddress: "서울특별시 강남구 역삼동 123-45",
    apartmentName: "역삼래미안",
    area: "84㎡",
    agentName: "김중개",
    agentPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200",
    agentRating: 4.9,
    agentDeals: 156,
    agentYears: 12,
    officeName: "강남부동산중개",
    officeAddress: "서울특별시 강남구 역삼로 123",
    phone: "02-1234-5678",
    email: "kim@realestate.com",
    commission: "0.4%",
    estimatedPrice: "12억 8천만원",
    estimatedDays: 45,
    guaranteePeriod: "6개월",
    highlights: ["최고가 제안", "빠른 거래 보장", "무료 홈스테이징"],
    strategy:
      "역삼동 일대 프리미엄 아파트 거래 전문가로서, 최근 3개월간 역삼래미안에서 5건의 거래를 성사시켰습니다. 현재 매수 대기 고객 3팀이 있어 빠른 거래가 가능하며, 시세보다 3% 높은 가격으로 거래를 성사시킨 경험이 있습니다.",
    certifications: ["공인중개사", "부동산컨설턴트"],
    specialties: ["강남구 아파트", "프리미엄 매물", "투자 상담"],
    status: "pending",
  };

  const handleAccept = () => {
    alert("제안을 수락했습니다!");
    navigate("/seller/proposals");
  };

  const handleReject = () => {
    if (confirm("정말 거절하시겠습니까?")) {
      alert("제안을 거절했습니다.");
      navigate("/seller/proposals");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Property Info */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-start gap-2 text-blue-600 mb-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 mb-0.5">
              {proposal.apartmentName} · {proposal.area}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {proposal.propertyAddress}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Profile */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={proposal.agentPhoto}
            alt={proposal.agentName}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {proposal.agentName}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{proposal.agentRating}</span>
              </div>
              <span>·</span>
              <span>{proposal.agentDeals}건 거래</span>
              <span>·</span>
              <span>{proposal.agentYears}년 경력</span>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${proposal.phone}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold"
              >
                <Phone className="w-3 h-3" />
                전화
              </a>
              <a
                href={`mailto:${proposal.email}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold"
              >
                <Mail className="w-3 h-3" />
                이메일
              </a>
            </div>
          </div>
        </div>

        {/* Office Info */}
        <div className="border-t border-gray-100 pt-4 pb-4">
          <div className="flex items-start gap-2 mb-3">
            <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900 text-sm mb-0.5">
                {proposal.officeName}
              </div>
              <div className="text-xs text-gray-600">
                {proposal.officeAddress}
              </div>
            </div>
          </div>

          {/* View Agent Profile Button */}
          <Link
            to={`/agent/${proposal.agentId}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold active:bg-gray-200"
          >
            <User className="w-4 h-4" />
            중개사 상세 프로필 보기
          </Link>
        </div>
      </div>

      {/* Proposal Summary */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">제안 조건</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-xs text-blue-600 mb-1">중개 수수료</div>
            <div className="text-xl font-bold text-blue-600">
              {proposal.commission}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-xs text-green-600 mb-1">예상 거래가</div>
            <div className="text-xl font-bold text-green-600">
              {proposal.estimatedPrice}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-600 mb-0.5">예상 거래 기간</div>
              <div className="text-sm font-semibold text-gray-900">
                {proposal.estimatedDays}일
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-600 mb-0.5">거래 보증</div>
              <div className="text-sm font-semibold text-gray-900">
                {proposal.guaranteePeriod}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-3">주요 강점</h3>
        <div className="space-y-2">
          {proposal.highlights.map((highlight, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-700">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-3">거래 전략</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {proposal.strategy}
        </p>
      </div>

      {/* Certifications */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-3">자격 및 인증</h3>
        <div className="flex flex-wrap gap-2">
          {proposal.certifications.map((cert, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium"
            >
              <Award className="w-3 h-3" />
              {cert}
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-3">전문 분야</h3>
        <div className="flex flex-wrap gap-2">
          {proposal.specialties.map((specialty, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
            >
              {specialty}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {proposal.status === "pending" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold active:bg-gray-50"
            >
              <XCircle className="w-5 h-5" />
              거절하기
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold active:bg-blue-700"
            >
              <CheckCircle2 className="w-5 h-5" />
              수락하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}