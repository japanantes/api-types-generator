import { Error as JNError } from "./errors";

export class InvalidRequestError extends Error implements JNError {
    readonly code = 400;
    readonly relatedData?: any;
    message: string;

    constructor(message?: string, relatedData?: any) {
        super(message);
        this.name = "InvalidValue";
        this.formatMessage(message, relatedData);
        this.relatedData = relatedData;
    }

    private formatMessage(message?: string, relatedData?: any) {
        this.message = `Bad Request : ${message}\n\tProvided Error Data :\n\t\t${JSON.stringify(
            relatedData,
            undefined,
            2
        )}\n`;
    }
}
