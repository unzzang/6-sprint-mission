import { Router } from 'express';
import {
  getUser,
  updateUser,
  deleteUser,
  getSearchUsers,
  getUserById,
} from '../controller/userController';
import { asyncHandler } from '../middleware/asyncHandler';
import { UserValidators, validate } from '../middleware/validator';
import { isLoggedIn } from '../middleware/isLoggedIn';
import { UserRepository } from '../repository/userRepository';
import { prisma } from '../lib/constants';

const userRepository = new UserRepository(prisma);

const { deleteValidator } = UserValidators(userRepository);
const router = Router();

router.route('/').get(isLoggedIn, asyncHandler(getSearchUsers));

router
  .route('/:id')
  .get(asyncHandler(getUserById))
  .get(isLoggedIn, asyncHandler(getUser))
  .patch(isLoggedIn, asyncHandler(updateUser))
  .delete(isLoggedIn, deleteValidator, validate, asyncHandler(deleteUser));

export default router;
