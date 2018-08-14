"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtendableError = require("es6-error");
// @ts-ignore: ExtendableError miss match imported interface
class ApplicationError extends ExtendableError {
    constructor(message = 'There was an error', log) {
        super(message);
        this._log = log;
    }
    get status() {
        return this.constructor.status || 500;
    }
    get log() {
        return this._log || this.message;
    }
}
exports.ApplicationError = ApplicationError;
