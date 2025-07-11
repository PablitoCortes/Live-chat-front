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
exports.getConversationMessagesService = exports.deleteMessageService = exports.createMessageService = void 0;
const MessageModel_1 = __importDefault(require("../models/MessageModel"));
const ConversationModel_1 = __importDefault(require("../models/ConversationModel"));
const conversationService_1 = require("./conversationService");
const createMessageService = (messageData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMessage = new MessageModel_1.default(messageData);
        const savedMessage = yield newMessage.save();
        yield ConversationModel_1.default.findByIdAndUpdate(messageData.conversationId, {
            $push: { messages: savedMessage._id }
        });
        yield (0, conversationService_1.updateLastMessageService)(messageData.conversationId, savedMessage._id.toString());
        return savedMessage;
    }
    catch (error) {
        throw new Error(`Error creating message: ${error}`);
    }
});
exports.createMessageService = createMessageService;
const deleteMessageService = (messageId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageToDelete = yield MessageModel_1.default.findOneAndDelete({
            sender: userId,
            _id: messageId,
        });
        if (!messageToDelete) {
            throw new Error("Message not found");
        }
        return messageToDelete;
    }
    catch (error) {
        throw new Error("Error deleting message");
    }
});
exports.deleteMessageService = deleteMessageService;
const getConversationMessagesService = (conversationId_1, ...args_1) => __awaiter(void 0, [conversationId_1, ...args_1], void 0, function* (conversationId, page = 1, limit = 20) {
    if (!conversationId) {
        throw new Error("ConversationId missing");
    }
    try {
        const messages = yield MessageModel_1.default.find({ conversationId })
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        const totalMessages = yield MessageModel_1.default.countDocuments({ conversationId });
        const totalPages = Math.ceil(totalMessages / limit);
        return {
            messages,
            pagination: {
                currentPage: page,
                totalPages,
                totalMessages,
                hasMore: page < totalPages,
            },
        };
    }
    catch (err) {
        console.error(err);
        throw new Error("Error fetching messages");
    }
});
exports.getConversationMessagesService = getConversationMessagesService;
