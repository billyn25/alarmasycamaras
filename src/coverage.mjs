import {e} from './lib.mjs';
import {provinces} from './content.mjs';

// Selección editorial, no clasificación por demanda ni promesa de cercanía.
export const featuredByProvince = {
 alava:['Amurrio','Laudio/Llodio','Agurain/Salvatierra','Alegría-Dulantzi','Laguardia','Artziniega'],
 bizkaia:['Zalla','Balmaseda','Güeñes','Durango','Gernika-Lumo','Amorebieta-Etxano'],
 gipuzkoa:['Zarautz','Tolosa','Beasain','Azpeitia','Eibar','Oñati'],
 burgos:['Lerma','Aranda de Duero','Briviesca','Medina de Pomar','Salas de los Infantes','Roa'],
 cantabria:['Castro-Urdiales','Reinosa','Laredo','Santoña','Cabezón de la Sal','Los Corrales de Buelna'],
 navarra:['Tudela','Estella-Lizarra','Tafalla','Olite/Erriberri','Sangüesa/Zangoza','Baztan'],
 'la-rioja':['Haro','Calahorra','Nájera','Santo Domingo de la Calzada','Arnedo','Alfaro'],
 leon:['Astorga','La Bañeza','Bembibre','Villablino','Valencia de Don Juan','Sahagún'],
 valladolid:['Medina del Campo','Tordesillas','Peñafiel','Íscar','Olmedo','Medina de Rioseco'],
 zamora:['Benavente','Toro','Puebla de Sanabria','Fuentesaúco','Fermoselle','Alcañices'],
 avila:['Arévalo','Arenas de San Pedro','Candeleda','El Barco de Ávila','Las Navas del Marqués','Piedrahíta'],
 palencia:['Aguilar de Campoo','Guardo','Saldaña','Carrión de los Condes','Venta de Baños','Dueñas'],
 salamanca:['Béjar','Ciudad Rodrigo','Peñaranda de Bracamonte','Alba de Tormes','Guijuelo','Ledesma'],
 segovia:['Cuéllar','El Espinar','Cantalejo','Sepúlveda','Riaza','Ayllón'],
 soria:['Almazán','Burgo de Osma-Ciudad de Osma','San Esteban de Gormaz','Ólvega','Ágreda','San Leonardo de Yagüe'],
 madrid:['Torrelaguna','Buitrago del Lozoya','Chinchón','Colmenar de Oreja','San Martín de Valdeiglesias','El Escorial'],
 asturias:['Llanes','Ribadesella','Cangas de Onís','Villaviciosa','Tineo','Cangas del Narcea'],
 toledo:['Illescas','Torrijos','Ocaña','Consuegra','Madridejos','Quintanar de la Orden'],
 guadalajara:['Sigüenza','Brihuega','Molina de Aragón','Pastrana','Jadraque','Alovera']
};

export function coverageSection(towns){
 const groups = new Map(provinces.map(p=>[p.id,towns.filter(t=>t.province.id===p.id)]));
 const labels=['Alarmas en ','Cámaras en ','Alarmas y cámaras en '];
 const cards=provinces.map(p=>{
  const group=groups.get(p.id);
  const selected=featuredByProvince[p.slug].map(name=>{
   const town=group.find(t=>t.name===name);
   if(!town)throw new Error(`Localidad destacada no encontrada en ${p.name}: ${name}`);
   return town;
  });
  return `<article class="coverage-province" aria-labelledby="coverage-${p.slug}"><header><h3 id="coverage-${p.slug}"><a href="${p.url}">${e(p.name)}</a></h3><span>${group.length} municipios</span></header><ul>${selected.map((t,i)=>`<li><a href="${t.url}">${e(labels[i%labels.length]+t.name)}</a></li>`).join('')}</ul><a class="coverage-all" href="${p.url}">Ver todos los municipios de ${e(p.name)} <span aria-hidden="true">→</span></a></article>`;
 }).join('');
 return `<section class="coverage section" id="cobertura" aria-labelledby="coverage-title"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">${provinces.length} PROVINCIAS · ${new Intl.NumberFormat('es-ES').format(towns.length)} MUNICIPIOS EN EL DIRECTORIO</p><h2 id="coverage-title">Tu provincia.<br><span class="muted">Tu pueblo. Tu seguridad.</span></h2></div><p>Instalación de alarmas, instalación de cámaras y soluciones integradas. Aquí tienes una selección por provincia; dentro encontrarás el listado completo.</p></div><div class="coverage-provinces">${cards}</div><div class="coverage-bottom"><a class="button" href="/zonas/">Buscar mi municipio <span aria-hidden="true">→</span></a><p>La disponibilidad de la visita y las condiciones se confirman al preparar tu presupuesto. El directorio incluye municipios, no todas las aldeas o barrios.</p></div></div></section>`;
}
