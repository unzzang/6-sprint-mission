import { Prisma, PrismaClient, Product, User } from '@prisma/client';

export class LikeRepository {
  constructor(private prisma: PrismaClient) {}

  // 상품 좋아요 찾기
  async findProductLike(userId: User['id'], productId: Product['id']) {
    return this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  // 상품 좋아요 생성
  async createProductLike(userId: User['id'], productId: Product['id']) {
    return this.prisma.$transaction([
      this.prisma.favorite.create({
        data: { userId, productId },
      }),
      this.prisma.product.update({
        where: { id: productId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
  }

  // 상품 좋아요 삭제
  async deleteProductLike(userId: User['id'], productId: Product['id']) {
    return this.prisma.$transaction([
      this.prisma.favorite.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      }),
      this.prisma.product.update({
        where: { id: productId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
  }
}
