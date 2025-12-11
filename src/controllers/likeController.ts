import type { Request, Response } from 'express';
import { LikeService } from '../services/likeService';
import { AuthRequest } from '../lib/types';

export class LikeController {
  constructor(private likeService: LikeService) {}

  // 상품 좋아요 토글
  public toggleProductLike = async (req: AuthRequest, res: Response) => {
    const { id: productId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: '인증 정보가 올바르지 않습니다' });
    }
    const result = await this.likeService.toggleProductLike(userId, productId);

    res.status(200).json(result);
  };
}
