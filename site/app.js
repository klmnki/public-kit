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

try {
  const response=await fetch('repeatable-examples.json');
  if(!response.ok) throw new Error('Examples unavailable');
  const {examples}=await response.json();
  const tabs=[...document.querySelectorAll('[data-case]')];
  const panel=$('#case-panel');
  function renderCase(id){
    const example=examples.find(e=>e.id===id);
    if(!example)throw new Error('Example missing');
    tabs.forEach(tab=>{const chosen=tab.dataset.case===id;tab.setAttribute('aria-selected',String(chosen));tab.tabIndex=chosen?0:-1});
    panel.setAttribute('aria-labelledby','tab-'+id);
    const heading=text('div','','case-heading');
    heading.append(text('p',example.question,'case-question'),text('h3',example.headline),text('p',example.summary));
    panel.replaceChildren(heading);
    for(const result of example.tables){
      const wrap=text('div','','table-wrap'),table=text('table','','case-table');
      table.append(text('caption',result.caption));
      const head=text('thead',''),tr=text('tr','');
      result.columns.forEach(c=>{const th=text('th',c);th.scope='col';tr.append(th)});head.append(tr);
      const body=text('tbody','');
      result.rows.forEach(row=>{const r=text('tr','');row.forEach((v,i)=>{const cell=text(i===0?'th':'td',v??'Not available');if(i===0)cell.scope='row';r.append(cell)});body.append(r)});
      table.append(head,body);wrap.append(table);panel.append(wrap);
    }
    panel.append(text('p',example.provenance,'case-provenance'));
    const notes=text('div','','case-notes');
    for(const [title,body] of [['Method',example.method],['What this cannot tell you',example.limitation]]){const box=text('div','');box.append(text('h4',title),text('p',body));notes.append(box)}
    panel.append(notes);
    const prompt=text('details','','data-details'),summary=text('summary','Use this question and repeat the request');
    const pre=text('pre',example.prompt),copy=text('button','Copy question','copy-button');copy.type='button';
    const copyStatus=text('span','','copy-status');copyStatus.setAttribute('role','status');
    copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(example.prompt);copyStatus.textContent='Question copied.'}catch{copyStatus.textContent='Select and copy the question above.'}});
    prompt.append(summary,pre,copy,copyStatus,text('p',example.repeat));panel.append(prompt);
    const links=text('div','','case-links');
    for(const [label,url,download] of [['Saved data ↓ JSON',example.dataUrl,true],['Reproduce on GitHub ↗',example.codeUrl,false],['Provider documentation ↗',example.sourceUrl,false]]){const a=text('a',label);a.href=url;if(download)a.download='';links.append(a)}
    panel.append(links);
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>renderCase(tab.dataset.case));
    tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();renderCase(tabs[next].dataset.case)});
  });
  renderCase('ilostat');
} catch {
  $('#case-panel').replaceChildren(text('p','The saved examples could not load. Open the examples folder on GitHub to inspect the data.'));
  const a=text('a','Examples on GitHub ↗');a.href='https://github.com/klmnki/public-kit/tree/main/examples';$('#case-panel').append(a);
}
