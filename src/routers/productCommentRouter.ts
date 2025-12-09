import { Router } from 'express';
import { prisma } from '../lib/constants';
import { ProductCommentRepository } from '../repositories/productCommentRepository';
import { ProductCommentService } from '../services/productCommentService';
import { ProductCommentController } from '../controllers/productCommentController';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const router = Router();
const productCommentRepository = new ProductCommentRepository(prisma);
const productCommentService = new ProductCommentService(
  productCommentRepository,
);
const productCommentController = new ProductCommentController(
  productCommentService,
);

router
  .route('/comments/:commentId')
  .patch(isLoggedIn, productCommentController.updateComment)
  .delete(isLoggedIn, productCommentController.deleteComment);

router
  .route('/products/:productId/comments')
  .post(isLoggedIn, productCommentController.createComment)
  .get(productCommentController.getCommentsByProductId);

export default router;
