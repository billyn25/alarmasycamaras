"""Real UI tests: only notice preference is saved. Never sends forms or messages."""
import json,os,time
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
BASE=os.environ.get('RAPID_TEST_BASE','http://127.0.0.1:4173').rstrip('/')
OUT=Path('artifacts');OUT.mkdir(exist_ok=True)
checks=[];errors=[];external=[]
with sync_playwright() as p:
    args={'executable_path':os.environ['RAPID_CHROMIUM']} if os.environ.get('RAPID_CHROMIUM') else {}
    browser=p.chromium.launch(**args)
    for width in [320,390,768,1440]:
        ctx=browser.new_context(viewport={'width':width,'height':844})
        pg=ctx.new_page();pg.on('pageerror',lambda e:errors.append(str(e)))
        pg.on('request',lambda r:external.append(r.url) if urlparse(r.url).netloc!=urlparse(BASE).netloc else None)
        pg.goto(BASE+'/burgos/lerma/',wait_until='networkidle')
        assert pg.locator('#cookie-notice').is_visible();assert ctx.cookies()==[]
        assert pg.evaluate('localStorage.length===0 && sessionStorage.length===0')
        if width in [390,1440]: pg.screenshot(path=str(OUT/f'aviso-cookies-{width}.png'))
        pg.locator('.cookie-trigger').click()
        assert pg.locator('#cookie-dialog').is_visible();assert ctx.cookies()==[]
        assert pg.evaluate('document.activeElement.closest("#cookie-dialog")!==null')
        for _ in range(10):
            pg.keyboard.press('Tab')
            assert pg.evaluate('document.activeElement.closest("#cookie-dialog")!==null'), 'Focus outside modal'
        if width in [390,1440]: pg.screenshot(path=str(OUT/f'panel-cookies-{width}.png'))
        pg.keyboard.press('Escape');assert not pg.locator('#cookie-dialog').is_visible();assert ctx.cookies()==[]
        assert pg.locator('.cookie-trigger').evaluate('el=>el===document.activeElement')
        pg.locator('#cookie-notice [data-cookie-ack]').click()
        saved=ctx.cookies();assert len(saved)==1 and saved[0]['name']=='rapid_cookie_notice'
        assert saved[0]['value']=='v1' and saved[0]['path']=='/' and saved[0]['sameSite']=='Lax'
        assert abs(saved[0]['expires']-time.time()-180*86400)<30
        if BASE.startswith('https:'):assert saved[0]['secure']
        assert not pg.locator('#cookie-notice').is_visible()
        pg.goto(BASE+'/marcas/hikvision/',wait_until='networkidle')
        assert not pg.locator('#cookie-notice').is_visible()
        pg.locator('footer [data-cookie-open]').click()
        assert pg.locator('#cookie-dialog').is_visible()
        pg.locator('[data-cookie-reset]').click();assert ctx.cookies()==[]
        assert pg.locator('#cookie-notice').is_visible()
        pg.locator('#cookie-notice [data-cookie-ack]').click()
        for slug in ['hikvision','dahua','uniview','nivian','ezviz']:
            pg.goto(BASE+'/marcas/'+slug+'/',wait_until='networkidle')
            assert pg.locator('.camera-brand-grid article').count()==3
            assert pg.locator('.camera-brand-faq details').count()==2
            assert pg.locator('main h1').count()==1
            assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(width,slug)
            assert pg.locator('footer a[href^="tel:"]').count()==1
            pg.locator('.camera-brand-faq summary').first.click()
            assert pg.locator('.camera-brand-faq details').first.get_attribute('open') is not None
            if slug=='hikvision' and width in [390,1440]:pg.screenshot(path=str(OUT/f'hikvision-ampliado-{width}.png'),full_page=True)
        pg.goto(BASE+'/camaras/',wait_until='networkidle');assert pg.locator('.camera-planner details').count()==3
        pg.locator('.camera-planner summary').nth(1).click()
        if width in [390,1440]:pg.locator('.camera-planner').screenshot(path=str(OUT/f'orientador-camaras-{width}.png'))
        contact_box=pg.locator('.mobile-contact').bounding_box()
        trigger_box=pg.locator('.cookie-trigger').bounding_box()
        assert trigger_box is not None
        if width<=600: assert contact_box is not None, 'Barra de contacto ausente en móvil'
        if contact_box is not None:
            assert trigger_box['y']+trigger_box['height']<=contact_box['y'], 'Cookies tapa la barra móvil'
        checks.append({'width':width,'brands':5,'cookiePersistence':True,'reopenAndDelete':True,'focusAndEscape':True,'overflow':False})
        ctx.close()
    blocked=browser.new_context()
    blocked.add_init_script("Object.defineProperty(Document.prototype,'cookie',{get(){throw new Error('blocked')},set(){throw new Error('blocked')}})")
    q=blocked.new_page();q.on('pageerror',lambda e:errors.append(str(e)));q.goto(BASE);q.locator('#cookie-notice [data-cookie-ack]').click();assert not q.locator('#cookie-notice').is_visible();blocked.close()
    nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});q=nojs.new_page();q.goto(BASE+'/marcas/nivian/');assert q.locator('.camera-brand-grid article').count()==3
    q.locator('.cookie-trigger').click();assert q.url==BASE+'/cookies/';assert 'rapid_cookie_notice' in q.locator('main').inner_text();nojs.close()
    assert not errors,errors;assert not external,external
    browser.close()
report={'base':BASE,'layouts':checks,'brandLayouts':20,'beforeActionCookies':0,'afterActionCookie':'rapid_cookie_notice=v1; 180 días; SameSite=Lax; Secure en HTTPS','externalRequests':external,'consoleErrors':errors,'blockedCookiesFallback':True,'noJavaScriptFallback':True}
(OUT/'cookies-brands-browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('COOKIES/BRANDS OK:',len(checks),'anchuras, 20 fichas, persistencia, borrado, teclado y sin terceros.')
