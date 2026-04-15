import { Star, ThumbsUp, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { reviewsApi, authStorage, Review } from "@/api/client";

export function AgentReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "positive" | "negative">("all");

  useEffect(() => {
    const { user } = authStorage.get();
    if (!user?.id) {
      setLoading(false);
      return;
    }
    reviewsApi.getAgentReviews(user.id)
      .then((data) => setReviews(data ?? []))
      .catch((e) => toast.error(e.message || "리뷰를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "positive") return r.rating >= 4;
    if (activeFilter === "negative") return r.rating < 4;
    return true;
  });

  const averageRating =
    filteredReviews.length > 0
      ? (filteredReviews.reduce((acc, r) => acc + r.rating, 0) / filteredReviews.length).toFixed(1)
      : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: filteredReviews.filter((r) => r.rating === rating).length,
    percentage:
      filteredReviews.length > 0
        ? (filteredReviews.filter((r) => r.rating === rating).length / filteredReviews.length) * 100
        : 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 border-b border-gray-200">
        <div className="px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
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

      {loading ? (
        <div className="bg-white px-5 py-20 text-center text-gray-400 text-sm">
          불러오는 중...
        </div>
      ) : (
        <>
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
            {reviews.length > 0 && (
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
            )}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white px-5 py-4 mb-2">
            <div className="flex gap-2">
              {[
                { key: "all", label: "전체" },
                { key: "positive", label: "긍정 (4점+)" },
                { key: "negative", label: "부정 (3점 이하)" },
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

          {/* Reviews List */}
          <div className="bg-white px-5 py-5">
            <h3 className="font-bold text-gray-900 mb-4">리뷰 목록</h3>

            {filteredReviews.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                리뷰가 없습니다
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    {/* Reviewer avatar placeholder */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">익</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-0.5">익명</div>
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
                    {review.content && (
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {review.content}
                      </p>
                    )}

                    {/* Date */}
                    <div className="text-xs text-gray-500">
                      {review.created_at?.slice(0, 10)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
