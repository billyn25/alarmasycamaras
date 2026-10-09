// One first-party preference, written only after an explicit click. No optional trackers.
(()=>{
 const notice=document.getElementById('cookie-notice'),dialog=document.getElementById('cookie-dialog');
 if(!notice||!dialog)return;
 const name='rapid_cookie_notice',version='v1',maxAge=180*24*60*60;
 const triggers=[...document.querySelectorAll('[data-cookie-open]')];
 let opener=null,resetFocus=false;
 const remembered=()=>{try{return document.cookie.split(';').some(part=>part.trim()===`${name}=${version}`);}catch{return false;}};
 const write=age=>{try{document.cookie=`${name}=${age?version:''}; Max-Age=${age}; Path=/; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;}catch{/* Cookie-blocking must never prevent navigation. */}};
 const sync=()=>{
  const saved=remembered();
  dialog.querySelector('[data-cookie-reset]').disabled=!saved;
  dialog.querySelector('.cookie-storage-state').textContent=saved?'Tu elección está guardada. Puedes borrarla aquí.':'No hay una elección guardada en este navegador.';
  triggers.forEach(el=>el.setAttribute('aria-expanded',String(dialog.open)));
 };
 const close=()=>{if(dialog.open)dialog.close();};
 const show=(event)=>{
  event.preventDefault();
  if(typeof dialog.showModal!=='function'){location.href='/cookies/';return;}
  opener=event.currentTarget;sync();dialog.showModal();sync();
  document.documentElement.classList.add('cookie-modal-open');
  dialog.querySelector('[data-cookie-close]').focus();
 };
 triggers.forEach(el=>el.addEventListener('click',show));
 document.querySelectorAll('[data-cookie-ack]').forEach(el=>el.addEventListener('click',()=>{
  write(maxAge);notice.hidden=true;close();sync();
  if(!dialog.open&&notice.contains(el))document.querySelector('.cookie-trigger').focus({preventScroll:true});
 }));
 dialog.querySelector('[data-cookie-close]').addEventListener('click',close);
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length);
  const first=controls[0],last=controls[controls.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
 dialog.addEventListener('close',()=>{
  document.documentElement.classList.remove('cookie-modal-open');sync();
  const target=resetFocus?notice.querySelector('[data-cookie-ack]'):opener&&!opener.closest('[hidden]')?opener:document.querySelector('.cookie-trigger');
  resetFocus=false;
  if(target)target.focus({preventScroll:true});
 });
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
 dialog.querySelector('[data-cookie-reset]').addEventListener('click',()=>{write(0);resetFocus=true;notice.hidden=false;close();sync();});
 notice.hidden=remembered();sync();
})();
