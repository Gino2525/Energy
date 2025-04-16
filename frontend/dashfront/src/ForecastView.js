import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import BASE_URL from './config';
import './styles/ForecastView.css';

const ForecastView = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPredictionMsg, setShowPredictionMsg] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPredictionMsg(false);

      axios
        .get(`${BASE_URL}/api/forecast/`)
        .then((response) => {
          setForecast(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Error fetching forecast');
          setLoading(false);
        });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (showPredictionMsg) return <div className="center-message">🔮 Prediction in progress...</div>;
  if (loading) return <div className="center-message">Loading forecast...</div>;
  if (error) return <div className="center-message text-danger">{error}</div>;

  return (
    <div className="container forecast-container mt-5">
      <h2 className="text-center mb-4">⚡ 7-Day Energy Forecast</h2>

      {/* Forecast Table */}
      <div className="table-responsive mb-5">
        <table className="table table-hover table-bordered shadow-sm">
          <thead className="thead-dark">
            <tr>
              <th>Date</th>
              <th>Predicted Energy (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((item, index) => (
              <tr key={index}>
                <td>{item.ds}</td>
                <td>{item.yhat.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forecast Line Chart */}
      <h4 className="text-center mb-3">📈 Energy Forecast Trend</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={forecast}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ds" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="yhat"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastView;
