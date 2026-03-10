import { useState, useEffect } from "react";
import { useUIStore } from "../store/ui.store";
// import { useMarketStore } from "../store/market.store";
import { indicesOrdering } from "../services/indices/indices-ordering";
// import { IndicesDetailsPage } from "./IndicesDetailsPage";

interface IndicesItem {
  indexName: string;
  exchange: string;
  indexToken: string;
  decimalPrecision: string;
  exchangeSegment: string;
  symbolName: string;
}

export function IndicesOrderingPage() {
//   const setWatchlistId      = useMarketStore((s) => s.setWatchlistId);
  // const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab      = useUIStore((s) => s.setActiveTab);
  // const setSelected = useMarketStore((s) => s.setSelected);
  const token = useUIStore((s) => s.token);
  const [indicesData, setIndicesData] = useState<{indices: IndicesItem[]}>({
    indices: [],
  });

  useEffect(() => {
      const indicesConfig = async () => {
        try {
          const token = sessionStorage.getItem("auth-token");
          if (token) {
            const data = await indicesOrdering(token);
            setIndicesData({
            indices: data.indices || [],
          })
          }
        } catch (err) {
          console.error("Failed to fetch data", err);
        }
      }
      indicesConfig();
    }, [token]) //this configures once user gets token.

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "20px",
      }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: "700", color: "var(--text-primary)",  margin: 0 }}>
            Indices
          </h2>

          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            {indicesData.indices.length} groups available
          </div>
        </div>
        <button 
          onClick={() => setActiveTab("dashboard")} 
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            borderRadius: "var(--radius)",
            padding: "8px 20px",
            fontFamily: "var(--font-mono)", 
            fontSize: "12px", 
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--text-muted)"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
        >
          BACK
        </button>
      </div>

      {indicesData.indices.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "12px", padding: "80px 0",
          color: "var(--text-muted)", fontFamily: "var(--font-mono)",
        }}>
          <div style={{ fontSize: "32px" }}>📂</div>
          <div style={{ fontSize: "13px" }}>No indices found</div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "14px",
        }}>
          {indicesData.indices.map((i) => {   
          //   const handleView = (e: React.MouseEvent, exchange: string) => {
          //     e.stopPropagation();
          //     setSelected(exchange);
          //     setActiveTab("indices-detail")
          // }       
            return (
              <div key={i.indexName} style={{
                background: "var(--bg-panel)", border: "1px solid var(--border)",
                borderRadius: "var(--radius)", padding: "20px",
                cursor: "pointer", transition: "border-color 0.15s, transform 0.15s",
                position: "relative"
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "16px", color: "var(--text-primary)" }}>
                      {i.indexName} 
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                      {i.exchange} . {i.exchangeSegment}
                    </div>
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
