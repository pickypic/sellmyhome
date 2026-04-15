import { Crown, ArrowLeft, CheckCircle2, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { authStorage } from "@/api/client";
import { toast } from "sonner";

const plans = [
  {
    id: "free",
    name: "무료",
    price: 0,
    period: "월",
    popular: false,
    features: [
      "월 3건 지원 가능",
      "기본 프로필",
      "일반 제안서",
      "표준 고객지원",
    ],
    limitations: [
      "프리미엄 매물 제한",
      "우선권 없음",
      "분석 도구 없음",
    ],
  },
  {
    id: "premium",
    name: "프리미엄",
    price: 59000,
    period: "월",
    popular: false,
    features: [
      "프로 플랜 모든 기능",
      "VIP 배지",
      "독점 프리미엄 매물",
      "전담 매니저",
      "월 300P 포인트 제공",
      "고급 분석 및 리포트",
      "광고 우선 노출",
    ],
    limitations: [],
  },
  {
    id: "pro",
    name: "프로",
    price: 29000,
    period: "월",
    popular: true,
    features: [
      "무제한 지원",
      "프리미엄 프로필",
      "하이라이트 제안서",
      "우선 고객지원",
      "월 100P 포인트 제공",
      "시장 분석 도구",
    ],
    limitations: [],
  },
];

export function Subscription() {
  const navigate = useNavigate();
  const { user } = authStorage.get();
  const currentTier = (user?.subscription_tier ?? "free") as "free" | "premium" | "pro";
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubscribe = () => {
    toast.info("준비 중입니다");
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
            <h1 className="text-lg font-bold text-gray-900">구독 관리</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          요금제를 선택하고 프리미엄 기능을 이용하세요
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-3">현재 플랜</h3>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-blue-100 mb-1">현재 사용중</div>
              <div className="text-2xl font-bold">
                {plans.find(p => p.id === currentTier)?.name}
              </div>
            </div>
            {currentTier !== "free" && (
              <Crown className="w-8 h-8 text-amber-300" />
            )}
          </div>
          <div className="text-sm text-blue-100">
            {currentTier === "free" ? (
              "언제든지 업그레이드 가능합니다"
            ) : (
              "다음 결제일: 2026-04-16"
            )}
          </div>
        </div>
      </div>

      {/* Billing Period Toggle */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              billingPeriod === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            월간
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors relative ${
              billingPeriod === "yearly"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            연간
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
              20% 할인
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="px-5 space-y-3">
        {plans.map((plan) => {
          const yearlyPrice = Math.round(plan.price * 12 * 0.8);
          const displayPrice = billingPeriod === "yearly" ? yearlyPrice : plan.price;
          const isCurrentPlan = currentTier === plan.id;

          return (
            <div
              key={plan.id}
              className={`border-2 rounded-2xl p-5 transition-all ${
                plan.popular
                  ? "border-blue-600 bg-blue-50"
                  : isCurrentPlan
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    {plan.popular && (
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      {displayPrice === 0 ? "무료" : `₩${displayPrice.toLocaleString()}`}
                    </span>
                    {displayPrice > 0 && (
                      <span className="text-sm text-gray-600 mb-1">
                        / {billingPeriod === "yearly" ? "년" : "월"}
                      </span>
                    )}
                  </div>
                  {billingPeriod === "yearly" && plan.price > 0 && (
                    <div className="text-xs text-green-600 mt-1">
                      연간 {(plan.price * 12 * 0.2).toLocaleString()}원 절약
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-5">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  현재 플랜
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe()}
                  className={`w-full py-3 rounded-xl font-semibold active:opacity-80 ${
                    plan.popular
                      ? "bg-blue-600 text-white"
                      : "bg-gray-900 text-white"
                  }`}
                >
                  {plan.id === "free" ? "무료 사용" : "업그레이드"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="bg-white px-5 py-5 mt-2">
        <h3 className="font-bold text-gray-900 mb-4">자주 묻는 질문</h3>
        <div className="space-y-3 text-sm">
          <div>
            <div className="font-medium text-gray-900 mb-1">
              플랜은 언제든 변경할 수 있나요?
            </div>
            <div className="text-gray-600">
              네, 언제든지 업그레이드 또는 다운그레이드가 가능합니다.
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">
              환불이 가능한가요?
            </div>
            <div className="text-gray-600">
              서비스 이용 후 7일 이내 전액 환불이 가능합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}