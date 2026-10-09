import {e} from './lib.mjs';

const pools=[
 {key:'access',label:'ACCESOS Y DETECCIÓN',url:'/alarmas/',variants:[
  ['Empieza por los accesos, no por el número de sensores','Antes de decidir cuántos detectores hacen falta, conviene recorrer puertas, ventanas accesibles y zonas de paso. Una vivienda con dos entradas no se plantea igual que un piso con un único acceso. También se revisa dónde puede colocarse la central para que la comunicación con los dispositivos sea estable y para que el uso diario siga siendo sencillo.'],
  ['Puertas, ventanas y recorridos tienen funciones distintas','Un contacto de apertura informa de una puerta o ventana; un detector de movimiento cubre una zona de paso. Combinar ambos criterios suele ser más útil que duplicar dispositivos sin un objetivo claro. El presupuesto debe indicar qué punto protege cada elemento y cómo quedará armado cuando haya personas dentro del inmueble.'],
  ['La alarma debe adaptarse al modo de entrar y salir','Si la entrada principal, el garaje o una puerta trasera se utilizan de forma diferente, la instalación debe reflejarlo. Se estudian retardos, modos de armado y usuarios para que proteger el inmueble no obligue a realizar maniobras incómodas cada día. La distribución se decide con el uso real, no con un kit fijo.'],
  ['Primero se define qué evento quieres detectar','Abrir una puerta, cruzar un pasillo o acceder desde una ventana son eventos distintos. Identificar los puntos de entrada ayuda a elegir el sensor adecuado y evita instalar aparatos que se solapan sin aportar información. Después se comprueba radio, alimentación de la central y recepción de avisos.'],
  ['Más detectores no siempre significa mejor protección','Un sistema bien planteado cubre los recorridos importantes y evita huecos, pero también debe ser fácil de usar. Por eso se priorizan accesos y pasos relevantes antes de añadir dispositivos. Cuando existen mascotas, zonas de uso nocturno o personas con horarios distintos, esos condicionantes se revisan antes de fijar la configuración.'],
  ['La distribución se decide sobre el inmueble','La misma central puede admitir muchos dispositivos, pero eso no convierte todas las instalaciones en iguales. Puertas, ventanas, escaleras y plantas condicionan la propuesta. Se comprueba dónde interesa detectar primero y qué zonas pueden quedar armadas de forma parcial cuando la vivienda o negocio sigue ocupado.']
 ]},
 {key:'night',label:'CÁMARAS Y NOCHE',url:'/guias/camaras-exteriores-noche/',variants:[
  ['Una cámara útil de noche necesita algo más que resolución','La imagen nocturna depende de la luz, la óptica y el lugar donde se monta. Un muro cercano, un alero o vegetación pueden reflejar infrarrojos y empeorar el resultado. Antes de elegir modelo conviene saber a qué distancia está el acceso que quieres ver y comprobar la escena con la iluminación real.'],
  ['El encuadre correcto vale más que grabar toda la fachada','Una cámara muy abierta puede mostrar mucho espacio y poco detalle. Para una puerta, portón o entrada de vehículos interesa definir primero la zona importante y después escoger lente y altura. Si se necesita color nocturno, se comprueba qué iluminación requiere la gama elegida en vez de asumir que cualquier cámara verá igual.'],
  ['Infrarrojos y color nocturno resuelven situaciones diferentes','Los infrarrojos suelen ofrecer imagen nocturna sin luz visible; otras gamas recurren a sensores de alta sensibilidad o iluminación auxiliar para mantener color. Ninguna opción es universal. Se revisan distancia, reflejos, faros, escaparates y luces próximas antes de decidir qué solución encaja mejor.'],
  ['El exterior se prueba en el punto real','Las especificaciones de una cámara orientan, pero la prueba útil se hace donde quedará instalada. El ángulo, la altura, la luz de una farola o el reflejo de una pared pueden cambiar la imagen. Por eso conviene comprobar el acceso de día y de noche antes de dar por válido el encuadre.'],
  ['No todas las entradas necesitan la misma cámara','Una puerta peatonal, un patio y una entrada de vehículos tienen distancias y campos de visión diferentes. Se elige el formato y la óptica por el objetivo de cada punto. También se valora si la cámara queda expuesta al exterior y cómo se protegerán cable, conexión y fijación.'],
  ['Ver más no siempre significa identificar mejor','Ampliar demasiado el campo de visión puede reducir el detalle justo donde importa. El diseño busca equilibrar contexto y reconocimiento del acceso. En escenas nocturnas se revisan iluminación, superficies reflectantes y movimiento para decidir si conviene infrarrojo, luz blanca o una gama específica de baja iluminación.']
 ]},
 {key:'recording',label:'GRABACIÓN Y ARCHIVO',url:'/guias/grabacion-nvr-almacenamiento/',variants:[
  ['Ver en directo y tener grabación son cosas distintas','La aplicación puede mostrar una cámara en ese momento y, sin embargo, no existir un archivo útil si el almacenamiento no está configurado. Por eso el proyecto debe definir NVR, tarjeta o servicio compatible, capacidad prevista y forma de reproducción. La entrega incluye comprobar que se puede buscar y abrir un evento anterior.'],
  ['El almacenamiento se dimensiona junto con las cámaras','Número de cámaras, resolución, compresión y modo de grabación influyen en cuánto tiempo cabe en un disco o tarjeta. No hay un número de días válido para todos los casos. Si conservar un periodo concreto es importante, se toma como requisito y se calcula con los equipos elegidos.'],
  ['Un NVR aporta más que un lugar para guardar vídeo','En instalaciones con varias cámaras, el grabador centraliza canales, reproducción y discos. También hay que comprobar compatibilidad y ancho de banda, porque no todas las funciones inteligentes pasan igual entre marcas. El presupuesto debe identificar grabador, capacidad y qué funciones se esperan realmente.'],
  ['La tarjeta puede bastar en algunos puntos, pero no en todos','Hay cámaras que permiten microSD y pueden resolver una necesidad sencilla de grabación local. En otros proyectos interesa centralizar el archivo en un grabador separado. La decisión depende del número de cámaras, del riesgo de perder el propio equipo y de cómo quieras revisar las imágenes.'],
  ['La nube es un servicio, no una suposición','Algunas plataformas ofrecen almacenamiento o funciones remotas mediante servicios opcionales. Si existe coste periódico, debe quedar separado de la instalación. También se revisa qué calidad y duración conserva. Una alarma sin cuota obligatoria de central receptora no implica que cualquier servicio de vídeo en la nube sea gratuito.'],
  ['La mejor prueba es recuperar una grabación','Al terminar, no basta con ver las cámaras en directo. Conviene generar un evento, esperar a que quede almacenado y comprobar reproducción, fecha, hora y permisos. Esa prueba descubre configuraciones incompletas y deja claro al usuario cómo encontrar imágenes cuando realmente las necesite.']
 ]},
 {key:'connectivity',label:'RED, POE Y 4G',url:'/guias/camaras-4g-solares/',variants:[
  ['La conexión se comprueba donde estará el equipo','Tener Wi-Fi o cobertura móvil en el inmueble no garantiza buena señal en una fachada, garaje o anexo. Se revisa el punto real antes de decidir cómo comunicar cámaras y central. Cuando existe cableado viable, PoE puede simplificar datos y alimentación; en ubicaciones aisladas se estudian alternativas 4G o solares.'],
  ['Cablear cuando se puede y usar radio cuando aporta valor','Una instalación profesional no tiene que ser toda inalámbrica ni toda cableada. Los detectores de alarma pueden comunicarse por radio, mientras una cámara IP puede aprovechar red y PoE. La combinación se decide según recorridos, alimentación y mantenimiento, evitando forzar una tecnología donde otra resulta más estable.'],
  ['4G tiene sentido cuando la red fija no llega','Para una finca, segunda residencia o punto remoto puede valorarse una cámara con conectividad móvil. Antes se comprueba señal en el emplazamiento y consumo de datos previsto. Si el equipo es solar, también se revisan orientación, sombras y autonomía; la etiqueta 4G o solar no convierte cualquier ubicación en viable.'],
  ['El router forma parte de la cadena aunque no sea una cámara','El acceso remoto depende de la conectividad que utilicen los equipos. Si se corta la corriente, la batería del hub de alarma no alimenta por sí sola router, switch, cámaras o NVR. Cuando la continuidad es importante se estudia qué elementos necesitan respaldo y durante cuánto tiempo.'],
  ['PoE puede ordenar mucho una instalación de vídeo','Cuando la cámara y la red son compatibles, un cable Ethernet puede transportar datos y alimentación. Esto reduce enchufes en cada punto, pero sigue exigiendo un switch o NVR adecuado y un recorrido de cable correcto. Antes de perforar o tender cable se revisa por dónde puede pasar y qué parte queda visible.'],
  ['La cobertura no se da por hecha','Una barra de señal vista en el móvil dentro de casa no es una medición del punto donde quedará el dispositivo. Fachadas, muros, plantas y anexos pueden cambiar la conexión. El proyecto separa radio de alarma, red IP y salida a Internet para probar cada enlace que realmente vaya a utilizarse.']
 ]},
 {key:'use',label:'USO DEL INMUEBLE',url:'/soluciones/',variants:[
  ['Una vivienda habitual necesita un sistema cómodo de usar','El diseño debe permitir entrar, salir y dormir con el sistema sin convertir cada acción en una complicación. Se revisa armado parcial, usuarios y accesos cotidianos. Si también hay cámaras, se decide qué zonas interesa consultar y quién tendrá permisos para ver directo o grabaciones.'],
  ['Una segunda residencia obliga a pensar qué sigue funcionando cuando no estás','Además de detectar una intrusión, interesa saber qué ocurre con electricidad, Internet y avisos. La central puede tener respaldo propio, pero cámaras, router y grabador necesitan su previsión. También se define quién recibe notificaciones y qué puede hacer cada persona autorizada.'],
  ['En un comercio importa tanto la seguridad como la gestión de usuarios','Apertura, cierre, almacén y acceso de personal pueden necesitar permisos distintos. Una buena configuración evita compartir un único código entre todos. En vídeo se separan las zonas necesarias de cualquier captación ajena y se concreta quién puede revisar grabaciones.'],
  ['Una casa con parcela añade puntos que un piso no tiene','Garaje, portón, jardín o anexos cambian distancias, iluminación y comunicaciones. No se da por hecho que la misma cámara o detector sirva dentro y fuera. Se seleccionan equipos adecuados al entorno y se comprueba señal en cada punto antes de cerrar la propuesta.'],
  ['Una nave o almacén necesita revisar distancias antes de elegir equipos','Grandes espacios, techos altos y accesos de mercancía pueden exigir posiciones y ópticas diferentes a una vivienda. También se estudian red, alimentación y zonas de armado. Por eso no se presenta un kit doméstico ampliado como solución automática para un espacio profesional.'],
  ['Un piso plantea límites distintos a una vivienda independiente','El acceso principal puede estar dentro de un portal o zona común, por lo que la detección interior y la videovigilancia exterior no se resuelven igual. Se protege el espacio propio y se revisa el encuadre de cualquier cámara para no dar por autorizada la captación de zonas comunes.']
 ]},
 {key:'budget',label:'PRESUPUESTO Y EQUIPOS EXISTENTES',url:'/guias/presupuesto-instalacion/',variants:[
  ['Un presupuesto útil dice qué se instala y qué queda fuera','Marca, referencia, cantidad, montaje y configuración permiten comparar propuestas. También conviene separar desplazamiento, conectividad, almacenamiento y servicios opcionales. Si ya existen cámaras, cableado o una alarma, se revisa qué puede conservarse antes de sustituirlo por defecto.'],
  ['Antes de cambiar equipos, conviene saber qué funciona','Una ampliación puede aprovechar cableado, cámaras o red existentes si son compatibles y están en buen estado. Se identifican referencias y se prueba su funcionamiento. Con esa información se decide si interesa integrar, mantener por separado o renovar parte del sistema.'],
  ['El precio de un kit no describe la instalación completa','Dos proyectos con el mismo número de dispositivos pueden requerir recorridos de cable, soportes o configuración muy diferentes. Por eso se aclaran montaje, materiales, puesta en marcha y pruebas. Los gastos periódicos, cuando existan, se muestran separados del coste inicial.'],
  ['La consulta inicial necesita datos simples, no información sensible','Municipio, tipo de inmueble, número aproximado de accesos y si existe Internet suelen bastar para empezar. No hace falta enviar códigos de alarma, contraseñas ni horarios de ausencia. Después se concreta si hace falta una visita y qué información técnica adicional conviene revisar.'],
  ['Conservar equipos puede ser mejor que empezar de cero','Si una instalación existente cumple su función, se puede estudiar una ampliación en vez de sustituirla completa. La compatibilidad se verifica por referencia, protocolo y estado. El presupuesto debe distinguir claramente qué material se mantiene y qué material nuevo se incorpora.'],
  ['La entrega también forma parte del trabajo','Instalar no termina al fijar dispositivos. Hay que probar detección, avisos, imagen nocturna, grabación y permisos, según el proyecto. También se explica al propietario cómo armar, consultar vídeo y gestionar usuarios. Esa puesta en marcha debe quedar contemplada en el alcance acordado.']
 ]},
 {key:'privacy',label:'PRIVACIDAD Y PERMISOS',url:'/guias/vision-nocturna-y-grabacion/',variants:[
  ['La cámara debe mirar a la zona necesaria','El objetivo de videovigilancia se define antes de orientar el equipo. Un encuadre más amplio no siempre es mejor y puede captar espacios ajenos sin necesidad. Se ajusta el campo de visión y, cuando el sistema lo permite, se valoran máscaras o zonas de privacidad.'],
  ['Los permisos de la app también forman parte de la seguridad','No todas las personas necesitan administrar el sistema. Conviene separar quién arma, quién recibe avisos y quién puede ver o exportar grabaciones. Una instalación bien entregada deja usuarios identificados y evita compartir una única cuenta entre varias personas por comodidad.'],
  ['Grabar implica decidir quién puede revisar las imágenes','La videovigilancia no acaba en colocar una cámara. Se configura acceso al archivo, conservación y usuarios. En negocios, comunidades u otros entornos deben revisarse las obligaciones aplicables y la información a las personas, además de limitar el encuadre al objetivo necesario.'],
  ['Más acceso remoto no significa más seguridad','Dar permisos de administrador a todos facilita la configuración pero aumenta el número de cuentas capaces de cambiar ajustes. Se asignan funciones según necesidad y se recomienda conservar credenciales personales. La consulta inicial nunca necesita contraseñas ni códigos de desarmado.'],
  ['El directo y el archivo pueden tener permisos distintos','Algunos sistemas permiten separar quién puede ver una cámara en vivo de quién puede revisar grabaciones o modificar configuraciones. Conviene definir estas responsabilidades al entregar la instalación, especialmente cuando hay varios usuarios o personal con funciones diferentes.'],
  ['Privacidad y utilidad deben diseñarse juntas','Una cámara puede cumplir su objetivo sin abarcar todo lo que tiene delante. Se decide qué zona necesita vigilancia y se ajusta encuadre, altura y permisos. El diseño debe ser útil para verificar un evento y, al mismo tiempo, evitar captaciones innecesarias.']
 ]}
];

const intros=[
 'Para preparar una instalación en {town} conviene empezar por el inmueble y por cómo se utiliza. Esta combinación de criterios sirve para ordenar la consulta antes de elegir referencias concretas.',
 'En {town}, la propuesta se construye a partir de accesos, uso, conectividad y necesidades de vídeo. No partimos de un kit cerrado: primero se define qué debe detectar, mostrar y guardar el sistema.',
 'Una alarma o una cámara se eligen mejor cuando el objetivo está claro. Para una consulta en {town}, estos son algunos de los puntos que conviene revisar antes de cerrar equipos y montaje.',
 'Cada inmueble plantea una combinación distinta de detección, vídeo y comunicaciones. En {town}, esta guía sirve para preparar la valoración sin asumir que una vivienda, un comercio y una nave necesitan lo mismo.',
 'El nombre del municipio ayuda a ubicar la consulta, pero el diseño depende del espacio. Para {town}, organizamos la valoración alrededor de accesos, grabación, conexión, usuarios y posibilidades de ampliación.',
 'Antes de hablar de modelos, interesa saber qué quieres proteger y cómo usarás el sistema. En {town}, estos criterios permiten preparar una propuesta más concreta y evitar equipos elegidos solo por catálogo.'
];

function hash(text){let h=2166136261;for(const ch of String(text)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
const choose=(items,key)=>items[hash(key)%items.length];

export function localVariantSection(t){
 const seed=t.id+'|'+t.province.id+'|'+t.name;
 const intro=choose(intros,seed+'|intro').replace('{town}',e(t.name));
 const drop=hash(seed+'|drop')%pools.length;
 const selected=pools.filter((_,i)=>i!==drop).map(pool=>({pool,variant:choose(pool.variants,seed+'|'+pool.key),order:hash(seed+'|order|'+pool.key)})).sort((a,b)=>a.order-b.order).slice(0,5);
 const blocks=selected.map(({pool,variant})=>`<article class="local-variant-card"><p class="eyebrow">${e(pool.label)}</p><h3>${e(variant[0])}</h3><p>${e(variant[1])}</p><a class="text-link" href="${pool.url}">Ampliar información <span aria-hidden="true">→</span></a></article>`).join('');
 return `<section class="section wrap local-variant-section" aria-labelledby="local-variant-title"><div class="section-heading"><div><p class="eyebrow">CÓMO PLANTEAR TU INSTALACIÓN</p><h2 id="local-variant-title">Decisiones útiles para ${e(t.name)}.</h2></div><p>${intro}</p></div><div class="local-variant-grid">${blocks}</div><p class="fine-print">Contenido orientativo generado de forma estable para este municipio a partir de criterios técnicos generales. No describe una visita, una obra ni condiciones de cobertura ya comprobadas.</p></section>`;
}

export function localVariantSignature(t){
 return localVariantSection(t).replaceAll(e(t.name),'[LOCAL]').replaceAll(e(t.province.name),'[PROVINCIA]');
}

const titlePatterns=[
 t=>`Alarmas y cámaras en ${t.name}, ${t.province.name}`,
 t=>`Instalación de alarmas y cámaras · ${t.name}, ${t.province.name}`,
 t=>`Cámaras de seguridad y alarmas · ${t.name}, ${t.province.name}`,
 t=>`Instalador de alarmas y cámaras · ${t.name}, ${t.province.name}`,
 t=>`Alarmas inalámbricas y cámaras · ${t.name}, ${t.province.name}`,
 t=>`Seguridad con alarmas y cámaras · ${t.name}, ${t.province.name}`
];
const descriptionPatterns=[
 (t,p)=>`Instalación de alarmas inalámbricas y cámaras de seguridad en ${t.name}, ${t.province.name}. Diseñamos detección, vídeo y grabación según el inmueble. ${p}.`,
 (t,p)=>`Alarmas y videovigilancia en ${t.name}, ${t.province.name}: accesos, visión nocturna, grabación y control móvil según el proyecto. Presupuesto en ${p}.`,
 (t,p)=>`Protección para viviendas, negocios y segundas residencias en ${t.name}. Alarmas, cámaras y almacenamiento configurados a medida. Consulta: ${p}.`,
 (t,p)=>`Instalador de alarmas y cámaras en ${t.name}. Revisamos accesos, conexión, visión nocturna y grabación antes de elegir equipos. Contacto: ${p}.`,
 (t,p)=>`Cámaras de seguridad y alarmas en ${t.name}, ${t.province.name}. Soluciones para vivienda y negocio, con integración y costes definidos en presupuesto. ${p}.`,
 (t,p)=>`Consulta alarmas inalámbricas y cámaras en ${t.name}. Diseñamos el sistema según accesos, uso, conectividad y necesidades de grabación. ${p}.`
];
export function localSeoMeta(t,phone){
 let title=choose(titlePatterns,t.id+'|seo-title')(t);
 let description=choose(descriptionPatterns,t.id+'|seo-description')(t,phone);
 if(title.length>76)title=`${t.name}, ${t.province.name}: alarmas y cámaras`;
 if(description.length>165)description=`Alarmas y cámaras en ${t.name}, ${t.province.name}. Instalación a medida de detección, videovigilancia y grabación según el inmueble.`;
 if(description.length>165)description=`Alarmas y cámaras en ${t.name}. Instalación a medida de detección y videovigilancia según el inmueble.`;
 return {title,description};
}
const deepLinks=[
 ['/alarmas/','Alarmas inalámbricas'],
 ['/camaras/','Cámaras de seguridad'],
 ['/alarmas-y-camaras/','Alarma y vídeo integrados'],
 ['/soluciones/','Soluciones por inmueble'],
 ['/guias/camaras-exteriores-noche/','Cámaras exteriores y noche'],
 ['/guias/grabacion-nvr-almacenamiento/','Grabación y NVR'],
 ['/guias/camaras-4g-solares/','Cámaras 4G y solares'],
 ['/guias/presupuesto-instalacion/','Cómo comparar presupuestos']
];
export function localInternalLinks(t){
 const ranked=deepLinks.map((item,i)=>({item,rank:hash(t.id+'|deep-link|'+i)})).sort((a,b)=>a.rank-b.rank).slice(0,5);
 return `<nav class="local-deep-links" aria-label="Información relacionada para ${e(t.name)}"><strong>Información para preparar tu instalación</strong>${ranked.map(({item})=>`<a href="${item[0]}">${e(item[1])} <span aria-hidden="true">→</span></a>`).join('')}</nav>`;
}
