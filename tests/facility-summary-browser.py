"""Guard against global FAQ styles rotating or clipping nested facility headings."""
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright
base=os.environ.get('RAPID_TEST_BASE','http://127.0.0.1:4173').rstrip('/')
checks=[]
with sync_playwright() as p:
    browser=p.chromium.launch()
    for width in [320,390,768,1440]:
        page=browser.new_page(viewport={'width':width,'height':900})
        page.goto(base+'/burgos/lerma/',wait_until='load')
        page.locator('#cookie-notice [data-cookie-ack]').click()
        cards=page.locator('.facility-choice')
        for index in range(6):
            card=cards.nth(index)
            for opened in [False,True]:
                card.evaluate('(el,opened)=>el.open=opened',opened)
                state=card.evaluate('''el=>{const summary=el.querySelector('summary');const r=summary.getBoundingClientRect();const text=summary.children[1];return {rotation:getComputedStyle(text).transform,briefRotation:getComputedStyle(text.querySelector('.facility-brief')).transform,clipped:text.scrollWidth>text.clientWidth+1,contained:[...summary.children].every(c=>{const b=c.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1}),text:text.textContent}}''')
                assert state['rotation']=='none',state
                assert state['briefRotation']=='none',state
                assert not state['clipped'],state
                assert state['contained'],state
                checks.append({'width':width,'type':index,'open':opened,'rotation':False,'clipped':False})
            card.evaluate('el=>el.open=false')
        page.close()
    browser.close()
Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/facility-summary-report.json').write_text(json.dumps({'checks':checks,'passed':len(checks)},ensure_ascii=False,indent=2))
print('FACILITY SUMMARY OK:',len(checks),'open/closed checks with readable, unrotated text.')
