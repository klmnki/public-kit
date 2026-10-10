import {compareOptions,demoOptions} from './model.mjs';
const $=s=>document.querySelector(s);
const text=(tag,value,cls)=>{const e=document.createElement(tag);e.textContent=value;if(cls)e.className=cls;return e};
let state;
function renderModel(){
  const budget=Number($('#budget').value),weight=Number($('#weight').value)/100;
  const rows=compareOptions(demoOptions,{budget,weight});
  state={kind:'synthetic preference exercise',generatedAt:new Date().toISOString(),budget,weight,equation:'(1-weight)*reach + weight*targeting',assumptions:'Invented costs and scores; choose one option. Not an impact estimate or recommendation.',rows};
  $('#budgetValue').textContent=budget+' units';$('#weightValue').textContent=Math.round(weight*100)+'%';
  const best=rows.filter(r=>r.rank===1);
  $('#resultSummary').textContent=best.length?(best.length>1?'Joint highest scores: ':'Highest score: ')+best.map(r=>r.name).join(' and '):'No option fits this budget.';
  $('#results').replaceChildren(...rows.map(r=>{
    const el=text('article','','result'+(r.feasible?'':' infeasible')),head=text('div','','result-head');
    head.append(text('strong',r.name),text('span',r.feasible?r.score.toFixed(1):'Over budget'));
    const bar=text('div','','scorebar'),fill=text('i','');fill.style.width=r.score+'%';bar.append(fill);
    el.append(head,bar,text('p','Cost '+r.cost+' · Reach '+r.reach+' · Targeting '+r.targeting+(r.feasible?' · Rank '+r.rank:''),'small'));return el;
  }));
}
$('#budget').addEventListener('input',renderModel);$('#weight').addEventListener('input',renderModel);
$('#reset').addEventListener('click',()=>{$('#budget').value='60';$('#weight').value='50';renderModel()});
$('#export').addEventListener('click',()=>{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.href=url;a.download='public-kit-synthetic-comparison.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
renderModel();
try{
  const response=await fetch('catalogue.json');if(!response.ok)throw new Error('Catalogue unavailable');const {sources}=await response.json();
  function renderSources(){
    const q=$('#search').value.trim().toLowerCase(),access=$('#access').value;
    const selected=sources.filter(s=>(access==='all'||s.accessClass===access)&&JSON.stringify(s).toLowerCase().includes(q));
    $('#count').textContent=selected.length+' / '+sources.length+' sources';
    $('#sourceGrid').replaceChildren(...selected.map(s=>{
      const el=text('details','','source-row'),summary=text('summary','');
      const plus=text('span','+','expand');plus.setAttribute('aria-hidden','true');
      summary.append(text('span',String(sources.indexOf(s)+1).padStart(2,'0'),'source-num'),text('span',s.name,'source-name'),text('span',s.useFor||s.exampleQuestion,'source-use'),plus);
      const body=text('div','','source-detail');body.append(text('span',s.accessClass==='no-registration'?'NO REGISTRATION LISTED':'ACCOUNT / PROJECT LISTED','tag'),text('p',s.exampleQuestion),text('p',s.limitation||s.watchFor));
      const a=text('a','Provider documentation ↗');a.href=s.documentationUrl;a.target='_blank';a.rel='noopener noreferrer';body.append(a);el.append(summary,body);return el;
    }));
    if(!selected.length)$('#sourceGrid').append(text('p','No matching sources. Try another topic or access level.','empty'));
  }
  $('#search').addEventListener('input',renderSources);$('#access').addEventListener('change',renderSources);renderSources();
}catch{$('#count').textContent='Unavailable';$('#sourceGrid').append(text('p','The directory could not load. The complete source guide is also included in SKILL.md.','empty'))}
