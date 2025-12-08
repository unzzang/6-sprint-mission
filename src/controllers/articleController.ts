import { Request, Response } from 'express';
import { Article } from '@prisma/client';
import { ArticleService, CreateArticleDTO } from '../services/articleService';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class ArticleController {
  constructor(private articleService: ArticleService) {}

  public createArticle = async (req: AuthRequest, res: Response) => {
    const articleData: CreateArticleDTO = req.body;
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error('인증정보가 올바르지 않습니다.');
      (error as any).status = 401;
      throw error;
    }

    const article = await this.articleService.createArticle(
      userId,
      articleData,
    );

    res.status(201).json(article);
  };

  public getArticles = async (req: Request, res: Response) => {
    const { page: pageStr, limit: limitStr } = req.query;

    const page = pageStr ? parseInt(pageStr as string, 10) : 1;
    const limit = limitStr ? parseInt(limitStr as string, 10) : 10;

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      const error = new Error('유효하지 않은 페이지입니다.');
      (error as any).status = 400; // 400 Bad Request
      throw error;
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const articles = await this.articleService.findArticles({ skip, take });

    res.status(200).json(articles);
  };

  public getArticleById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const article = await this.articleService.findArticleById(id);

    if (!article) {
      const error = new Error('게시글을 찾을 수 없습니다.');
      (error as any).status = 404;
      throw error;
    }

    res.status(200).json(article);
  };

  public updateArticle = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error('사용자 인증정보를 찾을 수 없습니다.');
      (error as any).status = 401;
      throw error;
    }

    const newArticle = await this.articleService.updateArticle(
      id,
      userId,
      data,
    );

    res.status(200).json(newArticle);
  };

  public deleteArticle = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      const error = new Error('사용자 인증정보를 찾을 수 없습니다.');
      (error as any).status = 401;
      throw error;
    }

    await this.articleService.deleteArticle(id, userId);

    res.status(204).send();
  };
}
