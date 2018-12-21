export interface IRequestOption extends wx.RequestOption {
    beforeSend?: Function;
    showLoading?: boolean | string;
    report?: string;
}
declare const _default: (obj: IRequestOption) => void;
export default _default;
