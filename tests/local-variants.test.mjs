import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {townsFrom} from '../src/lib.mjs';
import {localVariantSection,localVariantSignature} from '../src/local-variants.mjs';
const towns=townsFrom(JSON.parse(fs.readFileSync('data/municipios.json','utf8')).municipalities);
test('Variación local es estable y útil',()=>{
 for(const t of towns.slice(0,100)){const a=localVariantSection(t),b=localVariantSection(t);assert.equal(a,b);assert.equal((a.match(/class="local-variant-card"/g)||[]).length,5);assert.ok(a.includes(t.name));assert.ok(!/hemos instalado|nuestros clientes de|oficina en/i.test(a));}
});
test('La matriz crea miles de combinaciones estables, no random por deploy',()=>{
 const signatures=new Set(towns.map(t=>crypto.createHash('sha256').update(localVariantSignature(t)).digest('hex')));
 assert.ok(signatures.size>3300,signatures.size);
});
