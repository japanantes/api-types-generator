import { Route } from "..";

/**
 * Singleton class used to add types to the API output file.
 */
export class TypesRegister {
    private static instance: TypesRegister = new TypesRegister();
    readonly enums: Map<string, any>;

    private constructor() {
        this.enums = new Map<string, Route>();
    }

    static getInstance() {
        return TypesRegister.instance;
    }

    /**
     * Function that adds an enum to the list of types to generate.
     * @param name The name of the generated enum.
     * @param type The enum.
     */
    registerEnum(name: string, type: any) {
        this.enums.set(name, type);
    }
}
