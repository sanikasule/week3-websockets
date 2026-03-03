import { useEffect, useRef } from 'react';
import { useStore } from '../stores/useStore';
import type { Stock } from '../types/types';

const SERVER_URL = 'ws://127.0.0.1:8080'; // Using IP is more reliable than 'localhost'

const PING_EVERY_MS  = 25_000;  // send PING every 25 seconds
const PONG_WAIT_MS   =  5_000;  // if no PONG in 5s, connection is dead

export const useWebSocket = () => {
    const wsRef = useRef<WebSocket | null>(null);
    const retryCountRef = useRef<number>(0);
    const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pingTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
    const pongTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);


    const { setStock, setConnected } = useStore();

    function getWaitTime(): number {
        const seconds = Math.pow(2, retryCountRef.current);
        return Math.min(seconds, 30) * 1000;
    }

      // ── Stop the heartbeat timers cleanly ──────────────────
    function stopHeartbeat() {
        if (pingTimerRef.current) { clearInterval(pingTimerRef.current); pingTimerRef.current = null; }
        if (pongTimerRef.current) { clearTimeout(pongTimerRef.current);  pongTimerRef.current = null; }
    }

      // ── Start the heartbeat after a successful connection ───
  function startHeartbeat(ws: WebSocket) {
    stopHeartbeat(); // clear any old timers first
 
    pingTimerRef.current = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) return;
 
      // Send the PING
      ws.send(JSON.stringify({ type: "PING", ts: Date.now() }));
 
      // Set a 5-second deadline for the PONG to arrive
      pongTimerRef.current = setTimeout(() => {
        console.warn("PONG timeout — closing zombie connection");
        ws.close(); // triggers onclose → reconnect
      }, PONG_WAIT_MS);
 
    }, PING_EVERY_MS);
  }


    function connect() {
        console.log(`Connecting to ${SERVER_URL}...`);
        const ws = new WebSocket(SERVER_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Connected to Market Feed");
            setConnected(true);
            retryCountRef.current = 0;
            startHeartbeat(ws); // ← start PING/PONG after connect
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                const msg = JSON.parse(event.data);

                if (msg.type === "PONG") {
                    if (pongTimerRef.current) {
                        clearTimeout(pongTimerRef.current); // PONG arrived in time!
                        pongTimerRef.current = null;
                    }
                return; // nothing else to do for PONG
            }

                if (msg.type === "SNAPSHOT" || msg.type === "QUOTE") {
                    const rawData = msg.data;

                    if (rawData) {
                        const formattedStock: Stock = {
                            ...rawData,
                            symbol: msg.symbol || rawData.symbol || "UNKNOWN",
                            // Defensive: Fallback to 0 if ltp or change is missing
                            price: rawData.ltp ?? 0, 
                            change: rawData.change ?? 0,
                        };
                        setStock(formattedStock);
                    }
                }

                if (msg.type === "CONNECTED") {
                    console.log("Feed Active:", msg.message);
                }
            } catch (err) {
                console.error("Parse error:", err);
            }
        };

        ws.onclose = () => {
            setConnected(false);
            stopHeartbeat(); // ← stop PING/PONG when disconnected
            const waitTime = getWaitTime();
            retryCountRef.current += 1;
            console.log(`Disconnected. Retrying in ${waitTime / 1000}s...`);
            retryTimerRef.current = setTimeout(connect, waitTime);
        };

        ws.onerror = () => {
            // Logged but handled by onclose retry logic
            console.warn("WebSocket error - Check if server is running on 8080");
        };
    }

    useEffect(() => {
        connect();
        
        return () => {
            stopHeartbeat(); // ← cleanup on unmount
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
            
            const ws = wsRef.current;
            if (ws) {
                // Prevent memory leaks and "closed before established" warnings
                ws.onclose = null; 
                ws.onopen = null;
                ws.onerror = null;

                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                } else if (ws.readyState === WebSocket.CONNECTING) {
                    // Force close once it finishes opening
                    ws.onopen = () => ws.close();
                }
            }
        };
    }, []);
};