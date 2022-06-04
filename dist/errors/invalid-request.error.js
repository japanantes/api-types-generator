"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRequestError = void 0;
class InvalidRequestError extends Error {
    code = 400;
    relatedData;
    message;
    constructor(message, relatedData) {
        super(message);
        this.name = "InvalidValue";
        this.formatMessage(message, relatedData);
        this.relatedData = relatedData;
    }
    formatMessage(message, relatedData) {
        this.message = `Bad Request : ${message}\n\tProvided Error Data :\n\t\t${JSON.stringify(relatedData, undefined, 2)}\n`;
    }
}
exports.InvalidRequestError = InvalidRequestError;
//# sourceMappingURL=invalid-request.error.js.map