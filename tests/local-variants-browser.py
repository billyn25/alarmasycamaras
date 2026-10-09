from pathlib import Path
import json,os
from playwright.sync_api import sync_playwright
BASE=os.environ.get('RAPID_TEST_BASE','http://127.0.0.1:4173').rstrip('/')
OUT=Path('artifacts');OUT.mkdir(exist_ok=True);checks=[]
routes=['/burgos/lerma/','/bizkaia/zalla/','/madrid/navalcarnero/','/la-rioja/ezcaray/']
with sync_playwright() as p:
 browser=p.chromium.launch()
 for width in [390,1440]:
  context=browser.new_context(viewport={'width':width,'height':900});page=context.new_page()
  for route in routes:
   page.goto(BASE+route,wait_until='networkidle');section=page.locator('.local-variant-section');assert section.count()==1;assert section.locator('.local-variant-card').count()==5;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');checks.append({'route':route,'width':width,'blocks':5})
  context.close()
 browser.close()
(OUT/'local-variants-browser-report.json').write_text(json.dumps({'checks':checks},indent=2))
print('LOCAL VARIANTS OK:',len(checks),'layouts')
