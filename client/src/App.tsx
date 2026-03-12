import { useLiveMarketWs } from "../src/shared/hooks/useLiveMarketWs";

import { useState, useEffect } from "react";
import { Header } from "../src/shared/components/Header";

import { NotificationStack } from "../src/shared/components/NotificationStack";
import { ValidateOTP } from "./pages/ValidatePage";
import { DashboardPage } from "../src/pages/DashboardPage";
import { LoadingScreen } from "./pages/LoadingScreen";
import { WatchlistScripsPage } from "./pages/WatchlistScripsPage";
import { PortfolioPage } from "../src/features/portfolio-overview/PortfolioPage";
import { FundsSummaryPage } from "./pages/FundsSummaryPage";
import { OrderBookPage } from "../src/features/order-book/OrderBookPage";
import { MarketNewsPage } from "./pages/NewsPage";
import { WatchlistPage } from "../src/features/dashboard/WatchlistPage";
import { IndicesOrderingPage } from "./pages/IndicesOrdering";
import { LoginPage } from "../src/pages/LoginPage";
import { useWebSocket } from "./shared/hooks/useWebSocket";
import { useUIStore } from "../src/store/ui.store";


// ★ NEW: connection status badge

import { WsStatusBadge } from "../src/shared/components/WsStatusBadge";

import { wsManager } from "../src/services/websocket";


// ─── Token → clientCode helper ────────────────────────────────────────────────


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


// ─── Root component ────────────────────────────────────────────────────────────


export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [clientCode, setClientCode] = useState("");
  const activeTab = useUIStore((s) => s.activeTab);


  useEffect(() => {

    const token = localStorage.getItem("bearer_token");

    if (token) {

      setIsAuthenticated(true);

      setClientCode(getClientCodeFromToken(token));

    }

  }, []);


  // ── Simulated local WebSocket (existing behaviour, unchanged)

  useWebSocket(clientCode);


  // ── ★ Live OmneNest WebSocket (only when authenticated)

  useLiveMarketWs({

    clientCode,

    extraSubscriptions: [

      { exchange: "NSE_CM", tokens: ["11377"] }, // HDFCBANK

    ],

  });


  const renderTab = () => {

    switch (activeTab) {
      case "loading": return <LoadingScreen />;
      case "login": return <LoginPage />;
      case "validate_otp": return <ValidateOTP />;
      case "dashboard": return <DashboardPage />;
      case "portfolio": return <PortfolioPage />;
      case "orderbook": return <OrderBookPage />;
      case "Watchlist": return <WatchlistPage />;
      case "watchlist-detail": return <WatchlistScripsPage />;
      case "Fund summary": return <FundsSummaryPage />;
      case "Market news": return <MarketNewsPage />;
      case "Indices": return <IndicesOrderingPage />;
      default: return <DashboardPage />;
    }

  }


  return (

    <div style={{

      display: "flex", flexDirection: "column",

      height: "100vh", overflow: "hidden",

      background: "var(--bg-void)",

    }}>

      <Header />



      <main style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {renderTab()}

      </main>


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