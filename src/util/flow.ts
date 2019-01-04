let store: any = {};

function emit(key: string) {
    let flow = getFlow(key);
    let currentLength = flow.waitingList.length;
    for (let i = 0; i < currentLength; i++) {
        let callback = flow.waitingList.shift();
        typeof callback == "function" && callback();
    }
}

function wait(key: string, callback: Function) {
    var flow = getFlow(key);
    flow.waitingList.push(callback)
}

function getFlow(key: string) {
    if (!store[key]) {
        store[key] = {
            waitingList: []
        }
    }

    return store[key];
}

export default {
    wait,
    emit
}
