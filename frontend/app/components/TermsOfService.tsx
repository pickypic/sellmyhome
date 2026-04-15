import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function TermsOfService() {
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
          <h1 className="text-lg font-bold text-foreground">이용약관</h1>
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="mb-6">
            <p className="text-xs text-muted-foreground">최종 수정일: 2025년 1월 30일</p>
          </div>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제1조 (목적)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              본 약관은 셀마홈(이하 "회사")이 제공하는 부동산 중개 입찰 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제2조 (정의)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li><strong className="font-semibold text-foreground">"서비스"</strong>란 회사가 제공하는 부동산 중개 입찰 플랫폼 및 관련 부가 서비스를 의미합니다.</li>
              <li><strong className="font-semibold text-foreground">"이용자"</strong>란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li><strong className="font-semibold text-foreground">"매도인"</strong>이란 부동산 매물을 등록하여 중개인의 제안을 받고자 하는 회원을 말합니다.</li>
              <li><strong className="font-semibold text-foreground">"중개인"</strong>이란 공인중개사 자격을 보유하고 매물에 대한 중개 제안을 하는 회원을 말합니다.</li>
              <li><strong className="font-semibold text-foreground">"매칭"</strong>이란 매도인이 중개인의 제안을 수락하여 중개 계약이 체결되는 것을 말합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</li>
              <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 공지합니다.</li>
              <li>이용자가 변경된 약관에 동의하지 않을 경우, 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제4조 (회원가입)</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>회원가입은 이용자가 약관의 내용에 동의하고 회원가입 신청을 한 후 회사가 이를 승낙함으로써 체결됩니다.</li>
              <li>매도인은 정부24 본인인증을 통해 실소유자임을 확인해야 하며, 허위 정보 제공 시 회원 자격이 제한될 수 있습니다.</li>
              <li>중개인은 공인중개사 자격증을 제출하여 인증을 완료해야 서비스를 이용할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제5조 (서비스의 제공)</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>회사는 매도인과 중개인을 연결하는 플랫폼을 제공하며, 직접 중개 행위를 하지 않습니다.</li>
              <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 점검 등 필요한 경우 서비스 제공을 일시 중단할 수 있습니다.</li>
              <li>회사는 서비스 개선을 위해 지속적으로 기능을 추가하거나 변경할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제6조 (매물 등록 및 제안)</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>매도인은 정부24 본인인증을 통해 실소유자임을 확인한 후 매물을 등록할 수 있습니다.</li>
              <li>중개인은 등록된 매물에 대해 중개 조건을 제안할 수 있으며, 제안 기간은 매물 등록일로부터 3일입니다.</li>
              <li>매도인은 접수된 제안을 검토하여 원하는 중개인을 선택하고 매칭을 진행할 수 있습니다.</li>
              <li>허위 매물 등록 또는 악의적인 제안 행위가 발견될 경우, 회사는 해당 회원의 서비스 이용을 제한할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제7조 (수수료 및 결제)</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>서비스 이용 수수료는 별도로 공지된 요금표에 따릅니다.</li>
              <li>거래 성사 시, 중개인은 매도인과 약정한 중개 수수료를 직접 정산하며, 회사는 이에 개입하지 않습니다.</li>
              <li>회사는 플랫폼 이용에 대한 수수료를 중개인에게 청구할 수 있습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제8조 (이용자의 의무)</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>이용자는 본 약관 및 관련 법령을 준수해야 합니다.</li>
              <li>이용자는 타인의 개인정보를 도용하거나 허위 정보를 제공해서는 안 됩니다.</li>
              <li>이용자는 회사의 서비스 운영을 방해하는 행위를 해서는 안 됩니다.</li>
              <li>이용자는 서비스를 통해 얻은 정보를 회사의 사전 동의 없이 복제, 유통, 판매하는 등 부정하게 사용해서는 안 됩니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제9조 (회사의 의무)</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>회사는 관련 법령과 본 약관을 준수하며, 계속적이고 안정적인 서비스 제공을 위해 노력합니다.</li>
              <li>회사는 이용자의 개인정보 보호를 위해 보안 시스템을 구축하고 개인정보처리방침을 공시합니다.</li>
              <li>회사는 서비스 이용과 관련하여 이용자로부터 제기된 의견이나 불만이 정당하다고 인정될 경우 이를 처리합니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제10조 (면책사항)</h2>
            <ol className="list-decimal list-inside text-sm text-muted-foreground leading-relaxed space-y-2 ml-2">
              <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
              <li>회사는 이용자 간의 거래 과정에서 발생한 분쟁에 대해 개입하거나 책임을 지지 않습니다.</li>
              <li>회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 손해를 입은 경우 책임을 지지 않습니다.</li>
              <li>회사는 이용자가 제공한 정보의 정확성, 신뢰성에 대해 책임을 지지 않습니다.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">제11조 (분쟁해결)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              본 약관과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 대한민국 법을 준거법으로 하며, 민사소송법상의 관할법원에 소를 제기할 수 있습니다.
            </p>
          </section>

          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="font-semibold text-foreground">부칙</strong><br />
              본 약관은 2025년 1월 30일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}