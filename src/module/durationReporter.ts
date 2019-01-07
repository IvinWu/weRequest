import config from '../store/config'
import { IRequestOption, IUploadFileOption } from "../interface";

function start(obj: IRequestOption | IUploadFileOption) {
    obj._reportStartTime = new Date().getTime();
}

function end(obj: IRequestOption | IUploadFileOption) {
    obj._reportEndTime = new Date().getTime();
    report(obj.report as string, obj._reportStartTime, obj._reportEndTime);
}

function report(name: string, startTime: number, endTime: number) {
    if (typeof config.reportCGI === "function") {
        config.reportCGI(name, startTime, endTime);
    }
}

export default {
    start,
    end,
    report
}
