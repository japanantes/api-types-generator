"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypesRegister = void 0;
class TypesRegister {
    static instance = new TypesRegister();
    enums;
    constructor() {
        this.enums = new Map();
    }
    static getInstance() {
        return TypesRegister.instance;
    }
    registerEnum(name, type) {
        this.enums.set(name, type);
    }
}
exports.TypesRegister = TypesRegister;
//# sourceMappingURL=types.register.js.map