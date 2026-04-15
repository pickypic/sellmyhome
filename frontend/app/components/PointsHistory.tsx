import { Filter, ArrowLeft, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// Mock data
const mockPointsHistory = [
  {
    id: 1,
    type: "earned",
    amount: 100,
    reason: "매칭 성공",
    date: "2026-03-15",
    time: "14:30",
    propertyAddress: "역삼동 123-45",
    balance: 300,
  },
  {
    id: 2,
    type: "used",
    amount: -50,
    reason: "프리미엄 매물 우선권 사용",
    date: "2026-03-14",
    time: "09:15",
    propertyAddress: "서초동 678-90",
    balance: 200,
  },
  {
    id: 3,
    type: "earned",
    amount: 50,
    reason: "리뷰 작성 보너스",
    date: "2026-03-10",
    time: "16:45",
    propertyAddress: null,
    balance: 250,
  },
  {
    id: 4,
    type: "earned",
    amount: 100,
    reason: "매칭 성공",
    date: "2026-03-01",
    time: "10:00",
    propertyAddress: "잠실동 345-67",
    balance: -100,
  },
  {
    id: 5,
    type: "used",
    amount: -30,
    reason: "제안서 하이라이트",
    date: "2026-02-28",
    time: "15:30",
    propertyAddress: "반포동 890-12",
    balance: -200,
  },
  {
    id: 6,
    type: "earned",
    amount: 30,
    reason: "프로필 완성",
    date: "2026-02-25",
    time: "13:00",
    propertyAddress: null,
    balance: -170,
  },
  {
    id: 7,
    type: "earned",
    amount: 20,
    reason: "첫 지원 보너스",
    date: "2026-02-20",
    time: "09:45",
    propertyAddress: null,
    balance: -200,
  },
];

export function PointsHistory() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "earned" | "spent">("all");

  const handleBack = () => {
    navigate(-1);
  };

  const filteredHistory = mockPointsHistory.filter((h) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "earned") return h.type === "earned";
    if (activeFilter === "spent") return h.type === "used";
    return true;
  });

  const totalEarned = mockPointsHistory
    .filter((h) => h.type === "earned")
    .reduce((acc, h) => acc + h.amount, 0);
  
  const totalUsed = Math.abs(
    mockPointsHistory
      .filter((h) => h.type === "used")
      .reduce((acc, h) => acc + h.amount, 0)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">포인트 내역</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          모든 포인트 적립 및 사용 내역을 확인하세요
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">총 획득</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              +{totalEarned}P
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">총 사용</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              -{totalUsed}P
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "전체" },
            { key: "earned", label: "적립" },
            { key: "spent", label: "사용" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                activeFilter === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 active:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="bg-white px-5 py-5">
        <div className="space-y-4">
          {filteredHistory.map((history) => (
            <div
              key={history.id}
              className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  history.amount > 0
                    ? "bg-green-50"
                    : "bg-orange-50"
                }`}
              >
                {history.amount > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 mb-0.5">
                  {history.reason}
                </div>
                {history.propertyAddress && (
                  <div className="text-xs text-gray-600 mb-1">
                    {history.propertyAddress}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {history.date} {history.time}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className={`text-lg font-bold ${
                    history.amount > 0 ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {history.amount > 0 ? "+" : ""}
                  {history.amount}P
                </div>
                <div className="text-xs text-gray-500">
                  잔액 {history.balance > 0 ? history.balance : 0}P
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">내역이 없습니다</p>
          <p className="text-sm text-gray-400">
            활동을 통해 포인트를 적립해보세요
          </p>
        </div>
      )}
    </div>
  );
}