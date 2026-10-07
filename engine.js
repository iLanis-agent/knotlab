/* KnotLab engine: knot selection and working-load math.
   Efficiency data: commonly cited residual rope-strength percentages per knot
   (climbing/sailing references; values are approximations, real results vary
   with rope type, dressing, and load dynamics). Pure JS, browser + Node. */
(function(root,factory){
  if(typeof module==='object'&&module.exports){module.exports=factory();}
  else{root.KnotLab=factory();}
})(typeof self!=='undefined'?self:this,function(){
'use strict';
var KNOTS=[
 {id:'figure8',name:'Figure-8 Loop',cat:'loop',eff:0.77,difficulty:1,
  uses:['climbing tie-in','general loop','stopper basis'],
  note:'The standard climbing tie-in. Easy to inspect.'},
 {id:'bowline',name:'Bowline',cat:'loop',eff:0.60,difficulty:1,
  uses:['fixed loop','mooring','rescue'],
  note:'King of knots; can loosen under cyclic loading - add a backup.'},
 {id:'alpine',name:'Alpine Butterfly',cat:'loop',eff:0.70,difficulty:2,
  uses:['mid-rope loop','isolating damaged section','3-way loading'],
  note:'Loads in any direction without capsizing.'},
 {id:'doublefish',name:'Double Fisherman',cat:'bend',eff:0.70,difficulty:2,
  uses:['joining ropes','prusik loops','rappel backup'],
  note:'Very secure bend; hard to untie after heavy loading.'},
 {id:'sheetbend',name:'Sheet Bend',cat:'bend',eff:0.55,difficulty:1,
  uses:['joining different diameters','temp tie-down'],
  note:'Quick but slips with very slick cordage - double it.'},
 {id:'clove',name:'Clove Hitch',cat:'hitch',eff:0.65,difficulty:1,
  uses:['starting lashings','temporary post attachment'],
  note:'Adjustable; can slip without constant tension.'},
 {id:'tautline',name:'Taut-Line Hitch',cat:'hitch',eff:0.60,difficulty:2,
  uses:['tent guy lines','adjustable tension'],
  note:'Sliding grip hitch for adjustable lines.'},
 {id:'prusik',name:'Prusik',cat:'friction',eff:0.85,difficulty:2,
  uses:['rope ascent','self-rescue','adjustable lanyard'],
  note:'Friction hitch: grips loaded rope, slides when unloaded.'},
 {id:'truckers',name:"Trucker's Hitch",cat:'hitch',eff:0.58,difficulty:3,
  uses:['cargo lashing','heavy tensioning'],
  note:'3:1 mechanical advantage compound hitch.'},
 {id:'cleat',name:'Cleat Hitch',cat:'hitch',eff:0.75,difficulty:1,
  uses:['docking','belaying to a cleat'],
  note:'Fast secure finish to a cleat.'},
 {id:'stopper',name:'Figure-8 Stopper',cat:'stopper',eff:0.72,difficulty:1,
  uses:['rope end stop','rappel backup'],
  note:'Simple bulky stopper, easy to untie.'},
 {id:'barrel',name:'Barrel Knot',cat:'stopper',eff:0.68,difficulty:2,
  uses:['slimmer stopper','cord ends'],
  note:'Neater than a figure-8 stopper for small cord.'}
];
function list(){return KNOTS;}
function byId(id){for(var i=0;i<KNOTS.length;i++)if(KNOTS[i].id===id)return KNOTS[i];return null;}
/* working load limit: rope MBS * knot efficiency / safety factor */
function wll(mbsKg,knotId,safetyFactor){
  var k=byId(knotId);
  if(!k||!(mbsKg>0)||!(safetyFactor>0))return null;
  return Math.round(mbsKg*k.eff/safetyFactor*10)/10;
}
/* rank knots for a task: match category/uses keywords, score by efficiency and simplicity */
function recommend(task){
  var t=String(task).toLowerCase();
  var scored=KNOTS.map(function(k){
    var s=0;
    if(t.indexOf(k.cat)>=0)s+=3;
    k.uses.forEach(function(u){
      u.toLowerCase().split(/[^a-z]+/).forEach(function(w){
        if(w.length>3&&t.indexOf(w)>=0)s+=2;
      });
    });
    if(s===0)return null;
    return {id:k.id,name:k.name,score:s,eff:k.eff,difficulty:k.difficulty,note:k.note};
  }).filter(Boolean);
  scored.sort(function(a,b){
    if(b.score!==a.score)return b.score-a.score;
    if(b.eff!==a.eff)return b.eff-a.eff;
    return a.difficulty-b.difficulty;
  });
  return scored;
}
/* compare two knots head to head for a rope */
function compare(mbsKg,idA,idB,sf){
  var a=wll(mbsKg,idA,sf),b=wll(mbsKg,idB,sf);
  if(a===null||b===null)return null;
  var kA=byId(idA),kB=byId(idB);
  return {
    a:{id:idA,name:kA.name,wll:a,eff:kA.eff},
    b:{id:idB,name:kB.name,wll:b,eff:kB.eff},
    strongerWll:a>=b?idA:idB,
    deltaPct:Math.round(Math.abs(kA.eff-kB.eff)*100)
  };
}
return {list:list,byId:byId,wll:wll,recommend:recommend,compare:compare};
});
