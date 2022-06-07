import { Request } from "express";
export declare namespace ATGen {
    type BaseTypeList = "string" | "number" | "boolean" | "object";
    type BaseType = string | number | boolean | null | undefined;
    type BaseTypeMap<T extends BaseType> = T extends string ? "string" : T extends number ? "number" : T extends boolean ? "boolean" : T extends null ? "null" : T extends undefined ? "undefined" : "object";
    export type InputProperty<T> = T extends Array<any> ? {
        __array__: InputProperty<T[number]>;
    } : {
        [property in keyof T]: T[property] extends BaseType ? {
            __type__: BaseTypeMap<T[property]>;
            __required__?: boolean;
            __nullable__?: boolean;
        } : (InputProperty<T[property]> & {
            __required__?: boolean;
            __nullable__?: boolean;
        }) | {
            __type__: BaseTypeList;
            __required__?: boolean;
            __nullable__?: boolean;
        };
    };
    export type OutputProperty<T> = T extends Array<any> ? {
        __array__: OutputProperty<T[number]>;
    } : {
        [property in keyof T]: T[property] extends BaseType ? {
            __type__: BaseTypeMap<T[property]>;
            __required__?: boolean;
            __nullable__?: boolean;
        } : (OutputProperty<T[property]> & {
            __required__?: boolean;
            __nullable__?: boolean;
        }) | {
            __type__: BaseTypeList;
            __required__?: boolean;
            __nullable__?: boolean;
        };
    };
    export type RequestInput<T> = InputProperty<T>;
    export type RequestOutput<T> = OutputProperty<T>;
    export interface RequestWithBody<T = any> extends Request {
        body: T;
    }
    export type Requirements<T = any> = {
        body?: boolean | RequestInput<T>;
    };
    export type Route<In = any, Out = any> = {
        method: Method;
        path: string;
        auth?: boolean;
        required?: Requirements<In>;
        response?: RequestOutput<Out>;
    };
    export {};
}
export interface ILogger {
    log(message?: any, ...optionalParams: any[]): void;
    errorObject(error: Error, ...optionalParams: any[]): void;
}
export declare enum PropertyType {
    BASE = 0,
    ARRAY = 1,
    OBJECT = 2
}
export declare enum Method {
    GET = "get",
    POST = "post"
}
export declare type Route<In = any, Out = any> = ATGen.Route<In, Out>;
export declare type InputProperty<T> = ATGen.InputProperty<T>;
export declare type OutputProperty<T> = ATGen.OutputProperty<T>;
export declare type RequestInput<T> = ATGen.RequestInput<T>;
export declare type RequestOutput<T> = ATGen.RequestOutput<T>;
export declare type RequestWithBody<T> = ATGen.RequestWithBody<T>;
export declare type Requirements<T = any> = ATGen.Requirements<T>;
export default ATGen;
