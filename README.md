# Panda Market API Server

## 개요

이 프로젝트는 'Panda Market' 중고 거래 애플리케이션을 위한 API 서버입니다. Node.js, Express.js, TypeScript를 기반으로 구축되었으며, Prisma ORM을 통해 PostgreSQL 데이터베이스와 상호작용합니다. RESTful API 서버를 구현하고, 계층화된 아키텍처(Controller, Service, Repository)를 적용하여 코드의 모듈성과 유지보수성을 높이는 데 중점을 두었습니다.

### 주요 기술

- **Backend:** Node.js, Express.js
- **언어:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **인증:** JWT (jsonwebtoken), bcrypt
- **Validation:** express-validator
- **파일 업로드:** Multer

### 주요 라이브러리

`package.json`을 기준으로 한 주요 의존성 라이브러리는 다음과 같습니다.

- **`@prisma/client`**: Prisma 클라이언트 (데이터베이스 쿼리용)
- **`express`**: 웹 프레임워크
- **`typescript`**: 타입스크립트 언어 지원
- **`jsonwebtoken`**: JWT 기반 인증 토큰 생성 및 검증
- **`bcrypt`**: 비밀번호 해싱
- **`express-validator`**: API 요청 데이터 유효성 검사
- **`multer`**: 파일 업로드(multipart/form-data) 처리
- **`cors`**: CORS(Cross-Origin Resource Sharing) 처리
- **`dotenv`**: 환경 변수 관리
- **`nodemon`**: 개발 환경에서 파일 변경 시 자동 서버 재시작

### 의존성 설치

```bash
npm install
```

---

## 아키텍처

본 프로젝트는 역할에 따라 코드를 분리하는 계층형 아키텍처(Layered Architecture)를 따릅니다.

- **`src/main.ts`**: Express 애플리케이션의 진입점으로, 미들웨어 설정 및 라우터 등록을 담당합니다.
- **`src/routers/`**: API 엔드포인트를 정의하고, 해당 경로로 들어온 요청을 적절한 컨트롤러에 연결합니다.
- **`src/controllers/`**: HTTP 요청을 수신하여 요청 데이터를 정제하고, 비즈니스 로직을 처리하는 서비스 계층에 작업을 위임한 후, 결과를 클라이언트에 응답합니다.
- **`src/services/`**: 애플리케이션의 핵심 비즈니스 로직을 수행합니다. 여러 리포지토리를 호출하여 데이터를 조작합니다.
- **`src/repositories/`**: 데이터베이스와의 상호작용을 추상화합니다. Prisma 클라이언트를 사용하여 실제 데이터 CRUD 작업을 수행합니다.
- **`src/middlewares/`**: 인증, 오류 처리, 파일 업로드(Multer), 요청 데이터 유효성 검사 등 공통 관심사를 처리하는 미들웨어를 포함합니다.
- **`prisma/`**: Prisma 관련 파일을 관리합니다.
  - `schema.prisma`: 데이터베이스 모델, 관계, enum을 정의합니다.
  - `seed.js`: 개발용 초기 데이터를 생성합니다.

---

## 주요 기능

- **사용자 인증**: 회원가입, 로그인, 토큰 갱신
- **사용자 관리**: 프로필 조회 및 수정 (이미지 업로드 포함)
- **상품(Product) 관리**: 상품 등록, 조회, 수정, 삭제 (CRUD)
- **게시글(Article) 관리**: 게시글 등록, 조회, 수정, 삭제 (CRUD)
- **댓글(Comment) 관리**: 상품 및 게시글에 대한 댓글 CRUD
- **좋아요/즐겨찾기**: 게시글 좋아요 및 상품 즐겨찾기 기능

### API Endpoints

주요 API 경로는 `src/routers/` 내의 각 라우터 파일에 모듈화되어 정의되어 있습니다.

- **`/auth`**: 회원가입, 로그인 등 인증 관련 API
- **`/user`**: 사용자 프로필 관련 API
- **`/product`**: 상품 관리(CRUD) 관련 API
- **`/article`**: 게시글(CRUD) 관련 API
- **`/product/:productId/comment`**: 상품 댓글 관련 API
- **`/article/:articleId/comment`**: 게시글 댓글 관련 API
- **`/like/:entityType/:entityId`**: 좋아요/즐겨찾기 관련 API

---

## 프로젝트 폴더 구조

```
.
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── controllers/
│   ├── lib/
│   ├── middlewares/
│   ├── repositories/
│   ├── routers/
│   └── services/
├── uploads/
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
...
```

---

## 개발 컨벤션

- **코드 스타일**: Prettier를 사용하여 일관된 코드 스타일을 유지합니다. (`.prettierrc` 설정 파일 참고)
- **언어**: TypeScript를 사용하여 타입 안정성을 확보합니다.
- **비동기 처리**: 모든 비동기 작업은 `async/await`를 사용하며, 컨트롤러에서는 `asyncHandler` 유틸리티를 통해 오류를 중앙에서 처리합니다.
- **데이터 유효성 검사**: `express-validator`를 사용하여 각 API의 요청 `body`, `params`, `query`를 검증합니다. 유효성 검사 로직은 `validator.ts` 미들웨어를 통해 라우터 레벨에서 적용됩니다.
- **데이터베이스 모델링**: `prisma/schema.prisma` 파일에서 데이터 모델과 관계를 정의합니다. 스키마 변경 후에는 `npx prisma migrate dev` 명령어로 마이그레이션을 수행해야 합니다.

---

## 실행

### 전제 조건

- Node.js 설치
- PostgreSQL 데이터베이스 실행
- 프로젝트 루트에 `DATABASE_URL`이 포함된 `.env` 파일 생성

**.env 파일 예시**
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3000
JWT_SECRET=your_jwt_secret
```

### 데이터베이스 초기화 및 시드

처음 프로젝트를 설정할 때 다음 명령어를 실행하여 데이터베이스 스키마를 적용하고 초기 데이터를 삽입합니다.

```bash
# 데이터베이스 스키마를 마이그레이션합니다.
npx prisma migrate dev

# 초기 데이터를 시드합니다.
npx prisma db seed
```

### 애플리케이션 실행

개발 모드에서는 `nodemon`과 `ts-node`를 사용하여 파일 변경 시 서버가 자동으로 재시작됩니다.

```bash
# 개발 모드로 실행
npm run dev
```

프로덕션 환경에서는 먼저 TypeScript를 JavaScript로 컴파일한 후 실행합니다.

```bash
# 프로덕션용 빌드
npm run build

# 프로덕션 모드로 실행
npm run start
```

서버가 성공적으로 실행되면 콘솔에 `Server listening on port [PORT]` 메시지가 출력됩니다.