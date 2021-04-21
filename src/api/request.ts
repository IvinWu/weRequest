import requestHandler from '../module/requestHandler'
import { IRequestOption } from '../interface'

export default <TResp>(obj: IRequestOption): PromiseLike<TResp> => {
    return requestHandler.request(obj)
}
