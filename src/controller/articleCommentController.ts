import { Response } from 'express';
import { ArticleCommentService } from '../service/articleCommentService';
import { AuthRequest } from '../lib/types';

export class ArticleCommentController {
  constructor(private articleCommentService: ArticleCommentService) {}

  public createComment = async (req: AuthRequest, res: Response) => {
    const { articleId } = req.params;
    const authorId = req.user.id;
    const content = req.body;

    const newComment = await this.articleCommentService.createComment(
      articleId,
      authorId,
      content,
    );
    res.status(201).json(newComment);
  };

  public getCommentsByArticleId = async (req: AuthRequest, res: Response) => {
    const { articleId } = req.params;
    const content = await this.articleCommentService.getComments(articleId);
    res.status(200).json(content);
  };

  public updateComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user.id;
    const content = req.body;

    const updateComment = await this.articleCommentService.updateComment(
      commentId,
      authorId,
      content,
    );
    res.status(200).json(updateComment);
  };

  public deleteComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user.id;

    await this.articleCommentService.deleteComment(commentId, authorId);
    res.status(204).send();
  };
}
