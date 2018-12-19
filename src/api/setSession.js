import status from '../store/status'

export default (session) => {
    status.session = session;
    status.sessionIsFresh = true;
}
