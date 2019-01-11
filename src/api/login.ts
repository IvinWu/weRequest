import sessionManager from '../module/sessionManager'

export default (callback: Function) => {
    return sessionManager.main(callback)
}
