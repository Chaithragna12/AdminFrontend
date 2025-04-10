import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Overview.css";

const Overview = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [orders, setOrders] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      const itemsResponse = await axios.get("https://adminbackend-dg8o.onrender.com/api/items/total-items");
      setTotalItems(itemsResponse.data.totalItems);

      const ordersResponse = await axios.get("https://userbackend-385g.onrender.com/api/admin/orders/count");
      setOrders(ordersResponse.data.totalOrders);

      const usersResponse = await axios.get("https://adminbackend-dg8o.onrender.com/api/stats/active-users");

      setActiveUsers(0); 
      setActiveUsers(usersResponse.data.activeUsers || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect to fetch data initially and then every 10 seconds
  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 10000); // Refresh data every 10 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="overview-container">
      <h1 className="overview-title">Welcome to Akshaya Admin Panel! 🍅</h1>
      <p className="title">Manage your restaurant easily with this dashboard.</p>

      <div className="overview-stats">
        <div className="stat-card" style={{ background: "#f8d7da" }}>
          <h3>📦 Total Items</h3>
          <p>{totalItems}</p>
        </div>
        <div className="stat-card" style={{ background: "#d4edda" }}>
          <h3>🛒 Orders</h3>
          <p>{orders}</p>
        </div>
        <div className="stat-card" style={{ background: "#cce5ff" }}>
          <h3>👥 Active Users</h3>
          <p>{activeUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
