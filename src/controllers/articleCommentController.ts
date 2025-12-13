import { Response } from 'express';
import { ArticleCommentService } from '../services/articleCommentService';
import { AuthRequest } from '../lib/types';

export class ArticleCommentController {
  constructor(private articleCommentService: ArticleCommentService) {}

  public createComment = async (req: AuthRequest, res: Response) => {
    const { articleId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    // 서비스 레이어 호출
    const newComment = await this.articleCommentService.createComment(
      articleId,
      authorId,
      content, //body 객체 전체가 아닌, 추출한 content 문자열 전달
    );
    res.status(201).json(newComment);
  };

  public getCommentsByArticleId = async (req: AuthRequest, res: Response) => {
    const { articleId } = req.params;
    const comments = await this.articleCommentService.getComments(articleId);
    res.status(200).json(comments);
  };

  public updateComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    const updateComment = await this.articleCommentService.updateComment(
      commentId,
      authorId,
      { content },
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
