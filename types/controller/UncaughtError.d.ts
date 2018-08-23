import { ApplicationError } from './ApplicationError';
export declare class UncaughtError extends ApplicationError {
    stack: any;
    constructor(message: string, log: string, stack: any);
    static readonly status: number;
}
//# sourceMappingURL=UncaughtError.d.ts.map