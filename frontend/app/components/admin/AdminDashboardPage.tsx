import { useState, useEffect } from "react";
import { Users, Home, ArrowLeftRight, Coins, Shield, TrendingUp, UserX } from "lucide-react";
import { adminApi, AdminStats } from "@/api/client";
import { toast } from "sonner";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
  };
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value ?? "-"}</div>
    </div>
  );
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const s = stats;

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">대시보드</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="전체 회원" value={loading ? "..." : s?.users.total} color="blue" />
        <StatCard icon={Users} label="매도인" value={loading ? "..." : s?.users.sellers} color="green" />
        <StatCard icon={Users} label="중개사" value={loading ? "..." : s?.users.agents} color="orange" />
        <StatCard icon={UserX} label="차단 회원" value={loading ? "..." : s?.users.blocked} color="red" />
        <StatCard icon={Home} label="전체 매물" value={loading ? "..." : s?.properties.total} color="blue" />
        <StatCard icon={TrendingUp} label="진행 중 경매" value={loading ? "..." : s?.properties.open_auctions} color="purple" />
        <StatCard icon={Shield} label="인증 대기" value={loading ? "..." : s?.properties.pending_verifications} color="orange" />
        <StatCard icon={ArrowLeftRight} label="완료 거래" value={loading ? "..." : s?.transactions.completed} color="green" />
      </div>

      {/* Revenue */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-900">누적 포인트 충전량</span>
        </div>
        <div className="text-3xl font-bold text-gray-900">
          {loading ? "..." : (s?.revenue.total_points_purchased ?? 0).toLocaleString()} P
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">빠른 작업</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: "/admin/users", label: "회원 관리", color: "bg-blue-600" },
            { href: "/admin/verifications", label: "인증 심사", color: "bg-orange-500" },
            { href: "/admin/points", label: "포인트 내역", color: "bg-yellow-500" },
            { href: "/admin/reviews", label: "리뷰 관리", color: "bg-purple-600" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${item.color} text-white rounded-lg px-4 py-3 text-sm font-semibold text-center hover:opacity-90 transition-opacity`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
