"""Facility and municipal content regression; no WhatsApp message is sent."""
import json,os
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright,expect
BASE=os.environ.get('RAPID_TEST_BASE','http://127.0.0.1:4173').rstrip('/')
OUT=Path('artifacts');OUT.mkdir(exist_ok=True)
facilities=json.loads(Path('data/facilities.json').read_text())
routes=['/soluciones/']+['/soluciones/'+f['slug']+'/' for f in facilities]+['/burgos/lerma/','/bizkaia/zalla/','/cantabria/castro-urdiales/','/valladolid/medina-del-campo/','/la-rioja/haro/','/madrid/torrelaguna/']
checks=[];errors=[];external=[]
with sync_playwright() as p:
    args={'executable_path':os.environ['RAPID_CHROMIUM']} if os.environ.get('RAPID_CHROMIUM') else {}
    browser=p.chromium.launch(**args)
    for width in [320,390,768,1440]:
        ctx=browser.new_context(viewport={'width':width,'height':900})
        page=ctx.new_page();page.on('pageerror',lambda error:errors.append(str(error)))
        page.on('request',lambda r:external.append(r.url) if urlparse(r.url).netloc!=urlparse(BASE).netloc else None)
        page.goto(BASE);page.locator('#cookie-notice [data-cookie-ack]').click()
        for route in routes:
            response=page.goto(BASE+route,wait_until='load')
            assert response.status==200,(route,response.status)
            assert page.locator('main h1').count()==1
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,route)
            assert page.locator('footer a[href^="tel:"]').count()==1
            assert page.locator('meta[name="robots"]').get_attribute('content').startswith('noindex')
            if route in routes[-6:]:
                assert page.locator('.municipal-context').count()==1
                assert page.locator('.facility-choice').count()==6
                page.locator('.facility-choice summary').nth(3).click()
                assert page.locator('.facility-choice').nth(3).get_attribute('open') is not None
                assert page.locator('main img').count()==4
            checks.append({'route':route,'width':width,'overflow':False,'h1':1})
        if width in [390,1440]:
            for route,selector,name in [('/soluciones/',None,'soluciones'),('/burgos/lerma/','.municipal-context','lerma-contexto'),('/burgos/lerma/','.facility-selector','lerma-selector'),('/la-rioja/haro/','.municipal-context','haro-contexto'),('/soluciones/casas-y-chalets/',None,'chalets')]:
                page.goto(BASE+route,wait_until='load')
                page.evaluate('document.activeElement?.blur()')
                if selector=='.facility-selector':page.locator('.facility-choice summary').nth(1).click()
                if selector:page.locator(selector).screenshot(path=str(OUT/f'{name}-{width}.png'),style='.site-header,.mobile-contact,.cookie-trigger,.skip-link{visibility:hidden!important}')
                else:
                    page.evaluate("document.querySelectorAll('img').forEach(i=>i.loading='eager')")
                    page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
                    page.evaluate('window.scrollTo(0,0)')
                    page.screenshot(path=str(OUT/f'{name}-{width}.png'),full_page=True)
        page.goto(BASE+'/burgos/lerma/');page.locator('.facility-choice summary').nth(1).click()
        page.locator('.facility-choice').nth(1).locator('a').nth(1).click()
        page.wait_for_url('**/contacto/**')
        expect(page.locator('[name="town"]')).to_have_value('Lerma')
        expect(page.locator('[name="building"]')).to_have_value('Casa o chalet')
        page.goto(BASE+'/contacto/?inmueble=%3Cscript%3Ebad%3C%2Fscript%3E')
        expect(page.locator('[name="building"]')).to_have_value('Vivienda')
        ctx.close()
    nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':900})
    page=nojs.new_page();page.goto(BASE+'/burgos/lerma/')
    assert page.locator('.municipal-context').count()==1
    assert page.locator('.facility-choice').count()==6
    page.locator('.facility-choice summary').first.click()
    assert page.locator('.facility-choice').first.get_attribute('open') is not None
    assert not errors,errors;assert not external,external
    nojs.close();browser.close()
report={'base':BASE,'checks':checks,'layouts':len(checks),'municipalContexts':6,'newSolutionPages':5,'preservedTownAndBuilding':True,'withoutJavaScript':True,'consoleErrors':errors,'externalRequests':external}
(OUT/'facilities-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('FACILITIES OK:',len(checks),'layouts; native HTML, municipality and building preserved; no third-party requests.')
