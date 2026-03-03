// helpers.ts

export function formatPrice(price: number = 0): string {
    // If price is null or undefined, default to 0 to prevent crash
    const safePrice = price ?? 0;
    return "\u20b9" + safePrice.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatPercent(value: number): string {
    if (value === undefined || value === null) return "0.00%";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

export function formatChange(value: number): string {
    if (value === undefined || value === null) return "0.00%";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

export function formatVolume(volume: number = 0): string {
   if (volume === undefined || volume === null) return "0";
   
   if (volume >= 10_000_000) return (volume / 10_000_000).toFixed(2) + "Cr";
   if (volume >= 100_000) return (volume / 100_000).toFixed(2) + "L";

   return volume.toLocaleString("en-IN");
}

export function getColor(value: number = 0): string {
    return (value ?? 0) >= 0 ? "#00c87c" : "#ff4d4d";
}

export function getBgColor(value: number = 0): string {
    return (value ?? 0) >= 0 ? "rgba(0, 200, 124, 0.10)" : "rgba(255, 77, 77, 0.10)";
}