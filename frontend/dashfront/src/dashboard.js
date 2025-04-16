import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "./config";
import { clusterChartOptions } from './chartOptions/clusterOptions';
import Layout from "./layout";
import Button from "react-bootstrap/Button";
import { Bar, Line } from "react-chartjs-2";
import './styles/dashboard.css';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'optimized', label: 'Optimized' },
];


const Dashboard = () => {
  const navigate = useNavigate();
  const [clusters, setClusters] = useState([]);
  const [formData, setFormData] = useState({ name: "", location: "", energy_cost: "" });
  const [showForm, setShowForm] = useState(false);
  const [machineData, setMachineData] = useState({});

  const fetchClusters = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/cluster/clusters`);
      setClusters(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching clusters:", error.response?.data || error);
      setClusters([]);
    }
  };

  const fetchClusterUsage = async () => {
    try {
      await axios.get(`${BASE_URL}/api/clusters/usage/`);
    } catch (error) {
      console.error("Error fetching cluster usage:", error.response?.data || error);
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
      setFormData({ id: "", name: "", average_consumption: "", status: "" });
      setShowForm(false);
      fetchClusters();
    } catch (error) {
      console.error("Error adding cluster:", error.response?.data || error);
    }
  };
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <div className="centered-heading">
        <div className="main-container">
          <div className="pd-ltr-20">

            {/* Welcome Section */}
            <div className="card-box pd-20 height-100-p mb-30">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <img src="vendors/images/banner-img.png" alt="Banner" />
                </div>
                <div className="col-md-8">
                  <h4 className="font-20 weight-500 mb-10 text-capitalize">
                    Welcome back <span className="weight-600 font-30 text-blue"></span>
                  </h4>
                  <p className="font-18 max-width-600">Real-time energy and cluster management system.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <div class="welcome-card">
  <h2>Welcome back</h2>
  <p>Real-time energy and cluster management system.</p>

  <div class="inner-card">
    <h3>📘 About this Dashboard</h3>
    <p>
      This dashboard helps you monitor and manage energy usage in real time.
      From tracking power and HVAC systems to machine-level monitoring —
      it gives you everything in one place.
    </p>
    <ul>
      <li><span></span><span><strong>Live Monitoring:</strong> Real-time data from machines.</span></li>
      <li><span></span><span><strong>Historical Insights:</strong> Find usage patterns over time.</span></li>
      <li><span></span><span><strong>Forecasting:</strong> Predict future energy consumption.</span></li>
      <li><span></span><span><strong>Cluster Views:</strong> Spot high-usage systems instantly.</span></li>
      <li><span></span><span><strong>Responsive UI:</strong> Fast, clean, and easy to use.</span></li>
    </ul>
    <p>
      Designed to reduce energy waste, optimize operations, and empower smarter energy decisions.
    </p>
  </div>
</div>

{/* Tips Card - Blue Variant */}

</div>




            
         {/* Add Cluster Form 
<div className="card-box pd-20 mb-30">
  <h3 className="font-18 mb-3">➕ Add New Machine</h3>
  <Button
    variant={showForm ? "secondary" : "primary"}
    onClick={() => setShowForm(!showForm)}
  >
    {showForm ? "Cancel" : "Add Machine"}
  </Button>

  {showForm && (
    <form onSubmit={addCluster} className="mt-3">
      <div className="form-group">
        <label>Id</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
      <div className="form-group">
  <label>Status</label>
  <select
    name="status"
    value={formData.status}
    onChange={handleInputChange}
    className="form-control"
    required
  >
    <option value="">-- Select Status --</option>
    {statusOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>

      <div className="form-group">
        <label>Average Consumption (kWh)</label>
        <input
          type="number"
          name="average_consumption"
          value={formData.average_consumption}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <Button type="submit" variant="success" className="mt-2">
        Save
      </Button>
    </form>
  )}
</div>

*/}
 {/* Cluster Table 
<div className="card-box mb-30">
  <h2 className="h4 pd-20">Clusters</h2>
  <table className="data-table table nowrap">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Status</th>
        <th>Average Consumption (kWh)</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody>
      {clusters.length > 0 ? (
        clusters.map((cluster, index) => (
          <tr key={index}>
            <td>{cluster.id}</td>
            <td>{cluster.name}</td>
            <td>{cluster.status}</td>
            <td>{cluster.average_consumption}</td>
            <td>{new Date(cluster.created_at).toLocaleString()}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center">No clusters available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
*/}


            {/* Logout 
            <div className="text-center mt-4">
              <Button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                variant="danger"
              >
                Logout
              </Button>
            </div>
*/}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
