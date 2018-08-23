"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationError_1 = require("./ApplicationError");
class UncaughtError extends ApplicationError_1.ApplicationError {
    constructor(message = 'There was an error', log, stack) {
        super(message, log);
        this.stack = stack;
    }
    static get status() {
        return 500;
    }
}
exports.UncaughtError = UncaughtError;
