import fs from 'node:fs';
import {e} from './lib.mjs';
import {provinces} from './content.mjs';
import {privacySummary} from './legal.mjs';

// Build-time defaults. No customer data is stored by this module.
const defaultSite=JSON.parse(fs.readFileSync(new URL('../config/site.json',import.meta.url),'utf8'));
export const quoteServices=['Alarmas y cámaras','Alarma inalámbrica','Cámaras de seguridad','Revisión o ampliación'];
export const quoteBuildings=['Vivienda','Casa o chalet','Segunda residencia','Comercio o local','Oficina','Nave o almacén','Negocio','Otro'];
const fold=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function quoteLocation(location=''){
 const text=String(location).trim();
 for(const province of provinces){
  if(fold(text)===fold(province.name))return {town:'',province:province.name};
  const suffix=', '+province.name;
  if(fold(text).endsWith(fold(suffix)))return {town:text.slice(0,-suffix.length).trim(),province:province.name};
 }
 return {town:text.slice(0,100),province:''};
}
const options=(values,selected)=>values.map(value=>`<option value="${e(value)}"${value===selected?' selected':''}>${e(value)}</option>`).join('');
export function whatsappForm({site=defaultSite,location='',id='quote'}={}){
 if(!/^[a-z][a-z0-9-]*$/.test(id))throw Error('Identificador de formulario inválido');
 const {town,province}=quoteLocation(location);
 return `<form id="${id}-form" class="whatsapp-quote" data-quote-form hidden aria-describedby="${id}-help" autocomplete="on">
 <p id="${id}-help" class="quote-help">Los campos con * son obligatorios. El nombre y los detalles son opcionales.</p>
 <div class="quote-grid">
 <div class="quote-field"><label for="${id}-service">Servicio que necesitas *</label><select id="${id}-service" name="service" required>${options(quoteServices,quoteServices[0])}</select></div>
 <div class="quote-field"><label for="${id}-building">Tipo de inmueble</label><select id="${id}-building" name="building">${options(quoteBuildings,quoteBuildings[0])}</select></div>
 <div class="quote-field"><label for="${id}-province">Provincia *</label><select id="${id}-province" name="province" autocomplete="address-level1" required><option value="">Selecciona provincia</option>${options(provinces.map(p=>p.name),province)}<option value="Otra provincia">Otra provincia · consultar</option></select></div>
 <div class="quote-field"><label for="${id}-town">Municipio o pueblo *</label><input id="${id}-town" name="town" type="text" value="${e(town)}" required maxlength="100" autocomplete="address-level2" list="${id}-town-options" placeholder="Escribe tu localidad" aria-describedby="${id}-town-help"><datalist id="${id}-town-options"></datalist><small id="${id}-town-help" data-town-help>Puedes indicar también un barrio, pedanía o núcleo.</small></div>
 <div class="quote-field"><label for="${id}-name">Tu nombre <span>(opcional)</span></label><input id="${id}-name" name="customerName" type="text" maxlength="70" autocomplete="name" placeholder="¿Cómo te llamas?"></div>
 <div class="quote-field"><label for="${id}-phone">Teléfono de contacto *</label><input id="${id}-phone" name="phone" type="tel" inputmode="tel" required minlength="9" maxlength="24" autocomplete="tel" placeholder="Tu número de teléfono" aria-describedby="${id}-phone-help"><small id="${id}-phone-help">Número español o internacional con prefijo +.</small></div>
 <div class="quote-field quote-field-wide"><label for="${id}-details">Cuéntanos qué necesitas <span>(opcional)</span></label><textarea id="${id}-details" name="details" rows="3" maxlength="600" placeholder="Por ejemplo: alarma para una casa y dos cámaras en los accesos." aria-describedby="${id}-details-help"></textarea><small id="${id}-details-help">Máximo 600 caracteres. No incluyas contraseñas, códigos de alarma ni horarios de ausencia.</small></div>
 </div>
 <details class="quote-preview"><summary>Ver el mensaje antes de continuar <span aria-hidden="true">+</span></summary><pre data-quote-preview></pre></details>
 ${privacySummary(site)}
 <button type="submit" class="button button-whatsapp quote-send" data-whatsapp="${e(site.whatsapp)}">Continuar en WhatsApp <span aria-hidden="true">↗</span></button>
 <p class="quote-help">Se abrirá WhatsApp con los datos del formulario. Revisa el mensaje y pulsa Enviar allí. Esta web no lo envía automáticamente.</p>
 <p class="quote-status" role="status" aria-live="polite" data-quote-status></p>
 </form><noscript><p>Para preparar el mensaje, activa JavaScript o <a href="https://wa.me/${e(site.whatsapp)}" rel="noopener noreferrer">escríbenos directamente por WhatsApp</a>. También puedes <a href="tel:${e(site.tel)}">llamarnos</a>.</p></noscript>`;
}
export function whatsappSection(location=''){
 return `<section class="wrap quote-section" id="presupuesto-whatsapp" aria-labelledby="quote-section-title"><div class="quote-intro"><p class="eyebrow">PRESUPUESTO POR WHATSAPP</p><h2 id="quote-section-title">Cuéntanos qué<br><span>quieres proteger.</span></h2><p>${location?'Prepara tu consulta para '+e(location)+'.':'Elige el servicio y dinos dónde necesitas la instalación.'} Sin necesidad de conocer los modelos.</p><div class="quote-benefit"><span aria-hidden="true">✓</span>Servicio y ubicación, en un solo mensaje.</div><div class="quote-benefit"><span aria-hidden="true">✓</span>Trato directo con el técnico.</div><p class="quote-conditions">La disponibilidad, la visita y las condiciones se confirman antes de concertar el trabajo.</p></div><div class="quote-form-card">${whatsappForm({location})}</div></section>`;
}
