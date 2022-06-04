"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyType = exports.route = void 0;
const api_generator_1 = require("../../core/api.generator");
const invalid_request_error_1 = require("../../errors/invalid-request.error");
const types_1 = require("../../types/types");
const express_provider_1 = require("../express.provider");
function route({ name, method, path, auth, required, response, }) {
    express_provider_1.ExpressProvider.logger.log(`Create ${method}:${path} route with auth:${auth}`);
    api_generator_1.ApiGenerator.getInstance().registerRoute(name || generateDefaultName(path), { method, path, auth, required, response });
    return function (target, propertyKey, descriptor) {
        const response = async (req, res) => {
            try {
                if (required) {
                    if (required.body && req.method === "GET") {
                        const data = req.query._data;
                        if (!data)
                            throw new invalid_request_error_1.InvalidRequestError("No data for body with GET request.", { body: req.query._data });
                        if (!(typeof data === "string"))
                            throw new invalid_request_error_1.InvalidRequestError("Data type is invalid.", { body: req.query._data });
                        req.body = JSON.parse(data);
                    }
                    checkRequirements(required, req);
                }
                const original = await descriptor.value(req, res);
                express_provider_1.ExpressProvider.sendData(res, original);
            }
            catch (err) {
                express_provider_1.ExpressProvider.sendError(res, err);
            }
        };
        const server = express_provider_1.ExpressProvider.getInstance();
        if (auth)
            server.getApp()[method](path, server.withAuth, response);
        else
            express_provider_1.ExpressProvider.getInstance().getApp()[method](path, response);
    };
}
exports.route = route;
function checkRequirements(required, req) {
    if (required.body) {
        if ((typeof required.body === "boolean" &&
            !Object.keys(req.body).length) ||
            (typeof required.body !== "boolean" &&
                !validateSchema(required.body, req.body)))
            throw new invalid_request_error_1.InvalidRequestError("No body or body tructure is invalid.", { body: req.body });
    }
    return true;
}
function validateSchema(schema, object) {
    for (let [property, type] of Object.entries(schema)) {
        switch (getPropertyType(type)) {
            case types_1.ATGen.PropertyType.BASE:
                if (!object[property] && !type.__required__)
                    break;
                if (typeof object[property] !== type.__type__)
                    return false;
                break;
            case types_1.ATGen.PropertyType.ARRAY:
                if (!object[property] && type.__required__)
                    return false;
                if (object[property])
                    for (let elem of object[property]) {
                        const val = validateSchema(type.__array__, elem);
                        if (!val)
                            return false;
                    }
                break;
            case types_1.ATGen.PropertyType.OBJECT:
                if (!object[property] && !type.__required__)
                    break;
                if (!object[property] ||
                    !validateSchema(type, object[property]))
                    return false;
                break;
        }
    }
    return true;
}
function getPropertyType(type) {
    const keys = Object.keys(type);
    if (keys.length >= 1 &&
        keys.length <= 3 &&
        keys.includes("__type__") &&
        keys.every((key) => ["__type__", "__required__", "__nullable__"].includes(key))) {
        return types_1.ATGen.PropertyType.BASE;
    }
    else if (keys.length >= 1 &&
        keys.length <= 3 &&
        keys.includes("__array__") &&
        keys.every((key) => ["__array__", "__required__", "__nullable__"].includes(key))) {
        return types_1.ATGen.PropertyType.ARRAY;
    }
    else {
        return types_1.ATGen.PropertyType.OBJECT;
    }
}
exports.getPropertyType = getPropertyType;
function generateDefaultName(path) {
    const purePath = path[0] === "/" ? path.substring(1, path.length) : path;
    const nameParts = purePath.replace(/\/:[a-zA-Z]+\//, "/").split("/");
    return nameParts.reduce((name, part) => {
        const upper = part[0].toUpperCase();
        return name + upper + part.substring(1, part.length);
    }, "");
}
//# sourceMappingURL=route.decorator.js.map