import fs from 'node:fs';
import {e,cleanName} from './lib.mjs';

// Shared technical guidance is deliberately separate from sourced municipal context.
export const facilities=JSON.parse(fs.readFileSync(new URL('../data/facilities.json',import.meta.url),'utf8'));
export const localContexts=JSON.parse(fs.readFileSync(new URL('../data/local-context.json',import.meta.url),'utf8'));
export const facilityUrl=f=>`/soluciones/${f.slug}/`;
const seasonal={slug:'segunda-residencia',label:'Segundas residencias',building:'Segunda residencia',url:'/guias/seguridad-segunda-residencia/',brief:'Conexión, alimentación y avisos cuando no estás. Planificamos cómo comprobar el estado de la casa y revisar un evento.',alarm:'Accesos y detección interior con avisos a las personas autorizadas. Se estudian batería de la central y vías de conexión según el equipo.',video:'Distinguir fotografías de alarma, consulta en directo y archivo. Cámaras y grabador requieren su propia previsión de alimentación.',tradeoff:'Una SIM o la nube pueden tener gastos. Sin cuota obligatoria de alarma no significa que cualquier servicio adicional sea gratuito.'};
const types=[facilities[0],facilities[1],seasonal,...facilities.slice(2)];
const destination=f=>f.url||facilityUrl(f);
export const quoteFor=(f,town)=>'/contacto/?'+new URLSearchParams({...(town?{pueblo:`${town.name}, ${town.province.name}`} :{}),inmueble:f.building}).toString();

export function validateFacilities(towns){
 const ids=new Map(towns.map(t=>[t.id,t]));
 const slugs=new Set();
 for(const f of facilities){
  if(!/^[a-z0-9-]+$/.test(f.slug)||slugs.has(f.slug)||!f.label||!f.building||f.blocks.length<4||f.faq.length<2)throw Error('Solución incompleta o duplicada: '+f.slug);
  slugs.add(f.slug);
  if(!fs.existsSync(new URL('../public/assets/'+f.image,import.meta.url)))throw Error('Imagen de solución ausente: '+f.image);
  for(const [label,url] of f.sources)if(!label||!url.startsWith('https://'))throw Error('Fuente de solución inválida');
 }
 for(const [id,c] of Object.entries(localContexts)){
  const t=ids.get(id);
  if(!t||cleanName(c.name)!==t.name||c.provinceId!==t.province.id||!/^\d{4}-\d{2}-\d{2}$/.test(c.reviewedAt)||c.decisions.length<2||!c.source.startsWith('https://'))throw Error('Contexto municipal inválido: '+id);
  if(c.type!=='public-context-not-service-verification')throw Error('No confundir contexto público con servicio confirmado');
 }
}

export function facilitySection(town=null){
 const heading=town?`Seguridad para tu inmueble en ${e(town.name)}.`:'Tu espacio marca la diferencia.';
 return `<section class="section wrap facility-selector" id="por-inmueble" aria-labelledby="facility-title"><div class="section-heading"><div><p class="eyebrow">SOLUCIONES SEGÚN EL INMUEBLE</p><h2 id="facility-title">${heading}</h2></div><p>${town?'Elige el tipo de espacio para preparar la consulta. Estas son decisiones de diseño, no un kit cerrado ni una medición de tu inmueble.':'Una casa con jardín no se protege igual que una tienda. Elige tu espacio y descubre qué conviene revisar.'}</p></div>${town?`<div class="facility-choices">${types.map((f,i)=>`<details class="facility-choice"><summary><span class="facility-index" aria-hidden="true">0${i+1}</span><span><strong>${e(f.label)}</strong><span class="facility-brief">${e(f.brief)}</span></span><span class="facility-plus" aria-hidden="true">+</span></summary><div class="facility-answer"><div><h3>Detección de intrusión</h3><p>${e(f.alarm)}</p></div><div><h3>Vídeo y comprobación</h3><p>${e(f.video)}</p></div><p class="facility-tradeoff"><strong>Para elegir bien.</strong> ${e(f.tradeoff)}</p><div class="facility-links"><a class="text-link" href="${destination(f)}">Ver solución completa <span aria-hidden="true">→</span></a><a class="text-link" href="${e(quoteFor(f,town))}">Consultar para este inmueble <span aria-hidden="true">→</span></a></div></div></details>`).join('')}</div>`: `<div class="facility-grid">${types.map((f,i)=>`<article><span class="facility-index" aria-hidden="true">0${i+1}</span><h3>${e(f.label)}</h3><p>${e(f.brief)}</p><a class="text-link" href="${destination(f)}">Ver solución <span aria-hidden="true">→</span></a></article>`).join('')}</div>`}<p class="facility-note">Los equipos, el grado de seguridad, la integración y los servicios se concretan según el proyecto. Las soluciones para locales y naves requieren su propia evaluación.</p>${town?'<a class="text-link" href="/soluciones/">Comparar tipos de inmueble <span aria-hidden="true">→</span></a>':''}</section>`;
}

export function municipalContext(t){
 const c=localContexts[t.id];
 if(!c)return '';
 if(cleanName(c.name)!==t.name||c.provinceId!==t.province.id)throw Error('Contexto de otro municipio');
 return `<section class="section wrap municipal-context" aria-labelledby="municipal-context-title"><p class="eyebrow">PREPARAR UNA INSTALACIÓN EN ${e(t.name)}</p><h2 id="municipal-context-title">${e(c.title)}</h2><p class="municipal-fact">${e(c.fact)} <a href="${e(c.source)}" target="_blank" rel="noopener noreferrer">Fuente municipal <span aria-hidden="true">↗</span></a></p><p class="municipal-intro">${e(c.intro)}</p><div class="municipal-decisions">${c.decisions.map(([h,p])=>`<article><h3>${e(h)}</h3><p>${e(p)}</p></article>`).join('')}</div><details class="municipal-question"><summary>${e(c.question)}</summary><p>${e(c.answer)}</p></details><p class="facility-note">Referencia: ${e(c.sourceLabel)} · Consulta del contexto: <time datetime="${c.reviewedAt}">${c.reviewedAt.split('-').reverse().join('/')}</time>. Los criterios de instalación son orientativos: no acreditan un trabajo realizado ni confirman cobertura o disponibilidad en la dirección concreta.</p></section>`;
}

export function facilitiesPage(){return `<section class="simple-hero wrap"><p class="eyebrow">ALARMAS + VÍDEO + USO DIARIO</p><h1>La protección empieza<br>por tu espacio.</h1><p class="lead">Viviendas, comercios, oficinas y almacenes no necesitan la misma combinación. Te ayudamos a definir qué detectar, qué ver y cómo utilizar el sistema.</p></section>${facilitySection()}<section class="wrap facility-method"><h2>Qué tendrás definido antes de instalar.</h2><p>Accesos y zonas, dispositivos con su referencia, comunicaciones, almacenamiento, usuarios y pruebas de entrega. La oferta autogestionada sin cuota obligatoria no equivale a vigilancia por una central receptora.</p><div class="facility-links"><a class="button" href="/contacto/">Valorar mi instalación</a><a class="text-link" href="/zonas/">Buscar mi municipio →</a><a class="text-link" href="/guias/presupuesto-instalacion/">Comparar presupuestos →</a></div></section>`;}

export function facilityPage(f){
 return `<section class="page-hero wrap facility-hero"><div><p class="eyebrow">SOLUCIONES / ${e(f.label)}</p><h1>${e(f.title)}.</h1><p class="lead">${e(f.lead)}</p><div class="actions"><a class="button" href="${e(quoteFor(f))}">Consultar este proyecto</a><a class="text-link" href="/zonas/">Buscar mi pueblo →</a></div></div><figure class="page-product"><img src="/assets/${f.image}" alt="${e(f.alt)}" width="${f.size}" height="${f.size}" loading="eager" fetchpriority="high" decoding="async"><figcaption>Equipo de referencia. No representa una instalación realizada.</figcaption></figure></section><section class="wrap facility-outline" aria-label="En esta solución">${f.blocks.map(([h],i)=>`<a href="#criterio-${i+1}">${e(h)}</a>`).join('')}</section><article class="wrap facility-article">${f.blocks.map(([h,p],i)=>`<section id="criterio-${i+1}"><p class="eyebrow">0${i+1} / CRITERIO DE INSTALACIÓN</p><h2>${e(h)}</h2><p>${e(p)}</p></section>`).join('')}<aside class="facility-example"><h2>Cómo se convierte en un proyecto.</h2><p>${e(f.example)}</p></aside><section class="facility-checklist"><h2>Qué preparar para la consulta.</h2><ul>${f.checklist.map(x=>`<li>${e(x)}</li>`).join('')}</ul><p>No envíes contraseñas, códigos de alarma ni fechas de ausencia.</p></section><section class="facility-faq"><h2>Dudas sobre ${e(f.label.toLowerCase())}.</h2>${f.faq.map(([q,a])=>`<details><summary>${e(q)}</summary><p>${e(a)}</p></details>`).join('')}</section><aside class="guide-sources"><strong>Referencias y ampliación:</strong> ${f.sources.map(([label,url])=>`<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(label)}</a>`).join(' · ')}. Contenido de planificación redactado para Rapid, no un caso de éxito del fabricante ni una acreditación profesional.</aside><div class="facility-links"><a class="button" href="${e(quoteFor(f))}">Pedir valoración</a><a class="text-link" href="/soluciones/">Otros tipos de inmueble →</a><a class="text-link" href="/alarmas-y-camaras/">Alarma y vídeo integrados →</a></div></article>`;
}
