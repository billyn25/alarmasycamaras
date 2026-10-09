import {cameraBrands} from './camera-brands.mjs';
import {services,brands} from './content.mjs';
export function structuredData(page,site,rt){
 if(!rt.production||!rt.base)return [];
 const base=rt.base,org=base+'/#organization',website=base+'/#website',url=base+page.url;
 const graph=[{'@context':'https://schema.org','@type':'Organization','@id':org,name:site.brand,url:base+'/',telephone:site.tel,logo:base+'/assets/logo.svg'},
 {'@context':'https://schema.org','@type':'WebSite','@id':website,name:site.brand,url:base+'/',inLanguage:'es',publisher:{'@id':org}},
 {'@context':'https://schema.org','@type':'WebPage','@id':url+'#webpage',url,name:page.title,description:page.description,inLanguage:'es',isPartOf:{'@id':website}}];
 if(page.crumbs?.length)graph.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{name:'Inicio',url:'/'},...page.crumbs].map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:base+c.url}))});
 const service=services.find(s=>page.url===`/${s.slug}/`);
 if(service)graph.push({'@context':'https://schema.org','@type':'Service','@id':url+'#service',name:service.title,serviceType:service.title,url,description:page.description,provider:{'@id':org}});
 return graph;
}
const descriptions={
 '/alarmas/':'Instalación de alarmas Ajax inalámbricas de grado 2. Equipos, configuración y pruebas a medida, sin cuota mensual obligatoria por el sistema autogestionado.',
 '/camaras/':'Instalación de cámaras de seguridad con visión nocturna, grabación y consulta móvil. Elegimos encuadres, conexión y almacenamiento según tu inmueble.',
 '/alarmas-y-camaras/':'Instalación conjunta de alarmas y cámaras: avisos, fotos de alarma, directo y grabación. Compatibilidad y configuración revisadas para tu inmueble.',
 '/mantenimiento/':'Revisión y ampliación de alarmas y cámaras. Comprobación de sensores, baterías, avisos, imagen, grabaciones y usuarios. Consulta tu instalación.'
};
export function enrichMetadata(page){
 const service=services.find(s=>page.url===`/${s.slug}/`);
 const brand=brands.find(b=>page.url===`/marcas/${b.slug}/`);
 // Sin una foto de la marca concreta se usa la identidad Rapid, no un producto de otra marca.
 return {...page,description:descriptions[page.url]||cameraBrands[brand?.slug]?.description||page.description,image:page.image||(service?.image)||(brand&&brand.slug!=='ajax'?'logo.svg':page.townId?'ajax-turret.jpg':'ajax-kit.jpg')};
}
