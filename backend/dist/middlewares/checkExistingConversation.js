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
exports.checkExistingConversation = void 0;
const ConversationModel_1 = __importDefault(require("../models/ConversationModel"));
const checkExistingConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { contactId } = req.body;
    if (!userId || !contactId) {
        res.status(400).json({ message: "Invalid user or recipient data middleware" });
        return;
    }
    const participants = [userId, contactId];
    if (!Array.isArray(participants) || participants.length < 2) {
        res.status(400).json({ message: "Invalid participants data " });
        return;
    }
    try {
        const existingConversation = yield ConversationModel_1.default.findOne({
            participants: { $all: participants },
        });
        if (existingConversation) {
            res.status(409).json({ message: "Conversation Already Exists" });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error finding if conversation exists:", error);
        res.status(500).json({ message: "Error finding if conversation exists" });
    }
});
exports.checkExistingConversation = checkExistingConversation;
