import { Router } from 'express';
import { login, logout, refresh } from '../controllers/authController.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { AuthValidators, validate } from '../middlewares/validator.js';

const router = Router();
const { loginValidator } = AuthValidators();

router.route('/login').post(loginValidator, validate, asyncHandler(login));
router.route('/logout').post(isLoggedIn, asyncHandler(logout));
router.route('/refresh').post(asyncHandler(refresh));

export default router;
