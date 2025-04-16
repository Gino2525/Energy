import React, { useEffect, useState } from "react";
import BASE_URL from "./config";
import Layout from "./layout";
import './styles/livedata.css';

function Livedata() {
  const [machineData, setMachineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/livedata/`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setMachineData(data);
      } catch (error) {
        console.error("❗ Error fetching live data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  const sendEmail = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/send-live-data-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Email sent successfully!");
      } else {
        setMessage(`❌ Failed: ${data.error || data.detail}`);
      }
    } catch (err) {
      console.error("Email send error:", err);
      setMessage("❌ Something went wrong.");
    }
  };

  return (
    <div className="livedata-wrapper">
      <div className="livedata-content">
        <h2 className="text-xl font-semibold mb-4">📊 Live Machine Data</h2>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="email-input"
          />
          <button onClick={sendEmail} className="send-email-button">
            📧 Send CSV
          </button>
          {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>

        {loading ? (
          <p>⏳ Loading...</p>
        ) : machineData.length === 0 ? (
          <p>⚠️ No data available</p>
        ) : (
          <div className="grid gap-4">
            {machineData.map((entry, index) => (
              <div key={index} className="livedata-card">
                <p><strong>🛠️ Machine ID:</strong> {entry.machine_id}</p>
                <p><strong>📅 Timestamp:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                <p><strong>🌡️ Temperature:</strong> {entry.temperature} °C</p>
                <p><strong>⚡ Voltage:</strong> {entry.voltage} V</p>
                <p><strong>🔌 Current:</strong> {entry.current} A</p>
                <p><strong>🔋 Power:</strong> {entry.power} W</p>
                <p><strong>⚙️ Energy:</strong> {entry.energy} kWh</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Livedata;
