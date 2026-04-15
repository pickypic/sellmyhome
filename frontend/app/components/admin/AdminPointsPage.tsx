import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi } from "@/api/client";
import { toast } from "sonner";

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
  purchase:    { label: "충전",   color: "bg-green-50 text-green-600" },
  auction_fee: { label: "경매비", color: "bg-orange-50 text-orange-600" },
  bid_fee:     { label: "입찰비", color: "bg-blue-50 text-blue-600" },
  refund:      { label: "환불",   color: "bg-purple-50 text-purple-600" },
  bonus:       { label: "보너스", color: "bg-yellow-50 text-yellow-600" },
};

export function AdminPointsPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (p = page, t = type) => {
    setLoading(true);
    adminApi.getPointTransactions({ page: p, type: t || undefined })
      .then((res) => { setData(res.data); setTotal(res.total); })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const totalPages = Math.ceil(total / 20);

  const totalPurchased = data.filter(d => d.type === 'purchase').reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">포인트 / 결제 내역</h1>
        <span className="text-sm text-gray-500">총 {total.toLocaleString()}건</span>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex gap-3 items-center">
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); load(1, e.target.value); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">전체 유형</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {data.length > 0 && (
          <span className="text-sm text-gray-500 ml-auto">이 페이지 충전 합계: <strong className="text-green-600">{totalPurchased.toLocaleString()}P</strong></span>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">유형</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">회원</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">설명</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">변동</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">잔액</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">결제 ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && <tr><td colSpan={7} className="py-12 text-center text-gray-400">불러오는 중...</td></tr>}
              {!loading && data.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-gray-400">내역이 없습니다</td></tr>}
              {data.map((tx) => {
                const t = TYPE_LABEL[tx.type] ?? { label: tx.type, color: "bg-gray-50 text-gray-500" };
                return (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.color}`}>{t.label}</span></td>
                    <td className="px-4 py-3 text-gray-700">{tx.user?.name ?? "-"}<br/><span className="text-xs text-gray-400">{tx.user?.email}</span></td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{tx.description ?? "-"}</td>
                    <td className={`px-4 py-3 text-right font-bold font-mono ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}P
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">{tx.balance?.toLocaleString()}P</td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate">{tx.ref_id ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{tx.created_at?.slice(0, 16).replace("T", " ")}</td>
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
