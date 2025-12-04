import { prisma } from '../lib/constants.js';
import { UserRepository } from '../repositories/userRepository.js';

// 로그인: 이메일/비밀번호를 받아 사용자가 맞는지 확인 (login or verifyCredentials)
// 토큰 발급: 로그인이 성공하면 Access Token, Refresh Token을 생성 (issueTokens)
// 토큰 재발급: 만료된 Access Token을 Refresh Token으로 재발급 (refreshAccessToken)
// 로그아웃: 로그인 상태를 해제 (logout)
