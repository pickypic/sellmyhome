import { Coins, ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const pointPackages = [
  { id: 1, points: 100, price: 10000, bonus: 0, popular: false },
  { id: 2, points: 300, price: 27000, bonus: 30, popular: true },
  { id: 3, points: 500, price: 40000, bonus: 100, popular: false },
  { id: 4, points: 1000, price: 70000, bonus: 300, popular: false },
];

export function PurchasePoints() {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "account" | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePurchase = () => {
    const pkg = pointPackages.find((p) => p.id === selectedAmount);
    if (!pkg) return;
    
    alert(`${pkg.points + pkg.bonus}P 충전이 완료되었습니다!`);
    navigate("/agent/points");
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
            <h1 className="text-lg font-bold text-gray-900">포인트 충전</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          필요한 포인트를 선택하고 결제하세요
        </p>
      </div>

      {/* Packages */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">충전 금액 선택</h3>
        <div className="grid grid-cols-2 gap-3">
          {pointPackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedAmount(pkg.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selectedAmount === pkg.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                  인기
                </div>
              )}
              <div className="flex items-center justify-center gap-1 mb-2">
                <Coins className={`w-5 h-5 ${selectedAmount === pkg.id ? "text-amber-500" : "text-gray-400"}`} />
                <span className={`text-2xl font-bold ${selectedAmount === pkg.id ? "text-blue-600" : "text-gray-900"}`}>
                  {pkg.points}
                </span>
                <span className="text-sm text-gray-600">P</span>
              </div>
              {pkg.bonus > 0 && (
                <div className="text-xs font-semibold text-green-600 mb-2">
                  +{pkg.bonus}P 보너스
                </div>
              )}
              <div className="text-base font-bold text-gray-900">
                {pkg.price.toLocaleString()}원
              </div>
              {selectedAmount === pkg.id && (
                <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">결제 수단</h3>
        <div className="space-y-2">
          <button
            onClick={() => setPaymentMethod("card")}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
              paymentMethod === "card"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-blue-600" : "text-gray-400"}`} />
            <span className={`font-medium ${paymentMethod === "card" ? "text-blue-900" : "text-gray-700"}`}>
              신용/체크카드
            </span>
            {paymentMethod === "card" && (
              <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />
            )}
          </button>
          <button
            onClick={() => setPaymentMethod("account")}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
              paymentMethod === "account"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "account" ? "border-blue-600" : "border-gray-400"
            }`}>
              <div className={`w-2 h-2 rounded-full ${paymentMethod === "account" ? "bg-blue-600" : ""}`}></div>
            </div>
            <span className={`font-medium ${paymentMethod === "account" ? "text-blue-900" : "text-gray-700"}`}>
              계좌이체
            </span>
            {paymentMethod === "account" && (
              <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />
            )}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">결제 정보</h3>
        {(() => {
          const pkg = pointPackages.find((p) => p.id === selectedAmount);
          if (!pkg) return null;
          return (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">기본 포인트</span>
                <span className="font-semibold text-gray-900">{pkg.points}P</span>
              </div>
              {pkg.bonus > 0 && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">보너스 포인트</span>
                  <span className="font-semibold text-green-600">+{pkg.bonus}P</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center justify-between py-2">
                  <span className="font-bold text-gray-900">총 충전</span>
                  <span className="text-xl font-bold text-blue-600">
                    {pkg.points + pkg.bonus}P
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="font-bold text-gray-900">결제 금액</span>
                  <span className="text-xl font-bold text-gray-900">
                    {pkg.price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Purchase Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
        <button
          onClick={handlePurchase}
          disabled={!selectedAmount || !paymentMethod}
          className={`w-full py-3 rounded-xl font-semibold ${
            selectedAmount && paymentMethod
              ? "bg-blue-600 text-white active:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {(() => {
            const pkg = pointPackages.find((p) => p.id === selectedAmount);
            return pkg ? `${pkg.price.toLocaleString()}원 결제하기` : "결제하기";
          })()}
        </button>
      </div>
    </div>
  );
}
