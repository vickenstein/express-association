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
    static readonly localPath: string;
    static readonly controllerPath: string;
    constructor({ router, path, protocol, controller, action }: IActionOptions);
    readonly action: string;
    readonly controller: string;
    readonly as: string;
    readonly path: string;
    readonly url: string;
    readonly Controller: any;
    launchOn(application: express.Application): void;
}
//# sourceMappingURL=Action.d.ts.map