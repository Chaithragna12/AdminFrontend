import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink 
          to="/dashboard" 
          end  
          className={({ isActive }) => (isActive ? "sidebar-option active" : "sidebar-option")}
        >
          <img src={assets.dashboard_icon} alt="overview" className="alt" />
          <p>Overview</p>
        </NavLink>

        <NavLink 
          to="/dashboard/add" 
          className={({ isActive }) => (isActive ? "sidebar-option active" : "sidebar-option")}
        >
          <img src={assets.add_icon} alt="add" className="alt" />
          <p>Add Items</p>
        </NavLink>

        <NavLink 
          to="/dashboard/list" 
          className={({ isActive }) => (isActive ? "sidebar-option active" : "sidebar-option")}
        >
          <img src={assets.order_icon} alt="list" className="alt" />
          <p>List Items</p>
        </NavLink>

        <NavLink 
          to="/dashboard/orders" 
          className={({ isActive }) => (isActive ? "sidebar-option active" : "sidebar-option")}
        >
          <img src={assets.order_icon} alt="orders" className="alt" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
