import status from '../store/status'

export default (session: TODO) => {
    status.session = session;
    status.sessionIsFresh = true;
}
