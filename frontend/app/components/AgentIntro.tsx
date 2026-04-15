import { Link } from "react-router";
import { Crown, Sparkles, TrendingUp, CheckCircle2, Star, Award, ArrowRight, ArrowLeft, Gem } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export function AgentIntro() {
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
            to="/signup?type=agent"
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-5 pt-10 pb-12 bg-gradient-to-b from-amber-50 to-background dark:from-amber-900/10 dark:to-background">
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold rounded-md mb-4">
          중개인을 위한 프리미엄 서비스
        </div>
        <h1 className="text-[32px] leading-tight font-bold text-foreground mb-4">
          프리미엄 매물을<br />
          효율적으로 확보하세요
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-6">
          검증된 매물에 경쟁력 있는 조건을 제시하고<br />
          독점 중개 기회를 확보하세요
        </p>

        {/* Key Benefits */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">109K+</div>
            <div className="text-xs text-muted-foreground">등록 중개사</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">100%</div>
            <div className="text-xs text-muted-foreground">본인인증</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground mb-1">3일</div>
            <div className="text-xs text-muted-foreground">제안 기간</div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-amber-500/20">
                01
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground mb-1">프리미엄 인증</div>
                <div className="text-sm text-muted-foreground">중개사 자격증 확인 후 가입</div>
              </div>
              <Crown className="w-5 h-5 text-amber-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-amber-500/20">
                02
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground mb-1">매물 확인</div>
                <div className="text-sm text-muted-foreground">관심 지역 신규 매물 알림</div>
              </div>
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-amber-500/20">
                03
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground mb-1">제안 제출</div>
                <div className="text-sm text-muted-foreground">경쟁력 있는 조건 제시</div>
              </div>
              <TrendingUp className="w-5 h-5 text-amber-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-amber-500/20">
                04
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground mb-1">독점 수임</div>
                <div className="text-sm text-muted-foreground">선택 시 프리미엄 매물 확보</div>
              </div>
              <Gem className="w-5 h-5 text-amber-500 flex-shrink-0" />
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
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-foreground mb-2">검증된 매물</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    정부24 인증으로 검증된 실소유자의 매물만 등록되어 안전하게 중개하세요
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">100% 인증 매물</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-card to-card/50 dark:from-slate-900/50 dark:to-slate-800/50 border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-foreground mb-2">평판 시스템</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    거래 후기와 별점으로 평판을 쌓고 더 많은 매물 기회를 확보하세요
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">투명한 리뷰</span>
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
                  <h3 className="font-bold text-foreground mb-2">공동중개 옵션</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    다른 중개사와 협업하여 더 빠르고 효율적으로 거래를 성사시키세요
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">협업 가능</span>
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
          to="/signup?type=agent"
          className="group relative block w-full overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 shadow-xl"
        >
          {/* Content */}
          <div className="relative px-6 py-6 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Professional</span>
              </div>
              <div className="text-lg font-bold text-foreground mb-1">중개인으로 시작하기</div>
              <div className="text-sm text-muted-foreground">지금 바로 프리미엄 매물을 확인하세요</div>
            </div>
            <ArrowRight className="w-6 h-6 text-foreground flex-shrink-0" />
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
            to="/signup?type=agent"
            className="pointer-events-auto group relative block w-full max-w-md mx-auto overflow-hidden rounded-2xl shadow-2xl hover:shadow-amber-500/50 hover:scale-105 transition-all border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
          >
            {/* Content */}
            <div className="relative px-6 py-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Professional</span>
                </div>
                <div className="text-base font-bold text-foreground">중개인으로 시작하기</div>
              </div>
              <ArrowRight className="w-6 h-6 text-foreground flex-shrink-0" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}