import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ArticleRepository } from '../repositories/articleRepository';
import { ArticleService } from '../services/articleService';
import { ArticleController } from '../controllers/articleController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const router = Router();

const prisma = new PrismaClient();
const articleRepository = new ArticleRepository(prisma);
const articleService = new ArticleService(articleRepository);
const articleController = new ArticleController(articleService);

router
  .route('/')
  .post(isLoggedIn, asyncHandler(articleController.createArticle))
  .get(asyncHandler(articleController.getArticles));

router
  .route('/:id')
  .patch(isLoggedIn, asyncHandler(articleController.updateArticle))
  .get(isLoggedIn, asyncHandler(articleController.getArticleById))
  .delete(isLoggedIn, asyncHandler(articleController.deleteArticle));

export default router;
