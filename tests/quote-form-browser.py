"""Real form tests. WhatsApp navigation is intercepted; no message is sent."""
import json, os
from pathlib import Path
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('RAPID_TEST_BASE','http://127.0.0.1:4173').rstrip('/')
OUT=Path('artifacts');OUT.mkdir(exist_ok=True)
checks=[];errors=[];sent=[]
with sync_playwright() as p:
    args={'executable_path':os.environ['RAPID_CHROMIUM']} if os.environ.get('RAPID_CHROMIUM') else {}
    browser=p.chromium.launch(**args)
    for width in [320,390,768,1440]:
        ctx=browser.new_context(viewport={'width':width,'height':900})
        page=ctx.new_page();outbound=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:outbound.append(r.url) if urlparse(r.url).netloc!=urlparse(BASE).netloc else None)
        for route in ['/','/contacto/','/burgos/lerma/','/bizkaia/zalla/','/camaras/','/burgos/']:
            page.goto(BASE+route,wait_until='networkidle')
            form=page.locator('[data-quote-form]');expect(form).to_be_visible()
            assert form.count()==1
            assert page.locator('main h1').count()==1
            assert page.locator('footer a[href^="tel:"]').count()==1
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,route)
            assert ctx.cookies()==[]
            assert page.evaluate('localStorage.length===0 && sessionStorage.length===0')
            if route=='/burgos/lerma/':
                expect(page.locator('[name=town]')).to_have_value('Lerma');expect(page.locator('[name=province]')).to_have_value('Burgos')
            if route=='/bizkaia/zalla/':
                expect(page.locator('[name=town]')).to_have_value('Zalla');expect(page.locator('[name=province]')).to_have_value('Bizkaia')
            if route=='/camaras/':expect(page.locator('[name=service]')).to_have_value('Cámaras de seguridad')
            checks.append({'route':route,'width':width,'form':1,'overflow':False})
        page.goto(BASE+'/contacto/?pueblo=Lerma%2C%20Burgos&inmueble=Casa%20o%20chalet',wait_until='networkidle')
        expect(page.locator('#quote-town')).to_have_value('Lerma')
        expect(page.locator('#quote-province')).to_have_value('Burgos')
        expect(page.locator('#quote-building')).to_have_value('Casa o chalet')
        page.locator('#cookie-notice [data-cookie-ack]').click()
        # Province change clears stale town; free input is also allowed.
        page.locator('#quote-province').select_option('Bizkaia');expect(page.locator('#quote-town')).to_have_value('')
        page.wait_for_function("document.querySelector('#quote-town-options option[value=Zalla]')!==null")
        page.locator('#quote-town').fill('Zalla');page.locator('#quote-phone').fill('123')
        page.locator('button[data-whatsapp]').click();assert not outbound
        assert not page.locator('#quote-phone').evaluate('e=>e.validity.valid')
        page.locator('#quote-phone').fill('+34 600 123 456')
        page.locator('#quote-name').fill('Prueba & revisión')
        page.locator('#quote-details').fill('Alarma para casa y dos cámaras. Accesos: puerta y garaje.')
        page.locator('.quote-preview summary').click()
        text=page.locator('[data-quote-preview]').inner_text()
        assert 'Provincia: Bizkaia' in text and 'Municipio o pueblo: Zalla' in text
        assert 'Teléfono de contacto: +34600123456' in text
        assert 'Prueba & revisión' in text
        assert not outbound
        captured=[]
        def intercept(route):
            captured.append(route.request.url)
            route.fulfill(status=200,content_type='text/plain',body='Prueba interceptada. No se envia el mensaje.')
        page.route('https://wa.me/**',intercept)
        page.locator('button[data-whatsapp]').click()
        page.wait_for_timeout(150)
        assert len(captured)==1,captured
        url=urlparse(captured[0]);message=parse_qs(url.query)['text'][0]
        assert url.netloc=='wa.me' and url.path=='/34641589394'
        assert '+34600123456' in message and 'Zalla' in message and 'Prueba & revisión' in message
        sent.append({'width':width,'intercepted':True,'correctRecipient':True,'customerPhoneInMessage':True})
        if width in [390,1440]:
            for route,selector,name in [('/burgos/lerma/','.quote-section','formulario-lerma'),('/contacto/','.contact-form-panel','formulario-contacto')]:
                page.goto(BASE+route,wait_until='networkidle')
                page.locator(selector).screenshot(path=str(OUT/f'{name}-{width}.png'),style='.site-header,.mobile-contact,.cookie-trigger,.skip-link{visibility:hidden!important}')
            page.goto(BASE+'/burgos/lerma/',wait_until='networkidle');page.locator('.quote-section').scroll_into_view_if_needed();page.screenshot(path=str(OUT/f'formulario-en-pagina-{width}.png'))
        ctx.close()
    ctx=browser.new_context();page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(BASE+'/contacto/?pueblo=%3Cscript%3Ealert(1)%3C/script%3E&provincia=Vizcaya&inmueble=%3Cscript%3Ex%3C/script%3E',wait_until='networkidle')
    expect(page.locator('[name=province]')).to_have_value('Bizkaia');expect(page.locator('[name=building]')).to_have_value('Vivienda')
    assert not page.locator('form script').count()
    for valid in ['600123456','+34 600 123 456','34600123456','0034 600123456','+44 7700 900123']:
        page.locator('[name=phone]').fill(valid);assert page.locator('[name=phone]').evaluate('e=>e.validity.valid'),valid
    for invalid in ['abc600123456','123456789','++34600123456','+34600123','6'*25]:
        page.locator('[name=phone]').fill(invalid);assert not page.locator('[name=phone]').evaluate('e=>e.validity.valid'),invalid
    page.locator('[name=town]').fill('   ');assert not page.locator('[name=town]').evaluate('e=>e.validity.valid')
    ctx.close()
    nojs=browser.new_context(java_script_enabled=False);page=nojs.new_page();page.goto(BASE+'/burgos/lerma/')
    assert page.locator('noscript a[href^="https://wa.me/"]').count()==1
    assert not page.locator('[data-quote-form]').is_visible()
    nojs.close();assert not errors,errors;browser.close()
report={'base':BASE,'layouts':checks,'passedLayouts':len(checks),'whatsapp':sent,'consoleErrors':errors,'noCustomerStorage':True,'phoneValidation':True,'freeTextLocalities':True,'noJavaScriptFallback':True,'scope':'WhatsApp interceptado. No se envian mensajes ni consultas.'}
(OUT/'quote-form-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('WHATSAPP FORM OK:',len(checks),'layouts; location, validation and correct recipient; no actual messages.')
