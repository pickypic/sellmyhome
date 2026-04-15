import { Search, ChevronDown, ArrowLeft, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// Mock data
const mockFAQs = [
  {
    id: 1,
    category: "listing",
    question: "매물 등록 시 필요한 서류는 무엇인가요?",
    answer:
      "등기부등본, 신분증 사본이 필요합니다. 정부24를 통해 소유권 인증도 진행하실 수 있습니다.",
  },
  {
    id: 2,
    category: "listing",
    question: "매물 등록 후 수정이 가능한가요?",
    answer:
      "네, 언제든지 수정 가능합니다. 단, 이미 제안을 받은 경우 중요 정보 변경 시 중개사에게 알림이 전송됩니다.",
  },
  {
    id: 3,
    category: "bidding",
    question: "제안서는 얼마나 받을 수 있나요?",
    answer:
      "매물당 평균 5~10건의 제안서를 받으실 수 있습니다. 프리미엄 매물의 경우 더 많은 제안을 받으실 수 있습니다.",
  },
  {
    id: 4,
    category: "bidding",
    question: "제안서 검토 기간은 얼마나 되나요?",
    answer:
      "매물 등록 후 7일간 제안서를 받으실 수 있으며, 이후에도 추가 제안이 가능합니다.",
  },
  {
    id: 5,
    category: "payment",
    question: "중개 수수료는 어떻게 계산되나요?",
    answer:
      "거래가의 0.4~0.5% 범위에서 협의하실 수 있습니다. 각 중개사마다 제안하는 수수료율이 다를 수 있습니다.",
  },
  {
    id: 6,
    category: "payment",
    question: "수수료는 언제 지불하나요?",
    answer:
      "계약 체결 시점에 지불합니다. 거래가 성사되지 않으면 수수료가 발생하지 않습니다.",
  },
  {
    id: 7,
    category: "verification",
    question: "소유권 인증은 어떻게 하나요?",
    answer:
      "정부24 연동을 통해 간편하게 인증하실 수 있습니다. 또는 등기부등본을 업로드하셔도 됩니다.",
  },
  {
    id: 8,
    category: "verification",
    question: "인증은 필수인가요?",
    answer:
      "매도인은 소유권 인증이 필수이며, 중개인은 공인중개사 자격증 인증이 필수입니다.",
  },
  {
    id: 9,
    category: "account",
    question: "회원 탈퇴는 어떻게 하나요?",
    answer:
      "설정 > 보안 > 계정 삭제에서 탈퇴하실 수 있습니다. 진행중인 거래가 있는 경우 탈퇴가 제한될 수 있습니다.",
  },
  {
    id: 10,
    category: "account",
    question: "비밀번호를 잊어버렸어요",
    answer:
      "로그인 화면에서 '비밀번호 찾기'를 이용하시면 등록된 이메일로 재설정 링크가 발송됩니다.",
  },
];

export function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const filteredFAQs = mockFAQs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">자주 묻는 질문</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          궁금한 내용을 빠르게 찾아보세요
        </p>
      </div>

      {/* Search */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="질문 검색..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white px-5 py-5">
        <div className="space-y-2">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === faq.id ? null : faq.id)
                }
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === faq.id ? "rotate-180" : ""
                  }`}
                />
                <span className="text-sm font-medium text-gray-900 flex-1">
                  {faq.question}
                </span>
              </button>
              {openIndex === faq.id && (
                <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed pl-8">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredFAQs.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
          <p className="text-sm text-gray-400">
            다른 키워드로 검색하거나 고객지원에 문의해주세요
          </p>
        </div>
      )}

      {/* Contact Support */}
      <div className="bg-white px-5 py-5 mt-2">
        <div className="bg-blue-50 rounded-xl p-5 text-center">
          <p className="text-sm text-blue-900 mb-3">
            원하는 답변을 찾지 못하셨나요?
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700">
            1:1 문의하기
          </button>
        </div>
      </div>
    </div>
  );
}