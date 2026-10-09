from pathlib import Path
from urllib.request import Request,urlopen
from io import BytesIO
from hashlib import sha256
import json
from PIL import Image,ImageOps

URL='https://img.mta.ua/image/cache/data/foto/z634/634766/photos/UNV-IPC3614LEADF28KG-01-600x600.jpg'
req=Request(URL,headers={'User-Agent':'Mozilla/5.0 (compatible; Rapid media review)'})
with urlopen(req,timeout=45) as r:
    raw=r.read(8_000_001)
if not raw or len(raw)>8_000_000:
    raise RuntimeError('Imagen Uniview inválida')

with Image.open(BytesIO(raw)) as src:
    src.load()
    original=src.size
    rgb=src.convert('RGB')
    # Recorta solo margen blanco exterior; no incluye ningún marco interior.
    inv=ImageOps.invert(rgb.convert('L'))
    bbox=inv.point(lambda p: 255 if p>8 else 0).getbbox()
    if not bbox:
        raise RuntimeError('No se detecta producto')
    product=rgb.crop(bbox)
    canvas=Image.new('RGB',(900,900),'white')
    fitted=ImageOps.contain(product,(700,700),method=Image.Resampling.LANCZOS)
    canvas.paste(fitted,((900-fitted.width)//2,(900-fitted.height)//2))
    out=Path('public/assets/uniview-colorhunter.webp')
    canvas.save(out,'WEBP',quality=92,method=6)

# Comprobación: fondo completamente blanco en todo el perímetro.
check=Image.open(out).convert('RGB')
w,h=check.size
edge=[check.getpixel((x,10)) for x in range(0,w,30)] + [check.getpixel((x,h-11)) for x in range(0,w,30)] + [check.getpixel((10,y)) for y in range(0,h,30)] + [check.getpixel((w-11,y)) for y in range(0,h,30)]
assert all(min(px)>248 for px in edge), 'El nuevo recurso conserva borde oscuro'

manifest=Path('data/media-sources.json')
rows=json.loads(manifest.read_text())
for row in rows:
    if row.get('file')=='uniview-colorhunter.webp':
        row.update({
          'source':URL,
          'description':'Uniview IPC3614LE-ADF28K-G, imagen comercial de producto sobre fondo blanco limpio.',
          'source_dimensions':list(original),
          'source_sha256':sha256(raw).hexdigest(),
          'sha256':sha256(out.read_bytes()).hexdigest(),
          'rights':'Imagen comercial para revisión. Confirmar permiso de uso antes de producción; no representa un trabajo realizado por Rapid.'
        })
        break
else:
    raise RuntimeError('No existe Uniview en el manifiesto')
manifest.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print('Uniview sustituida',original,sha256(out.read_bytes()).hexdigest())
