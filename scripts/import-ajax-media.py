"""Importación explícita de fotografías comerciales; no se ejecuta en el build de Netlify."""
from pathlib import Path
from urllib.request import Request, urlopen
from io import BytesIO
from hashlib import sha256
import json
from PIL import Image
ASSETS = [
    ('ajax-keypad-touchscreen.webp', 'https://www.ibdglobal.com/web/image/product.product/18668/image_1024/%5BKEYPAD-TOUCH-WH%5D%20Ajax%20KeyPad%20TouchScreen%20Jeweller.%20Teclado%20T%C3%A1ctil%20con%20Lector%20Inal%C3%A1mbrico.%20Color%20Blanco?unique=2c01636', (1000,1000), 'KeyPad TouchScreen Jeweller blanco: imagen comercial publicada por IBD Global.'),
    ('ajax-bulletcam.webp', 'https://www.alarmalti.es/ajax-bulletcam.png', (600,600), 'BulletCam negra: imagen comercial publicada por AlarmaLti.')
]
manifest=Path('data/media-sources.json')
rows=json.loads(manifest.read_text())
for name,url,expected,description in ASSETS:
    target=Path('public/assets')/name
    existing=next((r for r in rows if r['file']==name),None)
    if target.exists() and existing and sha256(target.read_bytes()).hexdigest()==existing.get('sha256'):
        print('Ya importada:',name);continue
    with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; Rapid asset review)'}),timeout=45) as response:
        raw=response.read(12_000_001)
    if len(raw)>12_000_000:raise ValueError('Imagen demasiado grande: '+name)
    with Image.open(BytesIO(raw)) as image:
        image.load()
        if image.size!=expected:raise ValueError(f'Dimensiones inesperadas: {name} {image.size}, esperadas {expected}')
        if image.mode not in ('RGB','RGBA'):image=image.convert('RGBA' if 'transparency' in image.info else 'RGB')
        image.save(target,format='WEBP',quality=91,method=6)
    rows=[r for r in rows if r['file']!=name]
    rows.append({'file':name,'source':url,'description':description,'width':expected[0],'height':expected[1],'source_sha256':sha256(raw).hexdigest(),'sha256':sha256(target.read_bytes()).hexdigest(),'rights':'Imagen comercial para revisión. Confirmar permiso de uso antes de producción; no es una instalación realizada por Rapid.'})
    print('Importada:',name,target.stat().st_size,'bytes')
manifest.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
