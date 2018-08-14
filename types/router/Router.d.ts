import { Application } from 'express';
import { Action } from './Action';
export declare class Router {
    _path: string;
    actions: any[];
    member: Router;
    collection: Router;
    parent: Router;
    _isMember: boolean;
    _controller: string;
    _only: string[];
    [protocol: string]: any;
    static readonly defaultResourceActions: string[];
    static trimSlash(string: string): string;
    static splitAs(string: string): string[];
    constructor(configuration?: (router: Router) => void);
    route(path: string, configuration?: (router: Router) => void): Router;
    resource(name: string, configuration?: (router: Router) => void): Router;
    readonly isResource: boolean;
    isMember: boolean;
    readonly isCollection: boolean;
    readonly ofResource: boolean;
    namespace(namespace: string): this;
    only(...actions: string[]): this;
    readonly name: string;
    readonly collectionName: string;
    readonly memberName: string;
    readonly path: string;
    crudActions(iterator: (action: Action) => void): void;
    controller(controller: string): this;
    readonly controllerName: string;
    launchOn(application: Application): void;
    readonly toJson: any[];
    forEachAction(iterator: (action: Action) => void): void;
}
export interface IProtocolOptions {
    as?: string;
    controller?: string;
    action?: string;
}
//# sourceMappingURL=Router.d.ts.map