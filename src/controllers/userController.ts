import { prisma } from '../lib/constants.js';
import { Request, Response } from 'express';
import { UserService } from '../services/userService.js';
import { UserRepository } from '../repositories/userRepository.js';

// import한 prisma를 UserRepository에 전달
const userService = new UserService(new UserRepository(prisma));

// 회원가입
export async function createUser(req: Request, res: Response) {
  const newUser = await userService.createUser(req.body);

  res.status(201).json({
    message: '회원가입이 완료되었습니다.',
    user: {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
    },
  });
}

// 현재 로그인된 사용자 정보 조회
export async function getUser(req: Request, res: Response) {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await userService.findUserById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    message: 'User retrieved successfully',
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      address: user.address,
    },
  });
}

// 회원정보 수정
export async function updateUser(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const updatedUser = await userService.updateUser(userId, req.body);

  res.status(200).json({
    message: 'User updated successfully',
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      nickname: updatedUser.nickname,
      address: updatedUser.address,
    },
  });
}

// 회원 탈퇴
export async function deleteUser(req: Request, res: Response) {
  const userId = (req as any).user?.id;
  const { password } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  await userService.deleteUser(userId, password);
  res.status(200).json({ message: 'User deleted successfully' });
}

// 회원검색
export async function getSearchUsers(req: Request, res: Response) {
  const { nickname } = req.query;

  const findOptions: any = {};
  if (nickname && typeof nickname === 'string') {
    findOptions.where = {
      nickname: { contains: nickname },
    };
  }

  const users = await userService.findUsers(findOptions);
  res.status(200).json({
    message: 'Users retrieved successfully',
    users,
  });
}

// 회원상세정보
export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  const user = await userService.findUserById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password, ...restUser } = user;
  res.status(200).json({
    message: 'User retrieved successfully',
    user: restUser,
  });
}
