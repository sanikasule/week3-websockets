import { useUIStore } from "@/store"
import { getTimestamp } from "@/shared/utils/utils";

export const LoadingScreen = () => {
    const {setHandshake, setActiveTab} = useUIStore();

    const startLogin = () => {
        const ts = getTimestamp(); // From your utils
        setHandshake(ts);
        setActiveTab("login");
    };

    return (
        <div style={{alignContent: "center", padding: "20px"}}>
            <h1 style={{marginBottom: "10px"}}>Welcome</h1>
            <button onClick={startLogin} style={{cursor: "pointer", fontFamily: "var(--font-mono)", padding: "5px"}}>
                Get Started
            </button>
        </div>
    )
}