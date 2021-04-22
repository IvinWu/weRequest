import requestHandler from '../module/requestHandler'
import { IRequestOption } from '../interface'

export default <TResp>(obj: IRequestOption): Promise<TResp> => {
    return requestHandler.request(obj)
}
