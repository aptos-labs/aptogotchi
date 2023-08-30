import { NextConfigComplete } from '../../server/config-shared';
export declare const __isCustomTurbopackBinary: () => Promise<boolean>;
export declare const lockfilePatchPromise: {
    cur?: Promise<void>;
};
export interface Binding {
    isWasm: boolean;
    turbo: {
        startDev: any;
        startTrace: any;
        nextBuild?: any;
        createTurboTasks?: any;
        entrypoints: {
            stream: any;
            get: any;
        };
        mdx: {
            compile: any;
            compileSync: any;
        };
        createProject: (options: ProjectOptions, turboEngineOptions?: TurboEngineOptions) => Promise<Project>;
    };
    minify: any;
    minifySync: any;
    transform: any;
    transformSync: any;
    parse: any;
    parseSync: any;
    getTargetTriple(): string | undefined;
    initCustomTraceSubscriber?: any;
    teardownTraceSubscriber?: any;
    initHeapProfiler?: any;
    teardownHeapProfiler?: any;
    teardownCrashReporter?: any;
}
export declare function loadBindings(): Promise<Binding>;
interface ProjectOptions {
    /**
     * A root path from which all files must be nested under. Trying to access
     * a file outside this root will fail. Think of this as a chroot.
     */
    rootPath: string;
    /**
     * A path inside the root_path which contains the app/pages directories.
     */
    projectPath: string;
    /**
     * The next.config.js contents.
     */
    nextConfig: NextConfigComplete;
    /**
     * A map of environment variables to use when compiling code.
     */
    env: Record<string, string>;
    /**
     * Whether to watch he filesystem for file changes.
     */
    watch: boolean;
}
interface TurboEngineOptions {
    /**
     * An upper bound of memory that turbopack will attempt to stay under.
     */
    memoryLimit?: number;
}
interface Issue {
    severity: string;
    category: string;
    context: string;
    title: string;
    description: string;
    detail: string;
    source?: {
        source: {
            ident: string;
            content?: string;
        };
        start: {
            line: number;
            column: number;
        };
        end: {
            line: number;
            column: number;
        };
    };
    documentationLink: string;
    subIssues: Issue[];
}
interface Diagnostics {
}
type TurbopackResult<T = {}> = T & {
    issues: Issue[];
    diagnostics: Diagnostics[];
};
interface Middleware {
    endpoint: Endpoint;
    runtime: 'nodejs' | 'edge';
    matcher?: string[];
}
interface Entrypoints {
    routes: Map<string, Route>;
    middleware?: Middleware;
}
interface Project {
    update(options: ProjectOptions): Promise<void>;
    entrypointsSubscribe(): AsyncIterableIterator<TurbopackResult<Entrypoints>>;
}
type Route = {
    type: 'conflict';
} | {
    type: 'app-page';
    htmlEndpoint: Endpoint;
    rscEndpoint: Endpoint;
} | {
    type: 'app-route';
    endpoint: Endpoint;
} | {
    type: 'page';
    htmlEndpoint: Endpoint;
    dataEndpoint: Endpoint;
} | {
    type: 'page-api';
    endpoint: Endpoint;
};
interface Endpoint {
    /** Write files for the endpoint to disk. */
    writeToDisk(): Promise<TurbopackResult<WrittenEndpoint>>;
    /**
     * Listen to changes to the endpoint.
     * After changed() has been awaited it will listen to changes.
     * The async iterator will yield for each change.
     */
    changed(): Promise<AsyncIterableIterator<TurbopackResult>>;
}
interface EndpointConfig {
    dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static';
    dynamicParams?: boolean;
    revalidate?: 'never' | 'force-cache' | number;
    fetchCache?: 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'default-no-store' | 'only-no-store' | 'force-no-store';
    runtime?: 'nodejs' | 'edge';
    preferredRegion?: string;
}
type WrittenEndpoint = {
    type: 'nodejs';
    /** The entry path for the endpoint. */
    entryPath: string;
    /** All server paths that has been written for the endpoint. */
    serverPaths: string[];
    config: EndpointConfig;
} | {
    type: 'edge';
    files: string[];
    /** All server paths that has been written for the endpoint. */
    serverPaths: string[];
    globalVarName: string;
    config: EndpointConfig;
};
export declare function isWasm(): Promise<boolean>;
export declare function transform(src: string, options?: any): Promise<any>;
export declare function transformSync(src: string, options?: any): any;
export declare function minify(src: string, options: any): Promise<string>;
export declare function minifySync(src: string, options: any): string;
export declare function parse(src: string, options: any): Promise<any>;
export declare function getBinaryMetadata(): {
    target: any;
};
/**
 * Initialize trace subscriber to emit traces.
 *
 */
export declare const initCustomTraceSubscriber: (traceFileName?: string) => void;
/**
 * Initialize heap profiler, if possible.
 * Note this is not available in release build of next-swc by default,
 * only available by manually building next-swc with specific flags.
 * Calling in release build will not do anything.
 */
export declare const initHeapProfiler: () => void;
/**
 * Teardown heap profiler, if possible.
 *
 * Same as initialization, this is not available in release build of next-swc by default
 * and calling it will not do anything.
 */
export declare const teardownHeapProfiler: () => void;
/**
 * Teardown swc's trace subscriber if there's an initialized flush guard exists.
 *
 * This is workaround to amend behavior with process.exit
 * (https://github.com/vercel/next.js/blob/4db8c49cc31e4fc182391fae6903fb5ef4e8c66e/packages/next/bin/next.ts#L134=)
 * seems preventing napi's cleanup hook execution (https://github.com/swc-project/swc/blob/main/crates/node/src/util.rs#L48-L51=),
 *
 * instead parent process manually drops guard when process gets signal to exit.
 */
export declare const teardownTraceSubscriber: () => void;
export declare const teardownCrashReporter: () => void;
export {};
