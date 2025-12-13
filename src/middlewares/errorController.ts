import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ message: '서버 오류 발생!' });
  }
  res.status(500).json({ message: err.message, stack: err.stack });
};
