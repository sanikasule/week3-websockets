import { BASE_URL, getMiddlewareHeaders } from "../api/config";

export async function dashboardConfig(token: string) {
    const response = await fetch(`${BASE_URL}/v1/api/profile/dashboard-config`, {
        method: "GET",
        headers: {...getMiddlewareHeaders(),
        "Authorization": `Bearer ${token}`}, //token needs to be passed to have access
    });

    if (!response.ok) throw new Error("Failed to fetch data")
    
    const data = await response.json();
    return data
}