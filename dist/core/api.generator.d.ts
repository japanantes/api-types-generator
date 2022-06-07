import { Route } from "..";
export declare class ApiGenerator {
    private static instance;
    private routes;
    private typesRegister;
    private constructor();
    static getInstance(): ApiGenerator;
    registerRoute(name: string, route: Route): void;
    generateApiRegister(): void;
    private generateMethodEnumTS;
    private generateRegisteredTypesTS;
    private generateRouteTypeTS;
    private generateRoutesTypes;
    private generateRouteTS;
    private getDataTypeTS;
    private generateInputTypeTS;
    private generateOutputTypeTS;
    private writeApiRegisterToFile;
}
