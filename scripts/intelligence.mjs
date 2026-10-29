#!/usr/bin/env node
import {getDb} from './lib/db.mjs';
import {execute,reads} from './lib/intelligence.mjs';
import {table} from './lib/format.mjs';
const options={},args=[];
for(const v of process.argv.slice(2)){if(v.startsWith('--')){const i=v.indexOf('=');options[v.slice(2,i<0?undefined:i)]=i<0?true:v.slice(i+1);}else args.push(v);}
if(!args.length||options.help){console.log('Competitive intelligence desk\n'+[...Object.keys(reads),'battlecard <competitor>','compliance','insights','weekly-review','add-competitor','add-evidence','review-evidence <id>','add-claim','approve-claim <id>','retire-claim <id>','add-deal','record-outcome <id>','add-task','complete-task <id>','log','import crayon <file>','export','draft-battlecard <competitor>','draft-deal-brief <deal>','draft-weekly-brief'].join('\n')+'\nReads support --json. Writes require --actor and support --dry-run. See docs/cli.md.');process.exit(0);}
const db=await getDb();
const cmd=args.shift();
const display={
 'evidence-inbox':[['competitor','Competitor'],['title','Observation'],['review_state','Review state'],['review_due','Review due']],
 'battlecard-review':[['competitor','Competitor'],['statement','Comparison point'],['usable','Usable today']],
 'deal-prep':[['deal','Deal'],['competitor','Competitor'],['usable_points','Reviewed points']],
};
try{const result=await execute(db,cmd,args,options);if(options.json)console.log(JSON.stringify(result,null,2));else if(Array.isArray(result)&&result.every(r=>!r.rows))console.log(table(result,display[cmd]?display[cmd].map(([key,label])=>({key,label,width:48})):Object.keys(result[0]||{}).map(key=>({key,label:key,width:key==='source'?60:80}))));else console.log(JSON.stringify(result,null,2));}
catch(e){if(options.json)console.error(JSON.stringify({error:e.message,candidates:e.candidates||[]}));else{console.error(e.message);if(e.candidates)console.error(table(e.candidates,[{key:'id',label:'id'},{key:'name',label:'name'}]));}process.exitCode=1;}
finally{await db.close();}
