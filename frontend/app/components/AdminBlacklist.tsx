import { useState } from "react";
import { Ban, Plus, Trash2, Search } from "lucide-react";

// Mock data
const mockBlacklist = [
  {
    id: 1,
    userId: "user_fraud1",
    userName: "사기범1",
    email: "fraud1@email.com",
    phone: "010-1234-5678",
    reason: "다수의 사기 신고 접수",
    addedDate: "2026-03-01",
    addedBy: "관리자",
    permanent: true,
  },
  {
    id: 2,
    userId: "user_spam2",
    userName: "스팸봇2",
    email: "spam2@email.com",
    phone: "010-9876-5432",
    reason: "자동화 프로그램 사용",
    addedDate: "2026-02-25",
    addedBy: "관리자",
    permanent: true,
  },
  {
    id: 3,
    userId: "user_abuse3",
    userName: "욕설유저3",
    email: "abuse3@email.com",
    phone: "010-5555-6666",
    reason: "심각한 욕설 및 협박",
    addedDate: "2026-02-15",
    addedBy: "관리자",
    permanent: false,
    releaseDate: "2026-08-15",
  },
];

export function AdminBlacklist() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredBlacklist = mockBlacklist.filter(
    (item) =>
      searchQuery === "" ||
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery)
  );

  const handleRemove = (id: number) => {
    if (
      confirm(
        "이 사용자를 블랙리스트에서 제거하시겠습니까? 즉시 서비스 이용이 가능해집니다."
      )
    ) {
      alert("블랙리스트에서 제거되었습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <h1 className="text-xl font-bold text-gray-900 mb-1">블랙리스트</h1>
        <p className="text-sm text-gray-600">
          영구 차단된 사용자 목록을 관리하세요
        </p>
      </div>

      {/* Search & Add */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이름, 이메일, 전화번호 검색..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 text-white rounded-lg font-semibold active:bg-red-700"
        >
          <Plus className="w-5 h-5" />
          블랙리스트 추가
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {mockBlacklist.filter((b) => b.permanent).length}
            </div>
            <div className="text-xs text-red-900">영구 차단</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {mockBlacklist.filter((b) => !b.permanent).length}
            </div>
            <div className="text-xs text-orange-900">기간 제한</div>
          </div>
        </div>
      </div>

      {/* Blacklist */}
      <div className="bg-white px-5 py-5">
        <div className="space-y-3">
          {filteredBlacklist.map((item) => (
            <div
              key={item.id}
              className="border-2 border-red-200 bg-red-50 rounded-xl p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Ban className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="font-bold text-gray-900">
                      {item.userName}
                    </span>
                    {item.permanent && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                        영구
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{item.email}</div>
                  <div className="text-xs text-gray-500">{item.phone}</div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-0.5">차단 사유</div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.reason}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-0.5">추가일</div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.addedDate}
                    </div>
                  </div>
                  {item.releaseDate && (
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-0.5">해제 예정</div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.releaseDate}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-0.5">담당자</div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.addedBy}
                  </div>
                </div>
              </div>

              {/* User ID */}
              <div className="mt-3 pt-3 border-t border-red-200">
                <div className="text-xs text-gray-500">
                  User ID: {item.userId}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredBlacklist.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <Ban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
        </div>
      )}

      {/* Add to Blacklist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-lg p-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">블랙리스트 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-red-900 mb-1">
                      경고
                    </div>
                    <div className="text-xs text-red-700">
                      블랙리스트에 추가된 사용자는 즉시 서비스 이용이 차단됩니다.
                      신중하게 결정해주세요.
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사용자 ID *
                </label>
                <input
                  type="text"
                  placeholder="user_123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  차단 유형 *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600">
                  <option value="permanent">영구 차단</option>
                  <option value="temporary">기간 제한 차단</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  차단 사유 *
                </label>
                <textarea
                  placeholder="차단 사유를 상세히 입력하세요"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
              </div>

              <button
                onClick={() => {
                  if (
                    confirm(
                      "정말 이 사용자를 블랙리스트에 추가하시겠습니까?"
                    )
                  ) {
                    alert("블랙리스트에 추가되었습니다!");
                    setShowAddModal(false);
                  }
                }}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold active:bg-red-700"
              >
                블랙리스트 추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
