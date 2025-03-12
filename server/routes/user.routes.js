import express from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  disableUser, 
  enableUser 
} from '../controller/user.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.patch('/:id/disable', disableUser);
router.patch('/:id/enable', enableUser);

export default router;
