import type { Prisma, User } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';

export class UserService {
  // 생성자를 통해 UserRepository 인스턴스를 주입받습니다.
  constructor(private userRepository: UserRepository) {}

  // 회원가입
  async createUser(userData: Prisma.UserCreateInput) {
    // 1. 비즈니스 로직을 처리 (예: 비밀번호 암호화)
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 2. Repository에 전달할 데이터를 준비합니다.
    const createData = {
      ...userData,
      password: hashedPassword,
    };

    // 3. prisma.user.create() 대신 userRepository의 메소드를 호출
    return this.userRepository.createUser(createData);
  }

  //회원정보수정
  async updateUser(id: User['id'], userData: Prisma.UserUpdateInput) {
    // 나중에 사용할 수 있도록 업데이트 할 데이터를 복사
    const updateData = { ...userData };

    // 1. 비즈니스 로직: 업데이트 정보에 'password'가 포함된다면
    // 새로운 비밀번호를 암호화(hash)해서 updateData에 반영
    if (typeof userData.password === 'string') {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      updateData.password = hashedPassword;
    }

    // 2. Repository 호출
    return this.userRepository.updateUser(id, updateData);
  }

  // 회원탈퇴(삭제)deleteUser
  // 이메일 또는 닉네임으로 사용자 찾기findUserByEmailOrNickname
  // 회원정보 찾기findUserById
  // 회원찾기findUsers
}
