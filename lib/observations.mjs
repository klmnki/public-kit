export function readWorldBankPage(payload) {
  if (!Array.isArray(payload) || payload.length!==2 || !Array.isArray(payload[1])) throw new Error('Expected World Bank metadata and observations');
  const [meta,rows]=payload;
  if (Number(meta.pages)!==1 || Number(meta.total)!==rows.length) throw new Error('Incomplete response: retrieve all pages before presenting totals');
  const seen=new Set();
  return rows.map(row=>{
    const id=row.countryiso3code,year=Number(row.date),value=row.value;
    if (!/^[A-Z]{3}$/.test(id)||!Number.isInteger(year)||row.indicator?.id!=='SP.POP.TOTL') throw new Error('Unexpected country, year or indicator');
    if(value!==null&&(!Number.isFinite(value)||value<0)) throw new Error('Invalid population value');
    const key=id+':'+year;if(seen.has(key))throw new Error('Duplicate country/year');seen.add(key);
    return {country:id,name:row.country.value,year,value,footnote:row.footnote||''};
  }).sort((a,b)=>a.country.localeCompare(b.country)||a.year-b.year);
}

export function compareEndpoints(rows,startYear,endYear) {
  if(!Number.isInteger(startYear)||!Number.isInteger(endYear)||endYear<=startYear)throw new Error('Choose an increasing year range');
  return [...new Set(rows.map(r=>r.country))].map(country=>{
    const group=rows.filter(r=>r.country===country),start=group.find(r=>r.year===startYear)?.value??null,end=group.find(r=>r.year===endYear)?.value??null;
    return {country,name:group[0].name,start,end,changePercent:start===null||end===null||start===0?null:(end-start)/start*100,footnotes:group.filter(r=>r.footnote).map(r=>r.year+': '+r.footnote)};
  });
}
