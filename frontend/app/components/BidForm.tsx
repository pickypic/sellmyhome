import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
import { propertiesApi, bidsApi, PropertyDetail } from "@/api/client";

function formatPrice(price: number): string {
  const eok = Math.floor(price / 100000000);
  const man = Math.floor((price % 100000000) / 10000);
  if (eok > 0 && man > 0) return `${eok}억 ${man}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man}만원`;
}

export function BidForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    commission: '',
    message: '',
    experience: '',
    specialService: '',
  });

  useEffect(() => {
    if (!id) return;
    propertiesApi.getOne(id)
      .then(setProperty)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoadingProperty(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const commissionRate = parseFloat(formData.commission);
    if (isNaN(commissionRate) || commissionRate < 0.3) {
      toast.error("수수료율은 최소 0.3% 이상이어야 합니다.");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("제안 메시지를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await bidsApi.create({
        property_id: id,
        commission_rate: commissionRate,
        message: formData.message,
        experience: formData.experience || undefined,
        special_service: formData.specialService || undefined,
      });
      toast.success("지원이 완료되었습니다!");
      navigate('/agent/bids');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center z-10">
        <Link to={`/property/${id}`} className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-base font-semibold text-gray-900 ml-2">지원하기</h1>
      </div>

      <div className="px-5 py-6">
        {/* Property Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">매물 정보</h3>
          {loadingProperty ? (
            <p className="text-sm text-gray-400">불러오는 중...</p>
          ) : property ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">단지명</span>
                <span className="font-semibold text-gray-900">{property.apartment_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">전용면적</span>
                <span className="font-semibold text-gray-900">{property.area}㎡</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">희망가</span>
                <span className="font-semibold text-blue-600">{formatPrice(property.asking_price)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">매물 정보를 불러올 수 없습니다.</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Commission */}
          <div>
            <label htmlFor="commission" className="block text-sm font-semibold text-gray-700 mb-2">
              제안 수수료율 (%)
            </label>
            <div className="relative">
              <input
                id="commission"
                name="commission"
                type="number"
                step="0.01"
                min="0.3"
                max="0.9"
                value={formData.commission}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="0.5"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              최저 수수료율: 0.3% / 법정 상한: 0.6% (거래금액 5억 원 이상 기준)
            </p>
          </div>

          {/* Experience in Area */}
          <div>
            <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
              해당 지역 거래 경험
            </label>
            <input
              id="experience"
              name="experience"
              type="text"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="예: 강남구 아파트 거래 50건 이상"
            />
          </div>

          {/* Special Service */}
          <div>
            <label htmlFor="specialService" className="block text-sm font-semibold text-gray-700 mb-2">
              특별 서비스
            </label>
            <input
              id="specialService"
              name="specialService"
              type="text"
              value={formData.specialService}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="예: 전문 사진 촬영, 홈스테이징 지원"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
              제안 메시지
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              placeholder="매도인에게 전달할 메시지를 작성해주세요. 본인의 강점과 거래 진행 계획을 구체적으로 설명하면 선택 확률이 높아집니다."
            />
            <p className="mt-2 text-xs text-gray-500">
              최소 50자 이상 작성을 권장합니다
            </p>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">지원 팁</p>
              <ul className="space-y-1 text-xs">
                <li>• 경쟁력 있는 수수료와 전문성을 어필하세요</li>
                <li>• 해당 지역 거래 경험을 구체적으로 작성하세요</li>
                <li>• 매도인이 신뢰할 수 있는 거래 계획을 제시하세요</li>
              </ul>
            </div>
          </div>

          {/* Preview Commission */}
          {formData.commission && property && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">예상 중개 수수료</span>
                <span className="text-xl font-bold text-green-600">
                  {Math.round(parseFloat(formData.commission) * property.asking_price / 100 / 10000).toLocaleString()}만원
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                거래가 {formatPrice(property.asking_price)} 기준
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/property/${id}`)}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 bg-green-600 text-white rounded-lg font-semibold disabled:opacity-60"
            >
              {submitting ? "처리중..." : "지원하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
