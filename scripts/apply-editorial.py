"""Migración puntual sobre ffb5bf3, con comprobación de fuentes. Se elimina tras la revisión."""
from pathlib import Path
import json,subprocess
expected={'src/views.mjs':'6aac69416e5fb3b88257a54916175f40301537db','scripts/build.mjs':'97bb912eca9922bcba8e3cef99af43238b4d5e90','config/site.json':'a3c28360baf24404e8c7e38e5d6ebe4ae0da0f43','package.json':'b06a376f831cf4bd25b5384dc9352517a5d4d6de','tests/site.test.mjs':'fc86f39eeb5eb874c9924aebe46bb3abf627efa2'}
for name,sha in expected.items():
    actual=subprocess.check_output(['git','hash-object',name],text=True).strip()
    if actual!=sha:raise ValueError('Fuente modificada: '+name)
p=Path('config/site.json');c=json.loads(p.read_text());c['legal']['holder']='R.F.G.';p.write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n')
p=Path('src/views.mjs');s=p.read_text();a=s.index('export function legalPage(');b=s.index('export function shell(',a);s=s[:a]+s[b:]
s="export {legalPage} from './legal.mjs';\nimport {privacySummary} from './legal.mjs';\nimport {guideSection} from './guides.mjs';\nimport {structuredData} from './metadata.mjs';\n"+s
s=s.replace('${coverageSection(towns)}${questions()}','${coverageSection(towns)}${guideSection()}${questions()}')
s=s.replace('${serviceKnowledge(s.slug)}${brandStrip()}','${serviceKnowledge(s.slug)}${guideSection(true)}${brandStrip()}')
s=s.replace('${localUsageGuide()}','${localUsageGuide()}${guideSection(true)}')
s=s.replace('<button type="submit" class="button button-whatsapp"','${privacySummary(site)}<button type="submit" class="button button-whatsapp"')
a=s.index('const schema=rt.production?');b=s.index(';const nav=',a);s=s[:a]+'const schema=structuredData(page,site,rt)'+s[b:]
s=s.replace("const title=page.title+' | '+site.brand","const title=page.title+' | '+(page.title.length>65?'Rapid':site.brand)")
s=s.replace("${rt.base?`<meta property=\"og:image\" content=\"${e(rt.base)}/assets/ajax-kit.jpg\">`:''}","${rt.base?`<meta property=\"og:image\" content=\"${e(rt.base)}/assets/${e(page.image||'ajax-kit.jpg')}\"><meta property=\"og:image:alt\" content=\"Equipos de alarmas y videovigilancia\">`:''}")
s=s.replace('<a href="/zonas/">Provincias y pueblos</a>','<a href="/zonas/">Provincias y pueblos</a><a href="/guias/">Guías de seguridad</a>')
s=s.replace('<p>${e(site.brand)} · Instalación de alarmas y videovigilancia.</p>','<p>© ${e(site.legal.holder)} · ${e(site.brand)}.</p>')
s=s.replace('Versión de revisión · Sin indexación. Contacto, cobertura, condiciones, datos legales e imágenes pendientes de confirmación.','Versión de revisión · Sin indexación.')
p.write_text(s)
p=Path('scripts/build.mjs');s=p.read_text();s=s.replace("import * as view from '../src/views.mjs';","import * as view from '../src/views.mjs';\nimport {guides,guidesPage,guidePage,guideUrl} from '../src/guides.mjs';\nimport {enrichMetadata} from '../src/metadata.mjs';")
s=s.replace("fs.readFileSync('public/ajax-accent.css')","fs.readFileSync('public/ajax-accent.css'),Buffer.from('\\n'),fs.readFileSync('public/editorial.css')")
s=s.replace('const add=page=>{','const add=original=>{const page=enrichMetadata(original);')
pos=s.index('for(const s of services)')
s=s[:pos]+"add({url:'/guias/',title:'Guías de alarmas y cámaras de seguridad',description:'Guías para elegir alarmas sin cuotas, visión nocturna, seguridad en segundas residencias y presupuestos de instalación.',body:guidesPage(),crumbs:crumbs(['Guías','/guias/'])});\nfor(const g of guides)add({url:guideUrl(g),title:g.title,description:g.description,body:guidePage(g),guide:true,image:g.category==='CÁMARAS'?'ajax-turret.jpg':'ajax-kit.jpg',crumbs:crumbs(['Guías','/guias/'],[g.label,guideUrl(g)])});\n"+s[pos:]
p.write_text(s)
p=Path('tests/site.test.mjs');p.write_text("import './editorial.test.mjs';\n"+p.read_text())
p=Path('package.json');v=json.loads(p.read_text());v['scripts']['build']+=' && node scripts/content-audit.mjs';p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
print('Políticas, guías y metadatos aplicados; sin modificar indexación ni workflows.')
