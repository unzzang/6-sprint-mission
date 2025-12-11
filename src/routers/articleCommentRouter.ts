import { Router } from 'express';
import { prisma } from '../lib/constants';
import { ArticleCommentRepository } from '../repositories/articleCommentRepository';
import { ArticleCommentService } from '../services/articleCommentService';
import { ArticleCommentController } from '../controllers/articleCommentController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const router = Router();
const articleCommentRepository = new ArticleCommentRepository(prisma);
const articleCommentService = new ArticleCommentService(
  articleCommentRepository,
);
const articleCommentController = new ArticleCommentController(
  articleCommentService,
);

router
  .route('/articles/:articleId/comments')
  .post(isLoggedIn, asyncHandler(articleCommentController.createComment))
  .get(asyncHandler(articleCommentController.getCommentsByArticleId));

router
  .route('/comments/:commentId')
  .patch(isLoggedIn, asyncHandler(articleCommentController.updateComment))
  .delete(isLoggedIn, asyncHandler(articleCommentController.deleteComment));

export default router;
