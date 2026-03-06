import React, { useMemo, useState, useEffect } from "react";
import { useUIStore } from "@/store/ui.store";
import { useMarketStore } from "@/store";
import { formatPrice, formatPercent, getColor } from "@/shared/utils";
import { Sparkline } from "@/widgets/ChartContainer/Sparkline";
import { watchlistList } from "@/services/watchlist/watchlist-list";

interface WatchlistItem {
  watchlistName: string;
  watchlistId: number;
}

export function WatchlistPage() {
  // const watchlist         = useUIStore((s) => s.watchlist);
  // const removeFromWatchlist = useUIStore((s) => s.removeFromWatchlist);
  // const stocks            = useMarketStore((s) => s.stocks);
  // const priceHistory      = useMarketStore((s) => s.priceHistory);
  const setWatchlistId      = useMarketStore((s) => s.setWatchlistId);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab      = useUIStore((s) => s.setActiveTab);
  const token = useUIStore((s) => s.token);
  const [watchlistData, setWatchlistData] = useState<{userDefined: WatchlistItem[];
    predefined: WatchlistItem[];
    defaultId: number | null;}>({
    userDefined: [],
    predefined: [],
    defaultId: null,
  });

  useEffect(() => {
      const watchlistConfig = async () => {
        try {
          const token = sessionStorage.getItem("auth-token");
          if (token) {
            const data = await watchlistList(token);
            setWatchlistData({
            userDefined: data.userDefinedWatchlists || [],
            predefined: data.predefinedWatchlists || [],
            defaultId: data.defaultWatchlistId,
          })
          }
        } catch (err) {
          console.error("Failed to fetch data", err);
        }
      }
      watchlistConfig();
    }, [token]) //this configures once user gets token.

    const allWatchlists = [...watchlistData.predefined, ...watchlistData.userDefined];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "20px",
      }}>
        <div>
        <div style={{display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center"}}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "700", color: "var(--text-primary)",  margin: 0 }}>
            Your Watchlists
          </h2>

          <button onClick={() => setActiveTab("dashboard")} style={{
            background: activeTab === 'dashboard' ? "var(--bg-elevated)" : "none",
            border: activeTab === 'dashboard' ? "1px solid var(--border)" : "1px solid transparent",
            color: activeTab === 'dashboard' ? "var(--text-primary)" : "var(--text-muted)",
            borderRadius: "var(--radius)",
            padding: "5px 14px",
            fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "500",
            cursor: "pointer", letterSpacing: "0.5px",
            transition: "all 0.15s ease",
          }}>
            Back
          </button>
        </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            {allWatchlists.length} groups available
          </div>
        </div>
      </div>

      {allWatchlists.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "12px", padding: "80px 0",
          color: "var(--text-muted)", fontFamily: "var(--font-mono)",
        }}>
          <div style={{ fontSize: "32px" }}>📂</div>
          <div style={{ fontSize: "13px" }}>No watchlists found</div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "14px",
        }}>
          {allWatchlists.map((wl) => {
            const handleView = (e: React.MouseEvent, id: number) => {
              e.stopPropagation();
              setWatchlistId(id);
              setActiveTab("watchlist-detail")
            }

            const isDefault = wl.watchlistId === watchlistData.defaultId;
            
            return (
              <div key={wl.watchlistId} style={{
                background: "var(--bg-panel)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", padding: "20px",
                cursor: "pointer", transition: "border-color 0.15s, transform 0.15s",
                position: "relative"
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                onClick={() => {
                   // Logic to select this watchlist and perhaps navigate
                   console.log("Selected watchlist:", wl.watchlistId);
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "16px", color: "var(--text-primary)" }}>
                      {wl.watchlistName}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                      ID: #{wl.watchlistId}
                    </div>
                  </div>
                  
                  {isDefault && (
                    <span style={{ 
                      fontSize: "9px", 
                      background: "var(--bg-highlight)", 
                      color: "var(--text-primary)", 
                      padding: "2px 6px", 
                      borderRadius: "4px",
                      border: "1px solid var(--border)"
                    }}>
                      DEFAULT
                    </span>
                  )}
                </div>

                <div onClick={(e) => handleView(e, wl.watchlistId) } style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                   <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                     View Assets →
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
