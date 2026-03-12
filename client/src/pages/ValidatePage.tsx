import { useState } from "react";
import { useUIStore } from "../store";
import { validateOTP } from "../services/api/validate";

export const ValidateOTP = () => {
    const [otp, setOtp] = useState("");
    const [isPending, setIsPending] = useState(false);

    // Get handshake, setToken, and state controls from the store
    const { handshake, setToken, setActiveTab, pushNotification } = useUIStore();

    const handleValidation = async () => {
        // 1. Basic validation
        if (otp.length < 4) {
            pushNotification("Please enter a 4-digit OTP", "info");
            return;
        }

        setIsPending(true);
        try {
            /** * IMPORTANT: Based on your Postman snippet:
             * 1. The username "AMITH1" is required in the body.
             * 2. The OTP must be sent as a NUMBER (not "1234").
             * 3. The latest handshake is sent in the headers.
             */
            const username = "AMITH1";
            const token = await validateOTP("AMITH1", Number(otp));
            
            // 2. EXTRACTION: Save the final Bearer Token
            setToken(token);
            sessionStorage.setItem("auth-token", token);
            
            // For debugging (remove in production)
            console.log("Extracted Token:", token);

            sessionStorage.setItem("client_code", username);
            
            pushNotification("Authentication successful!", "success");
            
            // 3. Navigate to Dashboard
            setActiveTab("dashboard");
        } catch (error: any) {
            // This captures the "throw new Error" from your validate.ts
            pushNotification(error.message || "Invalid OTP", "error");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
            <h3>Verify OTP</h3>
            <p style={{ fontSize: "12px", color: "gray", wordBreak: "break-all" }}>
                Active Handshake: {handshake}
            </p>
            
            <input 
                style={{ fontFamily: "var(--font-mono)", padding: "8px" }}
                type="text" 
                placeholder="Enter 1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allow numbers
                maxLength={4}
            />
            
            <button 
                onClick={handleValidation} 
                disabled={isPending} 
                style={{ 
                    cursor: isPending ? "not-allowed" : "pointer", 
                    fontFamily: "var(--font-mono)", 
                    padding: "10px",
                    backgroundColor: isPending ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px"
                }}
            >
                {isPending ? "Validating..." : "Verify & Login"}
            </button>
            
            <button 
                onClick={() => setActiveTab("login")} 
                style={{ background: "none", border: "none", color: "blue", cursor: "pointer", fontSize: "12px" }}
            >
                Back to Login
            </button>
        </div>
    );
};