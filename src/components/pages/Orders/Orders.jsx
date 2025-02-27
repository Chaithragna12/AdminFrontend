import { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/admin/orders/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/api/admin/orders/orders/${id}/status`, { orderStatus: status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, orderStatus: status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const updatePaymentStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/api/admin/orders/orders/${id}/payment`, { paymentStatus: status });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, paymentStatus: status } : order
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/orders/delete/${id}`);
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.includes(searchTerm) ||
      (order.userId?.email && order.userId.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userId?.name && order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter ? order.orderStatus === statusFilter : true;
    const matchesPayment = paymentFilter ? order.paymentStatus === paymentFilter : true;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="orders-container">
      <h2>Orders Management</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by Order ID or Customer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="">All Payments</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name & Email</th>
            <th>Order Status</th>
            <th>Payment Status</th>
            <th>Products</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            const totalAmount = order.products.reduce((acc, product) => {
              const productTotalPrice = (product.productId?.price || 0) * product.quantity;
              return acc + productTotalPrice;
            }, 0);

            return (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.userId ? (
                    `${order.userId.username} (${order.userId.email})`
                  ) : (
                    <span>User Not Found</span>
                  )}
                </td>
                <td>
                  <select value={order.orderStatus} onChange={(e) => updateOrderStatus(order._id, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <select value={order.paymentStatus} onChange={(e) => updatePaymentStatus(order._id, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </td>
                <td>
                  <ul>
                    {order.products.map((product) => (
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
