"""One-time source integration for the review branch. Never runs in Netlify builds."""
from pathlib import Path

def edit(file,old,new,count=1):
 p=Path(file);s=p.read_text()
 if s.count(old)!=count:raise RuntimeError(f'Expected {count} replacement(s) in {file}, found {s.count(old)}')
 p.write_text(s.replace(old,new))

def prepend(file,text):
 p=Path(file);p.write_text(text+p.read_text())

prepend('src/views.mjs',"import {cookieUI} from './cookie-ui.mjs';\nimport {cameraBrandContent,cameraPlanner} from './camera-brands.mjs';\n")
edit('src/views.mjs',"${b.slug==='ajax'?ajaxKnowledge():''}","${b.slug==='ajax'?ajaxKnowledge():cameraBrandContent(b.slug)}")
edit('src/views.mjs','${serviceKnowledge(s.slug)}',"${serviceKnowledge(s.slug)}${s.slug==='camaras'?cameraPlanner():''}")
edit('src/views.mjs','<h1>Instalación de<br><span class="muted">sistemas ${e(b.name)}.</span></h1>',"<h1>Instalación de<br><span class=\"muted\">${b.slug==='ajax'?'sistemas':'cámaras'} ${e(b.name)}.</span></h1>")
edit('src/views.mjs','<a href="/cookies/">Cookies</a>','<a href="/cookies/" data-cookie-open aria-haspopup="dialog" aria-controls="cookie-dialog">Cookies</a>')
edit('src/views.mjs','</body></html>','${cookieUI()}</body></html>')
edit('scripts/build.mjs',"fs.readFileSync('public/editorial.css')","fs.readFileSync('public/editorial.css'),Buffer.from('\\n'),fs.readFileSync('public/privacy-camera.css')")
edit('scripts/build.mjs',"]):fs.readFileSync(file),hash=","]):Buffer.concat([fs.readFileSync(file),Buffer.from('\\n'),fs.readFileSync('public/cookies.js')]),hash=")
edit('scripts/build.mjs',"title:'Instalación de sistemas '+b.name","title:'Instalación de '+(b.slug==='ajax'?'sistemas ':'cámaras ')+b.name")
prepend('src/metadata.mjs',"import {cameraBrands} from './camera-brands.mjs';\n")
edit('src/metadata.mjs','descriptions[page.url]||page.description','descriptions[page.url]||cameraBrands[brand?.slug]?.description||page.description')
edit('src/legal.mjs',"['Conservación','El preparador","['Preferencia de cookies','Si pulsas «Entendido», guardamos una cookie propia para recordar el cierre del aviso durante 180 días. No identifica personalmente ni se utiliza para seguimiento. Puedes borrarla desde el botón Cookies.'],\n   ['Conservación','El preparador")
edit('src/legal.mjs',"['Buscador y preparador','La búsqueda","['Preferencia del aviso','Al pulsar «Entendido» se guarda la cookie propia <code>rapid_cookie_notice</code>, con el valor <code>v1</code>, durante 180 días. Solo recuerda que has cerrado el aviso; no contiene un identificador personal ni se usa para medir visitas. Se envía únicamente a este sitio, con SameSite=Lax y el atributo Secure en conexiones HTTPS. No se crea antes de tu acción.'],\n   ['Buscador y preparador','La búsqueda")
edit('src/legal.mjs','Con esta configuración no hay cookies opcionales que aceptar o rechazar, por lo que no se muestra un panel de consentimiento. Puedes borrar o bloquear cookies desde los ajustes de tu navegador.','Con esta configuración no hay cookies opcionales que aceptar o rechazar. El botón Cookies abre un panel informativo; «Entendido» recuerda el cierre y «Borrar mi elección» elimina esa preferencia. Cerrar el panel con la X o Escape no guarda nada. También puedes borrar o bloquear cookies desde los ajustes de tu navegador.')
edit('scripts/content-audit.mjs',"topic:'Fichas multimarca',status:'pendiente',detail:'Ajax dispone de guía extensa; Hikvision, Dahua, Uniview, Nivian y EZVIZ aún necesitan ejemplos de soluciones y criterios por gama/modelo, sin copiar catálogos.'","topic:'Fichas multimarca',status:'ampliadas',detail:'Cinco fichas ampliadas con criterios por gama/modelo, ejemplos de proyecto, preguntas frecuentes y fuentes oficiales. Falta evidencia fotográfica propia y confirmar referencias disponibles.'")
edit('tests/browser.py','assert response.status == 200, route','assert response.status == 200, route\n            if page.locator(\'#cookie-notice\').is_visible(): page.locator(\'#cookie-notice [data-cookie-ack]\').click()')
edit('tests/privacy-seo-browser.py','intercepted=[]',"page.locator('#cookie-notice [data-cookie-ack]').click()\n    intercepted=[]")
prepend('tests/site.test.mjs',"import './cookies-brands.test.mjs';\n")
print('Integrated: cookie controls, accurate policy, five camera brands and regression tests.')
