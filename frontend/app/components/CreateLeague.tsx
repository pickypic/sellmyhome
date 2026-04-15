import { useState } from "react";
import { useNavigate } from "react-router";
import { Users, Plus, X, Search, CheckCircle2, ArrowLeft } from "lucide-react";

// Mock data
const mockAgents = [
  {
    id: 1,
    name: "이부동산",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50",
    rating: 4.7,
    deals: 98,
    specialty: "강남구 전문",
  },
  {
    id: 2,
    name: "박공인",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=50",
    rating: 4.8,
    deals: 203,
    specialty: "서초구 전문",
  },
  {
    id: 3,
    name: "최중개",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50",
    rating: 4.6,
    deals: 145,
    specialty: "송파구 전문",
  },
];

export function CreateLeague() {
  const navigate = useNavigate();
  const [leagueName, setLeagueName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = mockAgents.filter(
    (agent) =>
      agent.name.includes(searchQuery) ||
      agent.specialty.includes(searchQuery)
  );

  const toggleMember = (agentId: number) => {
    if (selectedMembers.includes(agentId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== agentId));
    } else {
      setSelectedMembers([...selectedMembers, agentId]);
    }
  };

  const handleCreate = () => {
    if (!leagueName.trim()) {
      alert("리그 이름을 입력해주세요");
      return;
    }
    if (selectedMembers.length === 0) {
      alert("최소 1명의 멤버를 선택해주세요");
      return;
    }
    alert("리그가 생성되었습니다!");
    navigate("/agent/leagues");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">리그 만들기</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          함께 협력할 중개사들을 초대하세요
        </p>
      </div>

      {/* League Name */}
      <div className="bg-white px-5 py-5 mb-2">
        <label className="block mb-3">
          <span className="text-sm font-semibold text-gray-900 mb-2 block">
            리그 이름 *
          </span>
          <input
            type="text"
            value={leagueName}
            onChange={(e) => setLeagueName(e.target.value)}
            placeholder="예: 강남 프리미엄 팀"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </label>
      </div>

      {/* Selected Members */}
      {selectedMembers.length > 0 && (
        <div className="bg-white px-5 py-5 mb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              선택된 멤버 ({selectedMembers.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((memberId) => {
              const agent = mockAgents.find((a) => a.id === memberId);
              if (!agent) return null;
              return (
                <div
                  key={memberId}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg"
                >
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-blue-900">
                    {agent.name}
                  </span>
                  <button
                    onClick={() => toggleMember(memberId)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="중개사 검색"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Agent List */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-semibold text-gray-900 mb-3">중개사 목록</h3>
        <div className="space-y-2">
          {filteredAgents.map((agent) => {
            const isSelected = selectedMembers.includes(agent.id);
            return (
              <button
                key={agent.id}
                onClick={() => toggleMember(agent.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 mb-0.5">
                    {agent.name}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    ⭐ {agent.rating} · {agent.deals}건
                  </div>
                  <div className="text-xs text-blue-600">{agent.specialty}</div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {filteredAgents.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <p className="text-gray-500">검색 결과가 없습니다</p>
        </div>
      )}

      {/* Create Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4 z-50">
        <button
          onClick={handleCreate}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={selectedMembers.length === 0}
        >
          <Plus className="w-5 h-5" />
          리그 만들기
        </button>
      </div>
    </div>
  );
}