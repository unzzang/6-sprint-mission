import { Router } from 'express';
import { login, logout, refresh, signUp } from '../controller/authController';
import { asyncHandler } from '../middleware/asyncHandler';
import { isLoggedIn } from '../middleware/isLoggedIn';
import { AuthValidators, validate } from '../middleware/validator';

const router = Router();
const { loginValidator, signUpValidator } = AuthValidators();

router.route('/signup').post(signUpValidator, validate, asyncHandler(signUp));
router.route('/login').post(loginValidator, validate, asyncHandler(login));
router.route('/logout').post(isLoggedIn, asyncHandler(logout));
router.route('/refresh').post(asyncHandler(refresh));

export default router;
