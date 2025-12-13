"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const productRouter_1 = __importDefault(require("./productRouter"));
const productCommentRouter_1 = __importDefault(require("./productCommentRouter"));
const articleRouter_1 = __importDefault(require("./articleRouter"));
const articleCommentRouter_1 = __importDefault(require("./articleCommentRouter"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('ok');
});
router.use('/user', userRouter_1.default);
router.use('/auth', authRouter_1.default);
router.use('/products', productRouter_1.default);
router.use('/articles', articleRouter_1.default);
router.use(productCommentRouter_1.default);
router.use(articleCommentRouter_1.default);
exports.default = router;
