import * as ExtendableError from 'es6-error';
export declare class ApplicationError extends ExtendableError {
    _log: string;
    message: string;
    ['constructor']: typeof ApplicationError;
    static status: number;
    constructor(message?: string, log?: string);
    readonly status: number;
    readonly log: string;
}
//# sourceMappingURL=ApplicationError.d.ts.map