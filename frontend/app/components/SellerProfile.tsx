import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  User,
  FileText,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
} from "lucide-react";
import { authStorage, propertiesApi, transactionsApi } from "@/api/client";

export function SellerProfile() {
  const navigate = useNavigate();
  const { user } = authStorage.get();

  const [totalProperties, setTotalProperties] = useState<number | null>(null);
  const [activeProperties, setActiveProperties] = useState<number | null>(null);
  const [completedTx, setCompletedTx] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [props, txs] = await Promise.all([
          propertiesApi.getMySeller(),
          transactionsApi.getMySeller(),
        ]);
        setTotalProperties(props.length);
        setActiveProperties(
          props.filter((p) =>
            ["auction_open", "selection_pending", "matched"].includes(p.status)
          ).length
        );
        setCompletedTx(txs.filter((t) => t.status === "completed").length);
      } catch (e: any) {
        // 통계 로드 실패는 무시 (화면에 "-" 표시)
      } finally {
        setStatsLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleLogout = () => {
    authStorage.clear();
    navigate("/", { replace: true });
  };

  const displayName = user?.name ?? "사용자";
  const displayEmail = user?.email ?? "";
  const firstChar = displayName.charAt(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.profile_image ? (
              <img
                src={user.profile_image}
                alt={displayName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              firstChar
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{displayName}</h2>
            <p className="text-sm text-gray-600">{displayEmail}</p>
            {user?.is_verified && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-600 text-xs font-semibold rounded">
                인증 완료
              </span>
            )}
          </div>
          <Link
            to="/settings/profile-edit"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Link
            to="/seller/listings"
            className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100"
          >
            <div className="text-lg font-bold text-gray-900 mb-1">
              {statsLoading ? "-" : (totalProperties ?? 0)}
            </div>
            <div className="text-xs text-gray-600">등록 매물</div>
          </Link>
          <Link
            to="/seller/listings"
            className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100"
          >
            <div className="text-lg font-bold text-blue-600 mb-1">
              {statsLoading ? "-" : (activeProperties ?? 0)}
            </div>
            <div className="text-xs text-gray-600">진행중</div>
          </Link>
          <Link
            to="/seller/transactions"
            className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100"
          >
            <div className="text-lg font-bold text-green-600 mb-1">
              {statsLoading ? "-" : (completedTx ?? 0)}
            </div>
            <div className="text-xs text-gray-600">완료</div>
          </Link>
        </div>
      </div>

      {/* Menu Section - Account */}
      <div className="bg-white px-5 py-3 mb-2">
        <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">계정</h3>
        <div className="space-y-1">
          <Link
            to="/settings/profile-edit"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">프로필 수정</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/seller/verification"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">본인 인증 관리</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Menu Section - Settings */}
      <div className="bg-white px-5 py-3 mb-2">
        <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">설정</h3>
        <div className="space-y-1">
          <Link
            to="/settings/notifications"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">알림 설정</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/settings/security"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">보안 설정</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Menu Section - Support */}
      <div className="bg-white px-5 py-3 mb-2">
        <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">지원</h3>
        <div className="space-y-1">
          <Link
            to="/support"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">고객센터</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/faq"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">자주 묻는 질문</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/terms"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">이용약관</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/privacy"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">개인정보처리방침</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 py-4">
        <button
          className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>
      </div>

      {/* Version Info */}
      <div className="px-5 py-4 text-center">
        <p className="text-xs text-gray-400">버전 1.0.0</p>
      </div>
    </div>
  );
}
