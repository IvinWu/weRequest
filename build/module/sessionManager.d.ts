import { IRequestOption, IUploadFileOption } from "../interface";
declare function setSession(session: string): void;
declare function delSession(): void;
declare function main(relatedRequestObj?: IRequestOption | IUploadFileOption): Promise<unknown>;
declare const _default: {
    main: typeof main;
    setSession: typeof setSession;
    delSession: typeof delSession;
};
export default _default;
