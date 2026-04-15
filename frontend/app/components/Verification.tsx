import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle, Shield, FileText } from "lucide-react";

export function Verification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('property');
  const [step, setStep] = useState(1);

  const handleVerification = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      alert('본인 소유 인증이 완료되었습니다!');
      navigate('/seller/listings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center z-10">
        <Link to="/seller/listings" className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-base font-semibold text-gray-900 ml-2">본인 소유 인증</h1>
      </div>

      <div className="px-5 py-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute top-4 left-0 right-0 flex items-center px-4">
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
            </div>
            
            {/* Active Progress Bar */}
            {step > 1 && (
              <div className="absolute top-4 left-0 right-0 flex items-center px-4">
                <div className={`h-0.5 bg-blue-600 mx-4 ${step === 2 ? 'flex-1' : ''}`} style={step === 3 ? {width: 'calc(50% + 16px)'} : {}}></div>
                {step === 3 && <div className="flex-1 h-0.5 bg-blue-600 mx-4"></div>}
              </div>
            )}

            {/* Steps */}
            <div className="relative flex justify-between">
              {[
                { num: 1, label: '정보 입력' },
                { num: 2, label: '정부24 인증' },
                { num: 3, label: '완료' }
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    s.num <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s.num < step ? <CheckCircle className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">본인 소유 인증이 필요한 이유</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    사기 매물을 방지하고 안전한 거래를 위해 정부24 연동을 통한 본인 소유 인증을 진행합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">인증 정보 입력</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  주민등록번호
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="앞 6자리 (예: 900101)"
                    maxLength={6}
                  />
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="뒤 7자리 (•••••••)"
                    maxLength={7}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  휴대폰 번호
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-800">
                개인정보는 본인 인증 용도로만 사용되며, 안전하게 암호화되어 저장됩니다.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Government24 Verification */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">정부24 연동</h3>
              <p className="text-sm text-gray-600 mb-6">
                정부24를 통해 부동산 소유 정보를 확인합니다
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">소유자명</span>
                    <span className="font-semibold">홍길동</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">물건지 주소</span>
                    <span className="font-semibold">서울시 강남구...</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                정부24 로그인 페이지로 이동합니다
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">인증 완료!</h3>
              <p className="text-gray-600 mb-6">
                본인 소유 인증이 완료되었습니다.<br />
                이제 중개사들의 제안을 받을 수 있습니다.
              </p>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">입찰 기간</span>
                    <span className="font-semibold text-blue-600">3일</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">마감 예정</span>
                    <span className="font-semibold">2026-03-06</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={handleVerification}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold"
          >
            {step === 1 && '다음'}
            {step === 2 && '정부24 인증하기'}
            {step === 3 && '완료'}
          </button>
        </div>
      </div>
    </div>
  );
}