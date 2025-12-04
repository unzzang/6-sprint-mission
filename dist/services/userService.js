var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
// email, nickname, password, address 검사는 validator에서 진행
export class UserService {
    // 생성자를 통해 UserRepository 인스턴스를 주입받습니다.
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    // 회원가입
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. 비즈니스 로직을 처리 (예: 비밀번호 암호화)
            const hashedPassword = yield bcrypt.hash(userData.password, 10);
            // 2. Repository에 전달할 데이터 준비
            const createData = Object.assign(Object.assign({}, userData), { password: hashedPassword });
            // 3. prisma.user.create() 대신 userRepository의 메소드를 호출
            return this.userRepository.createUser(createData);
        });
    }
    //회원정보수정
    updateUser(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign({}, userData);
            // 비즈니스 로직: 업데이트 정보에 'password' 포함시
            // 새로운 비밀번호를 암호화(hash)해서 updateData에 반영
            if (typeof updateData.password === 'string') {
                const hashedPassword = yield bcrypt.hash(updateData.password, 10);
                updateData.password = hashedPassword;
            }
            // 4. Repository 호출
            return this.userRepository.updateUser(id, updateData);
        });
    }
    // 회원탈퇴(삭제)
    deleteUser(id, passwordToCheck) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. ID 기준 사용자 찾기
            const user = yield this.userRepository.findUserById(id);
            // 2. user를 찾을 수 없을 때
            if (!user) {
                const error = new Error('사용자를 찾을 수 없습니다.');
                error.status = 404; // 404 Not Found
                throw error;
            }
            const isPasswordCorrect = yield bcrypt.compare(passwordToCheck, user.password);
            // 3. 비밀번호 틀리면 에러 처리
            if (!isPasswordCorrect) {
                const error = new Error('비밀번호가 일치하지 않습니다.');
                error.status = 403; // 403 Forbidden(권한없음)
                throw error;
            }
            // 4. 모든 확인 완료 후 Repository에 삭제 요청
            return this.userRepository.deleteUser(id);
        });
    }
    // 이메일 또는 닉네임으로 사용자 찾기
    findUserByEmailOrNickname(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, nickname, }) {
            return this.userRepository.findUserByEmailOrNickname({
                email,
                nickname,
            });
        });
    }
    // 회원정보 불러오기
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findUserById(id);
        });
    }
}
