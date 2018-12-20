import checkSession from '../module/sessionManager'

export default (callback: Function) => {
    return checkSession(callback, {})
}
