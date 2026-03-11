import { useState, useEffect } from "react";
import { useWebSocket } from "../src/shared/hooks/useWebSocket";
import { useLiveMarketWs } from "../src/shared/hooks/useLiveMarketWs";
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
import { WsStatusBadge } from "../src/shared/components/WsStatusBadge";

import { wsManager } from "../src/services/websocket";

function getClientCodeFromToken(token: string | null): string {

if (!token) return "";

try {

// JWT payload is the second segment, base64-url encoded

const payload = JSON.parse(atob(token.split(".")[1]));

// OmneNest JWTs carry "clientCode" in the payload

return (payload.clientCode ?? payload.sub ?? "") as string;

} catch {

// Fallback: if we can't parse the JWT, use a stored value

return localStorage.getItem("client_code") ?? "";

}

}

export default function App() {
  const [clientCode, setClientCode] = useState("");

  useEffect(() => {

const token = sessionStorage.getItem("auth_token");

if (token) {

setClientCode(getClientCodeFromToken(token));

}

}, []);
  // Starts WebSocket connection — runs once on mount
  useWebSocket(clientCode);

  useLiveMarketWs({

clientCode,

extraSubscriptions: [

{ exchange: "NSE_CM", tokens: ["11377"] }, // HDFCBANK

],

});

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

display: "flex", justifyContent: "space-between", alignItems: "center",

fontSize: "9px", color: "var(--text-muted)",

fontFamily: "var(--font-mono)", letterSpacing: "0.5px",

flexShrink: 0,

}}>

{/* Left: simulated server info */}

<span>ws://localhost:8080 · Simulated data — for learning only</span>


{/* Right: ★ live WebSocket status */}

<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

<span>wss://preprodapisix.omnenest.com · Live</span>

<WsStatusBadge

showRetry

onRetry={() => wsManager.connect(clientCode)}

/>

</div>

</footer>

      <NotificationStack />
    </div>
  );
}
