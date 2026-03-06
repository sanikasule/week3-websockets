import { create } from "zustand";
import type { WatchlistItem } from "@/shared/types";

type Notification = { id: number; msg: string; kind: "success" | "error" | "info" };
let notifId = 0;

type UIState = {
  watchlist: WatchlistItem[];
  sidebarOpen: boolean;
  notifications: Notification[];
  token: string | null;
  handshake: string;
  activeTab: "loading" | "login" | "validate_otp" | "dashboard" | "portfolio" | "orderbook" | "Watchlist" | "watchlist-detail" | string; //added string so that can be any active tab

  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  setSidebarOpen: (v: boolean) => void;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  pushNotification: (msg: string, kind?: Notification["kind"]) => void;
  setHandshake: (ts: string) => void;
  setToken: (token: string) => void;
  dismissNotification: (id: number) => void;
};

export const useUIStore = create<UIState>((set) => ({
  token: null,
  activeTab: "loading",
  handshake: "",

  watchlist: [
    { symbol: "TCS" },
    { symbol: "RELIANCE" },
    { symbol: "HDFCBANK" },
    { symbol: "INFY" },
    { symbol: "BAJFINANCE" },
  ],
  sidebarOpen: true,
  notifications: [],

  setHandshake: (ts) => set({handshake: ts}),

  setToken: (token) => set({token}),

  setActiveTab: (tab) => set({ activeTab: tab }),

  addToWatchlist: (symbol) =>
    set((state) => ({
      watchlist: state.watchlist.find((w) => w.symbol === symbol)
        ? state.watchlist
        : [...state.watchlist, { symbol }],
    })),

  removeFromWatchlist: (symbol) =>
    set((state) => ({ watchlist: state.watchlist.filter((w) => w.symbol !== symbol) })),

  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  pushNotification: (msg, kind = "info") =>
    set((state) => ({
      notifications: [
        { id: ++notifId, msg, kind },
        ...state.notifications,
      ].slice(0, 5),
    })),

  dismissNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
}));
