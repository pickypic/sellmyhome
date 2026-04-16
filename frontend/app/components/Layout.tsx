import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Home, FileText, Receipt, User, Bell, X, Check, CheckCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { notificationsApi, authStorage } from "@/api/client";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = authStorage.get();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Hide bottom nav on auth pages and certain pages
  const hideBottomNav = [
    '/',
    '/login',
    '/signup',
    '/seller/add-property',
    '/seller/verification',
    '/agent/leagues/create',
  ].includes(location.pathname) ||
    location.pathname.includes('/property/') ||
    location.pathname.startsWith('/settings/') ||
    location.pathname.startsWith('/agent/leagues/') ||
    location.pathname.startsWith('/agent/points/') ||
    location.pathname.startsWith('/seller/points/') ||
    location.pathname.match(/^\/agent\/transactions\/\d+$/);

  // Determine user type from path
  const isSeller = location.pathname.includes('/seller');
  const isAgent = location.pathname.includes('/agent');
  const isAdmin = location.pathname.includes('/admin');
  const userType = isSeller ? 'seller' : isAgent ? 'agent' : isAdmin ? 'admin' : null;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close notification panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showNotifications]);

  // Fetch notifications when logged in and on dashboard-visible pages
  useEffect(() => {
    if (!token || hideBottomNav) return;
    notificationsApi.getAll()
      .then((data) => {
        if (data) {
          setNotifications(data.notifications ?? []);
          setUnreadCount(data.unread_count ?? 0);
        }
      })
      .catch(() => {/* 알림 로드 실패 무시 */});
  }, [location.pathname, token]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {/* 무시 */}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {/* 무시 */}
  };

  // 알림 아이콘 색상 (타입별)
  const getNotifColor = (type: string) => {
    if (type?.includes('point')) return 'text-amber-500 bg-amber-50';
    if (type?.includes('bid')) return 'text-blue-500 bg-blue-50';
    if (type?.includes('match') || type?.includes('select')) return 'text-green-500 bg-green-50';
    if (type?.includes('auction')) return 'text-purple-500 bg-purple-50';
    return 'text-gray-500 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile App Header */}
      {!hideBottomNav && (
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">셀마이홈</h1>
              {userType && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {userType === 'seller' ? '매도인' : userType === 'agent' ? '중개인' : '관리자'}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* 알림 벨 */}
              {token && userType && (
                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => setShowNotifications((v) => !v)}
                    className="relative p-2 rounded-lg hover:bg-accent"
                  >
                    <Bell className="w-5 h-5 text-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* 알림 드롭다운 */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                      {/* 헤더 */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <span className="font-bold text-foreground">알림</span>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              className="text-xs text-blue-600 flex items-center gap-1"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              모두 읽음
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="p-1 rounded hover:bg-accent"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>

                      {/* 목록 */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-10 text-center text-muted-foreground text-sm">
                            새 알림이 없습니다
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              className={`flex gap-3 px-4 py-3 border-b border-border last:border-0 cursor-pointer transition-colors ${
                                n.is_read ? 'bg-card' : 'bg-blue-50/50 dark:bg-blue-950/20'
                              }`}
                              onClick={() => !n.is_read && handleMarkRead(n.id)}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${getNotifColor(n.type)}`}>
                                {n.type?.includes('point') ? '💰' :
                                 n.type?.includes('bid') ? '📋' :
                                 n.type?.includes('match') ? '🎉' :
                                 n.type?.includes('auction') ? '🔔' : '📌'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-foreground leading-snug">
                                  {n.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                  {n.body}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {n.created_at?.slice(0, 10)}
                                </div>
                              </div>
                              {!n.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}

      {/* Main Content with bottom padding for tab bar */}
      <main className={hideBottomNav ? '' : 'pb-20'}>
        <Outlet />
      </main>

      {/* Bottom Tab Navigation - Toss Style */}
      {!hideBottomNav && userType && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20 safe-area-inset-bottom">
          <div className="grid grid-cols-4 h-16">
            <Link
              to={userType === 'seller' ? '/seller/dashboard' : userType === 'agent' ? '/agent/dashboard' : '/admin/dashboard'}
              className={`flex flex-col items-center justify-center gap-1 ${
                location.pathname.includes('dashboard')
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">홈</span>
            </Link>

            <Link
              to={userType === 'seller' ? '/seller/listings' : userType === 'agent' ? '/agent/listings' : '/admin/listings'}
              className={`flex flex-col items-center justify-center gap-1 ${
                location.pathname.includes('listings')
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <FileText className="w-6 h-6" />
              <span className="text-xs font-medium">
                {userType === 'seller' ? '내 매물' : '매물'}
              </span>
            </Link>

            <Link
              to={userType === 'seller' ? '/seller/transactions' : userType === 'agent' ? '/agent/bids' : '/admin/transactions'}
              className={`flex flex-col items-center justify-center gap-1 ${
                (location.pathname.includes('transactions') || location.pathname.includes('bids'))
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <Receipt className="w-6 h-6" />
              <span className="text-xs font-medium">
                {userType === 'seller' ? '거래' : '지원'}
              </span>
            </Link>

            <Link
              to={userType === 'seller' ? '/seller/profile' : userType === 'agent' ? '/agent/profile' : '/admin/profile'}
              className={`flex flex-col items-center justify-center gap-1 ${
                location.pathname.includes('profile')
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">전체</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
