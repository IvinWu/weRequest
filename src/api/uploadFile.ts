import requestHandler from '../module/requestHandler'
import { IUploadFileOption } from "../interface";

export default (obj: IUploadFileOption) => {
    return requestHandler.uploadFile(obj)
}
