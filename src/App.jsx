import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import Add from './components/pages/Add/Add';
import List from './components/pages/List/List';
import Orders from './components/pages/Orders/Orders';
import Overview from './components/Overview/Overview';
import Login from './components/pages/login/Login';
import ChangePassword from './components/pages/ChangePassword/ChangePassword';

const App = () => {
  return (
    <div>
      <Routes>
        {/* Default route: Redirect "/" to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Change Password Route */}
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <div>
              <Navbar />
              <hr />
              <div className="app-content">
                <Sidebar />
                <Routes>
                  <Route index element={<Overview />} /> {/* Show Overview by default */}
                  <Route path="add" element={<Add />} />
                  <Route path="list" element={<List />} />
                  <Route path="orders" element={<Orders />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
