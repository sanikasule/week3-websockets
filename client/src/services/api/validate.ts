import { BASE_URL, getMiddlewareHeaders } from "./config";

export async function validateOTP(username: string, otp: number) {
    const response = await fetch(`${BASE_URL}/v2/api/auth/validate-otp`, {
        method: "POST",
        headers: getMiddlewareHeaders(),
        body: JSON.stringify({ username, otp })
    });

    if (!response.ok) throw new Error("OTP Invalid");
    const data = await response.json();
    
    // FINAL EXTRACTION
    return data.jwtTokens.accessToken; 
}