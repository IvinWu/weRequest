import requestHandler from '../module/requestHandler'
import { IUploadFileOption } from "../interface";

export default (obj: IUploadFileOption) => {
    requestHandler.uploadFile(obj)
}
