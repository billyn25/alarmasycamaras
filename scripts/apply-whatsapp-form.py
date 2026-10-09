"""One-off integration on the review branch. Never run by a Netlify build."""
from pathlib import Path
p=Path('src/views.mjs');s=p.read_text()
assert "from './quote-form.mjs'" not in s
s="import {whatsappForm,whatsappSection} from './quote-form.mjs';\n"+s
start=s.index('export const contactBand=');end=s.index('\n',start)
s=s[:start]+"export const contactBand=(town='')=>whatsappSection(town);"+s[end:]
start=s.index('<form data-quote-form hidden>');end=s.index('</noscript>',start)+len('</noscript>')
s=s[:start]+"${whatsappForm({site})}"+s[end:]
s=s.replace('<h2>Prepara tu consulta.</h2>','<h2>Pide presupuesto por WhatsApp.</h2>');p.write_text(s)
p=Path('public/app.js');s=p.read_text();s=s[:s.index("const form=document.querySelector('[data-quote-form]');")];p.write_text(s)
p=Path('scripts/build.mjs');s=p.read_text()
assert "fs.readFileSync('public/facilities.css')])" in s
s=s.replace("fs.readFileSync('public/facilities.css')])", "fs.readFileSync('public/facilities.css'),Buffer.from('\\n'),fs.readFileSync('public/quote-form.css')])")
s=s.replace("fs.readFileSync('public/cookies.js')])", "fs.readFileSync('public/cookies.js'),Buffer.from('\\n'),fs.readFileSync('public/quote-form.js')])");p.write_text(s)
p=Path('src/legal.mjs');s=p.read_text().replace('El preparador de consultas utiliza el municipio, servicio y tipo de inmueble que introduces.', 'El formulario de WhatsApp utiliza el servicio, provincia, municipio, tipo de inmueble y teléfono de contacto que introduces. Puedes añadir tu nombre y una descripción breve de lo que necesitas. El nombre y los detalles son opcionales.');p.write_text(s)
for file in ['tests/browser.py','tests/privacy-seo-browser.py','tests/facilities-browser.py']:
 p=Path(file);s=p.read_text().replace("== 'Lerma, Burgos'","== 'Lerma'").replace("=='Lerma, Burgos'","=='Lerma'").replace("to_have_value('Lerma, Burgos')","to_have_value('Lerma')")
 s=s.replace("page.locator('button[type=\"submit\"]').click()", "page.locator('[name=\"phone\"]').fill('600123456')\n    page.locator('button[type=\"submit\"]').click()")
 s=s.replace("page.locator('button[data-whatsapp]').click()", "page.locator('[name=\"phone\"]').fill('600123456')\n    page.locator('button[data-whatsapp]').click()")
 s=s.replace("assert 'Lerma, Burgos' in parse_qs", "assert 'Municipio o pueblo: Lerma' in parse_qs")
 if file=='tests/browser.py':s=s.replace('import json\n','import json,os\n').replace('browser = p.chromium.launch()',"browser = p.chromium.launch(**({'executable_path':os.environ['RAPID_CHROMIUM']} if os.environ.get('RAPID_CHROMIUM') else {}))")
 p.write_text(s)
p=Path('tests/facilities.test.mjs');s=p.read_text().replace("const js=fs.readFileSync('public/app.js','utf8');assert.ok(js.includes('option.value===building'));", "const js=fs.readFileSync('public/quote-form.js','utf8');assert.ok(js.includes('choose(fields.building'));assert.ok(js.includes('[...select.options].find'));");p.write_text(s)
p=Path('tests/site.test.mjs');p.write_text(p.read_text()+"\nimport './quote-form.test.mjs';\n")
print('Formulario integrado. Ubicaciones, fotos, URLs y controles de publicación conservados.')
