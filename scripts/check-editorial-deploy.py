"""Lectura del despliegue público. Un CI correcto no se confunde con deploy actualizado."""
import json,time
from pathlib import Path
from urllib.request import Request,urlopen
BASE='https://camarasyalarmasrapid.com'
checks={ '/aviso-legal/':['propiedad de R.F.G.'], '/privacidad/':['Política de privacidad','R.F.G.'], '/cookies/':['Política de cookies','Navegación sin seguimiento'], '/guias/':['Elegir bien también'], '/guias/alarmas-sin-cuotas/':['Qué significa autogestionar'] }
report={'base':BASE,'checkedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'status':'not_confirmed','pages':[]}
for attempt in range(4):
    pages=[]
    for path,phrases in checks.items():
        try:
            with urlopen(Request(BASE+path,headers={'User-Agent':'Rapid-QA/1.0'}),timeout=12) as r:
                text=r.read(500000).decode('utf-8');pages.append({'path':path,'httpStatus':r.status,'currentContent':all(s in text for s in phrases),'noindex':'noindex' in text,'setCookie':bool(r.headers.get('Set-Cookie'))})
        except Exception as err:pages.append({'path':path,'currentContent':False,'error':str(err)[:240]})
    report['pages']=pages;report['attempts']=attempt+1
    if all(row['currentContent'] for row in pages):report['status']='verified';break
    if attempt<3:time.sleep(12)
Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/editorial-deployment-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('EDITORIAL PUBLIC DEPLOY:',report['status'])
