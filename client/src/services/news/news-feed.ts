import { BASE_URL, getMiddlewareHeaders } from "../api/config";

export async function newsFeed(token: string) {
    const response = await fetch(`${BASE_URL}/v1/api/stocks/news?top=10&skip=0`, {
        method: "GET",
        headers: {...getMiddlewareHeaders(),
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error("Failed to fetch data")
    
    const data = await response.json();
    return data
}