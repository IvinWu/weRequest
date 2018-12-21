/// <reference types="wx" />
declare function emit(key: TODO): void;
declare function wait(key: TODO, callback: Function): void;
declare const _default: {
    wait: typeof wait;
    emit: typeof emit;
};
export default _default;
