import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, UserX, UserCheck, Coins, ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi, AdminUser } from "@/api/client";
import { toast } from "sonner";

const ROLE_LABEL: Record<string, string> = { seller: "매도인", agent: "중개사", admin: "관리자" };

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const load = (p = page, s = search, r = role) => {
    setLoading(true);
    adminApi.getUsers({ page: p, search: s || undefined, role: r || undefined })
      .then((res) => { setUsers(res.data); setTotal(res.total); })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1, search, role);
  };

  const handleBlock = async (user: AdminUser) => {
    if (user.is_active) {
      const reason = prompt("차단 사유를 입력하세요:");
      if (!reason) return;
      await adminApi.blockUser(user.id, reason);
      toast.success("차단되었습니다.");
    } else {
      await adminApi.unblockUser(user.id);
      toast.success("차단이 해제되었습니다.");
    }
    load();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">회원 관리</h1>
        <span className="text-sm text-gray-500">총 {total.toLocaleString()}명</span>
      </div>

      {/* Search / Filter */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 이메일 검색"
            className="flex-1 bg-transparent py-2 text-sm outline-none"
          />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">전체 역할</option>
          <option value="seller">매도인</option>
          <option value="agent">중개사</option>
          <option value="admin">관리자</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">검색</button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">이름</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">이메일</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">역할</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">포인트</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">상태</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">가입일</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400">불러오는 중...</td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400">회원이 없습니다</td></tr>
              )}
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/admin/users/${user.id}`} className="font-medium text-blue-600 hover:underline">{user.name}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-red-50 text-red-600' :
                      user.role === 'agent' ? 'bg-blue-50 text-blue-600' :
                      'bg-green-50 text-green-600'
                    }`}>{ROLE_LABEL[user.role] ?? user.role}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">{(user.point_balance || 0).toLocaleString()} P</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {user.is_active ? "정상" : "차단"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBlock(user)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${user.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {user.is_active ? <><UserX className="w-3 h-3" />차단</> : <><UserCheck className="w-3 h-3" />해제</>}
                      </button>
                      <Link to={`/admin/users/${user.id}`} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100">
                        상세
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">{page} / {totalPages} 페이지</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => { setPage(p => p - 1); load(page - 1); }}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={page >= totalPages} onClick={() => { setPage(p => p + 1); load(page + 1); }}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
