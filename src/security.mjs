import {e} from './lib.mjs';

// Texto editorial propio. Prestaciones referidas a modelos compatibles, no a toda la marca.
export const technicalSources = {
 jeweller:{title:'Comunicación Jeweller',url:'https://ajax.systems/es/support/posts/jeweller-radio-protocol/'},
 hub:{title:'Manual de Hub 2',url:'https://ajax.systems/es/support/manuals/hub-2/'},
 power:{title:'Funcionamiento durante un apagón',url:'https://ajax.systems/es/support/posts/how-an-ajax-system-operates-in-case-of-a-power-outage/'},
 night:{title:'Modo Noche',url:'https://ajax.systems/es/support/posts/what-is-night-mode/'},
 motion:{title:'MotionCam Jeweller',url:'https://ajax.systems/es/support/manuals/motioncam/'},
 phod:{title:'MotionCam (PhOD)',url:'https://ajax.systems/es/support/manuals/motioncam-phod/'},
 pets:{title:'Detectores y mascotas',url:'https://ajax.systems/es/blog/what-is-pet-immunity-in-motion-detectors-and-how-to-use-it-correctly/'},
 turret:{title:'Manual de TurretCam',url:'https://ajax.systems/es/support/manuals/turretcam/'},
 hybrid:{title:'Iluminación híbrida TurretCam HL',url:'https://ajax.systems/es/products/turretcam-hl/'},
 nvr:{title:'Manual de NVR',url:'https://ajax.systems/es/support/manuals/nvr/'}
};
const sourceLinks=keys=>`<p class="source-links"><span>Documentación del fabricante:</span> ${keys.map(key=>{
 const s=technicalSources[key];if(!s)throw Error('Fuente desconocida: '+key);
 return `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${e(s.title)} <span aria-hidden="true">↗</span></a>`;
}).join(' · ')}</p>`;
const more=(url,label)=>`<a class="text-link" href="${url}">${e(label)} <span aria-hidden="true">→</span></a>`;

export function homeKnowledge(){
 const cards=[
  ['01 / ALARMAS INALÁMBRICAS','Instalación discreta. Protección profesional.','Protege puertas, ventanas y zonas de paso con detectores inalámbricos Ajax. Diseñamos una instalación cuidada, sin tender cables entre cada detector y la central, adaptada a tu vivienda o negocio.','radio-jeweller'],
  ['02 / ALGO FALLA','¿Se va la luz? Hay que preverlo.','Una central con batería de respaldo puede seguir funcionando durante un corte. Una conexión móvil configurada ofrece otra vía si falla el router. Revisamos batería, cobertura y alimentación de cada equipo.','luz-e-internet'],
  ['03 / ESTÁS EN CASA','Descansa dentro. Protege los accesos.','El Modo Noche permite armar los detectores seleccionados. Podemos plantear la protección de determinadas puertas y ventanas mientras permaneces en casa, sin activar todos los espacios a la vez.','modo-noche'],
  ['04 / RECIBES UN AVISO','Una foto ayuda a entenderlo.','Los detectores MotionCam compatibles pueden acompañar una alarma con fotografías. Sirven para comprobar el evento: no sustituyen a las cámaras destinadas a ver en directo o guardar vídeo.','fotoverificacion']
 ];
 return `<section class="section wrap knowledge-home" aria-labelledby="knowledge-title"><div class="section-heading"><div><p class="eyebrow">TECNOLOGÍA QUE TIENE SENTIDO EN TU DÍA A DÍA</p><h2 id="knowledge-title">No es solo una alarma.<br><span class="muted">Es cómo te protege.</span></h2></div><p>Lo importante no es acumular funciones. Es saber qué hará tu sistema cuando lo necesites.</p></div><div class="knowledge-grid">${cards.map(([k,h,text,id])=>`<article><p class="eyebrow">${k}</p><h3>${h}</h3><p>${text}</p>${more('/marcas/ajax/#'+id,'Entender cómo funciona')}</article>`).join('')}</div><p class="knowledge-note">Funciones según central, detectores y configuración. Consulta en cada apartado los detalles y las fuentes oficiales de Ajax.</p></section>`;
}

export function ajaxKnowledge(){
 const articles=[
  {id:'radio-jeweller',title:'Sin cables entre detectores. Con comunicación supervisada.',text:'Jeweller es la comunicación por radio entre la central y los dispositivos compatibles. Es bidireccional y utiliza cifrado: no necesita el Wi-Fi del router para enlazar cada detector. El acceso remoto es otra parte del sistema y requiere conectividad con el exterior.',advice:'Antes de fijar los equipos, comprobamos señal en sus ubicaciones. Los muros, las distancias y los obstáculos importan; un alcance de catálogo no equivale al alcance dentro de tu vivienda.',sources:['jeweller']},
  {id:'luz-e-internet',title:'Cortes de luz y de Internet: dos situaciones diferentes.',text:'Una central con batería de reserva puede mantenerse encendida al perder la alimentación. Su autonomía depende del modelo, el estado de la batería y la configuración. Para un fallo del router, Hub 2 dispone de Ethernet y dos ranuras SIM: una vía móvil operativa puede ofrecer una conexión alternativa.',advice:'La batería de la central no alimenta automáticamente el router, las cámaras o el grabador. Revisamos qué necesita respaldo. Sin ninguna conexión exterior disponible no debes contar con avisos remotos ni control desde la app. Los datos de la SIM se presupuestan aparte.',sources:['hub','power']},
  {id:'modo-noche',title:'Estar en casa no obliga a dejarlo todo desprotegido.',text:'El Modo Noche arma solamente los detectores elegidos para ese modo. Permite organizar la protección mientras permaneces dentro: por ejemplo, estudiar contactos en accesos sin armar ciertos detectores de movimiento interiores.',advice:'Decidimos contigo qué recorridos deben quedar libres y cómo entrar o salir. No es una configuración idéntica para todas las viviendas: hay que probarla con el uso real de la casa.',sources:['night']},
  {id:'fotoverificacion',title:'MotionCam: fotos del evento, no vídeo continuo.',text:'MotionCam combina detección de movimiento y fotos asociadas a la alarma, consultables desde el historial de eventos. Las versiones MotionCam (PhOD) añaden posibilidades de captura bajo demanda y por determinados escenarios, con la configuración y los permisos correspondientes.',advice:'No confundimos esas fotografías con una cámara CCTV. Para ver en directo, grabar o revisar una secuencia de vídeo, proyectamos videovigilancia y almacenamiento. Las funciones PhOD no se atribuyen al MotionCam estándar.',sources:['motion','phod']},
  {id:'mascotas',title:'¿Tienes mascotas? La colocación importa.',text:'La inmunidad a mascotas depende del detector, su configuración y una instalación correcta. La altura, el campo de visión y los lugares a los que puede subir el animal afectan al resultado; no anunciamos que cualquier mascota sea ignorada en cualquier situación.',advice:'Cuéntanos qué animales viven en casa y por dónde se mueven. Estudiamos la ubicación de los sensores y el uso de contactos de apertura en los accesos, en lugar de prometer cero falsas alarmas.',sources:['pets']},
  {id:'video-compatible',title:'Alarma y vídeo juntos, con compatibilidad comprobada.',text:'El NVR de Ajax permite conectar vídeo Ajax y cámaras IP de terceros mediante ONVIF o RTSP. Que dos equipos pertenezcan a marcas conocidas no basta para asegurar todas las funciones: revisamos referencias, protocolos, red y configuración.',advice:'Definimos dónde se graba, quién puede ver las cámaras y cómo consultar el archivo. La integración no convierte automáticamente una cámara en detector de intrusión ni elimina los costes de almacenamiento o conectividad que se contraten.',sources:['nvr']}
 ];
 return `<section class="section wrap ajax-knowledge" aria-labelledby="ajax-guide-title"><div class="section-heading"><div><p class="eyebrow">AJAX, EXPLICADO PARA TU INSTALACIÓN</p><h2 id="ajax-guide-title">Preguntas reales.<br><span class="muted">Respuestas concretas.</span></h2></div><p>Información para decidir qué necesitas proteger, qué equipo elegir y qué esperar del sistema.</p></div><nav class="knowledge-index" aria-label="En esta guía de Ajax">${articles.map(a=>`<a href="#${a.id}">${e({'radio-jeweller':'Radio y Wi-Fi','luz-e-internet':'Luz e Internet','modo-noche':'Modo Noche',fotoverificacion:'Fotos de alarma',mascotas:'Mascotas','video-compatible':'Integración de vídeo'}[a.id])}</a>`).join('')}</nav><div class="ajax-topics">${articles.map(a=>`<article id="${a.id}"><h3>${a.title}</h3><div><p>${a.text}</p><p class="practical-advice"><strong>En tu instalación.</strong> ${a.advice}</p>${sourceLinks(a.sources)}</div></article>`).join('')}</div><aside class="equipment-note"><h3>El presupuesto debe decir qué incluye.</h3><p>Central y conectividad, detectores, sirenas y controles, instalación, configuración y pruebas. La propuesta sin cuotas es autogestionada: no implica vigilancia por una central receptora, respuesta policial automática ni mantenimiento gratuito. Los equipos y el diseño deben corresponder al grado de seguridad ofrecido.</p>${more('/contacto/?marca=ajax','Consultar una instalación Ajax')}</aside></section>`;
}

const practicalSections={
 alarmas:{title:'Tu alarma empieza por estas decisiones.',intro:'Antes de elegir un kit, revisamos cómo se vive y se entra en el inmueble.',cards:[
  ['Los accesos, primero.','Puertas, ventanas y recorridos interiores no necesitan la misma detección. Un contacto detecta la apertura; un detector de movimiento cubre una zona. Elegimos la combinación y explicamos qué queda protegido.'],
  ['Conexión y alimentación.','¿Hay Internet fijo? ¿Qué cobertura móvil llega al interior? ¿Qué equipos tienen batería? Lo comprobamos para no confundir detectores inalámbricos con un sistema completo sin alimentación o sin conexión.'],
  ['Uso diario y personas.','Definimos quién arma y desarma, qué zonas se protegen cuando estás dentro y qué avisos necesitas recibir. La explicación y las pruebas forman parte del trabajo, no solo colocar dispositivos.']
 ],sources:['hub','night'],link:'/marcas/ajax/#luz-e-internet',linkText:'Ver cómo responde Ajax en cada situación'},
 camaras:{title:'La imagen útil se diseña. No se improvisa.',intro:'Visión nocturna, grabación y conexión resuelven necesidades distintas. Te ayudamos a elegir con criterio.',cards:[
  ['Infrarrojos o color nocturno.','La TurretCam dispone de iluminación infrarroja; la gama TurretCam HL incorpora iluminación híbrida. Para ofrecer color de noche hay que considerar la luz ambiente o la luz visible auxiliar. No todas las cámaras Ajax ni todas las gamas hacen lo mismo.'],
  ['Cámara inalámbrica no significa sin alimentación.','La TurretCam es una cámara IP cableada con opciones de alimentación por PoE o corriente continua según su manual. PoE permite llevar datos y alimentación por cable de red. La elegimos cuando encaja; no la anunciamos como cámara sin cables.'],
  ['Ver en directo no es tener una grabación.','El presupuesto debe indicar dónde se almacena el vídeo y qué capacidad se instala. La duración del archivo depende de calidad, cámaras y modo de grabación; antes de entregar comprobamos una reproducción, no solo la imagen en directo.']
 ],sources:['turret','hybrid','nvr'],link:'/alarmas-y-camaras/#fotos-directo-grabacion',linkText:'Distinguir fotos, directo y grabación'},
 'alarmas-y-camaras':{id:'fotos-directo-grabacion',title:'Fotos, directo y grabación no son lo mismo.',intro:'Cada función responde a una pregunta. Diseñamos la solución sin confundirlas.',cards:[
  ['Foto de alarma: ¿qué la ha activado?','Un detector MotionCam compatible toma fotografías asociadas al evento. Ayudan a entender el aviso, pero no ofrecen el mismo uso que una cámara con vídeo continuo.'],
  ['Vídeo en directo: ¿qué ocurre ahora?','La cámara permite consultar la escena en ese momento. El acceso remoto depende de que la cámara, la red y los servicios necesarios estén disponibles.'],
  ['Archivo: ¿qué ocurrió antes?','El grabador o almacenamiento configurado conserva el vídeo para revisarlo después. Hay que dimensionarlo y probarlo. La compatibilidad de cámaras de terceros con un NVR se revisa por modelo y protocolo.']
 ],sources:['motion','nvr'],link:'/marcas/ajax/#video-compatible',linkText:'Cómo revisamos la compatibilidad'},
 mantenimiento:{title:'Revisar es comprobar que sigue funcionando.',intro:'Una app conectada o una luz encendida no sustituyen una prueba de la instalación.',cards:[
  ['Detección y avisos.','Acordamos una prueba con el propietario para comprobar sensores, comunicaciones y recepción de avisos. Si hay una central receptora contratada, la prueba debe coordinarse también con ella.'],
  ['Imagen y archivo.','Revisamos el encuadre, suciedad, reflejos nocturnos y una grabación reciente. Distinguimos un problema de imagen de uno de red o almacenamiento.'],
  ['Baterías y usuarios.','Revisamos avisos de alimentación y los permisos que necesita cada persona. No envíes contraseñas ni códigos de desarmado al solicitar la visita. Los recambios y actuaciones se detallan aparte.']
 ],sources:[],link:'/contacto/',linkText:'Consultar una revisión'}
};

export function serviceKnowledge(slug){
 const section=practicalSections[slug];if(!section)return '';
 return `<section class="section wrap service-knowledge" id="${section.id||'antes-de-instalar'}"><div class="section-heading"><div><p class="eyebrow">ELEGIR BIEN. INSTALAR MEJOR.</p><h2>${e(section.title)}</h2></div><p>${e(section.intro)}</p></div><div class="practical-grid">${section.cards.map(([title,text])=>`<article><h3>${e(title)}</h3><p>${e(text)}</p></article>`).join('')}</div>${section.sources.length?sourceLinks(section.sources):''}${more(section.link,section.linkText)}</section>`;
}
