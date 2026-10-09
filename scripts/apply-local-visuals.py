"""One-time, guarded source update; never runs during a Netlify build."""
from pathlib import Path
import hashlib
p=Path('src/views.mjs')
s=p.read_text()
blob=hashlib.sha1(b'blob '+str(len(p.read_bytes())).encode()+b'\0'+p.read_bytes()).hexdigest()
if blob!='13cdebc4b77b20ab92604772619024ba7fe8f1b0':
    raise SystemExit('Source changed; review instead of overwriting: '+blob)
s="import {localHeroMedia,localServiceMedia,localEcosystem,localUsageGuide} from './local-media.mjs';\n"+s
start=s.index('export function townPage(');end=s.index('export function contactPage(',start)
t=s[start:end]
a='<div class="local-photo">${kit(\'\',true)}<span>Equipos de referencia. No es una instalación fotografiada en ${name}.</span></div>'
assert t.count(a)==1
t=t.replace(a,'${localHeroMedia()}')
for kind,icon in [('alarmas','shield'),('camaras','camera'),('integracion','phone')]:
    old='<article>${icon(\''+icon+'\')}<h2>'
    assert t.count(old)==1,(kind,'anchor')
    t=t.replace(old,'<article>${localServiceMedia(\''+kind+'\')}${icon(\''+icon+'\')}<h2>')
assert t.count('<section class="local-advice wrap">')==1
t=t.replace('<section class="local-advice wrap">','${localEcosystem()}${localUsageGuide()}<section class="local-advice wrap">')
s=s[:start]+t+s[end:];p.write_text(s)
p=Path('scripts/build.mjs');s=p.read_text()
old="fs.readFileSync('public/enhancements.css')]):fs.readFileSync(file)"
assert s.count(old)==1
s=s.replace(old,"fs.readFileSync('public/enhancements.css'),Buffer.from('\\n'),fs.readFileSync('public/ajax-accent.css')]):fs.readFileSync(file)")
p.write_text(s)
p=Path('tests/site.test.mjs')
p.write_text(p.read_text()+"\nimport './local-media.test.mjs';\n")
p=Path('public/ajax-accent.css')
p.write_text(p.read_text()+'''\n/* Mobile: show the camera immediately after the local heading, before the long copy. */
@media(max-width:600px){
 .local-hero{row-gap:20px}
 .local-hero>div:first-child{display:contents}
 .local-hero>div:first-child>.eyebrow{order:1;margin-bottom:0}
 .local-hero h1{order:2}
 .local-hero>.local-photo-camera{order:3}
 .local-hero .actions{order:4}
 .local-hero .lead{order:5;margin:0}
 .local-hero .local-pills{order:6;margin-top:0}
}
''')
print('Applied: local images, useful content, Ajax accent CSS, regression tests. Footer unchanged.')
