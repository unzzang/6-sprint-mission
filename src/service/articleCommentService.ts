import { Article, ArticleComment, User, Prisma } from '@prisma/client';
import { ArticleCommentRepository } from '../repository/articleCommentRepository';

export class ArticleCommentService {
  constructor(private articleCommentRepository: ArticleCommentRepository) {}

  async createComment(
    articleId: Article['id'],
    authorId: User['id'],
    content: string,
  ) {
    const data: Prisma.ArticleCommentCreateInput = {
      article: { connect: { id: articleId } },
      author: { connect: { id: authorId } },
      content,
    };
    return this.articleCommentRepository.create(data);
  }

  async getComments(articleId: Article['id']) {
    return this.articleCommentRepository.findByArticleId(articleId);
  }

  async updateComment(
    commentId: ArticleComment['id'],
    authorId: User['id'],
    data: Prisma.ArticleCommentUpdateInput,
  ) {
    await this.checkCommentOwner(commentId, authorId);
    return this.articleCommentRepository.update(commentId, data);
  }

  async deleteComment(commentId: ArticleComment['id'], authorId: User['id']) {
    await this.checkCommentOwner(commentId, authorId);
    return this.articleCommentRepository.delete(commentId);
  }

  // 헬퍼 메소드
  async checkCommentOwner(
    commentId: ArticleComment['id'],
    authorId: User['id'],
  ) {
    const comment = await this.articleCommentRepository.findById(commentId);

    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    if (comment.authorId !== authorId) {
      throw new Error('수정 및 삭제할 권한이 없습니다.');
    }
  }
}
