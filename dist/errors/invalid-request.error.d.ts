import { Error as JNError } from "./errors";
export declare class InvalidRequestError extends Error implements JNError {
    readonly code = 400;
    readonly relatedData?: any;
    message: string;
    constructor(message?: string, relatedData?: any);
    private formatMessage;
}
