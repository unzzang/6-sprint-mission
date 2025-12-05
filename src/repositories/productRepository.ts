import type { Prisma, PrismaClient, User } from '@prisma/client';

export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }
}
