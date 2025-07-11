"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const authSocket = (socket, next) => {
    const cookiesHeader = socket.handshake.headers.cookie;
    if (!cookiesHeader) {
        return next(new Error("Authentication required: no cookie header found"));
    }
    const cookies = cookie_1.default.parse(cookiesHeader);
    const token = cookies.token;
    if (!token) {
        return next(new Error("Authentication required: token not found"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "tu-secreto-seguro");
        socket.user = decoded;
        next();
    }
    catch (error) {
        next(new Error("Invalid token"));
    }
};
exports.authSocket = authSocket;
