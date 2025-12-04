import type { Prisma, User } from '@prisma/client';
import { UserRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';

// email, nickname, password, address 검사는 validator에서 진행

export class UserService {
  // 생성자를 통해 UserRepository 인스턴스를 주입받습니다.
  constructor(private userRepository: UserRepository) {}

  // 회원가입
  async createUser(userData: Prisma.UserCreateInput) {
    // 1. 비즈니스 로직을 처리 (예: 비밀번호 암호화)
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 2. Repository에 전달할 데이터 준비
    const createData = {
      ...userData,
      password: hashedPassword,
    };

    // 3. prisma.user.create() 대신 userRepository의 메소드를 호출
    return this.userRepository.createUser(createData);
  }

  //회원정보수정
  async updateUser(id: User['id'], userData: Prisma.UserUpdateInput) {
    const updateData = { ...userData };

    // 비즈니스 로직: 업데이트 정보에 'password' 포함시
    // 새로운 비밀번호를 암호화(hash)해서 updateData에 반영
    if (typeof updateData.password === 'string') {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }

    // 4. Repository 호출
    return this.userRepository.updateUser(id, updateData);
  }

  // 회원탈퇴(삭제)
  async deleteUser(id: User['id'], passwordToCheck: string) {
    // 1. ID 기준 사용자 찾기
    const user = await this.userRepository.findUserById(id);

    // 2. user를 찾을 수 없을 때
    if (!user) {
      const error = new Error('사용자를 찾을 수 없습니다.');
      (error as any).status = 404; // 404 Not Found
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(passwordToCheck, user.password);

    // 3. 비밀번호 틀리면 에러 처리
    if (!isPasswordCorrect) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      (error as any).status = 403; // 403 Forbidden(권한없음)
      throw error;
    }

    // 4. 모든 확인 완료 후 Repository에 삭제 요청
    return this.userRepository.deleteUser(id);
  }

  // 이메일 또는 닉네임으로 사용자 찾기
  async findUserByEmailOrNickname({
    email,
    nickname,
  }: {
    email?: User['email'];
    nickname?: User['nickname'];
  }) {
    return this.userRepository.findUserByEmailOrNickname({
      email,
      nickname,
    });
  }

  // 회원정보 불러오기
  async findUserById(id: User['id']) {
    return this.userRepository.findUserById(id);
  }

  // 회원찾기
  // async findUsers() {}
}
