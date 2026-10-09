from pathlib import Path
from collections import deque
from PIL import Image, ImageFilter
from hashlib import sha256
import json

path=Path('public/assets/uniview-colorhunter.webp')
im=Image.open(path).convert('RGB')
px=im.load();w,h=im.size

# Detecta el rectángulo de la imagen original dentro del lienzo blanco.
coords=[]
for y in range(h):
    for x in range(w):
        r,g,b=px[x,y]
        if min(r,g,b)<238:
            coords.append((x,y))
if not coords: raise RuntimeError('No se detecta producto')
xs=[p[0] for p in coords];ys=[p[1] for p in coords]
box=(min(xs),min(ys),max(xs),max(ys))
x0,y0,x1,y1=box

# Fondo negro/gris: solo componentes conectados al perímetro del rectángulo.
mask=Image.new('L',(w,h),0);mp=mask.load();q=deque()
def dark(x,y):
    r,g,b=px[x,y]
    return max(r,g,b)<125 and (max(r,g,b)-min(r,g,b))<45
for x in range(x0,x1+1):
    for y in (y0,y1):
        if dark(x,y) and not mp[x,y]: mp[x,y]=255;q.append((x,y))
for y in range(y0,y1+1):
    for x in (x0,x1):
        if dark(x,y) and not mp[x,y]: mp[x,y]=255;q.append((x,y))
while q:
    x,y=q.popleft()
    for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
        if x0<=nx<=x1 and y0<=ny<=y1 and not mp[nx,ny] and dark(nx,ny):
            mp[nx,ny]=255;q.append((nx,ny))

# Suaviza un poco el borde para evitar halo duro.
soft=mask.filter(ImageFilter.GaussianBlur(1.2))
white=Image.new('RGB',(w,h),'white')
out=Image.composite(white,im,soft)
out.save(path,'WEBP',quality=92,method=6)

# Actualiza hash del manifiesto manteniendo fuente/derechos.
manifest=Path('data/media-sources.json')
rows=json.loads(manifest.read_text())
for row in rows:
    if row.get('file')=='uniview-colorhunter.webp':
        row['sha256']=sha256(path.read_bytes()).hexdigest()
        row['description']='Uniview ColorHunter turret, producto normalizado sobre fondo blanco para coherencia visual.'
        break
else: raise RuntimeError('No existe Uniview en media-sources.json')
manifest.write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')

# Verificación visual básica.
check=Image.open(path).convert('RGB')
corners=[check.getpixel((20,20)),check.getpixel((w-21,20)),check.getpixel((20,h-21)),check.getpixel((w-21,h-21))]
assert all(min(c)>245 for c in corners),corners
print('Uniview fondo limpio',box,'sha256',sha256(path.read_bytes()).hexdigest())
