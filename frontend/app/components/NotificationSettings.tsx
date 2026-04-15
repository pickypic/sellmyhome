import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export function NotificationSettings() {
  const navigate = useNavigate();
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [pushNotification, setPushNotification] = useState(true);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">알림 설정</h1>
        </div>
      </header>

      {/* Content */}
      <div className="bg-card mt-2">
        {/* Marketing Consent */}
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">마케팅 정보 수신</h3>
              <p className="text-sm text-muted-foreground">
                2025.01.30
              </p>
            </div>
            <button
              onClick={() => setMarketingConsent(!marketingConsent)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                marketingConsent ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  marketingConsent ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            이벤트, 프로모션, 신규 서비스 등 마케팅 정보를 카카오톡, 문자, 이메일로 받아보실 수 있습니다.
          </p>
        </div>

        {/* Push Notification */}
        <div className="px-5 py-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">푸시 알림 수신</h3>
              <p className="text-sm text-muted-foreground">
                매물 제안 및 거래 알림
              </p>
            </div>
            <button
              onClick={() => setPushNotification(!pushNotification)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                pushNotification ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  pushNotification ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            새로운 제안, 매칭 완료, 거래 진행 상황 등 중요한 알림을 실시간으로 받아보실 수 있습니다.
          </p>
        </div>
      </div>

      {/* Info Notice */}
      <div className="px-5 py-6">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4">
          <p className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed">
            <strong className="font-semibold">안내사항</strong><br />
            • 마케팅 정보 수신 동의는 선택사항이며, 동의하지 않아도 서비스 이용에 제한이 없습니다.<br />
            • 푸시 알림은 중요한 거래 정보를 놓치지 않도록 도와드립니다.<br />
            • 설정은 언제든지 변경 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}