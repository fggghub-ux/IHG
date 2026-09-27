import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function list(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()&&!['node_modules','.git'].includes(e.name)?list(path.join(dir,e.name)):e.isFile()?[path.join(dir,e.name)]:[]);}
let count=0;const errors=[];
for(const f of list(root).filter(f=>f.endsWith('.js'))){try{new vm.Script(fs.readFileSync(f,'utf8'),{filename:path.relative(root,f)});count++;}catch(e){errors.push(e.message);}}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)){
 const url=match[1].split(/[?#]/)[0];if(!url||/^(?:[a-z]+:|\/\/)/i.test(url))continue;
 if(!fs.existsSync(path.resolve(root,url.replace(/^\//,''))))errors.push('Missing reference: '+url);
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`PASS: ${count} JavaScript files parse; local entry-point script/style references exist.`);
