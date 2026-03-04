import { useMarketStore } from "../stores/market.store";

type HeaderProps = {
    isConnected: boolean;
    latencyMs: number | null; // NEW
};

export function Header({isConnected}: HeaderProps) {
    const latencyMs = useMarketStore(s => s.latencyMs);

    // green < 50ms · gold < 150ms · red >= 150ms
    const latColor = latencyMs===null ? "#484F58"
        : latencyMs<50 ? "#00C87C"
        : latencyMs<150 ? "#FFB800" : "#FF4D4D";

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            height: "56px",
            backgroundColor: "#0d1117",
            borderBottom: "1px solid #21262d"
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px"
            }}>
                <span style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#00c87c"
                }}>
                    Groww
                </span>
                <span style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    color: "#555555"
                }}>
                    dev feed
                </span>
                {latencyMs !== null && (
                    <span style={{ fontFamily:"monospace", fontSize:11, color:latColor}}>         {latencyMs}ms
                    </span>
                )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{
                    width:           "8px",
                    height:          "8px",
                    borderRadius:    "50%",
                    backgroundColor: isConnected ? "#00C87C" : "#FF4D4D",
                }} />
                <span style={{
                    fontSize:   "11px",
                    fontFamily: "monospace",
                    color:      isConnected ? "#00C87C" : "#FF4D4D",
                }}>
                        {isConnected ? "LIVE" : "OFFLINE"}
                </span>
            </div>
        </div>
    )
}