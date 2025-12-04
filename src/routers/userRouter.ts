import { Router } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getSearchUsers,
  getUserById,
} from '../controllers/userController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { UserValidators, validate } from '../middlewares/validator.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { UserRepository } from '../repositories/userRepository.js';
import { prisma } from '../lib/constants.js';

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
