import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { ProductRepository } from '../repositories/productRepository';
import { ProductService } from '../services/productService';
import { ProductController } from '../controllers/productController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const router = Router();

const prisma = new PrismaClient();
const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router
  .route('/')
  .post(isLoggedIn, asyncHandler(productController.createProduct))
  .get(asyncHandler(productController.getProducts));

router
  .route('/:id')
  .get(asyncHandler(productController.getProductById))
  .patch(isLoggedIn, asyncHandler(productController.updateProduct))
  .delete(isLoggedIn, asyncHandler(productController.deleteProduct));

export default router;
