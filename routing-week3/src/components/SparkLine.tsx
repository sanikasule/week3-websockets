import { memo } from "react";

type SparkLineProps = {
    prices: number[];
    isGreen: boolean;
    width?: number;
    height?: number;
};

function SparkLine({prices, isGreen, width=80, height=30} : SparkLineProps) {
    if (prices.length < 2) return <svg width={width} height={height} />;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const points = prices.map((price, index) => {
        const x = (index / (prices.length - 1)) * width;
        const y = height - ((price - minPrice) / priceRange) * (height - 4) - 2;
        return `${x}, ${y}`;
    });

    const linePath = `M${points.join(" L")}`;
    const lineColor = isGreen ? "#00c87c" : "#ff4d4d";

    return (
        <svg width={width} height={height}>
            <path 
                d={linePath}
                fill="none"
                stroke={lineColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    )
}

export default memo(SparkLine)