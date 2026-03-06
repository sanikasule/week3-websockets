import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { Header } from "@/shared/components/Header";
import { NotificationStack } from "@/shared/components/NotificationStack";
import { DashboardPage } from "@/pages/DashboardPage";
import { PortfolioPage } from "@/features/portfolio-overview/PortfolioPage";
import { OrderBookPage } from "@/features/order-book/OrderBookPage";
import { WatchlistPage } from "@/features/dashboard/WatchlistPage";
import { useUIStore } from "@/store/ui.store";
import { LoadingScreen } from "./pages/LoadingScreen";
import { LoginPage } from "./pages/LoginPage";
import { ValidateOTP } from "./pages/ValidatePage";

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
        <span>Groww-915 · Simulated data — for learning only</span>
      </footer>

      <NotificationStack />
    </div>
  );
}
