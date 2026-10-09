from pathlib import Path
from urllib.request import Request,urlopen
from io import BytesIO
from hashlib import sha256
import json
from PIL import Image,ImageOps
ASSETS=[
('hikvision-colorvu.webp','https://www.megateh.eu/files/products/00/48/85/ds-2cd2347g2-lu-28.png','Hikvision ColorVu turret, imagen comercial de producto publicada por Hik Surveillance South Africa.'),
('dahua-wizsense.webp','https://cdn11.bigcommerce.com/s-5pb63bdidh/images/stencil/1280x1280/products/4132/37616/28DH-IPC-HDW3866EMP-S-AUS_front__90420.1758675415.1280.1280_1765522230__38779.1769138534.jpg?c=1&imbypass=on','Dahua WizSense turret, imagen comercial de producto publicada por Bitek.'),
('uniview-colorhunter.webp','https://global.uniview.com/es/res/202608/24/20260824_2374576_dccd647d-392f-49c8-9089-956914e68944_1051531_798522_0.png','Uniview turret, imagen de producto publicada por Uniview.') ]
manifest=Path('data/media-sources.json');rows=json.loads(manifest.read_text())
for name,url,description in ASSETS:
 req=Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; Rapid media review)'})
 with urlopen(req,timeout=45) as response: raw=response.read(12000001)
 if not raw or len(raw)>12000000: raise ValueError('Imagen inválida: '+name)
 with Image.open(BytesIO(raw)) as im:
  im.load();source_size=im.size;im=im.convert('RGB');canvas=Image.new('RGB',(900,900),'white');fitted=ImageOps.contain(im,(820,820),method=Image.Resampling.LANCZOS);canvas.paste(fitted,((900-fitted.width)//2,(900-fitted.height)//2));out=Path('public/assets')/name;canvas.save(out,'WEBP',quality=90,method=6)
 rows=[r for r in rows if r.get('file')!=name];rows.append({'file':name,'source':url,'description':description,'width':900,'height':900,'source_dimensions':list(source_size),'source_sha256':sha256(raw).hexdigest(),'sha256':sha256(out.read_bytes()).hexdigest(),'rights':'Imagen comercial para revisión. Confirmar permiso de uso antes de producción; no representa un trabajo realizado por Rapid.'})
manifest.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')