import { MessageCircle, Phone, Mail, Clock, ArrowLeft, ChevronRight, HelpCircle, FileText, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

const mockFAQs = [
  { id: 1, question: "서비스 이용 수수료는 어떻게 되나요?", answer: "기본 서비스는 무료이며, 프리미엄 기능 이용 시 요금제에 따라 수수료가 부과됩니다." },
  { id: 2, question: "매칭 후 계약 취소가 가능한가요?", answer: "매칭 완료 후 48시간 이내에는 무료로 취소 가능하며, 이후에는 위약금이 발생할 수 있습니다." },
  { id: 3, question: "환불 정책은 어떻게 되나요?", answer: "서비스 이용 후 7일 이내 전액 환불이 가능합니다. 자세한 내용은 환불 약관을 참고해주세요." },
];

export function Support() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("문의가 접수되었습니다. 이메일로 답변드리겠습니다.");
    setSubject("");
    setMessage("");
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
            <h1 className="text-lg font-bold text-gray-900">고객 지원</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          궁금한 점이 있으시면 언제든 문의해주세요
        </p>
      </div>

      {/* Contact Methods */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">빠른 상담</h3>
        <div className="grid grid-cols-3 gap-3">
          <a
            href="tel:1588-0000"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl active:bg-blue-100"
          >
            <Phone className="w-6 h-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-900">전화</span>
          </a>
          <a
            href="mailto:support@sellmyhome.com"
            className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl active:bg-green-100"
          >
            <Mail className="w-6 h-6 text-green-600" />
            <span className="text-xs font-medium text-green-900">이메일</span>
          </a>
          <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl active:bg-purple-100">
            <MessageCircle className="w-6 h-6 text-purple-600" />
            <span className="text-xs font-medium text-purple-900">채팅</span>
          </button>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
          <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-gray-900 mb-1">운영 시간</div>
            <div className="text-sm text-gray-600">
              평일 09:00 - 18:00<br />
              주말 및 공휴일 휴무
            </div>
          </div>
        </div>
      </div>

      {/* My Tickets */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">내 문의 내역</h3>
        <div className="py-10 text-center">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">문의 내역이 없습니다</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-bold text-gray-900 mb-4">문의 작성</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              제목
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="문의 제목을 입력해주세요"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              내용
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="문의 내용을 입력해주세요"
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold active:bg-blue-700"
          >
            문의 제출
          </button>
        </form>
      </div>

      {/* FAQ */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">자주 묻는 질문</h3>
          <Link to="/faq" className="text-sm text-blue-600 font-medium">
            전체보기
          </Link>
        </div>
        <div className="space-y-2">
          {mockFAQs.slice(0, 3).map((faq) => (
            <details
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <summary className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50">
                <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-900 flex-1">
                  {faq.question}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </summary>
              <div className="px-3 pb-3 pt-1 bg-gray-50">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Help Center */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">도움말 센터</h3>
        <div className="space-y-2">
          <Link
            to="/guide/seller"
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">매도인 가이드</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            to="/guide/agent"
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">중개인 가이드</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            to="/terms"
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">이용약관</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
          <Link
            to="/privacy"
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">개인정보처리방침</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}