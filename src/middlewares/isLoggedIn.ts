import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

// Controller에서 사용할 수 있도록 Request 타입 저장
interface AuthRequest extends Request {
  user?: { id: string };
}

export async function isLoggedIn(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  // 1. 환경변수에서 비밀 키 가져오기(없으면 서버 실행 안됨)
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    console.error('JWT_SECRET_KEY is not defined in .env file');
    process.exit(1);
  }

  try {
    // 2. 헤더에서 'Bearer<TOKEN>'형식의 토큰 가져오기
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('인증 토큰이 필요합니다.');
      (error as any).status = 401;
      throw error;
    }

    //  'Bearer ' 부분을 잘라내고 실제 토큰만 추출
    const token = authHeader.split(' ')[1];

    // 3. 토큰 검증
    // verify 함수는 토큰이 유효하면 payload를, 아니면 에러 전달
    const payload = verify(token, secretKey);

    // 4. 검증 성공 시, payload의 사용자 ID를 req.user에 할당
    // (authService에서 토큰 생성시 {userId:id} 형태로 payload를 만들었음)
    req.user = { id: (payload as any).userId };
    next();
  } catch (error) {
    // 5. 모든 종류의 토큰 오류(만료, 형식 오류 등)를 여기에서 잡읍
    const authError = new Error('유효하지 않은 토큰입니다.');
    (authError as any).status(401); // 401 Unauthorized

    next(authError); //에러 핸들러로 전달
  }
}
