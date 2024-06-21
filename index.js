import puppeteer from 'puppeteer';
import { createClient } from 'redis';

const client = await createClient({
    url: (process.env.REDIS_URL | 'redis://127.0.0.1:6379')
})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

const browser = await puppeteer.launch({headless: false});

const url = "https://www.google.com/search?q=cyprien+video&tbm=vid&source=lnms&hl=en&lr=lang_us";

const page = await browser.newPage();
await page.goto(url, {
    waitUntil: 'networkidle0',
});
const [button] = await page.$$("xpath/.//button[contains(., 'Accept all')]");
if (button) {
    await button.click();
}

await page.goto(url, {
    waitUntil: 'networkidle0',
});

const videosToClick = await page.$$("div[data-url]");
if (videosToClick) {
    await videosToClick[0].click();
}
const firstRequest = await page.waitForRequest('https://www.youtube.com/youtubei/v1/player?prettyPrint=false');
await firstRequest.fetchPostData()
const youtubePlayerPostData = await firstRequest.postData();
const youtubePlayerPostDataJson = JSON.parse(youtubePlayerPostData);
const poToken = youtubePlayerPostDataJson.serviceIntegrityDimensions.poToken;
const visitorData = youtubePlayerPostDataJson.context.client.visitorData;

await client.set('POTOKEN', poToken);
await client.set('VISITORDATA', visitorData);

await browser.close();
process.exit(0);