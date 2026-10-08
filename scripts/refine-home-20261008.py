"""Migración explícita e idempotente de la revisión aprobada. No forma parte del build."""
from pathlib import Path

def replace(path,old,new):
    p=Path(path);s=p.read_text()
    if new in s:return
    if s.count(old)!=1:raise ValueError(f'Esperada una coincidencia en {path}: {old[:80]}')
    p.write_text(s.replace(old,new,1))

replace('src/security.mjs',"['01 / SIN CABLES','Radio propia. No el Wi-Fi de casa.','Los detectores Ajax Jeweller se comunican con la central mediante radio bidireccional cifrada. Para enviarte avisos al móvil, la central utiliza sus conexiones a Internet. Son dos comunicaciones distintas.','radio-jeweller']", "['01 / ALARMAS INALÁMBRICAS','Instalación discreta. Protección profesional.','Protege puertas, ventanas y zonas de paso con detectores inalámbricos Ajax. Diseñamos una instalación cuidada, sin tender cables entre cada detector y la central, adaptada a tu vivienda o negocio.','radio-jeweller']")
replace('src/views.mjs',"import {homeKnowledge,ajaxKnowledge,serviceKnowledge} from './security.mjs';", "import {homeKnowledge,ajaxKnowledge,serviceKnowledge} from './security.mjs';\nimport {trustSection,footerSummary} from './trust.mjs';")
replace('src/views.mjs',"width=\"${file==='ajax-kit.jpg'?800:1000}\" height=\"${file==='ajax-kit.jpg'?800:1000}\"", "width=\"${file==='ajax-kit.jpg'?800:file==='ajax-bulletcam.webp'?600:1000}\" height=\"${file==='ajax-kit.jpg'?800:file==='ajax-bulletcam.webp'?600:1000}\"")
replace('src/views.mjs','class="floating-product">${cam()}','class="floating-product">${icon(\'camera\')}')
replace('src/views.mjs',"${link('/alarmas/','Descubrir alarmas')}</div>${kit()}</article>","${link('/alarmas/','Descubrir alarmas')}</div>${photo('ajax-keypad-touchscreen.webp','Teclado Ajax KeyPad TouchScreen Jeweller blanco')}</article>")
replace('src/views.mjs',"${link('/camaras/','Descubrir cámaras')}</div>${cam()}</article>","${link('/camaras/','Descubrir cámaras')}</div>${photo('ajax-bulletcam.webp','Cámara de seguridad Ajax BulletCam negra')}</article>")
replace('src/views.mjs',' ${coverageSection(towns)}${questions()}',' ${trustSection()}\n ${coverageSection(towns)}${questions()}')
replace('src/views.mjs','<footer class="site-footer"><div class="wrap footer-top">','<footer class="site-footer">${footerSummary(site,services.length,provinces.length,site.directoryCount)}<div class="wrap footer-top">')
replace('scripts/build.mjs',"for(const [id,entry] of Object.entries(locals.approved))", "site.directoryCount=towns.length;\nfor(const [id,entry] of Object.entries(locals.approved))")
css='''
/* Revisión visual: cada fotografía aparece una sola vez en portada. */
.floating-product>.icon:first-child{width:35px;height:35px;color:var(--blue);margin:10px 4px}
.solution-card>img[src$="ajax-keypad-touchscreen.webp"]{width:80%;height:310px;margin-bottom:12px;object-fit:contain}
.solution-card>img[src$="ajax-bulletcam.webp"]{width:93%;height:310px;margin-bottom:12px;object-fit:contain}
.trust-heading{text-align:center;max-width:800px;margin:0 auto 42px}.trust-heading>p:last-child{font-size:15px;margin-top:22px}
.trust-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:26px}
.trust-grid article{border-top:1px solid var(--line);padding-top:23px}.trust-star{width:31px;height:31px;fill:#f4bd43;stroke:#b1790b;stroke-width:1.1;margin-bottom:19px;display:block}
.trust-grid h3{font-size:22px;line-height:1.2}.trust-grid p{font-size:13px;line-height:1.7;margin-top:14px}
.footer-summary{display:flex;justify-content:space-between;align-items:center;gap:45px;padding-block:45px;border-bottom:1px solid var(--line)}
.footer-summary>div>p{font-size:12px}.footer-direct-phone{display:block;font-size:clamp(30px,3.3vw,46px);font-weight:650;letter-spacing:-.04em;line-height:1.2;margin:9px 0 12px}
.footer-whatsapp{font-size:13px;color:var(--wa);font-weight:600}.footer-figures{display:flex;gap:50px;margin:0}.footer-figures>div{display:flex;flex-direction:column-reverse;gap:7px;max-width:180px}
.footer-figures dd{margin:0;font-size:clamp(27px,3vw,40px);letter-spacing:-.04em;line-height:1.2;font-weight:630}.footer-figures dt{font-size:12px;line-height:1.5;color:var(--muted)}
@media(max-width:900px){.trust-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:25px}.footer-summary{gap:28px}.footer-figures{gap:28px}.footer-figures>div{max-width:140px}}
@media(max-width:600px){.solution-card>img[src$="ajax-keypad-touchscreen.webp"],.solution-card>img[src$="ajax-bulletcam.webp"]{height:250px}.trust-heading{text-align:left;margin-bottom:30px}.trust-grid{grid-template-columns:1fr;gap:22px}.trust-grid article{display:grid;grid-template-columns:36px 1fr;gap:9px 14px;padding-top:20px}.trust-star{grid-row:1/3;width:28px;height:28px;margin:0}.trust-grid h3{font-size:24px}.trust-grid p{grid-column:2;margin:0;font-size:13px}.footer-summary{display:block;padding-block:35px}.footer-direct-phone{font-size:36px}.footer-figures{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:29px}.footer-figures dd{font-size:29px}.footer-figures dt{font-size:10px}}
'''
p=Path('public/enhancements.css')
if 'Revisión visual: cada fotografía' not in p.read_text():p.write_text(p.read_text()+css)
unit='''

test('Portada sin fotos repetidas y con compromisos, no reseñas inventadas',async()=>{
 const {home}=await import('../src/views.mjs');const html=home(townsFrom(records));
 const images=[...html.matchAll(/<img[^>]+src="([^\"]+)"/g)].map(m=>m[1]);
 assert.equal(images.length,4);assert.equal(new Set(images).size,images.length);
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
'''
p=Path('tests/site.test.mjs')
if 'Portada sin fotos repetidas' not in p.read_text():p.write_text(p.read_text()+unit)
replace('tests/browser.py',"        checks.append(f'{width}px: proporción original, kit sin superposición, 19 provincias y 114 enlaces OK')", "        photos = page.locator('main img').evaluate_all(\"els => els.map(el => el.getAttribute('src'))\")\n        assert len(photos) == 4 and len(set(photos)) == 4, photos\n        assert page.locator('.trust-star').count() == 5\n        assert page.locator('[data-stat=municipalities]').inner_text() == '3.797'\n        assert page.locator('[data-stat=services]').inner_text() == '4'\n        checks.append(f'{width}px: proporción, 4 fotos distintas, compromisos, totales y cobertura OK')")
print('Cambios de fotografías, texto, compromisos y pie aplicados.')
