import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { SellerIntro } from "./components/SellerIntro";
import { AgentIntro } from "./components/AgentIntro";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Sitemap } from "./components/Sitemap";
import { FlowView } from "./components/FlowView";
import { SellerDashboard } from "./components/SellerDashboard";
import { SellerListings } from "./components/SellerListings";
import { SellerTransactions } from "./components/SellerTransactions";
import { SellerProfile } from "./components/SellerProfile";
import { AddProperty } from "./components/AddProperty";
import { Verification } from "./components/Verification";
import { AgentDashboard } from "./components/AgentDashboard";
import { AgentListings } from "./components/AgentListings";
import { AgentBids } from "./components/AgentBids";
import { AgentProfileOwn } from "./components/AgentProfileOwn";
import { PropertyDetail } from "./components/PropertyDetail";
import { BidForm } from "./components/BidForm";
import { AgentProfile } from "./components/AgentProfile";
import { NotFound } from "./components/NotFound";
import { NotificationSettings } from "./components/NotificationSettings";
import { ProfileEdit } from "./components/ProfileEdit";
import { TermsOfService } from "./components/TermsOfService";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { ForgotPassword } from "./components/ForgotPassword";

// New imports
import { SellerProposals } from "./components/SellerProposals";
import { ProposalDetail } from "./components/ProposalDetail";
import { SellerReviews } from "./components/SellerReviews";
import { AgentTransactions } from "./components/AgentTransactions";
import { AgentReviews } from "./components/AgentReviews";
import { MyLeagues } from "./components/MyLeagues";
import { CreateLeague } from "./components/CreateLeague";
import { LeagueDetail } from "./components/LeagueDetail";
import { PointsDashboard } from "./components/PointsDashboard";
import { PurchasePoints } from "./components/PurchasePoints";
import { PointsHistory } from "./components/PointsHistory";
import { TrustCenter } from "./components/TrustCenter";
import { MarketAnalysis } from "./components/MarketAnalysis";
import { Security } from "./components/Security";
import { Subscription } from "./components/Subscription";
import { PaymentSettings } from "./components/PaymentSettings";
import { Support } from "./components/Support";
import { FAQ } from "./components/FAQ";
import { AdminShell } from "./components/admin/AdminLayout";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboardPage } from "./components/admin/AdminDashboardPage";
import { AdminUsersPage } from "./components/admin/AdminUsersPage";
import { AdminUserDetailPage } from "./components/admin/AdminUserDetailPage";
import { AdminPropertiesPage } from "./components/admin/AdminPropertiesPage";
import { AdminTransactionsPage } from "./components/admin/AdminTransactionsPage";
import { AdminPointsPage } from "./components/admin/AdminPointsPage";
import { AdminReviewsPage } from "./components/admin/AdminReviewsPage";
import { AdminVerificationsPage } from "./components/admin/AdminVerificationsPage";
import { ConnectedDevices } from "./components/ConnectedDevices";
import { DataDownload } from "./components/DataDownload";
import { AgentTransactionDetail } from "./components/AgentTransactionDetail";
import { SplashScreen } from "./components/SplashScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "splash", Component: () => <SplashScreen onComplete={() => window.history.back()} /> },
      { path: "seller-intro", Component: SellerIntro },
      { path: "agent-intro", Component: AgentIntro },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "sitemap", Component: Sitemap },
      
      // Seller routes
      { path: "seller/dashboard", Component: SellerDashboard },
      { path: "seller/listings", Component: SellerListings },
      { path: "seller/proposals", Component: SellerProposals },
      { path: "seller/proposals/:id", Component: ProposalDetail },
      { path: "seller/reviews", Component: SellerReviews },
      { path: "seller/transactions", Component: SellerTransactions },
      { path: "seller/profile", Component: SellerProfile },
      { path: "seller/add-property", Component: AddProperty },
      { path: "seller/verification", Component: Verification },
      
      // Agent routes
      { path: "agent/dashboard", Component: AgentDashboard },
      { path: "agent/listings", Component: AgentListings },
      { path: "agent/bids", Component: AgentBids },
      { path: "agent/transactions", Component: AgentTransactions },
      { path: "agent/transactions/:id", Component: AgentTransactionDetail },
      { path: "agent/reviews", Component: AgentReviews },
      { path: "agent/profile", Component: AgentProfileOwn },
      
      // League routes (Agent)
      { path: "agent/leagues", Component: MyLeagues },
      { path: "agent/leagues/create", Component: CreateLeague },
      { path: "agent/leagues/:id", Component: LeagueDetail },
      
      // Points routes (Agent)
      { path: "agent/points", Component: PointsDashboard },
      { path: "agent/points/purchase", Component: PurchasePoints },
      { path: "agent/points/history", Component: PointsHistory },

      // Points routes (Seller)
      { path: "seller/points", Component: PointsDashboard },
      { path: "seller/points/history", Component: PointsHistory },
      
      // Trust & Reports
      { path: "trust-center", Component: TrustCenter },
      { path: "market-analysis", Component: MarketAnalysis },
      
      // Settings & Info routes
      { path: "settings/notifications", Component: NotificationSettings },
      { path: "settings/profile-edit", Component: ProfileEdit },
      { path: "settings/security", Component: Security },
      { path: "settings/connected-devices", Component: ConnectedDevices },
      { path: "settings/data-download", Component: DataDownload },
      { path: "settings/subscription", Component: Subscription },
      { path: "settings/payment", Component: PaymentSettings },
      { path: "terms", Component: TermsOfService },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "forgot-password", Component: ForgotPassword },
      
      // Support routes
      { path: "support", Component: Support },
      { path: "faq", Component: FAQ },
      
      // Shared routes
      { path: "property/:id", Component: PropertyDetail },
      { path: "property/:id/bid", Component: BidForm },
      { path: "agent/:id", Component: AgentProfile },
      
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "/flow",
    Component: FlowView,
  },
  // Admin panel (standalone layout, separate from customer-facing app)
  { path: "/admin/login", Component: AdminLogin },
  {
    path: "/admin",
    Component: AdminShell,
    children: [
      { index: true, Component: AdminDashboardPage },
      { path: "dashboard", Component: AdminDashboardPage },
      { path: "users", Component: AdminUsersPage },
      { path: "users/:id", Component: AdminUserDetailPage },
      { path: "properties", Component: AdminPropertiesPage },
      { path: "transactions", Component: AdminTransactionsPage },
      { path: "points", Component: AdminPointsPage },
      { path: "reviews", Component: AdminReviewsPage },
      { path: "verifications", Component: AdminVerificationsPage },
    ],
  },
]);