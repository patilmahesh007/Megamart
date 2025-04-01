import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product',  },
  quantity: { type: Number,  },
  totalPrice: { type: Number,  },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  },
  orderItems: {
    type: [OrderItemSchema],
    required: true,
    validate: [arrayLimit, 'Order must have at least one item'],
  },
  totalPrice: { type: Number, },
  shippingAddress: {
    street: { type: String,  },
    city: { type: String,  },
    state: { type: String,  },
    zipCode: { type: String,  },
    country: { type: String,  },
  },
  status: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  paymentMode: { type: String,  },
  razorpayPaymentId: { type: String, default: null }, // Nullable until payment is done
  trackingNumber: { type: String, default: null }, // Generated only when shipped
  notes: { type: String },
  deliveredAt: { type: Date, default: null }, // When delivered

}, {
  timestamps: true,
});

// Function to enforce at least one order item
function arrayLimit(val) {
  return val.length > 0;
}

// Generate unique orderId before saving
OrderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

export default mongoose.model('Order', OrderSchema);
