//Ysl1618xycc306#
import webdriver from "selenium-webdriver"
import chrome  from 'selenium-webdriver/chrome'
test("mandrill", ()=> {
    const {By, until} = webdriver;

    var driver = new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(/* ... */)
        .build();
    //driver.manage().getCookies().then((data) => {
    //    console.log(data);
    //})
    let expiry = new Date(Date.now() + (10 * 60 * 1000))
    let option = driver.manage();
    
    let exit = function() {
        console.log(3)
        driver.wait(until.titleIs('智思云 | 自由工作流－清单'), 5000);
        driver.quit();
    }
    driver.get('http://localhost:3000/')
        .then(() => {
            return option
                .addCookie({ name: "connect.sid", value: "s%3AAADP6Q9xy5tFBFE0oCGLOsp5.d13a9GyV4v9KkBxh27OY3DZjh03XhTn8gLi7C5sW6pk", expiry })
        })
        .then((data) => {
            console.log(data);
            return option.getCookie("connect.sid")
        })
        .then((cookie) => {
            console.log(cookie);
            return driver.get("http://localhost:3000/admin/free_wf/approve/bblist")
            // console.log(driver.window().getSize())
            // driver.getCurrentUrl()
            
        }).then(() => {
            return driver.getTitle()
        }).then((title) => {
            console.log(title)
            driver.findElement(By.id("btn_new")).click(); 
            return driver.switchTo().alert()
        }).then((alert) => {
            return alert.getText().then((text) => {
                console.log(text)
                alert.dismiss().then(() => {
                    driver.switchTo().alert().then((alert2) => {
                        console.log(2)
                        alert2.dismiss().then(() => {
                            exit();
                        })
                    })
                })
            })
        }).catch((err)=> {
            console.error(err)
            exit()
        })
});