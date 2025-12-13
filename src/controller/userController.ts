import { prisma } from '../lib/constants';
import { Request, Response } from 'express';
import { UserService } from '../service/userService';
import { UserRepository } from '../repository/userRepository';
import { AuthRequest } from '../lib/types';

const userService = new UserService(new UserRepository(prisma));

export async function getUser(req: AuthRequest, res: Response) {
  const userId = req.user.id;

  const user = await userService.findUserById(userId);
  if (!user) {
    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  }

  res.status(200).json({
    message: '사용자가 확인되었습니다.',
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      address: user.address,
    },
  });
}

// 회원정보 수정
export async function updateUser(req: AuthRequest, res: Response) {
  const userId = req.user.id;

  const updatedUser = await userService.updateUser(userId, req.body);

  res.status(200).json({
    message: '사용자 정보를 수정했습니다.',
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      nickname: updatedUser.nickname,
      address: updatedUser.address,
    },
  });
}

/**
 * 회원 탈퇴(삭제)
 */
export async function deleteUser(req: AuthRequest, res: Response) {
  const userId = req.user.id;
  const { password } = req.body;

  await userService.deleteUser(userId, password);
  res.status(200).send();
}

/**
 * 회원검색(닉네임)
 */
export async function getSearchUsers(req: Request, res: Response) {
  const { nickname } = req.query;

  const findOptions: any = {};
  if (nickname && typeof nickname === 'string') {
    findOptions.where = {
      nickname: { contains: nickname },
    };
  }

  const users = await userService.findUsers(findOptions);
  res.status(200).json({ message: '사용자 검색 완료!', users });
}

/**
 * 회원상세정보
 */
export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  const user = await userService.findUserById(id);
  if (!user) {
    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  }

  const { password, ...restUser } = user;
  res.status(200).json({ message: '사용자 검색 완료!', user: restUser });
}
