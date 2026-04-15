import { Link, useNavigate } from "react-router";
import { Sparkles, ArrowRight, Home as HomeIcon } from "lucide-react";
import { useEffect } from "react";

export function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userType = localStorage.getItem("userType");

    if (isLoggedIn === "true" && userType) {
      // 이미 로그인된 사용자는 대시보드로 리다이렉트
      if (userType === "seller") {
        navigate("/seller/dashboard", { replace: true });
      } else if (userType === "agent") {
        navigate("/agent/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black"></div>
      
      {/* Elegant pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-0 w-96 h-96 bg-amber-400 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-blue-400 rounded-full blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col justify-center px-5 py-20">
        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-200">신뢰할 수 있는 프리미엄 플랫폼</span>
          </div>

          {/* Main Title */}
          <h2 className="text-[36px] leading-[1.15] font-bold text-white text-center mb-6">부동산 중개,<br />이제는 비교의 대상<br /></h2>
          
          <p className="text-[17px] text-blue-100 leading-relaxed text-center mb-12 max-w-sm">
            당신의 집, 아무에게나 맡기지 마세요.<br />
            셀마홈의 검증된 공인중개사들이<br />
            직접 제안서를 제출합니다.
          </p>

          {/* CTA Buttons */}
          <div className="w-full max-w-md space-y-4">
            {/* Seller Button */}
            <Link
              to="/seller-intro"
              className="group relative block w-full overflow-hidden rounded-2xl shadow-2xl"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600"></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-active:translate-x-[200%] transition-transform duration-700"></div>
              
              {/* Content */}
              <div className="relative px-7 py-8 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span className="text-xs font-semibold text-blue-100">매도인</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-1.5">집을 팔고 싶어요</div>
                  <div className="text-sm text-blue-100">전문가들의 제안을 받아보세요</div>
                </div>
                <ArrowRight className="w-7 h-7 text-white flex-shrink-0 group-active:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Agent Button */}
            <Link
              to="/agent-intro"
              className="group relative block w-full overflow-hidden rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm shadow-xl hover:bg-white/10 transition-colors"
            >
              <div className="relative px-7 py-8 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-amber-200">중개인</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-1.5">매물을 찾고 싶어요</div>
                  <div className="text-sm text-blue-100">프리미엄 매물을 확보하세요</div>
                </div>
                <ArrowRight className="w-7 h-7 text-white flex-shrink-0 group-active:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Login Link */}
          <div className="mt-10 text-center">
            <Link to="/login" className="text-blue-200 text-sm inline-flex items-center gap-1.5 hover:text-white transition-colors">
              이미 계정이 있으신가요?
              <span className="text-white font-semibold inline-flex items-center gap-1">
                로그인
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center space-y-2 pt-8">
          <p className="text-xs text-blue-200/60">
            당신의 소중한 자산, 프리미엄 서비스로 시작하세요
          </p>
          <p className="text-[10px] text-blue-200/40">
            © 2026 SellMyHome Premium. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}