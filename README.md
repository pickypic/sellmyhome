# 셀마이홈 (SellMyHome)

> 아파트 매도자 ↔ 공인중개사 역경매 매칭 플랫폼

---

## ⚡ 5분 시작 가이드

### 1. Supabase 설정
1. [supabase.com](https://supabase.com) → 새 프로젝트 생성
2. **SQL Editor** → `supabase/schema.sql` 전체 붙여넣기 → 실행
3. **Storage** → 버킷 2개 생성:
   - `property-images` (Public)
   - `verification-docs` (Private)
4. **Settings → API** → URL과 키 복사

### 2. 환경변수 설정
```bash
# Backend
cp backend/.env.example backend/.env
# → backend/.env 열어서 Supabase URL, SERVICE_ROLE_KEY, JWT_SECRET 입력

# Frontend
cp frontend/.env.example frontend/.env.local
# → frontend/.env.local 열어서 Supabase URL, ANON_KEY 입력
```

### 3. 실행
```bash
# 터미널 1 — Backend
cd backend
npm install
npm run start:dev
# http://localhost:3000/api/docs ← Swagger

# 터미널 2 — Frontend
cd frontend
pnpm install
pnpm dev
# http://localhost:5173
```

---

## 📁 구조

```
sellmyhome/
├── CLAUDE.md          ← Claude Code 마스터 가이드 (반드시 읽기)
├── frontend/          ← React + Vite 프로토타입
├── backend/           ← NestJS API 서버
└── supabase/
    └── schema.sql     ← DB 스키마
```

---

## 🔧 Claude Code로 개발하기

```bash
# 프로젝트 루트에서 Claude Code 실행
claude
```

Claude Code는 `CLAUDE.md`를 자동으로 읽고 프로젝트 컨텍스트를 파악합니다.

### 작업 예시
```
# 미구현 모듈 구현
"users 모듈 구현해줘 - CLAUDE.md 11번 TODO 참고"

# 프론트 API 연결
"Login.tsx를 실제 API로 연결해줘"

# 전체 기능 구현
"SellerDashboard.tsx 하드코딩 데이터를 API로 교체해줘"
```

---

## 🗺 로드맵

### Phase 1 (현재) — 기반
- [x] 프로젝트 구조 세팅
- [x] DB 스키마 (supabase/schema.sql)
- [x] Auth API (회원가입/로그인/JWT)
- [x] Properties API (매물 등록/역경매)
- [x] Bids API (입찰)
- [x] Frontend API client (src/api/client.ts)

### Phase 2 — 미구현 모듈
- [ ] Users, Transactions, Reviews, Points, Admin, Notifications
- [ ] 프론트 컴포넌트 API 연결

### Phase 3 — 외부 연동
- [ ] 카카오 소셜 로그인
- [ ] 토스페이먼츠 결제
- [ ] Firebase FCM 푸시 알림
- [ ] 공인중개사 자격 확인 API

### Phase 4 — 배포
- [ ] Railway (backend) + Vercel (frontend)
- [ ] React Native / Expo 앱 변환
