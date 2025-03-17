import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../util/api.util.js";
import { toast } from "react-hot-toast";
import { Settings, Search, Plus, Trash2 } from 'lucide-react';
import ProductForm from '../../components/ProductForm.jsx';

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onClick={() => navigate(`/admin/products/${product._id}`)}
    >
      <div className="relative">
        {product.mainImage ? (
          <img 
            src={product.mainImage} 
            alt={product.name}
            className="h-48 object-cover object-center mx-auto"
            />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
          <p className="text-xs text-gray-300">{product.category?.name || product.category || "Uncategorized"}</p>
          <div className="mt-1 flex items-center">
            <span className="text-lg font-bold text-green-400">₹{product.currentPrice}</span>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="ml-2 text-xs text-gray-300 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-gray-500">Stock: {product.stock}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product._id);
            }}
            className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-colors duration-200"
          >
            <Trash2 size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/product/list");
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleForm = () => {
    setShowAddForm(!showAddForm);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/product/delete/${id}`);
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        toast.error("Error deleting product");
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category?.name || product.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="bg-slate-800 p-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-teal-400">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-slate-700 px-4 py-2 pl-10 rounded-lg text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-semibold">Product Management</h2>
          <button
            className="flex items-center bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md"
            onClick={handleToggleForm}
          >
            <Plus size={18} className="mr-2" />
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showAddForm && (
          <ProductForm
            onSuccess={fetchProducts}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-center text-gray-300 col-span-3">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
