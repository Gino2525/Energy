import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from "./config";
import './styles/ClusterUsageView.css';

const ClusterUsageView = () => {
  const [usageData, setUsageData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/clusters/usage/`)
      .then((response) => {
        setUsageData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching cluster usage');
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter by date string (yyyy-mm-dd)
  const filteredData = usageData.filter(item =>
    item.ds.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center mt-5">Loading usage clusters...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center cluster-title">📊 Cluster-wise Energy Usage</h2>

      {/* 🔍 Search Bar */}
      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by date (YYYY-MM-DD)"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* 📅 Table */}
      <div className="table-responsive">
        <table className="table table-hover shadow-sm">
          <thead className="thead-dark">
            <tr>
              <th>Date</th>
              <th>Energy Used (kWh)</th>
              <th>Usage Cluster</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.ds.split('T')[0]}</td>
                  <td>{item.y.toFixed(2)}</td>
                  <td>
                    <span className={`badge cluster-badge ${item.cluster_label.toLowerCase()}`}>
                      {item.cluster_label}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">No results found for "{searchQuery}"</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClusterUsageView;
