import mongoose from 'mongoose';

const MembershipPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, 
  description: { type: String },
}, {
  timestamps: true,
});

export default mongoose.model('MembershipPlan', MembershipPlanSchema);
