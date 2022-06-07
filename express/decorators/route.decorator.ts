import { Request, Response } from "express";
import {
    InputProperty,
    PropertyType,
    RequestInput,
    Requirements,
    Route,
} from "../..";
import { ApiGenerator } from "../../core/api.generator";
import { InvalidRequestError } from "../../errors/invalid-request.error";
import { ExpressProvider } from "../express.provider";

export function route<In = any, Out = any>({
    name,
    method,
    path,
    auth,
    required,
    response,
}: Route<In, Out> & { name?: string }): MethodDecorator {
    ExpressProvider.logger.log(
        `Create ${method}:${path} route with auth:${auth}`
    );
    ApiGenerator.getInstance().registerRoute(
        name || generateDefaultName(path),
        { method, path, auth, required, response }
    );
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const response = async (req: Request, res: Response) => {
            try {
                if (required) {
                    if (required.body && req.method === "GET") {
                        const data = req.query._data;
                        if (!data)
                            throw new InvalidRequestError(
                                "No data for body with GET request.",
                                { body: req.query._data }
                            );
                        if (!(typeof data === "string"))
                            throw new InvalidRequestError(
                                "Data type is invalid.",
                                { body: req.query._data }
                            );
                        req.body = JSON.parse(data);
                    }
                    checkRequirements(required, req);
                }
                const original = await descriptor.value(req, res);
                ExpressProvider.sendData(res, original);
            } catch (err) {
                ExpressProvider.sendError(res, err);
            }
        };

        const server = ExpressProvider.getInstance();
        if (auth) server.getApp()[method](path, server.withAuth, response);
        else ExpressProvider.getInstance().getApp()[method](path, response);
    };
}

function checkRequirements(required: Requirements, req: Request) {
    if (required.body) {
        if (
            (typeof required.body === "boolean" &&
                !Object.keys(req.body).length) ||
            (typeof required.body !== "boolean" &&
                !validateSchema(required.body, req.body))
        )
            throw new InvalidRequestError(
                "No body or body tructure is invalid.",
                { body: req.body }
            );
    }
    return true;
}

function validateSchema(schema: RequestInput<any>, object: any) {
    for (let [property, type] of Object.entries(schema)) {
        switch (getPropertyType(type)) {
            case PropertyType.BASE:
                if (!object[property] && !type.__required__) break;
                if (typeof object[property] !== type.__type__) return false;
                break;
            case PropertyType.ARRAY:
                if (!object[property] && type.__required__) return false;
                if (object[property])
                    for (let elem of object[property]) {
                        const val = validateSchema(type.__array__, elem);
                        if (!val) return false;
                    }
                break;
            case PropertyType.OBJECT:
                if (!object[property] && !type.__required__) break;
                if (
                    !object[property] ||
                    !validateSchema(type, object[property])
                )
                    return false;
                break;
        }
    }
    return true;
}

export function getPropertyType(type: InputProperty<any>) {
    const keys = Object.keys(type);

    if (
        keys.length >= 1 &&
        keys.length <= 3 &&
        keys.includes("__type__") &&
        keys.every((key) =>
            ["__type__", "__required__", "__nullable__"].includes(key)
        )
    ) {
        return PropertyType.BASE;
    } else if (
        keys.length >= 1 &&
        keys.length <= 3 &&
        keys.includes("__array__") &&
        keys.every((key) =>
            ["__array__", "__required__", "__nullable__"].includes(key)
        )
    ) {
        return PropertyType.ARRAY;
    } else {
        return PropertyType.OBJECT;
    }
}

function generateDefaultName(path: string) {
    const purePath = path[0] === "/" ? path.substring(1, path.length) : path;
    const nameParts = purePath.replace(/\/:[a-zA-Z]+\//, "/").split("/");

    return nameParts.reduce((name, part) => {
        const upper = part[0].toUpperCase();
        return name + upper + part.substring(1, part.length);
    }, "");
}
