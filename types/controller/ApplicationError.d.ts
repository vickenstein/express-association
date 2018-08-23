import * as ExtendableError from 'es6-error';
export declare class ApplicationError extends ExtendableError {
    _log: string;
    message: string;
    stack: any;
    ['constructor']: typeof ApplicationError;
    static status: number;
    constructor(message?: any, log?: any);
    readonly type: string;
    readonly status: number;
    readonly log: string;
}
//# sourceMappingURL=ApplicationError.d.ts.map