// 임시 미들웨어
import { Request, Response, NextFunction } from 'express';

export async function isLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  (req as any).user = { id: '5e87b393-0d40-4464-9715-aaa851a9607e' }; //테스트용 임시 ID
  next();
}
