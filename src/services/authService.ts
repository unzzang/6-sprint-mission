// 로그인: 이메일/비밀번호를 받아 사용자가 맞는지 확인 (login or verifyCredentials)
// 토큰 발급: 로그인이 성공하면 Access Token, Refresh Token을 생성 (issueTokens)
// 토큰 재발급: 만료된 Access Token을 Refresh Token으로 재발급 (refreshAccessToken)
// 로그아웃: 로그인 상태를 해제 (logout)

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { AuthRepository } from '../repositories/authRepository';
import type { User } from '@prisma/client';

type LoginDto = {
  email: User['email'];
  password: User['password'];
};

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {}

  // 로그인
  async login({ email, password }: LoginDto) {
    const user = await this.authRepository.findUserByEmail(email);
    // 이메일로 사용자 확인
    if (!user) {
      // 보안을 위해 '이메일이 없습니다' 대신 아래 메시지 사용
      throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 토큰 발급
    const { accessToken, refreshToken } = this._issueTokens(user);

    // refresh Token을 데이터베이스에 저장
    await this.authRepository.updateRefreshToken(user.id, refreshToken);

    // 토큰 반환
    return { accessToken, refreshToken };
  }

  // 로그아웃
  async logout(userId: User['id']) {
    await this.authRepository.updateRefreshToken(userId, null);
  }

  // 리프레시 토큰
  async refreshAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };

      const user = await this.userRepository.findUserById(payload.userId);

      if (!user || user.refreshToken !== token) {
        throw new Error('유효하지 않은 토큰입니다.');
      }

      const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new Error('유효하지 않은 토큰입니다.');
    }
  }

  /**
   * Access Token과 Refresh Token을 발급
   * private 함수이므로 클래스 외부에서 호출 불가
   */
  private _issueTokens(user: User) {
    const payload = { userId: user.id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h', //유효기간 1시간
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d', // 유효기간 7일
    });
    return { accessToken, refreshToken };
  }
}
