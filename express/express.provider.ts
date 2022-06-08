import { Express, RequestHandler, Response } from "express";
import { ILogger } from "..";
import { Error } from "../errors/errors";

/**
 * Singleton used as a mediator with the `ExpressJS` app.
 * You must have set the {@link ExpressProvider.logger},
 * the {@link ExpressProvider.app} and the {@link ExpressProvider.authenticate}
 * before using it.
 */
export class ExpressProvider {
    private static instance: ExpressProvider = new ExpressProvider();
    static logger: ILogger;
    private app: Express;
    private authenticate: RequestHandler<
        any,
        any,
        any,
        any,
        Record<string, any>
    >;

    private constructor() {}

    static setLogger(logger: ILogger) {
        ExpressProvider.logger = logger;
    }

    setApp(app: Express) {
        ExpressProvider.logger.log("Express Provider App Set ...");
        this.app = app;
    }

    /**
     * Set the middleware function used to authenticate request if needed.
     * @param authenticate A `ExpressJS` request function.
     */
    setAuthMiddleware(
        authenticate: RequestHandler<any, any, any, any, Record<string, any>>
    ) {
        ExpressProvider.logger.log("Express Provider Auth Set ...");
        this.authenticate = authenticate;
    }

    /**
     * Abstraction alias to use the authenticate middleware.
     */
    get withAuth() {
        return this.authenticate;
    }

    getApp(): Express {
        return this.app;
    }

    /**
     * @returns The singleton instance.
     */
    static getInstance() {
        return ExpressProvider.instance;
    }

    /**
     * Used to answer a request.
     * @param res The `ExpressJS` Response object.
     * @param data Any data that can be used a `JSON` to send.
     */
    static sendData(res: Response, data: any) {
        ExpressProvider.logger.log(`${res.req.path} : ${JSON.stringify(data)}`);
        res.status(200).json(data);
    }

    /**
     * Used to answer a request.
     * @param res The `ExpressJS` Response object.
     * @param message The string to send.
     */
    static sendText(res: Response, message: string) {
        res.status(200).send(message);
    }

    /**
     * Used to answer a request.
     * @param res The `ExpressJS` Response object.
     * @param error The `Error` object that has been thrown.
     */
    static sendError(res: Response, error: Error) {
        ExpressProvider.logger.errorObject(error);
        res.status(error.code).json({ error });
    }
}
