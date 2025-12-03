import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname); // 확장자 받아오기
        const randomName = crypto.randomBytes(8).toString('hex');
        callback(null, `${randomName}_${Date.now()}${ext}`); // random 파일명 만들기
    },
});
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});
export const uploadPath = path.join(__dirname, '..', '..', 'uploads');
