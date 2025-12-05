import type { Request, Response } from 'express';
import { ProductService, CreateProductDTO } from '../services/productService';

interface AuthRequest extends Request {
  user?: { id: string };
}

export class ProductController {
  constructor(private productService: ProductService) {}

  // 상품 생성 콘트롤러
  public createProduct = async (req: AuthRequest, res: Response) => {
    const productData: CreateProductDTO = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: '인증 정보가 올바르지 않습니다.' });
    }
    // 서비스 레이어 호출
    const newProduct = await this.productService.createProduct(userId, productData);
    // 성공 응답
    res.status(201).json(newProduct);
  };
}
