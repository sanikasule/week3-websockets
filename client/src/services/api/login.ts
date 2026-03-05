import { BASE_URL, getMiddlewareHeaders } from "./config";

export async function getLogin(username: string, password: string) {
    const response = await fetch( `${BASE_URL}/v1/api/auth/login`, {
        method: "POST",
        headers: getMiddlewareHeaders(),
        body: JSON.stringify({username, password})
    })

    if (!response.ok) throw new Error("Login Failed");
    const data = await response.json();
    return data;
    
}