from pathlib import Path
from urllib.request import Request,urlopen
from urllib.error import HTTPError,URLError
from io import BytesIO
from hashlib import sha256
import json
from PIL import Image,ImageOps

ASSETS=[
('hikvision-colorvu.webp',[
 'https://www.megateh.eu/files/products/00/48/85/ds-2cd2347g2-lu-28.png',
 'https://hiksurveillance.co.za/cdn/shop/products/23x7g1_20g2-1000x1000_1000x.jpg?v=1621536616',
 'https://www.thesecurityoutlet.co.nz/cdn/shop/files/Hikvision_DS-2CD2387G2-LSU-SL-4MM_Pro-series_ColorVu_AcuSense_Gen_2_Deep-Learnin_-_The_Security_Outlet_-_-_-3930153.png?v=1727420722&width=1445'
],'Hikvision ColorVu turret, imagen comercial de producto.'),
('dahua-wizsense.webp',[
 'https://aio.lv/img/cache/product/7710102/66998110_large.webp',
 'https://cdn11.bigcommerce.com/s-5pb63bdidh/images/stencil/1280x1280/products/4132/37616/28DH-IPC-HDW3866EMP-S-AUS_front__90420.1758675415.1280.1280_1765522230__38779.1769138534.jpg?c=1&imbypass=on',
 'https://ecorridor.com.au/cdn/shop/products/57_70261757-368a-4da7-8096-0f4c81664415_1200x1200.png?v=1710348018'
],'Dahua WizSense turret, imagen comercial de producto.'),
('uniview-colorhunter.webp',[
 'https://global.uniview.com/es/res/202608/24/20260824_2374576_dccd647d-392f-49c8-9089-956914e68944_1051531_798522_0.png',
 'https://cdn.connectec.uk/uploads/products/IPC3634SE-ADF2840K-WL-I0.png?canvas.height=1000&canvas.opacity=0&canvas.width=1200&scale.height=1000&scale.width=1200',
 'https://cctvguru.com.au/cdn/shop/files/Uniview_UNV_IPC3626LE-ADF28K-WP_6MP_OwlView_ColorHunter_Turret_Camera_Front_View.jpg?v=1756469374'
],'Uniview ColorHunter turret, imagen comercial de producto.')
]

def fetch(urls,name):
 errors=[]
 for url in urls:
  try:
   print('Probando',name,url)
   req=Request(url,headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36','Accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'})
   with urlopen(req,timeout=30) as response:
    raw=response.read(12_000_001)
   if raw and len(raw)<=12_000_000:
    return url,raw
  except Exception as exc:
   errors.append(type(exc).__name__+': '+str(exc))
 raise RuntimeError(name+' sin fuente descargable: '+' | '.join(errors))

manifest=Path('data/media-sources.json');rows=json.loads(manifest.read_text())
for name,urls,description in ASSETS:
 url,raw=fetch(urls,name)
 with Image.open(BytesIO(raw)) as im:
  im.load();source_size=im.size;im=im.convert('RGB');canvas=Image.new('RGB',(900,900),'white')
  fitted=ImageOps.contain(im,(820,820),method=Image.Resampling.LANCZOS)
  canvas.paste(fitted,((900-fitted.width)//2,(900-fitted.height)//2))
  out=Path('public/assets')/name;canvas.save(out,'WEBP',quality=90,method=6)
 rows=[r for r in rows if r.get('file')!=name]
 rows.append({'file':name,'source':url,'description':description,'width':900,'height':900,'source_dimensions':list(source_size),'source_sha256':sha256(raw).hexdigest(),'sha256':sha256(out.read_bytes()).hexdigest(),'rights':'Imagen comercial para revisión. Confirmar permiso de uso antes de producción; no representa un trabajo realizado por Rapid.'})
 print('Importada',name,'desde',url,source_size)
manifest.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
