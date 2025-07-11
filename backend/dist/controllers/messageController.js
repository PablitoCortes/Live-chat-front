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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getConversationMessages = exports.createMessage = void 0;
const messageService_1 = require("../services/messageService");
const apiResponse_1 = require("../utils/apiResponse");
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { receiver, content, conversationId } = req.body;
    if (!userId || !receiver || !content || !conversationId) {
        (0, apiResponse_1.sendError)(res, 400, "Receiver, content, and conversationId are required");
        return;
    }
    try {
        const localtime = new Date();
        const localOffset = localtime.getTimezoneOffset() * 60000;
        const timestamp = new Date(localtime.getTime() - localOffset);
        const messageData = {
            sender: userId,
            receiver,
            content,
            conversationId,
            timestamp,
        };
        const newMessage = yield (0, messageService_1.createMessageService)(messageData);
        if (!newMessage) {
            (0, apiResponse_1.sendError)(res, 500, "Error creating message");
            return;
        }
        (0, apiResponse_1.sendResponse)(res, 201, "Message created successfully", newMessage);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error creating message", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error creating message");
        }
    }
});
exports.createMessage = createMessage;
const getConversationMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { conversationId } = req.params;
    if (!userId) {
        (0, apiResponse_1.sendError)(res, 401, "unauthorized");
        return;
    }
    try {
        const convMessages = yield (0, messageService_1.getConversationMessagesService)(conversationId);
        if (!convMessages) {
            (0, apiResponse_1.sendError)(res, 404, "no ConversationFound");
            return;
        }
        (0, apiResponse_1.sendResponse)(res, 201, "Messages retrieved", convMessages);
    }
    catch (err) {
        if (err instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error creating message", err.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error creating message");
        }
    }
});
exports.getConversationMessages = getConversationMessages;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { messageId } = req.params;
    if (!messageId) {
        (0, apiResponse_1.sendError)(res, 400, "Message ID is required");
        return;
    }
    try {
        const messageToDelete = yield (0, messageService_1.deleteMessageService)(messageId, userId);
        (0, apiResponse_1.sendResponse)(res, 200, "Message deleted successfully", messageToDelete);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error deleting message", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error deleting message");
        }
    }
});
exports.deleteMessage = deleteMessage;
