let store = {};

function emit(key) {
    let flow = getFlow(key);
    let currentLength = flow.waitingList.length;
    for (let i = 0; i < currentLength; i++) {
        let callback = flow.waitingList.shift();
        typeof callback == "function" && callback();
    }
}

function wait(key, callback) {
    var flow = getFlow(key);
    flow.waitingList.push(callback)
}

function getFlow(key) {
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
