import {e} from './lib.mjs';

// Existing local product images; never presented as work photographed in a town.
const products = {
  alarmas: {file:'ajax-kit.jpg',size:800,label:'Ajax StarterKit Cam',alt:'Kit de alarma Ajax con central, detector, contacto de apertura y mando'},
  camaras: {file:'ajax-bulletcam.webp',size:600,label:'Ajax BulletCam',alt:'Cámara de seguridad Ajax BulletCam negra'},
  integracion: {file:'ajax-keypad-touchscreen.webp',size:1000,label:'Ajax KeyPad TouchScreen',alt:'Teclado táctil Ajax KeyPad TouchScreen Jeweller'}
};
export function localHeroMedia(){
  return `<figure class="local-photo local-photo-camera"><div class="local-visual-heading"><p class="eyebrow">VIDEOVIGILANCIA AJAX</p><p class="local-visual-title">Cada acceso.<br>Mejor protegido.</p></div><img src="/assets/ajax-turret.jpg" alt="Cámara de videovigilancia Ajax TurretCam blanca" width="1000" height="1000" loading="eager" fetchpriority="high" decoding="async"><div class="local-visual-features"><span>Visión nocturna</span><span>Consulta móvil</span></div><figcaption>Ajax TurretCam · Imagen de producto, no de una instalación local.</figcaption></figure>`;
}
export function localServiceMedia(type){
  const p=products[type];
  if(!p)throw new Error('Tipo de imagen local desconocido: '+type);
  return `<figure class="local-service-media"><img src="/assets/${p.file}" alt="${e(p.alt)}" width="${p.size}" height="${p.size}" loading="lazy" decoding="async"><figcaption>${e(p.label)}</figcaption></figure>`;
}
export function localEcosystem(){
  const options=['Puertas y ventanas','Movimiento PIR','Detectores de cortina','Sirenas','Humo e incendio','Inundación'];
  return `<section class="local-ecosystem wrap" aria-labelledby="local-ecosystem-title"><div><p class="eyebrow">JEWELLER · TECNOLOGÍA INALÁMBRICA AJAX</p><h2 id="local-ecosystem-title">Tu casa cambia.<br><span>Tu protección puede crecer.</span></h2><p>Una alarma no tiene por qué quedarse en un kit. Jeweller conecta la central con dispositivos compatibles mediante radio cifrada y supervisada, sin cables entre detectores y central.</p><a class="button" href="/marcas/ajax/#ecosistema-ajax">Conocer los accesorios Ajax <span aria-hidden="true">→</span></a></div><div class="local-ecosystem-options"><h3>Opciones para tu instalación</h3><ul>${options.map(text=>`<li><span aria-hidden="true">✓</span>${text}</li>`).join('')}</ul><p>Elegimos cada dispositivo según los accesos y el uso del inmueble. Compatibilidad, capacidad del hub y funciones, según modelo. Los detectores de humo e inundación se valoran como protección adicional.</p></div></section>`;
}
export function localUsageGuide(){
  const cards=[
    ['Mientras estás en casa','Podemos configurar el Modo Noche para proteger los detectores seleccionados mientras permaneces dentro. Elegimos contigo qué accesos proteger y qué recorridos necesitas dejar libres.','/marcas/ajax/#modo-noche','Conocer el Modo Noche'],
    ['Cuando falla una conexión','Comprobamos la batería de la central y las vías de comunicación disponibles. La batería del hub no alimenta las cámaras ni el router; el respaldo de esos equipos se estudia aparte.','/marcas/ajax/#luz-e-internet','Prever luz e Internet'],
    ['Cuando necesitas ver qué ocurrió','Las fotos de un detector MotionCam ayudan a comprobar una alarma. Para consultar vídeo en directo o revisar grabaciones hace falta una cámara y el almacenamiento configurado para ese uso.','/alarmas-y-camaras/#fotos-directo-grabacion','Entender fotos y grabación']
  ];
  return `<section class="section wrap local-usage" aria-labelledby="local-usage-title"><div class="section-heading"><div><p class="eyebrow">LA SEGURIDAD EN TU DÍA A DÍA</p><h2 id="local-usage-title">No solo instalar.<br><span class="muted">Dejarlo bien pensado.</span></h2></div><p>Lo que necesitas saber antes de elegir la alarma, las cámaras y la forma de usarlas.</p></div><div class="local-usage-grid">${cards.map(([title,text,url,label])=>`<article><h3>${e(title)}</h3><p>${e(text)}</p><a class="text-link" href="${url}">${e(label)} <span aria-hidden="true">→</span></a></article>`).join('')}</div></section>`;
}
