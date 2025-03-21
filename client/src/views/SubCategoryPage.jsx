import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './../util/api.util';

const SubCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/product/category/67d6c00b701208ad8771dd85`);
        setProducts(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Subcategory Products</h1>
      {products.length === 0 ? (
        <p className="text-gray-600">No products found in this subcategory.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link 
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition"
            >
              <img
                src={product.mainImage || "https://via.placeholder.com/150"}
                alt={product.name}
                className="h-40 object-cover rounded mb-4"  
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">${(product.currentPrice ?? 0).toFixed(2)}</p>
              <button 
                className="mt-auto bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                onClick={(e) => e.preventDefault()}
              >
                Buy Now
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;
