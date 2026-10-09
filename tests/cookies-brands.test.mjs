import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cookieUI} from '../src/cookie-ui.mjs';
import {cameraBrands,cameraBrandContent,cameraPlanner} from '../src/camera-brands.mjs';
import {legalPage} from '../src/legal.mjs';
import {enrichMetadata} from '../src/metadata.mjs';
const site=JSON.parse(fs.readFileSync('config/site.json','utf8'));
test('Aviso accesible, reapertura y ausencia de consentimiento ficticio',()=>{
 const html=cookieUI();
 for(const marker of ['id="cookie-notice"','id="cookie-dialog"','data-cookie-open','data-cookie-reset','aria-labelledby="cookie-dialog-title"','href="/cookies/"'])assert.ok(html.includes(marker));
 assert.ok(!/Aceptar todas|Rechazar todas|Google Analytics/.test(html));
 const js=fs.readFileSync('public/cookies.js','utf8');
 for(const forbidden of ['localStorage','sessionStorage','sendBeacon','fetch('])assert.ok(!js.includes(forbidden));
 assert.ok(js.includes("name='rapid_cookie_notice'"));assert.ok(js.includes('180*24*60*60'));assert.ok(js.includes('SameSite=Lax'));assert.ok(js.includes('; Secure'));
});
test('Política actualizada a la única cookie de preferencia y borrado real',()=>{
 const html=legalPage('cookies',site);assert.ok(html.includes('rapid_cookie_notice'));assert.ok(html.includes('180 días'));assert.ok(html.includes('Borrar mi elección'));assert.ok(!html.includes('no se muestra un panel'));
 assert.ok(legalPage('privacidad',site).includes('Preferencia de cookies'));
});
test('Cinco marcas ampliadas con contenido original y fuentes primarias',()=>{
 assert.equal(Object.keys(cameraBrands).length,5);
 for(const [slug,b] of Object.entries(cameraBrands)){
  const html=cameraBrandContent(slug);assert.equal((html.match(/<article>/g)||[]).length,3);assert.equal((html.match(/<details>/g)||[]).length,2);
  assert.ok(html.replace(/<[^>]*>/g,' ').split(/\s+/).length>=290,slug);
  assert.ok(b.sources.every(([,u])=>/^https:\/\/(content\.hikvision\.com|www\.dahuasecurity\.com|activity\.dahuasecurity\.com|www\.uniview\.com|www\.nivianhome\.com|www\.ezviz\.com)\//.test(u)));
  assert.ok(html.includes('/contacto/?marca='+slug));assert.ok(!html.includes('AggregateRating'));assert.ok(b.description.length<=165);
  assert.equal(enrichMetadata({url:`/marcas/${slug}/`,description:'base'}).description,b.description);
 }
 assert.equal(cameraBrandContent('ajax'),'');assert.equal(cameraBrandContent('inexistente'),'');
});
test('Orientador de cámaras accesible sin JavaScript y enlaces a las cinco marcas',()=>{
 const html=cameraPlanner();assert.equal((html.match(/<details>/g)||[]).length,3);
 for(const slug of Object.keys(cameraBrands))assert.ok(html.includes(`/marcas/${slug}/`));
 assert.ok(html.includes('/guias/presupuesto-instalacion/'));assert.ok(html.includes('/guias/seguridad-segunda-residencia/'));
});
