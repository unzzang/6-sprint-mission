import type { Request, Response } from 'express';
import { AuthRequest } from '../lib/types';
import { CreateProductDTO } from '../lib/dto';
import { ProductService } from '../services/productService';

export class ProductController {
  constructor(private productService: ProductService) {}

  // 상품 생성 콘트롤러
  public createProduct = async (req: AuthRequest, res: Response) => {
    const productData: CreateProductDTO = req.body;
    const userId = req.user.id;

    // 서비스 레이어 호출
    const newProduct = await this.productService.createProduct(
      userId,
      productData,
    );
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
    // URL 파라미터에서 id 가져오기(문자열)
    const { id } = req.params;

    // 서비스 레이어 호출(문자열 id를 그대로 전달)
    const product = await this.productService.findProductById(id);
    res.status(200).json(product);
  };

  // 상품 수정
  public updateProduct = async (req: AuthRequest, res: Response) => {
    // URL 파라미터, 요청 body, 사용자 인증 정보 가져오기
    const { id } = req.params;
    const productData = req.body;
    const userId = req.user.id;

    // 서비스 레이어 호출(id, userId, data 전달)
    const updatedProduct = await this.productService.updateProduct(
      id,
      userId,
      productData,
    );
    res.status(200).json(updatedProduct);
  };

  // 상품 삭제
  public deleteProduct = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.productService.deleteProduct(id, userId);
    res.status(204).send();
  };
}
