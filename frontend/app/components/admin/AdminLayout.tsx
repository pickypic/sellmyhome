import { Link, useLocation, useNavigate, Outlet, Navigate } from "react-router";
import {
  LayoutDashboard, Users, Home, ArrowLeftRight,
  Coins, Star, Shield, LogOut, Menu, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { authStorage } from "@/api/client";

const NAV = [
  { to: "/admin/dashboard",      icon: LayoutDashboard, label: "대시보드" },
  { to: "/admin/users",          icon: Users,           label: "회원 관리" },
  { to: "/admin/properties",     icon: Home,            label: "매물 관리" },
  { to: "/admin/transactions",   icon: ArrowLeftRight,  label: "거래 관리" },
  { to: "/admin/points",         icon: Coins,           label: "포인트/결제" },
  { to: "/admin/reviews",        icon: Star,            label: "리뷰 관리" },
  { to: "/admin/verifications",  icon: Shield,          label: "인증 심사" },
];

/** Route-level wrapper: guards admin access and renders <Outlet /> */
export function AdminShell() {
  const { user } = authStorage.get();
  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout><Outlet /></AdminLayout>;
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = authStorage.get();

  const handleLogout = () => {
    authStorage.clear();
    navigate("/login");
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-gray-900 text-white w-64 flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
          <div>
            <div className="font-bold text-sm">셀마이홈</div>
            <div className="text-xs text-gray-400">관리자 패널</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.name ?? "관리자"}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <button className="md:hidden p-1" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <span className="text-sm text-gray-500">
              {NAV.find(n => location.pathname.startsWith(n.to))?.label ?? "관리자"}
            </span>
          </div>
          <span className="text-xs text-gray-400 bg-red-50 text-red-600 px-2 py-1 rounded font-semibold">ADMIN</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
