import { useNavigate } from "react-router";
import { ArrowLeft, Camera, User } from "lucide-react";
import { useState } from "react";

export function ProfileEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    // 기본 사용자 데이터 생성
    const userType = localStorage.getItem("userType");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      return {
        nickname: "사용자",
        email: "user@example.com",
        userType: userType || "seller",
        joinDate: "2025.01.15",
        profileImage: ""
      };
    }
    return null;
  });
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const updatedUser = {
      ...user,
      nickname: nickname.trim(),
      profileImage: profileImage,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    alert("프로필이 저장되었습니다.");
    navigate(-1);
  };

  if (!user) {
    return null;
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
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-card rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg">
              <Camera className="w-4 h-4 text-foreground" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">프로필 사진 변경</p>
        </div>

        {/* Nickname Input */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <label className="block mb-3">
            <span className="text-sm font-semibold text-foreground mb-2 block">닉네임</span>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="닉네임을 입력하세요"
              maxLength={20}
            />
          </label>
          <p className="text-xs text-muted-foreground mt-2">
            {nickname.length} / 20자
          </p>
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
              <span className="text-sm text-foreground">{user.email || "user@example.com"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">가입일</span>
              <span className="text-sm text-foreground">{user.joinDate || "2025.01.15"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">계정 유형</span>
              <span className="text-sm text-foreground font-semibold text-blue-600">
                {user.userType === "agent" ? "중개인" : "매도인"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}