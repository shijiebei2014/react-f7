// import Rx from 'rxjs/Rx'
import Rx from 'rx'
import fs from 'fs'

/**
 * https://github.com/Reactive-Extensions/RxJS/blob/master/doc/libraries/main/rx.complete.md
 */
test('test', done => {
    let foo = Rx.Observable.create(observer => {
        console.log('hello');
        // observer.error(new Error('错误'))
        observer.next(42)
    })

    foo.subscribe(x => {
        throw new Error(123)
        expect(x).toBe(42)
    })
    // foo.subscribe(x => {
    //     expect(x).toBe(42)
    // })

    setTimeout(function() {
        done(null)
    }, 200);    
})

test('of', () => {
    Rx.Observable.of('hello world')
      .subscribe(x=> {
          expect(x).toBe('hello world')
          console.log(x)
      })
})

test('subject', ()=> {
    let subject = new Rx.Subject();
    
    let subscrition = subject.subscribe(v=> {
        console.log(`observerA: ${v}`);
    }) // Rx.Disposable

    let subscrition2 = subject.subscribe(v => {
        console.log(`observerB: ${v}`);
    }) // Rx.Disposable
    subject.next(1)
    subscrition.dispose(); // unsubscirbe
    subscrition2.dispose(); // unsubscirbe
    subject.next(2)
})

test('multicast', ()=> {
    let source = Rx.Observable.from([1,2,3]);
    let subject = new Rx.Subject();
    var multicasted = source.multicast(subject);

    multicasted.subscribe(v=> {
        console.log(`observerA: ${v}`);
    })
    multicasted.subscribe(v=> {
        console.log(`observerB: ${v}`);
    })

    multicasted.connect()
})

test('promise', ()=> {
    let source = Rx.Observable.fromPromise(new Promise(function(resolve, reject) { // Observable sequence
        fs.readFile(__filename, function(err, data) {
             if (err) {
                reject(err)
             } else {
                 resolve(data.toString())
             }
        })
    }));

    // source = source.map(function(val) { // operator
    //      return val + 10;
    // })

    let subscription = source.subscribe((x)=> { // 订阅
        console.log(x);
    })

    // subscription.next(1); // 订阅实例,不经过operator;立即发送(next)
})

test('merge', ()=> {
    let one = Rx.Observable.just(1);
    let two = Rx.Observable.just(2);
    // timeout 定时完成(complete)or失败(err)
    let n = Rx.Observable.concat(one, two).map(function(x) {
         return x * x
    }).sum().timeout(1000, Promise.resolve());
    // n.then(x=>{
    //     console.log('x: ', x);
    // });

    // let n = Rx.Observable.from([1, 2, 1, 4]).distinct();
    n.subscribe(function(x) {
         console.log(x);
    }, (err) => {
        console.log(err);
    }, () => {
        console.log('Complete!');
    })
})

test('connect', (done)=>{
    let interval = Rx.Observable.interval(1000)

    let source = interval.take(2).do(function(v) {
       console.log('side effect');
    })

    let publish = source.publish()

    let createObserver = function(tagName) {
         return Rx.Observer.create((v)=> {
            console.log(`${tagName} next: ${v}`);
         })
    }

    publish.subscribe(createObserver('one'))
    publish.subscribe(createObserver('two'))

    let connection = publish.connect(); //publish, 对应connect


    setTimeout(function() {
        done()
    }, 3000)
})

test('controlled', ()=> {
    var source = Rx.Observable.from([1, 2]).controlled()//.take(2)

    source.subscribe((v)=> {
        console.log(`v: ${v}`)
    })

    source.request(2); //controlled, 对应request, 相当于take(2)
})

test('case', () => {
    var sources = {
        foo: Rx.Observable.create((observer)=> {observer.next('foo')}),
        bar: Rx.Observable.create((observer)=> {observer.next('bar')}),
    }

    var observable = Rx.Observable.case(()=>'1', sources, Rx.Observable.create((observer)=>{observer.next('default')}))

    observable.subscribe((x)=> {
        console.log(`x: ${x}`);
    })
})

test('amb', () => { //执行第一个observable
    var observable = Rx.Observable.amb(Rx.Observable.create((observer) => { observer.next(1) }), Rx.Observable.create((observer) => { observer.next(2) }));

    observable.subscribe((val)=> {
        console.log(`val: ${val}`);
    })
})

test('catch', () => { //报错了 也会执行
    var throwObservable = Rx.Observable.throw(new Error('error'));
    var midObservable = Rx.Observable.return('middle')
    var endObservable = Rx.Observable.return('end')

    Rx.Observable.catch(throwObservable, midObservable, endObservable).subscribe((val) => {
        console.log(`val: ${val}`);
    })
})

test('combineLatest', (done) => {
    //stream one: --0--1--2-|
    //stream two: ---0---1---2-|
    //output    :    0,0
    //                 1,0
    //                   2,0
    //                   1,1
    var observable = Rx.Observable.combineLatest(Rx.Observable.interval(200), Rx.Observable.interval(300), (v1, v2)=> {
        return `first: ${v1} second: ${v2}`
    }).take(3)
    
    observable.subscribe(function (x) {
        console.log('Next: %s', JSON.stringify(x));
    },
    function (err) {
        console.log('Error: %s', err);
    },
    function () {
        console.log('Completed');
    })
    
    setTimeout(function() {
        done()
    }, 3 * 1000);
})

test('from', (done)=> {
    var exists = Rx.Observable.fromCallback(fs.exists)
    exists('foo.txt').subscribe(exists => {
        console.log(exists)
    }, err => {
        console.log(err);
    }, () => {
        console.log("complete");
    })

    setTimeout(function() {
        done()
    }, 1000)
})
test.only('switch', ()=>{
    // init: '0-1-2-|'
    //        1-2-3(lastest,从上往下,从左往右,第二个,if 是最后一组,取全部 else 取第一个)
    // map : '0-1-2'
    //       '1-2-3'
    //       '2-3-4'
    //0-1--2---3---4-1
    var source = Rx.Observable.range(2, 3)
        .map(function (x) {
            // return Rx.Observable.range(x, 3);
            return Rx.Observable.of(x, x * 2);
        })
        .switch();

    var subscription = source.subscribe(
        function (x) {
            console.log('Next: ' + x);
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
        });
})