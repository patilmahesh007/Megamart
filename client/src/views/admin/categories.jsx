import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import api from "../../util/api.util.js";

const CategoryForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [categoryImg, setCategoryImg] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryImgChange = (e) => {
    setCategoryImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !categoryImg) {
      toast.error("All fields are required");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("categoryImg", categoryImg);

    try {
      await api.post("/category/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Category added successfully");
      onSuccess && onSuccess();
      setFormData({ name: "", description: "" });
      setCategoryImg(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding category");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setCategoryImg(null);
    onCancel && onCancel();
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-1">Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-24"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Category Image</label>
          <div className="flex items-center">
            <label
              htmlFor="categoryImg"
              className="cursor-pointer bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white"
            >
              Choose File
            </label>
            <span className="ml-4 text-gray-400">
              {categoryImg ? categoryImg.name : "No file chosen"}
            </span>
          </div>
          <input
            id="categoryImg"
            type="file"
            accept="image/*"
            onChange={handleCategoryImgChange}
            className="hidden"
            required
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md"
          >
            Add Category
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
