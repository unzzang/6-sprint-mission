import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

import { pagination } from '../middleware/pagination';
import { isLoggedIn } from '../middleware/isLoggedIn';
import { asyncHandler } from '../middleware/asyncHandler';
import { validate, ArticleValidators } from '../middleware/validator';

import { ArticleRepository } from '../repository/articleRepository';
import { ArticleService } from '../service/articleService';
import { ArticleController } from '../controller/articleController';

import { LikeRepository } from '../repository/likeRepository';
import { LikeService } from '../service/likeService';
import { LikeController } from '../controller/likeController';

import { ProductRepository } from '../repository/productRepository';

const router = Router();

const prisma = new PrismaClient();
const articleRepository = new ArticleRepository(prisma);
const productRepository = new ProductRepository(prisma);
const articleService = new ArticleService(articleRepository);
const articleController = new ArticleController(articleService);

const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(
  likeRepository,
  productRepository,
  articleRepository,
);
const likeController = new LikeController(likeService);

const articleValidator = ArticleValidators();

router
  .route('/')
  .post(
    isLoggedIn,
    articleValidator.createValidator,
    validate,
    asyncHandler(articleController.createArticle),
  )
  .get(pagination, asyncHandler(articleController.getArticles));

router
  .route('/:id')
  .patch(
    isLoggedIn,
    articleValidator.validateId,
    articleValidator.updateValidator,
    validate,
    asyncHandler(articleController.updateArticle),
  )
  .get(
    isLoggedIn,
    articleValidator.validateId,
    validate,
    asyncHandler(articleController.getArticleById),
  )
  .delete(
    isLoggedIn,
    articleValidator.validateId,
    validate,
    asyncHandler(articleController.deleteArticle),
  );

router
  .route('/:id/like')
  .post(
    isLoggedIn,
    articleValidator.validateArticleId,
    validate,
    asyncHandler(likeController.toggleArticleLike),
  );

export default router;
