"""Read-only public deployment check. A green build is not itself a deployed release."""
import json,re
from pathlib import Path
from datetime import datetime,timezone
from urllib.request import Request,urlopen
BASE='https://camarasyalarmasrapid.com'
checks=[]
paths={'/soluciones/':['Tu espacio marca la diferencia.','/soluciones/naves-y-almacenes/'],'/soluciones/casas-y-chalets/':['Proteger por zonas, no llenar la parcela','inmueble=Casa'],'/burgos/lerma/':['municipal-context','Castrillo de Solarana','facility-choice'],'/bizkaia/zalla/':['municipal-context','Otxaran','facility-choice'],'/la-rioja/haro/':['municipal-context','Barrio de la Estación','facility-choice']}
for path,markers in paths.items():
    row={'path':path}
    try:
        with urlopen(Request(BASE+path,headers={'User-Agent':'Rapid deployment audit','Cache-Control':'no-cache'}),timeout=20) as response:
            text=response.read().decode('utf8');row['status']=response.status
        row['matches']=all(m in text for m in markers)
        if path=='/burgos/lerma/':
            css=re.search(r'rel="stylesheet" href="([^"]+)"',text).group(1)
            with urlopen(BASE+css,timeout=20) as response:style=response.read().decode('utf8')
            row['cssPresent']='.facility-choice' in style and '.municipal-context' in style
    except Exception as error:row.update(matches=False,error=str(error))
    checks.append(row)
report={'base':BASE,'checkedAt':datetime.now(timezone.utc).isoformat(),'checks':checks,'allUpdated':all(r.get('matches') and r.get('cssPresent',True) for r in checks)}
Path('artifacts').mkdir(exist_ok=True)
Path('artifacts/facilities-deployment.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('Public facility deployment:', 'updated' if report['allUpdated'] else 'not verified yet')
