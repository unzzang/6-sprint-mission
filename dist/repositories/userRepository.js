var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
        this.prisma = prisma;
    }
    // 회원가입
    // 매개변수의 타입을 Prisma.UserCreateInput으로 명시
    // Prisma.UserCreateInput은 생성할 때 사용하는 타입, 필수 필드를 포함할 수 있음
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.prisma.user.create처럼 어떤 모델을 생성할 것인지 명시
            return this.prisma.user.create({ data });
        });
    }
    // 회원정보수정
    // 매개변수의 타입을 Prisma.UserUpdateInput으로 명시
    // Prisma.UserCreateInput은 기존 사용자를 수정할 때 사용.
    // 모든 필드가 optional로, 일부 필드만 변경하려는 의도에 정확하게 일치함
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.update({ where: { id }, data });
        });
    }
    // 회원탈퇴(삭제)
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.delete({ where: { id } });
        });
    }
    // 이메일 또는 닉네임으로 사용자 찾기
    findUserByEmailOrNickname(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, nickname, }) {
            // email 또는 nickname 중 하나라도 인자로 들어왔는지 확인합니다.
            if (!email && !nickname) {
                return null;
            }
            // 둘 중 어떤 조건에 해당하는 사용자를 찾을지 동적으로 결정합니다.
            return this.prisma.user.findFirst({
                where: {
                    OR: [{ email }, { nickname }],
                },
            });
        });
    }
    // 회원정보 찾기
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findUnique({
                where: { id },
            });
        });
    }
    // 회원찾기
    // findMany의 경우 where(검색조건), orderBy(정렬), take(개수제한), skip(건너뛰기)등 다양한 옵션제공
    // UserFindManyArgs는 모든 옵션을 포함
    findUsers(findOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findMany(findOptions);
        });
    }
}
