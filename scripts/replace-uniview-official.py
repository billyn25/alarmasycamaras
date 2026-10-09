from pathlib import Path
from urllib.request import Request,urlopen
from io import BytesIO
from hashlib import sha256
import json
from PIL import Image,ImageOps

URL='https://global.uniview.com/es/res/202609/22/20260922_2613239_26c76448-426e-4e99-b6b8-d49dd81ce27c_1049793_798522_0.png'
req=Request(URL,headers={'User-Agent':'Mozilla/5.0 (compatible; Rapid media review)'})
with urlopen(req,timeout=45) as r: raw=r.read(12_000_001)
if not raw or len(raw)>12_000_000: raise RuntimeError('Imagen Uniview inválida')
with Image.open(BytesIO(raw)) as src:
    src.load()
    original=src.size
    rgba=src.convert('RGBA')
    white=Image.new('RGBA',rgba.size,(255,255,255,255))
    if 'A' in rgba.getbands(): white.alpha_composite(rgba)
    rgb=white.convert('RGB')
    canvas=Image.new('RGB',(900,900),'white')
    fitted=ImageOps.contain(rgb,(790,790),method=Image.Resampling.LANCZOS)
    canvas.paste(fitted,((900-fitted.width)//2,(900-fitted.height)//2))
    out=Path('public/assets/uniview-colorhunter.webp')
    canvas.save(out,'WEBP',quality=92,method=6)

# Bordes externos deben ser blancos: sin marco de la imagen anterior.
check=Image.open(out).convert('RGB')
for point in [(20,20),(879,20),(20,879),(879,879),(450,40)]:
    assert min(check.getpixel(point))>245,(point,check.getpixel(point))

manifest=Path('data/media-sources.json')
rows=json.loads(manifest.read_text())
for row in rows:
    if row.get('file')=='uniview-colorhunter.webp':
        row.update({
          'source':URL,
          'description':'Uniview IPC3624LE-ADF28K-WP ColorHunter Wise-ISP, imagen oficial de producto sobre fondo blanco.',
          'source_dimensions':list(original),
          'source_sha256':sha256(raw).hexdigest(),
          'sha256':sha256(out.read_bytes()).hexdigest(),
          'rights':'Imagen oficial de producto para revisión. Confirmar condiciones de uso antes de producción; no representa un trabajo realizado por Rapid.'
        })
        break
else: raise RuntimeError('No existe Uniview en el manifiesto')
manifest.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
print('Uniview sustituida por imagen oficial',original,sha256(out.read_bytes()).hexdigest())
