import { Link } from "react-router";
import { Shield, Users, TrendingUp, CheckCircle2, Star, Award, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export function SellerIntro() {
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [isCtaVisible, setIsCtaVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCtaVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-sm bg-card/80">
        <div className="px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">뒤로</span>
          </Link>
          <Link
            to="/signup?type=seller"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-5 pt-10 pb-12 bg-gradient-to-b from-blue-50 to-background dark:from-slate-900/20 dark:to-background">
        <div className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-md mb-4">
          매도인을 위한 프리미엄 서비스
        </div>
        <h1 className="text-[32px] leading-tight font-bold text-foreground mb-4">
          최고의 조건으로<br />
          집을 판매하세요
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          검증된 전문 중개사들의 제안을 비교하고<br />
          가장 유리한 조건을 선택하세요
        </p>

        {/* Key Benefits */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">76K+</div>
            <div className="text-xs text-muted-foreground">서울 거래</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">4.8</div>
            <div className="text-xs text-muted-foreground">평균 별점</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">15%↓</div>
            <div className="text-xs text-muted-foreground">수수료 절감</div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-5 pb-12 bg-background">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">이용 방법</h2>
          <p className="text-sm text-muted-foreground">간단한 4단계로 시작하세요</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
                01
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground mb-1">매물 등록</div>
                <div className="text-sm text-muted-foreground">정부24 본인인증으로 소유 확인</div>
              </div>
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
                02
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground mb-1">제안 접수</div>
                <div className="text-sm text-muted-foreground">3일간 중개사들의 조건 비교</div>
              </div>
              <Star className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
                03
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground mb-1">중개사 선택</div>
                <div className="text-sm text-muted-foreground">평판, 수수료, 서비스 검토</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
                04
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground mb-1">거래 진행</div>
                <div className="text-sm text-muted-foreground">선택한 전문가와 안전 거래</div>
              </div>
              <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="px-5 pb-12 bg-gradient-to-b from-slate-50 to-background dark:from-slate-950/50 dark:to-background -mx-0 py-12">
        <div className="px-5">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-2">핵심 기능</h2>
            <p className="text-sm text-muted-foreground">셀마홈이 제공하는 특별한 가치</p>
          </div>
          
          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-foreground mb-2">투명한 비교</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    중개사들의 경력, 전문분야, 거래실적, 리뷰를 투명하게 확인하고 비교하세요
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">평균 5개 제안</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-foreground mb-2">안전한 인증</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    정부24 본인인증으로 실소유자만 등록 가능해 사기 매물을 원천 차단합니다
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">정부 공인 인증</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-foreground mb-2">역제안 시스템</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    3일간 여러 전문가의 제안을 받고 가장 유리한 조건을 선택하세요
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">평균 15% 절감</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-10 bg-background">
        <Link
          ref={ctaRef}
          to="/signup?type=seller"
          className="group relative block w-full overflow-hidden rounded-2xl shadow-2xl"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600"></div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-active:translate-x-[200%] transition-transform duration-700"></div>
          
          {/* Content */}
          <div className="relative px-6 py-6 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-semibold text-blue-100">Premium</span>
              </div>
              <div className="text-lg font-bold text-white mb-1">매도인으로 시작하기</div>
              <div className="text-sm text-blue-100">지금 바로 매물을 등록하세요</div>
            </div>
            <ArrowRight className="w-6 h-6 text-white flex-shrink-0" />
          </div>
        </Link>

        <div className="mt-6 text-center pb-24">
          <Link to="/login" className="text-muted-foreground text-sm inline-flex items-center gap-1.5">
            이미 계정이 있으신가요?
            <span className="text-foreground font-semibold inline-flex items-center gap-1">
              로그인
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Floating Action Button */}
      {!isCtaVisible && (
        <div className="fixed bottom-20 left-0 right-0 z-50 px-5 pointer-events-none">
          <Link
            to="/signup?type=seller"
            className="pointer-events-auto group relative block w-full max-w-md mx-auto overflow-hidden rounded-2xl shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600"></div>
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            
            {/* Content */}
            <div className="relative px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-semibold text-blue-100">Premium</span>
                </div>
                <div className="text-base font-bold text-white">매도인으로 시작하기</div>
              </div>
              <ArrowRight className="w-6 h-6 text-white flex-shrink-0" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}