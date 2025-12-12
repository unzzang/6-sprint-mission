import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/userRepository';

// 생성된 모든 유효성 검사 규칙 실행
// 오류시 400 상태코드와 함께 오류 응답하는 미들웨어
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next(); // 오류가 없으면 다음 미들웨어로
  }

  // 오류가 있으면 배열 형태로 응답
  return res.status(400).json({ errors: errors.array() });
};

export const UserValidators = (userRepository: UserRepository) => {
  const deleteValidator = [
    // ID 검사
    param('id')
      .notEmpty()
      .withMessage('ID는 필수 항목입니다.')
      .isUUID()
      .withMessage('사용자를 찾을 수 없습니다.'),

    // password 검사
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요'),
  ];

  const registerValidator = [
    // email 검사
    body('email')
      .notEmpty()
      .withMessage('이메일은 필수 항목입니다.')
      .isEmail()
      .withMessage('이메일 주소를 입력해주세요.')
      .custom(async (email) => {
        const existingUser = await userRepository.findUserByEmailOrNickname({
          email,
        });
        if (existingUser) {
          return Promise.reject('이미 사용 중인 이메일 입니다.');
        }
      }),

    // nickname 검사
    body('nickname')
      .notEmpty()
      .withMessage('닉네임은 필수 항목입니다.')
      .isLength({ min: 2 })
      .withMessage('2자 이상 입력해주세요.')
      .custom(async (nickname) => {
        const existingUser = await userRepository.findUserByEmailOrNickname({
          nickname,
        });
        if (existingUser) {
          return Promise.reject('이미 사용 중인 닉네임입니다.');
        }
      }),

    // password 검사
    body('password')
      .notEmpty()
      .withMessage('비밀번호를 입력해주세요')
      .isLength({ min: 4 })
      .withMessage('비밀번호를 4자 이상 입력해주세요.'),

    // address검사
    body('address').optional().isString().withMessage('주소를 입력해주세요.'),
  ];

  // 참고: 'ID'는 보통 URL 파라미터(req.param.id)로 받거나
  // 세션에서 가져오므로, body에서 유효성을 검사하는 경우는 드물다

  return { registerValidator, deleteValidator };

  // 나중에 updateUserValidator 등 다른 검사기들도 추가 가능
};

export const AuthValidators = () => {
  const loginValidator = [
    // 이메일 검사
    body('email')
      .notEmpty()
      .withMessage('이메일은 필수 항목입니다.')
      .isEmail()
      .withMessage('이메일 형식이 올바르지 않습니다.'),

    // 비밀번호 검사
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요'),
  ];

  return { loginValidator };
};

export const ArticleValidators = () => {
  const validateArticleId = [
    param('articleId')
      .notEmpty()
      .withMessage('게시글 ID는 필수 항목입니다.')
      .isUUID()
      .withMessage('유효하지 않은 게시글 ID 입니다.'),
  ];

  const validateId = [
    param('id')
      .notEmpty()
      .withMessage('게시글 ID는 필수 항목입니다.')
      .isUUID()
      .withMessage('유효하지 않은 게시글 ID 입니다.'),
  ];
  return { validateArticleId, validateId };
};
