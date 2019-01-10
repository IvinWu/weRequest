import { IRequestOption, IUploadFileOption } from "../interface";
declare function start(obj: IRequestOption | IUploadFileOption): void;
declare function end(obj: IRequestOption | IUploadFileOption): void;
declare function report(name: string, startTime: number, endTime: number): void;
declare const _default: {
    start: typeof start;
    end: typeof end;
    report: typeof report;
};
export default _default;
