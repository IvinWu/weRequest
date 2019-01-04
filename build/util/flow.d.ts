declare function emit(key: string): void;
declare function wait(key: string, callback: Function): void;
declare const _default: {
    wait: typeof wait;
    emit: typeof emit;
};
export default _default;
