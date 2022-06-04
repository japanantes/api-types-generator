"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGenerator = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const route_decorator_1 = require("../express/decorators/route.decorator");
const types_1 = __importDefault(require("../types/types"));
const types_register_1 = require("./types.register");
class ApiGenerator {
    static instance = new ApiGenerator();
    routes;
    typesRegister = types_register_1.TypesRegister.getInstance();
    constructor() {
        this.routes = new Map();
    }
    static getInstance() {
        return ApiGenerator.instance;
    }
    registerRoute(name, route) {
        this.routes.set(name, route);
    }
    generateApiRegister() {
        let ts = "// Generated content, don't touch\n\n";
        ts += this.generateRouteTypeTS();
        ts += this.generateMethodEnumTS();
        ts += this.generateRegisteredTypesTS();
        const routesTypes = {
            get: [],
            post: [],
        };
        for (let [name, route] of this.routes.entries()) {
            ts += this.generateRouteTS(name, route);
            routesTypes[route.method].push(name);
        }
        ts += this.generateRoutesTypes(routesTypes);
        this.writeApiRegisterToFile(ts);
    }
    generateMethodEnumTS() {
        let ts = `\nexport enum Method {`;
        Object.values(types_1.default.Method).forEach((method) => (ts += `\n\t${method},`));
        ts += "\n}\n\n";
        return ts;
    }
    generateRegisteredTypesTS() {
        let ts = "\n";
        this.typesRegister.enums.forEach((type, name) => {
            ts += `\nexport enum ${name} {`;
            Object.entries(type).forEach(([key, value]) => (ts += `\n\t${key} = ${typeof value === "number" ? value : `"${value}"`},`));
            ts += "\n}\n";
        });
        return ts;
    }
    generateRouteTypeTS() {
        return `\ntype Route = {name: string; method: Method; path: string; requireAuth?: boolean | undefined; data?: any | undefined; res:any};\n\n`;
    }
    generateRoutesTypes(routesTypes) {
        let types = "";
        Object.entries(routesTypes).forEach(([method, routes]) => {
            types += `\nexport type T${method.toUpperCase()}Routes = Route${routes.join(" | Route")};`;
        });
        return types;
    }
    generateRouteTS(name, route) {
        let ts = `export type TRoute${name}Input = ${this.getDataTypeTS(route.required?.body)};\n`;
        ts += `export type TRoute${name}Output = ${this.generateOutputTypeTS(route.response)};\n`;
        ts += `
export type Route${name} = {
    name: "${name}";
    method: Method.${route.method};
    path: "${route.path}";
    requireAuth: ${route.auth};
    ${route.required?.body
            ? `data: TRoute${name}Input`
            : `data?: TRoute${name}Input`}
    res: TRoute${name}Output;
};
export const getRequest${name} = (${route.required?.body ? `data: Route${name}["data"]` : ""}): Omit<Route${name}, "res"> => ({
    name: "${name}",
    method: Method.${route.method},
    path: "${route.path}",
    requireAuth: ${route.auth},
    ${route.required?.body ? "data," : ""}
});\n\n`;
        return ts;
    }
    getDataTypeTS(body) {
        if (body) {
            return typeof body === "boolean"
                ? "any"
                : this.generateInputTypeTS(body);
        }
        else {
            return 'Route["data"]';
        }
    }
    generateInputTypeTS(type) {
        let ts = "{";
        Object.entries(type).forEach(([property, type]) => {
            if (property !== "__required__")
                switch ((0, route_decorator_1.getPropertyType)(type)) {
                    case types_1.default.PropertyType.BASE:
                        ts += `\n\t\t${property}${type.__required__ ? ":" : "?:"}${type.__nullable__ ? " null |" : ""} ${type.__type__};`;
                        break;
                    case types_1.default.PropertyType.ARRAY:
                        ts += `\n\t\t${property}${type.__required__ !== false ? ":" : "?:"} ${this.generateInputTypeTS(type.__array__)}[];`;
                        break;
                    case types_1.default.PropertyType.OBJECT:
                        ts += `\n\t\t${property}${type.__required__ !== false ? ":" : "?:"}${type.__nullable__ ? " null |" : ""} ${this.generateInputTypeTS(type)};`;
                        break;
                }
        });
        ts += "\n\t}";
        return ts;
    }
    generateOutputTypeTS(type) {
        if (!type)
            return "any";
        let ts = "{";
        Object.entries(type).forEach(([property, type]) => {
            if (property !== "__required__")
                switch ((0, route_decorator_1.getPropertyType)(type)) {
                    case types_1.default.PropertyType.BASE:
                        ts += `\n\t\t${property}${type.__required__ ? ":" : "?:"}${type.__nullable__ ? " null |" : ""} ${type.__type__};`;
                        break;
                    case types_1.default.PropertyType.ARRAY:
                        ts += `\n\t\t${property}${type.__required__ !== false ? ":" : "?:"} ${this.generateOutputTypeTS(type.__array__)}[];`;
                        break;
                    case types_1.default.PropertyType.OBJECT:
                        ts += `\n\t\t${property}${type.__required__ !== false ? ":" : "?:"}${type.__nullable__ ? " null |" : ""} ${this.generateOutputTypeTS(type)};`;
                        break;
                }
        });
        ts += "\n\t}";
        return ts;
    }
    writeApiRegisterToFile(ts) {
        promises_1.default.writeFile(process.env.ATGEN_TYPES_FOLDERPATH + "/api.d.ts", ts);
    }
}
exports.ApiGenerator = ApiGenerator;
//# sourceMappingURL=api.generator.js.map