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
exports.updateAccountService = exports.deleteUserAccountService = exports.deleteContactService = exports.addContactService = exports.getContactsService = exports.loginUserService = exports.getUserProfileService = exports.registerUserService = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const MessageModel_1 = __importDefault(require("../models/MessageModel"));
const registerUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new UserModel_1.default(userData);
    return yield newUser.save();
});
exports.registerUserService = registerUserService;
const getUserProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error("missing Data");
    }
    try {
        const foundUser = yield UserModel_1.default.findById(userId)
            .populate('contacts', '_id name email')
            .populate('conversations', '_id participants creationDate');
        const formatedUser = foundUser === null || foundUser === void 0 ? void 0 : foundUser.toObject();
        if (!formatedUser) {
            throw new Error("account not found");
        }
        return formatedUser;
    }
    catch (error) {
        throw new Error("error getting user from DB");
    }
});
exports.getUserProfileService = getUserProfileService;
const loginUserService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    const user = yield UserModel_1.default.findOne({ email, password, isDeleted: false });
    if (!user || user.password !== password) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user._id,
        email: user.email,
    }, process.env.JWT_SECRET || "tu-secreto-seguro", { expiresIn: "24h" });
    return { user, token };
});
exports.loginUserService = loginUserService;
const getContactsService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error("User Error");
    }
    try {
        const user = yield UserModel_1.default.findById(userId).populate('contacts', '_id name email');
        if (!user) {
            throw new Error("user not found");
        }
        if (user.contacts.length < 0) {
            throw new Error("no contacts found");
        }
        return user === null || user === void 0 ? void 0 : user.contacts;
    }
    catch (error) {
        throw new Error("Error geting contacts ");
    }
});
exports.getContactsService = getContactsService;
const addContactService = (userId, contactEmail) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUser = yield UserModel_1.default.findById(userId);
        if (!currentUser) {
            throw new Error("acct Owner not found");
        }
        const contactToAdd = yield UserModel_1.default.findOne({ email: contactEmail });
        if (!contactToAdd) {
            throw new Error("Contact not found");
        }
        if ((_a = currentUser.contacts) === null || _a === void 0 ? void 0 : _a.includes(contactToAdd.id)) {
            throw new Error("Contact already exists");
        }
        currentUser.contacts = [...(currentUser.contacts || []), contactToAdd.id];
        yield currentUser.save();
        return currentUser;
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Error adding contact in DB");
    }
});
exports.addContactService = addContactService;
const deleteContactService = (userId, contactId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield UserModel_1.default.findById(userId);
        if (!foundUser) {
            throw new Error("User not found");
        }
        foundUser.contacts = foundUser.contacts.filter((contact) => contact.toString() !== contactId);
        yield foundUser.save();
        return foundUser.contacts;
    }
    catch (error) {
        throw new Error("Error deleting contact");
    }
});
exports.deleteContactService = deleteContactService;
const deleteUserAccountService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield UserModel_1.default.findOneAndDelete({ _id: userId });
        if (!deletedUser) {
            throw new Error("User not found");
        }
        yield MessageModel_1.default.updateMany({ sender: userId }, { isDeleted: true, deletedAt: new Date() });
    }
    catch (error) {
        throw new Error("Error deleting user account");
    }
});
exports.deleteUserAccountService = deleteUserAccountService;
const updateAccountService = (userId, dataToupdate) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error("missing data");
    }
    try {
        const updatedUser = yield UserModel_1.default.findByIdAndUpdate(userId, dataToupdate, {
            new: true,
            runValidatos: true,
        });
        return updatedUser;
    }
    catch (error) {
        throw new Error("Error updating data");
    }
});
exports.updateAccountService = updateAccountService;
