import { ProductRepository } from '../repositories/productRepository';
import { Prisma, Category, ProductStatus, User, Product } from '@prisma/client';

// Controller에서 Service로 데이터를 넘겨줄 때 사용할 데이터 형태(DTO) 정의
// 이미지 URL과 태그 이름은 문자열로 받음
export interface CreateProductDTO {
  name: string;
  description: string;
  category: Category;
  price: number;
  stock: number;
  status: ProductStatus;
  tags: string[];
  images: string[];
}

export class ProductService {
  // 생성자(constructor)에서 ProductRepository의 인스턴스 주입받음
  // 이렇게 하면 Service는 Repository의 기능 사용가능
  constructor(private productRepository: ProductRepository) {}

  /**
   * 상품 등록
   * @param id 상품을 등록하는 사용자의 ID
   * @param productData 등록할 상품의 데이터
   */
  async createProduct(id: User['id'], productData: CreateProductDTO) {
    const { name, description, category, price, stock, status, tags, images } =
      productData;

    const dataToCreate: Prisma.ProductCreateInput = {
      name,
      description,
      category,
      price,
      stock,
      status,
      author: { connect: { id } },
      images: { create: images.map((url) => ({ url })) },
      tags: {
        connectOrCreate: tags.map((tagName) => ({
          where: { tag: tagName },
          create: { tag: tagName },
        })),
      },
    };
    const newProduct = await this.productRepository.createProduct(dataToCreate);
    return newProduct;
  }

  /**
   * 상품 목록 조회
   * @param options Prisma.ProductFindManyArgs 타입의 옵션 객체
   */
  async findProducts(options: Prisma.ProductFindManyArgs) {
    // Service에서는 별도의 비즈니스 로직 없이 Repository 호출
    return this.productRepository.findProducts(options);
  }

  /**
   * 상품 상세 조회
   * @param id 조회할 상품의 ID
   */
  async findProductById(id: Product['id']) {
    return this.productRepository.findProductById(id);
  }

  /**
   * 상품 정보 수정
   * @param productId 수정할 상품의 ID
   * @param userId 수정을 시도하는 사용자의 ID
   * @param data 수정할 상품의 데이터
   */
  async updateProduct(
    productId: Product['id'],
    userId: User['id'],
    data: Prisma.ProductUpdateInput,
  ) {
    // 1. 상품 정보 조회
    const product = await this.productRepository.findProductById(productId);

    // 2. 상품 존재 확인
    if (!product) {
      const error = new Error('상품을 찾을 수 없습니다.');
      (error as any).status = 404;
      throw error;
    }

    // 3. 상품 작성자 확인
    if (product.authorId !== userId) {
      const error = new Error('수정권한이 없습니다.');
      (error as any).status = 403;
      throw error;
    }

    // 4. Repository에 수정 요청
    return this.productRepository.updateProduct(productId, data);
  }

  /**
   * 상품 삭제
   * @param productId 삭제할 상품의 ID
   * @param userId 삭제를 시도하는 사용자의 ID
   */
  async deleteProduct(productId: Product['id'], userId: User['id']) {
    // 1. 상품 정보 조회
    const product = await this.productRepository.findProductById(productId);

    // 2. 상품이 존재하지 않을 경우 에러
    if (!product) {
      const error = new Error('상품을 찾을 수 없습니다.');
      (error as any).status = 404;
      throw error;
    }

    // 3. 상품 작성자와 삭제 요청자가 동일한지 확인
    if (product.authorId !== userId) {
      const error = new Error('삭제 권한이 없습니다.');
      (error as any).status = 403;
      throw error;
    }

    // 4. 모든 검증이 통과되면 Repository에 삭제 요청
    return this.productRepository.deleteProduct(productId);
  }
}
