"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendResponse = void 0;
const sendResponse = (res, statusCode, message, data, error) => {
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        message,
        data,
        error,
    };
    res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
const sendError = (res, statusCode, message, error) => {
    (0, exports.sendResponse)(res, statusCode, message, undefined, error);
};
exports.sendError = sendError;
