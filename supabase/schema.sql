-- =============================================
-- 셀마이홈 (SellMyHome) Supabase 스키마
-- Supabase Dashboard → SQL Editor 에 붙여넣기
-- =============================================

-- UUID 확장
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS (사용자 - 매도자 / 중개사 / 어드민)
-- =============================================
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT,                          -- 소셜 로그인 시 NULL
  name            TEXT NOT NULL,
  phone           TEXT,
  role            TEXT NOT NULL DEFAULT 'seller' CHECK (role IN ('seller', 'agent', 'admin')),
  profile_image   TEXT,
  provider        TEXT DEFAULT 'email' CHECK (provider IN ('email', 'kakao', 'google', 'naver')),
  provider_id     TEXT,
  is_verified     BOOLEAN DEFAULT FALSE,          -- 본인 인증 완료
  is_active       BOOLEAN DEFAULT TRUE,
  fcm_token       TEXT,                          -- Firebase 푸시 토큰
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro')),
  point_balance   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. AGENT_PROFILES (중개사 추가 정보)
-- =============================================
CREATE TABLE agent_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number      TEXT UNIQUE,               -- 공인중개사 자격증 번호
  office_name         TEXT,                      -- 중개사무소명
  office_address      TEXT,
  office_phone        TEXT,
  business_reg_number TEXT,                      -- 사업자등록번호
  region_gu           TEXT,                      -- 활동 지역 (구)
  region_dong         TEXT,                      -- 활동 지역 (동)
  career_years        INTEGER DEFAULT 0,
  specialties         TEXT[],                    -- 전문 분야
  introduction        TEXT,
  avg_rating          DECIMAL(3,2) DEFAULT 0.0,
  review_count        INTEGER DEFAULT 0,
  transaction_count   INTEGER DEFAULT 0,
  is_license_verified BOOLEAN DEFAULT FALSE,     -- 자격증 인증 여부
  insurance_verified  BOOLEAN DEFAULT FALSE,     -- 공제 보험 확인
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. PROPERTIES (매물)
-- =============================================
CREATE TABLE properties (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id         UUID NOT NULL REFERENCES users(id),
  apartment_name    TEXT NOT NULL,
  address           TEXT NOT NULL,
  address_road      TEXT,                        -- 도로명 주소
  dong              TEXT,                        -- 동
  ho                TEXT,                        -- 호수 (비공개 처리)
  area              DECIMAL(8,2) NOT NULL,       -- 전용면적 (㎡)
  floor             INTEGER,
  total_floors      INTEGER,
  direction         TEXT,                        -- 향 (남향, 동향 등)
  build_year        INTEGER,
  asking_price      BIGINT NOT NULL,             -- 희망가 (원)
  description       TEXT,
  images            TEXT[],                      -- Supabase Storage URL 배열
  documents         TEXT[],                      -- 인증 서류 URL
  status            TEXT NOT NULL DEFAULT 'pending_verification'
                    CHECK (status IN (
                      'pending_verification',    -- 소유 인증 대기
                      'verified',                -- 소유 인증 완료 (경매 시작 가능)
                      'auction_open',            -- 역경매 진행 중
                      'selection_pending',       -- 경매 마감, 중개사 선택 대기
                      'no_bids',                 -- 입찰 없음 (재경매 가능)
                      'matched',                 -- 중개사 선정 완료
                      'contract_pending',        -- 계약 진행 중
                      'completed',               -- 거래 완료
                      'withdrawn'                -- 매물 취하
                    )),
  selected_agent_id UUID REFERENCES users(id),
  auction_end_at    TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. BIDS (입찰 - 역경매 핵심)
-- =============================================
CREATE TABLE bids (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id      UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id         UUID NOT NULL REFERENCES users(id),
  commission_rate  DECIMAL(4,2) NOT NULL          -- 수수료율 (%) 최저 0.3
                   CHECK (commission_rate >= 0.3 AND commission_rate <= 0.9),
  message          TEXT NOT NULL,                  -- 중개사 소개 메시지 (매도자만 열람)
  experience       TEXT,
  special_service  TEXT,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, agent_id)                   -- 매물당 중개사 1회만 입찰
);

-- =============================================
-- 5. TRANSACTIONS (거래)
-- =============================================
CREATE TABLE transactions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id       UUID NOT NULL REFERENCES properties(id),
  seller_id         UUID NOT NULL REFERENCES users(id),
  agent_id          UUID NOT NULL REFERENCES users(id),
  commission_rate   DECIMAL(4,2) NOT NULL,
  agreed_price      BIGINT,                       -- 최종 합의 가격
  status            TEXT NOT NULL DEFAULT 'contract_pending'
                    CHECK (status IN (
                      'contract_pending',         -- 계약서 작성 대기
                      'contract_signed',          -- 계약 체결
                      'balance_pending',          -- 잔금 대기
                      'registration_pending',     -- 등기 처리 중
                      'completed',                -- 거래 완료
                      'cancelled'                 -- 거래 취소
                    )),
  contract_date     DATE,
  balance_date      DATE,
  completed_at      TIMESTAMPTZ,
  memo              TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. REVIEWS (리뷰 - 거래 완료 후)
-- =============================================
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id  UUID NOT NULL REFERENCES transactions(id),
  reviewer_id     UUID NOT NULL REFERENCES users(id),   -- 매도자
  agent_id        UUID NOT NULL REFERENCES users(id),   -- 리뷰 대상 중개사
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  -- 항목별 평가
  rating_communication INTEGER CHECK (rating_communication BETWEEN 1 AND 5),
  rating_expertise     INTEGER CHECK (rating_expertise BETWEEN 1 AND 5),
  rating_schedule      INTEGER CHECK (rating_schedule BETWEEN 1 AND 5),
  rating_risk_notice   INTEGER CHECK (rating_risk_notice BETWEEN 1 AND 5),
  content         TEXT,
  is_verified     BOOLEAN DEFAULT TRUE,           -- 실거래 인증 리뷰
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(transaction_id, reviewer_id)             -- 거래당 1회만 리뷰
);

-- =============================================
-- 7. POINTS (포인트 내역)
-- =============================================
CREATE TABLE point_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id),
  amount      INTEGER NOT NULL,                   -- 양수: 충전, 음수: 사용
  type        TEXT NOT NULL CHECK (type IN (
                'purchase',                       -- 충전 (결제)
                'auction_fee',                    -- 경매 참여비 (매도자)
                'bid_fee',                        -- 입찰 비용 (중개사)
                'refund',                         -- 환불
                'bonus'                           -- 보너스
              )),
  description TEXT,
  ref_id      TEXT,                               -- 관련 결제 ID (토스)
  balance     INTEGER NOT NULL,                   -- 처리 후 잔액
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 8. NOTIFICATIONS (알림)
-- =============================================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id),
  type        TEXT NOT NULL,                      -- 'new_bid', 'bid_selected', 'auction_closed' 등
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  data        JSONB,                              -- 추가 데이터 (property_id 등)
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. ADMIN_ACTIONS (어드민 제재 기록)
-- =============================================
CREATE TABLE admin_actions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id    UUID NOT NULL REFERENCES users(id),
  target_id   UUID NOT NULL REFERENCES users(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('warning', 'suspend', 'ban', 'restore')),
  reason      TEXT NOT NULL,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 인덱스
-- =============================================
CREATE INDEX idx_properties_seller    ON properties(seller_id);
CREATE INDEX idx_properties_status    ON properties(status);
CREATE INDEX idx_properties_auction   ON properties(auction_end_at) WHERE status = 'auction_open';
CREATE INDEX idx_bids_property        ON bids(property_id);
CREATE INDEX idx_bids_agent           ON bids(agent_id);
CREATE INDEX idx_transactions_seller  ON transactions(seller_id);
CREATE INDEX idx_transactions_agent   ON transactions(agent_id);
CREATE INDEX idx_notifications_user   ON notifications(user_id, is_read);

-- =============================================
-- Row Level Security (RLS) 활성화
-- =============================================
ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties        ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids              ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews           ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;

-- NOTE: 실제 RLS 정책은 백엔드가 service_role_key로만 접근하므로
-- 클라이언트 직접 접근 시 별도 정책 추가 필요

-- =============================================
-- 트리거: updated_at 자동 갱신
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_bids_updated_at
  BEFORE UPDATE ON bids FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 트리거: 리뷰 작성 시 중개사 avg_rating 자동 갱신
-- =============================================
CREATE OR REPLACE FUNCTION update_agent_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agent_profiles
  SET
    avg_rating   = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE agent_id = NEW.agent_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE agent_id = NEW.agent_id)
  WHERE user_id = NEW.agent_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_agent_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_agent_rating();

-- =============================================
-- Supabase Storage 버킷 생성 (SQL Editor에서 실행)
-- =============================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('property-images', 'property-images', true);
-- VALUES ('verification-docs', 'verification-docs', false);  -- 비공개

-- =============================================
-- 완료 확인
-- =============================================
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
