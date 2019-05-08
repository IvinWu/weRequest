import { IRequestOption, IUploadFileOption } from '../interface';
declare function format(originUrl: string): string;
declare function request(obj: IRequestOption): any;
declare function uploadFile(obj: IUploadFileOption): any;
declare const _default: {
    format: typeof format;
    request: typeof request;
    uploadFile: typeof uploadFile;
};
export default _default;
