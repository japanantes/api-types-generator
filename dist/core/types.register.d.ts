export declare class TypesRegister {
    private static instance;
    readonly enums: Map<string, any>;
    private constructor();
    static getInstance(): TypesRegister;
    registerEnum(name: string, type: any): void;
}
