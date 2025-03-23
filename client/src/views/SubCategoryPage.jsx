import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './../util/api.util';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      try {
        const res = await api.get('/cart/get');
        if (res.data.success) {
          const items = res.data.data.items;
          const found = items.find((item) => item.product._id === product._id);
          setCartQuantity(found ? found.quantity : 0);
        }
      } catch (error) {
        console.error('Error fetching cart quantity:', error);
      }
    };
    if (product) {
      fetchCartQuantity();
    }
  }, [product]);

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', { product: product._id, quantity });
      toast.success('Item added to cart!');
      setCartQuantity(quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center hover:shadow-lg transition border border-gray-200">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.mainImage || 'https://via.placeholder.com/150'}
          alt={product.name}
          className="w-full object-cover rounded-md mb-4 h-40 sm:h-44 md:h-48 lg:h-56"
        />
      </Link>
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-1">
        {product.name}
      </h3>
      <p className="text-gray-700 text-center mb-3">
        <span className="font-semibold text-gray-900">Price: </span>
        ${product.currentPrice?.toFixed(2) ?? '0.00'}
      </p>
      <div className="mt-auto w-full flex justify-center">
        {cartQuantity > 0 ? (
          <div className="flex items-center justify-center space-x-4 border border-gray-300 rounded-lg p-2 w-full">
            <button
              onClick={() => setCartQuantity((prev) => Math.max(0, prev - 1))}
              className="w-10 h-10 flex justify-center items-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              –
            </button>
            <span className="text-xl font-semibold">{cartQuantity}</span>
            <button
              onClick={() => setCartQuantity((prev) => prev + 1)}
              className="w-10 h-10 flex justify-center items-center bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 transition text-white text-lg font-semibold rounded flex items-center justify-center"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

const SubCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/product/category/67d6c00b701208ad8771dd85');
        setProducts(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
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
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Subcategory Products
      </h1>
      {products.length === 0 ? (
        <p className="text-gray-600 text-center">No products found in this subcategory.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;
