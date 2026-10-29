import fs from 'node:fs';
import path from 'node:path';
import { parseCsv, pick } from './csv.mjs';
import { REPO_ROOT } from './db.mjs';
export const reads={
 competitors:'select id,name,owner,website,active from competitors order by name',
 'evidence-inbox':'select * from evidence_review order by competitor,observed_on desc',
 'battlecard-review':'select id,competitor,statement,status,review_due,coalesce(usable,false) usable from battlecards order by competitor,statement',
 'win-loss':'select * from win_loss order by competitor,currency',
 'deal-prep':`select d.name deal,c.name competitor,d.owner,d.currency,d.amount_cents,count(b.id) filter(where b.usable) usable_points from deals d join competitors c on c.id=d.competitor_id left join battlecards b on b.competitor_id=c.id where d.outcome='open' group by d.id,c.name order by d.name`,
 'research-queue':`select t.id,c.name competitor,t.name,t.owner,t.due_on from tasks t join competitors c on c.id=t.competitor_id where done_on is null order by due_on,t.name`,
 attention:'select * from attention order by due_on nulls first,competitor,kind',
 timeline:'select a.id,c.name competitor,a.actor,a.action,a.detail,a.created_at from activity a left join competitors c on c.id=a.competitor_id order by a.created_at desc,a.id',
};
export const questions=[
 ['Which live deals have no usable comparison points?',`select d.name deal,c.name competitor from deals d join competitors c on c.id=d.competitor_id where d.outcome='open' and not exists(select 1 from battlecards b where b.competitor_id=c.id and b.usable) order by d.name`],
 ['Which approved claims now depend on stale evidence?',`select competitor,statement,review_due from battlecards where status='approved' and not coalesce(usable,false) order by competitor,statement`],
 ['Which observations still have unknown reuse rights?',`select competitor,title,observed_on from evidence_review where rights='unknown' order by competitor,title`],
 ['Which rivals have no recorded evidence?',`select c.name competitor from competitors c where not exists(select 1 from evidence e where e.competitor_id=c.id) order by c.name`],
 ['Which personal records need a retention review?',`select c.name competitor,e.title,e.retention_review_on from evidence e join competitors c on c.id=e.competitor_id where personal and (retention_review_on is null or retention_review_on<=current_date) order by c.name,e.title`],
 ['What reasons were recorded for losses?',`select c.name competitor,d.name deal,d.reason,d.closed_on from deals d join competitors c on c.id=d.competitor_id where outcome='lost' order by c.name,d.name`],
 ['What is the win rate excluding no-decisions?',reads['win-loss']],
 ['Who owns overdue research?',`select owner,count(*) overdue from tasks where done_on is null and due_on<current_date group by owner order by owner`],
 ['Which active deals have no next review?',`select name deal,owner from deals where outcome='open' and next_review is null order by name`],
 ['Which competitor observations are newest?',`select competitor,title,kind,observed_on,review_state from evidence_review order by observed_on desc,title limit 10`]
];
export const rules={
 'NZ-FTA-12A':'https://www.comcom.govt.nz/__data/assets/pdf_file/0030/89850/Unsubstantiated-representations-Fact-sheet-July-2018.pdf',
 'NZ-IPP9':'https://www.privacy.org.nz/privacy-principles/9/',
 'AU-ACL':'https://www.accc.gov.au/consumers/advertising-and-promotions/false-or-misleading-claims',
 'AU-APP11':'https://www.oaic.gov.au/privacy/australian-privacy-principles-guidelines/chapter-11-app-11-security-of-personal-information'
};
export async function compliance(db){
 const out=[];
 for(const b of await db.query("select * from battlecards where status<>'retired' and not coalesce(usable,false)"))out.push({rule:'NZ-FTA-12A',competitor:b.competitor,record:b.id,issue:'Claim lacks current reviewed evidence',source:rules['NZ-FTA-12A']});
 for(const e of await db.query(`select e.*,c.name competitor from evidence e join competitors c on c.id=e.competitor_id where e.rights='unknown' or (e.personal and (e.retention_review_on is null or e.retention_review_on<=current_date))`)){
 if(e.rights==='unknown')out.push({rule:'LOCAL-RIGHTS',competitor:e.competitor,record:e.id,issue:'Confirm rights before reuse',source:'docs/compliance.md'});
 if(e.personal&&(e.retention_review_on===null||String(e.retention_review_on)<=new Date().toISOString().slice(0,10)))out.push({rule:'NZ-IPP9',competitor:e.competitor,record:e.id,issue:'Review necessity of retaining personal information',source:rules['NZ-IPP9']});
 }return out;
}
export function required(v,name){if(typeof v!=='string'||!v.trim())throw Error(`Missing ${name}`);return v.trim();}
export function date(v,name){required(v,name);if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v)throw Error(`Invalid ${name}: use YYYY-MM-DD`);return v;}
export function url(v){required(v,'source URL');let u;try{u=new URL(v);}catch{throw Error('Source must be an http(s) URL');}if(!['https:','http:'].includes(u.protocol)||u.username||u.password)throw Error('Source must be an http(s) URL without credentials');return v;}
export function choice(v,values,name){if(!values.includes(v))throw Error(`Invalid ${name}: ${values.join(', ')}`);return v;}
export async function resolve(db,table,input){
 if(!['competitors','evidence','claims','deals','tasks'].includes(table))throw Error('Invalid record type');required(input,'record');
 const column={evidence:'title',claims:'statement'}[table]||'name';
 const all=await db.query(`select id,${column} name from ${table} order by ${column},id`);
 const exact=all.filter(r=>r.id===input||r.name.toLowerCase()===input.toLowerCase());
 const hits=exact.length?exact:all.filter(r=>r.id.startsWith(input)||r.name.toLowerCase().includes(input.toLowerCase()));
 if(hits.length!==1){const e=Error(hits.length?'Ambiguous record':'No matching record');e.candidates=hits.length?hits:all;throw e;}return hits[0].id;
}
export async function audit(db,competitor,actor,action,detail){required(actor,'--actor');await db.query('insert into activity(competitor_id,actor,action,detail) values($1,$2,$3,$4)',[competitor,actor,action,detail]);}
export async function transaction(db,fn,dry=false){await db.exec('BEGIN');try{const result=await fn();await db.exec(dry?'ROLLBACK':'COMMIT');return result;}catch(e){await db.exec('ROLLBACK');throw e;}}
export async function execute(db,cmd,args=[],o={}){
 if(cmd in reads)return db.query(reads[cmd]);
 if(cmd==='compliance')return compliance(db);
 if(cmd==='insights'){const out=[];for(const [question,sql] of questions)out.push({question,rows:await db.query(sql)});return out;}
 if(cmd==='weekly-review')return {attention:await execute(db,'attention'),win_loss:await execute(db,'win-loss'),compliance:await compliance(db)};
 if(cmd==='battlecard')return db.query('select competitor,statement,response,evidence,source_url,review_due,coalesce(usable,false) usable from battlecards where competitor_id=$1 order by statement',[await resolve(db,'competitors',args[0])]);
 if(cmd==='export'){
 const archive={format:'competitive-intelligence/v1',exported_at:new Date().toISOString(),records:{}};
 await transaction(db,async()=>{for(const tab of ['competitors','evidence','claims','deals','tasks','activity'])archive.records[tab]=await db.query(`select * from ${tab} order by id`);});
 return privateFile('exports','archive',JSON.stringify(archive,null,2),'json');
 }
 if(cmd.startsWith('draft-')){
 const type=choice(cmd,['draft-battlecard','draft-weekly-brief','draft-deal-brief'],'draft type');
 let result;
 if(type==='draft-battlecard')result=(await execute(db,'battlecard',args)).filter(r=>r.usable);
 else if(type==='draft-weekly-brief')result=await execute(db,'weekly-review');
 else {const id=await resolve(db,'deals',args[0]);const [deal]=await db.query('select * from deals where id=$1',[id]);result={deal,points:await db.query('select statement,response,source_url from battlecards where competitor_id=$1 and usable order by statement',[deal.competitor_id])};}
 return privateFile('drafts',type,`# Internal draft: ${type.slice(6)}\n\nReview sources and wording before any external use. Nothing has been sent.\n\n\`\`\`json\n${JSON.stringify(result,null,2)}\n\`\`\`\n`,'md');
 }
 if(cmd==='import')return importCrayon(db,args,o);
 required(o.actor,'--actor');
 return transaction(db,async()=>{
 let row,comp=null;
 if(cmd==='add-competitor'){
 required(o.name,'--name');required(o.owner,'--owner');if(o.website)url(o.website);
 [row]=await db.query('insert into competitors(name,owner,website) values($1,$2,$3) returning *',[o.name,o.owner,o.website||'']);comp=row.id;
 }else if(cmd==='add-evidence'){
 comp=await resolve(db,'competitors',o.competitor);date(o.date,'--date');if(o.date>new Date().toISOString().slice(0,10))throw Error('Observation date cannot be in the future');
 required(o.title,'--title');required(o.summary,'--summary');url(o.source);choice(o.kind||'other',['pricing','product','review','call','news','other'],'kind');
 [row]=await db.query('insert into evidence(competitor_id,title,summary,source_url,observed_on,kind,personal) values($1,$2,$3,$4,$5,$6,$7) returning *',[comp,o.title,o.summary,o.source,o.date,o.kind||'other',o.personal===true]);
 }else if(cmd==='review-evidence'){
 const id=await resolve(db,'evidence',args[0]);const [e]=await db.query('select * from evidence where id=$1 for update',[id]);comp=e.competitor_id;
 choice(o.rights,['owned','licensed','public_link'],'rights');future(o.due,'--due');url(e.source_url);
 if(e.personal)future(o.retention,'--retention');
 [row]=await db.query('update evidence set rights=$2,reviewed_by=$3,reviewed_on=current_date,review_due=$4,retention_review_on=$5 where id=$1 returning *',[id,o.rights,o.actor,o.due,e.personal?o.retention:null]);
 }else if(cmd==='add-claim'){
 comp=await resolve(db,'competitors',o.competitor);required(o.statement,'--statement');required(o.response,'--response');
 const eid=o.evidence?await resolve(db,'evidence',o.evidence):null;
 if(eid){const [e]=await db.query('select competitor_id from evidence where id=$1',[eid]);if(e.competitor_id!==comp)throw Error('Evidence belongs to another competitor');}
 [row]=await db.query('insert into claims(competitor_id,evidence_id,statement,response) values($1,$2,$3,$4) returning *',[comp,eid,o.statement,o.response]);
 }else if(cmd==='approve-claim'){
 const id=await resolve(db,'claims',args[0]);future(o.due,'--due');
 const [cl]=await db.query('select * from claims where id=$1 for update',[id]);comp=cl.competitor_id;
 const [e]=await db.query(`select * from evidence where id=$1 and competitor_id=$2 and reviewed_on is not null and review_due>=current_date and rights<>'unknown' and observed_on<=current_date and (not personal or retention_review_on>current_date) for update`,[cl.evidence_id,comp]);
 if(!e)throw Error('Claim requires current reviewed evidence with rights and retention recorded');url(e.source_url);
 if(o.due>e.review_due)throw Error('Claim review cannot outlast evidence review');
 [row]=await db.query("update claims set status='approved',approved_by=$2,approved_on=current_date,review_due=$3 where id=$1 returning *",[id,o.actor,o.due]);
 }else if(cmd==='retire-claim'){
 const id=await resolve(db,'claims',args[0]);[row]=await db.query("update claims set status='retired' where id=$1 returning *",[id]);comp=row.competitor_id;
 }else if(cmd==='add-deal'){
 comp=await resolve(db,'competitors',o.competitor);required(o.name,'--name');required(o.owner,'--owner');future(o.due,'--due');
 if(!/^\d+$/.test(o.cents||'')||!Number.isSafeInteger(Number(o.cents)))throw Error('--cents must be a nonnegative safe integer');
 if(!/^[A-Z]{3}$/.test(o.currency||''))throw Error('--currency must be three uppercase letters');
 [row]=await db.query('insert into deals(competitor_id,name,owner,amount_cents,currency,next_review) values($1,$2,$3,$4,$5,$6) returning *',[comp,o.name,o.owner,o.cents,o.currency,o.due]);
 }else if(cmd==='record-outcome'){
 const id=await resolve(db,'deals',args[0]);choice(o.outcome,['won','lost','no_decision'],'outcome');required(o.reason,'--reason');date(o.date,'--date');if(o.date>new Date().toISOString().slice(0,10))throw Error('Outcome cannot be future dated');
 const [old]=await db.query('select * from deals where id=$1 for update',[id]);if(old.outcome!=='open')throw Error('Outcome already recorded; reconcile it explicitly');
 [row]=await db.query('update deals set outcome=$2,reason=$3,closed_on=$4,next_review=null where id=$1 returning *',[id,o.outcome,o.reason,o.date]);comp=row.competitor_id;
 }else if(cmd==='add-task'){
 comp=await resolve(db,'competitors',o.competitor);required(o.name,'--name');required(o.owner,'--owner');date(o.due,'--due');
 [row]=await db.query('insert into tasks(competitor_id,name,owner,due_on) values($1,$2,$3,$4) returning *',[comp,o.name,o.owner,o.due]);
 }else if(cmd==='complete-task'){
 const id=await resolve(db,'tasks',args[0]);[row]=await db.query('update tasks set done_on=current_date where id=$1 and done_on is null returning *',[id]);if(!row)throw Error('Task already complete');comp=row.competitor_id;
 }else if(cmd==='log'){
 comp=await resolve(db,'competitors',o.competitor);required(o.note,'--note');row={note:o.note};
 }else throw Error(`Unknown command: ${cmd}`);
 await audit(db,comp,o.actor,cmd,JSON.stringify(row));return row;
 },o['dry-run']===true);
}
function future(v,name){date(v,name);if(v<new Date().toISOString().slice(0,10))throw Error(`${name} cannot be past`);return v;}
export function privateFile(dir,prefix,contents,ext){const target=path.join(REPO_ROOT,dir);fs.mkdirSync(target,{recursive:true,mode:0o700});const file=path.join(target,`${prefix}-${Date.now()}-${crypto.randomUUID().slice(0,8)}.${ext}`);fs.writeFileSync(file,contents,{mode:0o600,flag:'wx'});return {file};}
export async function importCrayon(db,args,o){
 if(args[0]!=='crayon')throw Error('Import supports crayon prepared CSV or JSON extracts');required(args[1],'input file');required(o.actor,'--actor');required(o.owner,'--owner');
 const input=fs.readFileSync(args[1],'utf8');const rows=args[1].endsWith('.json')?JSON.parse(input):parseCsv(input);
 if(!Array.isArray(rows)||!rows.length)throw Error('Input must contain a nonempty array of prepared records');
 const map=o.map?JSON.parse(fs.readFileSync(o.map,'utf8')):{};
 const records=rows.map((raw,i)=>{
 const field=(key,...aliases)=>{const value=pick(raw,map[key]||key,...aliases);return typeof value==='string'||typeof value==='number'?String(value):'';};
 const r={source_id:required(field('id','source_id','Insight ID'),`row ${i+1} id`),competitor:required(field('competitor','Competitor Name'),`row ${i+1} competitor`),title:required(field('title'),`row ${i+1} title`),summary:required(field('summary'),`row ${i+1} summary`),source_url:url(field('source_url','Source URL','url')),observed_on:date(field('date','observed_on'),`row ${i+1} date`),kind:field('kind')||'other',raw};
 if(r.observed_on>new Date().toISOString().slice(0,10))throw Error(`row ${i+1}: observation is future dated`);
 choice(r.kind,['pricing','product','review','call','news','other'],'kind');return r;
 });
 if(new Set(records.map(r=>r.source_id)).size!==records.length)throw Error('Duplicate source IDs within file');
 return transaction(db,async()=>{
 let inserted=0,skipped=0;
 for(const r of records){
 const [old]=await db.query('select * from evidence where source_id=$1',[r.source_id]);
 if(old){const [c]=await db.query('select name from competitors where id=$1',[old.competitor_id]);if(c.name.toLowerCase()!==r.competitor.toLowerCase()||['title','summary','source_url','observed_on','kind'].some(k=>String(old[k])!==r[k])||JSON.stringify(sortObject(old.raw))!==JSON.stringify(sortObject(r.raw)))throw Error(`Changed source ID ${r.source_id}; reconcile before importing`);skipped++;continue;}
 let [c]=await db.query('select id from competitors where lower(name)=lower($1)',[r.competitor]);
 if(!c)[c]=await db.query('insert into competitors(name,owner) values($1,$2) returning id',[r.competitor,o.owner]);
 await db.query('insert into evidence(competitor_id,source_id,title,summary,source_url,observed_on,kind,raw,personal) values($1,$2,$3,$4,$5,$6,$7,$8,true)',[c.id,r.source_id,r.title,r.summary,r.source_url,r.observed_on,r.kind,JSON.stringify(r.raw)]);
 await audit(db,c.id,o.actor,'import-crayon',r.source_id);inserted++;
 }
 return {inserted,skipped,dry_run:o['dry-run']===true,review:'Imported evidence is unreviewed; rights unknown; personal-data review required'};
 },o['dry-run']===true);
}
function sortObject(v){if(Array.isArray(v))return v.map(sortObject);if(v&&typeof v==='object')return Object.fromEntries(Object.keys(v).sort().map(k=>[k,sortObject(v[k])]));return v;}
