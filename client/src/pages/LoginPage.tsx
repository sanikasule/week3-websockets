import { useState } from "react";
import { useUIStore } from "@/store";
import { getLogin } from "@/services/api/login";

export const LoginPage = () => {
    // 1. Local state for form inputs and loading status
    const [username, setUsername] = useState("AMITH1"); // Defaulting for your test
    const [password, setPassword] = useState("abc@12345");
    const [isLoading, setIsLoading] = useState(false);

    // 2. Access the store
    const { handshake, setHandshake, setActiveTab, pushNotification } = useUIStore();

    // 3. The logic handler
    const handleLogin = async () => {
        if (!username || !password) {
            pushNotification("Please fill in all fields", "error");
            return;
        }

        setIsLoading(true); // Start spinner
        try {
            // Send credentials + current handshake
            const responseData = await getLogin(username, password);

            // EXTRACTION: Grab the new timestamp returned by the Middleware
            // Note: Check if your API returns it as 'handshake' or 'timestamp'
            const nextHandshake = responseData.handshake || responseData.timestamp || handshake;
            
            setHandshake(nextHandshake); 
            
            pushNotification("Credentials Verified. Sending OTP...", "success");
            setActiveTab("validate_otp");
        } catch (error: any) {
            pushNotification(error.message || "Login failed", "error");
        } finally {
            setIsLoading(false); // Stop spinner
        }
    };

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
            <h2>Login</h2>
            
            {/* Displaying current session handshake */}
            <label style={{ fontSize: "12px", color: "#666" }}>
                Session ID: {handshake}
            </label>
            
            <input 
                style={{ fontFamily: "var(--font-mono)", padding: "8px" }}
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            
            <input 
                style={{ fontFamily: "var(--font-mono)", padding: "8px" }}
                type="password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button 
                onClick={handleLogin} 
                disabled={isLoading} 
                style={{ cursor: isLoading ? "not-allowed" : "pointer", padding: "10px", fontFamily: "var(--font-mono)" }}
            >
                {isLoading ? "Authenticating..." : "Login"}
            </button>
        </div>
    );
};