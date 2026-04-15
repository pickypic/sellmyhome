import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </button>
      </div>
    </div>
  );
}