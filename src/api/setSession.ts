import sessionManager from '../module/sessionManager'

export default (session: string) => {
    sessionManager.setSession(session);
}
