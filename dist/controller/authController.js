export {};
// export const refresh = (req: Request,res: Response) = async (req, res) => {
//   const refreshToken = req.cookie['refresh-token'];
//   if (!refreshToken) {
//     const error = new Error('리프레시 토큰이 없습니다.');
//     error.status = 401;
//     throw error;
//   }
//   const newAccessToken = await authService.refresh(refreshToken);
//   res.cookie(ACCESS_TOKEN_COOKIE_NAME, newAccessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//   });
//   res.status(200).json({ message: '토큰이 성공적으로 갱신되었습니다.' });
// };
