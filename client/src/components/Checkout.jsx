import React, { useState, useEffect } from 'react';
import Payment from './Payment';
import api from '../util/api.util'; // Assuming you have a utility for making API calls
import { toast } from 'react-hot-toast';

function Checkout({ onClose }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [total, setTotal] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // Fetch user addresses and cart data
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/users/address');
        if (response.data.success) {
          setAddresses(response.data.data.addresses);
        } else {
          toast.error('Failed to fetch addresses.');
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to fetch addresses.');
      }
    };

    const fetchCart = async () => {
      try {
        const response = await api.get('/cart/get');
        if (response.data.success) {
          setOrderItems(response.data.data.items);
          const totalAmount = response.data.data.items.reduce(
            (sum, item) => sum + item.product.currentPrice * item.quantity,
            0
          );
          setTotal(totalAmount);
        } else {
          toast.error('Failed to fetch cart items.');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to fetch cart items.');
      }
    };

    fetchAddresses();
    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = async () => {
    const addressToUse = isAddingNewAddress ? newAddress : selectedAddress;

    if (!addressToUse || !addressToUse.street || !addressToUse.city || !addressToUse.state || !addressToUse.zipCode || !addressToUse.country) {
      toast.error('Please fill all required address fields.');
      return;
    }

    if (!total || orderItems.length === 0) {
      toast.error('Cart is empty or total amount is unavailable.');
      return;
    }

    try {
      const orderData = {
        orderItems: orderItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          totalPrice: item.product.currentPrice
        })),
        totalPrice: total,
        shippingAddress: addressToUse
      };

      const response = await api.post('/order/create', orderData);

      if (response.data.success) {
        setShowPayment(true);
        toast.success('Order created successfully! Proceeding to payment.');
      } else {
        toast.error('Failed to create order.');
      }
    } catch (error) {
      console.error('Error during payment process:', error);
      toast.error('Failed to proceed with payment.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✕</button>
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <p className="mb-4">Total Amount: <span className="font-semibold">₹{total}</span></p>

        {!showPayment ? (
          <>
            <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>

            {isAddingNewAddress ? (
              <div className="space-y-3">
                <input type="text" name="street" value={newAddress.street} onChange={handleInputChange} placeholder="Street" className="border p-2 w-full rounded" />
                <input type="text" name="city" value={newAddress.city} onChange={handleInputChange} placeholder="City" className="border p-2 w-full rounded" />
                <input type="text" name="state" value={newAddress.state} onChange={handleInputChange} placeholder="State" className="border p-2 w-full rounded" />
                <input type="text" name="zipCode" value={newAddress.zipCode} onChange={handleInputChange} placeholder="Zip Code" className="border p-2 w-full rounded" />
                <input type="text" name="country" value={newAddress.country} onChange={handleInputChange} placeholder="Country" className="border p-2 w-full rounded" />
                <input type="text" name="phone" value={newAddress.phone} onChange={handleInputChange} placeholder="Phone (optional)" className="border p-2 w-full rounded" />
                <button onClick={() => setIsAddingNewAddress(false)} className="bg-blue-600 text-white py-2 px-4 rounded w-full">Save New Address</button>
              </div>
            ) : (
              <>
                {addresses.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Select Address</h4>
                    {addresses.map((address, index) => (
                      <div key={index} className="border p-3 rounded">
                        <p>{address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}</p>
                        <p>{address.phone && `Phone: ${address.phone}`}</p>
                        <button
                          onClick={() => setSelectedAddress(address)}
                          className={`mt-2 ${selectedAddress === address ? 'text-blue-600' : 'text-gray-600'} underline`}
                        >
                          {selectedAddress === address ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => setIsAddingNewAddress(true)} className="text-blue-600 mt-4">Add New Address</button>
              </>
            )}

            <button onClick={handlePay} className="w-full mt-4 py-2 bg-green-600 text-white rounded">Pay ₹{total}</button>
          </>
        ) : (
          <Payment total={total} address={selectedAddress || newAddress} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

export default Checkout;
