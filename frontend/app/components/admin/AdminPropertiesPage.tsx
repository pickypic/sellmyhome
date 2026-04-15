import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi } from "@/api/client";
import { toast } from "sonner";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending_verification: { label: "인증 대기", color: "bg-orange-50 text-orange-600" },
  verified:             { label: "인증 완료", color: "bg-blue-50 text-blue-600" },
  auction_open:         { label: "경매 진행", color: "bg-green-50 text-green-600" },
  selection_pending:    { label: "선택 대기", color: "bg-purple-50 text-purple-600" },
  no_bids:              { label: "입찰 없음", color: "bg-gray-50 text-gray-600" },
  matched:              { label: "매칭 완료", color: "bg-blue-50 text-blue-700" },
  completed:            { label: "거래 완료", color: "bg-green-50 text-green-700" },
  withdrawn:            { label: "취하",      color: "bg-gray-100 text-gray-500" },
};

function formatPrice(p?: number) {
  if (!p) return "-";
  const e = Math.floor(p / 100000000);
  const m = Math.floor((p % 100000000) / 10000);
  if (e > 0 && m > 0) return `${e}억 ${m}만`;
  if (e > 0) return `${e}억`;
  return `${m}만`;
}

export function AdminPropertiesPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (p = page, s = search, st = status) => {
    setLoading(true);
    adminApi.getProperties({ page: p, search: s || undefined, status: st || undefined })
      .then((res) => { setData(res.data); setTotal(res.total); })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); load(1, search, status); };
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">매물 관리</h1>
        <span className="text-sm text-gray-500">총 {total.toLocaleString()}건</span>
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="아파트명 또는 주소 검색"
            className="flex-1 bg-transparent py-2 text-sm outline-none" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">전체 상태</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">검색</button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">아파트명</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">주소</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">면적</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">희망가</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">상태</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">매도인</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && <tr><td colSpan={7} className="py-12 text-center text-gray-400">불러오는 중...</td></tr>}
              {!loading && data.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-gray-400">매물이 없습니다</td></tr>}
              {data.map((p) => {
                const s = STATUS_LABEL[p.status] ?? { label: p.status, color: "bg-gray-50 text-gray-500" };
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.apartment_name}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{p.address}</td>
                    <td className="px-4 py-3 text-gray-600">{p.area}㎡</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{formatPrice(p.asking_price)}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${s.color}`}>{s.label}</span></td>
                    <td className="px-4 py-3 text-gray-600">{p.seller?.name ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-500">{p.created_at?.slice(0, 10)}</td>
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
