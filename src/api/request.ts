import requestHandler from '../module/requestHandler'
import { IRequestOption } from '../interface'

export default (obj: IRequestOption) => {
    return requestHandler.request(obj)
}
