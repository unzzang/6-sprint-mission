import type { Request, Response } from 'express';
import { prisma } from '../lib/constants';
import { AuthService } from '../service/authService';
import { AuthRepository } from '../repository/authRepository';
import { UserRepository } from '../repository/userRepository';

const authService = new AuthService(
  new AuthRepository(prisma),
  new UserRepository(prisma),
);

/**
 * 회원가입(signUp)
 */
export async function signUp(req: Request, res: Response) {
  const newUser = await authService.singUp(req.body);
  res.status(201).json({
    message: '회원가입이 완료되었습니다.',
    user: {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
    },
  });
}

/**
 * 로그인(login)
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.login({
    email,
    password,
  });
  res.cookie('refreshToken', refreshToken, { httpOnly: true });
  res.status(200).json({ message: '로그인에 성공했습니다.', accessToken });
}

/**
 * 로그아웃(logout)
 */
export async function logout(req: Request, res: Response) {
  const userId = (req as any).user.id;
  await authService.logout(userId);
  res.clearCookie('refreshToken');
  res.status(204).send();
}

/**
 * 토큰 재발급(refresh)
 */
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
