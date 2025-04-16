import { useEffect, useState } from "react";

const useWebSocket = (url) => {
    const [data, setData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log("✅ WebSocket Connected");
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const receivedData = JSON.parse(event.data);
            console.log("📡 Live Data Received:", receivedData);
            setData(receivedData);
        };

        socket.onclose = () => {
            console.log("❌ WebSocket Disconnected");
            setIsConnected(false);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    return { data, isConnected };
};

export default useWebSocket;
