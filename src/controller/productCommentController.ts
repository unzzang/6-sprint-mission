import { Response } from 'express';
import { ProductCommentService } from '../service/productCommentService';
import { AuthRequest } from '../lib/types';

export class ProductCommentController {
  constructor(private readonly productCommentService: ProductCommentService) {}

  public createComment = async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    const authorId = req.user.id;
    const content = req.body;

    const newProduct = await this.productCommentService.createComment(
      productId,
      authorId,
      content,
    );

    res.status(201).json(newProduct);
  };

  public getCommentsByProductId = async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    const content = await this.productCommentService.getComments(productId);
    res.status(200).json(content);
  };

  public updateComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const authorId = req.user.id;
    const content = req.body;

    const updateComment = await this.productCommentService.updateComment(
      commentId,
      authorId,
      content,
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
