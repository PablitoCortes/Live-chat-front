"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    title: String,
    creationDate: { type: Date, default: Date.now },
    participants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Message" }],
    lastMessage: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Message" },
});
const ConversationModel = mongoose_1.default.model("Conversation", conversationSchema);
exports.default = ConversationModel;
