import status from '../store/status'

export default (session: string) => {
    status.session = session;
    status.sessionIsFresh = true;
}
