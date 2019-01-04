import config from '../store/config'
import { IRequestOption, IUploadFileOption } from "../interface";

function start(obj: IRequestOption | IUploadFileOption) {
    obj._reportStartTime = new Date().getTime();
}

function end(obj: IRequestOption | IUploadFileOption) {
    obj._reportEndTime = new Date().getTime();
    report(<string>obj.report, obj._reportStartTime, obj._reportEndTime);
}

function report(name: string, start: number, end: number) {
    if (typeof config.reportCGI === "function") {
        config.reportCGI(name, start, end);
    }
}

export default {
    start,
    end,
    report
}
