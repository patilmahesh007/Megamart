import React, { useState, useEffect } from "react";
import api from "../util/api.util";
import { toast } from "react-hot-toast";
import { ChevronDown, ChevronUp, XCircle } from "lucide-react";

function ProfileMyOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortBy, setSortBy] = useState("All");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/order/getOrders");
      if (response.data.success) {
        setOrders(response.data.data.orders);
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders.");
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      const response = await api.put("/order/update-status-by-user", {
        orderId: selectedOrderId,
        status: "cancelled by user",
      });

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        setShowConfirm(false);
        fetchOrders();
      } else {
        toast.error("Failed to cancel order.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Error cancelling order.");
    }
  };

  const confirmCancel = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirm(true);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Orders ({orders.length})</h2>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Sort by:</span>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Recent">Recent</option>
            <option value="Price">Price</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const isCanceled = order.status === "cancelled by user";
          return (
            <div
              key={order._id}
              className={`rounded-lg shadow-sm overflow-hidden transition-all ${
                isCanceled ? "bg-red-50 border-red-300" : "bg-white"
              } border`}
            >
              <div className="bg-yellow-400 p-4 flex justify-between items-center">
                <div className="grid grid-cols-2 md:grid-cols-4 text-sm flex-grow">
                  <div>
                    <div className="text-gray-600">Order ID</div>
                    <div className="font-medium">{order.orderId || order._id}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Payment</div>
                    <div className="font-medium">{order.totalPayment || order.totalPrice}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Payment Method</div>
                    <div className="font-medium">{order.paymentMethod || order.paymentMode}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Order Date</div>
                    <div className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <button
                  className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  {expandedOrder === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {expandedOrder === order._id && (
                <div className="p-4">
                  {order.orderItems &&
                    order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center py-3 border-b last:border-b-0">
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                          <img
                            src={item.product.mainImage}
                            alt={item.product.name}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div className="px-4 pb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className={`px-3 py-1 rounded-full text-xs mr-2 ${
                      isCanceled ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </div>
                  <div className="text-sm">Order status: {order.status}</div>
                </div>

                {!isCanceled && (
                  <button
                    onClick={() => confirmCancel(order._id)}
                    className="flex items-center text-red-600 hover:text-red-800 text-sm"
                  >
                    <XCircle size={16} className="mr-1" />
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Cancel Order?</h3>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to cancel this order?</p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={handleCancelOrder}
              >
                Yes, Cancel
              </button>
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                No, Keep Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMyOrders;
