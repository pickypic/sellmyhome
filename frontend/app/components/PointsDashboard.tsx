import { Coins, Plus, TrendingUp, ArrowLeft, Zap, Gift, Award, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { pointsApi, PointTransaction } from "@/api/client";

export function PointsDashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([pointsApi.getBalance(), pointsApi.getHistory()])
      .then(([bal, hist]) => {
        setBalance(bal.balance);
        setHistory(hist ?? []);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const totalEarned = history.filter((h) => h.amount > 0).reduce((s, h) => s + h.amount, 0);
  const totalUsed   = history.filter((h) => h.amount < 0).reduce((s, h) => s + Math.abs(h.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">포인트</h1>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">프리미엄 매물 우선권을 획득하세요</p>
      </div>

      {/* Current Points */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 mx-5 mb-2 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-medium text-blue-100">보유 포인트</span>
        </div>
        <div className="text-4xl font-bold mb-6">
          {loading ? "..." : balance.toLocaleString()} P
        </div>
        <Link
          to="/agent/points/purchase"
          className="block w-full py-3 bg-white text-blue-600 rounded-xl text-center font-semibold active:bg-blue-50"
        >
          포인트 충전하기
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">획득</span>
            </div>
            <div className="text-2xl font-bold text-green-600">+{loading ? "..." : totalEarned}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">사용</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">-{loading ? "..." : totalUsed}</div>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">포인트 사용 안내</h3>
        <div className="space-y-3">
          <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
            <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-blue-900 mb-1">프리미엄 매물 우선권</div>
              <div className="text-xs text-blue-700">50P를 사용하여 새 매물에 24시간 먼저 지원할 수 있습니다</div>
            </div>
          </div>
          <div className="flex gap-3 p-3 bg-purple-50 rounded-lg">
            <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-purple-900 mb-1">제안서 하이라이트</div>
              <div className="text-xs text-purple-700">30P를 사용하여 제안서를 매도인에게 강조 표시합니다</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="bg-white px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">최근 내역</h3>
          <Link to="/agent/points/history" className="text-sm text-blue-600 font-medium flex items-center gap-1">
            전체보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading && <div className="py-6 text-center text-gray-400 text-sm">불러오는 중...</div>}

        {!loading && history.length === 0 && (
          <div className="py-6 text-center text-gray-400 text-sm">포인트 내역이 없습니다</div>
        )}

        <div className="space-y-3">
          {history.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-0.5">{item.description}</div>
                <div className="text-xs text-gray-500 mt-1">{item.created_at?.slice(0, 10)}</div>
              </div>
              <div className={`text-base font-bold ${item.amount > 0 ? "text-green-600" : "text-orange-600"}`}>
                {item.amount > 0 ? "+" : ""}{item.amount}P
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
