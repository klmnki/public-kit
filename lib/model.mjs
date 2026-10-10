export const demoOptions = Object.freeze([
  Object.freeze({id:'shade',name:'Shade at busy stops',cost:40,reach:85,targeting:35}),
  Object.freeze({id:'cooling',name:'Neighbourhood cooling rooms',cost:60,reach:55,targeting:90}),
  Object.freeze({id:'visits',name:'Home visits and check-ins',cost:25,reach:30,targeting:80})
]);

export function compareOptions(options,{budget,weight}) {
  if (!Number.isFinite(budget) || budget<0) throw new Error('Budget must be a finite non-negative number');
  if (!Number.isFinite(weight) || weight<0 || weight>1) throw new Error('Weight must be between 0 and 1');
  if (!Array.isArray(options)) throw new Error('Options must be an array');
  const ids = new Set();
  const result = options.map(o=>{
    if (!o.id || ids.has(o.id) || typeof o.name!=='string' || !o.name.trim()) throw new Error('Each option needs a unique ID and name');
    ids.add(o.id);
    if (!Number.isFinite(o.cost) || o.cost<0 || ![o.reach,o.targeting].every(n=>Number.isFinite(n)&&n>=0&&n<=100)) throw new Error('Invalid cost or score');
    return {...o,score:(1-weight)*o.reach+weight*o.targeting,feasible:o.cost<=budget,rank:null};
  }).sort((a,b)=>Number(b.feasible)-Number(a.feasible)||b.score-a.score||a.id.localeCompare(b.id));
  let previousScore=null,rank=0;
  result.filter(o=>o.feasible).forEach((o,i)=>{
    if(previousScore===null || Math.abs(o.score-previousScore)>1e-9) rank=i+1;
    o.rank=rank; previousScore=o.score;
  });
  return result;
}
