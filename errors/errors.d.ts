/**
 * Custom error interface.
 */
export interface Error {
    code: number;
    name: string;
    message: string;
    relatedData?: any;
}
