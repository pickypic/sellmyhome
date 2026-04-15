import { useState } from "react";
import { Ban, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

// Mock data
const mockSanctions = [
  {
    id: 1,
    userId: "user_bad1",
    userName: "악의적사용자1",
    userType: "agent",
    email: "bad@email.com",
    reason: "허위 제안서 반복 작성",
    type: "suspend",
    duration: "7일",
    status: "active",
    startDate: "2026-03-10",
    endDate: "2026-03-17",
    issuedBy: "관리자",
    evidence: "3건의 허위 제안서 신고 접수",
  },
  {
    id: 2,
    userId: "user_bad2",
    userName: "스팸유저2",
    userType: "seller",
    email: "spam@email.com",
    reason: "중복 매물 등록 및 스팸",
    type: "warning",
    duration: "영구 기록",
    status: "completed",
    startDate: "2026-03-05",
    endDate: "2026-03-05",
    issuedBy: "관리자",
    evidence: "동일 매물 10회 중복 등록",
  },
  {
    id: 3,
    userId: "user_bad3",
    userName: "사기꾼3",
    userType: "agent",
    email: "fraud@email.com",
    reason: "사기 행위로 인한 영구 정지",
    type: "ban",
    duration: "영구",
    status: "active",
    startDate: "2026-02-20",
    endDate: null,
    issuedBy: "관리자",
    evidence: "매도인으로부터 금전 편취 시도",
  },
];

export function AdminSanctions() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("active");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredSanctions = mockSanctions.filter((s) =>
    filter === "all" ? true : s.status === filter
  );

  const handleRevoke = (id: number) => {
    if (confirm("이 제재를 해제하시겠습니까?")) {
      alert("제재가 해제되었습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <h1 className="text-xl font-bold text-gray-900 mb-1">제재 관리</h1>
        <p className="text-sm text-gray-600">
          사용자 제재 내역을 관리하고 조치하세요
        </p>
      </div>

      {/* Filter & Add */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex gap-2 mb-3">
          {[
            { key: "active", label: "활성" },
            { key: "completed", label: "완료" },
            { key: "all", label: "전체" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 active:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-2 bg-red-600 text-white rounded-lg font-semibold active:bg-red-700"
        >
          + 새 제재 추가
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {mockSanctions.filter((s) => s.type === "ban").length}
            </div>
            <div className="text-xs text-red-900">영구 정지</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {mockSanctions.filter((s) => s.type === "suspend").length}
            </div>
            <div className="text-xs text-orange-900">일시 정지</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {mockSanctions.filter((s) => s.type === "warning").length}
            </div>
            <div className="text-xs text-yellow-900">경고</div>
          </div>
        </div>
      </div>

      {/* Sanctions List */}
      <div className="bg-white px-5 py-5">
        <div className="space-y-3">
          {filteredSanctions.map((sanction) => (
            <div
              key={sanction.id}
              className={`border-2 rounded-xl p-4 ${
                sanction.type === "ban"
                  ? "border-red-300 bg-red-50"
                  : sanction.type === "suspend"
                  ? "border-orange-300 bg-orange-50"
                  : "border-yellow-300 bg-yellow-50"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">
                      {sanction.userName}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded ${
                        sanction.type === "ban"
                          ? "bg-red-600 text-white"
                          : sanction.type === "suspend"
                          ? "bg-orange-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {sanction.type === "ban"
                        ? "영구정지"
                        : sanction.type === "suspend"
                        ? "일시정지"
                        : "경고"}
                    </span>
                    {sanction.status === "active" ? (
                      <Clock className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    {sanction.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    제재일: {sanction.startDate}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-0.5">제재 사유</div>
                  <div className="text-sm font-medium text-gray-900">
                    {sanction.reason}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-0.5">증거</div>
                  <div className="text-sm text-gray-700">{sanction.evidence}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-0.5">기간</div>
                    <div className="text-sm font-medium text-gray-900">
                      {sanction.duration}
                    </div>
                  </div>
                  {sanction.endDate && (
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-0.5">종료일</div>
                      <div className="text-sm font-medium text-gray-900">
                        {sanction.endDate}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-0.5">담당자</div>
                  <div className="text-sm font-medium text-gray-900">
                    {sanction.issuedBy}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {sanction.status === "active" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRevoke(sanction.id)}
                    className="flex-1 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold active:bg-gray-50"
                  >
                    제재 해제
                  </button>
                  <button className="flex-1 py-2 bg-gray-900 text-white rounded-lg font-semibold active:bg-gray-800">
                    상세 보기
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredSanctions.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <Ban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">제재 내역이 없습니다</p>
        </div>
      )}

      {/* Add Sanction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-lg p-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">새 제재 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사용자 ID
                </label>
                <input
                  type="text"
                  placeholder="user_123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제재 유형
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600">
                  <option value="warning">경고</option>
                  <option value="suspend">일시 정지</option>
                  <option value="ban">영구 정지</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제재 사유
                </label>
                <textarea
                  placeholder="제재 사유를 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
              </div>

              <button
                onClick={() => {
                  alert("제재가 추가되었습니다!");
                  setShowAddModal(false);
                }}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold active:bg-red-700"
              >
                제재 추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
