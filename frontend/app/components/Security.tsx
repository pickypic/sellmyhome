import { useState } from "react";
import {
  Lock,
  Smartphone,
  Shield,
  Clock,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, Link } from "react-router";
import { authStorage } from "@/api/client";

export function Security() {
  const navigate = useNavigate();
  const { user } = authStorage.get();
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(false);
  const [autoLogoutTime, setAutoLogoutTime] = useState(30);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      authStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">보안 설정</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          계정 보안을 강화하여 안전하게 이용하세요
        </p>
      </div>

      {/* Security Score */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 mx-5 mb-2 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-green-200" />
          <span className="text-sm font-medium text-green-100">보안 점수</span>
        </div>
        <div className="flex items-end gap-2 mb-4">
          <div className="text-5xl font-bold">85</div>
          <div className="text-xl text-green-100 mb-2">/ 100</div>
        </div>
        <div className="w-full bg-green-800 rounded-full h-2 mb-3">
          <div
            className="bg-green-200 rounded-full h-2 transition-all"
            style={{ width: "85%" }}
          ></div>
        </div>
        <p className="text-sm text-green-100">
          2단계 인증을 활성화하면 100점이 됩니다
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">현재 계정</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">이메일</span>
            <span className="text-sm text-gray-900">{user?.email || "-"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-500">계정 유형</span>
            <span className="text-sm font-semibold text-blue-600">
              {user?.role === "agent" ? "중개인" : user?.role === "admin" ? "관리자" : "매도인"}
            </span>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">비밀번호</h3>
        <div className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="font-medium text-gray-500 mb-0.5">
                비밀번호 변경
              </div>
              <div className="text-xs text-gray-400">
                준비 중인 기능입니다
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">2단계 인증</h3>
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  SMS/이메일 인증
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  로그인 시 추가 인증 코드를 요청하여 보안을 강화합니다
                </div>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                twoFactorEnabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  twoFactorEnabled ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
          {twoFactorEnabled && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>2단계 인증이 활성화되었습니다</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto Logout */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">자동 로그아웃</h3>
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  비활성 시 자동 로그아웃
                </div>
                <div className="text-xs text-gray-600">
                  일정 시간 동안 활동이 없으면 자동으로 로그아웃됩니다
                </div>
              </div>
            </div>
            <button
              onClick={() => setAutoLogoutEnabled(!autoLogoutEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                autoLogoutEnabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  autoLogoutEnabled ? "translate-x-6" : "translate-x-0.5"
                }`}
              ></div>
            </button>
          </div>
          {autoLogoutEnabled && (
            <div className="space-y-2">
              <label className="text-xs text-gray-600">로그아웃 시간</label>
              <select
                value={autoLogoutTime}
                onChange={(e) => setAutoLogoutTime(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={15}>15분</option>
                <option value={30}>30분</option>
                <option value={60}>1시간</option>
                <option value={120}>2시간</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">개인정보 보호</h3>
        <div className="space-y-2">
          <Link
            to="/settings/connected-devices"
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl active:bg-gray-50"
          >
            <span className="text-sm text-gray-700">연결된 기기 관리</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <Link
            to="/settings/data-download"
            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl active:bg-gray-50"
          >
            <span className="text-sm text-gray-700">개인정보 다운로드</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 border border-red-200 rounded-xl active:bg-red-50"
          >
            <span className="text-sm text-red-600 font-medium">계정 삭제</span>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}