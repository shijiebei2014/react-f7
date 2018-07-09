import { JSDOM, CookieJar, toughCookie } from "jsdom";
import getDom from "../interfaces/mydom"
test('jsdom', (done) => {
    getDom("http://localhost:3000/", {
        Referer: "http://localhost:3000/login",
        cookie: {
            "http://localhost:3000": "connect.sid=s%3AAADP6Q9xy5tFBFE0oCGLOsp5.d13a9GyV4v9KkBxh27OY3DZjh03XhTn8gLi7C5sW6pk; i18next=zh"
        }
    }).then((dom) => {
        console.log(dom.window.document.querySelector('body').outerHTML)
        done(null)
    }).catch((err) => {
        var errmsg = err.message.substring(6)
        // console.log(new Buffer(JSON.parse(errmsg).data).toString())
        // console.log(err)
        done(err)
    })
    /*
    const Cookie = toughCookie.Cookie;
    var cookieJar = new toughCookie.CookieJar();

    var cookie = Cookie.parse("connect.sid=s%3AAADP6Q9xy5tFBFE0oCGLOsp5.d13a9GyV4v9KkBxh27OY3DZjh03XhTn8gLi7C5sW6pk; i18next=zh");
    cookieJar.setCookieSync(cookie, "http://localhost:3000");
    JSDOM.fromURL("http://localhost:3000/", {
        // contentType: "text/html",
        // userAgent: "Mellbiiiicenator/9000",
        includeNodeLocations: true,
        "If-None-Match":"1152709371",
        // Cookie: "Hm_lvt_1c87095e3647a3e99981c7cd78b1865c=1502581320,1503197145,1503674587,1504324474; Hm_lpvt_1c87095e3647a3e99981c7cd78b1865c=1504324474; connect.sid=s%3AAADP6Q9xy5tFBFE0oCGLOsp5.d13a9GyV4v9KkBxh27OY3DZjh03XhTn8gLi7C5sW6pk; i18next=zh"
        Referer: "http://localhost:3000/login",
        cookieJar
    }).then((dom) => {
        console.log(dom.window.document.querySelector('body').outerHTML)
        done(null)
    }).catch((err) => {
        var errmsg = err.message.substring(6)
        // console.log(new Buffer(JSON.parse(errmsg).data).toString())
        console.log(err)
        done(err)
    })*/
})