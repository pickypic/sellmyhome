import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 2.5초 후 페이드아웃 시작
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // 3초 후 완전히 제거
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Dark Navy Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3a] via-[#252b47] to-[#1a1f3a]">
        {/* Subtle Blue-Purple Accent Gradients */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            SellMyHome
          </h1>
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent mt-4 animate-shimmer"></div>
        </div>

        {/* Tagline */}
        <p className="text-blue-200 text-sm tracking-wide mb-12 animate-fadeIn animation-delay-300">
          프리미엄 부동산 중개 플랫폼
        </p>

        {/* Loading Indicator */}
        <div className="flex gap-2 animate-fadeIn animation-delay-500">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-0"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-150"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-300"></div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animation-delay-0 {
          animation-delay: 0ms;
        }

        .animation-delay-150 {
          animation-delay: 150ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
}