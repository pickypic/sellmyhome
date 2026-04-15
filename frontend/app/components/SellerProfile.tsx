import { Link, useNavigate } from "react-router";
import { User, FileText, Bell, Lock, HelpCircle, LogOut, ChevronRight, Settings } from "lucide-react";

export function SellerProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            홍
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">홍길동</h2>
            <p className="text-sm text-gray-600">hong@example.com</p>
          </div>
          <Link
            to="/settings/profile-edit"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Link to="/seller/listings" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-1">2</div>
            <div className="text-xs text-gray-600">등록 매물</div>
          </Link>
          <Link to="/seller/listings" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-blue-600 mb-1">1</div>
            <div className="text-xs text-gray-600">진행중</div>
          </Link>
          <Link to="/seller/transactions" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-green-600 mb-1">2</div>
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