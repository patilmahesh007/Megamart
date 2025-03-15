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
    brand: "",
    dietaryPreference: "",
    allergenInformation: "",
    servingSize: "",
    disclaimer: "",
    customerCareDetails: "",
    sellerName: "",
    sellerAddress: "",
    sellerLicenseNo: "",
    manufacturerName: "",
    manufacturerAddress: "",
    countryOfOrigin: "",
    shelfLife: ""
  });
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/list");
        setCategories(res.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        currentPrice: editingProduct.currentPrice,
        originalPrice: editingProduct.originalPrice,
        category: editingProduct.category?._id || editingProduct.category || "",
        stock: editingProduct.stock,
        brand: editingProduct.brand || "",
        dietaryPreference: editingProduct.dietaryPreference || "",
        allergenInformation: editingProduct.allergenInformation || "",
        servingSize: editingProduct.servingSize || "",
        disclaimer: editingProduct.disclaimer || "",
        customerCareDetails: editingProduct.customerCareDetails || "",
        sellerName: editingProduct.sellerName || "",
        sellerAddress: editingProduct.sellerAddress || "",
        sellerLicenseNo: editingProduct.sellerLicenseNo || "",
        manufacturerName: editingProduct.manufacturerName || "",
        manufacturerAddress: editingProduct.manufacturerAddress || "",
        countryOfOrigin: editingProduct.countryOfOrigin || "",
        shelfLife: editingProduct.shelfLife || ""
      });
    } else {
      setFormData({
        name: "",
        description: "",
        currentPrice: "",
        originalPrice: "",
        category: "",
        stock: "",
        brand: "",
        dietaryPreference: "",
        allergenInformation: "",
        servingSize: "",
        disclaimer: "",
        customerCareDetails: "",
        sellerName: "",
        sellerAddress: "",
        sellerLicenseNo: "",
        manufacturerName: "",
        manufacturerAddress: "",
        countryOfOrigin: "",
        shelfLife: ""
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
      // Reset the form fields after success
      setFormData({
        name: "",
        description: "",
        currentPrice: "",
        originalPrice: "",
        category: "",
        stock: "",
        brand: "",
        dietaryPreference: "",
        allergenInformation: "",
        servingSize: "",
        disclaimer: "",
        customerCareDetails: "",
        sellerName: "",
        sellerAddress: "",
        sellerLicenseNo: "",
        manufacturerName: "",
        manufacturerAddress: "",
        countryOfOrigin: "",
        shelfLife: ""
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
      brand: "",
      dietaryPreference: "",
      allergenInformation: "",
      servingSize: "",
      disclaimer: "",
      customerCareDetails: "",
      sellerName: "",
      sellerAddress: "",
      sellerLicenseNo: "",
      manufacturerName: "",
      manufacturerAddress: "",
      countryOfOrigin: "",
      shelfLife: ""
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
        {/* Product Name and Category */}
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
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Description */}
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
        {/* Pricing and Stock */}
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
        {/* Additional Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Dietary Preference</label>
            <input
              type="text"
              name="dietaryPreference"
              value={formData.dietaryPreference}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Allergen Information</label>
          <textarea
            name="allergenInformation"
            value={formData.allergenInformation}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Serving Size</label>
          <input
            type="text"
            name="servingSize"
            value={formData.servingSize}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          />
        </div>
        {/* Extra Information */}
        <div>
          <label className="block text-gray-300 mb-1">Disclaimer</label>
          <textarea
            name="disclaimer"
            value={formData.disclaimer}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Customer Care Details</label>
          <textarea
            name="customerCareDetails"
            value={formData.customerCareDetails}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20"
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Seller Name</label>
            <input
              type="text"
              name="sellerName"
              value={formData.sellerName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Seller Address</label>
            <input
              type="text"
              name="sellerAddress"
              value={formData.sellerAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Seller License No.</label>
          <input
            type="text"
            name="sellerLicenseNo"
            value={formData.sellerLicenseNo}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Manufacturer Name</label>
            <input
              type="text"
              name="manufacturerName"
              value={formData.manufacturerName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Manufacturer Address</label>
            <input
              type="text"
              name="manufacturerAddress"
              value={formData.manufacturerAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1">Country of Origin</label>
            <input
              type="text"
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Shelf Life</label>
            <input
              type="text"
              name="shelfLife"
              value={formData.shelfLife}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            />
          </div>
        </div>
        {/* Custom File Inputs */}
        <div>
          <label className="block text-gray-300 mb-1">Main Image</label>
          <div className="flex items-center">
            <label htmlFor="mainImage" className="cursor-pointer bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white">
              Choose File
            </label>
            <span className="ml-4 text-gray-400">
              {mainImage ? mainImage.name : "No file chosen"}
            </span>
          </div>
          <input
            id="mainImage"
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            className="hidden"
            required={!editingProduct}
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Additional Images</label>
          <div className="flex items-center">
            <label htmlFor="additionalImages" className="cursor-pointer bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white">
              Choose Files
            </label>
            <span className="ml-4 text-gray-400">
              {images.length > 0 ? `${images.length} file(s) chosen` : "No file chosen"}
            </span>
          </div>
          <input
            id="additionalImages"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="hidden"
          />
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
