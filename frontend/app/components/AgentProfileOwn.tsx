import { Link, useNavigate } from "react-router";
import { User, FileText, Bell, Lock, HelpCircle, LogOut, ChevronRight, Settings, Star, Award } from "lucide-react";

export function AgentProfileOwn() {
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
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            김
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">김중개</h2>
            <p className="text-sm text-gray-600">agent@example.com</p>
          </div>
          <Link
            to="/settings/profile-edit"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Link to="/agent/transactions" className="bg-gray-50 rounded-lg p-3 text-center active:bg-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-1">120</div>
            <div className="text-xs text-gray-600">총 거래</div>
          </Link>
          <Link to="/agent/reviews" className="bg-yellow-50 rounded-lg p-3 text-center active:bg-yellow-100">
            <div className="text-lg font-bold text-yellow-600 mb-1">4.8</div>
            <div className="text-xs text-gray-600">평균 평점</div>
          </Link>
          <Link to="/agent/bids" className="bg-blue-50 rounded-lg p-3 text-center active:bg-blue-100">
            <div className="text-lg font-bold text-blue-600 mb-1">1</div>
            <div className="text-xs text-gray-600">입찰중</div>
          </Link>
          <Link to="/agent/transactions" className="bg-green-50 rounded-lg p-3 text-center active:bg-green-100">
            <div className="text-lg font-bold text-green-600 mb-1">12</div>
            <div className="text-xs text-gray-600">낙찰</div>
          </Link>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">프로필 완성도</h3>
            <p className="text-sm text-gray-600">
              상세 프로필로 선택 확률을 높이세요
            </p>
          </div>
          <span className="text-xl font-bold text-gray-900">75%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div className="bg-blue-600 rounded-full h-2" style={{ width: '75%' }}></div>
        </div>
        <Link
          to="/settings/profile-edit"
          className="text-sm text-blue-600 font-semibold"
        >
          프로필 작성하기 →
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="bg-white px-5 py-4 mb-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">이번 달 활동</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">신규 입찰</span>
            <span className="font-bold text-gray-900">3건</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">낙찰</span>
            <span className="font-bold text-green-600">2건</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">받은 리뷰</span>
            <span className="font-bold text-yellow-600 flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-600" />
              2개
            </span>
          </div>
        </div>
      </div>

      {/* Menu Section - Profile */}
      <div className="bg-white px-5 py-3 mb-2">
        <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2">프로필</h3>
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
            to="/agent/reviews"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">내 리뷰 관리</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/agent/leagues"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">내 리그</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/agent/points"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">포인트 관리</span>
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

          <Link
            to="/settings/subscription"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">구독 관리</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/settings/payment"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">결제 수단</span>
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

          <Link
            to="/trust-center"
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">신뢰 센터</span>
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