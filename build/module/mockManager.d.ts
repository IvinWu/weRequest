import { IRequestOption, IUploadFileOption } from "../interface";
declare function get(obj: IRequestOption | IUploadFileOption, method: "request" | "uploadFile"): any;
declare const _default: {
    get: typeof get;
};
export default _default;
