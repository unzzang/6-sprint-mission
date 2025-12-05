import { ProductRepository } from '../repositories/productRepository';
import { Prisma, PrismaClient, Category, ProductStatus, User } from '@prisma/client';

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
   * 상품 생성 비즈니스 로직
   * @param id 상품을 등록하는 사용자의 ID
   * @param productData 생성할 상품의 데이터
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
}
