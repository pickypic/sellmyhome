import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Camera, MapPin } from "lucide-react";

export function AddProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    apartmentName: '',
    address: '',
    area: '',
    price: '',
    floor: '',
    direction: '',
    buildYear: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 임시 저장 또는 본인 인증 페이지로 이동
    alert('매물이 등록되었습니다! 본인 소유 인증을 진행해주세요.');
    navigate('/seller/verification?property=new');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center z-10">
        <Link to="/seller/dashboard" className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-base font-semibold text-gray-900 ml-2">새 매물 등록</h1>
      </div>

      <div className="px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Property Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              매물 사진
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  type="button"
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 bg-gray-50"
                >
                  <Camera className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500">추가</span>
                </button>
              ))}
            </div>
          </div>

          {/* Apartment Name */}
          <div>
            <label htmlFor="apartmentName" className="block text-sm font-semibold text-gray-700 mb-2">
              아파트 단지명
            </label>
            <input
              id="apartmentName"
              name="apartmentName"
              type="text"
              value={formData.apartmentName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="예: 역삼래미안"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
              주소
            </label>
            <button
              type="button"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center gap-2"
            >
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">주소 검색</span>
            </button>
            {formData.address && (
              <p className="mt-2 text-sm text-gray-700">{formData.address}</p>
            )}
          </div>

          {/* Area & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-2">
                전용면적 (㎡)
              </label>
              <input
                id="area"
                name="area"
                type="text"
                value={formData.area}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="84"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                희망 매매가
              </label>
              <input
                id="price"
                name="price"
                type="text"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="12억"
              />
            </div>
          </div>

          {/* Floor, Direction, Build Year */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="floor" className="block text-sm font-semibold text-gray-700 mb-2">
                층수
              </label>
              <input
                id="floor"
                name="floor"
                type="text"
                value={formData.floor}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="15층"
              />
            </div>
            <div>
              <label htmlFor="direction" className="block text-sm font-semibold text-gray-700 mb-2">
                방향
              </label>
              <input
                id="direction"
                name="direction"
                type="text"
                value={formData.direction}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="남향"
              />
            </div>
            <div>
              <label htmlFor="buildYear" className="block text-sm font-semibold text-gray-700 mb-2">
                준공년도
              </label>
              <input
                id="buildYear"
                name="buildYear"
                type="text"
                value={formData.buildYear}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="2015"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              매물 특징
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              placeholder="예: 남향, 고층, 리모델링 완료, 한강 조망 등"
            ></textarea>
          </div>

          {/* Info Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 등록 후 정부24 연동을 통해 본인 소유 인증이 필요합니다.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/seller/listings')}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-semibold"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
