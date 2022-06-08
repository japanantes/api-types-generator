import fs from "fs/promises";
import { Method, PropertyType, RequestInput, RequestOutput, Route } from "..";
import { getPropertyType } from "../express/decorators/route.decorator";
import { TypesRegister } from "./types.register";

/**
 * Singleton which is the core of this library, used to generate the types file.
 */
export class ApiGenerator {
    private static instance: ApiGenerator = new ApiGenerator();
    private routes: Map<string, Route>;
    private typesRegister: TypesRegister = TypesRegister.getInstance();

    private constructor() {
        this.routes = new Map<string, Route>();
    }

    /**
     * @returns The singleton instance.
     */
    static getInstance() {
        return ApiGenerator.instance;
    }

    /**
     * A function called by the decorator {@link route}
     * to add a route to the list to generate.
     * @param name the name of the route.
     * @param route the `Route` object.
     */
    registerRoute(name: string, route: Route) {
        this.routes.set(name, route);
    }

    /**
     * A function that generates the typescript output file.
     */
    generateApiRegister() {
        let ts = "// Generated content, don't touch\n\n";
        ts += this.generateRouteTypeTS();
        ts += this.generateMethodEnumTS();
        ts += this.generateRegisteredTypesTS();
        const routesTypes: { [type in Method]: string[] } = {
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

    private generateMethodEnumTS() {
        let ts = `\nexport enum Method {`;
        Object.values(Method).forEach((method) => (ts += `\n\t${method},`));
        ts += "\n}\n\n";
        return ts;
    }

    private generateRegisteredTypesTS() {
        let ts = "\n";
        this.typesRegister.enums.forEach((type, name) => {
            ts += `\nexport enum ${name} {`;
            Object.entries(type).forEach(
                ([key, value]) =>
                    (ts += `\n\t${key} = ${
                        typeof value === "number" ? value : `"${value}"`
                    },`)
            );
            ts += "\n}\n";
        });
        return ts;
    }

    private generateRouteTypeTS() {
        return `\ntype Route = {name: string; method: Method; path: string; requireAuth?: boolean | undefined; data?: any | undefined; res:any};\n\n`;
    }

    private generateRoutesTypes(routesTypes: { [type in Method]: string[] }) {
        let types = "";
        Object.entries(routesTypes).forEach(([method, routes]) => {
            types += `\nexport type T${method.toUpperCase()}Routes = Route${routes.join(
                " | Route"
            )};`;
        });
        return types;
    }

    private generateRouteTS(name: string, route: Route) {
        let ts = `export type TRoute${name}Input = ${this.getDataTypeTS(
            route.required?.body
        )};\n`;
        ts += `export type TRoute${name}Output = ${this.generateOutputTypeTS(
            route.response
        )};\n`;
        ts += `
export type Route${name} = {
    name: "${name}";
    method: Method.${route.method};
    path: "${route.path}";
    requireAuth: ${route.auth};
    ${
        route.required?.body
            ? `data: TRoute${name}Input`
            : `data?: TRoute${name}Input`
    }
    res: TRoute${name}Output;
};
export const getRequest${name} = (${
            route.required?.body ? `data: Route${name}["data"]` : ""
        }): Omit<Route${name}, "res"> => ({
    name: "${name}",
    method: Method.${route.method},
    path: "${route.path}",
    requireAuth: ${route.auth},
    ${route.required?.body ? "data," : ""}
});\n\n`;
        return ts;
    }

    private getDataTypeTS(body?: boolean | RequestInput<any>) {
        if (body) {
            return typeof body === "boolean"
                ? "any"
                : this.generateInputTypeTS(body);
        } else {
            return 'Route["data"]';
        }
    }

    private generateInputTypeTS(type: RequestInput<any>) {
        let ts = "{";
        Object.entries(type).forEach(([property, type]) => {
            if (property !== "__required__")
                switch (getPropertyType(type)) {
                    case PropertyType.BASE:
                        ts += `\n\t\t${property}${
                            type.__required__ ? ":" : "?:"
                        }${type.__nullable__ ? " null |" : ""} ${
                            type.__type__
                        };`;
                        break;
                    case PropertyType.ARRAY:
                        ts += `\n\t\t${property}${
                            type.__required__ !== false ? ":" : "?:"
                        } ${this.generateInputTypeTS(type.__array__)}[];`;
                        break;
                    case PropertyType.OBJECT:
                        ts += `\n\t\t${property}${
                            type.__required__ !== false ? ":" : "?:"
                        }${
                            type.__nullable__ ? " null |" : ""
                        } ${this.generateInputTypeTS(type)};`;
                        break;
                }
        });
        ts += "\n\t}";
        return ts;
    }

    private generateOutputTypeTS(type?: RequestOutput<any>) {
        if (!type) return "any";
        let ts = "{";
        Object.entries(type).forEach(([property, type]) => {
            if (property !== "__required__")
                switch (getPropertyType(type)) {
                    case PropertyType.BASE:
                        ts += `\n\t\t${property}${
                            type.__required__ ? ":" : "?:"
                        }${type.__nullable__ ? " null |" : ""} ${
                            type.__type__
                        };`;
                        break;
                    case PropertyType.ARRAY:
                        ts += `\n\t\t${property}${
                            type.__required__ !== false ? ":" : "?:"
                        } ${this.generateOutputTypeTS(type.__array__)}[];`;
                        break;
                    case PropertyType.OBJECT:
                        ts += `\n\t\t${property}${
                            type.__required__ !== false ? ":" : "?:"
                        }${
                            type.__nullable__ ? " null |" : ""
                        } ${this.generateOutputTypeTS(type)};`;
                        break;
                }
        });
        ts += "\n\t}";
        return ts;
    }

    private writeApiRegisterToFile(ts: string) {
        fs.writeFile(process.env.ATGEN_TYPES_FOLDERPATH + "/api.d.ts", ts);
    }
}
