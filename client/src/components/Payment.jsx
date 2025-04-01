import React from 'react';

function Payment({ total, address, onClose }) {
  const handlePayment = () => {
    alert(`Payment of ₹${total} is being processed for ${address.street}, ${address.city}`);
    onClose();
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <p className="mb-2">Total Amount: <span className="font-bold">₹{total}</span></p>
      <p className="mb-4">Delivering to: {address.street}, {address.city}</p>
      <button onClick={handlePayment} className="bg-blue-600 text-white py-2 px-4 rounded">Pay Now</button>
    </div>
  );
}

export default Payment;
