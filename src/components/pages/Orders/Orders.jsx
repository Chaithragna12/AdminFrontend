
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const fetchOrders = async () => {
    try {
      const response = await axios.get("https://userbackend-385g.onrender.com/api/admin/orders/all");
      console.log("✅ API Response:", response.data); // Debugging
      setOrders(response.data); // ✅ FIXED: Use response.data directly
    } catch (error) {
      console.error("❌ Error fetching orders:", error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    console.log("🔍 Orders Data:", orders);
    fetchOrders();
  }, []);

  // ✅ Update Order Status Function
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log("🔄 Updating order:", orderId, "New status:", newStatus);
      await axios.put(
        `https://adminbackend-dg8o.onrender.com/api/admin/orders/${orderId}/status`, // ✅ Fixed port
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Order updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("❌ Error updating order status:", error.response?.data || error.message);
    }
  };

  // ✅ Delete Order Function
  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`https://adminbackend-dg8o.onrender.com/api/admin/orders/${id}`);
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
        console.log("✅ Order deleted successfully!");
      } catch (error) {
        console.error("❌ Error deleting order:", error.response?.data || error.message);
      }
    }
  };

  // ✅ Filter Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.includes(searchTerm) ||
      (order.userId?.email && order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter ? order.orderStatus === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="orders-container">
      <h2>Orders Management</h2>
      
      {/* 🔎 Search & Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Processing">Processing</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* 🛒 Orders Table */}
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Email</th>
            <th>Order Status</th>
            <th>Products</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            const totalAmount = (order.products || []).reduce((acc, product) => {
              return acc + ((product.productId?.price || 0) * product.quantity);
            }, 0);

            return (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId?.email || "No Email Provided"}</td>
                <td>
                  <select
                    value={order.orderStatus || "Pending"}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <ul>
                    {(order.products || []).map((product) => (
                      <li key={product._id}>
                        {product.productId?.name || "Unknown Product"} - Quantity: {product.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₹{totalAmount}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteOrder(order._id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
