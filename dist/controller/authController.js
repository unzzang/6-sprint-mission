"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = signUp;
exports.login = login;
exports.logout = logout;
exports.refresh = refresh;
const constants_1 = require("../lib/constants");
const authService_1 = require("../service/authService");
const authRepository_1 = require("../repository/authRepository");
const userRepository_1 = require("../repository/userRepository");
const authService = new authService_1.AuthService(new authRepository_1.AuthRepository(constants_1.prisma), new userRepository_1.UserRepository(constants_1.prisma));
/**
 * 회원가입(signUp)
 */
async function signUp(req, res) {
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
async function login(req, res) {
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
async function logout(req, res) {
    const userId = req.user.id;
    await authService.logout(userId);
    res.clearCookie('refreshToken');
    res.status(204).send();
}
/**
 * 토큰 재발급(refresh)
 */
async function refresh(req, res) {
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
