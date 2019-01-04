import { IRequestOption, IUploadFileOption } from "../interface";
declare function request(obj: IRequestOption): void;
declare function uploadFile(obj: IUploadFileOption): void;
declare const _default: {
    request: typeof request;
    uploadFile: typeof uploadFile;
};
export default _default;
