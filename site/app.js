import {readWorldBankPage,compareEndpoints} from './observations.mjs';
const $=s=>document.querySelector(s);
const text=(tag,value,cls)=>{const e=document.createElement(tag);e.textContent=value;if(cls)e.className=cls;return e};
const number=n=>n===null?'Not available':new Intl.NumberFormat('en').format(n);
try{
  const response=await fetch('verified-example.json');if(!response.ok)throw new Error('Saved response unavailable');
  const example=await response.json(),rows=readWorldBankPage(example.response),summary=compareEndpoints(rows,2020,2024);
  $('#results').replaceChildren(...summary.map(r=>{const tr=text('tr',''),name=text('th',r.name);name.scope='row';const change=text('td',r.changePercent===null?'Not available':(r.changePercent>0?'+':'')+r.changePercent.toFixed(1)+'%','change');tr.append(name,text('td',number(r.start)),text('td',number(r.end)),change);return tr}));
  $('#observations').replaceChildren(...rows.map(r=>{const tr=text('tr','');tr.append(text('td',r.name),text('td',r.year),text('td',number(r.value)),text('td',r.footnote||'—'));return tr}));
  $('#query').textContent=example.sourceUrl;$('#queryLink').href=example.sourceUrl;
  $('#exampleStatus').textContent='15 observations · 3 countries · 2020–2024 · Complete response';
  $('#export').href='public-kit-population-2020-2024.csv';$('#export').download='public-kit-population-2020-2024.csv';$('#export').removeAttribute('aria-disabled');
}catch{$('#exampleStatus').textContent='The saved response could not be loaded or validated. Download the JSON below to inspect it.';$('#export').textContent='CSV unavailable';}
try{
  const response=await fetch('catalogue.json');if(!response.ok)throw new Error('Catalogue unavailable');const {sources}=await response.json();
  function renderSources(){
    const q=$('#search').value.trim().toLowerCase(),access=$('#access').value;
    const needsCredentials=s=>['nasa-firms','copernicus-cds'].includes(s.id);
    const selected=sources.filter(s=>(access==='all'||(access==='credentials')===needsCredentials(s))&&JSON.stringify(s).toLowerCase().includes(q));
    $('#count').textContent=selected.length+' / '+sources.length+' sources';
    $('#sourceGrid').replaceChildren(...selected.map(s=>{
      const el=text('details','','source-row'),summary=text('summary','');
      const plus=text('span','+','expand');plus.setAttribute('aria-hidden','true');
      summary.append(text('span',String(sources.indexOf(s)+1).padStart(2,'0'),'source-num'),text('span',s.name,'source-name'),text('span',s.useFor,'source-use'),plus);
      const body=text('div','','source-detail');body.append(text('span',s.access,'tag'),text('p','“'+s.exampleQuestion+'”','source-question'),text('p',s.discovery));
      if(s.request){const pre=text('pre',s.request);body.append(pre);}
      body.append(text('p',s.parse),text('p',s.limitation),text('p',s.verification,'verification'));
      const a=text('a','Provider documentation ↗');a.href=s.documentationUrl;a.target='_blank';a.rel='noopener noreferrer';body.append(a);el.append(summary,body);return el;
    }));
    if(!selected.length)$('#sourceGrid').append(text('p','No matching sources. Try another topic or access requirement.','empty'));
  }
  $('#search').addEventListener('input',renderSources);$('#access').addEventListener('change',renderSources);renderSources();
}catch{$('#count').textContent='Unavailable';$('#sourceGrid').append(text('p','The directory could not load. All source guides are included in SKILL.md.','empty'))}
