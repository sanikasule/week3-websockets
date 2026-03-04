import { create } from "zustand";
import type { NormalizedStock, RawStockPayload } from "../domains/markets/types";
import { normalizeStock } from "../domains/markets/market.normalizer"; 

type MarketStore = { 
    stocks: Record<string, NormalizedStock>; 
    priceHistory: Record<string, number[]>; 
    latencyMs: number | null; // null until first PONG received

    setStock: (raw: RawStockPayload, serverTs: number) => void; 
    setLatency: (ms: number) => void;
}; 

export const useMarketStore = create<MarketStore>((set) =>  ({ stocks: {}, priceHistory: {}, 
    latencyMs: null,
    setLatency: (ms) => set({ latencyMs: ms }),
    setStock: (raw, serverTs) => { 
        set((state) => { 
            const prev = state.stocks[raw.symbol]; 
            const normalized = normalizeStock(raw, prev, serverTs); // ↑ raw server data → clean NormalizedStock 
            const oldH = state.priceHistory[raw.symbol] ?? []; 
            const newH = [...oldH, normalized.price].slice(-30); 
            
            return { 
                stocks: { ...state.stocks, [normalized.symbol]: normalized }, 
                priceHistory: { ...state.priceHistory, [normalized.symbol]: newH }, 
            }; 
        }); 
    }, 
}));