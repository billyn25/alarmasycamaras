import {provinces} from './content.mjs';
export const e=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const cleanName=value=>String(value).replaceAll('\\/','/').replace(/^(.+),\s*(El|La|Los|Las)$/u,'$2 $1').trim();
export const slug=value=>cleanName(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function townsFrom(records){
 const ids=new Set(),urls=new Set();
 return [...records].sort((a,b)=>a.id.localeCompare(b.id)).map(row=>{
  const province=provinces.find(p=>p.id===row.province);
  if(!province||!/^\d{5}$/.test(row.id)||!row.id.startsWith(province.id)||!row.name||ids.has(row.id))throw Error('Municipio inválido o duplicado: '+row.id);
  ids.add(row.id);const name=cleanName(row.name),part=slug(name);if(!part)throw Error('Nombre vacío');
  let url=province.url+part+'/';if(urls.has(url))url=province.url+part+'-'+row.id+'/';if(urls.has(url))throw Error('Ruta duplicada');urls.add(url);
  return {id:row.id,name,province,url};
 }).sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'})||a.id.localeCompare(b.id));
}
export function runtime(site,env=process.env){
 const preview=['deploy-preview','branch-deploy'].includes(env.CONTEXT),production=!preview&&(env.SITE_MODE||site.mode)==='production';
 if(!/^\+34\d{9}$/.test(site.tel)||!/^34\d{9}$/.test(site.whatsapp))throw Error('Contacto inválido');
 let base=production?(env.SITE_URL||site.domain):(env.DEPLOY_PRIME_URL||env.URL||'');
 if(production){const missing=Object.entries(site.ready).filter(([,v])=>v!==true).map(([k])=>k);if(missing.length)throw Error('Producción pendiente de confirmar: '+missing.join(', '));if(Object.values(site.legal).some(v=>!String(v).trim()))throw Error('Datos legales incompletos');if(!base)throw Error('Falta dominio definitivo');}
 if(base){const u=new URL(base);if(u.pathname!=='/'||u.search||u.hash||u.username||u.password)throw Error('El dominio debe ser un origen');if(production&&(u.protocol!=='https:'||/localhost|\.netlify\.app$|\.test$|\.invalid$|example\./.test(u.hostname)))throw Error('Dominio no válido para producción');if(!['https:','http:'].includes(u.protocol))throw Error('Protocolo no válido');base=u.origin;}
 return {production,base};
}
export function approvedLocal(entry){return !!entry&&entry.approved===true&&/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedAt||'')&&String(entry.source||'').length>10&&Array.isArray(entry.blocks)&&entry.blocks.length>=2&&entry.blocks.every(b=>b.title?.length>=10&&b.text?.length>=200);}
