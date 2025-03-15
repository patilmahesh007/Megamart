import React, { useState, useEffect } from 'react';
import { toast } from "react-hot-toast";
import api from "../util/api.util.js";

const ProductForm = ({ editingProduct, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    currentPrice: "",
    originalPrice: "",
    category: "",
    stock: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        currentPrice: editingProduct.currentPrice,
        originalPrice: editingProduct.originalPrice,
        category: editingProduct.category?._id || editingProduct.category || "",
        stock: editingProduct.stock,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        currentPrice: "",
        originalPrice: "",
        category: "",
        stock: "",
      });
      setMainImage(null);
      setImages([]);
    }
  }, [editingProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (mainImage) {
      data.append("mainImage", mainImage);
    }
    images.forEach(file => data.append("images", file));

    try {
      if (editingProduct) {
        await api.put(`/products/update/${editingProduct._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully");
      } else {
        await api.post("/products/add", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product added successfully");
      }
      onSuccess && onSuccess();
      setFormData({
        name: "",
        description: "",
        currentPrice: "",
        originalPrice: "",
        category: "",
        stock: "",
      });
      setMainImage(null);
      setImages([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      currentPrice: "",
      originalPrice: "",
      category: "",
      stock: "",
    });
    setMainImage(null);
    setImages([]);
    onCancel && onCancel();
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {editingProduct ? 'Edit Product' : 'Add New Product'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Product Name</label>
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
            <label className="block text-gray-300 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              required
            />
          </div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Current Price</label>
            <input
              type="number"
              name="currentPrice"
              value={formData.currentPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Original Price</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              required={!editingProduct}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Additional Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            type="submit" 
            className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md"
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
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

export default ProductForm;
