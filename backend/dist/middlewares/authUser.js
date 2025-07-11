"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService_1 = require("../services/userService");
const apiResponse_1 = require("../utils/apiResponse");
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "tu-secreto-seguro");
        return decoded;
    }
    catch (error) {
        throw new Error("Invalid token");
    }
});
exports.verifyToken = verifyToken;
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.token;
        if (!token) {
            (0, apiResponse_1.sendError)(res, 401, "No token provided");
            return;
        }
        const decoded = yield (0, exports.verifyToken)(token);
        if (!decoded || !decoded.userId) {
            (0, apiResponse_1.sendError)(res, 401, "Invalid token format");
            return;
        }
        const user = yield (0, userService_1.getUserProfileService)(decoded.userId);
        if (!user) {
            (0, apiResponse_1.sendError)(res, 401, "User not found");
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 401, "Invalid token", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 401, "Invalid token");
        }
    }
});
exports.authUser = authUser;
