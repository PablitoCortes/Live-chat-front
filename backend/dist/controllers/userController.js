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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccount = exports.deleteUserAccount = exports.deleteContact = exports.LogoutUser = exports.addContact = exports.getContacts = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const userService_1 = require("../services/userService");
const apiResponse_1 = require("../utils/apiResponse");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            (0, apiResponse_1.sendError)(res, 400, "Email, password and name are required");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            (0, apiResponse_1.sendError)(res, 400, "Invalid email format");
            return;
        }
        const userData = {
            email,
            password,
            name,
            creationDate: new Date(),
        };
        const user = yield (0, userService_1.registerUserService)(userData);
        const _a = user.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
        (0, apiResponse_1.sendResponse)(res, 201, "User registered successfully", userWithoutPassword);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error registering user", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error registering user");
        }
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            (0, apiResponse_1.sendError)(res, 400, "Email and password are required");
            return;
        }
        const { user, token } = yield (0, userService_1.loginUserService)(email, password);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
        });
        (0, apiResponse_1.sendResponse)(res, 200, "Login successful", {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
            token
        });
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 401, "Invalid credentials", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 401, "Invalid credentials");
        }
    }
});
exports.loginUser = loginUser;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        if (!userId) {
            (0, apiResponse_1.sendError)(res, 401, "Unauthorized");
            return;
        }
        const user = yield (0, userService_1.getUserProfileService)(userId);
        if (!user) {
            (0, apiResponse_1.sendError)(res, 404, "User not found");
            return;
        }
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        (0, apiResponse_1.sendResponse)(res, 200, "User profile retrieved successfully", userWithoutPassword);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error fetching user profile", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error fetching user profile");
        }
    }
});
exports.getUserProfile = getUserProfile;
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        (0, apiResponse_1.sendError)(res, 401, "Unauthorized");
        return;
    }
    try {
        const contacts = yield (0, userService_1.getContactsService)(userId);
        if (!contacts || contacts.length === 0) {
            (0, apiResponse_1.sendResponse)(res, 200, "No contacts found", []);
            return;
        }
        (0, apiResponse_1.sendResponse)(res, 200, "Contacts fetched successfully", contacts);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error fetching contacts", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error fetching contacts");
        }
    }
});
exports.getContacts = getContacts;
const addContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { contactEmail } = req.body;
        if (!userId || !contactEmail) {
            (0, apiResponse_1.sendError)(res, 400, "User and contact information are required");
            return;
        }
        const addedContact = yield (0, userService_1.addContactService)(userId, contactEmail);
        (0, apiResponse_1.sendResponse)(res, 200, "Contact added successfully", addedContact);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "Contact already exists") {
                (0, apiResponse_1.sendError)(res, 409, error.message);
            }
            else if (error.message === "Contact not found") {
                (0, apiResponse_1.sendError)(res, 404, error.message);
            }
            else if (error.message === "acct Owner not found") {
                (0, apiResponse_1.sendError)(res, 404, "User not found");
            }
            else {
                (0, apiResponse_1.sendError)(res, 500, "Error adding contact", error.message);
            }
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error adding contact");
        }
    }
});
exports.addContact = addContact;
const LogoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", {
            sameSite: "strict",
            expires: new Date(0),
        });
        (0, apiResponse_1.sendResponse)(res, 200, "Logout completed successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error finishing session", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error finishing session");
        }
    }
});
exports.LogoutUser = LogoutUser;
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { contactId } = req.params;
    if (!userId || !contactId) {
        (0, apiResponse_1.sendError)(res, 400, "Missing required data");
        return;
    }
    try {
        const userContacts = yield (0, userService_1.getContactsService)(userId);
        const contact = userContacts === null || userContacts === void 0 ? void 0 : userContacts.find((contact) => contact.toString() === contactId);
        if (!contact) {
            (0, apiResponse_1.sendError)(res, 404, "Contact not found");
            return;
        }
        const newContactsList = yield (0, userService_1.deleteContactService)(userId, contactId);
        (0, apiResponse_1.sendResponse)(res, 200, "Contact deleted successfully", newContactsList);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error deleting contact", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error deleting contact");
        }
    }
});
exports.deleteContact = deleteContact;
const deleteUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            (0, apiResponse_1.sendError)(res, 401, "Unauthorized");
            return;
        }
        yield (0, userService_1.deleteUserAccountService)(userId);
        res.clearCookie("token", {
            sameSite: "strict",
            expires: new Date(0),
        });
        (0, apiResponse_1.sendResponse)(res, 200, "User account deleted successfully");
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error deleting user account", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error deleting user account");
        }
    }
});
exports.deleteUserAccount = deleteUserAccount;
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { email, name } = req.body;
    if (!userId) {
        (0, apiResponse_1.sendError)(res, 401, "Unauthorized");
        return;
    }
    if (!email || !name) {
        (0, apiResponse_1.sendError)(res, 400, "Email and name are required");
        return;
    }
    try {
        const updateData = { email, name };
        const updatedUser = yield (0, userService_1.updateAccountService)(userId, updateData);
        if (!updatedUser) {
            (0, apiResponse_1.sendError)(res, 404, "User not found");
            return;
        }
        const _b = updatedUser.toObject(), { password: _ } = _b, userWithoutPassword = __rest(_b, ["password"]);
        (0, apiResponse_1.sendResponse)(res, 200, "Account updated successfully", userWithoutPassword);
    }
    catch (error) {
        if (error instanceof Error) {
            (0, apiResponse_1.sendError)(res, 500, "Error updating account", error.message);
        }
        else {
            (0, apiResponse_1.sendError)(res, 500, "Error updating account");
        }
    }
});
exports.updateAccount = updateAccount;
