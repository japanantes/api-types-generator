"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressProvider = void 0;
class ExpressProvider {
    static instance = new ExpressProvider();
    static logger;
    app;
    authenticate;
    constructor() { }
    static setLogger(logger) {
        ExpressProvider.logger = logger;
    }
    setApp(app) {
        ExpressProvider.logger.log("Express Provider App Set ...");
        this.app = app;
    }
    setAuthMiddleware(authenticate) {
        ExpressProvider.logger.log("Express Provider Auth Set ...");
        this.authenticate = authenticate;
    }
    get withAuth() {
        return this.authenticate;
    }
    getApp() {
        return this.app;
    }
    static getInstance() {
        return ExpressProvider.instance;
    }
    static sendData(res, data) {
        ExpressProvider.logger.log(`${res.req.path} : ${JSON.stringify(data)}`);
        res.status(200).json(data);
    }
    static sendText(res, message) {
        res.status(200).send(message);
    }
    static sendError(res, error) {
        ExpressProvider.logger.errorObject(error);
        res.status(error.code).json({ error });
    }
}
exports.ExpressProvider = ExpressProvider;
//# sourceMappingURL=express.provider.js.map