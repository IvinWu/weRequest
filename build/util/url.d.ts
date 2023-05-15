declare function setParams(url: string | undefined, params: object): string;
declare function replaceDomain(url?: string): string;
declare function isInBackupDomainList(url?: string): boolean;
declare const _default: {
    setParams: typeof setParams;
    replaceDomain: typeof replaceDomain;
    isInBackupDomainList: typeof isInBackupDomainList;
};
export default _default;
