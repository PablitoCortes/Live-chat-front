"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const validateEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        (0, apiResponse_1.sendError)(res, 400, "Email is required");
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        (0, apiResponse_1.sendError)(res, 400, "Invalid email format");
        return;
    }
    next();
};
exports.validateEmail = validateEmail;
