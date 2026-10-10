import fs from 'node:fs';
import assert from 'node:assert/strict';

const site=JSON.parse(fs.readFileSync('config/site.json','utf8'));
const pages=JSON.parse(fs.readFileSync('.cache/pages.json','utf8'));
const report=JSON.parse(fs.readFileSync('.cache/build-report.json','utf8'));
const base=new URL(site.domain).origin;

assert.equal(base,'https://camarasyalarmasrapid.com');
assert.equal(report.pages,3849);
assert.equal(report.municipalities,3797);

for(const page of pages){
  const html=fs.readFileSync('dist/'+page.file,'utf8');
  const canonical=[...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(m=>m[1]);
  if(page.url==='/404.html')assert.equal(canonical.length,0);
  else{
    assert.equal(canonical.length,1,page.url);
    assert.equal(canonical[0],base+page.url,page.url);
    assert.ok(!canonical[0].includes('netlify.app'),page.url);
  }
  assert.ok(page.description.length<=170,'Meta description larga: '+page.url);
  assert.ok(page.title.length<=80,'Title base largo: '+page.url);
}
const redirects=fs.readFileSync('dist/_redirects','utf8');
for(const line of [
 'https://www.camarasyalarmasrapid.com/* https://camarasyalarmasrapid.com/:splat 301!',
 'http://camarasyalarmasrapid.com/* https://camarasyalarmasrapid.com/:splat 301!',
 '/index.html / 301!',
 '/guipuzcoa/* /gipuzkoa/:splat 301!',
 '/vizcaya/* /bizkaia/:splat 301!'
])assert.ok(redirects.includes(line),line);

assert.ok(fs.existsSync('dist/assets/logo-rapid.svg'));
assert.ok(fs.existsSync('dist/assets/favicon-rapid.svg'));
console.log('SEO FINAL OK:',pages.length,'páginas; canonical único en dominio final, redirects y metas comprobados.');
