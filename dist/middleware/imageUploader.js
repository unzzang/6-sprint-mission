"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPath = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, exports.uploadPath);
    },
    filename: (req, file, callback) => {
        const ext = path_1.default.extname(file.originalname); // 확장자 받아오기
        const randomName = crypto_1.default.randomBytes(8).toString('hex');
        callback(null, `${randomName}_${Date.now()}${ext}`); // random 파일명 만들기
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});
exports.uploadPath = path_1.default.join(__dirname, '..', '..', 'uploads');
