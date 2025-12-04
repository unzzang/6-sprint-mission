var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from '../lib/constants.js';
import { UserService } from '../services/userService.js';
import { UserRepository } from '../repositories/userRepository.js';
// import한 prisma를 UserRepository에 전달
const userService = new UserService(new UserRepository(prisma));
// 회원가입
export function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = yield userService.createUser(req.body);
        res.status(201).json({
            message: '회원가입이 완료되었습니다.',
            user: {
                id: newUser.id,
                email: newUser.email,
                nickname: newUser.nickname,
            },
        });
    });
}
// 현재 로그인된 사용자 정보 조회
export function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = yield userService.findUserById(userId);
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
    });
}
// 회원정보 수정
export function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const updatedUser = yield userService.updateUser(userId, req.body);
        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                nickname: updatedUser.nickname,
                address: updatedUser.address,
            },
        });
    });
}
// 회원 탈퇴
export function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { password } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        yield userService.deleteUser(userId, password);
        res.status(200).json({ message: 'User deleted successfully' });
    });
}
