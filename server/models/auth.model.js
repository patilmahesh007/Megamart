import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
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
