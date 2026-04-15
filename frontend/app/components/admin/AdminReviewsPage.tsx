import { useState, useEffect } from "react";
import { Star, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi } from "@/api/client";
import { toast } from "sonner";

export function AdminReviewsPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = (p = page) => {
    setLoading(true);
    adminApi.getReviews({ page: p })
      .then((res) => { setData(res.data); setTotal(res.total); })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const totalPages = Math.ceil(total / 20);

  const handleDelete = async (id: string) => {
    if (!confirm("이 리뷰를 삭제하시겠습니까?")) return;
    try {
      await adminApi.deleteReview(id);
      toast.success("삭제되었습니다.");
      load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">리뷰 관리</h1>
        <span className="text-sm text-gray-500">총 {total.toLocaleString()}건</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">작성자</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">대상 중개사</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">평점</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">내용</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">인증</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">작성일</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && <tr><td colSpan={7} className="py-12 text-center text-gray-400">불러오는 중...</td></tr>}
              {!loading && data.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-gray-400">리뷰가 없습니다</td></tr>}
              {data.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{review.reviewer?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-700">{review.agent?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-900">{review.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{review.content ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${review.is_verified ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {review.is_verified ? "인증" : "미인증"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{review.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100">
                      <Trash2 className="w-3 h-3" /> 삭제
                    </button>
                  </td>
                </tr>
              ))}
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
