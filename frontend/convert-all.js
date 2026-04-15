#!/usr/bin/env node

/**
 * 전체 프로젝트 일괄 변환 스크립트
 * 사용법: node convert-all.js
 */

const fs = require('fs');
const path = require('path');
const { processFile } = require('./convert-to-rn');

const SOURCE_DIR = path.join(__dirname, 'src/app/components');
const OUTPUT_DIR = path.join(__dirname, 'react-native-output');

// Expo Router 구조에 맞게 파일 분류
const routeMapping = {
  // 인증 관련
  'Login.tsx': '(auth)/login.tsx',
  'Signup.tsx': '(auth)/signup.tsx',
  'ForgotPassword.tsx': '(auth)/forgot-password.tsx',

  // 메인 화면
  'Home.tsx': 'index.tsx',
  'Sitemap.tsx': 'sitemap.tsx',
  'SplashScreen.tsx': 'splash.tsx',

  // 매도인 (seller)
  'SellerDashboard.tsx': '(seller)/dashboard.tsx',
  'SellerListings.tsx': '(seller)/listings.tsx',
  'SellerProposals.tsx': '(seller)/proposals.tsx',
  'SellerTransactions.tsx': '(seller)/transactions.tsx',
  'SellerProfile.tsx': '(seller)/profile.tsx',
  'SellerReviews.tsx': '(seller)/reviews.tsx',
  'AddProperty.tsx': '(seller)/add-property.tsx',
  'Verification.tsx': '(seller)/verification.tsx',

  // 중개인 (agent)
  'AgentDashboard.tsx': '(agent)/dashboard.tsx',
  'AgentListings.tsx': '(agent)/listings.tsx',
  'AgentBids.tsx': '(agent)/bids.tsx',
  'AgentTransactions.tsx': '(agent)/transactions.tsx',
  'AgentTransactionDetail.tsx': '(agent)/transaction-detail.tsx',
  'AgentReviews.tsx': '(agent)/reviews.tsx',
  'AgentProfileOwn.tsx': '(agent)/profile.tsx',
  'AgentProfile.tsx': '(agent)/agent-profile.tsx',

  // 리그 (agent)
  'MyLeagues.tsx': '(agent)/leagues/index.tsx',
  'CreateLeague.tsx': '(agent)/leagues/create.tsx',
  'LeagueDetail.tsx': '(agent)/leagues/[id].tsx',

  // 포인트 (agent)
  'PointsDashboard.tsx': '(agent)/points/index.tsx',
  'PurchasePoints.tsx': '(agent)/points/purchase.tsx',
  'PointsHistory.tsx': '(agent)/points/history.tsx',

  // 매물 상세
  'PropertyDetail.tsx': 'property/[id].tsx',
  'BidForm.tsx': 'property/[id]/bid.tsx',

  // 설정
  'NotificationSettings.tsx': 'settings/notifications.tsx',
  'ProfileEdit.tsx': 'settings/profile-edit.tsx',
  'Security.tsx': 'settings/security.tsx',
  'ConnectedDevices.tsx': 'settings/connected-devices.tsx',
  'DataDownload.tsx': 'settings/data-download.tsx',
  'Subscription.tsx': 'settings/subscription.tsx',
  'PaymentSettings.tsx': 'settings/payment.tsx',

  // 정보 페이지
  'TermsOfService.tsx': 'info/terms.tsx',
  'PrivacyPolicy.tsx': 'info/privacy.tsx',
  'FAQ.tsx': 'info/faq.tsx',
  'Support.tsx': 'info/support.tsx',

  // 신뢰 & 분석
  'TrustCenter.tsx': 'trust/index.tsx',
  'MarketAnalysis.tsx': 'market-analysis.tsx',

  // 관리자
  'AdminDashboard.tsx': '(admin)/dashboard.tsx',
  'AdminVerifications.tsx': '(admin)/verifications.tsx',
  'AdminDisputes.tsx': '(admin)/disputes.tsx',

  // 인트로
  'SellerIntro.tsx': 'intro/seller.tsx',
  'AgentIntro.tsx': 'intro/agent.tsx',

  // 기타
  'NotFound.tsx': '+not-found.tsx',
};

// 공통 컴포넌트 (components 폴더에 그대로)
const sharedComponents = [
  'Layout.tsx',
  'ProposalDetail.tsx',
  'FlowView.tsx',
];

function getAllFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    console.error(`❌ 디렉토리를 찾을 수 없습니다: ${dir}`);
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function convertAll() {
  console.log('🚀 셀마홈 React → React Native 전체 변환 시작\n');

  // 출력 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // app 폴더 구조 생성
  const appDir = path.join(OUTPUT_DIR, 'app');
  fs.mkdirSync(appDir, { recursive: true });
  fs.mkdirSync(path.join(appDir, 'components'), { recursive: true });

  // 모든 파일 가져오기
  const files = getAllFiles(SOURCE_DIR);
  console.log(`📁 총 ${files.length}개 파일 발견\n`);

  let convertedCount = 0;
  let errorCount = 0;

  // 파일별 변환
  files.forEach((filePath, index) => {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(SOURCE_DIR, filePath);

    console.log(`[${index + 1}/${files.length}] ${fileName}`);

    try {
      let outputPath;

      // 라우트 매핑 확인
      if (routeMapping[fileName]) {
        outputPath = path.join(appDir, routeMapping[fileName]);
      }
      // 공통 컴포넌트
      else if (sharedComponents.includes(fileName)) {
        outputPath = path.join(appDir, 'components', fileName);
      }
      // UI 컴포넌트 (figma, ui 폴더)
      else if (relativePath.includes('figma') || relativePath.includes('ui')) {
        outputPath = path.join(appDir, 'components', relativePath);
      }
      // 기타 컴포넌트
      else {
        outputPath = path.join(appDir, 'components', 'screens', fileName);
      }

      // 변환 실행
      processFile(filePath, outputPath);
      convertedCount++;
      console.log('');

    } catch (error) {
      console.error(`  ❌ 변환 실패: ${error.message}`);
      errorCount++;
    }
  });

  // _layout.tsx 생성 (루트 레이아웃)
  createRootLayout(appDir);

  // 요약
  console.log('═'.repeat(60));
  console.log(`✅ 변환 완료: ${convertedCount}개`);
  console.log(`❌ 변환 실패: ${errorCount}개`);
  console.log(`📂 출력 위치: ${OUTPUT_DIR}`);
  console.log('═'.repeat(60));
  console.log('');
  console.log('📝 다음 단계:');
  console.log('1. Expo 프로젝트 생성 (가이드 참조)');
  console.log('2. 변환된 파일을 Expo 프로젝트로 복사');
  console.log('3. 각 파일의 TODO 주석 확인 및 수동 수정');
  console.log('4. 테스트 및 디버깅');
}

function createRootLayout(appDir) {
  const layoutCode = `/**
 * Root Layout - Expo Router
 * 전체 앱의 레이아웃 설정
 */

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../contexts/AuthContext';

// 스플래시 화면 자동 숨김 방지
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // 앱 준비 완료 후 스플래시 숨김
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);
  }, []);

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0A0E27',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: '뒤로',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: '홈'
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(seller)"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(agent)"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="(admin)"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="property/[id]"
          options={{
            title: '매물 상세',
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: '설정'
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
`;

  const layoutPath = path.join(appDir, '_layout.tsx');
  fs.writeFileSync(layoutPath, layoutCode, 'utf-8');
  console.log(`✅ 루트 레이아웃 생성: ${layoutPath}\n`);

  // AuthContext 생성
  createAuthContext(path.join(OUTPUT_DIR, 'contexts'));
}

function createAuthContext(contextsDir) {
  if (!fs.existsSync(contextsDir)) {
    fs.mkdirSync(contextsDir, { recursive: true });
  }

  const authCode = `/**
 * 인증 컨텍스트
 * 전역 로그인 상태 관리
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

type UserRole = 'seller' | 'agent' | 'admin';

type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  verified?: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userStr = await SecureStore.getItemAsync('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('사용자 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('user');
      setUser(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    try {
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다');
  }
  return context;
};
`;

  const authPath = path.join(contextsDir, 'AuthContext.tsx');
  fs.writeFileSync(authPath, authCode, 'utf-8');
  console.log(`✅ AuthContext 생성: ${authPath}\n`);
}

// 실행
if (require.main === module) {
  convertAll();
}

module.exports = { convertAll };
