import { Router } from 'express';
import { prisma } from '../lib/constants';
import { ProductCommentRepository } from '../repository/productCommentRepository';
import { ProductCommentService } from '../service/productCommentService';
import { ProductCommentController } from '../controller/productCommentController';
import { asyncHandler } from '../middleware/asyncHandler';
import { isLoggedIn } from '../middleware/isLoggedIn';
import { ProductValidators, validate } from '../middleware/validator';

const router = Router();
const productCommentRepository = new ProductCommentRepository(prisma);
const productCommentService = new ProductCommentService(
  productCommentRepository,
);
const productCommentController = new ProductCommentController(
  productCommentService,
);
const productValidator = ProductValidators();

router
  .route('/comments/:id')
  .patch(
    isLoggedIn,
    productValidator.updateCommentValidator,
    validate,
    asyncHandler(productCommentController.updateComment),
  )
  .delete(isLoggedIn, asyncHandler(productCommentController.deleteComment));

router
  .route('/products/:id/comments')
  .post(
    isLoggedIn,
    productValidator.createCommentValidator,
    validate,
    asyncHandler(productCommentController.createComment),
  )
  .get(asyncHandler(productCommentController.getCommentsByProductId));

export default router;
