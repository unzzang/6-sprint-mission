import { Router } from 'express';
import {
  createUser,
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
const { registerValidator, deleteValidator } = UserValidators(userRepository);
const router = Router();

router
  .route('/')
  .post(registerValidator, validate, asyncHandler(createUser))
  .get(isLoggedIn, asyncHandler(getSearchUsers));

router
  .route('/:id')
  .patch(isLoggedIn, asyncHandler(updateUser))
  .get(asyncHandler(getUserById))
  .get(isLoggedIn, asyncHandler(getUser))
  .delete(isLoggedIn, deleteValidator, validate, asyncHandler(deleteUser));

export default router;
