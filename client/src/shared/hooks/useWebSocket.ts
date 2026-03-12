// import { useEffect, useRef } from "react";
// import { useMarketStore } from "../../store";
// import { parseMessage } from "../../services/websocket/";
// import {
//   getReconnectDelay,
//   PING_INTERVAL_MS,
//   PONG_TIMEOUT_MS,
//   SERVER_URL,
// } from "@/services/websocket/reconnectStrategy";

// export function useWebSocket() {
//   const wsRef         = useRef<WebSocket | null>(null);
//   const retryRef      = useRef(0);
//   const retryTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const pingTimer     = useRef<ReturnType<typeof setInterval> | null>(null);
//   const pongTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const { setStock, setOrderBook, setConnected, addEvent } = useMarketStore.getState();

//   function stopHeartbeat() {
//     if (pingTimer.current) { clearInterval(pingTimer.current); pingTimer.current = null; }
//     if (pongTimer.current) { clearTimeout(pongTimer.current);  pongTimer.current = null; }
//   }

//   function startHeartbeat(ws: WebSocket) {
//     stopHeartbeat();
//     pingTimer.current = setInterval(() => {
//       if (ws.readyState !== WebSocket.OPEN) return;
//       ws.send(JSON.stringify({ type: "PING", ts: Date.now() }));
//       addEvent("PING sent", "ping");
//       pongTimer.current = setTimeout(() => {
//         console.warn("[WS] PONG timeout — closing zombie socket");
//         ws.close();
//       }, PONG_TIMEOUT_MS);
//     }, PING_INTERVAL_MS);
//   }

//   function connect() {
//     const ws = new WebSocket(SERVER_URL);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       setConnected(true);
//       retryRef.current = 0;
//       addEvent("Connected to " + SERVER_URL, "connect");
//       startHeartbeat(ws);
//     };

//     ws.onmessage = (event: MessageEvent) => {
//       const msg = parseMessage(event.data as string);
//       if (!msg) return;

//       if (msg.type === "PONG") {
//         if (pongTimer.current) { clearTimeout(pongTimer.current); pongTimer.current = null; }
//         addEvent("PONG received", "ping");
//         return;
//       }
//       if (msg.type === "STOCK_UPDATE") {
//         setStock(msg.stock);
//         addEvent(`${msg.stock.symbol} → ₹${msg.stock.price.toFixed(2)}`, "price");
//         return;
//       }
//       if (msg.type === "ORDER_BOOK") {
//         setOrderBook({ symbol: msg.symbol, bids: msg.bids, asks: msg.asks });
//         return;
//       }
//     };

//     ws.onclose = () => {
//       setConnected(false);
//       stopHeartbeat();
//       const delay = getReconnectDelay(retryRef.current);
//       retryRef.current += 1;
//       addEvent(`Disconnected. Retrying in ${(delay / 1000).toFixed(1)}s…`, "disconnect");
//       retryTimer.current = setTimeout(connect, delay);
//     };

//     ws.onerror = () => addEvent("WebSocket error", "error");
//   }

//   useEffect(() => {
//     connect();
//     return () => {
//       stopHeartbeat();
//       if (retryTimer.current) clearTimeout(retryTimer.current);
//       if (wsRef.current) {
//         wsRef.current.onclose = null;
//         wsRef.current.close();
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Expose send for components that need to subscribe to order books
//   function send(data: object) {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify(data));
//     }
//   }

//   return { send };
// }

// import { useEffect } from "react";
// import { useMarketStore } from "../../store";
// import { 
//   wsManager, 
//   WsLifecycleEvent, 
//   MarketTick 
// } from "../../services/websocket";

// export function useWebSocket(clientCode: string) {
//   // Use getState to avoid unnecessary re-renders of the hook itself
//   const { setStock, setOrderBook, setConnected, addEvent } = useMarketStore.getState();

//   useEffect(() => {
//     if (!clientCode) return;

//     // 1. Handle Lifecycle Events using the 'kind' property from types.ts
//     const handleLifecycle = (event: WsLifecycleEvent) => {
//       switch (event.kind) {
//         case "CONNECTED":
//           setConnected(true);
//           addEvent("WebSocket Connected", "connect");
//           break;
//         case "DISCONNECTED":
//           setConnected(false);
//           addEvent(`Disconnected: ${event.reason}`, "disconnect");
//           break;
//         case "RECONNECTING":
//           addEvent(`Retrying connection (Attempt ${event.attempt})...`, "disconnect");
//           break;
//         case "ERROR":
//           addEvent("WebSocket Error occurred", "error");
//           break;
//         case "PONG_TIMEOUT":
//           addEvent("Connection heartbeat lost", "error");
//           break;
//       }
//     };

//     // 2. Handle incoming Market Data
//     const handleTicks = (tick: MarketTick) => {
//       // Map normalized MarketTick to your store's expectations
//       // Note: Using tick.token as the symbol and tick.ltp as the price
//       setStock({ 
//         symbol: tick.token,
//         price: tick.ltp,
//         open: tick.open,
//         high: tick.high,
//         low: tick.low,
//         prevClose: tick.close, // Mapping close to prevClose as per your Stock type
//         change: tick.change,
//         changePercent: tick.changePercent,
//         volume: tick.volume,
//         // Since the WS tick doesn't provide these, we provide empty strings/defaults.
//         // In a real app, your store's setStock should ideally merge this 
//         // with existing static data.
//         name: "", 
//         sector: "", 
//       });

//       addEvent(`${tick.token} → ₹${tick.ltp.toFixed(2)}`, "price");
//     };

//     // 3. Register listeners
//     const unsubscribeTick = wsManager.onTick(handleTicks);
//     const unsubscribeLifecycle = wsManager.onLifecycle(handleLifecycle);

//     // 4. Initialize connection
//     wsManager.connect(clientCode);

//     // Cleanup: remove listeners from the singleton
//     return () => {
//       unsubscribeTick();
//       unsubscribeLifecycle();
//       // We do NOT call wsManager.disconnect() here to allow the 
//       // socket to persist while the user navigates the app.
//     };
//   }, [clientCode, setStock, setOrderBook, setConnected, addEvent]);

//   // Helper for manual subscriptions (e.g., searching for a new stock)
//   const subscribe = (tokens: string[], exchange: any = "NSE_CM") => {
//     wsManager.subscribe([{ exchange, tokens }]);
//   };

//   return { subscribe };
// }



import { useEffect } from "react";
import { useMarketStore, useLiveMarketStore } from "../../store";
import { 
  wsManager, 
  WsLifecycleEvent, 
  MarketTick 
} from "../../services/websocket";

export function useWebSocket(clientCode: string) {
  // Use getState for actions to keep the hook stable
  const { handleTick, handleLifecycle } = useLiveMarketStore.getState();
  const { setConnected, addEvent } = useMarketStore.getState();

  useEffect(() => {
    if (!clientCode) return;

    // 1. Pipe lifecycle events to the Live Store
    const onLifecycle = (event: WsLifecycleEvent) => {
      handleLifecycle(event);
      
      // Update UI-specific state
      switch (event.kind) {
        case "CONNECTED":
          setConnected(true);
          addEvent("WebSocket Connected", "connect");
          break;
        case "DISCONNECTED":
          setConnected(false);
          addEvent(`Disconnected: ${event.reason}`, "disconnect");
          break;
        case "ERROR":
          addEvent("WebSocket Error", "error");
          break;
      }
    };

    // 2. Pipe ticks to the Live Store
    const onTicks = (tick: MarketTick) => {
      handleTick(tick);
      addEvent(`${tick.token} → ₹${tick.ltp}`, "price");
    };

    const unsubscribeTick = wsManager.onTick(onTicks);
    const unsubscribeLifecycle = wsManager.onLifecycle(onLifecycle);

    // Initialize connection
    wsManager.connect(clientCode);

    return () => {
      unsubscribeTick();
      unsubscribeLifecycle();
    };
  }, [clientCode, handleTick, handleLifecycle, setConnected, addEvent]);

  return {
    subscribe: (tokens: string[], exchange: any = "NSE_CM") => 
      wsManager.subscribe([{ exchange, tokens }])
  };
}