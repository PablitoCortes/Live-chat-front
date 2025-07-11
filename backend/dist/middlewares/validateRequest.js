"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const apiResponse_1 = require("../utils/apiResponse");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        (0, apiResponse_1.sendError)(res, 400, "Validation error", errors
            .array()
            .map((err) => err.msg)
            .join(", "));
        return;
    }
    next();
};
exports.validateRequest = validateRequest;
