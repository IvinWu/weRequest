declare function setParams(url: string | undefined, params: object): string;
declare function delParams(url: string | undefined, key: string): string;
declare const _default: {
    setParams: typeof setParams;
    delParams: typeof delParams;
};
export default _default;
