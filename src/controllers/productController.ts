import type { Request, Response } from 'express';
import { AuthRequest } from '../lib/types';
import { CreateProductDTO } from '../lib/dto';
import { ProductService } from '../services/productService';

export class ProductController {
  constructor(private productService: ProductService) {}

  // 상품 생성 콘트롤러
  public createProduct = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const product: CreateProductDTO = req.body;

    const newProduct = await this.productService.createProduct(userId, product);
    res.status(201).json(newProduct);
  };

  // 상품목록조회
  public getProducts = async (req: Request, res: Response) => {
    const { skip, take } = (req as any).pagination;
    const products = await this.productService.findProducts({ skip, take });
    res.status(200).json({ products });
  };

  // 상품상세 조회
  public getProductById = async (req: Request, res: Response) => {
    const { productId } = req.params;

    const product = await this.productService.findProductById(productId);
    res.status(200).json(product);
  };

  // 상품 수정
  public updateProduct = async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    const userId = req.user.id;
    const product = req.body;

    const updatedProduct = await this.productService.updateProduct(
      productId,
      userId,
      product,
    );
    res.status(200).json(updatedProduct);
  };

  // 상품 삭제
  public deleteProduct = async (req: AuthRequest, res: Response) => {
    const { productId } = req.params;
    const userId = req.user.id;

    await this.productService.deleteProduct(productId, userId);
    res.status(204).send();
  };
}
