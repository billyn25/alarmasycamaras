import {facilities,localContexts} from '../src/facilities.mjs';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {townsFrom,e} from '../src/lib.mjs';
import {townPage} from '../src/views.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const pages=read('.cache/pages.json'),site=read('config/site.json'),local=read('config/local-content.json');
const towns=townsFrom(read('data/municipios.json').municipalities);
const plain=html=>html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const count=t=>t.split(/\s+/).filter(Boolean).length;
const families=new Map();
for(const t of towns){let text=plain(townPage(t,[],null));for(const value of [e(t.name),e(t.province.name)].sort((a,b)=>b.length-a.length))text=text.split(value).join('[UBICACION]');const hash=crypto.createHash('sha256').update(text).digest('hex');families.set(hash,(families.get(hash)||0)+1);}
const details=pages.filter(p=>!p.townId).map(p=>{const html=fs.readFileSync('dist/'+p.file,'utf8');const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||'';return {url:p.url,words:count(plain(main)),titleCharacters:plain(html.match(/<title>(.*?)<\/title>/)?.[1]||'').length,descriptionCharacters:p.description.length};});
const townMeta=pages.filter(p=>p.townId);const metaStats={uniqueTitles:new Set(townMeta.map(p=>p.title)).size,uniqueDescriptions:new Set(townMeta.map(p=>p.description)).size,titleOver70:townMeta.filter(p=>p.title.length>70).length,descriptionOver170:townMeta.filter(p=>p.description.length>170).length};
const report={reviewedAt:'2026-10-09',scope:'HTML generado completo y plantillas; no es un informe de posiciones ni de Search Console',pages:pages.length,municipalities:towns.length,approvedLocalities:Object.keys(local.approved).length,guides:pages.filter(p=>p.guide).length,facilityPages:facilities.length,municipalContexts:Object.keys(localContexts).length,contextScope:'Contexto municipal público; no acredita atención, obras ni aprobación para indexación.',mode:site.mode,holder:site.legal.holder,metaStats,
 localTemplate:{note:'Las páginas combinan bloques editoriales estables por municipio. La variación evita clones literales pero no sustituye cobertura ni hechos locales verificados.',normalizedFamilies:families.size,largestFamily:Math.max(...families.values())},
 priorities:[
 {priority:'SEO local',topic:'Contenido municipal',status:'publicable',detail:`Los ${towns.length} municipios tienen contenido editorial variable, metadatos locales, enlaces internos, soluciones por inmueble, cámaras multimarca, guías y CTA. Los contextos públicos verificados añaden profundidad extra cuando existen, pero no bloquean la indexación.`},
 {priority:'Antes de publicar comercialmente',topic:'Identificación del titular',status:'pendiente',detail:'R.F.G. confirmado. Identificación completa, NIF, domicilio y correo no facilitados. No se marca ready.legal=true ni se certifica cumplimiento con las iniciales.'},
 {priority:'Publicación',topic:'Dominio y Search Console',status:'preparado',detail:'Dominio definitivo configurado en alarmasycamarasrapid.com. Canonical y redirecciones se validan contra ese origen. En producción se generan sitemap principal y 19 sitemaps provinciales con todas las URLs indexables.'},
 {priority:'Antes de publicar comercialmente',topic:'Oferta, cobertura y fotografías',status:'pendiente',detail:'Confirmar flags de contacto, cobertura, oferta y permisos de imágenes; no hay oficinas o reseñas ficticias.'},
 {priority:'Mejora de contenido',topic:'Fichas multimarca y guías CCTV',status:'ampliadas',detail:'Fichas de cámaras ampliadas y siete guías editoriales, incluidas cámaras exteriores, NVR/almacenamiento y 4G/solar. Falta evidencia fotográfica propia y confirmar referencias disponibles.'},
 {priority:'Confianza comercial',topic:'Pruebas del trabajo',status:'pendiente',detail:'Añadir fotografías de instalaciones propias autorizadas, referencias y testimonios reales cuando se aporten. Estrellas actuales: compromisos, no valoraciones.'}
 ],details};
fs.writeFileSync('.cache/content-seo-report.json',JSON.stringify(report,null,2));
console.log(`CONTENT AUDIT: ${report.guides} guías; ${report.approvedLocalities}/${report.municipalities} localidades aprobadas; pendientes documentados.`);
