import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Layout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="layout-container">
      {/* Header Section */}
      <div className="header">
        <div className="header-left">
          <div className="menu-icon dw dw-menu" />
          <div
            className="search-toggle-icon dw dw-search2"
            data-toggle="header_search"
          />
          <div className="header-search">
            <form>
              <div className="form-group mb-0">
                <i className="dw dw-search2 search-icon" />
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search Here"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info-dropdown">
            <div className="dropdown">
              <Link to="/profile" className="dropdown-toggle" role="button">
                <span className="user-icon">
                  <img src="vendors/images/photo1.jpg" alt="" />
                </span>
                <span className="user-name">Ross C. Lopez</span>
              </Link>
            </div>
          </div>
          
        </div>
      </div>

      {/* Sidebar */}
<div className="left-side-bar">
  <div className="brand-log">
    <Link
      to="/"
      className="text-decoration-none"
      style={{ color: "#ffffff" }} // Force white for the link text
    >
      <h3
        className="fw-bold text-center mb-3"
        style={{
          color: "#ffffff", // Force white again
          fontFamily: "Segoe UI, sans-serif",
          letterSpacing: "1px",
        }}
      >
        ⚡ Energy Consumption
      </h3>
    </Link>
    <div className="close-sidebar" data-toggle="left-sidebar-close">
      <i className="ion-close-round" />
    </div>
  </div>

        <div className="menu-block customscroll">
          <div className="sidebar-menu">
            <ul id="accordion-menu">
              <li className="dropdown">
                <Link to="/dashboard" className="dropdown-toggle">
                  <span className="micon dw dw-analytics-1" />
                  <span className="mtext">Dashboard</span>
                </Link>
              </li>

              <li className="dropdown">
                <Link to="/forecast" className="dropdown-toggle">
                  <span className="micon dw dw-analytics-1" />
                  <span className="mtext">Prediction</span>
                </Link>
              </li>

              <li className="dropdown">
                <Link to="/cluster-usage" className="dropdown-toggle">
                  <span className="micon dw dw-library" />
                  <span className="mtext">Historical Data</span>
                </Link>
              </li>

              <li className="dropdown">
                <Link to="/livesaveddata" className="dropdown-toggle">
                  <span className="micon dw dw-eye" />
                  <span className="mtext">Last usage</span>
                </Link>
              </li>

              <li className="dropdown">
                <Link to="/livemachinedata" className="dropdown-toggle">
                  <span className="micon dw dw-eye" />
                  <span className="mtext">Live Machine Data</span>
                </Link>
              </li>
              <li className="dropdown">
                <Link to="/clustercrud" className="dropdown-toggle">
                  <span className="micon dw dw-eye" />
                  <span className="mtext">Manage</span>
                </Link>
              </li>
            </ul>
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
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="content-wrapper">
        <div className="centered-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
