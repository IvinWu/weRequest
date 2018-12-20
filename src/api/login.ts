import checkSession from '../module/sessionManager'

export default (callback) => {
    return checkSession(callback, {})
}
