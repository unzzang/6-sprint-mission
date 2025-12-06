import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { ProductRepository } from '../repositories/productRepository';
import { ProductService } from '../services/productService';
import { ProductController } from '../controllers/productController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLoggedIn } from '../middlewares/isLoggedIn';

import { LikeRepository } from '../repositories/likeRepository';
import { LikeService } from '../services/likeService';
import { LikeController } from '../controllers/likeController';

const router = Router();

const prisma = new PrismaClient();
const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(likeRepository, productRepository);
const likeController = new LikeController(likeService);

router
  .route('/')
  .post(isLoggedIn, asyncHandler(productController.createProduct))
  .get(asyncHandler(productController.getProducts));

router
  .route('/:id')
  .get(asyncHandler(productController.getProductById))
  .patch(isLoggedIn, asyncHandler(productController.updateProduct))
  .delete(isLoggedIn, asyncHandler(productController.deleteProduct));

router
  .route('/:id/like')
  .post(isLoggedIn, asyncHandler(likeController.toggleProductLike));

export default router;
