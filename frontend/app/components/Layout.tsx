import { Outlet, Link, useLocation } from "react-router";
import { useEffect } from "react";
import { Home, FileText, Receipt, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
    location.pathname.match(/^\/agent\/transactions\/\d+$/);

  // Determine user type from path
  const isSeller = location.pathname.includes('/seller');
  const isAgent = location.pathname.includes('/agent');
  const isAdmin = location.pathname.includes('/admin');
  const userType = isSeller ? 'seller' : isAgent ? 'agent' : isAdmin ? 'admin' : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile App Header - Only show on dashboard pages */}
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
            <ThemeToggle />
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