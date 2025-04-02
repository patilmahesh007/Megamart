import React, { useEffect } from 'react';
import api from '../util/api.util';
import { toast } from 'react-hot-toast';

function Payment({ total, address, orderId, onClose }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      const createResponse = await api.post('/payment/create', {
        amount: total,
        currency: "INR"
      });
      if (!createResponse.data.success) {
        toast.error("Failed to create payment");
        return;
      }

      const { id: razorpayOrderId } = createResponse.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        order_id: razorpayOrderId,
        name: "Megamart",
        description: "Payment for your order",
        image: "https://yourdomain.com/logo.png",
        handler: async function (response) {
          const paymentData = {
            orderId: orderId,
            razorpayOrderId: razorpayOrderId, 
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: total
          };
          try {
            const verifyResponse = await api.post('/payment/verify-payment', paymentData);
            if (verifyResponse.data.success) {
              toast.success("Payment verified successfully!");
              onClose();
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Payment verification error.");
          }
        },
        prefill: {
          name: address.name || "",
          email: address.email || "",
          contact: address.phone || ""
        },
        notes: {
          address: `${address.street}, ${address.city}, ${address.state}` || ""
        },
        theme: {
          color: "#F37254"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error during payment process:", error);
      toast.error("Payment process failed.");
    }
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
