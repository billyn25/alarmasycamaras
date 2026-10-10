import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {townsFrom} from '../src/lib.mjs';
import {localVariantSection,localVariantSignature,localSeoMeta,localInternalLinks} from '../src/local-variants.mjs';
const towns=townsFrom(JSON.parse(fs.readFileSync('data/municipios.json','utf8')).municipalities);
test('Variación local es estable y útil',()=>{
 for(const t of towns.slice(0,100)){const a=localVariantSection(t),b=localVariantSection(t);assert.equal(a,b);assert.equal((a.match(/class="local-variant-card"/g)||[]).length,5);assert.ok(a.includes(t.name));assert.ok(!/hemos instalado|nuestros clientes de|oficina en/i.test(a));}
});
test('La matriz crea miles de combinaciones estables, no random por deploy',()=>{
 const signatures=new Set(towns.map(t=>crypto.createHash('sha256').update(localVariantSignature(t)).digest('hex')));
 assert.ok(signatures.size>3300,signatures.size);
});

test('Metadatos locales estables, variados y únicos',()=>{
 const metas=towns.map(t=>localSeoMeta(t,'641 589 394'));
 assert.equal(new Set(metas.map(x=>x.title)).size,towns.length);
 assert.equal(new Set(metas.map(x=>x.description)).size,towns.length);
 assert.ok(metas.every(x=>x.description.length<=170));
});
test('Enlazado profundo local es estable y contiene cinco destinos',()=>{
 for(const t of towns.slice(0,200)){const a=localInternalLinks(t),b=localInternalLinks(t);assert.equal(a,b);assert.equal((a.match(/<a href=/g)||[]).length,5);}
});


test('Las 3797 páginas cubren intención de cámaras, alarmas, técnico e instalación',async()=>{
 const {localIntentSection}=await import('../src/local-variants.mjs');
 for(const town of towns){
  const html=localIntentSection(town).toLowerCase();
  for(const token of ['cámaras','alarma','instalación','técnico'])assert.ok(html.includes(token),town.url+' '+token);
  assert.ok(html.includes('/camaras/'));assert.ok(html.includes('/alarmas/'));assert.ok(html.includes('/alarmas-y-camaras/'));
 }
});
test('Titles y descriptions reparten múltiples formas de búsqueda',()=>{
 const titles=new Set(),descriptions=new Set();
 for(const t of towns){
  const meta=localSeoMeta(t,'641 589 394');
  titles.add(meta.title.replace(t.name,'[PUEBLO]').replace(t.province.name,'[PROVINCIA]'));
  descriptions.add(meta.description.replace(t.name,'[PUEBLO]').replace(t.province.name,'[PROVINCIA]').replace('641 589 394','[TEL]'));
 }
 assert.ok(titles.size>=8,titles.size);
 assert.ok(descriptions.size>=7,descriptions.size);
});


test('Las 3797 localidades incluyen intención de vivienda vacía y sin luz',async()=>{
 const {localVacantPowerIntent}=await import('../src/local-variants.mjs');
 for(const town of towns){
  const html=localVacantPowerIntent(town).toLowerCase();
  assert.ok(html.includes(town.name.toLowerCase()),town.url);
  assert.ok(html.includes('sin luz')||html.includes('corte de luz')||html.includes('apagón'),town.url);
  assert.ok(html.includes('vivienda')||html.includes('piso')||html.includes('casa'),town.url);
  assert.ok(html.includes('/guias/alarma-vivienda-cerrada-sin-luz/'),town.url);
 }
});


test('Frase SEO exacta de pisos vacíos y sin luz está presente',async()=>{
 const {localVacantPowerIntent}=await import('../src/local-variants.mjs');
 const sample=towns.find(t=>t.url==='/burgos/lerma/')||towns[0];
 const html=localVacantPowerIntent(sample).toLowerCase();
 assert.ok(html.includes('alarma'));
 assert.ok(html.includes('vacía')||html.includes('vacío'));
 assert.ok(html.includes('sin luz')||html.includes('sin suministro')||html.includes('corte de luz'));
});
