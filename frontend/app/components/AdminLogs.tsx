import { useState } from "react";
import { Activity, Filter, Download, Search } from "lucide-react";

// Mock data
const mockLogs = [
  {
    id: 1,
    userId: "user_123",
    userName: "김매도",
    userType: "seller",
    action: "login",
    detail: "로그인 성공",
    ip: "121.162.xxx.xxx",
    device: "iPhone 14 Pro",
    timestamp: "2026-03-16 09:30:15",
  },
  {
    id: 2,
    userId: "user_456",
    userName: "이중개",
    userType: "agent",
    action: "property_view",
    detail: "매물 상세 조회 (역삼동 123-45)",
    ip: "210.99.xxx.xxx",
    device: "Chrome on Windows",
    timestamp: "2026-03-16 09:28:42",
  },
  {
    id: 3,
    userId: "user_789",
    userName: "박매도",
    userType: "seller",
    action: "property_upload",
    detail: "매물 등록 (서초동 678-90)",
    ip: "175.223.xxx.xxx",
    device: "Safari on MacBook",
    timestamp: "2026-03-16 09:25:33",
  },
  {
    id: 4,
    userId: "user_456",
    userName: "이중개",
    userType: "agent",
    action: "proposal_submit",
    detail: "제안서 제출 (역삼동 123-45)",
    ip: "210.99.xxx.xxx",
    device: "Chrome on Windows",
    timestamp: "2026-03-16 09:20:18",
  },
  {
    id: 5,
    userId: "user_123",
    userName: "김매도",
    userType: "seller",
    action: "proposal_accept",
    detail: "제안서 수락 (이중개)",
    ip: "121.162.xxx.xxx",
    device: "iPhone 14 Pro",
    timestamp: "2026-03-16 09:15:27",
  },
  {
    id: 6,
    userId: "admin_001",
    userName: "관리자",
    userType: "admin",
    action: "user_verify",
    detail: "사용자 인증 승인 (이중개)",
    ip: "192.168.xxx.xxx",
    device: "Chrome on Windows",
    timestamp: "2026-03-16 09:10:05",
  },
  {
    id: 7,
    userId: "user_321",
    userName: "최중개",
    userType: "agent",
    action: "property_edit",
    detail: "프로필 수정",
    ip: "118.235.xxx.xxx",
    device: "Chrome on Android",
    timestamp: "2026-03-16 09:05:42",
  },
  {
    id: 8,
    userId: "user_654",
    userName: "정매도",
    userType: "seller",
    action: "property_delete",
    detail: "매물 삭제 (잠실동 345-67)",
    ip: "211.36.xxx.xxx",
    device: "Safari on iPhone",
    timestamp: "2026-03-16 09:00:11",
  },
];

const actionTypes = [
  { value: "all", label: "전체" },
  { value: "login", label: "로그인" },
  { value: "property_view", label: "매물 조회" },
  { value: "property_upload", label: "매물 등록" },
  { value: "property_edit", label: "수정" },
  { value: "property_delete", label: "삭제" },
  { value: "proposal_submit", label: "제안서 제출" },
  { value: "proposal_accept", label: "제안서 수락" },
  { value: "user_verify", label: "인증" },
];

export function AdminLogs() {
  const [actionFilter, setActionFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesAction =
      actionFilter === "all" || log.action === actionFilter;
    const matchesSearch =
      searchQuery === "" ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "login":
        return "bg-blue-50 text-blue-700";
      case "property_upload":
        return "bg-green-50 text-green-700";
      case "property_delete":
        return "bg-red-50 text-red-700";
      case "proposal_submit":
        return "bg-purple-50 text-purple-700";
      case "proposal_accept":
        return "bg-amber-50 text-amber-700";
      case "user_verify":
        return "bg-indigo-50 text-indigo-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getActionLabel = (action: string) => {
    const found = actionTypes.find((t) => t.value === action);
    return found ? found.label : action;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <h1 className="text-xl font-bold text-gray-900 mb-1">로그 조회</h1>
        <p className="text-sm text-gray-600">
          모든 사용자 활동을 추적하고 모니터링하세요
        </p>
      </div>

      {/* Search */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="사용자명 또는 활동 검색..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold active:bg-gray-200">
          <Download className="w-4 h-4" />
          로그 내보내기 (CSV)
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-900">활동 유형</span>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {actionTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setActionFilter(type.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                actionFilter === type.value
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 active:bg-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600 mb-0.5">
              {mockLogs.length}
            </div>
            <div className="text-xs text-blue-900">전체 로그</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-600 mb-0.5">
              {new Set(mockLogs.map((l) => l.userId)).size}
            </div>
            <div className="text-xs text-green-900">활성 사용자</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-600 mb-0.5">
              {mockLogs.filter((l) => l.action === "property_upload").length}
            </div>
            <div className="text-xs text-purple-900">신규 매물</div>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white px-5 py-5">
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Activity className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {log.userName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getActionColor(
                      log.action
                    )}`}
                  >
                    {getActionLabel(log.action)}
                  </span>
                  {log.userType === "admin" && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                      관리자
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-700 mb-1">{log.detail}</div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{log.timestamp}</span>
                  <span>·</span>
                  <span>{log.ip}</span>
                  <span>·</span>
                  <span>{log.device}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}
