import {compose, add, concat, head, prop, map, toUpper, split, curry, reduce} from 'ramda';
import {Container, Maybe, Left, Right, Either, IO, chain, liftA2} from '../utils/functor'
import { client, pub, sub, set, get, hset, hget, hgetall, hkeys, multi } from "../interfaces/client.js"
import * as redis from "redis"
import * as Task from 'data.task'
import * as path from 'path'
import * as fs from 'fs'
import * as urllib from 'urllib'
import vm from 'vm'
import jsTokens, { matchToToken} from 'js-tokens'
test('Container functor', ()=> {
    let value = Container.of(2).map(add(3)).__value
    expect(value).toEqual(5)

    value = Container.of('Tim').map(concat('My name is ')).__value
    expect(value).toEqual('My name is Tim')
})

test('Maybe functor', ()=> {
    let value = Maybe.of([{name: 'user', age: 12}]).map(compose(prop('name'), head)).__value
    // console.log(value)
    expect(value).toEqual('user')

    // value = Maybe.of([{}]).map(compose(prop('name'), head)).__value
    value = Maybe.of([]).map(head).map(prop('name')).__value
    // expect(value).toEqual('user')
})

test('Either functor', ()=> {
    let value = Left.of('Tim').map(concat('Hello ')).__value
    expect(value).toEqual('Tim')

    // value = Maybe.of([{}]).map(compose(prop('name'), head)).__value
    value = Right.of('Time').map(concat('Hello ')).__value
    expect(value).toEqual('Hello Time')

    let id = function(x) { return x; }
    value = Either(id, add(1), Right.of(2))
    expect(value).toEqual(3)

    value = Either(id, add(1), Left.of(2))
    expect(value).toEqual(2)
})

test('IO functor', ()=> {
    let f = function() {
        return __dirname;
    };
    var getDir = IO.of(f)
    //Functor = {__value: 值}
    // _.map(f, Functor) == Functor.map(f)
    // _.map(f, IO).__value() == IO.map(f).__value()
    console.log(map(toUpper, getDir).__value())
    // console.log(getDir.map(toUpper).__value())

    expect(map(toUpper, getDir).__value()).toEqual(getDir.map(toUpper).__value())
})

test('async Task', ()=> {
    Task.of(3).map(add(2)).fork(
        function(error){ console.log(error) },
        function(data){ expect(data).toBe(5) })
})

test('exercise', ()=> {
    /*//1.
    var ex1 = map(add(1));
    //2.
    var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti',
'do']);
    var ex2 = map(head);
    //3.
    var safeProp = _.curry(function (x, o) { return Maybe.of(o[x]);
});
    var user = { id: 2, name: "Albert" };
    var ex3 = compose(head, saveProp('name'))
    //4.
    var ex4 = compose(map(parseInt), Maybe.of)
    //5.
    var getPost = function (i) {
        return new Task(function(rej, res) {
            setTimeout(function(){
                res({id: i, title: 'Love them futures'})
            }, 300)
        });
    }
    var ex5 = getPost.map(compose(toUpper, prop('title')))*/
    //6.
    var showWelcome = compose(concat( "Welcome "), prop('name'))
    var checkActive = function(user) {
        console.log(user.active)
        return user.active ? Right.of(user) : Left.of('Your account is not active')
    }
    var ex6 = compose(map(showWelcome), checkActive)
    console.log(ex6({name: 'hello', active: false}))
    /*//7.
    var ex7 = function(x) {
        (x.length > 3) ? Right.of(x) : Left.of('You need > 3')
    }
    //8.
    var save = function(x){
        return new IO(function(){
            console.log("SAVED USER!");
            return x + '-saved';
        });
    }
    var ex8 = ex7.map(Either(IO.of, save))

    console.log(ex8(Right.of('hello')).__value())
    console.log(ex8(Left.of('hello')).__value())*/
})

test('测试1', ()=> {
    let readFile = function(path) {
        return IO.of(function() {
            return fs.readFileSync(path, 'utf-8')
        })
    }
    let print = function(x) {
        return IO.of(function() {
            return x;
        })
    }
    let join = function(m) {
        return m.join()
    }
    let step1 = compose(chain(print), readFile); //IO(IO('文件内容'))
    let step2 = compose(map(console.log), step1)
    let monad = step2(path.join(__dirname, 'test.js'))
    // monad.__value()
    // while(monad.__value) {
    //     console.log(1)
    //     monad = monad.join()
    // }
    // console.log(monad())
    // console.log(val.__value().__value())
    monad = Maybe.of(Maybe.of(Maybe.of(3)))
    monad = compose(chain(compose(Maybe.of, add(3))), chain(compose(Maybe.of, add(2))), Maybe.of)
    console.log(monad(1))
})

test('exercise2', () => {
    var safeProp = curry(function (x, o) {
        return Maybe.of(o[x]);
    });
    var user = {
        id: 2,
        name: "albert",
        address: {
            street: {
                number: 22,
                name: 'Walnut St'
            }
        }
    };
    var ex1 = compose(chain(function (x) {
        return x;
    }), chain(safeProp('name')), chain(safeProp('street')), chain(safeProp('address')), Maybe.of);
    console.log(ex1(user))

    var getFile = function () {
        return new IO(function () {
            return __filename;
        });
    }
    var pureLog = function (x) {
        return new IO(function () {
            console.log(x);
            return 'logged ' + x;
        });
    }
    var ex2 = getFile()
        .chain(pureLog)
        .__value();
    console.log(ex2)

    /*var getPost = function (i) {
        return Task.of(function (rej, res) {
            setTimeout(function () {
                res({id: i, title: 'Love them tasks'});
            }, 300);
        });
    }
    var getComments = function (i) {
        return Task.of(function (rej, res) {
            setTimeout(function () {
                res([
                    {
                        post_id: i,
                        body: "This book should be illegal"
                    }, {
                        post_id: i,
                        body: "Monads are like smelly shallots"
                    }
                ]);
            }, 300);
        });
    }
    var ex3 = compose(chain(compose(getComments, prop('id'))), getPost);

    console.log(ex3(1))*/
    var addToMailingList = (function (list) {
        return function (email) {
            return new IO(function () {
                list.push(email);
                return list;
            });
        }
    })([]);
    function emailBlast(list) {
        return new IO(function () {
            return 'emailed: ' + list.join(',');
        });
    }
    var validateEmail = function (x) {
        return x.match(/\S+@\S+\.\S+/)
            ? (new Right(x))
            : (new Left('invalid email '));
    }
    // ex4 :: Email -> Either String (IO String)
    var ex4 = function(email) {
        return Either(function(x) {return IO.of(x)}, compose(chain(emailBlast), addToMailingList), validateEmail(email)).__value();
    }
    console.log(ex4('123@qq.com'))
    console.log(ex4('123qq.com'))
})

test('applicative functor', () => {
    console.log(Container.of(2).map(add).ap(Container.of(3)))
})

test('exercise 3', () => {
    var localStorage = {};

    var ex1 = function(x, y) {
        return Maybe.of(add).ap(Maybe.of(x)).ap(Maybe.of(y))
    }

    var ex2 = function(x, y) {
        return liftA2(add, Maybe.of(x), Maybe.of(y))
    }
    // console.log(ex1(2, 3))
    console.log(ex2(2, 3))
    /*var makeComments = reduce(function (acc, c) {
        return acc + "<li>" + c + "</li>"
    }, "");
    var render = curry(function (p, cs) {
        return "<div>" + p.title + "</ div > "+makeComments(cs); });
    // ex3 :: Task Error HTML
    var ex3 = Task.of(render).ap(getPost(2)).ap(getComments(2));*/

    localStorage.player1 = "toby";
    localStorage.player2 = "sally";
    var getCache = function (x) {
        return new IO(function () {
            return localStorage[x];
        });
    }
    var game = curry(function (p1, p2) {
        return p1 + ' vs ' + p2;
    });
    // ex4 :: IO String
    var ex4 = IO.of(game).ap(getCache('player1')).ap(getCache('player2'));
    console.log(ex4.__value())
})

test('测试', ()=> {
    function objToStrMap(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }
    let obj = {
        a: 1,
        b: 2
    }
    console.log([...objToStrMap(obj)])
})

test('测试redis', ()=> {
    /*client.set("name", "hello", function(err, result) {
         console.log(err)
         console.log(result)
    })*/
    /*get('name').then(function(data) {
         console.log(data)
    }).catch(function(err) {
         console.log(err);
    })*/
    /*sub.on('subscribe', function(channel, count) {
        // 一个redis client 只能被当作subsribe,unsubscribe或者publish,不能同时拥有,会报错
        // sub.publish("a nice channel", "I am sending a message."); 
        pub.publish("a nice channel", "I am sending a message."); 
    })

    sub.on('message', function(data) {
         console.log(`receiver message: ${data}`)
    })
    sub.subscribe('a nice channel')*/
    /*Promise.all([
        hset('one', 'name', 'Time'),
        hset('one', 'age', 27)
    ]).then(function(data) {
        //  console.log(data)
        //  return hgetall('one')
        return hkeys('one')
    }).then(function(data) {
        console.log(data)
    }).catch(function(err) {
        console.log(err)
    })*/
    multi() //按顺序的
        .set('int', 1)
        .incr('int')
        .set('int', '123a')
        .execAsync().then(function(replies) {
            console.log("MULTI got " + replies.length + " replies");
            replies.forEach(function (reply, index) {
                console.log("Reply " + index + ": " + reply.toString());
            });     
        }).catch(function(err) {
             console.log(`err: ${err}`)
        });
})

test('测试compose', ()=> {
    // function compose() {
    //     for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    //         funcs[_key] = arguments[_key];
    //     }

    //     if (funcs.length === 0) {
    //         return function (arg) {
    //             return arg;
    //         };
    //     }

    //     if (funcs.length === 1) {
    //         return funcs[0];
    //     }
    //     return funcs.reduce(function (a, b) {
    //         return function () {
    //             return a(b.apply(undefined, arguments));
    //         };
    //     });
    // }

    let func = compose((c) => (d) => {
        console.log(`c: ${c} d: ${d}`);
        return c(d);
    }, (a) => (b) => a + b)(2)
    console.log(func.toString())
    console.log(func(2))
})

test('weather', (done)=>{
    let url = 'http://d1.weather.com.cn/weather_index/101210408.html?_=1505532381387', referer = 'http://www.weather.com.cn/'
    urllib.request(url, {
        headers: {
            Referer: referer,
        }   
    }).then(data=> {
        var cityDZ, alarmDZ, fc, dataSK, dataZS;
        let str = data.data.toString()//.replace(/var/g, '')
        // console.log(b.substring(0, b.indexOf('=')))
        // console.log(str);
        
        try {
            // console.log(jsTokens.exec(str));
            console.log(str.match(jsTokens));
            // console.log(matchToToken(str.match(jsToken)))
            // eval(str)
        } catch (e) {
            console.log(e)
        }
        // console.log(obj);
        // console.log(cityDZ.weatherinfo)
        // console.log(obj);
        // console.log(str.split(';'))
        done(null)
    }).catch(err => {
        done(err)
    })
})

test('query', (done)=>{
    let url = 'http://toy1.weather.com.cn/search'
    let callback = "weatherCallback"
    urllib.request(url, {
        dataAsQueryString: true,
        data: {
            cityname: '宁海',
            callback: callback
        },
        timeout: 20 * 1000
    }).then((data)=> {
        let content = data.data.toString()
        content = content.substring(callback.length + 1, content.length - 1)
        console.log(JSON.parse(content))
    }).catch((err)=>{
        console.log(err);
    })
})