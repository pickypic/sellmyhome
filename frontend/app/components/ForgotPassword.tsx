import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/client";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
          <button onClick={handleBack} className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-base font-semibold text-gray-900 ml-2">비밀번호 찾기</h1>
        </div>

        <div className="px-5 py-20 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            이메일을 확인하세요
          </h2>
          
          <p className="text-gray-600 mb-2">
            비밀번호 재설정 링크를 발송했습니다.
          </p>
          
          <p className="text-sm text-gray-500 mb-8">
            {email}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong className="font-semibold">안내사항</strong><br />
              • 이메일이 도착하지 않은 경우 스팸 메일함을 확인해주세요.<br />
              • 링크는 발송 후 24시간 동안 유효합니다.<br />
              • 이메일이 오지 않은 경우 다시 시도해주세요.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full py-3 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700 transition-colors"
            >
              로그인으로 돌아가기
            </Link>
            
            <button
              onClick={() => setIsSubmitted(false)}
              className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold active:bg-gray-200 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <button onClick={handleBack} className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-base font-semibold text-gray-900 ml-2">비밀번호 찾기</h1>
      </div>

      <div className="px-5 pt-8 pb-8">
        {/* Logo & Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">비밀번호를 잊으셨나요?</h2>
          <p className="text-gray-600">
            가입하신 이메일 주소를 입력하시면<br />
            비밀번호 재설정 링크를 보내드립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              이메일 주소
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="example@email.com"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? "발송 중..." : "재설정 링크 보내기"}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="font-semibold">계정에 문제가 있으신가요?</strong><br />
            <Link to="/support" className="text-blue-600">
              고객지원 센터
            </Link>
            에서 도움을 받으실 수 있습니다.
          </p>
        </div>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            비밀번호가 기억나셨나요?{' '}
            <Link to="/login" className="text-blue-600 font-semibold">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
