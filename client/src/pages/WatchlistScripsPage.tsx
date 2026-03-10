import { watchlistListScripList } from "../services/watchlist/watchlist-scrips-list";
import { useMarketStore, useUIStore } from "../store";
import { useEffect, useState } from "react";
import { StockTable } from "../features/dashboard/StockTable";

export function WatchlistScripsPage() {
    const token = useUIStore((s) => s.token);
    // const stocks = useMarketStore((s) => s.stocks);
    const priceHistory = useMarketStore((s) => s.priceHistory);
    const watchlistId = useMarketStore((s) => s.selectedWatchlistId)
    const [scrips, setScrips] = useState<any[]>([]);

    useEffect(() => {
        const watchlistScripsConfig = async () => {
            try {
                const token = sessionStorage.getItem("auth-token")
                if (token) {
                    const response = await watchlistListScripList(token, watchlistId);
                    const mappedStocks = response.scrips.map((scrip: any) => {
                        const price = scrip.openPrice || scrip.previousClosePrice || 0;
                        const change = scrip.netChange || 0;
                        const changePercent = scrip.previousClosePrice  ? (change/scrip.previousClosePrice) : 0;

                        return {
                            symbol: scrip.symbolName,
                            name: scrip.companyName,
                            sector: scrip.segmentIndicator,
                            price: price,
                            change: change,
                            changePercent: changePercent,
                            volume: scrip.volumeTradedToday || 0,

                        }
                    })
                    setScrips(mappedStocks);
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            }
        } 
        watchlistScripsConfig();
    }, [token, watchlistId]);


    return (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <StockTable
                stocks={scrips}
                priceHistory={priceHistory}
                sortBy="" 
                sortDir="asc"
                onSort={() => {}}
            />
        </div>
    )
}
