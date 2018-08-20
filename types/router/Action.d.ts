import * as express from 'express';
import { Router } from './Router';
declare module 'express' {
    interface Application {
        [protocol: string]: any;
    }
}
export interface IActionOptions {
    router: Router;
    protocol: string;
    path: string;
    controller?: string;
    action?: string;
}
export declare class Action {
    router: Router;
    protocol: string;
    _path: string;
    _controller: string;
    _action: string;
    static readonly protocols: string[];
    constructor({ router, path, protocol, controller, action }: IActionOptions);
    readonly action: string;
    readonly controller: string;
    readonly as: string;
    readonly path: string;
    readonly url: string;
    readonly Controller: any;
    readonly _errors: any[];
    readonly errors: Pick<any, "status" | "message" | "log">[];
    readonly errorStatuses: string;
    readonly parameterFields: string;
    readonly parameters: any;
    launchOn(application: express.Application): void;
}
//# sourceMappingURL=Action.d.ts.map