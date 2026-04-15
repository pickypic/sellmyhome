import { TrendingUp, TrendingDown, Zap, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { pointsApi, PointTransaction } from "@/api/client";

export function PointsHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "earned" | "spent">("all");

  useEffect(() => {
    pointsApi.getHistory()
      .then((data) => setHistory(data ?? []))
      .catch((e) => toast.error(e.message || "내역을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, []);

  const filteredHistory = history.filter((h) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "earned") return h.amount > 0;
    if (activeFilter === "spent") return h.amount < 0;
    return true;
  });

  const totalEarned = history
    .filter((h) => h.amount > 0)
    .reduce((acc, h) => acc + h.amount, 0);

  const totalUsed = Math.abs(
    history
      .filter((h) => h.amount < 0)
      .reduce((acc, h) => acc + h.amount, 0)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
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
              {loading ? "..." : `+${totalEarned}P`}
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">총 사용</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {loading ? "..." : `-${totalUsed}P`}
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
      {loading ? (
        <div className="bg-white px-5 py-20 text-center text-gray-400 text-sm">
          불러오는 중...
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white px-5 py-20 text-center">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">내역이 없습니다</p>
          <p className="text-sm text-gray-400">
            활동을 통해 포인트를 적립해보세요
          </p>
        </div>
      ) : (
        <div className="bg-white px-5 py-5">
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.amount > 0 ? "bg-green-50" : "bg-orange-50"
                  }`}
                >
                  {item.amount > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 mb-0.5">
                    {item.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.created_at?.slice(0, 10)}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className={`text-lg font-bold ${
                      item.amount > 0 ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {item.amount > 0 ? "+" : ""}
                    {item.amount}P
                  </div>
                  <div className="text-xs text-gray-500">
                    잔액 {item.balance > 0 ? item.balance : 0}P
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
