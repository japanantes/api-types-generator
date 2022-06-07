import { Express, Response, RequestHandler } from "express";
import { Error } from "../errors/errors";
import { ILogger } from "..";
export declare class ExpressProvider {
    private static instance;
    static logger: ILogger;
    private app;
    private authenticate;
    private constructor();
    static setLogger(logger: ILogger): void;
    setApp(app: Express): void;
    setAuthMiddleware(authenticate: RequestHandler<any, any, any, any, Record<string, any>>): void;
    get withAuth(): RequestHandler<any, any, any, any, Record<string, any>>;
    getApp(): Express;
    static getInstance(): ExpressProvider;
    static sendData(res: Response, data: any): void;
    static sendText(res: Response, message: string): void;
    static sendError(res: Response, error: Error): void;
}
