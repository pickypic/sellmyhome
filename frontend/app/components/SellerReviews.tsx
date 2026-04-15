import { Star, MessageSquare, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// 현재 매도자가 작성한 리뷰를 조회하는 전용 API가 없으므로
// 빈 상태로 처리합니다. 추후 reviewsApi.getMyReviews() 연결 예정.

export function SellerReviews() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "positive" | "negative">("all");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">리뷰 관리</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          거래한 중개사에 대한 리뷰를 작성하세요
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-5 py-4 mb-2">
        <div className="flex gap-2">
          {[
            { key: "all", label: "전체" },
            { key: "positive", label: "작성완료" },
            { key: "negative", label: "작성대기" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeFilter === tab.key
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
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-xs text-gray-600">작성완료</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
            <div className="text-xs text-gray-600">작성대기</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-500 mb-1">-</div>
            <div className="text-xs text-gray-600">평균 평점</div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-white px-5 py-20 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">리뷰가 없습니다</p>
        <p className="text-sm text-gray-400">
          거래가 완료되면 리뷰를 작성할 수 있습니다
        </p>
      </div>
    </div>
  );
}
