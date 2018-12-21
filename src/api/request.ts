import requestHandler from '../module/requestHandler'

export interface IRequestOption extends wx.RequestOption {
    /* 发起请求前执行的函数 */
    beforeSend?: Function;
    /* 请求过程页面是否展示全屏的loading */
    showLoading?: boolean | string;
    /* 接口请求成功后将自动执行init()中配置的reportCGI函数，其中的name字段值为这里配置的值 */
    report?: string;
  }

export default (obj: IRequestOption) => {
    requestHandler.request(obj)
}
