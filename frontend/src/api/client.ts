// =============================================
// 셀마이홈 API 클라이언트
// 모든 컴포넌트는 여기서 import해서 사용
// =============================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

function toQuery(params?: Record<string, any>): string {
  if (!params) return '';
  const q = Object.entries(params).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  return q ? `?${q}` : '';
}

// ── 공통 fetch 래퍼 ───────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('smh_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: '서버 오류가 발생했습니다.' }));
    throw new Error(err.message || '요청 실패');
  }

  return res.json();
}

// =============================================
// AUTH
// =============================================
export const authApi = {
  register: (dto: {
    email: string; password: string; name: string; phone: string; role: 'seller' | 'agent';
  }) => request<{ access_token: string; user: User }>('/auth/register', {
    method: 'POST', body: JSON.stringify(dto),
  }),

  login: (dto: { email: string; password: string }) =>
    request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST', body: JSON.stringify(dto),
    }),

  kakaoLogin: (access_token: string) =>
    request<{ access_token: string; user: User }>('/auth/kakao', {
      method: 'POST', body: JSON.stringify({ access_token }),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST', body: JSON.stringify({ email }),
    }),

  getMe: () => request<User>('/auth/me'),
};

// =============================================
// PROPERTIES (매물)
// =============================================
export const propertiesApi = {
  create: (dto: CreatePropertyDto) =>
    request<Property>('/properties', { method: 'POST', body: JSON.stringify(dto) }),

  getMySeller: () => request<Property[]>('/properties/my/seller'),

  getOpenAuctions: () => request<Property[]>('/properties/auctions/open'),

  getOne: (id: string) => request<PropertyDetail>(`/properties/${id}`),

  startAuction: (id: string) =>
    request<Property>(`/properties/${id}/start-auction`, { method: 'PATCH' }),

  selectAgent: (propertyId: string, bidId: string) =>
    request<Transaction>(`/properties/${propertyId}/select-agent`, {
      method: 'POST', body: JSON.stringify({ bid_id: bidId }),
    }),
};

// =============================================
// BIDS (입찰)
// =============================================
export const bidsApi = {
  create: (dto: CreateBidDto) =>
    request<Bid>('/bids', { method: 'POST', body: JSON.stringify(dto) }),

  getMyBids: () => request<BidWithProperty[]>('/bids/my'),

  update: (id: string, dto: Partial<CreateBidDto>) =>
    request<Bid>(`/bids/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),

  cancel: (id: string) =>
    request<{ message: string }>(`/bids/${id}`, { method: 'DELETE' }),
};

// =============================================
// TRANSACTIONS (거래)
// =============================================
export const transactionsApi = {
  getMySeller: () => request<Transaction[]>('/transactions/my/seller'),
  getMyAgent:  () => request<Transaction[]>('/transactions/my/agent'),
  getOne:      (id: string) => request<Transaction>(`/transactions/${id}`),
  updateStatus: (id: string, status: string) =>
    request<Transaction>(`/transactions/${id}/status`, {
      method: 'PATCH', body: JSON.stringify({ status }),
    }),
};

// =============================================
// USERS (프로필)
// =============================================
export const usersApi = {
  getAgentProfile: (id: string) => request<AgentProfile>(`/users/agents/${id}`),
  updateProfile:   (dto: any) => request<User>('/users/profile', { method: 'PATCH', body: JSON.stringify(dto) }),
  uploadImage:     async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const token = localStorage.getItem('smh_token');
    const res = await fetch(`${BASE_URL}/users/profile/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    return res.json();
  },
};

// =============================================
// REVIEWS
// =============================================
export const reviewsApi = {
  create: (dto: { transaction_id: string; rating: number; content: string; [key: string]: any }) =>
    request<Review>('/reviews', { method: 'POST', body: JSON.stringify(dto) }),
  getAgentReviews: (agentId: string) => request<Review[]>(`/reviews/agent/${agentId}`),
};

// =============================================
// POINTS
// =============================================
export const pointsApi = {
  getBalance:  () => request<{ balance: number }>('/points/balance'),
  getHistory:  () => request<PointTransaction[]>('/points/history'),
  purchase:    (amount: number) =>
    request<{ payment_url: string }>('/points/purchase', {
      method: 'POST', body: JSON.stringify({ amount }),
    }),
};

// =============================================
// ADMIN
// =============================================
export const adminApi = {
  // 통계
  getStats: () => request<AdminStats>('/admin/stats'),

  // 회원 관리
  getUsers: (params?: Record<string, any>) => request<AdminListResponse<AdminUser>>('/admin/users' + toQuery(params)),
  getUser: (id: string) => request<AdminUser>(`/admin/users/${id}`),
  blockUser: (id: string, reason: string) => request<any>(`/admin/users/${id}/block`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  unblockUser: (id: string) => request<any>(`/admin/users/${id}/unblock`, { method: 'PATCH' }),
  adjustPoints: (id: string, amount: number, reason: string) =>
    request<any>(`/admin/users/${id}/points`, { method: 'POST', body: JSON.stringify({ amount, reason }) }),

  // 매물
  getProperties: (params?: Record<string, any>) => request<AdminListResponse<any>>('/admin/properties' + toQuery(params)),

  // 거래
  getTransactions: (params?: Record<string, any>) => request<AdminListResponse<any>>('/admin/transactions' + toQuery(params)),

  // 입찰
  getBids: (params?: Record<string, any>) => request<AdminListResponse<any>>('/admin/bids' + toQuery(params)),

  // 포인트/결제 내역
  getPointTransactions: (params?: Record<string, any>) => request<AdminListResponse<any>>('/admin/point-transactions' + toQuery(params)),

  // 리뷰
  getReviews: (params?: Record<string, any>) => request<AdminListResponse<any>>('/admin/reviews' + toQuery(params)),
  deleteReview: (id: string) => request<any>(`/admin/reviews/${id}`, { method: 'DELETE' }),

  // 인증 심사
  getVerifications: () => request<AdminVerifications>('/admin/verifications'),
  approveProperty: (id: string) => request<any>(`/admin/verifications/property/${id}/approve`, { method: 'PATCH' }),
  rejectProperty: (id: string, reason: string) => request<any>(`/admin/verifications/property/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  approveAgent: (id: string) => request<any>(`/admin/verifications/agent/${id}/approve`, { method: 'PATCH' }),
  rejectAgent: (id: string, reason: string) => request<any>(`/admin/verifications/agent/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  sanctionUser: (id: string, dto: { action_type: string; reason: string; expires_at?: string }) =>
    request<any>(`/admin/users/${id}/sanction`, { method: 'POST', body: JSON.stringify(dto) }),
};

// =============================================
// NOTIFICATIONS
// =============================================
export const notificationsApi = {
  getAll: () => request<{ notifications: Notification[]; unread_count: number }>('/notifications'),
  markRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request<any>('/notifications/read-all', { method: 'PATCH' }),
};

// =============================================
// UTILS: 토큰 저장/삭제
// =============================================
export const authStorage = {
  save:  (token: string, user: User) => {
    localStorage.setItem('smh_token', token);
    localStorage.setItem('smh_user', JSON.stringify(user));
  },
  get: () => ({
    token: localStorage.getItem('smh_token'),
    user:  JSON.parse(localStorage.getItem('smh_user') || 'null') as User | null,
  }),
  clear: () => {
    localStorage.removeItem('smh_token');
    localStorage.removeItem('smh_user');
  },
};

// =============================================
// TYPE DEFINITIONS
// =============================================
export interface User {
  id: string; email: string; name: string; role: 'seller' | 'agent' | 'admin';
  phone?: string; profile_image?: string; is_verified: boolean; subscription_tier: string;
}
export interface Property {
  id: string; seller_id: string; apartment_name: string; address: string;
  area: number; floor: number; asking_price: number; status: string;
  auction_end_at?: string; images?: string[]; created_at: string;
  bids?: Array<{ count: number }> | BidWithAgent[]; // getMySeller: count집계 / getOne: 실제 입찰
}
export interface Notification {
  id: string; type: string; title: string; body: string;
  data?: Record<string, any>; is_read: boolean; created_at: string;
}
export interface AdminStats {
  users: { total: number; sellers: number; agents: number; blocked: number };
  properties: { total: number; open_auctions: number; pending_verifications: number };
  transactions: { completed: number };
  revenue: { total_points_purchased: number };
}
export interface AdminUser {
  id: string; email: string; name: string; phone?: string; role: string;
  is_active: boolean; is_verified: boolean; point_balance: number;
  subscription_tier: string; created_at: string;
  agent_profile?: any; admin_actions?: any[]; point_history?: any[];
}
export interface AdminListResponse<T> { data: T[]; total: number; page: number; limit: number; }
export interface AdminVerifications {
  pending_properties: Array<{
    id: string; apartment_name: string; address: string; created_at: string;
    seller: { id: string; name: string; phone: string };
  }>;
  pending_agents: Array<{
    user_id: string; license_number: string; office_name: string;
    region: string; career_years: number; is_license_verified: boolean; created_at: string;
    user: { id: string; name: string; phone: string; email: string };
  }>;
}
export interface PropertyDetail extends Property {
  bids?: BidWithAgent[];
  my_bid?: Bid;
  seller?: Pick<User, 'id' | 'name' | 'phone'>;
}
export interface Bid {
  id: string; property_id: string; agent_id: string; commission_rate: number;
  message: string; status: string; created_at: string;
}
export interface BidWithAgent extends Bid {
  agent: Pick<User, 'id' | 'name' | 'profile_image'> & {
    avg_rating: number; review_count: number; license_number: string;
  };
}
export interface BidWithProperty extends Bid { property: Property; }
export interface Transaction {
  id: string; property_id: string; seller_id: string; agent_id: string;
  commission_rate: number; agreed_price?: number; status: string; created_at: string;
}
export interface AgentProfile {
  user_id: string; name: string; profile_image?: string; office_name?: string;
  region_gu?: string; region_dong?: string; career_years: number;
  avg_rating: number; review_count: number; transaction_count: number;
  introduction?: string; specialties?: string[];
}
export interface Review {
  id: string; agent_id: string; rating: number; content?: string; created_at: string;
}
export interface PointTransaction {
  id: string; amount: number; type: string; description: string; balance: number; created_at: string;
}
export interface CreatePropertyDto {
  apartment_name: string; address: string; area: number; floor: number;
  asking_price: number; direction?: string; build_year?: number; description?: string;
}
export interface CreateBidDto {
  property_id: string; commission_rate: number; message: string;
  experience?: string; special_service?: string;
}
