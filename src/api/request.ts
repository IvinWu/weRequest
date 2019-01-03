import requestHandler from '../module/requestHandler'
import { IRequestOption } from '../interface'

export default (obj: IRequestOption) => {
    requestHandler.request(obj)
}
