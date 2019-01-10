import { IRequestOption, IUploadFileOption } from "../interface";
declare function format(originUrl: string): string;
declare function request(obj: IRequestOption): void;
declare function uploadFile(obj: IUploadFileOption): void;
declare const _default: {
    format: typeof format;
    request: typeof request;
    uploadFile: typeof uploadFile;
};
export default _default;
