var store = {};

function emit (key,data){
    var flow = getFlow(key);
    flow.result = data || true;
    flow.waitingList.forEach(function(callback){
        callback(data);
    });
    flow.waitingList.length = 0 ;
}

function wait (key,callback){
    var flow = getFlow(key);
    if(flow.result){
        callback(flow.result)
    }else{
        flow.waitingList.push(callback)
    }
}

function getFlow(key){
    if(!store[key]){
        store[key] = {
            waitingList:[],
            result:null
        }
    }

    return store[key];
}

module.exports = {
    wait: wait,
    emit: emit
}