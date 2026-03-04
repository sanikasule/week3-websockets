import type { NormalizedStock } from "./types";

//mapping of data to normalization
type Map = Record<string, NormalizedStock>;

export const selectAllStocks = (m: Map) => Object.values(m);
export const selectStock = (m: Map, sym: string) => m[sym.toUpperCase()];
export const selectBySector = (m: Map, sec: string) =>
    Object.values(m).filter(s => s.sector === sec);

export const selectTotalTicks = (m: Map) =>
    Object.values(m).reduce((sum, s) => sum + s.updateCount, 0);

// Usage in any component:
// const stocks = useMarketStore(s => selectAllStocks(s.stocks));

//read from store through selectors. If store shape changes, fix one selector - not every component that reads data.