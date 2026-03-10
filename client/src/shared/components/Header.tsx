import { memo, useState, useEffect } from "react";
import { useMarketStore } from "../../store/market.store";
import { useUIStore } from "../../store/ui.store";
import { dashboardConfig } from "../../services/dashboard/dashboard-config";
// import { getMarketStatus } from "../../services/dashboard/market-status";

export const Header = memo(function Header() {
  const isConnected = useMarketStore((s) => s.isConnected);
  // const setConnected = useMarketStore((s) => s.setConnected);
  const tickCount   = useMarketStore((s) => s.tickCount);
  const activeTab   = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const token = useUIStore((s) => s.token);
  const [headerTab, setHeaderTab] = useState<{name: string}[]>([]); //incoming data is in an  object form and is an array of multiple objects

  useEffect(() => {
    const featuresConfig = async () => {
      try {
        const token = sessionStorage.getItem("auth-token");
        if (token) {
          const data = await dashboardConfig(token);
          // const status = await getMarketStatus(token);
          // setConnected(status.market_status[status.market_status.length - 1].marketStatus.includes("Open"));
          setHeaderTab(data.dashboard.features)
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    }
    featuresConfig();
  }, [token]) //this configures once user gets token.

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: "52px",
      background: "var(--bg-panel)",
      borderBottom: "1px solid var(--border)",
      flexShrink: 0,
      gap: "24px",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "20px",
          fontWeight: "800", color: "var(--blue)", letterSpacing: "-0.5px",
        }}>
          OmneNEST
        </span>
        <span style={{
          fontSize: "9px", color: "var(--text-muted)",
          letterSpacing: "2px", fontFamily: "var(--font-mono)",
        }}>
        </span>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: "flex", gap: "4px", flex: 1 }}>
        {headerTab.map((t) => (
          <button key={t.name} onClick={() => setActiveTab(t.name)} style={{
            background: activeTab === t.name ? "var(--bg-elevated)" : "none",
            border: activeTab === t.name ? "1px solid var(--border)" : "1px solid transparent",
            color: activeTab === t.name ? "var(--text-primary)" : "var(--text-muted)",
            borderRadius: "var(--radius)",
            padding: "5px 14px",
            fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "500",
            cursor: "pointer", letterSpacing: "0.5px",
            transition: "all 0.15s ease",
          }}>
            {t.name}
          </button>
        ))}
      </nav>

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
        {tickCount > 0 && (
          <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {tickCount.toLocaleString()} ticks
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div className={isConnected ? "pulse" : ""} style={{
            width: "7px", height: "7px", borderRadius: "50%",
            background: isConnected ? "var(--green)" : "var(--red)",
            boxShadow: isConnected ? "0 0 6px var(--green)" : "none",
          }} />
          <span style={{
            fontSize: "10px", fontWeight: "600", letterSpacing: "1px",
            color: isConnected ? "var(--green)" : "var(--red)",
            fontFamily: "var(--font-mono)",
          }}>
            {isConnected ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </div>
    </header>
  );
});
