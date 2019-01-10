import config from '../store/config'
import request from '../api/request'
import { IRequestOption, IUploadFileOption } from "../interface";

function start(obj: IRequestOption | IUploadFileOption) {
    obj._reportStartTime = new Date().getTime();
}

function end(obj: IRequestOption | IUploadFileOption) {
    obj._reportEndTime = new Date().getTime();
    if(obj.report) {
        report(obj.report as string, obj._reportStartTime, obj._reportEndTime);
    }
}

function report(name: string, startTime: number, endTime: number) {
    if (typeof config.reportCGI === "function") {
        config.reportCGI(name, startTime, endTime, request);
    }
}

export default {
    start,
    end,
    report
}
