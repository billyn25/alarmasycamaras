"""Comprueba comportamiento y documentos; no envía mensajes ni acepta consentimientos."""
import json, os
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from playwright.sync_api import sync_playwright
BASE=os.environ.get('RAPID_TEST_BASE','http://127.0.0.1:4173').rstrip('/')
OUT=Path('artifacts');OUT.mkdir(exist_ok=True)
routes=['/aviso-legal/','/privacidad/','/cookies/','/guias/','/guias/alarmas-sin-cuotas/','/guias/vision-nocturna-y-grabacion/','/guias/seguridad-segunda-residencia/','/guias/presupuesto-instalacion/','/contacto/']
checks=[];errors=[];outbound=[];set_cookies=[]
with sync_playwright() as p:
    launch={'executable_path':os.environ['RAPID_CHROMIUM']} if os.environ.get('RAPID_CHROMIUM') else {}
    browser=p.chromium.launch(**launch)
    context=browser.new_context()
    page=context.new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:outbound.append(r.url) if urlparse(r.url).netloc!=urlparse(BASE).netloc else None)
    page.on('response',lambda r:set_cookies.append(r.url) if r.header_value('set-cookie') else None)
    for width in [320,390,768,1440]:
        page.set_viewport_size({'width':width,'height':900})
        for route in routes:
            r=page.goto(BASE+route,wait_until='load')
            assert r.status==200,(route,r.status)
            assert page.locator('h1').count()==1,route
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,route)
            assert page.locator('footer a[href^="tel:"]').count()==1
            assert page.locator('meta[name=robots]').get_attribute('content').startswith('noindex')
            assert page.evaluate('localStorage.length===0 && sessionStorage.length===0')
            assert context.cookies()==[],route
            checks.append({'route':route,'width':width,'overflow':False,'cookies':0})
        if width in [390,1440]:
            for route,name in [('/cookies/','cookies'),('/privacidad/','privacidad'),('/guias/','guias')]:
                page.goto(BASE+route,wait_until='load');page.screenshot(path=str(OUT/f'{name}-{width}.png'),full_page=True)
    page.goto(BASE+'/contacto/?pueblo=Lerma%2C%20Burgos',wait_until='load')
    assert page.locator('#quote-town').input_value()=='Lerma, Burgos'
    assert page.locator('.privacy-summary').is_visible()
    assert not outbound,outbound
    assert not set_cookies,set_cookies
    intercepted=[]
    def block_message(route):
        intercepted.append(route.request.url);route.abort()
    page.route('https://wa.me/**',block_message)
    page.locator('button[data-whatsapp]').click()
    page.wait_for_timeout(150)
    assert len(intercepted)==1
    assert 'Lerma, Burgos' in parse_qs(urlparse(intercepted[0]).query).get('text',[''])[0]
    nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});q=nojs.new_page()
    q.goto(BASE+'/guias/');assert q.locator('.guide-card').count()==4
    q.goto(BASE+'/cookies/');assert q.locator('h1').inner_text()=='Política de cookies'
    assert not errors,errors
    browser.close()
report={'base':BASE,'passedLayouts':len(checks),'checks':checks,'thirdPartyRequestsBeforeAction':[],'cookiesObservedBeforeAction':0,'storageKeysObserved':0,'whatsappTest':'Interceptado; no se envía ningún mensaje','consoleErrors':errors,'scope':'Rutas muestreadas en navegador. No certifica condiciones legales ni todas las configuraciones del proveedor.'}
(OUT/'privacy-seo-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('PRIVACY/SEO BROWSER OK:',len(checks),'layouts; sin cookies ni peticiones de terceros antes de actuar.')
