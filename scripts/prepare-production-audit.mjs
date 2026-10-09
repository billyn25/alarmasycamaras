import fs from 'node:fs';
const path='config/site.json';
const site=JSON.parse(fs.readFileSync(path,'utf8'));
site.mode='production';
for(const key of Object.keys(site.ready))site.ready[key]=true;
site.legal={
  holder:site.legal.holder||'R.F.G.',
  taxId:'CI-SEO-AUDIT',
  address:'Solo auditoría técnica interna',
  contact:'ci-seo-audit@example.invalid'
};
fs.writeFileSync(path,JSON.stringify(site,null,2)+'\n');
console.log('Configuración temporal de producción preparada para CI; no se publica.');
