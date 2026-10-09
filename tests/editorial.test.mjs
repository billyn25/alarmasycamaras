import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {legalPage,privacySummary} from '../src/legal.mjs';
import {guides,guidePage} from '../src/guides.mjs';
import {runtime} from '../src/lib.mjs';
import {structuredData,enrichMetadata} from '../src/metadata.mjs';
const site=JSON.parse(fs.readFileSync('config/site.json','utf8'));
test('Políticas con R.F.G., navegación cruzada y sin identidad inventada',()=>{
 assert.equal(site.legal.holder,'R.F.G.');assert.equal(site.ready.legal,false);
 for(const key of ['taxId','address','contact'])assert.equal(site.legal[key],'');
 for(const kind of ['aviso-legal','privacidad','cookies']){
  const html=legalPage(kind,site);assert.ok(html.includes('R.F.G.'));assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes('aria-current="page"'));assert.ok(!html.includes('pendientes de completar'));
 }
 assert.equal(runtime(site,{SITE_MODE:'production'}).base,'https://camarasyalarmasrapid.com');
});
test('Privacidad antes del botón y sin un consentimiento ficticio',()=>{
 const text=privacySummary(site);assert.ok(text.includes('al continuar, el texto se comunica a WhatsApp'));assert.ok(text.includes('/privacidad/'));
 const js=fs.readFileSync('public/app.js','utf8');assert.ok(!/document\.cookie|localStorage|sessionStorage|sendBeacon/.test(js));
 const cookie=legalPage('cookies',site);assert.ok(cookie.includes('no hay cookies opcionales'));assert.ok(!/Aceptar todas|Rechazar todas/.test(cookie));
});
test('Siete guías diferenciadas, sin precios o testimonios inventados',()=>{
 assert.equal(guides.length,7);assert.equal(new Set(guides.map(g=>g.slug)).size,7);
 for(const g of guides){assert.ok(g.blocks.length>=4);assert.ok(g.blocks.map(b=>b[1]).join(' ').split(/\s+/).length>=280);const html=guidePage(g);assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(html.includes('/contacto/'));assert.ok(html.includes('/guias/'));}
});
test('Datos estructurados reales y apagados en preview',()=>{
 const page={url:'/camaras/',title:'Instalación de cámaras',description:'Cámaras a medida',crumbs:[{name:'Cámaras',url:'/camaras/'}]};
 assert.deepEqual(structuredData(page,site,{production:false,base:'https://preview.netlify.app'}),[]);
 const graph=structuredData(page,site,{production:true,base:'https://rapid-validacion.es'});
 for(const type of ['Organization','WebSite','WebPage','BreadcrumbList','Service'])assert.ok(graph.some(g=>g['@type']===type));
 assert.ok(!JSON.stringify(graph).includes('AggregateRating'));assert.ok(!JSON.stringify(graph).includes('PostalAddress'));
 assert.equal(enrichMetadata(page).image,'ajax-turret.jpg');assert.ok(enrichMetadata(page).description.length<=165);
});
