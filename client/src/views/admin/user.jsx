import React, { useEffect, useState } from 'react';
import api from '../../util/api.util.js';
import { toast } from 'react-hot-toast';
import { 
  MoreVertical, 
  Phone, 
  MapPin, 
  User as UserIcon, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import LoginGraph  from "../../components/LoginGraph.jsx"
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDisableUser = async (userId) => {
    try {
      await api.patch(
        `/users/${userId}/disable`,
        {},
      );
      toast.success("User disabled successfully");
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, disabled: true } : user
        )
      );
      setOpenDropdown(null);
    } catch (error) {
      console.error("Error disabling user:", error);
      toast.error("Failed to disable user");
    }
  };

  const handleEnableUser = async (userId) => {
    try {
      await api.patch(
        `/users/${userId}/enable`,
      );
      toast.success("User enabled successfully");
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, disabled: false } : user
        )
      );
      setOpenDropdown(null);
    } catch (error) {
      console.error("Error enabling user:", error);
      toast.error("Failed to enable user");
    }
  };

  const toggleDropdown = (userId) => {
    setOpenDropdown(openDropdown === userId ? null : userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-aquamarine">
          <div className="h-8 w-8 rounded-full border-4 border-aquamarine border-t-transparent animate-spin mb-3 mx-auto"></div>
          <p className="text-xl font-semibold">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
          <LoginGraph />

      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-aquamarine to-teal-300">
        User Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(user => (
          <div 
            key={user._id} 
            className={`relative rounded-lg overflow-hidden ${
              user.disabled 
                ? 'border border-red-500/50 shadow-md shadow-red-500/10' 
                : 'border border-aquamarine/50 shadow-md shadow-aquamarine/30'
            }`}
          >
            <div className={`p-4 ${
              user.disabled
                ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
                : 'bg-gradient-to-r from-teal-600 to-aquamarine'
            }`}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">{user.name}</h2>
                <button 
                  onClick={() => toggleDropdown(user._id)}
                  className="rounded-full p-1 hover:bg-black/20"
                >
                  <MoreVertical size={20} className="text-white" />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 p-5">
              <div className="flex mb-5">
                <div className={`w-20 h-20 mr-4 rounded-full overflow-hidden flex items-center justify-center ${
                  user.disabled 
                    ? 'bg-gray-800 border-2 border-gray-600' 
                    : 'bg-gray-800 border-2 border-aquamarine'
                }`}>
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <UserIcon size={36} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Mail size={16} className="mr-2 text-white" />
                    <p className="text-gray-300 text-sm">{user.email}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <Phone size={16} className="mr-2 text-white" />
                    <p className="text-gray-300 text-sm">{user.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-white" />
                    <p className="text-gray-300 text-sm truncate">
                      {user.addresses && user.addresses.length > 0 
                        ? `${user.addresses[0].street}, ${user.addresses[0].city}` 
                        : 'No address'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-800 my-4"></div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center px-3 py-1 rounded-md bg-aquamarine/20 text-white">
                  <Shield size={14} className="mr-2 text-white" />
                  <span className="text-sm font-medium">{user.role}</span>
                </div>
                
                <div className={`flex items-center px-3 py-1 rounded-md ${
                  user.disabled 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {user.disabled ? (
                    <>
                      <XCircle size={14} className="mr-2 text-white" />
                      <span className="text-sm font-medium">Disabled</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} className="mr-2 text-white" />
                      <span className="text-sm font-medium">Active</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {openDropdown === user._id && (
              <div className="absolute top-12 right-4 bg-gray-800 shadow-lg rounded-md py-1 z-10 border border-gray-700">
                <button 
                  onClick={() => handleDisableUser(user._id)}
                  className="block w-full px-4 py-2 text-red-400 hover:bg-gray-700 text-left text-sm"
                >
                  <span className="flex items-center">
                    <XCircle size={14} className="mr-2 text-white" />
                    Disable User
                  </span>
                </button>
                <button 
                  onClick={() => handleEnableUser(user._id)}
                  className="block w-full px-4 py-2 text-aquamarine hover:bg-gray-700 text-left text-sm"
                >
                  <span className="flex items-center text-white">
                    <CheckCircle size={14} className="mr-2 text-white" />
                    Enable User
                  </span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
