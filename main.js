#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const clauses = new Set(["SELECT","FROM","WHERE","GROUP","ORDER","HAVING","LIMIT","OFFSET","UNION","INSERT","UPDATE","DELETE","VALUES","SET","RETURNING","JOIN","LEFT","RIGHT","INNER","FULL","CROSS","ON"]);
const logical = new Set(["AND","OR"]);
function tokenize(sql) {
  const tokens=[]; let i=0;
  while(i<sql.length) {
    if(/\s/.test(sql[i])) { i++; continue; }
    const start=i, c=sql[i];
    if(c==="'"||c==='"'||c==="\x60") {
      const quote=c; i++;
      while(i<sql.length) { if(sql[i]==="\\"){i+=2;continue;} if(sql[i]===quote){if(sql[i+1]===quote){i+=2;continue;}i++;break;} i++; }
      tokens.push({type:"literal",value:sql.slice(start,i)}); continue;
    }
    if(c==="-"&&sql[i+1]==="-") { i+=2; while(i<sql.length&&sql[i]!=="\n")i++; tokens.push({type:"comment",value:sql.slice(start,i)}); continue; }
    if(c==="/"&&sql[i+1]==="*") { i+=2; while(i<sql.length&&!(sql[i]==="*"&&sql[i+1]==="/"))i++; i=Math.min(sql.length,i+2); tokens.push({type:"comment",value:sql.slice(start,i)}); continue; }
    if(/[A-Za-z_]/.test(c)) { i++; while(i<sql.length&&/[A-Za-z0-9_$]/.test(sql[i]))i++; tokens.push({type:"word",value:sql.slice(start,i)}); continue; }
    if(/[0-9]/.test(c)) { i++; while(i<sql.length&&/[0-9.]/.test(sql[i]))i++; tokens.push({type:"number",value:sql.slice(start,i)}); continue; }
    const pair=sql.slice(i,i+2); if(["<=",">=","<>","!=","::",":=","||"].includes(pair)){tokens.push({type:"operator",value:pair});i+=2;continue;}
    tokens.push({type:"punct",value:c});i++;
  }
  return tokens;
}
function format(sql) {
  const tokens=tokenize(sql); let out="",indent=0,lineStart=true,last="",depth=0;
  const pad=()=> " ".repeat(Math.max(0,indent));
  const write=(v,space=true)=>{if(lineStart){out+=pad();lineStart=false;}else if(space&&out&&!/[\s(.]$/.test(out))out+=" ";out+=v;last=v;};
  const newline=()=>{out=out.replace(/[ \t]+$/,"");if(out&&!out.endsWith("\n"))out+="\n";lineStart=true;};
  for(let i=0;i<tokens.length;i++){
    const t=tokens[i],v=t.value,upper=v.toUpperCase();
    if(t.type==="word"&&clauses.has(upper)&&out.trim()) { if(upper==="LEFT"||upper==="RIGHT"||upper==="INNER"||upper==="FULL"||upper==="CROSS") {newline();write(upper+" JOIN",true);i++;last="JOIN";continue;} newline(); }
    if(t.type==="word"&&logical.has(upper)&&depth===0&&out.trim()){newline();write(upper,true);continue;}
    if(v==="("){write("(",!["","."].includes(last));depth++;indent+=2;continue;}
    if(v===")"){depth=Math.max(0,depth-1);indent=Math.max(0,indent-2);if(lineStart===false&&last!=="(")write(")",false);else write(")",false);continue;}
    if(v===","){write(",",false);newline();continue;}
    if(v===";"){write(";",false);newline();continue;}
    if(v==="."){write(".",false);continue;}
    if(t.type==="operator"){write(v,true);continue;}
    if(t.type==="comment"){if(out&&!out.endsWith("\n"))newline();write(v,false);if(v.startsWith("--"))newline();continue;}
    write(t.type==="word"&&/^(select|from|where|group|order|by|having|limit|offset|insert|into|update|delete|values|set|returning|join|on|as|and|or|not|null|is|in|like|distinct|case|when|then|else|end|asc|desc)$/i.test(v)?upper:v,true);
  }
  return out.trim()+"\n";
}
function usage(){console.log("Usage: npm start -- [file.sql] [--write|--check]\nReads stdin when no file is supplied. --write creates a separate .formatted.sql file.");}
function main(){
  const args=process.argv.slice(2); if(args.includes("--help")){usage();return;}
  const mode=args.includes("--write")?"write":args.includes("--check")?"check":"print";
  const file=args.find(x=>!x.startsWith("--"));
  if(!file&&process.stdin.isTTY){usage();process.exitCode=2;return;}
  const source=file?fs.readFileSync(file,"utf8"):fs.readFileSync(0,"utf8");
  const result=format(source);
  if(mode==="check"){if(source.replace(/\s+$/,"")!==result.replace(/\s+$/,"")){console.error("SQL needs formatting.");process.exitCode=1;}else console.log("SQL is formatted.");return;}
  if(mode==="write"){if(!file){console.error("--write requires a file path.");process.exitCode=2;return;}const target=file.replace(/(\.sql)?$/,".formatted.sql");fs.writeFileSync(target,result,"utf8");console.log("Wrote "+target);return;}
  process.stdout.write(result);
}
if(require.main===module)main();
module.exports={format,tokenize};
