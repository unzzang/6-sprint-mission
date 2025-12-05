// Prisma 관련 타입들을 가져옵니다.
import type { Prisma, PrismaClient, User } from '@prisma/client';

export class UserRepository {
  constructor(private prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 회원가입
  // 매개변수의 타입을 Prisma.UserCreateInput으로 명시
  // Prisma.UserCreateInput은 생성할 때 사용하는 타입, 필수 필드를 포함할 수 있음
  async createUser(data: Prisma.UserCreateInput) {
    // this.prisma.user.create처럼 어떤 모델을 생성할 것인지 명시
    return this.prisma.user.create({ data });
  }

  // 회원정보수정
  // 매개변수의 타입을 Prisma.UserUpdateInput으로 명시
  // Prisma.UserCreateInput은 기존 사용자를 수정할 때 사용.
  // 모든 필드가 optional로, 일부 필드만 변경하려는 의도에 정확하게 일치함
  async updateUser(id: User['id'], data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  // 회원탈퇴(삭제)
  async deleteUser(id: User['id']) {
    return this.prisma.user.delete({ where: { id } });
  }

  // 이메일 또는 닉네임으로 사용자 찾기
  async findUserByEmailOrNickname({
    email,
    nickname,
  }: {
    email?: User['email'];
    nickname?: User['nickname'];
  }) {
    // email 또는 nickname 중 하나라도 인자로 들어왔는지 확인합니다.
    if (!email && !nickname) {
      return null;
    }
    // 둘 중 어떤 조건에 해당하는 사용자를 찾을지 동적으로 결정합니다.
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }],
      },
    });
  }

  // 회원정보 찾기
  async findUserById(id: User['id']) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // 회원찾기
  // findMany의 경우 where(검색조건), orderBy(정렬), take(개수제한), skip(건너뛰기)등 다양한 옵션제공
  // UserFindManyArgs는 모든 옵션을 포함
  async findUsers(findOptions: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany(findOptions);
  }
}
