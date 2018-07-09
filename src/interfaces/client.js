import * as redis from "redis"
import * as chalk from "chalk"
import {redis_hsot as host, redis_port as port} from "./config"
import * as bluebird from "bluebird"

// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

const {log, dir} = console
export const client = redis.createClient(port, host)

export const pub = redis.createClient(port, host)
export const sub = redis.createClient(port, host)

export const set = function(key, value) {
    return new Promise(function(resolved, rejected) {
        client.set(key, value, function (err, data) {
            if (err) {
                rejected(err)
            } else {
                resolved(data)
            }
        })
    })
}

export const get = function (key) {
    return new Promise(function (resolved, rejected) {
        client.get(key, function (err, data) {
            if (err) {
                rejected(err)
            } else {
                resolved(data)
            }
        })
    })
}

export const hset = function (key, field, value) {
    return new Promise(function (resolved, rejected) {
        client.hset(key, field, value, function (err, data) {
            if (err) {
                rejected(err)
            } else {
                resolved(data)
            }
        })
    })
}

export const hgetall = function (key) {
    return new Promise(function (resolved, rejected) {
        client.hgetall(key, function (err, data) {
            if (err) {
                rejected(err)
            } else {
                resolved(data)
            }
        })
    })
}

export const hkeys = function (key) {
    return new Promise(function (resolved, rejected) {
        client.hkeys(key, function (err, data) {
            if (err) {
                rejected(err)
            } else {
                resolved(data)
            }
        })
    })
}

export const multi = function () {
    const multi = client.multi()

    multi.execAsync = function() {
        return new Promise(function (resolved, rejected) {
            multi.exec(function (err, replies) {
                if (err) {
                    rejected(err)
                } else {
                    resolved(replies)
                }
            })
        })
    }
    
    return multi;
}

client.on("error", function (err) {
    log(`redis error: ${err}`);
});

pub.on("error", function (err) {
    log(`pub redis error: ${err}`);
});

sub.on("error", function (err) {
    log(`sub redis error: ${err}`);
});