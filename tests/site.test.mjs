import './cookies-brands.test.mjs';
import './editorial.test.mjs';
import './facilities.test.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {e,slug,cleanName,townsFrom,runtime,approvedLocal} from '../src/lib.mjs';
import {provinces,brands,services} from '../src/content.mjs';
const site=JSON.parse(fs.readFileSync('config/site.json','utf8')),records=JSON.parse(fs.readFileSync('data/municipios.json','utf8')).municipalities;
test('Escape HTML de contenido y atributos',()=>assert.equal(e('<x a="1">&\''),'&lt;x a=&quot;1&quot;&gt;&amp;&#39;'));
test('Rutas sin tildes y artículos conservados',()=>{assert.equal(slug('Las Rozas de Madrid'),'las-rozas-de-madrid');assert.equal(cleanName('Rozas de Madrid, Las'),'Las Rozas de Madrid');assert.equal(slug('Agurain/Salvatierra'),'agurain-salvatierra');assert.equal(slug('Ávila'),'avila');});
test('19 provincias y seis marcas',()=>{assert.equal(provinces.length,19);assert.equal(brands.length,6);assert.equal(services.length,4);assert.equal(new Set(provinces.map(p=>p.slug)).size,19);});
test('Inventario municipal íntegro y rutas únicas',()=>{const towns=townsFrom(records);assert.equal(towns.length,3797);assert.equal(new Set(towns.map(t=>t.url)).size,towns.length);assert.ok(towns.some(t=>t.url==='/burgos/lerma/'));assert.ok(towns.some(t=>t.url==='/bizkaia/zalla/'));});
test('Rechaza códigos municipales duplicados',()=>assert.throws(()=>townsFrom([records[0],records[0]]),/duplicado/));
test('Rechaza provincia y código incoherentes',()=>assert.throws(()=>townsFrom([{id:'01001',province:'09',name:'Prueba'}]),/inválido/));
test('Preview por defecto sin dominio inventado',()=>assert.deepEqual(runtime(site,{}),{production:false,base:''}));
test('No se activa producción con datos pendientes',()=>assert.throws(()=>runtime(site,{SITE_MODE:'production'}),/pendiente/));
test('Una preview de rama nunca hereda producción',()=>assert.equal(runtime(site,{SITE_MODE:'production',CONTEXT:'deploy-preview',DEPLOY_PRIME_URL:'https://revision.netlify.app'}).production,false));
test('Valida origen de la URL',()=>assert.throws(()=>runtime(site,{URL:'https://revision.netlify.app/ruta'}),/origen/));
test('Producción usa el dominio definitivo y rechaza hosts de revisión',()=>{const ready=structuredClone(site);for(const k of Object.keys(ready.ready))ready.ready[k]=true;for(const k of Object.keys(ready.legal))ready.legal[k]='Dato de prueba';assert.equal(runtime(ready,{SITE_MODE:'production'}).base,'https://alarmasycamarasrapid.com');assert.throws(()=>runtime(ready,{SITE_MODE:'production',SITE_URL:'https://revision.netlify.app'}),/Dominio/);assert.equal(runtime(ready,{SITE_MODE:'production',SITE_URL:'https://alarmasycamarasrapid.com'}).production,true);});
test('No se aprueba una página local vacía',()=>{assert.equal(approvedLocal(null),false);assert.equal(approvedLocal({approved:true}),false);assert.equal(approvedLocal({approved:true,reviewedAt:'2026-10-08',source:'Registro verificado de cobertura',blocks:[{title:'Datos del servicio',text:'Contenido comprobado. '.repeat(12)},{title:'Condiciones de la visita',text:'Información comprobada. '.repeat(12)}]}),true);});

test('Cobertura en portada: 19 provincias y 114 localidades de su propia provincia',async()=>{
 const {coverageSection,featuredByProvince}=await import('../src/coverage.mjs');
 const towns=townsFrom(records),html=coverageSection(towns);
 assert.equal((html.match(/class="coverage-province"/g)||[]).length,19);
 assert.equal((html.match(/<li><a href=/g)||[]).length,114);
 assert.equal(Object.keys(featuredByProvince).length,19);
 for(const province of provinces){
  const names=featuredByProvince[province.slug];assert.equal(new Set(names).size,6);
  for(const name of names){const town=towns.find(t=>t.province.id===province.id&&t.name===name);assert.ok(town);assert.ok(html.includes(`href="${town.url}"`));}
  assert.ok(html.includes('Ver todos los municipios de '+e(province.name)));
 }
 assert.throws(()=>coverageSection(towns.filter(t=>t.name!=='Lerma')),/Lerma/);
});
test('Contenido Ajax diferenciado, fuentes oficiales y sin promesas absolutas',async()=>{
 const {technicalSources,homeKnowledge,ajaxKnowledge,serviceKnowledge}=await import('../src/security.mjs');
 for(const source of Object.values(technicalSources))assert.equal(new URL(source.url).hostname,'ajax.systems');
 const detail=ajaxKnowledge();for(const id of ['radio-jeweller','luz-e-internet','modo-noche','fotoverificacion','mascotas','video-compatible'])assert.ok(detail.includes(`id="${id}"`));
 assert.ok(homeKnowledge().includes('/marcas/ajax/#luz-e-internet'));
 assert.ok(detail.includes('no alimenta automáticamente'));
 assert.ok(detail.includes('no se atribuyen al MotionCam estándar'));
 assert.ok(!/100\s*%\s*segur|imposible de inhibir|la más segura del mercado/i.test(detail));
 for(const service of services)assert.ok(serviceKnowledge(service.slug).includes('practical-grid'));
 assert.ok(serviceKnowledge('alarmas-y-camaras').includes('id="fotos-directo-grabacion"'));
 assert.equal(serviceKnowledge('desconocido'),'');
});


test('Portada sin fotos repetidas y con compromisos, no reseñas inventadas',async()=>{
 const {home}=await import('../src/views.mjs');const html=home(townsFrom(records));
 const images=[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(images.length>=7);assert.equal(new Set(images).size,images.length);
 assert.equal((html.match(/class="trust-star"/g)||[]).length,5);
 assert.ok(!/AggregateRating|reviewCount|ratingValue/.test(html));
 assert.ok(html.includes('Instalación discreta. Protección profesional.'));
 assert.ok(!html.includes('Radio propia. No el Wi-Fi de casa.'));
});
test('Totales del pie calculados y teléfono clicable',async()=>{
 const {footerSummary}=await import('../src/trust.mjs');const html=footerSummary(site,services.length,provinces.length,records.length);
 assert.ok(html.includes('href="tel:'+site.tel+'"'));assert.ok(html.includes('data-stat="services">4'));
 assert.ok(html.includes('data-stat="provinces">19'));assert.ok(html.includes('3.797'));
 assert.throws(()=>footerSummary(site,4,19,undefined),/Totales/);
});

import './local-media.test.mjs';

import './quote-form.test.mjs';

import './multibrand.test.mjs';

import './local-variants.test.mjs';
