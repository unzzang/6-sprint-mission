"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_COOKIE_NAME = exports.ACCESS_TOKEN_COOKIE_NAME = exports.JWT_ACCESS_TOKEN_SECRET = exports.PORT = exports.NODE_ENV = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const UPLOADS_PATH = 'uploads';
const NODE_ENV = process.env.NODE_ENV || 'development';
exports.NODE_ENV = NODE_ENV;
const PORT = process.env.PORT || 3000;
exports.PORT = PORT;
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_access_token_secret';
exports.JWT_ACCESS_TOKEN_SECRET = JWT_ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_COOKIE_NAME = 'access-token';
exports.ACCESS_TOKEN_COOKIE_NAME = ACCESS_TOKEN_COOKIE_NAME;
const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';
exports.REFRESH_TOKEN_COOKIE_NAME = REFRESH_TOKEN_COOKIE_NAME;
