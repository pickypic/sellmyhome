import { useState } from "react";
import {
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
} from "lucide-react";

// Mock data
const mockDisputes = [
  {
    id: 1,
    propertyAddress: "서울특별시 강남구 역삼동 123-45",
    seller: "김매도",
    agent: "이중개",
    type: "commission",
    status: "open",
    priority: "high",
    description: "중개 수수료 관련 분쟁. 계약서와 실제 청구 금액이 다름",
    createdDate: "2026-03-15 10:30",
    messages: [
      {
        from: "김매도",
        message: "계약서에는 0.4%라고 했는데 0.5%를 청구하셨습니다.",
        timestamp: "2026-03-15 10:30",
      },
      {
        from: "이중개",
        message: "추가 서비스 비용이 포함된 것입니다.",
        timestamp: "2026-03-15 11:00",
      },
    ],
  },
  {
    id: 2,
    propertyAddress: "서울특별시 서초구 서초동 678-90",
    seller: "박매도",
    agent: "최중개",
    type: "contract_breach",
    status: "investigating",
    priority: "medium",
    description: "계약 불이행. 중개사가 약속한 기간 내 거래 미완료",
    createdDate: "2026-03-14 14:20",
    messages: [
      {
        from: "박매도",
        message: "6개월 보장이라고 하셨는데 아직도 매수자를 못 찾으셨어요.",
        timestamp: "2026-03-14 14:20",
      },
    ],
  },
  {
    id: 3,
    propertyAddress: "서울특별시 송파구 잠실동 345-67",
    seller: "정매도",
    agent: "강중개",
    type: "other",
    status: "resolved",
    priority: "low",
    description: "기타 - 소통 문제",
    createdDate: "2026-03-10 09:15",
    resolution: "양측 합의 완료. 정상적으로 거래 진행",
    resolvedDate: "2026-03-12 16:30",
    messages: [],
  },
];

export function AdminDisputes() {
  const [filter, setFilter] = useState<"all" | "open" | "investigating" | "resolved">("open");
  const [selectedDispute, setSelectedDispute] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");

  const filteredDisputes = mockDisputes.filter((d) =>
    filter === "all" ? true : d.status === filter
  );

  const selected = selectedDispute
    ? mockDisputes.find((d) => d.id === selectedDispute)
    : null;

  const handleResolve = (id: number) => {
    const resolution = prompt("해결 내용을 입력해주세요:");
    if (resolution) {
      alert("분쟁이 해결되었습니다.");
      setSelectedDispute(null);
    }
  };

  const handleEscalate = (id: number) => {
    if (confirm("이 분쟁을 상위 관리자에게 에스컬레이션하시겠습니까?")) {
      alert("에스컬레이션되었습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <h1 className="text-xl font-bold text-gray-900 mb-1">분쟁 처리</h1>
        <p className="text-sm text-gray-600">
          사용자 간 분쟁을 조정하고 해결하세요
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "open", label: "진행중" },
            { key: "investigating", label: "조사중" },
            { key: "resolved", label: "해결됨" },
            { key: "all", label: "전체" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 active:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {mockDisputes.filter((d) => d.status === "open").length}
            </div>
            <div className="text-xs text-red-900">진행중</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {mockDisputes.filter((d) => d.status === "investigating").length}
            </div>
            <div className="text-xs text-orange-900">조사중</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {mockDisputes.filter((d) => d.status === "resolved").length}
            </div>
            <div className="text-xs text-green-900">해결됨</div>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="bg-white px-5 py-5">
        <div className="space-y-3">
          {filteredDisputes.map((dispute) => (
            <div
              key={dispute.id}
              className={`border-2 rounded-xl p-4 ${
                dispute.priority === "high"
                  ? "border-red-300 bg-red-50"
                  : dispute.priority === "medium"
                  ? "border-orange-300 bg-orange-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">
                      분쟁 #{dispute.id}
                    </span>
                    {dispute.priority === "high" && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                        긴급
                      </span>
                    )}
                    {dispute.status === "open" && (
                      <Clock className="w-4 h-4 text-red-600" />
                    )}
                    {dispute.status === "resolved" && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    {dispute.propertyAddress}
                  </div>
                  <div className="text-xs text-gray-500">{dispute.createdDate}</div>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-0.5">매도인</div>
                  <div className="text-sm font-medium text-gray-900">
                    {dispute.seller}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-xs text-gray-600 mb-0.5">중개인</div>
                  <div className="text-sm font-medium text-gray-900">
                    {dispute.agent}
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="bg-white rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-600 mb-0.5">분쟁 유형</div>
                <div className="text-sm font-medium text-gray-900">
                  {dispute.type === "commission" && "중개 수수료"}
                  {dispute.type === "contract_breach" && "계약 불이행"}
                  {dispute.type === "other" && "기타"}
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <div className="text-xs text-gray-600 mb-1">내용</div>
                <div className="text-sm text-gray-700">{dispute.description}</div>
              </div>

              {/* Messages */}
              {dispute.messages.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-600 mb-2">
                    메시지 ({dispute.messages.length})
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {dispute.messages.map((msg, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-900">
                            {msg.from}
                          </span>
                          <span className="text-xs text-gray-500">
                            {msg.timestamp}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">{msg.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution */}
              {dispute.status === "resolved" && dispute.resolution && (
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <div className="text-xs text-green-600 mb-1">해결 내용</div>
                  <div className="text-sm text-green-900">{dispute.resolution}</div>
                  <div className="text-xs text-green-600 mt-1">
                    {dispute.resolvedDate}
                  </div>
                </div>
              )}

              {/* Actions */}
              {dispute.status !== "resolved" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEscalate(dispute.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-orange-300 text-orange-600 rounded-lg text-sm font-semibold active:bg-orange-50"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    에스컬레이션
                  </button>
                  <button
                    onClick={() => handleResolve(dispute.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold active:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    해결 완료
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredDisputes.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">분쟁이 없습니다</p>
        </div>
      )}
    </div>
  );
}
