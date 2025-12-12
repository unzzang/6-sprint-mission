import { Request, Response } from 'express';
import { Article } from '@prisma/client';
import { ArticleService, CreateArticleDTO } from '../services/articleService';
import { AuthRequest } from '../lib/types';

export class ArticleController {
  constructor(private articleService: ArticleService) {}

  public createArticle = async (req: AuthRequest, res: Response) => {
    const articleData: CreateArticleDTO = req.body;
    const userId = req.user.id;

    const article = await this.articleService.createArticle(
      userId,
      articleData,
    );

    res.status(201).json(article);
  };

  public getArticles = async (req: Request, res: Response) => {
    const { skip, take } = (req as any).pagination;
    const articles = await this.articleService.findArticles({ skip, take });
    res.status(200).json(articles);
  };

  public getArticleById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const article = await this.articleService.findArticleById(id);

    res.status(200).json(article);
  };

  public updateArticle = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const userId = req.user.id;

    const newArticle = await this.articleService.updateArticle(
      id,
      userId,
      data,
    );

    res.status(200).json(newArticle);
  };

  public deleteArticle = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.articleService.deleteArticle(id, userId);

    res.status(204).send();
  };
}
