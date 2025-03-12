import jwt from 'jsonwebtoken';
import User from '../models/auth.model.js';

 const getRequestingUser = async (req) => {
  const token = req.headers.authorization?.split(" ")[1] || req.body.token;
  if (!token) {
    throw new Error("Unauthorized");
  }
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || !decoded._id) {
    throw new Error("Unauthorized");
  }
  
  const requestingUser = await User.findById(decoded._id);
  if (!requestingUser) {
    throw new Error("Unauthorized");
  }
  
  return requestingUser;
};
export default getRequestingUser