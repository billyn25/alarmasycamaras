"""Pruebas funcionales y capturas de la web real. No contactan WhatsApp."""
from pathlib import Path
import json
from urllib.parse import unquote
from playwright.sync_api import sync_playwright
BASE = 'http://127.0.0.1:4173'
OUT = Path('artifacts')
OUT.mkdir(exist_ok=True)
checks = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    routes = ['/', '/alarmas/', '/camaras/', '/alarmas-y-camaras/', '/marcas/', '/marcas/ajax/', '/marcas/hikvision/', '/zonas/', '/burgos/', '/burgos/lerma/', '/bizkaia/zalla/', '/contacto/', '/aviso-legal/']
    for width in [390, 768, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        for route in routes:
            response = page.goto(BASE + route, wait_until='networkidle')
            assert response.status == 200, route
            assert page.locator('h1').count() == 1, route
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), f'Overflow {width}: {route}'
            page.evaluate("document.querySelectorAll('img').forEach(img => img.loading = 'eager')")
            page.wait_for_function('Array.from(document.images).every(img => img.complete && img.naturalWidth > 0)')
            assert page.locator('meta[name="robots"]').get_attribute('content').startswith('noindex')
            checks.append(f'{width}px {route}: HTML, imágenes y anchura OK')
        page.goto(BASE, wait_until='networkidle')
        page.evaluate("document.querySelectorAll('img').forEach(img => img.loading = 'eager')")
        page.wait_for_function('Array.from(document.images).every(img => img.complete && img.naturalWidth > 0)')
        page.screenshot(path=str(OUT / f'home-{width}.png'), full_page=True)
    page.set_viewport_size({'width': 390, 'height': 844})
    page.goto(BASE)
    page.locator('.menu-toggle').click()
    assert page.locator('#main-nav').is_visible()
    page.keyboard.press('Escape')
    assert not page.locator('#main-nav').is_visible()
    page.goto(BASE + '/zonas/')
    search = page.locator('#town-search')
    search.fill('l')
    page.wait_for_timeout(220)
    assert page.locator('#town-results a').count() == 0
    search.fill('lerma')
    page.locator('#town-results a[href="/burgos/lerma/"]').wait_for()
    page.locator('[data-clear-search]').click()
    assert search.input_value() == ''
    search.fill('ññzzzzzz')
    page.wait_for_function("document.querySelector('.search-status').textContent.includes('No hay')")
    page.goto(BASE + '/burgos/')
    page.locator('[data-list-filter]').fill('lerma')
    page.wait_for_timeout(250)
    assert page.locator('[data-town-list] a:visible').count() == 1
    page.locator('[data-list-filter]').fill('zzzzzz')
    page.wait_for_timeout(250)
    assert page.locator('[data-no-results]').is_visible()
    page.goto(BASE + '/contacto/?pueblo=Lerma%2C%20Burgos')
    assert page.locator('#quote-town').input_value() == 'Lerma, Burgos'
    captured = []
    def stop_whatsapp(route):
        captured.append(route.request.url)
        route.fulfill(status=200, content_type='text/plain', body='WhatsApp interceptado en la prueba; no enviado.')
    page.route('https://wa.me/**', stop_whatsapp)
    page.locator('button[type="submit"]').click()
    page.wait_for_timeout(300)
    assert captured and 'Lerma' in unquote(captured[0])
    response = page.goto(BASE + '/no-existe-esta-ruta/')
    assert response.status == 404
    checks.extend(['Menú móvil y Escape OK', 'Buscador global, limpiar y vacío OK', 'Filtro provincial OK', 'WhatsApp preparado, interceptado y no enviado', '404 real OK'])
    assert not errors, errors
    nojs = browser.new_context(java_script_enabled=False, viewport={'width':390,'height':844})
    np = nojs.new_page()
    np.goto(BASE + '/burgos/')
    assert np.locator('[data-town-list] a').count() == 371
    assert np.locator('#main-nav').is_visible()
    assert np.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
    checks.append('371 enlaces de Burgos disponibles sin JavaScript')
    nojs.close()
    context.close()
    browser.close()
(OUT / 'browser-report.json').write_text(json.dumps({'checks':checks,'passed':len(checks),'consoleErrors':errors},ensure_ascii=False,indent=2))
print(f'BROWSER OK: {len(checks)} comprobaciones, sin errores JavaScript.')
