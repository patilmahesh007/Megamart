import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../util/api.util.js";
import { toast } from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    currentPrice: "",
    originalPrice: "",
    category: "",
    stock: ""
  });
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [existingProduct, setExistingProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const res = await api.get(`/product/get/${id}`); 
        const product = res.data.data;
        setExistingProduct(product);
        setFormData({
          name: product.name,
          description: product.description,
          currentPrice: product.currentPrice,
          originalPrice: product.originalPrice,
          category: product.category?.name || product.category,
          stock: product.stock
        });
      } catch (error) {
        toast.error("Failed to fetch product details");
      }
    };

    fetchProductDetail();
  }, [id]);

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
      await api.put(`/product/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully");
      navigate(-1); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating product");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-teal-400 hover:underline">
        &larr; Back
      </button>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      {existingProduct ? (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div>
            <img
              src={existingProduct.mainImage}
              alt={existingProduct.name}
              className="w-full h-64 object-cover rounded"
            />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {existingProduct.images && existingProduct.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Additional ${idx}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
          {/* Editable Product Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Product Name</label>
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
              <label className="block mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-24"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Current Price</label>
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
                <label className="block mb-1">Original Price</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Main Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Additional Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md"
            >
              Update Product
            </button>
          </form>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetailPage;
