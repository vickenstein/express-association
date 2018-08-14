"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationError_1 = require("./ApplicationError");
class ParameterValidationError extends ApplicationError_1.ApplicationError {
    static get status() {
        return 422;
    }
}
exports.ParameterValidationError = ParameterValidationError;
