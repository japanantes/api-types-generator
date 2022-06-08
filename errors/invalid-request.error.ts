import { Error as JNError } from "./errors";

/**
 * Error used when the request's data is invalid.
 * This is a HTTP code 400, Bad Request.
 */
export class InvalidRequestError extends Error implements JNError {
    readonly code = 400;
    readonly name: string;
    readonly relatedData?: any;
    message: string;

    /**
     * @param message Details of the error.
     * @param relatedData Any variable, object or information related to the error.
     */
    constructor(message?: string, relatedData?: any) {
        super(message);
        this.name = "InvalidValue";
        this.formatMessage(message, relatedData);
        this.relatedData = relatedData;
    }

    /**
     * Defines the message that will be displayed when thrown,
     * formats a string containing the @link InvalidRequestError.message
     * and @link InvalidRequestError.relatedData
     * @param message This error's message.
     * @param relatedData This error's relatedData.
     */
    private formatMessage(message?: string, relatedData?: any) {
        this.message = `Bad Request : ${message}\n\tProvided Error Data :\n\t\t${JSON.stringify(
            relatedData,
            undefined,
            2
        )}\n`;
    }
}
