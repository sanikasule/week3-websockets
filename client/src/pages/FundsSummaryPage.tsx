import React, { useMemo, useState, useEffect } from "react";
import { useUIStore } from "../store/ui.store";
import { rmsLimit } from "../services/funds-summary/rms-limit";

interface MarginItem{
    displayLabel: string;
    value: number;
}

interface FundsData {
  marginAvailable: MarginItem[];
  marginUsed: MarginItem[];
}

interface FundCardProps {
  label: string;
  value: number;
  isUsed: boolean;
}

const FundCard: React.FC<FundCardProps> = ({ label, value, isUsed }) => {
  return (
    <div
      style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        transition: "all 0.15s ease",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontFamily: "var(--font-mono)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontWeight: "700",
          fontSize: "16px",
          color: isUsed && value > 0 ? "#ff4d4f" : "var(--text-primary)",
          fontFamily: "var(--font-mono)",
        }}
      >
        ₹{value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export function FundsSummaryPage() {
  // const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const token = useUIStore((s) => s.token);

  const [fundsData, setFundsdata] = useState<FundsData>({
    marginAvailable: [],
    marginUsed: [],
  });

  const netBalance = useMemo(() => {
    const available = fundsData.marginAvailable.reduce((acc, curr) => acc + curr.value, 0);
    const used = fundsData.marginUsed.reduce((acc, curr) => acc + curr.value, 0);
    return available - used;
  }, [fundsData]);

  useEffect(() => {
    const fundsConfig = async () => {
      try {
        const authToken = token || sessionStorage.getItem("auth-token");
        if (authToken) {
          const data = await rmsLimit(authToken);
          const rawData = Array.isArray(data) ? data[0] : data;
          
          setFundsdata({
            marginAvailable: rawData.marginAvailable || [],
            marginUsed: rawData.marginUsed || [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch RMS limits:", err);
      }
    };
    fundsConfig();
  }, [token]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px", background: "var(--bg-main)" }}>
      
      {/* HEADER SECTION */}
      <div style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "flex-start",
        marginBottom: "40px",
      }}>
        <div>
          <h2 style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "13px", 
            fontWeight: "500", 
            color: "var(--text-muted)", 
            margin: "0 0 8px 0", 
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            Available Margin
          </h2>
          <div style={{ 
            fontSize: "36px", 
            fontWeight: "800", 
            color: "var(--text-primary)", 
            fontFamily: "var(--font-mono)",
            letterSpacing: "-1px"
          }}>
            ₹{netBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

      {/* DATA SECTIONS */}
      {fundsData.marginAvailable.length === 0 && fundsData.marginUsed.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "100px 0",
          color: "var(--text-muted)", fontFamily: "var(--font-mono)",
        }}>
          <div style={{ fontSize: "14px" }}>No funds records found</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          
          {/* SECTION 1: MARGIN AVAILABLE */}
          <div>
            <h3 style={{ 
              fontSize: "13px", 
              color: "var(--brand-success, #22c55e)", 
              marginBottom: "16px", 
              textTransform: "uppercase",
              fontWeight: "600"
            }}>
              Margin Available
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}>
              {fundsData.marginAvailable.map((f, i) => (
                <FundCard key={`avail-${i}`} label={f.displayLabel} value={f.value} isUsed={false} />
              ))}
            </div>
          </div>

          {/* SECTION 2: MARGIN USED */}
          <div>
            <h3 style={{ 
              fontSize: "13px", 
              color: "var(--brand-danger, #ef4444)", 
              marginBottom: "16px", 
              textTransform: "uppercase",
              fontWeight: "600"
            }}>
              Margin Used
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}>
              {fundsData.marginUsed.map((f, i) => (
                <FundCard key={`used-${i}`} label={f.displayLabel} value={f.value} isUsed={true} />
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}