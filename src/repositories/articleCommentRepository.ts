import { Prisma, PrismaClient, Article, ArticleComment } from '@prisma/client';

export class ArticleCommentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.ArticleCommentCreateInput) {
    return this.prisma.articleComment.create({ data });
  }

  async findByArticleId(articleId: Article['id']) {
    return this.prisma.articleComment.findMany({ where: { articleId } });
  }

  async findById(id: ArticleComment['id']) {
    return this.prisma.articleComment.findUnique({ where: { id } });
  }

  async update(
    id: ArticleComment['id'],
    data: Prisma.ArticleCommentUpdateInput,
  ) {
    return this.prisma.articleComment.update({ where: { id }, data });
  }

  async delete(id: ArticleComment['id']) {
    return this.prisma.articleComment.delete({ where: { id } });
  }
}
