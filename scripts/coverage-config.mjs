import fs from 'node:fs';
import {townsFrom} from '../src/lib.mjs';
import {provinces} from '../src/content.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),geo=read('data/municipal-geography.json'),byCode=new Map(geo.municipalities.map(t=>[t.code,t]));
export const config={key:'alarmas',domain:'https://camarasyalarmasrapid.com',label:'Cámaras y Alarmas Rapid',searchPath:'/assets/municipios-search.json',contactId:'presupuesto-whatsapp',townInput:'[data-quote-form] input[name="town"]',provinces,source:{geography:geo.source,edition:geo.edition},towns:townsFrom(read('data/municipios.json').municipalities).map(t=>({...byCode.get(t.id),code:t.id,name:t.name,province:t.province.name,provinceSlug:t.province.slug,route:t.url}))};
