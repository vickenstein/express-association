import { Application } from "express";
import { Resource } from "./Resource";
export declare class Router {
    private application;
    constructor(application: Application, configuration?: (router: Router) => void);
    resource(name: string, configuration?: (resource: Resource) => void): void;
}
//# sourceMappingURL=Router.d.ts.map