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

  // 상품목록조회
  public getProducts = async (req: Request, res: Response) => {
    // 1. 쿼리 파라미터에서 page, limit값 가져오기(문자열)
    const { page: pageStr, limit: limitStr } = req.query;

    // 2. 기본값 설정 및 숫자로 변환
    const page = pageStr ? parseInt(pageStr as string, 10) : 1;
    const limit = limitStr ? parseInt(limitStr as string, 10) : 10;

    // 3. 유효성 검증
    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ message: '유효하지 않은 페이지 또는 limit 값입니다.' });
    }

    // 4. skip, take 값 계산
    const skip = (page - 1) * limit;
    const take = limit;

    // 5. 서비스 레이어 호출
    const products = await this.productService.findProducts({
      skip,
      take,
    });

    // 6. 성공 응답
    res.status(200).json({ products });
  };

  // 상품상세 조회
  public getProductById = async (req: Request, res: Response) => {
    // 1. URL 파라미터에서 id 가져오기(문자열)
    const { id } = req.params;

    // 2. 서비스 레이어 호출(문자열 id를 그대로 전달)
    const product = await this.productService.findProductById(id);

    // 3. 상품이 존재하지 않을 경우 404 전달
    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    // 4. 성공 응답
    res.status(200).json(product);
  };

  // 상품 수정
  public updateProduct = async (req: AuthRequest, res: Response) => {
    // 1. URL 파라미터, 요청 body, 사용자 인증 정보 가져오기
    const { id } = req.params;
    const productData = req.body;
    const userId = req.user?.id;

    // 2. 사용자 인증 정보 확인
    if (!userId) {
      return res.status(401).json({ message: '인증 정보가 올바르지 않습니다.' });
    }

    // 3. 서비스 레이어 호출(id, userId, data 전달)
    const updatedProduct = await this.productService.updateProduct(
      id,
      userId,
      productData,
    );

    // 4. 성공응답
    res.status(200).json(updatedProduct);
  };

  // 상품 삭제
  public deleteProduct = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: '인증 정보가 올바르지 않습니다.' });
    }

    await this.productService.deleteProduct(id, userId);

    res.status(204).send();
  };
}
