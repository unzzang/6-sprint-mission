import { Router } from 'express';
import { prisma } from '../lib/constants';
import { ProductCommentRepository } from '../repositories/productCommentRepository';
import { ProductCommentService } from '../services/productCommentService';
import { ProductCommentController } from '../controllers/productCommentController';
import { asyncHandler } from '../middlewares/asyncHandler';
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
  .patch(isLoggedIn, asyncHandler(productCommentController.updateComment))
  .delete(isLoggedIn, asyncHandler(productCommentController.deleteComment));

router
  .route('/products/:productId/comments')
  .post(isLoggedIn, asyncHandler(productCommentController.createComment))
  .get(asyncHandler(productCommentController.getCommentsByProductId));

export default router;
