import { Router } from 'express';
import { prisma } from '../lib/constants';
import { ArticleCommentRepository } from '../repository/articleCommentRepository';
import { ArticleCommentService } from '../service/articleCommentService';
import { ArticleCommentController } from '../controller/articleCommentController';
import { asyncHandler } from '../middleware/asyncHandler';
import { isLoggedIn } from '../middleware/isLoggedIn';
import { ArticleValidators, validate } from '../middleware/validator';

const router = Router();
const articleCommentRepository = new ArticleCommentRepository(prisma);
const articleCommentService = new ArticleCommentService(
  articleCommentRepository,
);
const articleCommentController = new ArticleCommentController(
  articleCommentService,
);
const articleValidator = ArticleValidators();

router
  .route('/articles/:id/comments')
  .post(
    isLoggedIn,
    articleValidator.createCommentValidator,
    validate,
    asyncHandler(articleCommentController.createComment),
  )
  .get(asyncHandler(articleCommentController.getCommentsByArticleId));

router
  .route('/comments/:id')
  .patch(
    isLoggedIn,
    articleValidator.updateCommentValidator,
    validate,
    asyncHandler(articleCommentController.updateComment),
  )
  .delete(isLoggedIn, asyncHandler(articleCommentController.deleteComment));

export default router;
