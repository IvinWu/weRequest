import requestHandler from '../module/requestHandler'

export default (obj: IRequestOption) => {
    return requestHandler.request(obj)
}
