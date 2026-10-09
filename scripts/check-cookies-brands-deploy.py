"""Read-only publication check. A green build does not by itself confirm deployment."""
from pathlib import Path
from urllib.request import Request,urlopen
from datetime import datetime,timezone
import json,re,time
BASE='https://camarasyalarmasrapid.com'
OUT=Path('artifacts');OUT.mkdir(exist_ok=True)
routes={'/':'cookie-dialog','/cookies/':'rapid_cookie_notice','/camaras/':'camera-planner','/marcas/hikvision/':'camera-brand-content','/marcas/nivian/':'NV-CAM01-SOLAR4G','/burgos/lerma/':'cookie-trigger'}
report={'base':BASE,'checkedAt':None,'matchesBuild':False,'pages':[]}
def get(url):
 with urlopen(Request(url,headers={'User-Agent':'Rapid release verification','Cache-Control':'no-cache'}),timeout=12) as r:return r.status,r.read().decode('utf-8')
for attempt in range(5):
 rows=[]
 for route,marker in routes.items():
  try:
   status,html=get(BASE+route+'?revision=cookies-marcas')
   local=Path('dist')/(route.strip('/')+'/index.html' if route!='/' else 'index.html')
   source=local.read_text()
   css=re.search(r'<link rel="stylesheet" href="([^"]+)"',html)[1]
   js=re.search(r'<script src="([^"]+)"',html)[1]
   wanted_css=re.search(r'<link rel="stylesheet" href="([^"]+)"',source)[1]
   wanted_js=re.search(r'<script src="([^"]+)"',source)[1]
   rows.append({'route':route,'status':status,'contentPresent':marker in html,'assetsMatchBuild':css==wanted_css and js==wanted_js,'noindex':'content="noindex,follow"' in html})
  except Exception as ex:rows.append({'route':route,'error':str(ex)})
 report['pages']=rows
 report['matchesBuild']=all(r.get('contentPresent') and r.get('assetsMatchBuild') and r.get('noindex') for r in rows)
 if report['matchesBuild']:break
 if attempt<4:time.sleep(10)
report['checkedAt']=datetime.now(timezone.utc).isoformat()
(OUT/'cookies-marcas-deployment.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('NETLIFY:','contenido y assets nuevos verificados' if report['matchesBuild'] else 'publicación nueva todavía no confirmada; consultar informe')
