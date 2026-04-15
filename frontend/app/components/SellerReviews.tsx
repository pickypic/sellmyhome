import { Star, ThumbsUp, MessageSquare, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// Mock data
const mockReviews = [
  {
    id: 1,
    agentName: "김중개",
    agentPhoto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
    propertyAddress: "서울특별시 강남구 역삼동 123-45",
    rating: 5,
    date: "2026-03-10",
    comment:
      "정말 전문적이고 친절하셨습니다. 기대했던 것보다 높은 가격에 빠르게 거래가 성사되어 매우 만족합니다. 다음에도 꼭 다시 이용하고 싶어요!",
    helpful: 12,
    canReview: false,
  },
  {
    id: 2,
    agentName: "박공인",
    agentPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100",
    propertyAddress: "서울특별시 서초구 서초동 678-90",
    rating: 4,
    date: "2026-02-28",
    comment:
      "성실하게 일 처리해주셨어요. 거래 과정이 투명했고 서류 작업도 꼼꼼히 해주셔서 좋았습니다.",
    helpful: 8,
    canReview: false,
  },
  {
    id: 3,
    agentName: "이부동산",
    agentPhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
    propertyAddress: "서울특별시 송파구 잠실동 345-67",
    rating: 0,
    date: "2026-03-15",
    comment: "",
    helpful: 0,
    canReview: true,
  },
];

export function SellerReviews() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "positive" | "negative">("all");

  const handleBack = () => {
    navigate(-1);
  };

  const filteredReviews = mockReviews.filter((r) => {
    if (activeFilter === "positive") return r.rating > 0;
    if (activeFilter === "negative") return r.rating === 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
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
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {mockReviews.filter((r) => r.rating > 0).length}
            </div>
            <div className="text-xs text-gray-600">작성완료</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mockReviews.filter((r) => r.rating === 0).length}
            </div>
            <div className="text-xs text-gray-600">작성대기</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-500 mb-1">
              {(
                mockReviews
                  .filter((r) => r.rating > 0)
                  .reduce((acc, r) => acc + r.rating, 0) /
                mockReviews.filter((r) => r.rating > 0).length
              ).toFixed(1)}
            </div>
            <div className="text-xs text-gray-600">평균 평점</div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white px-5 py-5">
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              {/* Agent Info */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={review.agentPhoto}
                  alt={review.agentName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-0.5">
                    {review.agentName}
                  </div>
                  <div className="text-xs text-gray-600">
                    {review.propertyAddress}
                  </div>
                </div>
                {review.canReview && (
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg active:bg-blue-700">
                    리뷰 작성
                  </button>
                )}
              </div>

              {review.rating > 0 ? (
                <>
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-semibold text-gray-900 ml-1">
                      {review.rating}.0
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {review.comment}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{review.date}</span>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>도움됨 {review.helpful}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    리뷰를 작성해주세요
                  </p>
                  <p className="text-xs text-blue-700">
                    거래 완료 후 30일 이내에 작성 가능합니다
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white px-5 py-20 text-center">
          <p className="text-gray-500 mb-2">리뷰가 없습니다</p>
          <p className="text-sm text-gray-400">
            거래가 완료되면 리뷰를 작성할 수 있습니다
          </p>
        </div>
      )}
    </div>
  );
}