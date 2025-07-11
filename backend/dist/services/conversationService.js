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
exports.updateLastMessageService = exports.getConversationService = exports.deleteUserConversationService = exports.getUserConversationsService = exports.createConversationService = void 0;
const ConversationModel_1 = __importDefault(require("../models/ConversationModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const createConversationService = (conversationData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!conversationData || !conversationData.participants) {
        throw new Error("Invalid conversation data");
    }
    if (conversationData.participants.length < 2) {
        throw new Error("At least two participants are required");
    }
    try {
        const newConversation = new ConversationModel_1.default(conversationData);
        const savedConversation = yield newConversation.save();
        yield UserModel_1.default.updateMany({ _id: { $in: conversationData.participants } }, { $push: { conversations: savedConversation._id } });
        return savedConversation;
    }
    catch (error) {
        throw new Error(`Error creating conversation: ${error}`);
    }
});
exports.createConversationService = createConversationService;
const getUserConversationsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error("Access denied");
    }
    try {
        const conversations = yield ConversationModel_1.default.find({
            participants: userId,
        })
            .populate("participants", "name email")
            .populate("lastMessage", "content senderId createdAt")
            .sort({ "lastMessage.createdAt": -1, creationDate: -1 })
            .lean();
        if (!conversations || conversations.length === 0) {
            return [];
        }
        return conversations;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error fetching conversations: ${error.message}`);
        }
    }
});
exports.getUserConversationsService = getUserConversationsService;
const deleteUserConversationService = (userId, conversationId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error("accessDenied");
    }
    if (!conversationId) {
        throw new Error("missing data");
    }
    try {
        const deletedConversation = yield ConversationModel_1.default.findOneAndDelete({
            _id: conversationId,
            participants: userId,
        });
        if (!deletedConversation) {
            throw new Error("Conversation not found or access denied");
        }
        return deletedConversation;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error deleting conversation: ${error.message}`);
        }
    }
});
exports.deleteUserConversationService = deleteUserConversationService;
const getConversationService = (conversationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = yield ConversationModel_1.default.findOne({
            _id: conversationId,
            participants: userId,
        })
            .populate('participants', 'name email username')
            .populate('lastMessage', 'content senderId createdAt timestamp')
            .lean();
        if (!conversation) {
            throw new Error("Conversation not found or access denied");
        }
        return conversation;
    }
    catch (error) {
        throw new Error(`Error fetching conversation: ${error}`);
    }
});
exports.getConversationService = getConversationService;
const updateLastMessageService = (conversationId, messageId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ConversationModel_1.default.findByIdAndUpdate(conversationId, {
            lastMessage: messageId
        });
    }
    catch (error) {
        throw new Error(`Error updating last message: ${error}`);
    }
});
exports.updateLastMessageService = updateLastMessageService;
