import { Link } from "react-router";
import { ArrowRight, Home as HomeIcon, User, Building2, Shield, Zap, BarChart3, Settings, Loader2 } from "lucide-react";
import { Users } from "lucide-react";

export function Sitemap() {
  const commonPages = [
    { path: "/", label: "홈", desc: "역할 선택 페이지" },
    { path: "/splash", label: "로딩 화면", desc: "앱 시작 스플래시" },
    { path: "/seller-intro", label: "매도인 소개", desc: "매도인 상세 설명" },
    { path: "/agent-intro", label: "중개인 소개", desc: "중개인 상세 설명" },
    { path: "/login", label: "로그인", desc: "이메일 로그인" },
    { path: "/signup", label: "회원가입", desc: "매도인/중개인 가입" },
  ];

  const sellerPages = [
    { path: "/seller/dashboard", label: "대시보드", desc: "홈 화면" },
    { path: "/seller/listings", label: "내 매물", desc: "매물 목록 관리" },
    { path: "/seller/add-property", label: "매물 등록", desc: "새 매물 등록" },
    { path: "/seller/proposals", label: "받은 제안서", desc: "중개사 제안 확인" },
    { path: "/seller/proposals/1", label: "제안서 상세", desc: "제안서 상세 정보" },
    { path: "/seller/reviews", label: "리뷰 관리", desc: "중개사 리뷰 작성" },
    { path: "/seller/verification", label: "본인 인증", desc: "정부24 소유 인증" },
    { path: "/property/1", label: "매물 상세", desc: "지원 확인 및 선택" },
    { path: "/agent/1", label: "중개사 프로필", desc: "중개사 상세 정보" },
    { path: "/seller/transactions", label: "거래 내역", desc: "진행/완료 거래" },
    { path: "/seller/profile", label: "내 프로필", desc: "설정 및 관리" },
  ];

  const agentPages = [
    { path: "/agent/dashboard", label: "대시보드", desc: "홈 화면" },
    { path: "/agent/listings", label: "매물 목록", desc: "지원 가능 매물" },
    { path: "/property/1", label: "매물 상세", desc: "매물 정보 확인" },
    { path: "/property/1/bid", label: "지원하기", desc: "제안서 작성" },
    { path: "/agent/bids", label: "지원 내역", desc: "내 지원 관리" },
    { path: "/agent/transactions", label: "거래 내역", desc: "매칭된 거래" },
    { path: "/agent/reviews", label: "받은 리뷰", desc: "고객 리뷰 확인" },
    { path: "/agent/profile", label: "내 프로필", desc: "설정 및 관리" },
  ];

  const leaguePages = [
    { path: "/agent/leagues", label: "내 리그", desc: "공동중개 리그 목록" },
    { path: "/agent/leagues/create", label: "리그 만들기", desc: "새 리그 생성" },
    { path: "/agent/leagues/1", label: "리그 상세", desc: "리그 정보 및 관리" },
  ];

  const pointsPages = [
    { path: "/agent/points", label: "포인트", desc: "포인트 잔액 및 사용" },
    { path: "/agent/points/purchase", label: "포인트 충전", desc: "포인트 구매" },
    { path: "/agent/points/history", label: "포인트 내역", desc: "사용 및 적립 내역" },
  ];

  const trustReportsPages = [
    { path: "/trust-center", label: "신뢰 인증", desc: "자격증 및 인증 관리" },
    { path: "/market-analysis", label: "시장 분석", desc: "부동산 시장 동향" },
  ];

  const settingsPages = [
    { path: "/settings/notifications", label: "알림 설정", desc: "푸시 알림 관리" },
    { path: "/settings/profile-edit", label: "프로필 수정", desc: "개인정보 수정" },
    { path: "/settings/security", label: "보안 설정", desc: "비밀번호 및 2FA" },
    { path: "/settings/subscription", label: "구독 관리", desc: "요금제 관리" },
    { path: "/settings/payment", label: "결제 관리", desc: "결제 수단 및 내역" },
  ];

  const supportPages = [
    { path: "/support", label: "고객지원", desc: "문의 및 상담" },
    { path: "/faq", label: "FAQ", desc: "자주 묻는 질문" },
    { path: "/terms", label: "이용약관", desc: "서비스 약관" },
    { path: "/privacy", label: "개인정보처리방침", desc: "개인정보 정책" },
  ];

  const adminPages = [
    { path: "/admin/dashboard", label: "관리자 대시보드", desc: "시스템 모니터링" },
    { path: "/admin/verifications", label: "인증 승인", desc: "사용자 인증 관리" },
    { path: "/admin/disputes", label: "분쟁 처리", desc: "분쟁 조정 및 해결" },
    { path: "/admin/logs", label: "로그 조회", desc: "활동 로그 추적" },
    { path: "/admin/sanctions", label: "제재 관리", desc: "사용자 제재 관리" },
    { path: "/admin/blacklist", label: "블랙리스트", desc: "차단 사용자 관리" },
  ];

  const activityPages = [
    { path: "/activity-log", label: "활동 로그", desc: "나의 활동 기록" },
  ];

  const sellerFlow = [
    { from: "홈", to: "매도인 소개", label: "선택" },
    { from: "매도인 소개", to: "회원가입", label: "시작하기" },
    { from: "회원가입", to: "로그인", label: "가입 완료" },
    { from: "로그인", to: "대시보드", label: "로그인" },
    { from: "대시보드", to: "매물 등록", label: "새 매물" },
    { from: "매물 등록", to: "본인 인증", label: "등록" },
    { from: "본인 인증", to: "내 매물", label: "인증 완료" },
    { from: "내 매물", to: "받은 제안서", label: "확인" },
    { from: "받은 제안서", to: "제안서 상세", label: "클릭" },
    { from: "제안서 상세", to: "거래 내역", label: "수락" },
  ];

  const agentFlow = [
    { from: "홈", to: "중개인 소개", label: "선택" },
    { from: "중개인 소개", to: "회원가입", label: "시작하기" },
    { from: "회원가입", to: "로그인", label: "가입 완료" },
    { from: "로그인", to: "대시보드", label: "로그인" },
    { from: "대시보드", to: "매물 목록", label: "매물 검색" },
    { from: "매물 목록", to: "매물 상세", label: "클릭" },
    { from: "매물 상세", to: "지원하기", label: "지원" },
    { from: "지원하기", to: "지원 내역", label: "완료" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          셀마이홈 유저 플로우
        </h1>
        <p className="text-gray-600">
          프로토타입의 모든 페이지와 플로우를 한눈에 확인하세요
        </p>
      </div>

      <div className="px-5 pb-20 space-y-8">
        {/* Common Pages */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <HomeIcon className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">공통 페이지</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {commonPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between active:bg-gray-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </section>

        {/* Seller Flow */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">매도인 플로우</h2>
          </div>

          {/* Visual Flow */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 overflow-x-auto">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              📍 주요 플로우
            </h3>
            <div className="space-y-2">
              {sellerFlow.map((flow, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium min-w-[70px] text-center whitespace-nowrap">
                    {flow.from}
                  </div>
                  <ArrowRight className="w-3 h-3 text-blue-600 flex-shrink-0" />
                  <div className="text-[10px] text-gray-500 min-w-[45px] text-center whitespace-nowrap">
                    {flow.label}
                  </div>
                  <ArrowRight className="w-3 h-3 text-blue-600 flex-shrink-0" />
                  <div className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium min-w-[70px] text-center whitespace-nowrap">
                    {flow.to}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Page List */}
          <div className="grid grid-cols-1 gap-3">
            {sellerPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border-2 border-blue-100 rounded-xl p-4 flex items-center justify-between active:bg-blue-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                  <div className="text-xs text-blue-600 mt-1 font-mono">
                    {page.path}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* Agent Flow */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">중개인 플로우</h2>
          </div>

          {/* Visual Flow */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 overflow-x-auto">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              📍 주요 플로우
            </h3>
            <div className="space-y-2">
              {agentFlow.map((flow, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium min-w-[70px] text-center whitespace-nowrap">
                    {flow.from}
                  </div>
                  <ArrowRight className="w-3 h-3 text-green-600 flex-shrink-0" />
                  <div className="text-[10px] text-gray-500 min-w-[45px] text-center whitespace-nowrap">
                    {flow.label}
                  </div>
                  <ArrowRight className="w-3 h-3 text-green-600 flex-shrink-0" />
                  <div className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium min-w-[70px] text-center whitespace-nowrap">
                    {flow.to}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Page List */}
          <div className="grid grid-cols-1 gap-3">
            {agentPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border-2 border-green-100 rounded-xl p-4 flex items-center justify-between active:bg-green-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                  <div className="text-xs text-green-600 mt-1 font-mono">
                    {page.path}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-green-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* League Pages */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">공동중개 리그 (중개인)</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {leaguePages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border-2 border-purple-100 rounded-xl p-4 flex items-center justify-between active:bg-purple-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                  <div className="text-xs text-purple-600 mt-1 font-mono">
                    {page.path}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* Points Pages */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">포인트 시스템 (중개인)</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {pointsPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border-2 border-amber-100 rounded-xl p-4 flex items-center justify-between active:bg-amber-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                  <div className="text-xs text-amber-600 mt-1 font-mono">
                    {page.path}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* Trust & Reports */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">신뢰 & 분석</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {trustReportsPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border-2 border-indigo-100 rounded-xl p-4 flex items-center justify-between active:bg-indigo-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                  <div className="text-xs text-indigo-600 mt-1 font-mono">
                    {page.path}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-600" />
              </Link>
            ))}
          </div>
        </section>

        {/* Settings Pages */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">설정</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {settingsPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between active:bg-gray-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    {page.path}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </section>

        {/* Support Pages */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">고객지원 & 법률</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {supportPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between active:bg-gray-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    {page.path}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </section>

        {/* Admin Pages */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">관리자 페이지</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {adminPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between active:bg-gray-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    {page.path}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </section>

        {/* Activity Pages */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">활동 로그</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {activityPages.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between active:bg-gray-50"
              >
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {page.label}
                  </div>
                  <div className="text-sm text-gray-600">{page.desc}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    {page.path}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="bg-gradient-to-br from-blue-50 to-green-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-4">🚀 퀵 스타트 가이드</h3>
          
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-blue-600 mb-2">매도인으로 체험</div>
              <ol className="text-sm text-gray-700 space-y-1 ml-4">
                <li>1. 홈에서 "매도인 소개" 클릭</li>
                <li>2. "회원가입" 클릭</li>
                <li>3. "로그인" 클릭</li>
                <li>4. "새 매물 등록하기" 클릭</li>
                <li>5. 매물 정보 입력 후 본인 인증</li>
                <li>6. 내 매물에서 입찰 확인 및 중개사 선택</li>
              </ol>
            </div>

            <div className="h-px bg-gray-300"></div>

            <div>
              <div className="font-semibold text-green-600 mb-2">중개인으로 체험</div>
              <ol className="text-sm text-gray-700 space-y-1 ml-4">
                <li>1. 홈에서 "중개인 소개" 클릭</li>
                <li>2. "회원가입" 클릭</li>
                <li>3. "로그인" 클릭</li>
                <li>4. 매물 목록에서 관심 매물 클릭</li>
                <li>5. "입찰하기" 버튼 클릭</li>
                <li>6. 제안서 작성 후 입찰 완료</li>
                <li>7. 입찰 내역에서 상태 확인</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <Link
          to="/"
          className="block w-full py-4 bg-gray-900 text-white rounded-lg font-semibold text-center"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}