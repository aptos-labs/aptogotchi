export declare type AptosClientResponse<Res> = {
    status: number;
    statusText: string;
    data: Res;
    config?: any;
    request?: any;
    response?: any;
    headers?: any;
};
export declare type AptosClientRequest = {
    url: string;
    method: "GET" | "POST";
    body?: any;
    params?: any;
    headers?: any;
    overrides?: any;
};
