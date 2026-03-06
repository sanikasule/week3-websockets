import { BASE_URL, getMiddlewareHeaders } from "../api/config";

export async function watchlistListScripList(token: string, watchlistId: number) {
    const response = await fetch(`${BASE_URL}/v1/api/watchlist/scrips/list`, {
        method: "POST",
        headers: {...getMiddlewareHeaders(),
        "Authorization": `Bearer ${token}`}, //token needs to be passed to have access
        body: JSON.stringify({ watchlistId: watchlistId }),
    });

    if (!response.ok) throw new Error("Failed to fetch data")
    
    const data = await response.json();
    return data
}