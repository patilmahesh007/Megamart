import React, { useState, useEffect } from 'react';
import api from "../../util/api.util.js";
import { toast } from "react-hot-toast";
import OrderGraph from "../../components/OrderGraph.jsx";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("orders"); 

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/list");
      setOrders(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/order/update-status/${orderId}`, { status: newStatus });
      toast.success("Order status updated successfully");
      fetchOrders(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating order status");
    }
  };

  const filteredOrders = orders.filter(order => {
    const { street, city, state, zipCode, country } = order.shippingAddress || {};
    const shippingAddress = `${street || ""} ${city || ""} ${state || ""} ${zipCode || ""} ${country || ""}`.toLowerCase();
    return (
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shippingAddress.includes(searchTerm.toLowerCase())
    );
  });

  const activeOrders = filteredOrders.filter(order =>
    order.status === "pending" || order.status === "shipped"
  );
  const completedOrders = filteredOrders.filter(order =>
    order.status === "delivered" || order.status === "cancelled"
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-6 flex space-x-4">
        <button 
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-md text-sm ${
            activeTab === "orders" ? "bg-teal-500 text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab("graph")}
          className={`px-4 py-2 rounded-md text-sm ${
            activeTab === "graph" ? "bg-teal-500 text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Graph
        </button>
      </div>

      {activeTab === "graph" ? (
        <OrderGraph />
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
          {activeOrders.length === 0 && completedOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <>
              {activeOrders.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Active Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Order ID</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Shipping Address</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Total Price</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Created At</th>
                          <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {activeOrders.map(order => (
                          <OrderRow key={order._id} order={order} onStatusChange={handleStatusChange} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {completedOrders.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Completed Orders</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Order ID</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Shipping Address</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Total Price</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Created At</th>
                          <th className="px-6 py-3 text-right text-sm font-medium text-gray-300">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {completedOrders.map(order => (
                          <OrderRow key={order._id} order={order} onStatusChange={handleStatusChange} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const OrderRow = ({ order, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const handleUpdateClick = () => {
    if (selectedStatus !== order.status) {
      onStatusChange(order._id, selectedStatus);
    } else {
      toast.info("Status unchanged");
    }
  };

  const { street, city, state, zipCode, country } = order.shippingAddress || {};
  const shippingAddress = `${street || ""}, ${city || ""}, ${state || ""}, ${zipCode || ""}, ${country || ""}`;
  const createdDate = new Date(order.createdAt).toLocaleString();

  const rowBgClass = order.status === "delivered"
    ? "bg-green-800"
    : order.status === "cancelled"
      ? "bg-red-800"
      : "";

  return (
    <tr className={`hover:bg-slate-700 ${rowBgClass}`}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{order._id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{shippingAddress}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">${order.totalPrice}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-md text-white px-2 py-1"
        >
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{createdDate}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <button onClick={handleUpdateClick} className="bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded-md">
          Update
        </button>
      </td>
    </tr>
  );
};

export default OrdersPage;
