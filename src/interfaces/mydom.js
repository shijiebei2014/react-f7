import { JSDOM, CookieJar, toughCookie } from "jsdom";
import {isObject} from "lodash";

export default function(url, options = {}) {
    if (options.cookie) {
        const Cookie = toughCookie.Cookie;
        var cookieJar = new toughCookie.CookieJar();
        // console.log(options.cookie)
        for(let key in options.cookie) {
            let val = options.cookie[key]
            var cookie = Cookie.parse(val);
            cookieJar.setCookieSync(cookie, key);
        }
        options.cookieJar = cookieJar;
        delete options.cookie;
    }
    // console.log(options);
    return JSDOM.fromURL(url, options)
}