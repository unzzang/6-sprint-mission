import { Request, Response } from 'express';
import { ProductCommentService } from '../services/productCommentService';
import { AuthRequest } from '../lib/types';

export class ProductCommentController {
  constructor(private readonly productCommentService: ProductCommentService) {}

  public createComment = async (req: AuthRequest, res: Response) => {
    // productId는 URL 파라미터, content는 본문(body), userId는 인증정보에서 받아 옴
    const { productId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    // 서비스 레이어 호출
    const newProduct = await this.productCommentService.createComment(
      productId,
      authorId,
      content, //body 객체 전체가 아닌, 추출한 content 문자열 전달
    );
    // 성공 응답
    res.status(201).json(newProduct);
  };

  public getCommentsByProductId = async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    const comments = await this.productCommentService.getComments(productId);
    res.status(200).json(comments);
  };

  public updateComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    const updateComment = await this.productCommentService.updateComment(
      commentId,
      authorId,
      { content },
    );

    res.status(200).json(updateComment);
  };

  public deleteComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user.id;

    await this.productCommentService.deleteComment(commentId, authorId);
    res.status(204).send();
  };
}
