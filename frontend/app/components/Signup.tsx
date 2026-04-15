import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { authApi, authStorage } from "@/api/client";

export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") as "seller" | "agent" | null;

  const [userType, setUserType] = useState<"seller" | "agent">(initialType || "seller");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < 8) {
      toast.error("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const { access_token, user } = await authApi.register({
        email, password, name, phone, role: userType,
      });
      authStorage.save(access_token, user);
      toast.success("회원가입이 완료되었습니다!");
      if (user.role === "seller") navigate("/seller/dashboard");
      else navigate("/agent/dashboard");
    } catch (err: any) {
      toast.error(err.message || "회원가입에 실패했습니다.");
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
        <h1 className="text-base font-semibold text-gray-900 ml-2">회원가입</h1>
      </div>

      <div className="px-5 pt-6 pb-24">
        {/* User Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            회원 유형 선택
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserType("seller")}
              className={`py-4 px-4 rounded-lg font-medium transition-colors ${
                userType === "seller" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              <div className="font-semibold mb-1">매도인</div>
              <div className="text-xs opacity-90">매물 등록</div>
            </button>
            <button
              type="button"
              onClick={() => setUserType("agent")}
              className={`py-4 px-4 rounded-lg font-medium transition-colors ${
                userType === "agent" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              <div className="font-semibold mb-1">중개인</div>
              <div className="text-xs opacity-90">수임 희망 등록</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              이름 {userType === "agent" && "(대표자명)"}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="홍길동"
            />
          </div>

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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              휴대폰 번호
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="010-0000-0000"
            />
          </div>

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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="8자 이상"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="비밀번호 재입력"
            />
          </div>

          {/* Terms */}
          <div className="space-y-3 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-700">[필수] 이용약관에 동의합니다</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600" />
              <span className="text-sm text-gray-700">[필수] 개인정보 처리방침에 동의합니다</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg font-semibold text-white mt-6 disabled:opacity-60 ${
              userType === "seller" ? "bg-blue-600" : "bg-green-600"
            }`}
          >
            {loading ? "가입 중..." : "회원가입 완료"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-blue-600 font-semibold">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
