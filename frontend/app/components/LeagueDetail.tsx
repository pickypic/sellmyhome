import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import {
  Users,
  Crown,
  TrendingUp,
  Award,
  Settings,
  MapPin,
  DollarSign,
  ArrowLeft,
  X,
  UserMinus,
  Edit2,
} from "lucide-react";

export function LeagueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [editedLeagueName, setEditedLeagueName] = useState("");
  const [isNameChecked, setIsNameChecked] = useState(false);
  const [tempMembers, setTempMembers] = useState<typeof members>([]);
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "김중개",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
      role: "leader" as const,
      contribution: 45,
      deals: 4,
    },
    {
      id: 2,
      name: "이부동산",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
      role: "member" as const,
      contribution: 35,
      deals: 3,
    },
    {
      id: 3,
      name: "박공인",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100",
      role: "member" as const,
      contribution: 20,
      deals: 1,
    },
  ]);
  const [leagueName, setLeagueName] = useState("강남 프리미엄 팀");

  const handleCheckLeagueName = () => {
    if (!editedLeagueName.trim()) {
      alert("리그 이름을 입력해주세요.");
      return;
    }
    
    // Mock API call to check duplicate
    // 실제로는 서버에 중복 확인 요청을 보내야 함
    const existingNames = ["강남 프리미엄 팀", "서초 엘리트", "압구정 팀"];
    
    if (existingNames.includes(editedLeagueName.trim())) {
      alert("이미 사용 중인 리그 이름입니다.");
      setIsNameChecked(false);
    } else {
      alert("사용 가능한 리그 이름입니다.");
      setIsNameChecked(true);
    }
  };

  const handleRemoveMemberFromTemp = (memberId: number) => {
    const member = tempMembers.find((m) => m.id === memberId);
    if (member && member.role !== "leader") {
      if (confirm(`${member.name}님을 리그에서 탈퇴시키겠습니까?`)) {
        setTempMembers(tempMembers.filter((m) => m.id !== memberId));
      }
    }
  };

  const handleOpenSettings = () => {
    setEditedLeagueName(leagueName);
    setTempMembers([...members]);
    setShowSettings(true);
  };

  const handleApplySettings = () => {
    if (editedLeagueName.trim()) {
      setLeagueName(editedLeagueName.trim());
    }
    setMembers(tempMembers);
    setShowSettings(false);
    alert("리그 설정이 적용되었습니다.");
  };

  const handleCancelSettings = () => {
    setEditedLeagueName("");
    setTempMembers([]);
    setShowSettings(false);
  };

  // Mock data
  const league = {
    id: 1,
    name: leagueName,
    createdDate: "2026-01-15",
    myRole: "leader",
    members: members,
    activeBids: 2,
    completedDeals: 8,
    totalRevenue: 3200,
    recentDeals: [
      {
        id: 1,
        address: "서울특별시 강남구 역삼동 123-45",
        apartmentName: "역삼래미안",
        price: "12억 8천만원",
        commission: 512,
        date: "2026-03-10",
        leadAgent: "김중개",
      },
      {
        id: 2,
        address: "서울특별시 강남구 삼성동 456-78",
        apartmentName: "삼성아이파크",
        price: "15억원",
        commission: 600,
        date: "2026-03-05",
        leadAgent: "이부동산",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="p-1 -ml-1">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">{league.name}</h1>
                {league.myRole === "leader" && (
                  <Crown className="w-5 h-5 text-amber-500" />
                )}
              </div>
            </div>
            {league.myRole === "leader" && (
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={handleOpenSettings}
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 pl-9">생성일: {league.createdDate}</p>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">리그 성과</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {league.activeBids}
            </div>
            <div className="text-xs text-blue-900">진행중</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {league.completedDeals}
            </div>
            <div className="text-xs text-green-900">완료</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-amber-600 mb-1">
              {league.totalRevenue}만
            </div>
            <div className="text-xs text-amber-900">총 수익</div>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">
            멤버 ({league.members.length})
          </h3>
        </div>
        <div className="space-y-3">
          {league.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
            >
              <img
                src={member.photo}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-gray-900">
                    {member.name}
                  </span>
                  {member.role === "leader" && (
                    <Crown className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="text-xs text-gray-600">
                  거래 {member.deals}건 · 기여도 {member.contribution}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  {member.contribution}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Deals */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">최근 거래</h3>
        <div className="space-y-3">
          {league.recentDeals.map((deal) => (
            <div
              key={deal.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 mb-0.5">
                    {deal.apartmentName}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {deal.address}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-1">거래가</div>
                  <div className="text-sm font-bold text-gray-900">
                    {deal.price}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-600 mb-1">수수료</div>
                  <div className="text-sm font-bold text-blue-600">
                    {deal.commission}만원
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>담당: {deal.leadAgent}</span>
                <span>{deal.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Distribution */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">수익 배분</h3>
        <div className="space-y-3">
          {league.members.map((member) => {
            const revenue = Math.round(league.totalRevenue * (member.contribution / 100));
            return (
              <div key={member.id} className="flex items-center gap-3">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {member.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {revenue}만원
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2"
                      style={{ width: `${member.contribution}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-900">리그 설정</h3>
              <button
                className="p-1 hover:bg-gray-100 rounded-lg"
                onClick={handleCancelSettings}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="px-6 py-5 space-y-6 overflow-y-auto flex-1">
              {/* League Name Edit */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Edit2 className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">리그 이름 수정</h4>
                </div>
                <input
                  type="text"
                  value={editedLeagueName}
                  onChange={(e) => setEditedLeagueName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="새 리그 이름 입력"
                />
                <button
                  className="mt-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                  onClick={handleCheckLeagueName}
                >
                  중복 확인
                </button>
              </div>

              {/* Member Management */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UserMinus className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">멤버 관리</h4>
                </div>
                <div className="space-y-2">
                  {tempMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">
                            {member.name}
                          </span>
                          {member.role === "leader" && (
                            <Crown className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-600">
                          {member.role === "leader" ? "리더" : "멤버"}
                        </div>
                      </div>
                      {member.role !== "leader" && (
                        <button
                          onClick={() => handleRemoveMemberFromTemp(member.id)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
                        >
                          탈퇴
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer - Apply Button */}
            <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0 rounded-b-2xl bg-white">
              <button
                onClick={handleApplySettings}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold active:bg-blue-700"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}