/**
 * 비동기 콘트롤 함수를 위한 래퍼 함수.
 * 콘트롤러에서 발생한 비동기 에러를 잡아 Express의 에러 핸들러로 전달한다.
 * @param {AsyncRequestHandler} requestHandler - 비동기 로직을 포함하는 컨트롤러 함수
 */
export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};
