import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, UserX, UserCheck, Plus, Minus } from "lucide-react";
import { adminApi, AdminUser } from "@/api/client";
import { toast } from "sonner";

const ROLE_LABEL: Record<string, string> = { seller: "매도인", agent: "중개사", admin: "관리자" };
const TYPE_LABEL: Record<string, string> = { purchase: "충전", auction_fee: "경매비", bid_fee: "입찰비", refund: "환불", bonus: "보너스" };

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pointAmount, setPointAmount] = useState("");
  const [pointReason, setPointReason] = useState("");
  const [pointLoading, setPointLoading] = useState(false);

  const load = () => {
    if (!id) return;
    adminApi.getUser(id)
      .then(setUser)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleBlock = async () => {
    if (!user || !id) return;
    if (user.is_active) {
      const reason = prompt("차단 사유를 입력하세요:");
      if (!reason) return;
      await adminApi.blockUser(id, reason);
      toast.success("차단되었습니다.");
    } else {
      await adminApi.unblockUser(id);
      toast.success("차단이 해제되었습니다.");
    }
    load();
  };

  const handlePoints = async (sign: 1 | -1) => {
    if (!id || !pointAmount || !pointReason) {
      toast.error("금액과 사유를 입력하세요.");
      return;
    }
    const amount = parseInt(pointAmount) * sign;
    setPointLoading(true);
    try {
      const res = await adminApi.adjustPoints(id, amount, pointReason);
      toast.success(`포인트 조정 완료. 잔액: ${res.new_balance}P`);
      setPointAmount("");
      setPointReason("");
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPointLoading(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400">불러오는 중...</div>;
  if (!user) return <div className="py-20 text-center text-gray-400">회원을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate("/admin/users")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> 목록으로
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">{user.name} 회원 상세</h1>
        <button
          onClick={handleBlock}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${user.is_active ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          {user.is_active ? <><UserX className="w-4 h-4" />차단</>  : <><UserCheck className="w-4 h-4" />차단 해제</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 기본 정보 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">기본 정보</h3>
          <dl className="space-y-2 text-sm">
            {[
              ["ID", user.id],
              ["이름", user.name],
              ["이메일", user.email],
              ["전화", user.phone ?? "-"],
              ["역할", ROLE_LABEL[user.role] ?? user.role],
              ["상태", user.is_active ? "정상" : "차단"],
              ["인증", user.is_verified ? "완료" : "미완료"],
              ["구독", user.subscription_tier],
              ["가입일", user.created_at?.slice(0, 10)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-medium text-gray-900 text-right max-w-xs truncate">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 포인트 관리 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">포인트 관리</h3>
          <div className="text-3xl font-bold text-blue-600 mb-4">{(user.point_balance || 0).toLocaleString()} P</div>
          <div className="space-y-3">
            <input
              type="number"
              min="1"
              value={pointAmount}
              onChange={(e) => setPointAmount(e.target.value)}
              placeholder="포인트 수량"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={pointReason}
              onChange={(e) => setPointReason(e.target.value)}
              placeholder="사유 (필수)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handlePoints(1)}
                disabled={pointLoading}
                className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
              >
                <Plus className="w-4 h-4" /> 지급
              </button>
              <button
                onClick={() => handlePoints(-1)}
                disabled={pointLoading}
                className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                <Minus className="w-4 h-4" /> 차감
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 포인트 내역 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-semibold text-gray-900 mb-4">최근 포인트 내역</h3>
        {(user.point_history ?? []).length === 0 ? (
          <p className="text-sm text-gray-400">내역이 없습니다</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {user.point_history!.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-2">{TYPE_LABEL[tx.type] ?? tx.type}</span>
                  <span className="text-gray-700">{tx.description ?? "-"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}P
                  </span>
                  <span className="text-gray-400 text-xs">{tx.created_at?.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 제재 내역 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">제재 내역</h3>
        {(user.admin_actions ?? []).length === 0 ? (
          <p className="text-sm text-gray-400">제재 내역이 없습니다</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {user.admin_actions!.map((action: any) => (
              <div key={action.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold mr-2 ${action.action_type === 'ban' ? 'bg-red-50 text-red-600' : action.action_type === 'restore' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {action.action_type}
                  </span>
                  <span className="text-gray-700">{action.reason}</span>
                </div>
                <span className="text-gray-400 text-xs">{action.created_at?.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
