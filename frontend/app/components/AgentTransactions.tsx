import { MapPin, Calendar, CheckCircle2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { transactionsApi, Transaction } from "@/api/client";

const TX_STATUS: Record<string, { label: string; progress: number; color: string }> = {
  contract_pending:     { label: "계약 대기",  progress: 20,  color: "orange" },
  contract_signed:      { label: "계약 체결",  progress: 50,  color: "blue" },
  balance_pending:      { label: "잔금 대기",  progress: 70,  color: "blue" },
  registration_pending: { label: "등기 대기",  progress: 85,  color: "blue" },
  completed:            { label: "거래 완료",  progress: 100, color: "green" },
  cancelled:            { label: "거래 취소",  progress: 0,   color: "gray" },
};

function formatPrice(price?: number): string {
  if (!price) return "-";
  const eok = Math.floor(price / 100000000);
  const man = Math.floor((price % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man}만원`;
}

// 수수료 금액 계산 (asking_price × commission_rate%)
function calcCommission(price?: number, rate?: number): string {
  if (!price || !rate) return "-";
  return `${Math.round(price * rate / 100 / 10000).toLocaleString()}만원`;
}

const TX_STAGES = [
  { key: "contract_pending",     label: "계약 대기",  progress: 20 },
  { key: "contract_signed",      label: "계약 체결",  progress: 50 },
  { key: "balance_pending",      label: "잔금 대기",  progress: 70 },
  { key: "registration_pending", label: "등기 대기",  progress: 85 },
  { key: "completed",            label: "거래 완료",  progress: 100 },
];

export function AgentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "in_progress" | "completed">("all");

  useEffect(() => {
    transactionsApi.getMyAgent()
      .then(setTransactions)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = transactions.filter((t) => {
    if (filter === "in_progress") return t.status !== "completed" && t.status !== "cancelled";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

  const completedCount = transactions.filter((t) => t.status === "completed").length;
  const inProgressCount = transactions.filter((t) => t.status !== "completed" && t.status !== "cancelled").length;

  const getColor = (status: string) => {
    const c = TX_STATUS[status]?.color;
    if (c === "green") return "text-green-600 bg-green-50";
    if (c === "blue") return "text-blue-600 bg-blue-50";
    if (c === "orange") return "text-orange-600 bg-orange-50";
    return "text-gray-500 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <h1 className="text-xl font-bold text-gray-900 mb-1">거래 내역</h1>
        <p className="text-sm text-gray-600">매칭된 거래와 수수료를 확인하세요</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex gap-2">
          {[
            { key: "all", label: "전체" },
            { key: "in_progress", label: "진행중" },
            { key: "completed", label: "완료" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === tab.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{loading ? "-" : completedCount}</div>
            <div className="text-xs text-gray-600">완료 거래</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{loading ? "-" : inProgressCount}</div>
            <div className="text-xs text-gray-600">진행중</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-gray-900 mb-1">-</div>
            <div className="text-xs text-gray-600">총 수수료</div>
          </div>
        </div>
      </div>

      {/* Stages Guide */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">거래 진행 단계</h3>
        <div className="space-y-2">
          {TX_STAGES.map((stage, index) => (
            <div key={stage.key} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 text-sm font-medium text-gray-900">{stage.label}</div>
              <div className="text-xs text-gray-500">{stage.progress}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white px-5 py-5">
        {loading && <div className="py-10 text-center text-gray-400 text-sm">불러오는 중...</div>}

        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500 mb-2">거래 내역이 없습니다</p>
            <p className="text-sm text-gray-400">매물에 지원하여 매칭을 완료하세요</p>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((tx) => {
            const statusInfo = TX_STATUS[tx.status] ?? { label: tx.status, progress: 0, color: "gray" };
            const property = (tx as any).property;
            const seller = (tx as any).seller;

            return (
              <Link
                key={tx.id}
                to={`/agent/transactions/${tx.id}`}
                className="block border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Status + Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getColor(tx.status)}`}>
                    {tx.status === "completed" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {statusInfo.label}
                  </div>
                  <span className="text-xs text-gray-500">{tx.created_at?.slice(0, 10)}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">진행률</span>
                    <span className="text-xs font-semibold text-gray-900">{statusInfo.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${tx.status === "completed" ? "bg-green-600" : "bg-blue-600"}`}
                      style={{ width: `${statusInfo.progress}%` }}
                    />
                  </div>
                </div>

                {/* Property Info */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-0.5">
                      {property?.apartment_name ?? "-"} · {property?.area ? `${property.area}㎡` : ""}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{property?.address ?? "-"}</div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">거래가</div>
                    <div className="text-base font-bold text-gray-900">
                      {formatPrice(tx.agreed_price || property?.asking_price)}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-blue-600 mb-1">수수료(예상)</div>
                    <div className="text-base font-bold text-blue-600">
                      {calcCommission(tx.agreed_price || property?.asking_price, tx.commission_rate)}
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    매도인: <span className="font-medium">{seller?.name ?? "-"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {tx.created_at?.slice(0, 10)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
