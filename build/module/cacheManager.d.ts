import { IRequestOption } from "../interface";
declare function get(obj: IRequestOption): void;
declare function set(obj: IRequestOption, realData: string | object): void;
declare const _default: {
    get: typeof get;
    set: typeof set;
};
export default _default;
