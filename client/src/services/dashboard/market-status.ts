import { BASE_URL, getMiddlewareHeaders } from "../api/config";

export async function getMarketStatus(token: string) {
    const response = await fetch( `${BASE_URL}/v2/api/stocks/market-status`, {
        method: "POST",
        headers: {...getMiddlewareHeaders(),
             "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error("Login Failed");
    const data = await response.json();
    return data;
    
}