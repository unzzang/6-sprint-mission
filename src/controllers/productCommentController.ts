import { Request, Response } from 'express';
import { ProductCommentService } from '../services/productCommentService';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class ProductCommentController {
  constructor(private readonly productCommentService: ProductCommentService) {}

  public createComment = async (req: AuthRequest, res: Response) => {
    // 1. productId는 URL경로 파라미터에서 받아옴
    const { productId } = req.params;
    // 2. content는 요청 본문(body)에서 받아옴
    const { content } = req.body;
    // 3. userId는 인증정보에서 가져옴
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: '인증 정보가 올바르지 않습니다.' });
    }

    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    // 서비스 레이어 호출
    const newProduct = await this.productCommentService.createComment(
      productId,
      userId,
      content, //body 객체 전체가 아닌, 추출한 content 문자열 전달
    );
    // 성공 응답
    res.status(201).json(newProduct);
  };

  public getCommentsByProductId = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const comments = await this.productCommentService.getComments(productId);
    res.status(200).json(comments);
  };

  public updateComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: '인증 정보가 올바르지 않습니다.' });
    }
    if (!content) {
      return res.status(400).json({ message: '수정할 내용을 입력해주세요.' });
    }

    const updateComment = await this.productCommentService.updateComment(
      commentId,
      userId,
      { content },
    );

    res.status(200).json(updateComment);
  };

  public deleteComment = async (req: AuthRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: '인증 정보가 올바르지 않습니다.' });
    }
    await this.productCommentService.deleteComment(commentId, userId);
    res.status(204).send();
  };
}
