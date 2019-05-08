function getParams(url: string = "", queryStringIndex: number) {
    let kvp: IAnyObject = {};
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

function joinUrl(kvp: IAnyObject, queryStringIndex: number, url: string) {
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

export default {
    setParams,
    delParams
};
