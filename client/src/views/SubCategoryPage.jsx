import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from './../util/api.util';
import { toast } from 'react-hot-toast';


const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1); 
  const [cartQuantity, setCartQuantity] = useState(0);

  const getLocalCart = () => {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : {};
  };

  const setLocalCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  useEffect(() => {
    if (product) {
      const localCart = getLocalCart();
      setCartQuantity(localCart[product._id] || 0);
    }
  }, [product]);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      try {
        const res = await api.get('/cart/get');
        if (res.data.success) {
          const items = res.data.data.items;
          const found = items.find((item) => item.product._id === product._id);
          if (found) {
            setCartQuantity(found.quantity);
            const localCart = getLocalCart();
            localCart[product._id] = found.quantity;
            setLocalCart(localCart);
          }
        }
      } catch (error) {
        console.error('Error fetching cart quantity:', error);
      }
    };
    if (product) {
      fetchCartQuantity();
    }
  }, [product]);

  const debouncedUpdateCartQuantity = useMemo(
    () =>
      debounce(async (newQuantity) => {
        try {
          await api.put('/cart/update', { productId: product._id, quantity: newQuantity });
          toast.success('Cart updated!');
        } catch (error) {
          console.error('Error updating cart quantity on server:', error);
          toast.error('Failed to update cart on server');
        }
      }, 1000),
    [product]
  );

  const updateCartQuantity = (newQuantity) => {
    setCartQuantity(newQuantity);
    const localCart = getLocalCart();
    localCart[product._id] = newQuantity;
    setLocalCart(localCart);
    debouncedUpdateCartQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', { product: product._id, quantity });
      toast.success('Item added to cart!');
      updateCartQuantity(quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const incrementCart = () => {
    updateCartQuantity(cartQuantity + 1);
  };

  const decrementCart = () => {
    updateCartQuantity(Math.max(0, cartQuantity - 1));
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
              onClick={decrementCart}
              className="w-10 h-10 flex justify-center items-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              –
            </button>
            <span className="text-xl font-semibold">{cartQuantity}</span>
            <button
              onClick={incrementCart}
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
        <p className="text-gray-600 text-center">
          No products found in this subcategory.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) =>
            product && product._id ? (
              <ProductCard key={product._id} product={product} />
            ) : (
              <div key={product?._id || product?.name} className="text-red-500">
                Invalid product data
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;
