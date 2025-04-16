import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import UpdateProfileImage from "./profile";
import Register from "./register";
import LiveMachineData from "./LiveMachineData";
import LoginPage from "./login";
import Dashboard from "./dashboard";
import reportWebVitals from "./reportWebVitals";
import ProtectedRoute from "./proute"; 
import Home from "./pages/home";
import Layout from "./layout";
import ForecastView from "./ForecastView";
import ClusterUsageView from "./ClusterUsageView";
import { WebSocketProvider } from "./WebSocketContext";
import { UserProvider } from './UserContext';
import Livedata from "./livedata";
import ClusterManager from "./addcluster";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider> {/* ✅ Now wraps everything */}
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/home"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/forecast"
              element={
                <Layout>
                  <ForecastView />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <UpdateProfileImage />
                </Layout>
              }
            />
            <Route
              path="/cluster-usage"
              element={
                <Layout>
                  <ClusterUsageView />
                </Layout>
              }
            />
            <Route
              path="/livemachinedata"
              element={
                <Layout>
                  <LiveMachineData/>
                </Layout>
              }
            />
            <Route
              path="/livesaveddata"
              element={
                <Layout>
                  <Livedata/>
                </Layout>
              }
            />
             <Route
              path="/clustercrud"
              element={
                <Layout>
                  <ClusterManager/>
                </Layout>
              }
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </WebSocketProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
