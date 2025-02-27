import React, { useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import AddItem from "./AddItem"; 
import ListItems from "./ListItems";
import Orders from "./Orders";
import Overview from "./Overview"; 
import Navbar from "../navbar/Navbar" 

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    if (!sessionStorage.getItem("isLoggedIn")) {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <Navbar /> {/* Include Navbar for logout button */}
      
      <aside className="sidebar">
        <ul>
          <li><Link to="/dashboard">Overview</Link></li>
          <li><Link to="/dashboard/add">Add</Link></li>
          <li><Link to="/dashboard/list">List</Link></li>
          <li><Link to="/dashboard/orders">Order</Link></li>
        </ul>
      </aside>
      
      <main className="content">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/list" element={<ListItems />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
