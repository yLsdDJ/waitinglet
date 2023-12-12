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
    //headless: 'new',
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
        executablePath: process.env.NODE_ENV === "production" ?
          process.env.PUPPETEER_EXECUTABLE_PATH :
          puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    // Set screen size
    await page.setViewport({
      width: 1080,
      height: 1024
    });
    await page.setUserAgent(randomUserAgent);

    await page.goto('https://servicos.corsan.com.br/#/solicitacao/1/', {
      waitUntil: "networkidle0"
    });

    const elements0 = await page.$x('/html/body/div[2]/div/div/div/div[1]/form/div[1]/div/div[1]/campos/div/input');
    await elements0[0].click();
    await elements0[0].type(login);

    const elements1 = await page.$x('/html/body/div[2]/div/div/div/div[1]/form/div[1]/div/div[2]/campos/div/div/div[3]/input');
    await elements1[0].click();
    await elements1[0].type(senha);

    const elements2 = await page.$x('/html/body/div[2]/div/div/div/div[1]/form/div[3]/button');
    await elements2[0].click();

    await sleep(6000);

    const text = await page.evaluate(async () => {
      return document.querySelector('#page-top > div.content-principal.ng-scope > div > div > div > div:nth-child(1) > form > div.row.mt20.ng-scope > div.ng-scope > div > table').textContent;
    });

    //console.log(text);

    res.send(text);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = {
  scrapeLogic
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}