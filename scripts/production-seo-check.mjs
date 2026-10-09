import fs from 'node:fs';
import assert from 'node:assert/strict';

const base='https://alarmasycamarasrapid.com';
const pages=JSON.parse(fs.readFileSync('.cache/pages.json','utf8'));
const report=JSON.parse(fs.readFileSync('.cache/build-report.json','utf8'));

assert.equal(report.mode,'production');
assert.equal(report.domain,base);
assert.equal(report.pages,3848);
assert.equal(report.municipalities,3797);
assert.equal(report.approvedLocalities,0);
assert.equal(report.indexable,28,'Solo las 28 páginas núcleo deben salir indexables en el primer lanzamiento');
assert.deepEqual(report.sitemaps,['/sitemaps/principal.xml']);

const indexed=pages.filter(p=>p.indexed);
assert.equal(indexed.length,28);
assert.equal(indexed.filter(p=>p.townId).length,0);
assert.equal(indexed.filter(p=>p.province).length,0);

const sitemap=fs.readFileSync('dist/sitemaps/principal.xml','utf8');
const locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(locs.length,28);
assert.equal(new Set(locs).size,28);
for(const loc of locs){
  assert.ok(loc.startsWith(base+'/'),loc);
  const path=new URL(loc).pathname;
  const page=pages.find(p=>p.url===path);
  assert.ok(page?.indexed,'Sitemap contiene página no indexable: '+loc);
}
for(const p of pages){
  const html=fs.readFileSync('dist/'+p.file,'utf8');
  const robots=html.match(/<meta name="robots" content="([^"]+)"/)?.[1]||'';
  if(p.indexed)assert.ok(robots.startsWith('index,follow'),p.url);
  else assert.ok(robots.startsWith('noindex,follow'),p.url);
  if(p.url!='/404.html')assert.ok(html.includes('<link rel="canonical" href="'+base+p.url+'">'),p.url);
}
const home=fs.readFileSync('dist/index.html','utf8');
for(const type of ['Organization','WebSite','WebPage'])assert.ok(home.includes('"@type":"'+type+'"'),type);
const service=fs.readFileSync('dist/camaras/index.html','utf8');
assert.ok(service.includes('"@type":"Service"'));

const robots=fs.readFileSync('dist/robots.txt','utf8');
assert.ok(robots.includes('Sitemap: '+base+'/sitemap.xml'));
assert.ok(!robots.toLowerCase().includes('disallow: /'));
const headers=fs.readFileSync('dist/_headers','utf8');
assert.ok(!headers.includes('X-Robots-Tag: noindex'));

const root=fs.readFileSync('dist/sitemap.xml','utf8');
assert.ok(root.includes(base+'/sitemaps/principal.xml'));
assert.ok(!root.includes('/sitemaps/burgos.xml'));

console.log('PRODUCTION SEO DRY-RUN OK: 28 páginas núcleo indexables; 0 provincias y 0 pueblos liberados; sitemap, canonical, robots y schema correctos.');
