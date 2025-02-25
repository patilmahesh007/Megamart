import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  originalPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  mainImage: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  isMembership: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.model('Product', ProductSchema);
