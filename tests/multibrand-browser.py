from pathlib import Path
import os,json
from playwright.sync_api import sync_playwright
BASE=os.environ.get('RAPID_TEST_BASE','http://127.0.0.1:4173').rstrip('/');OUT=Path('artifacts');OUT.mkdir(exist_ok=True);checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 for width in [390,1440]:
  ctx=browser.new_context(viewport={'width':width,'height':900});page=ctx.new_page()
  for path in ['/','/camaras/','/burgos/lerma/']:
   page.goto(BASE+path,wait_until='networkidle');box=page.locator('.multi-camera-section').first;assert box.is_visible();assert box.locator('.multi-camera-card').count()==3;srcs=box.locator('img').evaluate_all("els=>els.map(e=>e.getAttribute('src'))");assert len(set(srcs))==3;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
   if path=='/' and width==1440:box.screenshot(path=str(OUT/'multimarca-home-1440.png'))
   if path=='/burgos/lerma/' and width==390:box.screenshot(path=str(OUT/'multimarca-lerma-390.png'))
   checks.append({'width':width,'path':path,'cards':3})
  ctx.close()
 browser.close()
(OUT/'multibrand-browser-report.json').write_text(json.dumps({'checks':checks},indent=2))