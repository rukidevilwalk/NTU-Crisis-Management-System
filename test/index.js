/* Author(s): Neo Kee Pin*/
// import faker from "faker";
// import puppeteer from "puppeteer";

// const url = "http://www.cms404.me/login";

// var fake_user = {
//     name: faker.internet.userName(),
//     password: faker.internet.password()
// };

// let page;
// let browser;

// beforeAll(async() => {
//     browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});
//     page = await browser.newPage();
// });

// afterAll(() => {
//     browser.close();
// });

// describe("login form", () => {
//     test("fake_user cannot access the login page", async() => {
//         await page.goto(url);
//         await page.type("input[name=username]", fake_user.name);
//         await page.type("input[name=[password", fake_user.password);
//         await page.click("button[type=submit]");
//     }, 16000);
// });