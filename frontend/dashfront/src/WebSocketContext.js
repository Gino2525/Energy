import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/machine/");

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📡 Live Data Received:", data);
      setMessages((prev) => [...prev, data]); // Store received messages
    };

    ws.onclose = () => {
      console.log("❌ WebSocket Disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom Hook to use WebSocket Context
export const useWebSocket = () => useContext(WebSocketContext);
