import { ArrowLeft, Monitor, Clock } from "lucide-react";
import { useNavigate } from "react-router";

export function ConnectedDevices() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
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
            <h1 className="text-lg font-bold text-gray-900">연결된 기기</h1>
          </div>
        </div>
      </header>

      {/* Info */}
      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600 leading-relaxed">
          최근 30일 이내에 로그인한 기기 목록입니다. 의심스러운 기기가 있다면
          즉시 제거하고 비밀번호를 변경하세요.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-900 mb-1">1</div>
            <div className="text-xs text-blue-700">연결된 기기</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-900 mb-1">1</div>
            <div className="text-xs text-green-700">신뢰할 수 있는 기기</div>
          </div>
        </div>
      </div>

      {/* Current Device */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">현재 기기</h3>
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Monitor className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">웹 브라우저</span>
                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs font-semibold rounded">
                  현재
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-3.5 h-3.5" />
                <span>로그인 중</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Devices */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">다른 기기</h3>
        <div className="py-10 text-center">
          <Monitor className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">연결된 기기가 없습니다</p>
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-3">보안 팁</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              알 수 없는 기기가 있다면 즉시 로그아웃하고 비밀번호를 변경하세요.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              자주 사용하는 기기는 "신뢰할 수 있는 기기"로 설정하면 로그인이
              간편해집니다.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700 leading-relaxed">
              공용 컴퓨터에서는 반드시 로그아웃하고, 비밀번호를 저장하지
              마세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
