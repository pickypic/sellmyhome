import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, DollarSign, User, Calendar, CheckCircle2, Circle, Clock, FileText, MessageSquare, AlertCircle } from "lucide-react";
import { useState } from "react";

// 7단계 거래 진행 상태
const transactionStages = [
  { 
    key: "selected", 
    label: "에이전트 선택", 
    progress: 14,
    description: "매도인이 귀하를 중개인으로 선택했습니다.",
    tasks: ["매도인과 첫 미팅 일정 잡기", "매물 확인 방문 예약"]
  },
  { 
    key: "preparation", 
    label: "서류 준비", 
    progress: 28,
    description: "매물 등록에 필요한 서류를 준비합니다.",
    tasks: ["등기부등본 확인", "건축물대장 확인", "토지대장 확인", "매도인 신분증 확인"]
  },
  { 
    key: "listing", 
    label: "매물 공개", 
    progress: 42,
    description: "매물이 공개되어 매수자를 찾습니다.",
    tasks: ["매물 사진 촬영", "상세 설명 작성", "매물 정보 공개", "홍보 활동 시작"]
  },
  { 
    key: "showing", 
    label: "매수자 안내", 
    progress: 57,
    description: "관심 있는 매수자에게 매물을 안내합니다.",
    tasks: ["매수자 현장 안내", "매물 설명", "주변 환경 소개", "질의응답"]
  },
  { 
    key: "negotiation", 
    label: "가격 협상", 
    progress: 71,
    description: "매도인과 매수자 간 가격을 협상합니다.",
    tasks: ["매수자 희망가 전달", "매도인 의견 수렴", "중간 가격 제안", "최종 가격 합의"]
  },
  { 
    key: "contract", 
    label: "계약 체결", 
    progress: 85,
    description: "매매계약서를 작성하고 계약을 체결합니다.",
    tasks: ["계약서 초안 작성", "계약금 입금 확인", "계약서 서명", "중도금 일정 확인"]
  },
  { 
    key: "closed", 
    label: "거래 완료", 
    progress: 100,
    description: "잔금 처리와 소유권 이전이 완료되었습니다.",
    tasks: ["잔금 입금 확인", "소유권 이전 등기", "열쇠 인계", "거래 완료 확인"]
  },
];

// Mock 거래 데이터
const mockTransactionData = {
  id: 1,
  propertyAddress: "서울특별시 강남구 역삼동 123-45",
  apartmentName: "역삼래미안",
  area: "84㎡",
  floor: "15층",
  price: "12억 8천만원",
  commission: "512만원",
  sellerName: "김매도",
  sellerPhone: "010-1234-5678",
  buyerName: "이매수",
  buyerPhone: "010-8765-4321",
  startDate: "2026-02-15",
  currentStatus: "negotiation",
  timeline: [
    { date: "2026-02-15", title: "에이전트 선택", description: "매도인이 귀하를 중개인으로 선택했습니다.", completed: true },
    { date: "2026-02-16", title: "서류 준비 시작", description: "등기부등본 및 필수 서류 확인 시작", completed: true },
    { date: "2026-02-18", title: "서류 준비 완료", description: "모든 필수 서류가 준비되었습니다.", completed: true },
    { date: "2026-02-20", title: "매물 공개", description: "매물이 플랫폼에 공개되었습니다.", completed: true },
    { date: "2026-02-25", title: "첫 매수자 안내", description: "관심 매수자 첫 현장 방문", completed: true },
    { date: "2026-03-05", title: "매수자 결정", description: "이매수님이 구매 의사를 밝혔습니다.", completed: true },
    { date: "2026-03-10", title: "가격 협상 진행중", description: "현재 최종 가격 협의 중입니다.", completed: false },
  ],
  documents: [
    { name: "등기부등본.pdf", uploadDate: "2026-02-16", size: "1.2MB" },
    { name: "건축물대장.pdf", uploadDate: "2026-02-16", size: "850KB" },
    { name: "매물사진.zip", uploadDate: "2026-02-19", size: "15.3MB" },
  ],
  notes: [
    { date: "2026-03-10 14:30", content: "매수자가 12억 5천만원 제시. 매도인은 12억 7천만원 희망." },
    { date: "2026-03-08 10:00", content: "매수자 두 번째 방문. 구매 의사 확실함." },
    { date: "2026-02-25 15:00", content: "첫 번째 매수자 현장 방문. 긍정적 반응." },
  ]
};

export function AgentTransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"progress" | "timeline" | "documents">("progress");
  
  const transaction = mockTransactionData;
  const currentStageIndex = transactionStages.findIndex(s => s.key === transaction.currentStatus);
  const currentStage = transactionStages[currentStageIndex];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-1 -ml-1">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">거래 진행 상황</h1>
          </div>
        </div>
      </header>

      {/* Property Info Card */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">
              {transaction.apartmentName} · {transaction.area} · {transaction.floor}
            </div>
            <div className="text-base font-bold text-gray-900 mb-2">
              {transaction.propertyAddress}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">{transaction.price}</span>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-sm text-gray-600">수수료 {transaction.commission}</span>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">현재 진행 단계</span>
          </div>
          <div className="text-lg font-bold text-blue-600 mb-1">{currentStage.label}</div>
          <div className="text-sm text-blue-800">{currentStage.description}</div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-blue-700">전체 진행률</span>
              <span className="text-xs font-bold text-blue-900">{currentStage.progress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${currentStage.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-5 py-3 mb-2">
        <div className="flex gap-2">
          {[
            { key: "progress", label: "진행 단계" },
            { key: "timeline", label: "타임라인" },
            { key: "documents", label: "문서" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 active:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "progress" && (
        <div className="space-y-2">
          {/* Stages */}
          {transactionStages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isPending = index > currentStageIndex;

            return (
              <div key={stage.key} className="bg-white px-5 py-4">
                <div className="flex items-start gap-3">
                  {/* Step Indicator */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isCompleted
                          ? "bg-green-100 text-green-600"
                          : isCurrent
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isCurrent ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    {index < transactionStages.length - 1 && (
                      <div
                        className={`w-0.5 h-12 mt-1 ${
                          isCompleted ? "bg-green-300" : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={`font-bold ${
                          isCompleted
                            ? "text-green-900"
                            : isCurrent
                            ? "text-blue-900"
                            : "text-gray-500"
                        }`}
                      >
                        {stage.label}
                      </h3>
                      <span
                        className={`text-xs font-semibold ${
                          isCompleted
                            ? "text-green-600"
                            : isCurrent
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        {stage.progress}%
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-3 ${
                        isCompleted || isCurrent ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {stage.description}
                    </p>

                    {/* Tasks */}
                    {(isCurrent || (isCompleted && index === currentStageIndex - 1)) && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="text-xs font-semibold text-gray-700 mb-2">
                          {isCurrent ? "진행할 작업" : "완료된 작업"}
                        </div>
                        {stage.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-start gap-2">
                            <CheckCircle2
                              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                isCompleted ? "text-green-500" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isCompleted ? "text-gray-600 line-through" : "text-gray-700"
                              }`}
                            >
                              {task}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="bg-white px-5 py-5">
          <div className="space-y-4">
            {transaction.timeline.map((event, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  {index < transaction.timeline.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-xs text-gray-500 mb-1">{event.date}</div>
                  <div className="font-semibold text-gray-900 mb-1">{event.title}</div>
                  <div className="text-sm text-gray-600">{event.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              메모
            </h3>
            <div className="space-y-3">
              {transaction.notes.map((note, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="text-xs text-yellow-700 mb-1">{note.date}</div>
                  <div className="text-sm text-gray-800">{note.content}</div>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors">
              + 메모 추가
            </button>
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white px-5 py-5">
          <div className="space-y-3">
            {transaction.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{doc.name}</div>
                  <div className="text-xs text-gray-500">
                    {doc.uploadDate} · {doc.size}
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200">
                  보기
                </button>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors">
            + 문서 업로드
          </button>

          {/* Document Checklist */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              필수 서류 체크리스트
            </h3>
            <div className="space-y-2">
              {[
                { name: "등기부등본", completed: true },
                { name: "건축물대장", completed: true },
                { name: "토지대장", completed: false },
                { name: "매도인 신분증", completed: false },
                { name: "매물 사진", completed: true },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      item.completed ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      item.completed
                        ? "text-gray-700 line-through"
                        : "text-gray-900 font-medium"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="bg-white px-5 py-5 mb-2 mt-2">
        <h3 className="font-bold text-gray-900 mb-3">연락처</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">매도인</div>
                <div className="text-xs text-gray-600">{transaction.sellerName}</div>
              </div>
            </div>
            <a
              href={`tel:${transaction.sellerPhone}`}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              전화
            </a>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">매수자</div>
                <div className="text-xs text-gray-600">{transaction.buyerName}</div>
              </div>
            </div>
            <a
              href={`tel:${transaction.buyerPhone}`}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"
            >
              전화
            </a>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 py-4">
        <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
          다음 단계로 진행
        </button>
      </div>
    </div>
  );
}
