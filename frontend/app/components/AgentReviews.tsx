import { Star, ThumbsUp, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// Mock data
const mockReviews = [
  {
    id: 1,
    sellerName: "김매도",
    sellerInitial: "김",
    propertyAddress: "서울특별시 강남구 역삼동 123-45",
    rating: 5,
    date: "2026-03-10",
    comment:
      "정말 전문적이고 친절하셨습니다. 기대했던 것보다 높은 가격에 빠르게 거래가 성사되어 매우 만족합니다. 다음에도 꼭 다시 이용하고 싶어요!",
  },
  {
    id: 2,
    sellerName: "박매도",
    sellerInitial: "박",
    propertyAddress: "서울특별시 송파구 잠실동 345-67",
    rating: 4,
    date: "2026-02-28",
    comment:
      "성실하게 일 처리해주셨어요. 거래 과정이 투명했고 서류 작업도 꼼꼼히 해주셔서 좋았습니다.",
  },
  {
    id: 3,
    sellerName: "이매도",
    sellerInitial: "이",
    propertyAddress: "서울특별시 서초구 반포동 890-12",
    rating: 5,
    date: "2026-02-15",
    comment:
      "시장 상황을 잘 파악하고 계셔서 적절한 가격 제안을 해주셨습니다. 소통도 원활하고 믿음이 갔어요.",
  },
];

export function AgentReviews() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "positive" | "negative">("all");

  const handleBack = () => {
    navigate(-1);
  };

  const filteredReviews = mockReviews.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "positive") return r.rating >= 4;
    if (activeFilter === "negative") return r.rating < 4;
    return true;
  });

  const averageRating = (
    filteredReviews.reduce((acc, r) => acc + r.rating, 0) / filteredReviews.length
  ).toFixed(1);

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: filteredReviews.filter((r) => r.rating === rating).length,
    percentage:
      (filteredReviews.filter((r) => r.rating === rating).length /
        filteredReviews.length) *
      100,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={handleBack} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">받은 리뷰</h1>
          </div>
        </div>
      </header>

      <div className="px-5 py-4 bg-white mb-2">
        <p className="text-sm text-gray-600">
          매도인들이 남긴 리뷰를 확인하세요
        </p>
      </div>

      {/* Rating Summary */}
      <div className="bg-white px-5 py-6 mb-2">
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating}
            </div>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < Math.round(parseFloat(averageRating))
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-600">
              총 {filteredReviews.length}개 리뷰
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {ratingDistribution.map((dist) => (
              <div key={dist.rating} className="flex items-center gap-2">
                <div className="text-xs text-gray-600 w-8">{dist.rating}점</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-400 rounded-full h-2"
                    style={{ width: `${dist.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 w-8 text-right">
                  {dist.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
            <ThumbsUp className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <div className="text-xs text-blue-600 mb-0.5">전문성</div>
              <div className="text-sm font-bold text-blue-900">
                상위 5%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white px-5 py-5">
        <h3 className="font-bold text-gray-900 mb-4">리뷰 목록</h3>
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-xl p-4"
            >
              {/* Reviewer Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {review.sellerInitial}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-0.5">
                    {review.sellerName}
                  </div>
                  <div className="text-xs text-gray-600">
                    {review.propertyAddress}
                  </div>
                </div>
              </div>

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
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                {review.comment}
              </p>

              {/* Date */}
              <div className="text-xs text-gray-500">{review.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}