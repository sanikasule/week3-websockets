import { indicesList } from "@/services/indices/indices-list";
import { useMarketStore, useUIStore } from "@/store";
import { useEffect, useState } from "react";

interface IndicesDetailsItem {
  indexName: string;
  exchange: string;
  indexToken: string;
  decimalPrecision: string;
  exchangeSegment: string;
  symbolName: string;
}

interface IndicesCardProps {
  indexName: string;
  exchange: string;
  exchangeSegment: string;
}

const IndicesCard: React.FC<IndicesCardProps> = ({ indexName, exchange, exchangeSegment }) => {
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
        {indexName}
      </div>
      <div
        style={{
          fontWeight: "700",
          fontSize: "16px",
          color: "var(--text-primary)",
          fontFamily: "var(--font-mono)",
        }}
      >
       {exchange} . {exchangeSegment}
      </div>
    </div>
  );
};

export function IndicesDetailsPage() {
    const token = useUIStore((s) => s.token);
    const selectedSymbol = useMarketStore((s) => s.selectedSymbol);
    const [details, setDetails] = useState<IndicesDetailsItem[]>([]);

    useEffect(() => {
        const indicesDetailsConfig = async () => {
            try {
                const token = sessionStorage.getItem("auth-token")
                if (token) {
                    const response = await indicesList(token, selectedSymbol);
                    setDetails(response.IndexDetails);
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        } 
        indicesDetailsConfig();
    }, [token, selectedSymbol]);


    return (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {details.map((d) => {
                return (
                    <IndicesCard indexName={d.indexName} exchange={d.exchange} exchangeSegment={d.exchangeSegment} />
                )
            })}
        </div>
    )
}
