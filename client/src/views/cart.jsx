import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../util/api.util';
import Header from '../components/Header';
import { toast } from 'react-hot-toast';
import Checkout from '../components/Checkout.jsx';

function Cart() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await api.get('/cart/get');
        if (response.data.success) {
          setCartData(response.data.data);
        } else {
          setError('Failed to fetch cart details');
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Unable to fetch cart data');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await api.delete('/cart/remove', { data: { product: productId } });
        toast.success('Item removed from cart');
      } else {
        await api.put('/cart/update', { productId, quantity: newQuantity });
        toast.success('Cart updated');
      }
      const response = await api.get('/cart/get');
      if (response.data.success) {
        setCartData(response.data.data);
      }
    } catch (err) {
      console.error('Error updating cart:', err);
      toast.error('Failed to update cart');
    }
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }
  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
          <p className="text-gray-600">Your cart is currently empty.</p>
          <Link
            to="/"
            className="mt-6 bg-green-700 hover:bg-green-800 transition text-white px-6 py-2 rounded-lg shadow"
          >
            Go Back Home
          </Link>
        </div>
      </>
    );
  }

  const subtotal = cartData.items.reduce((acc, item) => {
    const itemTotal = (item.product.currentPrice || 0) * item.quantity;
    return acc + itemTotal;
  }, 0);

  const totalOriginal = cartData.items.reduce((acc, item) => {
    const original = item.product.originalPrice || 0;
    return acc + original * item.quantity;
  }, 0);

  const moneySaved = totalOriginal > subtotal ? totalOriginal - subtotal : 0;
  const percentSaved = totalOriginal > 0 ? (moneySaved / totalOriginal) * 100 : 0;
  const shipping = 0;
  const taxes = 0;
  const discount = 0;
  const total = subtotal + shipping + taxes - discount;
  const totalItems = cartData.items.reduce((acc, item) => acc + item.quantity, 0);

  const CartItem = ({ item, updateQuantity }) => {
    const product = item.product;
    const itemSubtotal = (product.currentPrice || 0) * item.quantity;
    return (
      <div className="bg-white rounded-lg sm:rounded-none sm:border-b border-gray-200 p-4 sm:py-6">
        <div className="sm:hidden flex flex-col">
          <div className="flex items-start mb-4">
            <button
              className="text-gray-400 hover:text-red-500 mr-2"
              onClick={() => updateQuantity(product._id, 0)}
            >
              ✕
            </button>
            <img
              src={product.mainImage || 'https://via.placeholder.com/80'}
              alt={product.name}
              className="h-20 object-cover rounded-md"  
            />
            <div className="ml-3">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500">Color: Gray</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center border rounded">
              <button
                className="px-3 py-1 text-lg"
                onClick={() =>
                  updateQuantity(product._id, Math.max(1, item.quantity - 1))
                }
              >
                −
              </button>
              <span className="px-3">{item.quantity}</span>
              <button
                className="px-3 py-1 text-lg"
                onClick={() => updateQuantity(product._id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <div className="font-semibold">₹{itemSubtotal.toFixed(2)}</div>
          </div>
        </div>
        <div className="hidden sm:grid grid-cols-12 items-center">
          <div className="col-span-6 flex items-center">
            <button
              className="text-gray-400 hover:text-red-500 mr-4"
              onClick={() => updateQuantity(product._id, 0)}
            >
              ✕
            </button>
            <img
              src={product.mainImage || 'https://via.placeholder.com/80'}
              alt={product.name}
              className="h-16 object-cover block  rounded-md mr-4"  
            />
            <div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500">Color: Gray</p>
            </div>
          </div>
          <div className="col-span-2 text-center">
            ₹{product.currentPrice?.toFixed(2) ?? '0.00'}
          </div>
          <div className="col-span-2 flex justify-center">
            <div className="flex items-center border rounded">
              <button
                className="px-3 py-1 text-lg"
                onClick={() =>
                  updateQuantity(product._id, Math.max(1, item.quantity - 1))
                }
              >
                −
              </button>
              <span className="px-3">{item.quantity}</span>
              <button
                className="px-3 py-1 text-lg"
                onClick={() => updateQuantity(product._id, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="col-span-2 text-center font-semibold">
            ₹{itemSubtotal.toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  const CartSummary = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-fit border border-gray-200 self-start">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Items</span>
            <span className="text-gray-900 font-medium">{totalItems}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Sub Total</span>
            <span className="text-gray-900 font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          {moneySaved > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">You Saved</span>
              <span className="text-green-600 font-medium">
                ₹{moneySaved.toFixed(2)} ({percentSaved.toFixed(0)}%)
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900 font-medium">₹{shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Taxes</span>
            <span className="text-gray-900 font-medium">₹{taxes.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span>Coupon Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center text-gray-900 font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="w-full mt-4 py-3 bg-green-700 hover:bg-green-800 transition text-white font-medium rounded"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-50" style={{ maxWidth: '80vw' }}>
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Shopping Cart</h1>
        <div className="flex justify-center items-center mb-8 text-sm text-gray-600">
          {totalItems} Items in Cart
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col sm:w-8/12 md:w-9/12">
            {cartData.items.map((item) => (
              <CartItem key={item.product._id} item={item} updateQuantity={updateQuantity} />
            ))}
          </div>
          <div className="ml-0 sm:ml-4 sm:w-4/12 md:w-3/12 mt-6 sm:mt-0">
            <CartSummary />
          </div>
        </div>
      </div>
      {showCheckout && <Checkout onClose={() => setShowCheckout(false)} />}
    </>
  );
}

export default Cart;
