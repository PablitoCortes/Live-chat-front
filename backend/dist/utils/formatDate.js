"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localDateFormat = void 0;
const localDateFormat = (date) => {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
};
exports.localDateFormat = localDateFormat;
