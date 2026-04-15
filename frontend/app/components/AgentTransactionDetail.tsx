import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, User, Clock, FileText, MessageSquare, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { transactionsApi, Transaction } from "@/api/client";

// 거래 진행 단계 (백엔드 status 머신에 맞게 정의)
const TX_STAGES = [
  {
    key: "contract_pending",
    label: "계약 대기",
    progress: 20,
    description: "매도인과 계약 일정을 조율하는 단계입니다.",
    tasks: ["매도인과 첫 미팅 일정 잡기", "필수 서류 체크리스트 확인", "계약서 초안 준비"],
  },
  {
    key: "contract_signed",
    label: "계약 체결",
    progress: 50,
    description: "매매계약서를 작성하고 계약을 체결합니다.",
    tasks: ["계약서 서명 완료", "계약금 입금 확인", "중도금 일정 협의"],
  },
  {
    key: "balance_pending",
    label: "잔금 대기",
    progress: 70,
    description: "잔금 납부일을 기다리는 단계입니다.",
    tasks: ["잔금 납부일 확정", "이사 일정 조율", "각종 정산 준비"],
  },
  {
    key: "registration_pending",
    label: "등기 대기",
    progress: 85,
    description: "소유권 이전 등기를 진행 중입니다.",
    tasks: ["잔금 입금 확인", "소유권 이전 등기 신청", "열쇠 인계 준비"],
  },
  {
    key: "completed",
    label: "거래 완료",
    progress: 100,
    description: "거래가 성공적으로 완료되었습니다.",
    tasks: ["열쇠 인계 완료", "소유권 이전 등기 완료", "수수료 정산"],
  },
];

function formatPrice(price?: number): string {
  if (!price) return "-";
  const eok = Math.floor(price / 100000000);
  const man = Math.floor((price % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man}만원`;
}

function calcCommission(price?: number, rate?: number): string {
  if (!price || !rate) return "-";
  return `${Math.round(price * rate / 100 / 10000).toLocaleString()}만원`;
}

export function AgentTransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"progress" | "timeline" | "documents">("progress");

  useEffect(() => {
    if (!id) return;
    transactionsApi.getOne(id)
      .then(setTransaction)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">거래 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const property = (transaction as any).property;
  const seller = (transaction as any).seller;

  const currentStageIndex = TX_STAGES.findIndex((s) => s.key === transaction.status);
  const currentStage = TX_STAGES[currentStageIndex] ?? TX_STAGES[0];
  const effectivePrice = transaction.agreed_price || property?.asking_price;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">거래 진행 상황</h1>
        </div>
      </header>

      {/* Property Info Card */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">
              {property?.apartment_name ?? "-"} · {property?.area ? `${property.area}㎡` : ""}
            </div>
            <div className="text-base font-bold text-gray-900 mb-2">
              {property?.address ?? "-"}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">{formatPrice(effectivePrice)}</span>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-sm text-gray-600">수수료 {calcCommission(effectivePrice, transaction.commission_rate)}</span>
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
              />
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

      {/* Tab: Progress */}
      {activeTab === "progress" && (
        <div className="space-y-2">
          {TX_STAGES.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;

            return (
              <div key={stage.key} className="bg-white px-5 py-4">
                <div className="flex items-start gap-3">
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
                    {index < TX_STAGES.length - 1 && (
                      <div
                        className={`w-0.5 h-12 mt-1 ${
                          isCompleted ? "bg-green-300" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

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

      {/* Tab: Timeline */}
      {activeTab === "timeline" && (
        <div className="bg-white px-5 py-5">
          <div className="space-y-4">
            {[
              { date: transaction.created_at?.slice(0, 10), title: "거래 생성", description: "중개사 선택 후 거래가 시작되었습니다.", completed: true },
              { date: "-", title: currentStage.label, description: currentStage.description, completed: transaction.status === "completed" },
            ].map((event, index, arr) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event.completed ? "bg-green-500" : "bg-blue-400"
                    }`}
                  />
                  {index < arr.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 mt-1" />
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

          {/* Notes placeholder */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              메모
            </h3>
            <button className="mt-1 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors">
              + 메모 추가
            </button>
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === "documents" && (
        <div className="bg-white px-5 py-5">
          <p className="text-sm text-gray-500 mb-4">업로드된 문서가 없습니다.</p>

          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors">
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
                { name: "등기부등본", completed: false },
                { name: "건축물대장", completed: false },
                { name: "토지대장", completed: false },
                { name: "매도인 신분증", completed: false },
                { name: "매물 사진", completed: false },
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
                <div className="text-xs text-gray-600">{seller?.name ?? "-"}</div>
              </div>
            </div>
            {seller?.phone && (
              <a
                href={`tel:${seller.phone}`}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
              >
                전화
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 py-4">
        <button
          onClick={() => toast.info("거래 상태 변경은 매도인과 협의 후 진행됩니다.")}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          다음 단계로 진행
        </button>
      </div>
    </div>
  );
}
