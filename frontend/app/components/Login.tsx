import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { authApi, authStorage } from "@/api/client";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token, user } = await authApi.login({ email, password });
      authStorage.save(access_token, user);
      if (user.role === "seller") navigate("/seller/dashboard");
      else if (user.role === "agent") navigate("/agent/dashboard");
      else {
        authStorage.clear();
        toast.error("관리자 계정은 이 페이지에서 로그인할 수 없습니다.");
      }
    } catch (err: any) {
      toast.error(err.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <Link to="/" className="p-2 -ml-2 active:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-base font-semibold text-gray-900 ml-2">로그인</h1>
      </div>

      <div className="px-5 pt-8 pb-8">
        {/* Logo */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900">셀마이홈</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="••••••••"
            />
            <div className="text-right mt-2">
              <Link to="/forgot-password" className="text-sm text-blue-600">
                비밀번호 찾기
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold active:bg-blue-700 transition-colors mt-6 disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social Login (placeholder) */}
        <div className="space-y-2">
          <button
            className="w-full py-3 bg-yellow-400 text-gray-900 rounded-lg font-medium flex items-center justify-center gap-2"
            onClick={() => toast.info("카카오 로그인은 준비 중입니다.")}
          >
            카카오로 시작하기
          </button>
          <button
            className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2"
            onClick={() => toast.info("네이버 로그인은 준비 중입니다.")}
          >
            네이버로 시작하기
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
