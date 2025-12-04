import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/constants.js';
import { AuthService } from '../services/authService.js';
import { AuthRepository } from '../repositories/authRepository.js';
import { UserRepository } from '../repositories/userRepository.js';

const authService = new AuthService(
  new AuthRepository(prisma),
  new UserRepository(prisma),
);

// 로그인 콘트롤
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.login({
    email,
    password,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
  });
  res.status(200).json({ message: '로그인에 성공했습니다.', accessToken });
}

// 로그아웃 콘트롤
export async function logout(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) {
    throw new Error('인증되지 않은 사용자입니다.');
  }
  await authService.logout(userId);
  res.clearCookie('refreshToken');
  res.status(204).send();
}

// 토큰 재발급 콘트롤
export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new Error('Refresh Token이 존재하지 않습니다.');
  }
  const { accessToken } = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({
    message: 'Access Token이 재발급되었습니다.',
    accessToken,
  });
}
