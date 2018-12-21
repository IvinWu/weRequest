/// <reference types="wx" />
declare function start(obj: TODO, name?: string): void;
declare function end(obj: TODO, name?: string): void;
declare const _default: {
    start: typeof start;
    end: typeof end;
};
export default _default;
