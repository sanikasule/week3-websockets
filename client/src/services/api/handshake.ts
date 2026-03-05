import { BASE_URL, getMiddlewareHeaders } from "./config";

export async function preAuthHandshake() {
    const ts = Date.now().toString();
    const response = await fetch(`${BASE_URL}/v1/api/auth/pre-auth-handshake`, {
        method: "POST",
        headers: getMiddlewareHeaders(),
        body: JSON.stringify({ devicePublicKey: "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0t..." })
    });
    const data = await response.json();
}