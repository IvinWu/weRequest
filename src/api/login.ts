import checkSession from '../module/sessionManager'
import { IRequestOption } from "../interface"

export default (callback: Function) => {
    return checkSession(callback, {} as IRequestOption)
}
