import React, { useEffect } from 'react';
import api from '../util/api.util';
import { toast } from 'react-hot-toast';

function Payment({ total, address, orderId, onClose }) {
  // Dynamically load the Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    // Using CRA's environment variable replacement
    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY || 'YOUR_RAZORPAY_KEY';
    
    const options = {
      key: razorpayKey,
      amount: total * 100, // Amount in paisa
      currency: "INR",
      name: "Megamart",
      description: "Payment for your order",
      image: "https://yourdomain.com/logo.png", // Optional: your logo
      // Uncomment below if your backend generates a Razorpay order id
      // order_id: orderId,
      handler: async function (response) {
        try {
          const paymentData = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            orderId: orderId, // Pass orderId for payment verification if needed
          };
          const verifyResponse = await api.post('/payment/verify', paymentData);
          if (verifyResponse.data.success) {
            toast.success("Payment verified successfully!");
            onClose(); // Close or redirect after successful payment
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast.error("Payment verification error.");
        }
      },
      prefill: {
        name: address?.name || "",
        email: address?.email || "",
        contact: address?.phone || "",
      },
      notes: {
        address: `${address.street}, ${address.city}, ${address.state}` || "",
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <p className="mb-4">
        Amount to Pay: <span className="font-semibold">₹{total}</span>
      </p>
      <button onClick={handlePayment} className="w-full py-2 bg-blue-600 text-white rounded">
        Pay Now
      </button>
    </div>
  );
}

export default Payment;
