import config from '../store/config'
import status from '../store/status'

function getParams(url: string = "", queryStringIndex: number) {
    let kvp: WechatMiniprogram.IAnyObject = {};
    if (queryStringIndex >= 0) {
        const oldQueryString = url.substr(queryStringIndex + 1).split("&");
        // @ts-ignore
        oldQueryString.forEach((x, i) => {
            const kv: string[] = oldQueryString[i].split("=");
            kvp[kv[0]] = kv[1];
        });
    }
    return kvp;
}

function joinUrl(kvp: WechatMiniprogram.IAnyObject, queryStringIndex: number, url: string) {
    let queryString = '';
    if (Object.keys(kvp).length) {
        queryString = Object.keys(kvp).map(key => {
            return `${key}=${encodeURI(kvp[key])}`;
        }).join("&");
    }

    if (queryStringIndex >= 0) {
        return url.substring(0, queryStringIndex + (queryString ? 1 : 0)) + queryString;
    } else {
        return url + (queryString ? "?" : "") + queryString;
    }
}

function setParams(url: string = "", params: object) {
    const queryStringIndex: number = url.indexOf("?");
    let kvp = getParams(url, queryStringIndex);

    kvp = {...kvp, ...params};

    return joinUrl(kvp, queryStringIndex, url);
}

function delParams(url: string = "", key: string) {
    const queryStringIndex: number = url.indexOf("?");
    let kvp = getParams(url, queryStringIndex);

    delete kvp[key];

    return joinUrl(kvp, queryStringIndex, url);
}

function replaceDomain(url: string = "") {
    if (status.isEnableBackupDomain && config.backupDomainList && typeof config.backupDomainList === 'object') {
        for(const origin in config.backupDomainList) {
            if (url.indexOf(origin) >= 0) {
                url = url.replace(origin, config.backupDomainList[origin]);
                break;
            }
        }
    }
    return url;
}

function isInBackupDomainList(url: string = "") {
    let res = false;
    if (config.backupDomainList && typeof config.backupDomainList === 'object') {
        for(const origin in config.backupDomainList) {
            if (url.indexOf(origin) >= 0) {
                res = true;
                break;
            }
        }
    }
    return res;
}

export default {
    setParams,
    delParams,
    replaceDomain,
    isInBackupDomainList,
};
