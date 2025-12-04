import { Router } from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
// import productRouter from './productRouter.js';
// import articleRouter from './articleRouter.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('ok');
});

router.use('/user', userRouter);
router.use('/auth', authRouter);

// router.use('/product', productRouter);
// router.use('/article', articleRouter);

export default router;
