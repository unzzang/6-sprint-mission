import { LikeRepository } from '../repositories/likeRepository';
import { ProductRepository } from '../repositories/productRepository';
import type { Product, User } from '@prisma/client';

export class LikeService {
  constructor(
    private likeRepository: LikeRepository,
    private productRepository: ProductRepository,
  ) {}

  async toggleProductLike(userId: User['id'], productId: Product['id']) {
    // 1. 상품 존재 여부 확인
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      // 상품이 없을 경우
      throw new Error('상품을 찾을 수 없습니다.');
    }

    // 2. 사용자가 이미 해당 상품에 '좋아요'를 눌렀는지 확인
    const existingLike = await this.likeRepository.findProductLike(
      userId,
      productId,
    );

    // 3. 토글 로직 수행
    if (existingLike) {
      // '좋아요'가 이미 존자하면 삭제 트랜잭션 실행
      const [, updatedProduct] = await this.likeRepository.deleteProductLike(
        userId,
        productId,
      );
      // 클라이언트에게 현재 '좋아요'상태 전달
      return { liked: false, likeCount: updatedProduct.likeCount - 1 };
    } else {
      // '좋아요'가 없으면 생성 트랜잭션 실행
      const [, updatedProduct] = await this.likeRepository.createProductLike(
        userId,
        productId,
      );
      // 클라이언트에게 현재 '좋아요'상태 전달
      return { liked: true, likeCount: updatedProduct.likeCount + 1 };
    }
  }
}
