import React, { useEffect, useState } from "react";

const LiveMachineData = () => {
  const [machineData, setMachineData] = useState({});
  const lastUpdatedRef = {};

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/machine-data/");
    const now = Date.now();

    ws.onopen = () => console.log("✅ WebSocket Connected");

    ws.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);
        const now = Date.now();

        setMachineData((prevData) => {
          const updated = { ...prevData };
          if (Array.isArray(incoming)) {
            incoming.forEach((m) => {
              updated[m.machine_id] = { ...m, status: "on" };
              lastUpdatedRef[m.machine_id] = now;
            });
          } else {
            updated[incoming.machine_id] = { ...incoming, status: "on" };
            lastUpdatedRef[incoming.machine_id] = now;
          }
          return updated;
        });
      } catch (error) {
        console.error("❌ Error parsing WebSocket data:", error);
      }
    };

    ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
    ws.onclose = () => console.log("⚠️ WebSocket Disconnected");

    const checkStatusInterval = setInterval(() => {
      const now = Date.now();
      setMachineData((prevData) => {
        const updated = { ...prevData };
        let hasChanges = false;

        Object.entries(updated).forEach(([machine_id, data]) => {
          const lastSeen = lastUpdatedRef[machine_id] || 0;
          if (now - lastSeen > 10000 && data.status !== "off") {
            updated[machine_id] = { ...data, status: "off" };
            hasChanges = true;
          }
        });

        return hasChanges ? updated : prevData;
      });
    }, 2000);

    return () => {
      ws.close();
      clearInterval(checkStatusInterval);
    };
  }, []);

  return (
    <div className="container pt-5" style={{ marginTop: "60px" }}>

 {/* Use py-5 for top/bottom spacing */}
      <div className="row g-4"> {/* g-4 adds proper spacing between cards */}
        {Object.keys(machineData).length === 0 ? (
          <div className="col-12">
            <p className="text-muted">Waiting for live data...</p>
          </div>
        ) : (
          Object.entries(machineData).map(([id, data]) => (
            <div key={id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                  <h5 className="mb-0">
                    {data.machine_id.replace("_", " ").toUpperCase()}
                  </h5>
                  <span className={`badge ${data.status === "on" ? "bg-success" : "bg-danger"}`}>
                    {data.status.toUpperCase()}
                  </span>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>🌡️ Temperature:</strong> {data.temperature} °C</li>
                    <li className="list-group-item"><strong>🔋 Voltage:</strong> {data.voltage} V</li>
                    <li className="list-group-item"><strong>⚡ Current:</strong> {data.current} A</li>
                    <li className="list-group-item"><strong>💡 Power:</strong> {data.power} W</li>
                    <li className="list-group-item"><strong>🔌 Energy:</strong> {data.energy} kWh</li>
                  </ul>
                  <p className="text-muted mt-3 small">
                    ⏱ Last Updated: {new Date(data.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LiveMachineData;
