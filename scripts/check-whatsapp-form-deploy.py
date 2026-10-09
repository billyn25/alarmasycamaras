"""Read-only check of deployed form HTML and exact bundled assets. Does not submit data."""
import json,re
from datetime import datetime,timezone
from pathlib import Path
from urllib.request import Request,urlopen
BASE='https://camarasyalarmasrapid.com'
checks=[]
def get(path):
    with urlopen(Request(BASE+path,headers={'User-Agent':'Rapid form deployment check','Cache-Control':'no-cache'}),timeout=20) as response:
        return response.status,response.read()
for path in ['/','/contacto/','/burgos/lerma/','/bizkaia/zalla/','/camaras/']:
    row={'path':path}
    try:
        code,raw=get(path);html=raw.decode('utf8');row['status']=code
        row['fields']=all('name="'+name+'"' in html for name in ['service','province','town','phone','customerName','building','details'])
        row['singleForm']=html.count('data-quote-form')==1
        row['recipient']='data-whatsapp="34641589394"' in html
        row['noindex']='content="noindex,follow"' in html
        if path=='/burgos/lerma/':row['prefilled']='value="Lerma"' in html and 'value="Burgos" selected' in html
        if path=='/bizkaia/zalla/':row['prefilled']='value="Zalla"' in html and 'value="Bizkaia" selected' in html
        if path=='/contacto/':
            for kind,pattern in [('css',r'rel="stylesheet" href="([^"]+)"'),('js',r'<script src="([^"]+)"')]:
                asset=re.search(pattern,html).group(1);_,body=get(asset)
                local=Path('dist'+asset)
                row[kind+'MatchesBuild']=local.exists() and local.read_bytes()==body
    except Exception as error:row['error']=str(error)
    row['updated']=row.get('status')==200 and all(row.get(k) for k in ['fields','singleForm','recipient','noindex']) and row.get('prefilled',True) and row.get('cssMatchesBuild',True) and row.get('jsMatchesBuild',True)
    checks.append(row)
report={'base':BASE,'checkedAt':datetime.now(timezone.utc).isoformat(),'checks':checks,'allUpdated':all(r['updated'] for r in checks),'scope':'Lectura del HTML y assets. No se abre ni se envía WhatsApp.'}
Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/whatsapp-form-deployment.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('WhatsApp form deployment:', 'verified' if report['allUpdated'] else 'not verified yet')
