import { useState, useEffect } from "react";

const MachineData = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000/ws/machine/");

        socket.onmessage = (event) => {
            const receivedData = JSON.parse(event.data);
            console.log("📡 Live Data Received:", receivedData);
            setData(receivedData);
        };

        socket.onopen = () => {
            console.log("✅ WebSocket Connected");
        };

        socket.onclose = () => {
            console.log("❌ WebSocket Disconnected");
        };

        return () => {
            socket.close(); // Cleanup WebSocket connection on component unmount
        };
    }, []);

    return (
        <div>
            <h1>Live Machine Data</h1>
            {data ? (
                <p>Temperature: {data.temperature}°C | Voltage: {data.voltage}V</p>
            ) : (
                <p>Waiting for data...</p>
            )}
        </div>
    );
};

export default MachineData;
