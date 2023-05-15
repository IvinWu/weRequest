declare function setParams(url: string | undefined, params: object): string;
declare function delParams(url: string | undefined, key: string): string;
declare function replaceDomain(url?: string): string;
declare function isInBackupDomainList(url?: string): boolean;
declare const _default: {
    setParams: typeof setParams;
    delParams: typeof delParams;
    replaceDomain: typeof replaceDomain;
    isInBackupDomainList: typeof isInBackupDomainList;
};
export default _default;
