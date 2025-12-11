import { Request, Response } from 'express';
import { ArticleCommentService } from '../services/articleCommentService';
import { AuthRequest } from '../lib/types';

export class ArticleCommentController {
  constructor(private articleCommentService: ArticleCommentService) {}

  public createComment = async (req: AuthRequest, res: Response) => {
    const { articleId } = req.params;
    const { content } = req.body;

    if (!req.user) {
      return res
        .status(401)
        .json({ message: '인증 정보가 올바르지 않습니다.' });
    }

    const authorId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    // 서비스 레이어 호출
    const newComment = await this.articleCommentService.createComment(
      articleId,
      authorId,
      content, //body 객체 전체가 아닌, 추출한 content 문자열 전달
    );
    // 성공 응답
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

    if (!req.user) {
      return res
        .status(401)
        .json({ message: '인증 정보가 올바르지 않습니다.' });
    }

    const authorId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });
    }

    const updateComment = await this.articleCommentService.updateComment(
      commentId,
      authorId,
      { content },
    );

    res.status(200).json(updateComment);
  };

  public deleteComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;

    if (!req.user) {
      return res
        .status(401)
        .json({ message: '인증 정보가 올바르지 않습니다.' });
    }

    const authorId = req.user.id;

    await this.articleCommentService.deleteComment(commentId, authorId);
    res.status(204).send();
  };
}
