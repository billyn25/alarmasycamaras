"""Regressions for local landing pages and verified Ajax green accents."""
from pathlib import Path
import json, os
from playwright.sync_api import sync_playwright
BASE=os.environ.get('RAPID_TEST_BASE','http://127.0.0.1:4173').rstrip('/')
OUT=Path('artifacts'); OUT.mkdir(exist_ok=True)
checks=[]; errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    longest=max([r for r in json.loads(Path('.cache/pages.json').read_text()) if r.get('townId')],key=lambda r:len(r['town']))['url']
    routes=['/burgos/lerma/','/bizkaia/zalla/',longest]
    for width in [320,390,600,768,1024,1440]:
        page.set_viewport_size({'width':width,'height':900})
        for route in routes:
            response=page.goto(BASE+route,wait_until='load')
            assert response.status==200,(route,response.status)
            assert page.locator('h1').count()==1
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,route)
            page.evaluate("document.querySelectorAll('img').forEach(x=>x.loading='eager')")
            page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
            photos=page.locator('main img').evaluate_all('els=>els.map(i=>i.getAttribute("src"))')
            assert len(photos)==len(set(photos))==7,(width,route,photos)
            assert page.locator('.local-services article').count()==3
            assert page.locator('.local-ecosystem-options li').count()==6
            assert page.locator('.local-usage-grid article').count()==3
            assert page.locator('footer a[href^="tel:"]').count()==1
            assert page.locator('.local-hero .button').evaluate('el=>getComputedStyle(el).backgroundColor')=='rgb(90, 228, 170)'
            for img in page.locator('main img').all():
                assert img.evaluate('el=>getComputedStyle(el).objectFit')=='contain'
                assert img.get_attribute('alt')
            checks.append({'width':width,'route':route,'photos':4,'overflow':False,'footerPhones':1})
        if width in [390,1440]:
            page.goto(BASE+'/burgos/lerma/',wait_until='load')
            page.evaluate("document.querySelectorAll('img').forEach(x=>x.loading='eager')")
            page.wait_for_function('Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)')
            page.screenshot(path=str(OUT/f'lerma-{width}.png'),full_page=True)
            page.locator('.local-hero').screenshot(path=str(OUT/f'lerma-hero-{width}.png'))
            page.locator('.local-services').screenshot(path=str(OUT/f'lerma-servicios-{width}.png'))
            page.locator('.local-ecosystem').screenshot(path=str(OUT/f'lerma-jeweller-{width}.png'))
    page.set_viewport_size({'width':1440,'height':960})
    page.goto(BASE,wait_until='load')
    page.wait_for_function('document.querySelector(".hero-product").complete')
    assert page.locator('.hero .hero-whatsapp').evaluate('el=>getComputedStyle(el).backgroundColor')=='rgb(90, 228, 170)'
    page.screenshot(path=str(OUT/'home-verde-1440.png'))
    nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
    q=nojs.new_page();q.goto(BASE+'/burgos/lerma/')
    assert q.locator('main img').count()==7
    assert q.locator('.local-ecosystem-options li').count()==6
    assert q.locator('meta[name=robots]').get_attribute('content').startswith('noindex')
    assert not errors,errors
    nojs.close();browser.close()
report={'checks':checks,'passed':len(checks),'noJavaScript':'Photos and accessories present in HTML','consoleErrors':errors}
(OUT/'local-media-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('LOCAL BROWSER OK:',len(checks),'layouts; seven distinct images; green verified; no overflow.')
