import React, { useState, useEffect, useCallback } from "react";
import api from "../util/api.util";
import { toast } from "react-hot-toast";
import { Camera, User, Phone, Mail, MapPin } from "lucide-react";

function ProfileManageProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Fetch profile using GET /users/profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/profile");
      if (response.data.success) {
        const user = response.data.data.user;
        setProfile(user);
        setPhone(user.phone);
        setName(user.name || "");
        setEmail(user.email || "");
        setPreview(user.profileImage || "");
      } else {
        toast.error("Failed to fetch profile.");
      }
    } catch (error) {
      console.error("Error fetching profile:", JSON.stringify(error, null, 2));
      toast.error("Error fetching profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Update profile using PUT /users/profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("phone", phone);
      formData.append("name", name);
      formData.append("email", email);
      if (image) formData.append("profileImage", image);

      const response = await api.put("/users/profile", formData);

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setProfile(response.data.data.user);
        setPreview(response.data.data.user.profileImage || "");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", JSON.stringify(error, null, 2));
      toast.error("Error updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-4 text-center">No profile data available</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><User className="w-6 h-6" /> My Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover mb-2 shadow-md"
            />
          )}
          <label className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline">
            <Camera className="w-5 h-5" /> Change Profile Picture
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={updating} />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2"><User className="w-5 h-5" /> User ID</label>
          <p className="p-3 border rounded-md bg-gray-100">{profile._id}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2"><User className="w-5 h-5" /> Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={updating}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2"><Mail className="w-5 h-5" /> Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={updating}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2"><Phone className="w-5 h-5" /> Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={updating}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2"><User className="w-5 h-5" /> Role</label>
          <p className="p-3 border rounded-md bg-gray-100">{profile.role}</p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default ProfileManageProfile;
