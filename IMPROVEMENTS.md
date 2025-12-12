# 프로젝트 개선 제안 사항

이 문서는 `panda-market` 백엔드 프로젝트의 전반적인 코드베이스를 검토하고 발견된 개선점들을 정리한 것입니다. 각 항목은 문제점, 원인, 그리고 해결 방안을 제시합니다.

---

## 1. 컨트롤러 계층의 로직 중복 및 역할 과잉

컨트롤러(`productController.ts`, `articleController.ts` 등)에서 여러 중복된 로직과 역할 범위를 벗어나는 코드가 발견되었습니다.

### 1.1. 인증 확인 로직 중복

- **문제점**: `create`, `update`, `delete` 등 인증이 필요한 모든 컨트롤러 메소드에서 `if (!req.user.id)` 형태의 코드가 반복적으로 나타납니다.
- **원인**: `isLoggedIn` 미들웨어의 역할을 신뢰하지 않고, 방어적으로 코드를 작성했기 때문입니다. `isLoggedIn` 미들웨어는 인증 실패 시 `next(error)`를 호출하여 후속 로직 실행을 막으므로, 해당 미들웨어를 통과한 컨트롤러는 `req.user` 객체가 항상 존재한다고 가정할 수 있습니다.
- **해결 방안**:
  - 각 컨트롤러 메소드에 반복적으로 존재하는 `if (!userId)` 블록을 모두 제거합니다.
  - 라우터에서 해당 경로에 `isLoggedIn` 미들웨어가 올바르게 적용되어 있는지 확인합니다. 이를 통해 컨트롤러는 핵심 비즈니스 로직 호출에만 집중할 수 있습니다.

### 1.2. 페이지네이션(Pagination) 로직 중복

- **문제점**: `getProducts`, `getArticles` 등 목록을 조회하는 API에서 `page`, `limit` 쿼리 파라미터를 파싱하고, 기본값을 설정하며, 유효성을 검사하는 코드가 완전히 동일하게 중복되어 있습니다.
- **원인**: 공통 로직을 별도의 모듈로 분리하지 않고, 각 컨트롤러에서 개별적으로 구현했기 때문입니다.
- **해결 방안**:
  - 페이지네이션 로직을 처리하는 커스텀 미들웨어(예: `paginationMiddleware`)를 생성합니다.
  - 이 미들웨어는 `req.query`에서 `page`, `limit` 값을 추출하여 `req.pagination = { skip, take }`와 같은 형태로 가공한 후 `next()`를 호출합니다.
  - 목록 조회 라우터에 이 미들웨어를 추가하여 컨트롤러 코드를 간소화하고 중복을 제거합니다.

---

## 2. 입력 데이터 유효성 검사 (Validation) 누락

`express-validator` 라이브러리가 프로젝트에 포함되어 있지만, 실제로는 대부분의 컨트롤러에서 사용되지 않고 있습니다. 이로 인해 잘못된 데이터가 서비스 계층이나 데이터베이스까지 전달될 수 있습니다.

- **문제점**: `createProduct`, `updateArticle` 등의 메소드에서 `req.body`를 아무런 검증 없이 그대로 서비스 계층에 전달합니다. `price`에 음수가 들어오거나, `name`이 빈 문자열로 들어오는 등의 잠재적 위험이 있습니다. 또한, `req.params`의 `id` 형식이 올바른지(예: UUID) 검사하지 않습니다.
- **원인**: 유효성 검사 로직의 구현이 누락되었습니다.
- **해결 방안**:
  - `src/middlewares/validator.ts`를 활용하여 각 API 엔드포인트에 맞는 유효성 검사 규칙을 정의합니다.
  - 예시 (`productRouter.ts`):
    ```typescript
    import { body, param } from 'express-validator';
    import { validate } from '../middlewares/validator';

    // POST /product
    router.post(
      '/',
      isLoggedIn,
      [
        body('name').notEmpty().withMessage('상품 이름은 필수입니다.'),
        body('price').isFloat({ min: 0 }).withMessage('가격은 0 이상이어야 합니다.'),
        // ... other rules
      ],
      validate, // 유효성 검사 미들웨어 실행
      productController.createProduct
    );

    // GET /product/:id
    router.get(
        '/:id',
        [ param('id').isUUID().withMessage('유효하지 않은 상품 ID입니다.') ],
        validate,
        productController.getProductById
    )
    ```
  - 모든 `create`, `update` 관련 라우터에 `body()`를 사용한 유효성 검사를 추가하고, `id` 파라미터를 사용하는 모든 라우터에 `param()`을 사용한 검사를 추가합니다.

---

## 3. 에러 처리 방식의 비일관성

에러를 처리하는 방식이 컨트롤러와 서비스 계층에 걸쳐 일관되지 않습니다.

- **문제점**:
  1. 컨트롤러의 `getProductById`에서는 `!product`일 경우 직접 `res.status(404).json(...)`을 호출하여 응답을 종료합니다.
  2. 반면, `productService`의 `checkProductOwnership`에서는 `product`가 없을 때 `Error` 객체를 생성하여 `throw` 합니다.
- **원인**: 에러 처리 전략이 중앙화되어 있지 않기 때문입니다. `asyncHandler`와 `errorHandler` 미들웨어를 사용하는 패턴의 이점을 완전히 활용하지 못하고 있습니다.
- **해결 방안**:
  - **"Not Found" 로직 중앙화**: 컨트롤러에서 `if (!product)`와 같은 존재 여부 확인 로직을 제거합니다. 대신, 서비스 계층에서 객체를 찾지 못했을 경우 `status` 속성을 포함한 에러를 `throw` 하도록 통일합니다.
    ```typescript
    // In Service Layer
    const product = await this.productRepository.findProductById(id);
    if (!product) {
      const error = new Error('상품을 찾을 수 없습니다.');
      (error as any).status = 404;
      throw error;
    }
    return product;
    ```
  - **에러 핸들러 활용**: 컨트롤러는 서비스 계층에서 발생한 에러를 `catch` 하지 말고, `asyncHandler`가 에러를 잡아 `errorHandler`로 넘기도록 둡니다. 이렇게 하면 모든 에러 응답(404, 403, 400 등)이 `errorHandler`에서 일관된 형식으로 처리됩니다.

---

## 4. 데이터베이스 및 보안 강화 제안

### 4.1. 데이터베이스 인덱싱

- **제안**: 현재 `prisma.schema`에서는 관계(relation)에 의해 외래 키 필드가 자동으로 인덱싱됩니다. 하지만 애플리케이션이 성장하여 특정 ID로 직접 검색하는 쿼리가 많아질 경우(예: 특정 사용자가 작성한 모든 상품/게시글 목록 조회), 해당 외래 키에 명시적으로 인덱스를 추가하면 성능 향상을 기대할 수 있습니다.
- **예시** (`Product` 모델):
  ```prisma
  model Product {
    // ... fields
    authorId String

    @@index([authorId]) // authorId 필드에 인덱스 추가
  }
  ```
- **조치**: 당장 적용할 필요는 없으나, 향후 성능 모니터링 시 고려해볼 만한 사항입니다.

### 4.2. 리프레시 토큰 저장소 분리

- **제안**: 현재 `refreshToken`이 `User` 테이블에 직접 저장되어 있습니다. 이는 일반적인 방식이지만, 더 높은 수준의 보안이 필요할 경우 리프레시 토큰을 별도의 테이블로 분리하여 관리하는 것을 고려할 수 있습니다.
- **기대 효과**: 토큰 탈취 시 특정 토큰만 무효화하거나, 기기별 로그인 세션을 관리하는 등 더 세분화된 보안 정책을 적용할 수 있습니다.
- **조치**: 현재 프로젝트 범위에서는 선택 사항이지만, 보안적으로 더 견고한 구조를 위한 개선 방향으로 제안합니다.

---
---

# Action Items (실행 계획)

아래는 위에서 제안된 개선 사항들을 구체적인 실행 단위로 나눈 목록입니다.

### **Task 1: 컨트롤러 내 중복 로직 제거**

-   **[ ] 1-1. `productController.ts` 리팩터링**
    -   `createProduct`, `updateProduct`, `deleteProduct` 메소드 내부에 있는 `if (!userId)` 블록을 제거합니다.
-   **[ ] 1-2. `articleController.ts` 리팩터링**
    -   `createArticle`, `updateArticle`, `deleteArticle` 메소드 내부에 있는 `if (!userId)` 블록을 제거합니다.
-   **[ ] 1-3. (선택) 다른 컨트롤러 확인**
    -   `userController.ts`, `*CommentController.ts` 등 인증이 필요한 다른 모든 컨트롤러에 유사한 중복 코드가 있는지 확인하고 제거합니다.

### **Task 2: 페이지네이션 로직 공통화**

-   **[ ] 2-1. 페이지네이션 미들웨어 생성**
    -   `src/middlewares/` 디렉터리에 `pagination.ts` (또는 유사한 이름의) 파일을 생성합니다.
    -   `productController.ts`의 `getProducts` 메소드에 있는 페이지네이션 관련 코드(쿼리 파싱, 기본값 설정, 유효성 검사, `skip`/`take` 계산)를 이 미들웨어로 옮깁니다.
    -   미들웨어는 계산된 `skip`, `take` 값을 `req.pagination` 객체에 담아 `next()`를 호출하도록 구현합니다.
-   **[ ] 2-2. `productRouter.ts`에 미들웨어 적용**
    -   `getProducts` 라우트에 새로 만든 페이지네이션 미들웨어를 추가합니다.
    -   `productController.ts`의 `getProducts` 메소드에서 페이지네이션 로직을 제거하고, 대신 `req.pagination` 값을 사용하도록 수정합니다.
-   **[ ] 2-3. `articleRouter.ts`에 미들웨어 적용**
    -   `getArticles` 라우트에 페이지네이션 미들웨어를 동일하게 적용합니다.
    -   `articleController.ts`의 `getArticles` 메소드에서 중복된 페이지네이션 로직을 제거하고, `req.pagination` 값을 사용하도록 수정합니다.

### **Task 3: 입력 데이터 유효성 검사 추가**

-   **[ ] 3-1. Product 라우터 유효성 검사 추가**
    -   **파일**: `src/routers/productRouter.ts`
    -   `POST /` 라우트에 `name`, `description`, `category`, `price`, `stock` 등 `req.body`의 각 필드에 대한 유효성 검사 규칙(`notEmpty`, `isFloat` 등)을 추가합니다.
    -   `PUT /:id` 라우트에도 수정 가능한 필드에 대한 유효성 검사 규칙을 추가합니다.
    -   `GET /:id`, `PUT /:id`, `DELETE /:id` 라우트에 `param('id').isUUID()` 규칙을 추가하여 ID 형식을 검증합니다.
-   **[ ] 3-2. Article 라우터 유효성 검사 추가**
    -   **파일**: `src/routers/articleRouter.ts`
    -   `POST /` 라우트에 `title`, `content` 필드에 대한 유효성 검사 규칙을 추가합니다.
    -   `PUT /:id` 라우트에도 `title`, `content`에 대한 유효성 검사 규칙을 추가합니다.
    -   `id`를 파라미터로 사용하는 모든 라우트에 `param('id').isUUID()` 규칙을 추가합니다.
-   **[ ] 3-3. (선택) 나머지 라우터 유효성 검사 추가**
    -   `userRouter.ts`, `productCommentRouter.ts`, `articleCommentRouter.ts` 등 나머지 라우터들에도 각 API의 명세에 맞게 적절한 유효성 검사 규칙을 추가합니다.

### **Task 4: 에러 처리 방식 일원화**

-   **[ ] 4-1. Product 조회 로직 수정**
    -   **파일**: `src/controllers/productController.ts`
        -   `getProductById` 메소드에서 `if (!product)` 분기문을 제거합니다.
    -   **파일**: `src/services/productService.ts`
        -   `findProductById` 메소드에서 조회 결과가 없을 경우, `status`가 404인 에러를 `throw`하는지 확인하고, 그렇지 않다면 수정합니다. (`checkProductOwnership`의 로직을 참고하거나 이관)
-   **[ ] 4-2. Article 조회 로직 수정**
    -   **파일**: `src/controllers/articleController.ts`
        -   `getArticleById` 메소드에서 `if (!article)` 분기문을 제거합니다.
    -   **파일**: `src/services/articleService.ts`
        -   `findArticleById` 메소드에서 조회 결과가 없을 경우, `status`가 404인 에러를 `throw`하도록 수정합니다.