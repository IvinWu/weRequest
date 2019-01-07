const store: any = {};

function emit(key: string) {
    const flow = getFlow(key);
    const currentLength = flow.waitingList.length;
    for (let i = 0; i < currentLength; i++) {
        const callback = flow.waitingList.shift();
        if(typeof callback == "function"){
            callback();
        }
    }
}

function wait(key: string, callback: Function) {
    const flow = getFlow(key);
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
