/* KnotLab tests: engine vs tests/expected.json (python oracle). */
'use strict';
const fs=require('fs'),path=require('path');
const K=require(path.join(__dirname,'..','engine.js'));
const items=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8')).items;
let pass=0,fail=0;
function ok(){pass++;}
function bad(l,a,b){fail++;console.log('FAIL '+l+': got '+JSON.stringify(a)+' want '+JSON.stringify(b));}
for(const it of items){
  const T=it.kind+' '+JSON.stringify(it).slice(0,60)+' ';
  if(it.kind==='wll'){
    const r=K.wll(it.mbs,it.knot,it.sf);
    if(r===it.oracle)ok(); else bad(T+'wll',r,it.oracle);
  }else if(it.kind==='recommend'){
    const r=K.recommend(it.task).map(x=>x.id);
    if(JSON.stringify(r)===JSON.stringify(it.oracle))ok(); else bad(T+'order',r,it.oracle);
  }else{
    const r=K.compare(it.mbs,it.a,it.b,it.sf);
    if((r===null&&it.oracle===null)||(r&&it.oracle&&r.strongerWll===it.oracle.strongerWll&&r.deltaPct===it.oracle.deltaPct))ok();
    else bad(T+'compare',r,it.oracle);
  }
}
// knot list sanity: unique ids, efficiency in range
const ids=K.list().map(k=>k.id);
if(new Set(ids).size===ids.length&&ids.length===12)pass++; else bad('list size',ids.length,12);
if(K.list().every(k=>k.eff>0&&k.eff<=1))pass++; else bad('eff range','out of range','0<eff<=1');
// empty recommend returns []
if(K.recommend('zzz nothing matches').length===0)pass++; else bad('empty recommend','nonempty','[]');
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
