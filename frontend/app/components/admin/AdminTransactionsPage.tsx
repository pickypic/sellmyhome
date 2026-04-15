import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi } from "@/api/client";
import { toast } from "sonner";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  contract_pending:     { label: "계약 대기", color: "bg-orange-50 text-orange-600" },
  contract_signed:      { label: "계약 체결", color: "bg-blue-50 text-blue-600" },
  balance_pending:      { label: "잔금 대기", color: "bg-blue-50 text-blue-700" },
  registration_pending: { label: "등기 대기", color: "bg-purple-50 text-purple-600" },
  completed:            { label: "거래 완료", color: "bg-green-50 text-green-600" },
  cancelled:            { label: "취소",      color: "bg-gray-100 text-gray-500" },
};

function formatPrice(p?: number) {
  if (!p) return "-";
  const e = Math.floor(p / 100000000);
  const m = Math.floor((p % 100000000) / 10000);
  if (e > 0 && m > 0) return `${e}억 ${m}만`;
  if (e > 0) return `${e}억`;
  return `${m}만`;
}

export function AdminTransactionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (p = page, st = status) => {
    setLoading(true);
    adminApi.getTransactions({ page: p, status: st || undefined })
      .then((res) => { setData(res.data); setTotal(res.total); })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">거래 관리</h1>
        <span className="text-sm text-gray-500">총 {total.toLocaleString()}건</span>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); load(1, e.target.value); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">전체 상태</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">매물</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">매도인</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">중개사</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">거래가</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">수수료율</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">상태</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">생성일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && <tr><td colSpan={7} className="py-12 text-center text-gray-400">불러오는 중...</td></tr>}
              {!loading && data.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-gray-400">거래 내역이 없습니다</td></tr>}
              {data.map((tx) => {
                const s = STATUS_LABEL[tx.status] ?? { label: tx.status, color: "bg-gray-50 text-gray-500" };
                return (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{tx.property?.apartment_name ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{tx.seller?.name ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{tx.agent?.name ?? "-"}</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{formatPrice(tx.agreed_price)}</td>
                    <td className="px-4 py-3 text-gray-600">{tx.commission_rate}%</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${s.color}`}>{s.label}</span></td>
                    <td className="px-4 py-3 text-gray-500">{tx.created_at?.slice(0, 10)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">{page} / {totalPages} 페이지</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => { setPage(p => p - 1); load(page - 1); }} className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={page >= totalPages} onClick={() => { setPage(p => p + 1); load(page + 1); }} className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
