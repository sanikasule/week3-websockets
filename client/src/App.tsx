import { useWebSocket } from "../src/shared/hooks/useWebSocket";
import { Header } from "../src/shared/components/Header";
import { NotificationStack } from "../src/shared/components/NotificationStack";
import { DashboardPage } from "../src/pages/DashboardPage";
import { PortfolioPage } from "../src/features/portfolio-overview/PortfolioPage";
import { OrderBookPage } from "../src/features/order-book/OrderBookPage";
import { WatchlistPage } from "../src/features/dashboard/WatchlistPage";
import { useUIStore } from "../src/store/ui.store";
import { LoadingScreen } from "./pages/LoadingScreen";
import { LoginPage } from "./pages/LoginPage";
import { ValidateOTP } from "./pages/ValidatePage";
import { WatchlistScripsPage } from "./pages/WatchlistScripsPage";
import { FundsSummaryPage } from "./pages/FundsSummaryPage";
import { MarketNewsPage } from "./pages/NewsPage";
import { IndicesOrderingPage } from "./pages/IndicesOrdering";

export default function App() {
  // Starts WebSocket connection — runs once on mount
  useWebSocket();

  const activeTab = useUIStore((s) => s.activeTab);

  const renderTab = () => {
    switch (activeTab) {
      case "loading": return <LoadingScreen />;
      case "login": return <LoginPage />;
      case "validate_otp": return <ValidateOTP />;
      case "dashboard":  return <DashboardPage />;
      case "portfolio":  return <PortfolioPage />;
      case "orderbook":  return <OrderBookPage />;
      case "Watchlist":  return <WatchlistPage />;
      case "watchlist-detail": return <WatchlistScripsPage />;
      case "Fund summary": return <FundsSummaryPage />;
      case "Market news": return <MarketNewsPage />;
      case "Indices": return <IndicesOrderingPage />;
      default:           return <DashboardPage />;
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      background: "var(--bg-void)",
    }}>
      <Header />

      {/* Tab content */}
      <main style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {renderTab()}
      </main>

      {/* Footer */}
      <footer style={{
        padding: "4px 20px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-panel)",
        display: "flex", justifyContent: "space-between",
        fontSize: "9px", color: "var(--text-muted)",
        fontFamily: "var(--font-mono)", letterSpacing: "0.5px",
        flexShrink: 0,
      }}>
        <span>ws://localhost:8080</span>
        <span>OmneNEST · Simulated data — for learning only</span>
      </footer>

      <NotificationStack />
    </div>
  );
}
