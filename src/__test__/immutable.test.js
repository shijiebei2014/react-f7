import {Range, List, Map} from 'immutable';
import { max } from 'lodash';
test('Map', () => {
    const map1 = Map({a: 1, b: 2, c: 3});

    let map2 = map1.set('b', 50)
    
    expect(map1.get('b')).toEqual(2)
    expect(map1.size).toBe(3)

    map2 = map1.update('a', (val) => {
        return val + 1;
    })

    expect(map2.get('a')).toBe(2)

    //console.log(Map({ a: Map({b: 1})}).flatMap((val, key) => {
    //    console.log(val)
    //    return Map.isMap(val) ? val : Map({ key: val * 5})
    //}))
    console.log(map2.toSeq())
})

test('ordered indexed List', () => {
    var range = Range(1, 5, 1)
    let list = List.of(...range.toArray())
    console.log(list.size)
    expect(list.size).toBe(4)

    list.set(1, 3)
    console.log(list.get(1))

    let result = list.update(1, val => val - 1)

    console.log(list.get(1))
    console.log(result.get(1))
    console.log(list)

    result = list.filter(val => val % 2 == 0)
    console.log(result);

    result = list.sort((valA, valB) => {
        return max(valA, valB) == valA ? -1 : (valA == valB ? 0 : 1);
    })
    console.log(result.toJS());
    expect(result.toJSON()).toEqual(result.toArray())
    console.log(result.toObject());
})