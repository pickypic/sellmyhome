import { Users, Plus, Crown, ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

// Mock data
const mockLeagues = [
  {
    id: 1,
    name: "강남 프리미엄 팀",
    memberCount: 3,
    myRole: "leader",
    members: [
      { name: "김중개", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50" },
      { name: "이부동산", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50" },
      { name: "박공인", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=50" },
    ],
    activeBids: 2,
    completedDeals: 8,
    totalRevenue: "3,200만원",
    createdDate: "2026-01-15",
  },
  {
    id: 2,
    name: "서초 협력단",
    memberCount: 2,
    myRole: "member",
    members: [
      { name: "최중개", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" },
      { name: "정부동산", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50" },
    ],
    activeBids: 1,
    completedDeals: 3,
    totalRevenue: "1,050만원",
    createdDate: "2026-02-20",
  },
];

export function MyLeagues() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"owned" | "joined">("owned");

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">리그 관리</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          함께 성장하는 중개사 네트워크
        </p>
      </div>

      {/* Create Button */}
      <div className="bg-white px-5 py-4 mb-2">
        <Link
          to="/agent/leagues/create"
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          새 리그 만들기
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {mockLeagues.length}
            </div>
            <div className="text-xs text-gray-600">참여 리그</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mockLeagues.reduce((acc, l) => acc + l.activeBids, 0)}
            </div>
            <div className="text-xs text-gray-600">진행중</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {mockLeagues.reduce((acc, l) => acc + l.completedDeals, 0)}
            </div>
            <div className="text-xs text-gray-600">완료</div>
          </div>
        </div>
      </div>

      {/* Leagues List */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">내 리그</h3>
        <div className="space-y-3">
          {mockLeagues.map((league) => (
            <Link
              key={league.id}
              to={`/agent/leagues/${league.id}`}
              className="block border border-gray-200 rounded-xl p-4 active:bg-gray-50"
            >
              {/* League Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{league.name}</h4>
                    {league.myRole === "leader" && (
                      <Crown className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Users className="w-3 h-3" />
                    <span>멤버 {league.memberCount}명</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>

              {/* Members */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {league.members.slice(0, 3).map((member, idx) => (
                    <img
                      key={idx}
                      src={member.photo}
                      alt={member.name}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {league.members.map((m) => m.name).join(", ")}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-sm font-bold text-blue-600">
                    {league.activeBids}
                  </div>
                  <div className="text-xs text-gray-600">진행중</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-sm font-bold text-green-600">
                    {league.completedDeals}
                  </div>
                  <div className="text-xs text-gray-600">완료</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-xs font-bold text-gray-900">
                    {league.totalRevenue}
                  </div>
                  <div className="text-xs text-gray-600">총 수익</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {mockLeagues.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">아직 참여한 리그가 없습니다</p>
          <p className="text-sm text-gray-400 mb-6">
            다른 중개사들과 팀을 만들어 협력하세요
          </p>
          <Link
            to="/agent/leagues/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            리그 만들기
          </Link>
        </div>
      )}
    </div>
  );
}