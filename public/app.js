'use strict';
document.documentElement.classList.add('js');
const normalize=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const debounce=(fn,delay=160)=>{let timer;return(...args)=>{clearTimeout(timer);timer=setTimeout(()=>fn(...args),delay);};};
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
if(menu&&nav){
 const close=()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.querySelector('.sr-only').textContent='Abrir menú';};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);menu.querySelector('.sr-only').textContent=open?'Cerrar menú':'Abrir menú';});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){close();menu.focus();}});
 document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))close();});
 nav.addEventListener('click',event=>{if(event.target.closest('a'))close();});
 window.matchMedia('(min-width:901px)').addEventListener('change',close);
}
const listInput=document.querySelector('[data-list-filter]');
if(listInput){const links=Array.from(document.querySelectorAll('[data-town-list] [data-town-name]')).map(el=>({el,name:normalize(el.dataset.townName)}));listInput.addEventListener('input',debounce(()=>{const q=normalize(listInput.value);let count=0;for(const row of links){row.el.hidden=!row.name.includes(q);if(!row.el.hidden)count++;}document.querySelector('[data-list-count]').textContent=`${count} ${count===1?'municipio':'municipios'}`;document.querySelector('[data-no-results]').hidden=count>0;}));}
const search=document.querySelector('[data-global-search]');
if(search){
 const input=search.querySelector('input'),results=search.querySelector('.search-results'),status=search.querySelector('.search-status');let indexPromise=null,revision=0;
 const getIndex=()=>indexPromise||=(fetch('/assets/municipios-search.json').then(r=>{if(!r.ok)throw Error('Directorio no disponible');return r.json();}).then(rows=>rows.map(row=>({...row,search:normalize(row.name+' '+row.province)}))).catch(error=>{indexPromise=null;throw error;}));
 const render=async()=>{const q=normalize(input.value),current=++revision;results.replaceChildren();if(q.length<2){status.textContent=q?'Escribe al menos dos letras.':'';return;}status.textContent='Buscando municipios…';try{const rows=await getIndex();if(current!==revision)return;const terms=q.split(/\s+/),found=rows.filter(row=>terms.every(term=>row.search.includes(term)));found.sort((a,b)=>Number(normalize(b.name).startsWith(q))-Number(normalize(a.name).startsWith(q)));const fragment=document.createDocumentFragment();for(const row of found.slice(0,60)){const a=document.createElement('a'),small=document.createElement('small');if(!/^\/[a-z0-9/-]+\/$/.test(row.url))continue;a.href=row.url;a.textContent=row.name;small.textContent=row.province;a.append(small);fragment.append(a);}results.replaceChildren(fragment);status.textContent=found.length>60?`${found.length} coincidencias. Mostrando 60; concreta la búsqueda o entra por provincia.`:found.length?`${found.length} ${found.length===1?'municipio encontrado':'municipios encontrados'}`:'No hay coincidencias. Prueba otro nombre o entra por provincia.';}catch{if(current===revision)status.textContent='No se ha podido cargar el buscador. Puedes entrar por provincia más abajo.';}};
 const debouncedRender=debounce(render);input.addEventListener('input',()=>{revision++;debouncedRender();});search.querySelector('[data-clear-search]').addEventListener('click',()=>{input.value='';revision++;results.replaceChildren();status.textContent='';input.focus();});
}
