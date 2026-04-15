# 셀마이홈 (SellMyHome) — Claude Code 마스터 가이드

> 이 파일을 먼저 전부 읽고 작업을 시작하라.
> 모든 기술 결정, 네이밍, 파일 위치, 비즈니스 로직이 여기 정의되어 있다.

---

## 1. 프로젝트 개요

**셀마이홈**은 아파트 매도자와 공인중개사를 연결하는 **역경매(Reverse Auction) 매칭 플랫폼**이다.

- 매도자가 매물을 올리면 → 중개사들이 비공개로 수수료율과 서비스를 제시 → 매도자가 비교 후 선택
- 기존 "집 앞 부동산에 맡기는 관행"을 깨고 중개사를 투명하게 비교·선택하게 한다

### 3가지 사용자 역할
| 역할 | 설명 |
|---|---|
| **seller (매도자)** | 아파트 보유자. 매물 등록 → 경매 시작 → 중개사 선택 |
| **agent (중개사)** | 공인중개사. 매물 열람 → 입찰(수수료+서비스 제안) → 선정 대기 |
| **admin (어드민)** | 인증 심사, 제재, 통계 관리 |

---

## 2. 프로젝트 구조

```
sellmyhome/
├── frontend/          # React + Vite + TypeScript (피그마 메이크 프로토타입)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts        ← ⭐ 모든 API 호출 여기서
│   │   ├── app/
│   │   │   ├── components/      ← 52개 화면 컴포넌트
│   │   │   ├── routes.tsx
│   │   │   └── App.tsx
│   │   └── styles/
│   └── .env.example             ← 환경변수 예시
│
├── backend/           # NestJS + TypeScript
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── config/supabase.ts   ← Supabase 클라이언트
│   │   ├── auth/                ← ⭐ 완성됨
│   │   ├── properties/          ← ⭐ 완성됨 (역경매 핵심)
│   │   ├── bids/                ← ⭐ 완성됨
│   │   ├── users/               ← TODO
│   │   ├── transactions/        ← TODO
│   │   ├── reviews/             ← TODO
│   │   ├── points/              ← TODO
│   │   ├── admin/               ← TODO
│   │   └── notifications/       ← TODO
│   └── .env.example
│
└── supabase/
    └── schema.sql               ← ⭐ DB 스키마 전체
```

---

## 3. 기술 스택

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS 4** (다크 골드 프리미엄 테마)
- **React Router 7** (파일: `src/app/routes.tsx`)
- **shadcn/ui** + **Radix UI** (UI 컴포넌트)
- **Recharts** (차트)
- **React Hook Form** (폼)
- API 호출: `src/api/client.ts`의 함수만 사용 (fetch 직접 호출 금지)

### Backend
- **NestJS 10** + **TypeScript**
- **Supabase** (PostgreSQL DB + Storage + Realtime)
- **Passport JWT** 인증
- **@nestjs/schedule** (역경매 타이머 스케줄러)
- **Swagger** (API 문서: `/api/docs`)

### 인프라
- DB: **Supabase** (PostgreSQL)
- 파일: **Supabase Storage** (`property-images`, `verification-docs` 버킷)
- 푸시: **Firebase FCM**
- 결제: **토스페이먼츠**
- 배포: Railway (backend) + Vercel (frontend)

---

## 4. 핵심 비즈니스 로직 — 역경매 플로우

**절대 임의로 변경하지 말 것.**

```
매도자 매물 등록
  └→ status: 'pending_verification'

소유 인증 (서류 업로드 → 어드민 승인)
  └→ status: 'verified'

매도자가 경매 시작 버튼
  └→ status: 'auction_open'
  └→ auction_end_at = 지금 + 3일
  └→ 해당 지역 중개사들에게 FCM 알림

중개사들 비공개 입찰 (3일간)
  └→ bids 테이블에 commission_rate + message 저장
  └→ 중개사끼리 서로의 입찰 내용 보이지 않음 (매도자만 열람 가능)
  └→ 최저 수수료율: 0.3% (가드레일)

경매 마감 (3일 후 스케줄러 자동 실행)
  └→ 입찰 있으면: status: 'selection_pending'
  └→ 입찰 없으면: status: 'no_bids' (재경매 가능)

매도자가 중개사 선택
  └→ 선택된 bid: status: 'accepted'
  └→ 나머지 bid: status: 'rejected'
  └→ property: status: 'matched'
  └→ transactions 테이블에 거래 생성

거래 진행
  └→ 'contract_pending' → 'contract_signed' → 'balance_pending'
  └→ 'registration_pending' → 'completed'

거래 완료 후 리뷰 작성 가능 (인증 리뷰)
```

---

## 5. API 엔드포인트 전체 목록

### Auth (`/api/v1/auth`)
| Method | Path | 설명 |
|---|---|---|
| POST | `/auth/register` | 회원가입 |
| POST | `/auth/login` | 로그인 |
| POST | `/auth/kakao` | 카카오 소셜 로그인 |
| POST | `/auth/forgot-password` | 비밀번호 재설정 요청 |
| GET  | `/auth/me` | 내 정보 (JWT 필요) |

### Properties (`/api/v1/properties`)
| Method | Path | 설명 |
|---|---|---|
| POST   | `/properties` | 매물 등록 (seller) |
| GET    | `/properties/my/seller` | 내 매물 목록 (seller) |
| GET    | `/properties/auctions/open` | 역경매 오픈 매물 (agent) |
| GET    | `/properties/:id` | 매물 상세 (역할별 다른 응답) |
| PATCH  | `/properties/:id/start-auction` | 역경매 시작 (seller) |
| POST   | `/properties/:id/select-agent` | 중개사 선택 (seller) |
| PATCH  | `/properties/:id/withdraw` | 매물 취하 (seller) |

### Bids (`/api/v1/bids`)
| Method | Path | 설명 |
|---|---|---|
| POST   | `/bids` | 입찰 제출 (agent) |
| GET    | `/bids/my` | 내 입찰 목록 (agent) |
| PATCH  | `/bids/:id` | 입찰 수정 (agent) |
| DELETE | `/bids/:id` | 입찰 취소 (agent) |

### Users (`/api/v1/users`)
| Method | Path | 설명 |
|---|---|---|
| GET    | `/users/agents/:id` | 중개사 공개 프로필 조회 |
| PATCH  | `/users/profile` | 내 프로필 수정 |
| POST   | `/users/profile/image` | 프로필 이미지 업로드 |
| POST   | `/users/agent/verify` | 중개사 자격 인증 서류 제출 |

### Transactions (`/api/v1/transactions`)
| Method | Path | 설명 |
|---|---|---|
| GET    | `/transactions/my/seller` | 내 거래 (seller) |
| GET    | `/transactions/my/agent` | 내 거래 (agent) |
| GET    | `/transactions/:id` | 거래 상세 |
| PATCH  | `/transactions/:id/status` | 거래 상태 변경 |

### Reviews (`/api/v1/reviews`)
| Method | Path | 설명 |
|---|---|---|
| POST   | `/reviews` | 리뷰 작성 (거래 완료 후) |
| GET    | `/reviews/agent/:id` | 중개사 리뷰 목록 |

### Points (`/api/v1/points`)
| Method | Path | 설명 |
|---|---|---|
| GET    | `/points/balance` | 잔액 조회 |
| GET    | `/points/history` | 포인트 내역 |
| POST   | `/points/purchase` | 포인트 충전 (토스페이먼츠 결제창) |
| POST   | `/points/webhook/toss` | 토스 결제 완료 웹훅 |

### Admin (`/api/v1/admin`)
| Method | Path | 설명 |
|---|---|---|
| GET    | `/admin/verifications` | 인증 심사 대기 목록 |
| PATCH  | `/admin/verifications/:id/approve` | 인증 승인 |
| PATCH  | `/admin/verifications/:id/reject` | 인증 거절 |
| POST   | `/admin/users/:id/sanction` | 제재 처리 |
| GET    | `/admin/stats` | 통계 |

### Notifications (`/api/v1/notifications`)
| Method | Path | 설명 |
|---|---|---|
| GET    | `/notifications` | 알림 목록 |
| PATCH  | `/notifications/:id/read` | 읽음 처리 |
| PATCH  | `/notifications/read-all` | 전체 읽음 |

---

## 6. 프론트엔드 컴포넌트 ↔ API 연결 가이드

### 현재 상태
프로토타입의 모든 컴포넌트는 **하드코딩된 더미 데이터**를 사용한다.
각 컴포넌트를 실제 API로 연결하는 작업이 필요하다.

### 연결 방법
1. `src/api/client.ts`에서 해당 함수 import
2. `useState` + `useEffect`로 데이터 로드
3. `authStorage.get()`으로 현재 사용자 정보 확인
4. 로딩/에러 상태 처리

### 우선순위 순서로 연결할 컴포넌트
```
1순위 (인증):
  Login.tsx          → authApi.login()
  Signup.tsx         → authApi.register()
  ForgotPassword.tsx → authApi.forgotPassword()

2순위 (매도자 핵심):
  AddProperty.tsx      → propertiesApi.create()
  Verification.tsx     → 서류 업로드 + 어드민 심사 요청
  SellerDashboard.tsx  → propertiesApi.getMySeller()
  SellerListings.tsx   → propertiesApi.getMySeller()
  SellerProposals.tsx  → propertiesApi.getOne(id) → property.bids
  ProposalDetail.tsx   → propertiesApi.selectAgent()
  SellerTransactions.tsx → transactionsApi.getMySeller()

3순위 (중개사 핵심):
  AgentDashboard.tsx   → propertiesApi.getOpenAuctions()
  AgentListings.tsx    → propertiesApi.getOpenAuctions()
  PropertyDetail.tsx   → propertiesApi.getOne(id)
  BidForm.tsx          → bidsApi.create()
  AgentBids.tsx        → bidsApi.getMyBids()
  AgentTransactions.tsx → transactionsApi.getMyAgent()

4순위 (프로필/리뷰):
  AgentProfile.tsx     → usersApi.getAgentProfile(id)
  AgentProfileOwn.tsx  → usersApi.getAgentProfile(id)
  SellerReviews.tsx    → reviewsApi 구현 후 연결
  AgentReviews.tsx     → reviewsApi.getAgentReviews(id)

5순위 (포인트/구독/어드민):
  PointsDashboard.tsx  → pointsApi.getBalance(), pointsApi.getHistory()
  PurchasePoints.tsx   → pointsApi.purchase()
  AdminDashboard.tsx   → /admin/stats
  AdminVerifications.tsx → /admin/verifications
```

---

## 7. 데이터베이스 스키마 핵심

`supabase/schema.sql` 참고. 주요 테이블:

| 테이블 | 역할 |
|---|---|
| `users` | 모든 사용자 (seller/agent/admin) |
| `agent_profiles` | 중개사 추가 정보 (자격, 지역, 평점) |
| `properties` | 매물 (status 필드가 역경매 상태 머신) |
| `bids` | 역경매 입찰 (중개사 → 매물) |
| `transactions` | 선정 후 거래 진행 |
| `reviews` | 거래 완료 후 인증 리뷰 |
| `point_transactions` | 포인트 충전/사용 내역 |
| `notifications` | 인앱 알림 |

### Property status 머신
```
pending_verification → verified → auction_open → selection_pending → matched → completed
                                              ↘ no_bids (재경매 가능)
```

---

## 8. 환경변수

### Backend (`backend/.env`)
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=   ← 서버 전용. 절대 클라이언트 노출 금지
JWT_SECRET=
TOSS_SECRET_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env.local`)
```
VITE_API_URL=http://localhost:3000/api/v1
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=      ← anon key만 (service role key 절대 금지)
VITE_KAKAO_APP_KEY=
VITE_TOSS_CLIENT_KEY=
```

---

## 9. 로컬 개발 실행 방법

### 사전 준비
1. Supabase 프로젝트 생성 → `supabase/schema.sql` SQL Editor에 붙여넣기 실행
2. 환경변수 파일 작성 (`.env.example` → `.env` 복사 후 값 입력)

### Backend
```bash
cd backend
npm install
npm run start:dev
# → http://localhost:3000
# → Swagger: http://localhost:3000/api/docs
```

### Frontend
```bash
cd frontend
pnpm install   # 또는 npm install
pnpm dev       # 또는 npm run dev
# → http://localhost:5173
```

---

## 10. 코딩 규칙

### 네이밍
- DB 컬럼: `snake_case`
- TypeScript: `camelCase` (변수/함수), `PascalCase` (클래스/인터페이스)
- API 경로: `kebab-case`
- 파일명: `PascalCase.tsx` (컴포넌트), `camelCase.ts` (유틸)

### 에러 처리
- Backend: NestJS 표준 예외 (`NotFoundException`, `ForbiddenException` 등) 사용
- Frontend: try/catch + toast 알림 (sonner 사용)

### 보안 규칙
- `SUPABASE_SERVICE_ROLE_KEY`는 backend에서만 사용
- JWT는 `Authorization: Bearer <token>` 헤더로 전송
- 입찰 내용(commission_rate, message)은 해당 매도자와 해당 중개사 본인만 열람 가능
- 중개사는 같은 매물에 다른 중개사 입찰 내용 열람 불가

### 파일 업로드
- 매물 사진: Supabase Storage `property-images` 버킷 (public)
- 소유 인증 서류: Supabase Storage `verification-docs` 버킷 (private, 어드민만 접근)

---

## 11. TODO — 미구현 모듈

Claude Code가 순서대로 구현해야 할 목록:

### Backend
- [ ] `users/` — 프로필 CRUD, 중개사 공개 프로필, 자격 인증 서류 제출
- [ ] `transactions/` — 거래 단계 관리, 상태 변경 알림
- [ ] `reviews/` — 리뷰 작성/조회, avg_rating 트리거 확인
- [ ] `points/` — 포인트 잔액/내역, 토스페이먼츠 결제 연동, 웹훅
- [ ] `admin/` — 인증 심사(property/agent), 제재, 통계 API
- [ ] `notifications/` — Firebase FCM 발송, 인앱 알림 CRUD
- [ ] 파일 업로드 엔드포인트 (Supabase Storage signed URL)

### Frontend
- [ ] 모든 컴포넌트의 하드코딩 더미 데이터를 API 호출로 교체 (6번 섹션 순서 참고)
- [ ] React Query 또는 SWR 도입 (캐싱/로딩 상태 관리)
- [ ] 카카오 로그인 SDK 연동 (`VITE_KAKAO_APP_KEY`)
- [ ] 토스페이먼츠 결제창 연동 (`VITE_TOSS_CLIENT_KEY`)
- [ ] 역경매 카운트다운 타이머 컴포넌트
- [ ] 파일 업로드 UI (매물 사진, 인증 서류)

### 인프라
- [ ] Railway에 backend 배포
- [ ] Vercel에 frontend 배포
- [ ] Firebase 프로젝트 생성 및 FCM 설정
- [ ] 토스페이먼츠 상점 등록

---

## 12. 자주 하는 실수 — 하지 말 것

1. **fetch를 컴포넌트에서 직접 호출** → 반드시 `src/api/client.ts` 함수 사용
2. **service role key를 프론트에 노출** → 절대 안 됨
3. **비즈니스 로직을 프론트에서 처리** → 역경매 상태 변경은 항상 백엔드에서
4. **입찰 내용 권한 없이 노출** → 중개사는 자신의 입찰만, 매도자는 자기 매물 입찰만
5. **더미 데이터를 그냥 남겨두기** → 컴포넌트 연결 시 더미 데이터 전부 제거
6. **DB 스키마 임의 수정** → `supabase/schema.sql` 수정 후 마이그레이션 문서에 기록
