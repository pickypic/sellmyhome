import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Star, Award, MapPin, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { usersApi, reviewsApi, AgentProfile as AgentProfileType, Review } from "@/api/client";

export function AgentProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<AgentProfileType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      usersApi.getAgentProfile(id),
      reviewsApi.getAgentReviews(id),
    ])
      .then(([prof, revs]) => {
        setProfile(prof);
        setReviews(revs ?? []);
      })
      .catch((e) => toast.error(e.message || "프로필을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">프로필을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-base font-semibold text-gray-900 ml-2">중개사 프로필</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-white px-5 py-6 mb-2">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {profile.profile_image ? (
              <img src={profile.profile_image} alt={profile.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              profile.name.charAt(0)
            )}
          </div>
          <div className="flex-1 pt-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{profile.name}</h2>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">{profile.avg_rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({profile.review_count})</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              경력 {profile.career_years}년 · 거래 {profile.transaction_count}건
            </div>
          </div>
        </div>

        {/* Specialties */}
        {profile.specialties && profile.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white px-5 py-5 mb-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{profile.transaction_count}</div>
            <div className="text-xs text-gray-600">총 거래</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{profile.avg_rating.toFixed(1)}</div>
            <div className="text-xs text-gray-600">평균 평점</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{profile.career_years}년</div>
            <div className="text-xs text-gray-600">경력</div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      {profile.introduction && (
        <div className="bg-white px-5 py-5 mb-2">
          <h3 className="font-semibold text-gray-900 mb-3">소개</h3>
          <p className="text-gray-700 leading-relaxed text-sm">{profile.introduction}</p>
        </div>
      )}

      {/* Qualifications */}
      <div className="bg-white px-5 py-5 mb-2">
        <h3 className="font-semibold text-gray-900 mb-3">자격 및 인증</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
            <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700 text-sm">공인중개사 자격증 보유</span>
          </div>
          <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
            <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700 text-sm">중개 보증 보험 가입</span>
          </div>
        </div>
      </div>

      {/* Activity Regions */}
      {(profile.region_gu || profile.region_dong) && (
        <div className="bg-white px-5 py-5 mb-2">
          <h3 className="font-semibold text-gray-900 mb-3">활동 지역</h3>
          <div className="flex flex-wrap gap-2">
            {profile.region_gu && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <MapPin className="w-4 h-4" />
                {profile.region_gu}
              </span>
            )}
            {profile.region_dong && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <MapPin className="w-4 h-4" />
                {profile.region_dong}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Office */}
      {profile.office_name && (
        <div className="bg-white px-5 py-5 mb-2">
          <h3 className="font-semibold text-gray-900 mb-3">소속 중개사무소</h3>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 text-sm">{profile.office_name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            거래 후기 ({reviews.length})
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-sm">{profile.avg_rating.toFixed(1)}</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">아직 리뷰가 없습니다.</div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {review.created_at?.slice(0, 10)}
                  </span>
                </div>
                {review.content && (
                  <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Padding */}
      <div className="h-20"></div>
    </div>
  );
}
