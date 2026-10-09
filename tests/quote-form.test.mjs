import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {whatsappForm,quoteLocation,quoteServices,quoteBuildings} from '../src/quote-form.mjs';
import {home,townPage,contactPage,servicePage} from '../src/views.mjs';
import {townsFrom} from '../src/lib.mjs';
import {services,provinces} from '../src/content.mjs';
const site=JSON.parse(fs.readFileSync('config/site.json','utf8'));
const towns=townsFrom(JSON.parse(fs.readFileSync('data/municipios.json','utf8')).municipalities);
test('Formulario único con servicio, provincia, municipio, nombre, teléfono y detalles',()=>{
 const html=whatsappForm({site,location:'Lerma, Burgos'});
 for(const name of ['service','province','town','customerName','phone','building','details'])assert.equal((html.match(new RegExp(`name="${name}"`,'g'))||[]).length,1,name);
 assert.ok(html.includes('type="tel"'));assert.ok(html.includes('autocomplete="tel"'));
 assert.ok(html.includes('data-whatsapp="'+site.whatsapp+'"'));
 for(const p of provinces)assert.ok(html.includes(`value="${p.name}"`));
 assert.equal(quoteServices.length,4);assert.equal(quoteBuildings.length,8);
 assert.ok(html.includes('data-quote-preview'));assert.ok(html.includes('Responsable: R.F.G.'));
 assert.ok(html.includes('<noscript>'));assert.ok(!html.includes('data-netlify'));
});
test('Ubicación rellenada desde servidor y escape de datos',()=>{
 assert.deepEqual(quoteLocation('Lerma, Burgos'),{town:'Lerma',province:'Burgos'});
 assert.deepEqual(quoteLocation('Burgos'),{town:'',province:'Burgos'});
 assert.deepEqual(quoteLocation('Zalla, Bizkaia'),{town:'Zalla',province:'Bizkaia'});
 const html=whatsappForm({location:'<script>alert(1)</script>'});assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));
 assert.throws(()=>whatsappForm({id:'bad"'}));
});
test('Formulario en todas las localidades y sin modificar fotos ni títulos SEO',()=>{
 for(const t of towns){const html=townPage(t,[],null);assert.equal((html.match(/data-quote-form/g)||[]).length,1,t.url);assert.ok(html.includes(`value="${t.province.name}" selected`),t.url);assert.equal((html.match(/<img /g)||[]).length,4,t.url);}
 assert.equal((home(towns).match(/data-quote-form/g)||[]).length,1);
 assert.equal((contactPage(site).match(/data-quote-form/g)||[]).length,1);
 for(const s of services)assert.equal((servicePage(s).match(/data-quote-form/g)||[]).length,1,s.slug);
});
test('Sin almacén ni envío de clientes a un servidor propio y privacidad actualizada',()=>{
 const js=fs.readFileSync('public/quote-form.js','utf8');assert.ok(!/localStorage|sessionStorage|sendBeacon|innerHTML|fetch\([^)]*wa\.me/.test(js));
 assert.ok(js.includes('encodeURIComponent(message())'));assert.ok(js.includes('event.preventDefault()'));
 assert.ok(fs.readFileSync('src/legal.mjs','utf8').includes('teléfono de contacto que introduces'));
 assert.equal(site.mode,'preview');assert.deepEqual(JSON.parse(fs.readFileSync('config/local-content.json','utf8')).approved,{});
});
