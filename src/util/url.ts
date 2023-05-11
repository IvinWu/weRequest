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

function replaceDomain(url: string = "", domain: string = "") {
    // 保证domain只包含域名，没有 http(s) 前缀 和 / 后缀
    domain = domain.replace(/^http(s)?:\/\//, '').replace(/\/$/, '');
    return url.replace(/^http(s)?:\/\/(.*?)\//, `https://${domain}/`);
}

export default {
    setParams,
    delParams,
    replaceDomain,
};
