import { Filter, Clock, MapPin, Eye, FileText, MessageCircle, Star, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// Mock data
const mockActivityLogs = [
  {
    id: 1,
    type: "view",
    action: "매물 조회",
    detail: "역삼동 123-45 매물 상세 페이지 방문",
    timestamp: "2026-03-16 14:30",
    metadata: { propertyId: "1", views: 1 },
  },
  {
    id: 2,
    type: "proposal",
    action: "제안서 수락",
    detail: "김중개의 제안서 수락",
    timestamp: "2026-03-15 11:45",
    metadata: { agentName: "김중개", propertyId: "1" },
  },
  {
    id: 3,
    type: "message",
    action: "메시지 발송",
    detail: "이중개에게 메시지 전송",
    timestamp: "2026-03-14 09:30",
    metadata: { recipientName: "이중개" },
  },
  {
    id: 4,
    type: "review",
    action: "리뷰 작성",
    detail: "역삼동 123-45 매물에 대한 리뷰 작성",
    timestamp: "2026-03-13 15:10",
    metadata: { propertyId: "3", review: "매물 상태가 좋습니다" },
  },
];

export function ActivityLog() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "login" | "property" | "transaction">("all");

  const handleBack = () => {
    navigate(-1);
  };

  const filteredLogs = mockActivityLogs.filter((log) => {
    if (filter === "all") return true;
    return log.type === filter;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "view":
        return <Eye className="w-5 h-5 text-blue-600" />;
      case "proposal":
        return <FileText className="w-5 h-5 text-purple-600" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-indigo-600" />;
      case "review":
        return <Star className="w-5 h-5 text-yellow-600" />;
      default:
        return <Filter className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "view":
        return "bg-blue-50 border-blue-200";
      case "proposal":
        return "bg-purple-50 border-purple-200";
      case "message":
        return "bg-indigo-50 border-indigo-200";
      case "review":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
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
            <h1 className="text-lg font-bold text-gray-900">활동 기록</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          모든 활동 내역을 확인하고 관리하세요
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "전체" },
            { key: "view", label: "방문" },
            { key: "proposal", label: "제안서" },
            { key: "message", label: "메시지" },
            { key: "review", label: "리뷰" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? "bg-blue-600 text-white"
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
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mockActivityLogs.filter((a) => a.type === "view").length}
            </div>
            <div className="text-xs text-blue-900">방문</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {mockActivityLogs.filter((a) => a.type === "proposal").length}
            </div>
            <div className="text-xs text-purple-900">제안서</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {mockActivityLogs.filter((a) => a.type === "message").length}
            </div>
            <div className="text-xs text-indigo-900">메시지</div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white px-5 py-5">
        <div className="space-y-3">
          {filteredLogs.map((activity, index) => (
            <div key={activity.id} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getActivityColor(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                {index < filteredLogs.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gray-200 min-h-[20px] my-2"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div
                  className={`border-2 rounded-xl p-4 ${getActivityColor(
                    activity.type
                  )}`}
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {activity.action}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {activity.detail}
                  </div>
                  <div className="text-xs text-gray-500">{activity.timestamp}</div>

                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {activity.type === "view" && activity.metadata.views && (
                        <div className="text-xs text-gray-600">
                          조회수: {activity.metadata.views}회
                        </div>
                      )}
                      {activity.type === "proposal" &&
                        activity.metadata.agentName && (
                          <div className="text-xs text-gray-600">
                            중개인: {activity.metadata.agentName}
                          </div>
                        )}
                      {activity.type === "message" &&
                        activity.metadata.recipientName && (
                          <div className="text-xs text-gray-600">
                            수신인: {activity.metadata.recipientName}
                          </div>
                        )}
                      {activity.type === "review" &&
                        activity.metadata.review && (
                          <div className="text-xs text-gray-600">
                            리뷰: {activity.metadata.review}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">활동 기록이 없습니다</p>
        </div>
      )}
    </div>
  );
}