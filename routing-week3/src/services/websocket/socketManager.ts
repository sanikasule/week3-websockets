const pingSentAtRef = useRef<number>(0); 
// Inside startHeartbeat() — when PING is sent: 
ws.send(JSON.stringify({ type: "PING", ts: Date.now() })); 
pingSentAtRef.current = Date.now(); // record send time 
// Inside onmessage switch — when PONG arrives: 
case "pong": { 
    const rtt = Date.now() - pingSentAtRef.current; 
    setLatency(rtt); // save RTT to store 
    handlePong(msg.ts); // cancel the pong timeout (from Chapter 8) 
    break; 
}