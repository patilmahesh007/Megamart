import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  country: { type: String },
  phone: { type: String }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true, unique: true },
  password: { type: String },
  phone: { type: String, required: true, unique: true, trim: true }, 
  disabled: { type: Boolean, default: false },
  profileImage: { type: String },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false },  
  addresses: [AddressSchema],
  lastLogin: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ['customer', 'admin', 'superadmin'],
    default: 'customer',
  },
}, {
  timestamps: true,
});

UserSchema.methods.clearOtp = async function () {
  this.otp = undefined;
  this.otpExpiresAt = undefined;
  return this.save();
};

export default mongoose.model('User', UserSchema);
