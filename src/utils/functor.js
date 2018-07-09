import {curry, compose} from 'ramda';

export const Container = function(x) {
    this.__value = x;
}

Container.of = function(x) {
    return new Container(x);
}

Container.prototype.map = function(f) {
    return Container.of(f(this.__value));
}

Container.prototype.ap = function(c) {
    return c.map(this.__value)
}

export const Maybe = function(x) {
    this.__value = x;
}

Maybe.of = function(x) {
    return new Maybe(x)
}

Maybe.prototype.isNothing = function() {
    // console.log(this.__value)
    return (this.__value === null || this.__value === undefined)
}

Maybe.prototype.map = function(f) {
    // console.log(`isNothing: ${this.isNothing()}`)
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value))
}

Maybe.prototype.ap = function(m) {
    return m.map(this.__value)
}

export const Left = function(x) {
    this.__value = x;
}

Left.of = function(x) {
    return new Left(x)
}

Left.prototype.map = function(f) {
    return this;
}

export const Right = function(x) {
    this.__value = x;
}

Right.of = function(x) {
    return new Right(x)
}

Right.prototype.map = function(f) {
    console.log(f(this.__value))
    return Right.of(f(this.__value));
}

export const Either = curry(function(f, g, e) {
    switch (e.constructor) {
        case Left:
            return f(e.__value)
    
        case Right:
            return g(e.__value)
    }
})

export const IO = function(f) { //传函数
    this.__value = f
}

IO.of = function(x) { //不要传函数,要执行两次
    if (typeof x == 'function') { //兼容传函数
        return new IO(x)
    }
    return new IO(function() {
        return x;
    })
}

IO.prototype.map = function(f) {
    /**
     * 如果这里用IO.of,则相当于包了两层函数,
     * 72,一层,
     * 73,一层
     */
    return new IO(compose(f, this.__value))
}

IO.prototype.join = function() {
    return this.__value();
}

IO.prototype.chain = function(f) {
    return this.map(f).join(); // 或者 compose(join, map(f))(m)
}

IO.prototype.ap = function(i) {
    return i.map(this.__value())
}

Maybe.prototype.join = function() {
    return this.isNothing() ? Maybe.of(null) : this.__value
}

export const chain = curry(function(f, m){
    return m.map(f).join(); // 或者 compose(join, map(f))(m)
});

export const liftA2 = curry(function(f, functor1, functor2) {
    return functor1.map(f).ap(functor2);
});

export const liftA3 = curry(function(f, functor1, functor2, functor3) {
    return functor1.map(f).ap(functor2).ap(functor3);
});