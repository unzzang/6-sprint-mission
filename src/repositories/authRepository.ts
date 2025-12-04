// 1. Prisma 관련 타입들을 가져옵니다.
import type { Prisma, PrismaClient, User } from '@prisma/client';

// 2. authRepository 클래스를 export 합니다.
export class AuthRepository {
  // 3. 생성자(constructor)에서 PrismaClient를 주입받습니다.
  constructor(private prisma: PrismaClient) {}

  // 회원가입
  // 매개변수의 타입을 Prisma.UserCreateInput으로 명시
  // Prisma.UserCreateInput은 생성할 때 사용하는 타입, 필수 필드를 포함할 수 있음
  async singUp(data: Prisma.UserCreateInput) {
    // this.prisma.user.create처럼 어떤 모델을 생성할 것인지 명시
    return this.prisma.user.create({ data });
  }

  // 이메일로 사용자 찾기
  async findUserByEmail(email: User['email']) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // 닉네임으로 사용자 찾기
  async findUserByNickname(nickname: User['nickname']) {
    return this.prisma.user.findUnique({ where: { nickname } });
  }

  // 리프레시 토큰 업데이트
  async updateRefreshToken(id: User['id'], refreshToken: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }
}
