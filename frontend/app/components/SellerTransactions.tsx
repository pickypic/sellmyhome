import { Link } from "react-router";
import { Calendar, CheckCircle, Clock, FileText, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { transactionsApi, Transaction } from "@/api/client";

// 백엔드 상태 → UI 레이블 + 진행률
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

const TX_STAGES = [
  { key: "contract_pending",     label: "계약 대기",  progress: 20 },
  { key: "contract_signed",      label: "계약 체결",  progress: 50 },
  { key: "balance_pending",      label: "잔금 대기",  progress: 70 },
  { key: "registration_pending", label: "등기 대기",  progress: 85 },
  { key: "completed",            label: "거래 완료",  progress: 100 },
];

export function SellerTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionsApi.getMySeller()
      .then(setTransactions)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const inProgress = transactions.filter((t) => t.status !== "completed" && t.status !== "cancelled");
  const completed  = transactions.filter((t) => t.status === "completed");

  const getColor = (status: string) => {
    const c = TX_STATUS[status]?.color;
    if (c === "green") return "text-green-600 bg-green-50";
    if (c === "blue") return "text-blue-600 bg-blue-50";
    if (c === "orange") return "text-orange-600 bg-orange-50";
    return "text-gray-500 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Summary Card */}
      <div className="bg-white px-5 py-6 mb-2">
        <h3 className="text-sm text-gray-600 mb-3">거래 통계</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600 mb-1">{loading ? "-" : inProgress.length}</div>
            <div className="text-xs text-gray-600">진행중</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600 mb-1">{loading ? "-" : completed.length}</div>
            <div className="text-xs text-gray-600">완료</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-900 mb-1">{loading ? "-" : transactions.length}</div>
            <div className="text-xs text-gray-600">전체</div>
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
      <div className="px-5 py-4">
        <h3 className="text-base font-bold text-gray-900 mb-4">거래 내역</h3>

        {loading && <div className="py-10 text-center text-gray-400 text-sm">불러오는 중...</div>}

        {!loading && transactions.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-gray-500">진행중인 거래가 없습니다</p>
          </div>
        )}

        <div className="space-y-3">
          {transactions.map((tx) => {
            const statusInfo = TX_STATUS[tx.status] ?? { label: tx.status, progress: 0, color: "gray" };
            const property = (tx as any).property;
            const agent = (tx as any).agent;

            return (
              <div key={tx.id} className="bg-white border border-gray-200 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {tx.status === "completed" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-600" />
                      )}
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getColor(tx.status)}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {property?.apartment_name ?? "-"}
                    </h4>
                    <div className="flex items-start gap-1 text-xs text-gray-600">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{property?.address ?? "-"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {tx.created_at?.slice(0, 10)}
                  </div>
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

                {/* Details */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">거래가</div>
                      <div className="font-semibold text-gray-900">{formatPrice(tx.agreed_price || property?.asking_price)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">수수료율</div>
                      <div className="font-semibold text-gray-900">{tx.commission_rate}%</div>
                    </div>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {agent?.name?.charAt(0) ?? "중"}
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">담당 중개사</div>
                      <div className="text-sm font-semibold text-gray-900">{agent?.name ?? "-"}</div>
                    </div>
                  </div>
                  <Link to={`/transaction/${tx.id}`} className="text-sm text-blue-600 font-semibold">
                    상세보기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Help Section */}
      <div className="px-5 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">거래 관련 문의</h4>
              <p className="text-sm text-gray-600 mb-3">거래 진행 중 문제가 있으신가요?</p>
              <button className="text-sm text-blue-600 font-semibold">고객센터 문의하기 →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
