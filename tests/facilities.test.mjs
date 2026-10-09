import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {facilities,localContexts,facilityPage,facilitiesPage,facilitySection,municipalContext,facilityUrl,quoteFor,validateFacilities} from '../src/facilities.mjs';
import {townsFrom,approvedLocal,e} from '../src/lib.mjs';
import {townPage} from '../src/views.mjs';
const towns=townsFrom(JSON.parse(fs.readFileSync('data/municipios.json','utf8')).municipalities);
const plain=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
test('Soluciones: cinco páginas útiles y segunda residencia sin URL competidora',()=>{
 validateFacilities(towns);assert.equal(facilities.length,5);
 assert.equal(new Set(facilities.map(facilityUrl)).size,5);
 for(const f of facilities){
  const h=facilityPage(f);assert.equal((h.match(/<h1>/g)||[]).length,1);
  assert.ok(plain(h).split(' ').length>420,f.slug);
  assert.ok(h.includes('Referencia')||h.includes('referencia'));
  for(const [title,src] of f.sources){assert.ok(title);assert.ok(src.startsWith('https://'));assert.ok(h.includes(e(src)));}
  assert.equal((h.match(/<img /g)||[]).length,1);assert.ok(h.includes('loading="eager"'));
  assert.ok(h.includes('/soluciones/'));assert.ok(!h.includes('AggregateRating'));
 }
 const index=facilitiesPage();assert.ok(index.includes('/guias/seguridad-segunda-residencia/'));
 assert.ok(!index.includes('/soluciones/segunda-residencia/'));
});
test('Municipios: seis opciones en HTML y continuidad de localidad, sin nuevas combinaciones de URL',()=>{
 for(const t of towns){
  const h=townPage(t,[],null);
  assert.equal((h.match(/class="facility-choice"/g)||[]).length,6,t.url);
  assert.ok(h.includes('id="por-inmueble"'),t.url);
  const matches=[...h.matchAll(/href="(\/contacto\/\?[^\"]*inmueble[^\"]*)"/g)];assert.equal(matches.length,6,t.url);
  for(const [,raw] of matches){const u=new URL(raw.replaceAll('&amp;','&'),'https://example.invalid');assert.equal(u.searchParams.get('pueblo'),`${t.name}, ${t.province.name}`);assert.ok(u.searchParams.get('inmueble'));}
 }
});
test('Seis contextos municipales trazables no aprueban indexación ni inventan cobertura',()=>{
 assert.equal(Object.keys(localContexts).length,6);
 const hashes=new Set();
 for(const [id,c] of Object.entries(localContexts)){
  const t=towns.find(t=>t.id===id);assert.equal(c.name,t.name);assert.equal(c.provinceId,t.province.id);
  const h=municipalContext(t);assert.ok(h.includes('Fuente municipal'));assert.ok(h.includes(e(c.source)));assert.ok(h.includes('no acreditan un trabajo realizado'));
  assert.ok(!approvedLocal(c));hashes.add(plain(h).replaceAll(t.name,'[LOCAL]'));
 }
 assert.equal(hashes.size,6);
 const other=towns.find(t=>!localContexts[t.id]);assert.equal(municipalContext(other),'');
 assert.deepEqual(JSON.parse(fs.readFileSync('config/local-content.json','utf8')).approved,{});
 assert.equal(JSON.parse(fs.readFileSync('config/site.json','utf8')).mode,'preview');
 const t=towns.find(t=>localContexts[t.id]);assert.throws(()=>municipalContext({...t,name:'Otra localidad'}));
});
test('Escape de campos y tipos de inmueble en el preparador',()=>{
 const t={name:'Pueblo <script>',province:{name:'Provincia & región'}};
 const h=facilitySection(t);assert.ok(h.includes('Pueblo &lt;script&gt;'));assert.ok(!h.includes('Pueblo <script>'));
 const u=new URL(quoteFor(facilities[1],t),'https://example.invalid');assert.equal(u.searchParams.get('inmueble'),'Casa o chalet');
 const js=fs.readFileSync('public/app.js','utf8');assert.ok(js.includes('option.value===building'));
 assert.ok(!js.includes('innerHTML'));
});
