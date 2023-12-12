const puppeteer = require("puppeteer");

const UserAgent = require('user-agents');
const userAgent = new UserAgent({
  deviceCategory: 'desktop'
});
const randomUserAgent = userAgent.toString();
require("dotenv").config();

const login = '46714430078';
const senha = '6645135';

//const proxy = 'e4e29c5041624c3b.na.pyproxy.io:16666';
//const username = 'djhenriqueee13-zone-resi';
//const password = 'djhenrique13';

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    //headless: 'new',
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
      //`--proxy-server=http://${proxy}`,
      //'--proxy-auth=djhenriqueee13-zone-resi-region-br:djhenrique13'
    ],
    executablePath: process.env.NODE_ENV === "production" ?
      process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    //await page.authenticate({
    //  username,
    //  password
    //});

    // Set screen size
    await page.setViewport({
      width: 1080,
      height: 1024
    });
    await page.setUserAgent(randomUserAgent);

    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'pt-BR,pt;q=0.9',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Sec-Ch-Ua': '\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '\"Windows\"'
    });

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