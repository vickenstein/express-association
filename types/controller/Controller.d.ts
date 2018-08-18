import * as express from 'express';
import { ApplicationError } from './ApplicationError';
declare module 'express' {
    interface Request {
        controller: Controller;
    }
}
export interface IFilterableOption {
    only?: string[];
    except?: string[];
}
export declare class Controller {
    error: any;
    controller: string;
    action: string;
    request: express.Request;
    response: express.Response;
    _parameters: any;
    _nonUrlParameters: any[];
    static beforeMiddlewares: any;
    static afterMiddlewares: any;
    static errors: any;
    static parameters: any;
    static __proto__: any;
    [action: string]: any;
    constructor(request: express.Request, response: express.Response);
    errorHandler(error: ApplicationError): void;
    static parameterValidationFunction(parameters: any[]): (parameters: any) => void;
    static before(middleware: any, options?: IFilterableOption): void;
    static after(middleware: any, options?: IFilterableOption): void;
    static error(errorClass: any, options?: IFilterableOption): void;
    static parameter(key: string, validator: any, options?: IFilterableOption): void;
    static inheritedProperties(key: string): any[];
    static readonly inheritedBeforeMiddlewares: any[];
    static readonly inheritedAfterMiddlewares: any[];
    static readonly inheritedErrors: any[];
    static readonly inheritedParameters: any[];
    static constructorMiddleware(action: string): (request: express.Request, response: express.Response, next: express.NextFunction) => void;
    static generateActionMiddleware(action: string): (request: express.Request, response: express.Response, next: express.NextFunction) => void;
    static generateErrorHandlerMiddleware(errors: any[]): (error: any, request: express.Request, response: express.Response, next: express.NextFunction) => void;
    static filter(list: any[], action: string): any[];
    static generateBeforeMiddleware(middleware: any): any;
    static generateBeforeMiddlewares(middlewares: any[]): any[];
    static generateAfterMiddleware(middleware: any): (error: any, request: express.Request, response: express.Response, next: express.NextFunction) => void;
    static generateParameterValidationMiddlewares(parameters: any[]): (request: express.Request, response: express.Response, next: express.NextFunction) => void;
    static generateAfterMiddlewares(middlewares: any[]): ((error: any, request: express.Request, response: express.Response, next: express.NextFunction) => void)[];
    static middlewares(action: string): any[];
    status(code: number): void;
    setHeader(name: string, value: string | number | string[]): void;
    json(body?: any): void;
    send(body?: any): void;
    readonly query: any;
    readonly params: any;
    readonly nonUrlParameters: any[];
    readonly body: any;
    readonly parameters: any;
}
//# sourceMappingURL=Controller.d.ts.map