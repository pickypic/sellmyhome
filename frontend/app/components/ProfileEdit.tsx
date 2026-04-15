import { useNavigate } from "react-router";
import { ArrowLeft, Camera, User } from "lucide-react";
import { useState } from "react";
import { authStorage, usersApi } from "@/api/client";
import { toast } from "sonner";

export function ProfileEdit() {
  const navigate = useNavigate();
  const { token, user: storedUser } = authStorage.get();
  const [user, setUser] = useState(storedUser);
  const [name, setName] = useState(storedUser?.name || "");
  const [phone, setPhone] = useState(storedUser?.phone || "");
  const [saving, setSaving] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await usersApi.updateProfile({ name: name.trim(), phone: phone.trim() });
      authStorage.save(token!, updatedUser);
      setUser(updatedUser);
      toast.success("프로필이 저장되었습니다.");
      navigate(-1);
    } catch (err: any) {
      toast.error(err.message || "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-1 -ml-1">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-bold text-foreground">프로필 수정</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {user.profile_image ? (
                <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-card rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">프로필 사진 변경 (준비 중)</p>
        </div>

        {/* Name / Phone Input */}
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-foreground mb-2 block">이름</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이름을 입력하세요"
              maxLength={30}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-foreground mb-2 block">전화번호</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="010-0000-0000"
              maxLength={20}
            />
          </label>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4">
          <p className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed">
            <strong className="font-semibold">프로필 정보 안내</strong><br />
            • 닉네임은 다른 사용자에게 표시되는 이름입니다.<br />
            • 프로필 사진은 선택사항이며, 설정하지 않아도 서비스 이용이 가능합니다.<br />
            • 부적절한 닉네임이나 프로필 사진은 관리자에 의해 제한될 수 있습니다.
          </p>
        </div>

        {/* Account Info */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">계정 정보</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">이메일</span>
              <span className="text-sm text-foreground">{user.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">계정 유형</span>
              <span className="text-sm text-foreground font-semibold text-blue-600">
                {user.role === "agent" ? "중개인" : "매도인"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}