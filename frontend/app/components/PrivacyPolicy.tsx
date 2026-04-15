import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function PrivacyPolicy() {
  const navigate = useNavigate();

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
          <h1 className="text-lg font-bold text-foreground">개인정보처리방침</h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="mb-6">
            <p className="text-xs text-muted-foreground">최종 수정일: 2025년 1월 30일</p>
          </div>

          <section className="mb-8">
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              셀마홈(이하 "회사")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하고 있습니다. 회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">1. 개인정보의 수집 및 이용 목적</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">가. 회원가입 및 관리</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지 등
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">나. 매물 등록 및 중개 서비스 제공</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  매물 등록, 실소유자 인증(정부24 연동), 중개인 자격 확인, 중개 매칭 서비스 제공, 거래 내역 관리
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">다. 마케팅 및 광고 활용</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공, 서비스 이용 통계
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">2. 수집하는 개인정보의 항목</h2>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">가. 필수 수집 항목</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1 ml-2">
                  <li><strong className="font-semibold text-foreground">매도인:</strong> 이름, 이메일, 휴대폰번호, 정부24 본인인증 정보, 부동산 소유 정보</li>
                  <li><strong className="font-semibold text-foreground">중개인:</strong> 이름, 이메일, 휴대폰번호, 공인중개사 자격증 정보, 중개사무소 정보</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">나. 선택 수집 항목</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  프로필 사진, 닉네임, 마케팅 정보 수신 동의 여부
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">다. 자동 수집 항목</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 기기 정보
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">3. 개인정보의 처리 및 보유 기간</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
              <li>회원 탈퇴 시 개인정보는 즉시 파기됩니다. 다만, 관계 법령에 의해 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</li>
              <li>거래 관련 정보는 전자상거래법 등 관련 법령에 따라 다음과 같이 보존합니다:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                  <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                  <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">4. 개인정보의 제3자 제공</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              회사는 원칙적으로 이용자의 개인정보를 제1조(개인정보의 수집 및 이용 목적)에서 명시한 범위 내에서 처리하며, 이용자의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1 ml-2 mt-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">5. 개인정보의 파기</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong className="font-semibold text-foreground">파기 절차:</strong> 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li>
              <li><strong className="font-semibold text-foreground">파기 방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">6. 이용자 및 법정대리인의 권리</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 가입 해지를 요청할 수 있습니다.</li>
              <li>개인정보 조회·수정은 '프로필 수정'에서 가능하며, 가입 해지(동의철회)는 고객센터를 통해 요청하실 수 있습니다.</li>
              <li>개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">7. 개인정보 보호책임자</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4">
              <p className="text-sm text-foreground leading-relaxed">
                <strong className="font-semibold">개인정보 보호책임자</strong><br />
                성명: 김철수<br />
                직책: CTO<br />
                이메일: privacy@selmahome.com<br />
                전화: 02-1234-5678
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">8. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong className="font-semibold text-foreground">쿠키의 사용 목적:</strong> 이용자의 접속 빈도나 방문 시간 등을 분석하고, 이용자의 취향과 관심분야를 파악하여 타겟 마케팅 및 서비스 개편 등의 척도로 활용합니다.</li>
              <li><strong className="font-semibold text-foreground">쿠키 설정 거부 방법:</strong> 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">9. 개인정보의 안전성 확보 조치</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong className="font-semibold text-foreground">관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
              <li><strong className="font-semibold text-foreground">기술적 조치:</strong> 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
              <li><strong className="font-semibold text-foreground">물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">10. 개인정보처리방침의 변경</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="font-semibold text-foreground">공고일자:</strong> 2025년 1월 30일<br />
              <strong className="font-semibold text-foreground">시행일자:</strong> 2025년 1월 30일
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}