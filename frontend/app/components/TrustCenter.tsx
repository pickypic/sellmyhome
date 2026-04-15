import { Shield, Award, Star, CheckCircle2, ArrowLeft, FileText, Clock, XCircle } from "lucide-react";
import { useNavigate, Link } from "react-router";

// Mock data
const mockVerifications = {
  seller: [
    {
      id: 1,
      type: "ownership",
      title: "소유권 인증",
      status: "verified",
      verifiedDate: "2026-03-10",
      expiryDate: "2027-03-10",
      documents: ["등기부등본", "신분증"],
    },
    {
      id: 2,
      type: "identity",
      title: "본인 인증",
      status: "verified",
      verifiedDate: "2026-02-15",
      expiryDate: null,
      documents: ["신분증", "휴대폰 인증"],
    },
  ],
  agent: [
    {
      id: 1,
      type: "license",
      title: "공인중개사 자격증",
      status: "verified",
      verifiedDate: "2026-01-20",
      expiryDate: null,
      documents: ["자격증 사본"],
    },
    {
      id: 2,
      type: "office",
      title: "사무소 등록증",
      status: "verified",
      verifiedDate: "2026-01-20",
      expiryDate: "2027-01-20",
      documents: ["사업자등록증"],
    },
    {
      id: 3,
      type: "identity",
      title: "본인 인증",
      status: "verified",
      verifiedDate: "2026-01-15",
      expiryDate: null,
      documents: ["신분증", "휴대폰 인증"],
    },
  ],
};

export function TrustCenter() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const trustMetrics = [
    {
      icon: <Shield className="w-5 h-5 text-amber-300" />,
      label: "신뢰 점수",
      value: "100점",
      progress: "100%",
      completed: 3,
      total: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">신뢰센터</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          안전한 거래를 위한 인증 관리
        </p>
      </div>

      {/* Trust Score */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 mx-5 mb-2 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-medium text-blue-100">신뢰 점수</span>
        </div>
        <div className="flex items-end gap-2 mb-4">
          <div className="text-5xl font-bold">100</div>
          <div className="text-xl text-blue-100 mb-2">점</div>
        </div>
        <div className="w-full bg-blue-800 rounded-full h-2 mb-3">
          <div
            className="bg-amber-300 rounded-full h-2 transition-all"
            style={{ width: "100%" }}
          ></div>
        </div>
        <p className="text-sm text-blue-100">
          3/3 인증 완료
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">인증 혜택</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-0.5">
                신뢰도 증가
              </div>
              <div className="text-xs text-gray-600">
                중개사들이 우선적으로 지원합니다
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-0.5">
                안전한 거래
              </div>
              <div className="text-xs text-gray-600">
                검증된 사용자만 거래하여 분쟁을 예방합니다
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-0.5">
                프리미엄 배지
              </div>
              <div className="text-xs text-gray-600">
                프로필에 인증 배지가 표시됩니다
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verifications List */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">인증 항목</h3>
        <div className="space-y-3">
          {mockVerifications.agent.map((verification) => (
            <div
              key={verification.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {verification.title}
                  </h4>
                  {verification.status === "verified" && (
                    <div className="flex items-center gap-1 text-xs text-green-600 mb-2">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>인증 완료</span>
                    </div>
                  )}
                  {verification.status === "pending" && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 mb-2">
                      <Clock className="w-3 h-3" />
                      <span>검토중</span>
                    </div>
                  )}
                  {verification.status === "rejected" && (
                    <div className="flex items-center gap-1 text-xs text-red-600 mb-2">
                      <XCircle className="w-3 h-3" />
                      <span>반려됨</span>
                    </div>
                  )}
                </div>
                {verification.status === "verified" ? (
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <Link
                    to={`/verification?type=${verification.type}`}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg active:bg-blue-700"
                  >
                    인증하기
                  </Link>
                )}
              </div>

              {verification.status === "verified" && (
                <>
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-gray-600 mb-0.5">인증일</div>
                        <div className="font-medium text-gray-900">
                          {verification.verifiedDate}
                        </div>
                      </div>
                      {verification.expiryDate && (
                        <div>
                          <div className="text-gray-600 mb-0.5">만료일</div>
                          <div className="font-medium text-gray-900">
                            {verification.expiryDate}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {verification.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        <FileText className="w-3 h-3" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}