import * as express from 'express';
declare module 'express' {
    interface Request {
        controller: Controller;
    }
}
export interface IMiddlewareOption {
    only?: string[];
    except?: string[];
}
export declare class Controller {
    request: express.Request;
    response: express.Response;
    static _beforeMiddlewares: any;
    static _afterMiddlewares: any;
    static __proto__: any;
    [action: string]: any;
    constructor(request: express.Request, response: express.Response);
    static before(middleware: any, options?: IMiddlewareOption): void;
    static after(middleware: any, options?: IMiddlewareOption): void;
    static readonly constructorMiddleware: (request: express.Request, response: express.Response, next: express.NextFunction) => void;
    static readonly beforeMiddlewares: any[];
    static readonly afterMiddlewares: any[];
    static generateExpressMiddleware(middleware: any): any;
    static generateActionMiddleware(action: string): (request: express.Request, response: express.Response) => void;
    static filter(list: any[], action: string): any[];
    static generateExpressMiddlewares(middlewares: any[]): any[];
    static middlewares(action: string): any[];
    setHeader(name: string, value: string | number | string[]): void;
    json(body?: any): void;
    send(body?: any): void;
    readonly query: any;
    readonly params: any;
    readonly body: any;
    readonly parameters: any;
}
//# sourceMappingURL=Controller.d.ts.map