import { BASE_URL, getMiddlewareHeaders } from "../api/config";

export async function indicesList(token: string, exchange: string | null) {
    const response = await fetch(`${BASE_URL}/v1/middleware-bff/stocks/index`, {
        method: "POST",
        headers: {...getMiddlewareHeaders(),
        "Authorization": `Bearer ${token}`}, //token needs to be passed to have access
        body: JSON.stringify({ exchange: exchange }),
    });

    if (!response.ok) throw new Error("Failed to fetch data")
    
    const data = await response.json();
    return data
}