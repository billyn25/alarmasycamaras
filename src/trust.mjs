import {e} from './lib.mjs';
const star='<svg class="trust-star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.78 5.63 6.22.91-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91Z"/></svg>';
export function trustSection(){
 const commitments=[['Asesoramiento directo','Hablas con el técnico que después realiza la instalación.'],['Instalación','Equipos bien ubicados y una instalación cuidada.'],['Configuración','Usuarios, permisos y funcionamiento explicados.'],['Pruebas','El técnico comprueba detección, avisos y grabación según el proyecto.'],['Trato directo','Sin centralitas comerciales: contacto directo con el técnico instalador.']];
 return `<section class="section wrap trust-section" aria-labelledby="trust-title"><div class="trust-heading"><p class="eyebrow">CINCO COMPROMISOS EN CADA INSTALACIÓN</p><h2 id="trust-title">La confianza se gana.<br><span class="muted">En cada detalle.</span></h2><p>Del primer consejo a la puesta en marcha, el trato es directo con el técnico instalador.</p></div><div class="trust-grid">${commitments.map(([title,text])=>`<article>${star}<h3>${e(title)}</h3><p>${e(text)}</p></article>`).join('')}</div></section>`;
}
export function footerSummary(site,serviceCount,provinceCount,municipalityCount){
 for(const value of [serviceCount,provinceCount,municipalityCount])if(!Number.isSafeInteger(value)||value<1)throw Error('Totales del pie no calculados');
 const count=new Intl.NumberFormat('es-ES',{useGrouping:true,minimumGroupingDigits:1}).format(municipalityCount);
 return `<div class="wrap footer-summary"><div><p>Trato directo con el técnico</p><a class="footer-direct-phone" href="tel:${e(site.tel)}">${e(site.phone)}</a><a class="footer-whatsapp" href="https://wa.me/${e(site.whatsapp)}" rel="noopener noreferrer">Consultar por WhatsApp <span aria-hidden="true">↗</span></a></div><dl class="footer-figures"><div><dt>Servicios</dt><dd data-stat="services">${serviceCount}</dd></div><div><dt>Provincias</dt><dd data-stat="provinces">${provinceCount}</dd></div><div><dt>Municipios en el directorio</dt><dd data-stat="municipalities">${count}</dd></div></dl></div>`;
}
