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
exports.getConversation = exports.deleteUserConversation = exports.getUserConversations = exports.createConversation = void 0;
const conversationService_1 = require("../services/conversationService");
const apiResponse_1 = require("../utils/apiResponse");
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const secondParty = req.body.contactId;
    if (!userId) {
        (0, apiResponse_1.sendError)(res, 401, "Access Denied");
        return;
    }
    const participants = [userId, secondParty];
    if (!participants || participants.length < 2) {
        (0, apiResponse_1.sendError)(res, 400, "Min two participants are needed");
        return;
    }
    try {
        const conversationData = {
            participants,
            creationDate: new Date(),
        };
        const newConversation = yield (0, conversationService_1.createConversationService)(conversationData);
        (0, apiResponse_1.sendResponse)(res, 201, "Conversation Created Successfully", newConversation);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error creating conversation", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error creating conversation");
        }
    }
});
exports.createConversation = createConversation;
const getUserConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        (0, apiResponse_1.sendError)(res, 401, "Access Denied");
        return;
    }
    try {
        const conversations = yield (0, conversationService_1.getUserConversationsService)(userId);
        if (!conversations || conversations.length === 0) {
            (0, apiResponse_1.sendResponse)(res, 200, "No conversations found", []);
            return;
        }
        (0, apiResponse_1.sendResponse)(res, 200, "Conversations fetched successfully", conversations);
        console.log(conversations);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error fetching conversations", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error fetching conversations");
        }
    }
});
exports.getUserConversations = getUserConversations;
const deleteUserConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { conversationId } = req.params;
    if (!userId || !conversationId) {
        (0, apiResponse_1.sendError)(res, 400, "Missing required data");
        return;
    }
    try {
        const deletedConversation = yield (0, conversationService_1.deleteUserConversationService)(userId, conversationId);
        if (!deletedConversation) {
            (0, apiResponse_1.sendError)(res, 404, "Conversation not found");
            return;
        }
        (0, apiResponse_1.sendResponse)(res, 200, "Conversation deleted successfully", deletedConversation);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error deleting conversation", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error deleting conversation");
        }
    }
});
exports.deleteUserConversation = deleteUserConversation;
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { conversationId } = req.params;
    if (!userId || !conversationId) {
        (0, apiResponse_1.sendError)(res, 400, "Missing required data");
        return;
    }
    try {
        const result = yield (0, conversationService_1.getConversationService)(conversationId, userId);
        (0, apiResponse_1.sendResponse)(res, 200, "Conversation and messages fetched successfully", result);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error fetching conversation with messages", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error fetching conversation with messages");
        }
    }
});
exports.getConversation = getConversation;
