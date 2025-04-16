import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const BASE_URL = 'http://127.0.0.1:8000';

const ClusterManager = () => {
  const [clusters, setClusters] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', average_consumption: '', status: '' });
  const [showForm, setShowForm] = useState(false);
  const [editClusterId, setEditClusterId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cluster/clusters/`);
      setClusters(res.data);
    } catch (err) {
      console.error('Error fetching clusters:', err);
    }
  };

  const addCluster = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        average_consumption: formData.average_consumption,
        status: formData.status,
      };

      await axios.post(`${BASE_URL}/api/cluster/clusters/`, payload);
      setFormData({ id: '', name: '', average_consumption: '', status: '' });
      setShowForm(false);
      fetchClusters();
    } catch (error) {
      console.error('Error adding cluster:', error.response?.data || error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/api/cluster/clusters/${id}/`, { name: editName });
      setEditClusterId(null);
      setEditName('');
      fetchClusters();
    } catch (err) {
      console.error('Error updating cluster:', err.response?.data);
    }
  };

  const renderCluster = (cluster) => (
    <li key={cluster.id} className="flex items-center justify-between bg-gray-100 p-3 rounded shadow mb-2">
      {editClusterId === cluster.id ? (
        <input
          type="text"
          className="border px-2 py-1 rounded w-2/3"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />
      ) : (
        <span className="w-2/3">{cluster.name}</span>
      )}
      <div className="flex space-x-2">
        {editClusterId === cluster.id ? (
          <button
            onClick={() => handleUpdate(cluster.id)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => {
              setEditClusterId(cluster.id);
              setEditName(cluster.name);
            }}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
        )}
      </div>
    </li>
  );

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 mt-[200px] px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">🔧 Cluster Manager</h2>

        {/* Add Cluster Form */}
        <form onSubmit={addCluster} className="space-y-4 mb-6">
          <input
            type="text"
            name="name"
            placeholder="Cluster Name"
            value={formData.name}
            onChange={handleInputChange}
            className="border border-gray-300 px-4 py-2 rounded w-full"
            required
          />
          <input
            type="number"
            name="average_consumption"
            placeholder="Average Consumption"
            value={formData.average_consumption}
            onChange={handleInputChange}
            className="border border-gray-300 px-4 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleInputChange}
            className="border border-gray-300 px-4 py-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Add Cluster
          </button>
        </form>

        {/* Cluster List */}
        <div className="space-y-3">
          {clusters.map((cluster) => renderCluster(cluster))}
        </div>
      </div>
    </div>
  );
};

export default ClusterManager;
