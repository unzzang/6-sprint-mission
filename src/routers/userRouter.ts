import { Router } from 'express';
import {
  getUser,
  updateUser,
  deleteUser,
  getSearchUsers,
  getUserById,
} from '../controllers/userController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { UserValidators, validate } from '../middlewares/validator';
import { isLoggedIn } from '../middlewares/isLoggedIn';
import { UserRepository } from '../repositories/userRepository';
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
