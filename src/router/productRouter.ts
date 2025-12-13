import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { isLoggedIn } from '../middleware/isLoggedIn';
import { pagination } from '../middleware/pagination';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate, ProductValidators } from '../middleware/validator';

import { ProductRepository } from '../repository/productRepository';
import { ProductService } from '../service/productService';
import { ProductController } from '../controller/productController';

import { LikeRepository } from '../repository/likeRepository';
import { LikeService } from '../service/likeService';
import { LikeController } from '../controller/likeController';

import { ArticleRepository } from '../repository/articleRepository';

const router = Router();

const prisma = new PrismaClient();

const articleRepository = new ArticleRepository(prisma);

const productRepository = new ProductRepository(prisma);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(
  likeRepository,
  productRepository,
  articleRepository,
);
const likeController = new LikeController(likeService);
const productValidator = ProductValidators();

router
  .route('/')
  .post(
    isLoggedIn,
    productValidator.createValidator,
    validate,
    asyncHandler(productController.createProduct),
  )
  .get(pagination, asyncHandler(productController.getProducts));

router
  .route('/:id')
  .get(
    productValidator.validateId,
    validate,
    asyncHandler(productController.getProductById),
  )
  .patch(
    isLoggedIn,
    productValidator.validateId,
    productValidator.updateValidator,
    validate,
    asyncHandler(productController.updateProduct),
  )
  .delete(
    isLoggedIn,
    productValidator.validateId,
    validate,
    asyncHandler(productController.deleteProduct),
  );

router
  .route('/:id/like')
  .post(
    isLoggedIn,
    productValidator.validateId,
    validate,
    asyncHandler(likeController.toggleProductLike),
  );

export default router;
