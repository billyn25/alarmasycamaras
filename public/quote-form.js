// Client-side message preparation only. No API, background submission or persistent customer storage.
(()=>{
 const forms=[...document.querySelectorAll('[data-quote-form]')];
 if(!forms.length)return;
 const fold=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const line=(value,limit=100)=>String(value||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,limit);
 const aliases={vizcaya:'bizkaia',guipuzcoa:'gipuzkoa',guipuzkoa:'gipuzkoa',araba:'alava'};
 const key=value=>aliases[fold(value)]||fold(value);
 const phoneNumber=value=>{
  const raw=String(value||'').trim();
  if(!/^[+\d\s().-]+$/.test(raw))return '';
  let cleaned=raw.replace(/[\s().-]/g,'');
  if(cleaned.startsWith('00'))cleaned='+'+cleaned.slice(2);
  if(/^[6789]\d{8}$/.test(cleaned))return '+34'+cleaned;
  if(/^34[6789]\d{8}$/.test(cleaned))return '+'+cleaned;
  if(cleaned.startsWith('+34'))return /^\+34[6789]\d{8}$/.test(cleaned)?cleaned:'';
  return /^\+[1-9]\d{7,14}$/.test(cleaned)?cleaned:'';
 };
 let directory=null;
 const getDirectory=()=>directory||=(fetch('/assets/municipios-search.json').then(r=>{if(!r.ok)throw Error('No disponible');return r.json();}).catch(error=>{directory=null;throw error;}));
 const serviceByPath={'/alarmas/':'Alarma inalámbrica','/camaras/':'Cámaras de seguridad','/alarmas-y-camaras/':'Alarmas y cámaras','/mantenimiento/':'Revisión o ampliación'};
 const serviceAliases={alarmas:'Alarma inalámbrica',camaras:'Cámaras de seguridad','alarmas-y-camaras':'Alarmas y cámaras',mantenimiento:'Revisión o ampliación'};
 for(const form of forms){
  const fields=form.elements,province=fields.province,town=fields.town,phone=fields.phone;
  const status=form.querySelector('[data-quote-status]'),preview=form.querySelector('[data-quote-preview]');
  const allowedProvince=value=>[...province.options].find(o=>o.value&&key(o.value)===key(value))?.value||'';
  const choose=(select,value)=>{const found=[...select.options].find(o=>fold(o.value)===fold(value));if(found)select.value=found.value;};
  const params=new URLSearchParams(location.search);
  let brand='';
  if(location.pathname==='/contacto/'){
   const rawTown=line(params.get('pueblo')),rawProvince=line(params.get('provincia'));
   let parsedTown=rawTown,parsedProvince=allowedProvince(rawProvince);
   if(rawTown){
    const split=rawTown.lastIndexOf(',');
    const suffix=split>=0?allowedProvince(rawTown.slice(split+1)):allowedProvince(rawTown);
    if(suffix){parsedProvince=parsedProvince||suffix;parsedTown=split>=0?rawTown.slice(0,split).trim():'';}
    town.value=parsedTown;
   }
   if(parsedProvince)province.value=parsedProvince;
   choose(fields.building,line(params.get('inmueble')));
   const service=line(params.get('servicio'));choose(fields.service,serviceAliases[service]||service);
   const brands={ajax:'Ajax',hikvision:'Hikvision',dahua:'Dahua',uniview:'Uniview',nivian:'Nivian',ezviz:'EZVIZ'};
   brand=brands[params.get('marca')]||'';
   if(brand&&!service)choose(fields.service,brand==='Ajax'?'Alarmas y cámaras':'Cámaras de seguridad');
  }else if(serviceByPath[location.pathname])choose(fields.service,serviceByPath[location.pathname]);
  const message=()=>{
   const values=[
    'Hola, me gustaría pedir presupuesto a Cámaras y Alarmas Rapid.',
    '',
    `Servicio: ${fields.service.value}`,
    `Provincia: ${province.value||'Por indicar'}`,
    `Municipio o pueblo: ${line(town.value)||'Por indicar'}`,
    `Tipo de inmueble: ${fields.building.value}`,
    `Nombre: ${line(fields.customerName.value,70)||'No indicado'}`,
    `Teléfono de contacto: ${phoneNumber(phone.value)||line(phone.value,24)||'Por indicar'}`
   ];
   if(brand)values.push('Marca de interés: '+brand);
   const detail=fields.details.value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').trim().slice(0,600);
   if(detail)values.push('','Detalles: '+detail);
   values.push('','¿Podemos valorar la instalación y sus condiciones?');
   return values.join('\n');
  };
  const validate=()=>{
   town.setCustomValidity(town.value&&!line(town.value)?'Indica el municipio o pueblo.':'');
   phone.setCustomValidity(phone.value&&!phoneNumber(phone.value)?'Revisa el teléfono: 9 cifras para España o un número internacional con prefijo +.':'');
  };
  const update=()=>{validate();preview.textContent=message();status.textContent='';};
  let request=0;
  const suggestions=async()=>{
   const serial=++request,selected=province.value,list=form.querySelector('datalist');
   list.replaceChildren();
   if(!selected||selected==='Otra provincia')return;
   try{
    const rows=await getDirectory();if(serial!==request)return;
    const fragment=document.createDocumentFragment();
    for(const row of rows.filter(r=>key(r.province)===key(selected))){const option=document.createElement('option');option.value=row.name;fragment.append(option);}
    list.replaceChildren(fragment);
   }catch{/* Free-text municipalities always remain available. */}
  };
  province.addEventListener('change',()=>{town.value='';suggestions();update();});
  town.addEventListener('focus',suggestions);
  form.addEventListener('input',update);form.addEventListener('change',update);
  form.addEventListener('submit',event=>{
   event.preventDefault();validate();
   if(!form.reportValidity())return;
   const recipient=form.querySelector('[data-whatsapp]').dataset.whatsapp;
   if(!/^[1-9]\d{7,14}$/.test(recipient)){status.textContent='No se puede abrir WhatsApp. Utiliza el teléfono de contacto de la web.';return;}
   const url='https://wa.me/'+recipient+'?text='+encodeURIComponent(message());
   status.textContent='Abriendo WhatsApp. Revisa el mensaje y pulsa Enviar allí.';
   window.location.assign(url);
  });
  form.hidden=false;update();
 }
})();
