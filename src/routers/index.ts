import { Router } from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';
import productRouter from './productRouter';
import articleRouter from './articleRouter';
import productCommentRouter from './productCommentRouter';

const router = Router();

router.get('/', (req, res) => {
  res.send('ok');
});

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/article', articleRouter);

router.use(productCommentRouter);

export default router;
