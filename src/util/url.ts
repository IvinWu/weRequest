function setParams(url: string, params: object) {
    let queryStringIndex = url.indexOf('?');
    let kvp: any = {};
    if (queryStringIndex >= 0) {
        let oldQueryString = url.substr(queryStringIndex + 1).split('&');
        for (let i = 0; i < oldQueryString.length; i++) {
            let kv = oldQueryString[i].split('=');
            kvp[kv[0]] = kv[1]
        }
    }

    kvp = {...kvp, ...params};

    let queryString = Object.keys(kvp).map(key => {
        return `${key}=${encodeURI(kvp[key])}`
    }).join('&');

    if (queryStringIndex >= 0) {
        return url.substring(0, queryStringIndex + 1) + queryString
    } else {
        return url + "?" + queryString
    }

}

export default {
    setParams
}
