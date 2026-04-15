import { Link } from "react-router";
import {
  Shield,
  AlertTriangle,
  XCircle,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { adminApi, AdminStats } from "@/api/client";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const pendingVerifications =
    (stats?.properties.pending_verifications ?? 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-5 py-6 mb-2 text-white">
        <h1 className="text-xl font-bold mb-1">관리자 콘솔</h1>
        <p className="text-sm text-red-100">
          시스템 전체를 모니터링하고 관리하세요
        </p>
      </div>

      {/* Quick Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">주요 지표</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-600 font-medium">
                대기중 인증
              </span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {loading ? "..." : pendingVerifications}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-600 font-medium">
                완료 거래
              </span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {loading ? "..." : (stats?.transactions.completed ?? 0)}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">
                전체 사용자
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? "..." : (stats?.users.total ?? 0)}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                활성 경매
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : (stats?.properties.open_auctions ?? 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">빠른 작업</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/admin/verifications"
            className="relative flex flex-col items-center gap-2 p-4 border-2 border-orange-200 rounded-xl active:bg-orange-50"
          >
            {pendingVerifications > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {pendingVerifications}
              </div>
            )}
            <Shield className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-semibold text-gray-900">
              인증 승인
            </span>
          </Link>

          <Link
            to="/admin/disputes"
            className="relative flex flex-col items-center gap-2 p-4 border-2 border-red-200 rounded-xl active:bg-red-50"
          >
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <span className="text-sm font-semibold text-gray-900">
              분쟁 처리
            </span>
          </Link>

          <Link
            to="/admin/logs"
            className="flex flex-col items-center gap-2 p-4 border-2 border-blue-200 rounded-xl active:bg-blue-50"
          >
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">
              로그 조회
            </span>
          </Link>

          <Link
            to="/admin/sanctions"
            className="flex flex-col items-center gap-2 p-4 border-2 border-purple-200 rounded-xl active:bg-purple-50"
          >
            <XCircle className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-semibold text-gray-900">
              제재 관리
            </span>
          </Link>
        </div>
      </div>

      {/* User Breakdown */}
      {!loading && stats && (
        <div className="bg-white px-5 py-5 mb-2">
          <h3 className="font-bold text-gray-900 mb-4">사용자 현황</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">매도인</span>
              <span className="text-sm font-semibold text-gray-900">{stats.users.sellers}명</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">중개사</span>
              <span className="text-sm font-semibold text-gray-900">{stats.users.agents}명</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">전체 매물</span>
              <span className="text-sm font-semibold text-gray-900">{stats.properties.total}건</span>
            </div>
          </div>
        </div>
      )}

      {/* System Health */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">시스템 상태</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">서버 상태</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-semibold text-green-600">정상</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">데이터베이스</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-semibold text-green-600">정상</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">외부 API</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-semibold text-green-600">정상</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
