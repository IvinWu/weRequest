import { IRequestOption, IUploadFileOption, IErrorObject } from "../interface";
declare function catchHandler(e: IErrorObject, obj: IRequestOption | IUploadFileOption, reject: (reason?: any) => void): void;
export { catchHandler };
