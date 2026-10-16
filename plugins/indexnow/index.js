// Tells Bing (and through it ChatGPT, Copilot, Yandex, Seznam and others) about
// every page on the site the moment a production deploy goes live, via
// IndexNow. Without this Bing only finds changes when it next recrawls, which
// can take weeks.
//
// The key file public/0f8cd5f276341daf7a3342b399b48d8c.txt proves we own the domain. If you rename or
// delete it, IndexNow rejects every ping. Never fails the build.
import { readFile } from 'node:fs/promises';

const KEY = '0f8cd5f276341daf7a3342b399b48d8c';
const HOST = 'immersion-english.com';

export const onSuccess = async ({ constants, utils }) => {
  if (process.env.CONTEXT !== 'production') return;
  try {
    const xml = await readFile(`${constants.PUBLISH_DIR}/sitemap.xml`, 'utf8');
    const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1])
      .filter((u) => u.startsWith(`https://${HOST}`) && !/\.(jpe?g|png|webp)$/.test(u));
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    });
    console.log(`IndexNow: submitted ${urlList.length} URLs, status ${res.status}`);
  } catch (e) {
    utils.status.show({ title: 'IndexNow ping failed', summary: String(e) });
  }
};
