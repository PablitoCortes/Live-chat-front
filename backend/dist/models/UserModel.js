"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    password: String,
    creationDate: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    conversations: [
        { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Conversation" },
    ],
    contacts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
