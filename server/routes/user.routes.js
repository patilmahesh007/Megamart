import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  disableUser, 
  enableUser,
  addUserAddress,
  updateUserAddress,
  getUserAddress
} from '../controller/user.controller.js';
import { getLoginStats } from '../controller/loginStats.controller.js';

const router = express.Router();

router.get('/login-stats', getLoginStats);
router.get('/address', getUserAddress);
router.post('/address', addUserAddress);
router.put('/address', updateUserAddress);
router.patch('/', updateUser);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id/disable', disableUser);
router.patch('/:id/enable', enableUser);

export default router;
