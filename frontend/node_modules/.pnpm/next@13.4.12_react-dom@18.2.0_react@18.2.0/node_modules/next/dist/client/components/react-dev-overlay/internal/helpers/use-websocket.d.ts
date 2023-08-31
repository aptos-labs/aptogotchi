/// <reference types="react" />
export declare function useWebsocket(assetPrefix: string, shouldSubscribe?: boolean): import("react").MutableRefObject<WebSocket | undefined>;
export declare function useSendMessage(webSocketRef: ReturnType<typeof useWebsocket>): (data: string) => void;
export declare function useWebsocketPing(websocketRef: ReturnType<typeof useWebsocket>): void;
