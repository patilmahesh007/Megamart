import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileMyOrders from "../components/ProfileMyOrders.jsx";
import ProfileManageProfile from "../components/ProfileManageProfile.jsx";

function Profile() {
  const [selectedComponent, setSelectedComponent] = useState("MyOrders");

  const renderComponent = () => {
    return selectedComponent === "ManageProfile" ? <ProfileManageProfile /> : <ProfileMyOrders />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex w-[80vw] block mx-auto flex-grow">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white shadow-sm p-4 sticky top-0 h-screen">
          <h2 className="text-lg text-gray-600 mb-4">Personal Information</h2>
          <div className="space-y-2">
            <div
              className={`p-4 rounded-lg font-medium cursor-pointer ${
                selectedComponent === "MyOrders" ? "bg-yellow-400" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedComponent("MyOrders")}
            >
              My Orders
            </div>
            <div
              className={`p-4 rounded-lg font-medium cursor-pointer ${
                selectedComponent === "ManageProfile" ? "bg-yellow-400" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedComponent("ManageProfile")}
            >
              Manage Profile
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-3/4 overflow-y-auto p-4">{renderComponent()}</div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
