import { CreditCard, Plus, ArrowLeft, Calendar, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// Mock data
const mockPaymentMethods = [
  {
    id: 1,
    type: "card",
    cardNumber: "**** **** **** 1234",
    cardName: "신한카드",
    expiryDate: "12/26",
    isDefault: true,
  },
  {
    id: 2,
    type: "card",
    cardNumber: "**** **** **** 5678",
    cardName: "국민카드",
    expiryDate: "08/27",
    isDefault: false,
  },
];

const mockPaymentHistory = [
  {
    id: 1,
    type: "subscription",
    amount: 29000,
    description: "프로 플랜 월간 구독",
    date: "2026-03-16",
    status: "completed",
    method: "**** 1234",
  },
  {
    id: 2,
    type: "points",
    amount: 27000,
    description: "포인트 300P 충전",
    date: "2026-03-05",
    status: "completed",
    method: "**** 1234",
  },
  {
    id: 3,
    type: "subscription",
    amount: 29000,
    description: "프로 플랜 월간 구독",
    date: "2026-02-16",
    status: "completed",
    method: "**** 5678",
  },
];

export function PaymentSettings() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>("card-1234");

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
            <h1 className="text-lg font-bold text-gray-900">결제 수단</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          결제 수단과 결제 내역을 관리하세요
        </p>
      </div>

      {/* Payment Methods */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">결제 수단</h3>
          <button
            onClick={() => setSelectedMethod("add-card")}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg active:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>

        <div className="space-y-3">
          {mockPaymentMethods.map((method) => (
            <div
              key={method.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <CreditCard className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-0.5">
                      {method.cardName}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {method.cardNumber}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>만료일: {method.expiryDate}</span>
                    </div>
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {method.isDefault && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>기본 결제 수단</span>
                </div>
              )}
              {!method.isDefault && (
                <button className="text-sm text-blue-600 font-medium">
                  기본 결제 수단으로 설정
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Payment */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-3">다음 결제 예정</h3>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-900">프로 플랜</span>
            <span className="text-lg font-bold text-blue-600">29,000원</span>
          </div>
          <div className="text-xs text-blue-700">
            결제 예정일: 2026-04-16
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">결제 내역</h3>
        <div className="space-y-3">
          {mockPaymentHistory.map((payment) => (
            <div
              key={payment.id}
              className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 mb-0.5">
                  {payment.description}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  {payment.method}
                </div>
                <div className="text-xs text-gray-500">{payment.date}</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-gray-900">
                  {payment.amount.toLocaleString()}원
                </div>
                {payment.status === "completed" && (
                  <div className="text-xs text-green-600">완료</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium">
          전체 내역 보기
        </button>
      </div>

      {/* Add Card Modal */}
      {selectedMethod === "add-card" && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-w-lg p-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">카드 추가</h3>
              <button
                onClick={() => setSelectedMethod(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카드 번호
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    만료일
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카드 소유자 이름
                </label>
                <input
                  type="text"
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                onClick={() => {
                  alert("카드가 추가되었습니다!");
                  setSelectedMethod(null);
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold active:bg-blue-700"
              >
                카드 추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}