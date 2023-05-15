import { IRequestOption, IUploadFileOption } from "../interface";
declare function format(originUrl: string): string;
declare function request<TResp>(obj: IRequestOption): Promise<TResp>;
declare function uploadFile(obj: IUploadFileOption): any;
declare function enableBackupDomain(url?: string): void;
declare const _default: {
    format: typeof format;
    request: typeof request;
    uploadFile: typeof uploadFile;
    enableBackupDomain: typeof enableBackupDomain;
};
export default _default;
