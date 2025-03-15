import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import {
  Users,
  ShoppingBag,
  Package,
  BarChart,
  Tag,
  Bell,
} from "lucide-react";
import verifyRole from "../util/verifyRole.util.js";

function AdminPanel() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      await verifyRole(setIsAdmin, navigate);
    };
    checkRole();
  }, [navigate]);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-pulse text-lg font-medium text-teal-400">
          Verifying access...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-lg text-red-400">
          Unauthorized access. Redirecting...
        </p>
      </div>
    );
  }

  const adminCards = [
    {
      title: "Users",
      description: "Manage users, roles, and permissions",
      icon: <Users size={24} />,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      buttonText: "View Users",
      count: "2,543",
      route: "/admin/users",
    },
    {
      title: "Orders",
      description: "Track & update order statuses",
      icon: <ShoppingBag size={24} />,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      buttonText: "Manage Orders",
      count: "156",
      route: "/admin/orders",
    },
    {
      title: "Products",
      description: "Add, edit, or remove products",
      icon: <Package size={24} />,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      buttonText: "Manage Products",
      count: "1,267",
      route: "/admin/products",
    },
    {
      title: "Sales Reports",
      description: "View revenue & performance reports",
      icon: <BarChart size={24} />,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      buttonText: "View Reports",
      count: "43",
      route: "/admin/sales",
    },
    {
      title: "Categories",
      description: "Manage product categories",
      icon: <Tag size={24} />,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      buttonText: "Manage Categories",
      count: "42",
      route: "/admin/categories",
    },
    {
      title: "Notifications",
      description: "Send announcements to users",
      icon: <Bell size={24} />,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
      buttonText: "Send Notifications",
      count: "9",
      route: "/admin/notifications",
    },
  ];

  return (
    <div className="p-6 bg-black min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-teal-400">
            MegaMart Admin Panel
          </h1>
          <button
            className="px-4 py-2 bg-teal-500 text-black font-medium rounded-lg hover:bg-teal-600 transition-colors"
            onClick={() =>
              toast.success("Welcome to the Admin Dashboard!")
            }
          >
            Dashboard Overview
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminCards.map((card, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-teal-900 hover:shadow-lg transition-shadow duration-300 border border-gray-700"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`${card.color} p-3 rounded-lg text-black`}>
                    {card.icon}
                  </div>
                  <span className="text-2xl font-bold text-teal-400">
                    {card.count}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-teal-300 mb-1">
                  {card.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {card.description}
                </p>
                <button
                  className={`w-full py-2 text-black rounded-lg ${card.color} ${card.hoverColor} transition-colors font-medium text-sm flex items-center justify-center`}
                  onClick={() => navigate(card.route)}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
