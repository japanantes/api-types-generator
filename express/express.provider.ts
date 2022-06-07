import { Express, Response, NextFunction, RequestHandler } from "express";
import { IRouterMatcher } from "express-serve-static-core";
import { Error } from "../errors/errors";
import { ILogger } from "..";

export class ExpressProvider {
    private static instance: ExpressProvider = new ExpressProvider();
    static logger: ILogger;
    private app: Express;
    private authenticate: RequestHandler<any, any, any, any, Record<string, any>>;

    private constructor() {}

    static setLogger(logger: ILogger) {
        ExpressProvider.logger = logger;
    }

    setApp(app: Express) {
        ExpressProvider.logger.log("Express Provider App Set ...");
        this.app = app;
    }

    setAuthMiddleware(authenticate: RequestHandler<any, any, any, any, Record<string, any>>) {
        ExpressProvider.logger.log("Express Provider Auth Set ...");
        this.authenticate = authenticate;
    }

    get withAuth() {
        return this.authenticate;
    }

    getApp(): Express {
        return this.app;
    }

    static getInstance() {
        return ExpressProvider.instance;
    }

    static sendData(res: Response, data: any) {
        ExpressProvider.logger.log(`${res.req.path} : ${JSON.stringify(data)}`);
        res.status(200).json(data);
    }

    static sendText(res: Response, message: string) {
        res.status(200).send(message);
    }

    static sendError(res: Response, error: Error) {
        ExpressProvider.logger.errorObject(error);
        res.status(error.code).json({ error });
    }
}
