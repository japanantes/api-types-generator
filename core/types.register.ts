import { Route } from "..";

export class TypesRegister {
    private static instance: TypesRegister = new TypesRegister();
    readonly enums: Map<string, any>;

    private constructor() {
        this.enums = new Map<string, Route>();
    }

    static getInstance() {
        return TypesRegister.instance;
    }

    registerEnum(name: string, type: any) {
        this.enums.set(name, type);
    }
}
