import fs from 'node:fs';
import assert from 'node:assert/strict';

const base='https://camarasyalarmasrapid.com';
const pages=JSON.parse(fs.readFileSync('.cache/pages.json','utf8'));
const report=JSON.parse(fs.readFileSync('.cache/build-report.json','utf8'));

assert.equal(report.mode,'production');
assert.equal(report.domain,base);
assert.equal(report.pages,3872);
assert.equal(report.municipalities,3797);
assert.equal(report.approvedLocalities,0);
assert.equal(report.indexable,3868,'Deben salir indexables 31 páginas núcleo, 19 provincias, 3797 pueblos y 21 distritos de Madrid');
assert.equal(report.sitemaps.length,20);assert.ok(report.sitemaps.includes('/sitemaps/principal.xml'));for(const slug of ['alava','bizkaia','gipuzkoa','burgos','cantabria','navarra','la-rioja','leon','valladolid','zamora','avila','palencia','salamanca','segovia','soria','madrid','asturias','toledo','guadalajara'])assert.ok(report.sitemaps.includes('/sitemaps/'+slug+'.xml'));

const indexed=pages.filter(p=>p.indexed);
assert.equal(indexed.length,3868);
assert.equal(indexed.filter(p=>p.townId).length,3797);
assert.equal(indexed.filter(p=>p.province&&!p.townId&&!p.district).length,19);assert.equal(indexed.filter(p=>p.district).length,21);

const sitemap=fs.readFileSync('dist/sitemaps/principal.xml','utf8');
const locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(locs.length,50);
assert.equal(new Set(locs).size,50);
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
const madridHub=fs.readFileSync('dist/madrid/index.html','utf8');
assert.ok(madridHub.includes('id="distritos-madrid"'));
assert.ok(madridHub.indexOf('id="distritos-madrid"')<madridHub.indexOf('data-town-list'));
for(const slug of ['san-blas-canillejas','vicalvaro','carabanchel','usera','puente-de-vallecas'])assert.ok(madridHub.includes('href="/madrid/'+slug+'/"'),slug);
const localSample=fs.readFileSync('dist/burgos/lerma/index.html','utf8');
assert.ok(localSample.includes('#local-service'));
assert.ok(localSample.includes('Alarma y vídeo conectados en Lerma'));
assert.ok(localSample.includes('"areaServed"'));

const robots=fs.readFileSync('dist/robots.txt','utf8');
assert.ok(robots.includes('Sitemap: '+base+'/sitemap.xml'));
assert.ok(!robots.toLowerCase().includes('disallow: /'));
const headers=fs.readFileSync('dist/_headers','utf8');
assert.ok(!headers.includes('X-Robots-Tag: noindex'));

const root=fs.readFileSync('dist/sitemap.xml','utf8');
assert.ok(root.includes(base+'/sitemaps/principal.xml'));
assert.ok(root.includes('/sitemaps/burgos.xml'));

for(const province of report.provinces){const xml=fs.readFileSync('dist/sitemaps/'+province.slug+'.xml','utf8');const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,province.count+(province.slug==='madrid'?21:0),province.slug);}
console.log('PRODUCTION SEO DRY-RUN OK: 3868 URLs indexables; 3797 pueblos, 21 distritos de Madrid, 19 provincias y 31 páginas núcleo; sitemap, canonical, robots y schema correctos.');
