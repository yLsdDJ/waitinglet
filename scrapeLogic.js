const puppeteer = require("puppeteer");

const UserAgent = require('user-agents');
const userAgent = new UserAgent({
  deviceCategory: 'desktop'
});
const randomUserAgent = userAgent.toString();
require("dotenv").config();

const login = '46714430078';
const senha = '6645135';

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto('https://servicos.corsan.com.br/#/solicitacao/1/', {
      waitUntil: "networkidle0"
    });

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    await page.setUserAgent(randomUserAgent);

    usernameXPATH = '//*[@id="27"]';
    passwordXPATH = '//*[@id="26"]';
  
    const usernameElement = await page.$x(usernameXPATH);
    await usernameElement[0].click({
      clickCount: 3
    });
    await usernameElement[0].type(login);
  
    const passwordElement = await page.$x(passwordXPATH);
    await passwordElement[0].click({
      clickCount: 3
    });
    await passwordElement[0].type(senha);
  
    await page.keyboard.press('Enter');
  
    page.waitForXPath("/html/body/div[2]/div/div/div/div[1]/form", {
      timeout: 6000
    });
  
    await page.waitForTimeout(3000);
  
    const text = await page.evaluate(async () => {
      return document.querySelector('#page-top > div.content-principal.ng-scope > div > div > div > div:nth-child(1) > form > div.row.mt20.ng-scope > div.ng-scope > div > table').textContent;
    });

    res.send(text);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };