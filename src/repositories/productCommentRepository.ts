import type {
  Prisma,
  PrismaClient,
  User,
  Product,
  ProductComment,
} from '@prisma/client';

export class ProductCommentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.ProductCommentCreateInput) {
    return this.prisma.productComment.create({ data });
  }

  async findByProductId(productId: Product['id']) {
    return this.prisma.productComment.findMany({ where: { productId } });
  }

  async findById(id: ProductComment['id']) {
    return this.prisma.productComment.findUnique({ where: { id } });
  }

  async findByUserId(authorId: User['id']) {
    return this.prisma.productComment.findMany({ where: { authorId } });
  }

  async update(
    id: ProductComment['id'],
    data: Prisma.ProductCommentUpdateInput,
  ) {
    return this.prisma.productComment.update({ where: { id }, data });
  }

  async delete(id: ProductComment['id']) {
    return this.prisma.productComment.delete({ where: { id } });
  }
}
