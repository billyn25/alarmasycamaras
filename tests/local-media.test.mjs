import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {townsFrom} from '../src/lib.mjs';
import {townPage,shell,home} from '../src/views.mjs';
import {localServiceMedia} from '../src/local-media.mjs';
const data=JSON.parse(fs.readFileSync('data/municipios.json','utf8'));
const towns=townsFrom(data.municipalities);

test('Todos los municipios: cuatro fotos distintas, contenido útil y tres intenciones intactas',()=>{
  for(const t of towns){
    const html=townPage(t,[],null);
    const srcs=[...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(srcs.length,4,t.url);
    assert.equal(new Set(srcs).size,4,t.url);
    for(const src of srcs)assert.ok(fs.existsSync('public'+src),src);
    assert.equal((html.match(/<h1[> ]/g)||[]).length,1,t.url);
    assert.equal((html.match(/<h2>Instalación de /g)||[]).length,3,t.url);
    assert.ok(html.includes('id="local-ecosystem-title"'),t.url);
    assert.ok(html.includes('id="local-usage-title"'),t.url);
    assert.ok(html.includes('loading="eager" fetchpriority="high"'),t.url);
    assert.equal((html.match(/loading="lazy"/g)||[]).length,3,t.url);
    assert.ok(html.includes('Imagen de producto, no de una instalación local.'),t.url);
  }
});
test('Verde verificado y logo Rapid inalterado',()=>{
  const css=fs.readFileSync('public/ajax-accent.css','utf8');
  for(const hex of ['#5ae4aa','#1dcf94','#00b280'])assert.ok(css.includes(hex),hex);
  const logo=fs.readFileSync('public/assets/logo.svg');
  const sha=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+logo.length+'\0'),logo])).digest('hex');
  assert.equal(sha,'4cb69142e42ec4dd11b058b38403a0bb1feabde7');
  const html=home(towns);const srcs=[...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(srcs.length,4);assert.equal(new Set(srcs).size,4);
});
test('Pie con un solo teléfono y sin reactivar indexación',()=>{
  const site=JSON.parse(fs.readFileSync('config/site.json','utf8'));site.directoryCount=towns.length;
  const html=shell({url:'/',title:'Revisión',description:'Revisión de diseño',body:''},site,{production:false,base:''},{css:'/test.css',js:'/test.js'});
  const footer=html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
  assert.equal((footer.match(/href="tel:/g)||[]).length,1);
  assert.ok(html.includes('content="noindex,follow"'));
  assert.throws(()=>localServiceMedia('desconocido'));
});
