import { useState } from "react";
import { useNavigate } from "react-router";
import { authApi, authStorage } from "@/api/client";
import { toast } from "sonner";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token, user } = await authApi.login({ email, password });
      if (user.role !== "admin") {
        toast.error("관리자 계정이 아닙니다.");
        return;
      }
      authStorage.save(access_token, user);
      navigate("/admin/dashboard");
    } catch (e: any) {
      toast.error(e.message ?? "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">S</div>
          <div>
            <div className="font-bold text-white">셀마이홈</div>
            <div className="text-xs text-gray-400">관리자 패널</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 space-y-4">
          <h2 className="text-lg font-bold text-white mb-2">관리자 로그인</h2>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          관리자 계정으로만 접근 가능합니다
        </p>
      </div>
    </div>
  );
}
