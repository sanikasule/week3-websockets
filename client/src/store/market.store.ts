import { create } from "zustand";
import type { Stock, OrderBook, EventLogEntry, EventKind } from "@/shared/types";

let eventIdCounter = 0;

type MarketState = {
  // Data
  stocks: Record<string, Stock>;
  priceHistory: Record<string, number[]>;
  orderBook: OrderBook | null;
  isConnected: boolean;
  tickCount: number;
  eventLog: EventLogEntry[];
  selectedSymbol: string | null; // For the specific stock (e.g., "RELIANCE")
  selectedWatchlistId: number | 0; // For the watchlist group (e.g., 101)

  // Actions
  setStock: (stock: Stock) => void;
  setOrderBook: (ob: OrderBook) => void;
  setConnected: (v: boolean) => void;
  setSelected: (symbol: string | null) => void;
  setWatchlistId: (id: number | 0) => void; // New action
  addEvent: (msg: string, kind: EventKind) => void;
  resetTickCount: () => void;
};

export const useMarketStore = create<MarketState>((set) => ({
  stocks: {},
  priceHistory: {},
  orderBook: null,
  isConnected: false,
  tickCount: 0,
  eventLog: [],
  selectedSymbol: null,
  selectedWatchlistId: 0,

  setStock: (stock) =>
    set((state) => {
      const oldHist = state.priceHistory[stock.symbol] ?? [];
      const newHist = [...oldHist, stock.price].slice(-60);
      return {
        stocks: { ...state.stocks, [stock.symbol]: stock },
        priceHistory: { ...state.priceHistory, [stock.symbol]: newHist },
        tickCount: state.tickCount + 1,
      };
    }),

  setOrderBook: (ob) => set({ orderBook: ob }),

  setConnected: (v) => set({ isConnected: v }),

  setSelected: (symbol) => set({ selectedSymbol: symbol }),

  setWatchlistId: (id) => set({ selectedWatchlistId: id }),

  addEvent: (msg, kind) =>
    set((state) => {
      const entry: EventLogEntry = {
        id: ++eventIdCounter,
        msg,
        kind,
        time: new Date().toLocaleTimeString("en-IN", { hour12: false }),
      };
      return { eventLog: [entry, ...state.eventLog].slice(0, 100) };
    }),

  resetTickCount: () => set({ tickCount: 0 }),
}));
