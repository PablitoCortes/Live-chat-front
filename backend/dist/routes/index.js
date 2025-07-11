"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter_1 = __importDefault(require("./userRouter"));
const messageRouter_1 = __importDefault(require("./messageRouter"));
const conversationRouter_1 = __importDefault(require("./conversationRouter"));
const router = (0, express_1.Router)();
router.use("/users", userRouter_1.default);
router.use("/messages", messageRouter_1.default);
router.use("/conversations", conversationRouter_1.default);
exports.default = router;
