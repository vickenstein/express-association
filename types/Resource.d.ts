export declare class Resource {
    constructor(name: string);
    resource(name: string, configuration?: (resource: Resource) => void): void;
    only(...types: string[]): void;
    get(path: string, options?: object): void;
    post(path: string, options?: object): void;
    put(path: string, options?: object): void;
    delete(path: string, options?: object): void;
}
//# sourceMappingURL=Resource.d.ts.map