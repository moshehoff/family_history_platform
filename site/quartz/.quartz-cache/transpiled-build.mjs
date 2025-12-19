var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import sourceMapSupport from"source-map-support";import path11 from"path";import pretty from"pretty-time";import{styleText}from"util";var PerfTimer=class{static{__name(this,"PerfTimer")}evts;constructor(){this.evts={},this.addEvent("start")}addEvent(evtName){this.evts[evtName]=process.hrtime()}timeSince(evtName){return styleText("yellow",pretty(process.hrtime(this.evts[evtName??"start"])))}};import{rm}from"fs/promises";import{isGitIgnored}from"globby";import{styleText as styleText7}from"util";import esbuild from"esbuild";import remarkParse from"remark-parse";import remarkRehype from"remark-rehype";import{unified}from"unified";import{read}from"to-vfile";import{slug as slugAnchor}from"github-slugger";import rfdc from"rfdc";var clone=rfdc();var QUARTZ="quartz";function isRelativeURL(s){let validStart=/^\.{1,2}/.test(s),validEnding=!endsWith(s,"index");return validStart&&validEnding&&![".md",".html"].includes(getFileExtension(s)??"")}__name(isRelativeURL,"isRelativeURL");function sluggify(s){return s.split("/").map(segment=>segment.replace(/\s/g,"-").replace(/&/g,"-and-").replace(/%/g,"-percent").replace(/\?/g,"").replace(/#/g,"")).join("/").replace(/\/$/,"")}__name(sluggify,"sluggify");function slugifyFilePath(fp,excludeExt){fp=stripSlashes(fp);let ext=getFileExtension(fp),withoutFileExt=fp.replace(new RegExp(ext+"$"),"");(excludeExt||[".md",".html",void 0].includes(ext))&&(ext="");let slug=sluggify(withoutFileExt);return endsWith(slug,"_index")&&(slug=slug.replace(/_index$/,"index")),slug+ext}__name(slugifyFilePath,"slugifyFilePath");function simplifySlug(fp){let res=stripSlashes(trimSuffix(fp,"index"),!0);return res.length===0?"/":res}__name(simplifySlug,"simplifySlug");function transformInternalLink(link){let[fplike,anchor]=splitAnchor(decodeURI(link)),folderPath=isFolderPath(fplike),segments=fplike.split("/").filter(x=>x.length>0),prefix=segments.filter(isRelativeSegment).join("/"),fp=segments.filter(seg=>!isRelativeSegment(seg)&&seg!=="").join("/"),simpleSlug=simplifySlug(slugifyFilePath(fp)),joined=joinSegments(stripSlashes(prefix),stripSlashes(simpleSlug)),trail=folderPath?"/":"";return _addRelativeToStart(joined)+trail+anchor}__name(transformInternalLink,"transformInternalLink");var _rebaseHastElement=__name((el,attr,curBase,newBase)=>{if(el.properties?.[attr]){if(!isRelativeURL(String(el.properties[attr])))return;let rel=joinSegments(resolveRelative(curBase,newBase),"..",el.properties[attr]);el.properties[attr]=rel}},"_rebaseHastElement");function normalizeHastElement(rawEl,curBase,newBase){let el=clone(rawEl);return _rebaseHastElement(el,"src",curBase,newBase),_rebaseHastElement(el,"href",curBase,newBase),el.children&&(el.children=el.children.map(child=>normalizeHastElement(child,curBase,newBase))),el}__name(normalizeHastElement,"normalizeHastElement");function pathToRoot(slug){let rootPath=slug.split("/").filter(x=>x!=="").slice(0,-1).map(_=>"..").join("/");return rootPath.length===0&&(rootPath="."),rootPath}__name(pathToRoot,"pathToRoot");function resolveRelative(current,target){return joinSegments(pathToRoot(current),simplifySlug(target))}__name(resolveRelative,"resolveRelative");function splitAnchor(link){let[fp,anchor]=link.split("#",2);return fp.endsWith(".pdf")?[fp,anchor===void 0?"":`#${anchor}`]:anchor&&(anchor.includes("=")||anchor.includes("&"))?[fp,`#${anchor}`]:(anchor=anchor===void 0?"":"#"+slugAnchor(anchor),[fp,anchor])}__name(splitAnchor,"splitAnchor");function slugTag(tag){return tag.split("/").map(tagSegment=>sluggify(tagSegment)).join("/")}__name(slugTag,"slugTag");function joinSegments(...args){if(args.length===0)return"";let joined=args.filter(segment=>segment!==""&&segment!=="/").map(segment=>stripSlashes(segment)).join("/");return args[0].startsWith("/")&&(joined="/"+joined),args[args.length-1].endsWith("/")&&(joined=joined+"/"),joined}__name(joinSegments,"joinSegments");function getAllSegmentPrefixes(tags){let segments=tags.split("/"),results=[];for(let i=0;i<segments.length;i++)results.push(segments.slice(0,i+1).join("/"));return results}__name(getAllSegmentPrefixes,"getAllSegmentPrefixes");function transformLink(src,target,opts){let targetSlug=transformInternalLink(target);if(opts.strategy==="relative")return targetSlug;{let folderTail=isFolderPath(targetSlug)?"/":"",canonicalSlug=stripSlashes(targetSlug.slice(1)),[targetCanonical,targetAnchor]=splitAnchor(canonicalSlug);if(opts.strategy==="shortest"){let matchingFileNames=opts.allSlugs.filter(slug=>{let fileName=slug.split("/").at(-1);return targetCanonical===fileName});if(matchingFileNames.length===1){let targetSlug2=matchingFileNames[0];return resolveRelative(src,targetSlug2)+targetAnchor}}return joinSegments(pathToRoot(src),canonicalSlug)+folderTail}}__name(transformLink,"transformLink");function isFolderPath(fplike){return fplike.endsWith("/")||endsWith(fplike,"index")||endsWith(fplike,"index.md")||endsWith(fplike,"index.html")}__name(isFolderPath,"isFolderPath");function endsWith(s,suffix){return s===suffix||s.endsWith("/"+suffix)}__name(endsWith,"endsWith");function trimSuffix(s,suffix){return endsWith(s,suffix)&&(s=s.slice(0,-suffix.length)),s}__name(trimSuffix,"trimSuffix");function getFileExtension(s){return s.match(/\.[A-Za-z0-9]+$/)?.[0]}__name(getFileExtension,"getFileExtension");function isRelativeSegment(s){return/^\.{0,2}$/.test(s)}__name(isRelativeSegment,"isRelativeSegment");function stripSlashes(s,onlyStripPrefix){return s.startsWith("/")&&(s=s.substring(1)),!onlyStripPrefix&&s.endsWith("/")&&(s=s.slice(0,-1)),s}__name(stripSlashes,"stripSlashes");function _addRelativeToStart(s){return s===""&&(s="."),s.startsWith(".")||(s=joinSegments(".",s)),s}__name(_addRelativeToStart,"_addRelativeToStart");import path from"path";import workerpool from"workerpool";import truncate from"ansi-truncate";import readline from"readline";var QuartzLogger=class{static{__name(this,"QuartzLogger")}verbose;spinnerInterval;spinnerText="";updateSuffix="";spinnerIndex=0;spinnerChars=["\u280B","\u2819","\u2839","\u2838","\u283C","\u2834","\u2826","\u2827","\u2807","\u280F"];constructor(verbose){let isInteractiveTerminal=process.stdout.isTTY&&process.env.TERM!=="dumb"&&!process.env.CI;this.verbose=verbose||!isInteractiveTerminal}start(text){this.spinnerText=text,this.verbose?console.log(text):(this.spinnerIndex=0,this.spinnerInterval=setInterval(()=>{readline.clearLine(process.stdout,0),readline.cursorTo(process.stdout,0);let columns=process.stdout.columns||80,output=`${this.spinnerChars[this.spinnerIndex]} ${this.spinnerText}`;this.updateSuffix&&(output+=`: ${this.updateSuffix}`);let truncated=truncate(output,columns);process.stdout.write(truncated),this.spinnerIndex=(this.spinnerIndex+1)%this.spinnerChars.length},50))}updateText(text){this.updateSuffix=text}end(text){!this.verbose&&this.spinnerInterval&&(clearInterval(this.spinnerInterval),this.spinnerInterval=void 0,readline.clearLine(process.stdout,0),readline.cursorTo(process.stdout,0)),text&&console.log(text)}};import{styleText as styleText2}from"util";import process2 from"process";import{isMainThread}from"workerpool";var rootFile=/.*at file:/;function trace(msg,err){let stack=err.stack??"",lines=[];lines.push(""),lines.push(`
`+styleText2(["bgRed","black","bold"]," ERROR ")+`

`+styleText2("red",` ${msg}`)+(err.message.length>0?`: ${err.message}`:""));let reachedEndOfLegibleTrace=!1;for(let line of stack.split(`
`).slice(1)){if(reachedEndOfLegibleTrace)break;line.includes("node_modules")||(lines.push(` ${line}`),rootFile.test(line)&&(reachedEndOfLegibleTrace=!0))}let traceMsg=lines.join(`
`);if(isMainThread)console.error(traceMsg),process2.exit(1);else throw new Error(traceMsg)}__name(trace,"trace");import{styleText as styleText3}from"util";function createMdProcessor(ctx){let transformers=ctx.cfg.plugins.transformers;return unified().use(remarkParse).use(transformers.flatMap(plugin=>plugin.markdownPlugins?.(ctx)??[]))}__name(createMdProcessor,"createMdProcessor");function createHtmlProcessor(ctx){let transformers=ctx.cfg.plugins.transformers;return unified().use(remarkRehype,{allowDangerousHtml:!0}).use(transformers.flatMap(plugin=>plugin.htmlPlugins?.(ctx)??[]))}__name(createHtmlProcessor,"createHtmlProcessor");function*chunks(arr,n){for(let i=0;i<arr.length;i+=n)yield arr.slice(i,i+n)}__name(chunks,"chunks");async function transpileWorkerScript(){return esbuild.build({entryPoints:["./quartz/worker.ts"],outfile:path.join(QUARTZ,"./.quartz-cache/transpiled-worker.mjs"),bundle:!0,keepNames:!0,platform:"node",format:"esm",packages:"external",sourcemap:!0,sourcesContent:!1,plugins:[{name:"css-and-scripts-as-text",setup(build){build.onLoad({filter:/\.scss$/},_=>({contents:"",loader:"text"})),build.onLoad({filter:/\.inline\.(ts|js)$/},_=>({contents:"",loader:"text"}))}}]})}__name(transpileWorkerScript,"transpileWorkerScript");function createFileParser(ctx,fps){let{argv,cfg}=ctx;return async processor=>{let res=[];for(let fp of fps)try{let perf=new PerfTimer,file=await read(fp);file.value=file.value.toString().trim();for(let plugin of cfg.plugins.transformers.filter(p=>p.textTransform))file.value=plugin.textTransform(ctx,file.value.toString());file.data.filePath=file.path,file.data.relativePath=path.posix.relative(argv.directory,file.path),file.data.slug=slugifyFilePath(file.data.relativePath);let ast=processor.parse(file),newAst=await processor.run(ast,file);res.push([newAst,file]),argv.verbose&&console.log(`[markdown] ${fp} -> ${file.data.slug} (${perf.timeSince()})`)}catch(err){trace(`
Failed to process markdown \`${fp}\``,err)}return res}}__name(createFileParser,"createFileParser");function createMarkdownParser(ctx,mdContent){return async processor=>{let res=[];for(let[ast,file]of mdContent)try{let perf=new PerfTimer,newAst=await processor.run(ast,file);res.push([newAst,file]),ctx.argv.verbose&&console.log(`[html] ${file.data.slug} (${perf.timeSince()})`)}catch(err){trace(`
Failed to process html \`${file.data.filePath}\``,err)}return res}}__name(createMarkdownParser,"createMarkdownParser");var clamp=__name((num,min,max)=>Math.min(Math.max(Math.round(num),min),max),"clamp");async function parseMarkdown(ctx,fps){let{argv}=ctx,perf=new PerfTimer,log=new QuartzLogger(argv.verbose),CHUNK_SIZE=128,concurrency=ctx.argv.concurrency??clamp(fps.length/CHUNK_SIZE,1,4),res=[];if(log.start(`Parsing input files using ${concurrency} threads`),concurrency===1)try{let mdRes=await createFileParser(ctx,fps)(createMdProcessor(ctx));res=await createMarkdownParser(ctx,mdRes)(createHtmlProcessor(ctx))}catch(error){throw log.end(),error}else{await transpileWorkerScript();let pool=workerpool.pool("./quartz/bootstrap-worker.mjs",{minWorkers:"max",maxWorkers:concurrency,workerType:"thread"}),errorHandler=__name(err=>{console.error(err),process.exit(1)},"errorHandler"),serializableCtx={buildId:ctx.buildId,argv:ctx.argv,allSlugs:ctx.allSlugs,allFiles:ctx.allFiles,incremental:ctx.incremental},textToMarkdownPromises=[],processedFiles=0;for(let chunk of chunks(fps,CHUNK_SIZE))textToMarkdownPromises.push(pool.exec("parseMarkdown",[serializableCtx,chunk]));let mdResults=await Promise.all(textToMarkdownPromises.map(async promise=>{let result=await promise;return processedFiles+=result.length,log.updateText(`text->markdown ${styleText3("gray",`${processedFiles}/${fps.length}`)}`),result})).catch(errorHandler),markdownToHtmlPromises=[];processedFiles=0;for(let mdChunk of mdResults)markdownToHtmlPromises.push(pool.exec("processHtml",[serializableCtx,mdChunk]));res=(await Promise.all(markdownToHtmlPromises.map(async promise=>{let result=await promise;return processedFiles+=result.length,log.updateText(`markdown->html ${styleText3("gray",`${processedFiles}/${fps.length}`)}`),result})).catch(errorHandler)).flat(),await pool.terminate()}return log.end(`Parsed ${res.length} Markdown files in ${perf.timeSince()}`),res}__name(parseMarkdown,"parseMarkdown");function filterContent(ctx,content){let{cfg,argv}=ctx,perf=new PerfTimer,initialLength=content.length;for(let plugin of cfg.plugins.filters){let updatedContent=content.filter(item=>plugin.shouldPublish(ctx,item));if(argv.verbose){let diff=content.filter(x=>!updatedContent.includes(x));for(let file of diff)console.log(`[filter:${plugin.name}] ${file[1].data.slug}`)}content=updatedContent}return console.log(`Filtered out ${initialLength-content.length} files in ${perf.timeSince()}`),content}__name(filterContent,"filterContent");import matter from"gray-matter";import remarkFrontmatter from"remark-frontmatter";import yaml from"js-yaml";import toml from"toml";var en_US_default={propertyDefaults:{title:"Untitled",description:"No description provided"},components:{callout:{note:"Note",abstract:"Abstract",info:"Info",todo:"Todo",tip:"Tip",success:"Success",question:"Question",warning:"Warning",failure:"Failure",danger:"Danger",bug:"Bug",example:"Example",quote:"Quote"},backlinks:{title:"Backlinks",noBacklinksFound:"No backlinks found"},themeToggle:{lightMode:"Light mode",darkMode:"Dark mode"},readerMode:{title:"Reader mode"},explorer:{title:"Explorer"},footer:{createdWith:"Created with"},graph:{title:"Graph View"},recentNotes:{title:"Recent Notes",seeRemainingMore:__name(({remaining})=>`See ${remaining} more \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclude of ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link to original"},search:{title:"Search",searchBarPlaceholder:"Search for something"},tableOfContents:{title:"Table of Contents"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"Recent notes",lastFewNotes:__name(({count})=>`Last ${count} notes`,"lastFewNotes")},error:{title:"Not Found",notFound:"Either this page is private or doesn't exist.",home:"Return to Homepage"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"1 item under this folder.":`${count} items under this folder.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Tag Index",itemsUnderTag:__name(({count})=>count===1?"1 item with this tag.":`${count} items with this tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Showing first ${count} tags.`,"showingFirst"),totalTags:__name(({count})=>`Found ${count} total tags.`,"totalTags")}}};var en_GB_default={propertyDefaults:{title:"Untitled",description:"No description provided"},components:{callout:{note:"Note",abstract:"Abstract",info:"Info",todo:"To-Do",tip:"Tip",success:"Success",question:"Question",warning:"Warning",failure:"Failure",danger:"Danger",bug:"Bug",example:"Example",quote:"Quote"},backlinks:{title:"Backlinks",noBacklinksFound:"No backlinks found"},themeToggle:{lightMode:"Light mode",darkMode:"Dark mode"},readerMode:{title:"Reader mode"},explorer:{title:"Explorer"},footer:{createdWith:"Created with"},graph:{title:"Graph View"},recentNotes:{title:"Recent Notes",seeRemainingMore:__name(({remaining})=>`See ${remaining} more \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclude of ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link to original"},search:{title:"Search",searchBarPlaceholder:"Search for something"},tableOfContents:{title:"Table of Contents"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"Recent notes",lastFewNotes:__name(({count})=>`Last ${count} notes`,"lastFewNotes")},error:{title:"Not Found",notFound:"Either this page is private or doesn't exist.",home:"Return to Homepage"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"1 item under this folder.":`${count} items under this folder.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Tag Index",itemsUnderTag:__name(({count})=>count===1?"1 item with this tag.":`${count} items with this tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Showing first ${count} tags.`,"showingFirst"),totalTags:__name(({count})=>`Found ${count} total tags.`,"totalTags")}}};var fr_FR_default={propertyDefaults:{title:"Sans titre",description:"Aucune description fournie"},components:{callout:{note:"Note",abstract:"R\xE9sum\xE9",info:"Info",todo:"\xC0 faire",tip:"Conseil",success:"Succ\xE8s",question:"Question",warning:"Avertissement",failure:"\xC9chec",danger:"Danger",bug:"Bogue",example:"Exemple",quote:"Citation"},backlinks:{title:"Liens retour",noBacklinksFound:"Aucun lien retour trouv\xE9"},themeToggle:{lightMode:"Mode clair",darkMode:"Mode sombre"},readerMode:{title:"Mode lecture"},explorer:{title:"Explorateur"},footer:{createdWith:"Cr\xE9\xE9 avec"},graph:{title:"Vue Graphique"},recentNotes:{title:"Notes R\xE9centes",seeRemainingMore:__name(({remaining})=>`Voir ${remaining} de plus \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclusion de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Lien vers l'original"},search:{title:"Recherche",searchBarPlaceholder:"Rechercher quelque chose"},tableOfContents:{title:"Table des Mati\xE8res"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min de lecture`,"readingTime")}},pages:{rss:{recentNotes:"Notes r\xE9centes",lastFewNotes:__name(({count})=>`Les derni\xE8res ${count} notes`,"lastFewNotes")},error:{title:"Introuvable",notFound:"Cette page est soit priv\xE9e, soit elle n'existe pas.",home:"Retour \xE0 la page d'accueil"},folderContent:{folder:"Dossier",itemsUnderFolder:__name(({count})=>count===1?"1 \xE9l\xE9ment sous ce dossier.":`${count} \xE9l\xE9ments sous ce dossier.`,"itemsUnderFolder")},tagContent:{tag:"\xC9tiquette",tagIndex:"Index des \xE9tiquettes",itemsUnderTag:__name(({count})=>count===1?"1 \xE9l\xE9ment avec cette \xE9tiquette.":`${count} \xE9l\xE9ments avec cette \xE9tiquette.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Affichage des premi\xE8res ${count} \xE9tiquettes.`,"showingFirst"),totalTags:__name(({count})=>`Trouv\xE9 ${count} \xE9tiquettes au total.`,"totalTags")}}};var it_IT_default={propertyDefaults:{title:"Senza titolo",description:"Nessuna descrizione"},components:{callout:{note:"Nota",abstract:"Astratto",info:"Info",todo:"Da fare",tip:"Consiglio",success:"Completato",question:"Domanda",warning:"Attenzione",failure:"Errore",danger:"Pericolo",bug:"Bug",example:"Esempio",quote:"Citazione"},backlinks:{title:"Link entranti",noBacklinksFound:"Nessun link entrante"},themeToggle:{lightMode:"Tema chiaro",darkMode:"Tema scuro"},readerMode:{title:"Modalit\xE0 lettura"},explorer:{title:"Esplora"},footer:{createdWith:"Creato con"},graph:{title:"Vista grafico"},recentNotes:{title:"Note recenti",seeRemainingMore:__name(({remaining})=>`Vedi ${remaining} altro \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transclusione di ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link all'originale"},search:{title:"Cerca",searchBarPlaceholder:"Cerca qualcosa"},tableOfContents:{title:"Tabella dei contenuti"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} minuti`,"readingTime")}},pages:{rss:{recentNotes:"Note recenti",lastFewNotes:__name(({count})=>`Ultime ${count} note`,"lastFewNotes")},error:{title:"Non trovato",notFound:"Questa pagina \xE8 privata o non esiste.",home:"Ritorna alla home page"},folderContent:{folder:"Cartella",itemsUnderFolder:__name(({count})=>count===1?"1 oggetto in questa cartella.":`${count} oggetti in questa cartella.`,"itemsUnderFolder")},tagContent:{tag:"Etichetta",tagIndex:"Indice etichette",itemsUnderTag:__name(({count})=>count===1?"1 oggetto con questa etichetta.":`${count} oggetti con questa etichetta.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Prime ${count} etichette.`,"showingFirst"),totalTags:__name(({count})=>`Trovate ${count} etichette totali.`,"totalTags")}}};var ja_JP_default={propertyDefaults:{title:"\u7121\u984C",description:"\u8AAC\u660E\u306A\u3057"},components:{callout:{note:"\u30CE\u30FC\u30C8",abstract:"\u6284\u9332",info:"\u60C5\u5831",todo:"\u3084\u308B\u3079\u304D\u3053\u3068",tip:"\u30D2\u30F3\u30C8",success:"\u6210\u529F",question:"\u8CEA\u554F",warning:"\u8B66\u544A",failure:"\u5931\u6557",danger:"\u5371\u967A",bug:"\u30D0\u30B0",example:"\u4F8B",quote:"\u5F15\u7528"},backlinks:{title:"\u30D0\u30C3\u30AF\u30EA\u30F3\u30AF",noBacklinksFound:"\u30D0\u30C3\u30AF\u30EA\u30F3\u30AF\u306F\u3042\u308A\u307E\u305B\u3093"},themeToggle:{lightMode:"\u30E9\u30A4\u30C8\u30E2\u30FC\u30C9",darkMode:"\u30C0\u30FC\u30AF\u30E2\u30FC\u30C9"},readerMode:{title:"\u30EA\u30FC\u30C0\u30FC\u30E2\u30FC\u30C9"},explorer:{title:"\u30A8\u30AF\u30B9\u30D7\u30ED\u30FC\u30E9\u30FC"},footer:{createdWith:"\u4F5C\u6210"},graph:{title:"\u30B0\u30E9\u30D5\u30D3\u30E5\u30FC"},recentNotes:{title:"\u6700\u8FD1\u306E\u8A18\u4E8B",seeRemainingMore:__name(({remaining})=>`\u3055\u3089\u306B${remaining}\u4EF6 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug}\u306E\u307E\u3068\u3081`,"transcludeOf"),linkToOriginal:"\u5143\u8A18\u4E8B\u3078\u306E\u30EA\u30F3\u30AF"},search:{title:"\u691C\u7D22",searchBarPlaceholder:"\u691C\u7D22\u30EF\u30FC\u30C9\u3092\u5165\u529B"},tableOfContents:{title:"\u76EE\u6B21"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"\u6700\u8FD1\u306E\u8A18\u4E8B",lastFewNotes:__name(({count})=>`\u6700\u65B0\u306E${count}\u4EF6`,"lastFewNotes")},error:{title:"Not Found",notFound:"\u30DA\u30FC\u30B8\u304C\u5B58\u5728\u3057\u306A\u3044\u304B\u3001\u975E\u516C\u958B\u8A2D\u5B9A\u306B\u306A\u3063\u3066\u3044\u307E\u3059\u3002",home:"\u30DB\u30FC\u30E0\u30DA\u30FC\u30B8\u306B\u623B\u308B"},folderContent:{folder:"\u30D5\u30A9\u30EB\u30C0",itemsUnderFolder:__name(({count})=>`${count}\u4EF6\u306E\u30DA\u30FC\u30B8`,"itemsUnderFolder")},tagContent:{tag:"\u30BF\u30B0",tagIndex:"\u30BF\u30B0\u4E00\u89A7",itemsUnderTag:__name(({count})=>`${count}\u4EF6\u306E\u30DA\u30FC\u30B8`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u306E\u3046\u3061\u6700\u521D\u306E${count}\u4EF6\u3092\u8868\u793A\u3057\u3066\u3044\u307E\u3059`,"showingFirst"),totalTags:__name(({count})=>`\u5168${count}\u500B\u306E\u30BF\u30B0\u3092\u8868\u793A\u4E2D`,"totalTags")}}};var de_DE_default={propertyDefaults:{title:"Unbenannt",description:"Keine Beschreibung angegeben"},components:{callout:{note:"Hinweis",abstract:"Zusammenfassung",info:"Info",todo:"Zu erledigen",tip:"Tipp",success:"Erfolg",question:"Frage",warning:"Warnung",failure:"Fehlgeschlagen",danger:"Gefahr",bug:"Fehler",example:"Beispiel",quote:"Zitat"},backlinks:{title:"Backlinks",noBacklinksFound:"Keine Backlinks gefunden"},themeToggle:{lightMode:"Heller Modus",darkMode:"Dunkler Modus"},readerMode:{title:"Lesemodus"},explorer:{title:"Explorer"},footer:{createdWith:"Erstellt mit"},graph:{title:"Graphansicht"},recentNotes:{title:"Zuletzt bearbeitete Seiten",seeRemainingMore:__name(({remaining})=>`${remaining} weitere ansehen \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transklusion von ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link zum Original"},search:{title:"Suche",searchBarPlaceholder:"Suche nach etwas"},tableOfContents:{title:"Inhaltsverzeichnis"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} Min. Lesezeit`,"readingTime")}},pages:{rss:{recentNotes:"Zuletzt bearbeitete Seiten",lastFewNotes:__name(({count})=>`Letzte ${count} Seiten`,"lastFewNotes")},error:{title:"Nicht gefunden",notFound:"Diese Seite ist entweder nicht \xF6ffentlich oder existiert nicht.",home:"Zur Startseite"},folderContent:{folder:"Ordner",itemsUnderFolder:__name(({count})=>count===1?"1 Datei in diesem Ordner.":`${count} Dateien in diesem Ordner.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Tag-\xDCbersicht",itemsUnderTag:__name(({count})=>count===1?"1 Datei mit diesem Tag.":`${count} Dateien mit diesem Tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Die ersten ${count} Tags werden angezeigt.`,"showingFirst"),totalTags:__name(({count})=>`${count} Tags insgesamt.`,"totalTags")}}};var nl_NL_default={propertyDefaults:{title:"Naamloos",description:"Geen beschrijving gegeven."},components:{callout:{note:"Notitie",abstract:"Samenvatting",info:"Info",todo:"Te doen",tip:"Tip",success:"Succes",question:"Vraag",warning:"Waarschuwing",failure:"Mislukking",danger:"Gevaar",bug:"Bug",example:"Voorbeeld",quote:"Citaat"},backlinks:{title:"Backlinks",noBacklinksFound:"Geen backlinks gevonden"},themeToggle:{lightMode:"Lichte modus",darkMode:"Donkere modus"},readerMode:{title:"Leesmodus"},explorer:{title:"Verkenner"},footer:{createdWith:"Gemaakt met"},graph:{title:"Grafiekweergave"},recentNotes:{title:"Recente notities",seeRemainingMore:__name(({remaining})=>`Zie ${remaining} meer \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Invoeging van ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link naar origineel"},search:{title:"Zoeken",searchBarPlaceholder:"Doorzoek de website"},tableOfContents:{title:"Inhoudsopgave"},contentMeta:{readingTime:__name(({minutes})=>minutes===1?"1 minuut leestijd":`${minutes} minuten leestijd`,"readingTime")}},pages:{rss:{recentNotes:"Recente notities",lastFewNotes:__name(({count})=>`Laatste ${count} notities`,"lastFewNotes")},error:{title:"Niet gevonden",notFound:"Deze pagina is niet zichtbaar of bestaat niet.",home:"Keer terug naar de start pagina"},folderContent:{folder:"Map",itemsUnderFolder:__name(({count})=>count===1?"1 item in deze map.":`${count} items in deze map.`,"itemsUnderFolder")},tagContent:{tag:"Label",tagIndex:"Label-index",itemsUnderTag:__name(({count})=>count===1?"1 item met dit label.":`${count} items met dit label.`,"itemsUnderTag"),showingFirst:__name(({count})=>count===1?"Eerste label tonen.":`Eerste ${count} labels tonen.`,"showingFirst"),totalTags:__name(({count})=>`${count} labels gevonden.`,"totalTags")}}};var ro_RO_default={propertyDefaults:{title:"F\u0103r\u0103 titlu",description:"Nici o descriere furnizat\u0103"},components:{callout:{note:"Not\u0103",abstract:"Rezumat",info:"Informa\u021Bie",todo:"De f\u0103cut",tip:"Sfat",success:"Succes",question:"\xCEntrebare",warning:"Avertisment",failure:"E\u0219ec",danger:"Pericol",bug:"Bug",example:"Exemplu",quote:"Citat"},backlinks:{title:"Leg\u0103turi \xEEnapoi",noBacklinksFound:"Nu s-au g\u0103sit leg\u0103turi \xEEnapoi"},themeToggle:{lightMode:"Modul luminos",darkMode:"Modul \xEEntunecat"},readerMode:{title:"Modul de citire"},explorer:{title:"Explorator"},footer:{createdWith:"Creat cu"},graph:{title:"Graf"},recentNotes:{title:"Noti\u021Be recente",seeRemainingMore:__name(({remaining})=>`Vezi \xEEnc\u0103 ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Extras din ${targetSlug}`,"transcludeOf"),linkToOriginal:"Leg\u0103tur\u0103 c\u0103tre original"},search:{title:"C\u0103utare",searchBarPlaceholder:"Introduce\u021Bi termenul de c\u0103utare..."},tableOfContents:{title:"Cuprins"},contentMeta:{readingTime:__name(({minutes})=>minutes==1?"lectur\u0103 de 1 minut":`lectur\u0103 de ${minutes} minute`,"readingTime")}},pages:{rss:{recentNotes:"Noti\u021Be recente",lastFewNotes:__name(({count})=>`Ultimele ${count} noti\u021Be`,"lastFewNotes")},error:{title:"Pagina nu a fost g\u0103sit\u0103",notFound:"Fie aceast\u0103 pagin\u0103 este privat\u0103, fie nu exist\u0103.",home:"Reveni\u021Bi la pagina de pornire"},folderContent:{folder:"Dosar",itemsUnderFolder:__name(({count})=>count===1?"1 articol \xEEn acest dosar.":`${count} elemente \xEEn acest dosar.`,"itemsUnderFolder")},tagContent:{tag:"Etichet\u0103",tagIndex:"Indexul etichetelor",itemsUnderTag:__name(({count})=>count===1?"1 articol cu aceast\u0103 etichet\u0103.":`${count} articole cu aceast\u0103 etichet\u0103.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Se afi\u0219eaz\u0103 primele ${count} etichete.`,"showingFirst"),totalTags:__name(({count})=>`Au fost g\u0103site ${count} etichete \xEEn total.`,"totalTags")}}};var ca_ES_default={propertyDefaults:{title:"Sense t\xEDtol",description:"Sense descripci\xF3"},components:{callout:{note:"Nota",abstract:"Resum",info:"Informaci\xF3",todo:"Per fer",tip:"Consell",success:"\xC8xit",question:"Pregunta",warning:"Advert\xE8ncia",failure:"Fall",danger:"Perill",bug:"Error",example:"Exemple",quote:"Cita"},backlinks:{title:"Retroenlla\xE7",noBacklinksFound:"No s'han trobat retroenlla\xE7os"},themeToggle:{lightMode:"Mode clar",darkMode:"Mode fosc"},readerMode:{title:"Mode lector"},explorer:{title:"Explorador"},footer:{createdWith:"Creat amb"},graph:{title:"Vista Gr\xE0fica"},recentNotes:{title:"Notes Recents",seeRemainingMore:__name(({remaining})=>`Vegi ${remaining} m\xE9s \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transcluit de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Enlla\xE7 a l'original"},search:{title:"Cercar",searchBarPlaceholder:"Cerca alguna cosa"},tableOfContents:{title:"Taula de Continguts"},contentMeta:{readingTime:__name(({minutes})=>`Es llegeix en ${minutes} min`,"readingTime")}},pages:{rss:{recentNotes:"Notes recents",lastFewNotes:__name(({count})=>`\xDAltimes ${count} notes`,"lastFewNotes")},error:{title:"No s'ha trobat.",notFound:"Aquesta p\xE0gina \xE9s privada o no existeix.",home:"Torna a la p\xE0gina principal"},folderContent:{folder:"Carpeta",itemsUnderFolder:__name(({count})=>count===1?"1 article en aquesta carpeta.":`${count} articles en esta carpeta.`,"itemsUnderFolder")},tagContent:{tag:"Etiqueta",tagIndex:"\xEDndex d'Etiquetes",itemsUnderTag:__name(({count})=>count===1?"1 article amb aquesta etiqueta.":`${count} article amb aquesta etiqueta.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Mostrant les primeres ${count} etiquetes.`,"showingFirst"),totalTags:__name(({count})=>`S'han trobat ${count} etiquetes en total.`,"totalTags")}}};var es_ES_default={propertyDefaults:{title:"Sin t\xEDtulo",description:"Sin descripci\xF3n"},components:{callout:{note:"Nota",abstract:"Resumen",info:"Informaci\xF3n",todo:"Por hacer",tip:"Consejo",success:"\xC9xito",question:"Pregunta",warning:"Advertencia",failure:"Fallo",danger:"Peligro",bug:"Error",example:"Ejemplo",quote:"Cita"},backlinks:{title:"Retroenlaces",noBacklinksFound:"No se han encontrado retroenlaces"},themeToggle:{lightMode:"Modo claro",darkMode:"Modo oscuro"},readerMode:{title:"Modo lector"},explorer:{title:"Explorador"},footer:{createdWith:"Creado con"},graph:{title:"Vista Gr\xE1fica"},recentNotes:{title:"Notas Recientes",seeRemainingMore:__name(({remaining})=>`Vea ${remaining} m\xE1s \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transcluido de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Enlace al original"},search:{title:"Buscar",searchBarPlaceholder:"Busca algo"},tableOfContents:{title:"Tabla de Contenidos"},contentMeta:{readingTime:__name(({minutes})=>`Se lee en ${minutes} min`,"readingTime")}},pages:{rss:{recentNotes:"Notas recientes",lastFewNotes:__name(({count})=>`\xDAltimas ${count} notas`,"lastFewNotes")},error:{title:"No se ha encontrado.",notFound:"Esta p\xE1gina es privada o no existe.",home:"Regresa a la p\xE1gina principal"},folderContent:{folder:"Carpeta",itemsUnderFolder:__name(({count})=>count===1?"1 art\xEDculo en esta carpeta.":`${count} art\xEDculos en esta carpeta.`,"itemsUnderFolder")},tagContent:{tag:"Etiqueta",tagIndex:"\xCDndice de Etiquetas",itemsUnderTag:__name(({count})=>count===1?"1 art\xEDculo con esta etiqueta.":`${count} art\xEDculos con esta etiqueta.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Mostrando las primeras ${count} etiquetas.`,"showingFirst"),totalTags:__name(({count})=>`Se han encontrado ${count} etiquetas en total.`,"totalTags")}}};var ar_SA_default={propertyDefaults:{title:"\u063A\u064A\u0631 \u0645\u0639\u0646\u0648\u0646",description:"\u0644\u0645 \u064A\u062A\u0645 \u062A\u0642\u062F\u064A\u0645 \u0623\u064A \u0648\u0635\u0641"},direction:"rtl",components:{callout:{note:"\u0645\u0644\u0627\u062D\u0638\u0629",abstract:"\u0645\u0644\u062E\u0635",info:"\u0645\u0639\u0644\u0648\u0645\u0627\u062A",todo:"\u0644\u0644\u0642\u064A\u0627\u0645",tip:"\u0646\u0635\u064A\u062D\u0629",success:"\u0646\u062C\u0627\u062D",question:"\u0633\u0624\u0627\u0644",warning:"\u062A\u062D\u0630\u064A\u0631",failure:"\u0641\u0634\u0644",danger:"\u062E\u0637\u0631",bug:"\u062E\u0644\u0644",example:"\u0645\u062B\u0627\u0644",quote:"\u0627\u0642\u062A\u0628\u0627\u0633"},backlinks:{title:"\u0648\u0635\u0644\u0627\u062A \u0627\u0644\u0639\u0648\u062F\u0629",noBacklinksFound:"\u0644\u0627 \u064A\u0648\u062C\u062F \u0648\u0635\u0644\u0627\u062A \u0639\u0648\u062F\u0629"},themeToggle:{lightMode:"\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0646\u0647\u0627\u0631\u064A",darkMode:"\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A"},explorer:{title:"\u0627\u0644\u0645\u0633\u062A\u0639\u0631\u0636"},readerMode:{title:"\u0648\u0636\u0639 \u0627\u0644\u0642\u0627\u0631\u0626"},footer:{createdWith:"\u0623\u064F\u0646\u0634\u0626 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645"},graph:{title:"\u0627\u0644\u062A\u0645\u062B\u064A\u0644 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A"},recentNotes:{title:"\u0622\u062E\u0631 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A",seeRemainingMore:__name(({remaining})=>`\u062A\u0635\u0641\u062D ${remaining} \u0623\u0643\u062B\u0631 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0645\u0642\u062A\u0628\u0633 \u0645\u0646 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0648\u0635\u0644\u0629 \u0644\u0644\u0645\u0644\u0627\u062D\u0638\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u0629"},search:{title:"\u0628\u062D\u062B",searchBarPlaceholder:"\u0627\u0628\u062D\u062B \u0639\u0646 \u0634\u064A\u0621 \u0645\u0627"},tableOfContents:{title:"\u0641\u0647\u0631\u0633 \u0627\u0644\u0645\u062D\u062A\u0648\u064A\u0627\u062A"},contentMeta:{readingTime:__name(({minutes})=>minutes==1?"\u062F\u0642\u064A\u0642\u0629 \u0623\u0648 \u0623\u0642\u0644 \u0644\u0644\u0642\u0631\u0627\u0621\u0629":minutes==2?"\u062F\u0642\u064A\u0642\u062A\u0627\u0646 \u0644\u0644\u0642\u0631\u0627\u0621\u0629":`${minutes} \u062F\u0642\u0627\u0626\u0642 \u0644\u0644\u0642\u0631\u0627\u0621\u0629`,"readingTime")}},pages:{rss:{recentNotes:"\u0622\u062E\u0631 \u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A",lastFewNotes:__name(({count})=>`\u0622\u062E\u0631 ${count} \u0645\u0644\u0627\u062D\u0638\u0629`,"lastFewNotes")},error:{title:"\u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F",notFound:"\u0625\u0645\u0627 \u0623\u0646 \u0647\u0630\u0647 \u0627\u0644\u0635\u0641\u062D\u0629 \u062E\u0627\u0635\u0629 \u0623\u0648 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629.",home:"\u0627\u0644\u0639\u0648\u062F\u0647 \u0644\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629"},folderContent:{folder:"\u0645\u062C\u0644\u062F",itemsUnderFolder:__name(({count})=>count===1?"\u064A\u0648\u062C\u062F \u0639\u0646\u0635\u0631 \u0648\u0627\u062D\u062F \u0641\u0642\u0637 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0644\u062F":`\u064A\u0648\u062C\u062F ${count} \u0639\u0646\u0627\u0635\u0631 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0645\u062C\u0644\u062F.`,"itemsUnderFolder")},tagContent:{tag:"\u0627\u0644\u0648\u0633\u0645",tagIndex:"\u0645\u0624\u0634\u0631 \u0627\u0644\u0648\u0633\u0645",itemsUnderTag:__name(({count})=>count===1?"\u064A\u0648\u062C\u062F \u0639\u0646\u0635\u0631 \u0648\u0627\u062D\u062F \u0641\u0642\u0637 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0648\u0633\u0645":`\u064A\u0648\u062C\u062F ${count} \u0639\u0646\u0627\u0635\u0631 \u062A\u062D\u062A \u0647\u0630\u0627 \u0627\u0644\u0648\u0633\u0645.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0625\u0638\u0647\u0627\u0631 \u0623\u0648\u0644 ${count} \u0623\u0648\u0633\u0645\u0629.`,"showingFirst"),totalTags:__name(({count})=>`\u064A\u0648\u062C\u062F ${count} \u0623\u0648\u0633\u0645\u0629.`,"totalTags")}}};var uk_UA_default={propertyDefaults:{title:"\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0438",description:"\u041E\u043F\u0438\u0441 \u043D\u0435 \u043D\u0430\u0434\u0430\u043D\u043E"},components:{callout:{note:"\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0430",abstract:"\u0410\u0431\u0441\u0442\u0440\u0430\u043A\u0442",info:"\u0406\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0456\u044F",todo:"\u0417\u0430\u0432\u0434\u0430\u043D\u043D\u044F",tip:"\u041F\u043E\u0440\u0430\u0434\u0430",success:"\u0423\u0441\u043F\u0456\u0445",question:"\u041F\u0438\u0442\u0430\u043D\u043D\u044F",warning:"\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u0436\u0435\u043D\u043D\u044F",failure:"\u041D\u0435\u0432\u0434\u0430\u0447\u0430",danger:"\u041D\u0435\u0431\u0435\u0437\u043F\u0435\u043A\u0430",bug:"\u0411\u0430\u0433",example:"\u041F\u0440\u0438\u043A\u043B\u0430\u0434",quote:"\u0426\u0438\u0442\u0430\u0442\u0430"},backlinks:{title:"\u0417\u0432\u043E\u0440\u043E\u0442\u043D\u0456 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",noBacklinksFound:"\u0417\u0432\u043E\u0440\u043E\u0442\u043D\u0438\u0445 \u043F\u043E\u0441\u0438\u043B\u0430\u043D\u044C \u043D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E"},themeToggle:{lightMode:"\u0421\u0432\u0456\u0442\u043B\u0438\u0439 \u0440\u0435\u0436\u0438\u043C",darkMode:"\u0422\u0435\u043C\u043D\u0438\u0439 \u0440\u0435\u0436\u0438\u043C"},readerMode:{title:"\u0420\u0435\u0436\u0438\u043C \u0447\u0438\u0442\u0430\u043D\u043D\u044F"},explorer:{title:"\u041F\u0440\u043E\u0432\u0456\u0434\u043D\u0438\u043A"},footer:{createdWith:"\u0421\u0442\u0432\u043E\u0440\u0435\u043D\u043E \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E"},graph:{title:"\u0412\u0438\u0433\u043B\u044F\u0434 \u0433\u0440\u0430\u0444\u0430"},recentNotes:{title:"\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438",seeRemainingMore:__name(({remaining})=>`\u041F\u0435\u0440\u0435\u0433\u043B\u044F\u043D\u0443\u0442\u0438 \u0449\u0435 ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0412\u0438\u0434\u043E\u0431\u0443\u0442\u043E \u0437 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u043D\u0430 \u043E\u0440\u0438\u0433\u0456\u043D\u0430\u043B"},search:{title:"\u041F\u043E\u0448\u0443\u043A",searchBarPlaceholder:"\u0428\u0443\u043A\u0430\u0442\u0438 \u0449\u043E\u0441\u044C"},tableOfContents:{title:"\u0417\u043C\u0456\u0441\u0442"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} \u0445\u0432 \u0447\u0438\u0442\u0430\u043D\u043D\u044F`,"readingTime")}},pages:{rss:{recentNotes:"\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438",lastFewNotes:__name(({count})=>`\u041E\u0441\u0442\u0430\u043D\u043D\u0456 \u043D\u043E\u0442\u0430\u0442\u043A\u0438: ${count}`,"lastFewNotes")},error:{title:"\u041D\u0435 \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E",notFound:"\u0426\u044F \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0430 \u0430\u0431\u043E \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u0430, \u0430\u0431\u043E \u043D\u0435 \u0456\u0441\u043D\u0443\u0454.",home:"\u041F\u043E\u0432\u0435\u0440\u043D\u0443\u0442\u0438\u0441\u044F \u043D\u0430 \u0433\u043E\u043B\u043E\u0432\u043D\u0443 \u0441\u0442\u043E\u0440\u0456\u043D\u043A\u0443"},folderContent:{folder:"\u0422\u0435\u043A\u0430",itemsUnderFolder:__name(({count})=>count===1?"\u0423 \u0446\u0456\u0439 \u0442\u0435\u0446\u0456 1 \u0435\u043B\u0435\u043C\u0435\u043D\u0442.":`\u0415\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 \u0443 \u0446\u0456\u0439 \u0442\u0435\u0446\u0456: ${count}.`,"itemsUnderFolder")},tagContent:{tag:"\u041C\u0456\u0442\u043A\u0430",tagIndex:"\u0406\u043D\u0434\u0435\u043A\u0441 \u043C\u0456\u0442\u043A\u0438",itemsUnderTag:__name(({count})=>count===1?"1 \u0435\u043B\u0435\u043C\u0435\u043D\u0442 \u0437 \u0446\u0456\u0454\u044E \u043C\u0456\u0442\u043A\u043E\u044E.":`\u0415\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432 \u0437 \u0446\u0456\u0454\u044E \u043C\u0456\u0442\u043A\u043E\u044E: ${count}.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u041F\u043E\u043A\u0430\u0437 \u043F\u0435\u0440\u0448\u0438\u0445 ${count} \u043C\u0456\u0442\u043E\u043A.`,"showingFirst"),totalTags:__name(({count})=>`\u0412\u0441\u044C\u043E\u0433\u043E \u0437\u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043C\u0456\u0442\u043E\u043A: ${count}.`,"totalTags")}}};var ru_RU_default={propertyDefaults:{title:"\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F",description:"\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442"},components:{callout:{note:"\u0417\u0430\u043C\u0435\u0442\u043A\u0430",abstract:"\u0420\u0435\u0437\u044E\u043C\u0435",info:"\u0418\u043D\u0444\u043E",todo:"\u0421\u0434\u0435\u043B\u0430\u0442\u044C",tip:"\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430",success:"\u0423\u0441\u043F\u0435\u0445",question:"\u0412\u043E\u043F\u0440\u043E\u0441",warning:"\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435",failure:"\u041D\u0435\u0443\u0434\u0430\u0447\u0430",danger:"\u041E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C",bug:"\u0411\u0430\u0433",example:"\u041F\u0440\u0438\u043C\u0435\u0440",quote:"\u0426\u0438\u0442\u0430\u0442\u0430"},backlinks:{title:"\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438",noBacklinksFound:"\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442"},themeToggle:{lightMode:"\u0421\u0432\u0435\u0442\u043B\u044B\u0439 \u0440\u0435\u0436\u0438\u043C",darkMode:"\u0422\u0451\u043C\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C"},readerMode:{title:"\u0420\u0435\u0436\u0438\u043C \u0447\u0442\u0435\u043D\u0438\u044F"},explorer:{title:"\u041F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A"},footer:{createdWith:"\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E"},graph:{title:"\u0412\u0438\u0434 \u0433\u0440\u0430\u0444\u0430"},recentNotes:{title:"\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438",seeRemainingMore:__name(({remaining})=>`\u041F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043E\u0441\u0442\u0430\u0432\u0448${getForm(remaining,"\u0443\u044E\u0441\u044F","\u0438\u0435\u0441\u044F","\u0438\u0435\u0441\u044F")} ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u0438\u0437 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B"},search:{title:"\u041F\u043E\u0438\u0441\u043A",searchBarPlaceholder:"\u041D\u0430\u0439\u0442\u0438 \u0447\u0442\u043E-\u043D\u0438\u0431\u0443\u0434\u044C"},tableOfContents:{title:"\u041E\u0433\u043B\u0430\u0432\u043B\u0435\u043D\u0438\u0435"},contentMeta:{readingTime:__name(({minutes})=>`\u0432\u0440\u0435\u043C\u044F \u0447\u0442\u0435\u043D\u0438\u044F ~${minutes} \u043C\u0438\u043D.`,"readingTime")}},pages:{rss:{recentNotes:"\u041D\u0435\u0434\u0430\u0432\u043D\u0438\u0435 \u0437\u0430\u043C\u0435\u0442\u043A\u0438",lastFewNotes:__name(({count})=>`\u041F\u043E\u0441\u043B\u0435\u0434\u043D${getForm(count,"\u044F\u044F","\u0438\u0435","\u0438\u0435")} ${count} \u0437\u0430\u043C\u0435\u0442${getForm(count,"\u043A\u0430","\u043A\u0438","\u043E\u043A")}`,"lastFewNotes")},error:{title:"\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430",notFound:"\u042D\u0442\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043F\u0440\u0438\u0432\u0430\u0442\u043D\u0430\u044F \u0438\u043B\u0438 \u043D\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442",home:"\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443"},folderContent:{folder:"\u041F\u0430\u043F\u043A\u0430",itemsUnderFolder:__name(({count})=>`\u0432 \u044D\u0442\u043E\u0439 \u043F\u0430\u043F\u043A\u0435 ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442${getForm(count,"","\u0430","\u043E\u0432")}`,"itemsUnderFolder")},tagContent:{tag:"\u0422\u0435\u0433",tagIndex:"\u0418\u043D\u0434\u0435\u043A\u0441 \u0442\u0435\u0433\u043E\u0432",itemsUnderTag:__name(({count})=>`\u0441 \u044D\u0442\u0438\u043C \u0442\u0435\u0433\u043E\u043C ${count} \u044D\u043B\u0435\u043C\u0435\u043D\u0442${getForm(count,"","\u0430","\u043E\u0432")}`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430${getForm(count,"\u0435\u0442\u0441\u044F","\u044E\u0442\u0441\u044F","\u044E\u0442\u0441\u044F")} ${count} \u0442\u0435\u0433${getForm(count,"","\u0430","\u043E\u0432")}`,"showingFirst"),totalTags:__name(({count})=>`\u0412\u0441\u0435\u0433\u043E ${count} \u0442\u0435\u0433${getForm(count,"","\u0430","\u043E\u0432")}`,"totalTags")}}};function getForm(number,form1,form2,form5){let remainder100=number%100,remainder10=remainder100%10;return remainder100>=10&&remainder100<=20?form5:remainder10>1&&remainder10<5?form2:remainder10==1?form1:form5}__name(getForm,"getForm");var ko_KR_default={propertyDefaults:{title:"\uC81C\uBAA9 \uC5C6\uC74C",description:"\uC124\uBA85 \uC5C6\uC74C"},components:{callout:{note:"\uB178\uD2B8",abstract:"\uAC1C\uC694",info:"\uC815\uBCF4",todo:"\uD560\uC77C",tip:"\uD301",success:"\uC131\uACF5",question:"\uC9C8\uBB38",warning:"\uC8FC\uC758",failure:"\uC2E4\uD328",danger:"\uC704\uD5D8",bug:"\uBC84\uADF8",example:"\uC608\uC2DC",quote:"\uC778\uC6A9"},backlinks:{title:"\uBC31\uB9C1\uD06C",noBacklinksFound:"\uBC31\uB9C1\uD06C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."},themeToggle:{lightMode:"\uB77C\uC774\uD2B8 \uBAA8\uB4DC",darkMode:"\uB2E4\uD06C \uBAA8\uB4DC"},readerMode:{title:"\uB9AC\uB354 \uBAA8\uB4DC"},explorer:{title:"\uD0D0\uC0C9\uAE30"},footer:{createdWith:"Created with"},graph:{title:"\uADF8\uB798\uD504 \uBDF0"},recentNotes:{title:"\uCD5C\uADFC \uAC8C\uC2DC\uAE00",seeRemainingMore:__name(({remaining})=>`${remaining}\uAC74 \uB354\uBCF4\uAE30 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug}\uC758 \uD3EC\uD568`,"transcludeOf"),linkToOriginal:"\uC6D0\uBCF8 \uB9C1\uD06C"},search:{title:"\uAC80\uC0C9",searchBarPlaceholder:"\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD558\uC138\uC694"},tableOfContents:{title:"\uBAA9\uCC28"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min read`,"readingTime")}},pages:{rss:{recentNotes:"\uCD5C\uADFC \uAC8C\uC2DC\uAE00",lastFewNotes:__name(({count})=>`\uCD5C\uADFC ${count} \uAC74`,"lastFewNotes")},error:{title:"Not Found",notFound:"\uD398\uC774\uC9C0\uAC00 \uC874\uC7AC\uD558\uC9C0 \uC54A\uAC70\uB098 \uBE44\uACF5\uAC1C \uC124\uC815\uC774 \uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.",home:"\uD648\uD398\uC774\uC9C0\uB85C \uB3CC\uC544\uAC00\uAE30"},folderContent:{folder:"\uD3F4\uB354",itemsUnderFolder:__name(({count})=>`${count}\uAC74\uC758 \uD56D\uBAA9`,"itemsUnderFolder")},tagContent:{tag:"\uD0DC\uADF8",tagIndex:"\uD0DC\uADF8 \uBAA9\uB85D",itemsUnderTag:__name(({count})=>`${count}\uAC74\uC758 \uD56D\uBAA9`,"itemsUnderTag"),showingFirst:__name(({count})=>`\uCC98\uC74C ${count}\uAC1C\uC758 \uD0DC\uADF8`,"showingFirst"),totalTags:__name(({count})=>`\uCD1D ${count}\uAC1C\uC758 \uD0DC\uADF8\uB97C \uCC3E\uC558\uC2B5\uB2C8\uB2E4.`,"totalTags")}}};var zh_CN_default={propertyDefaults:{title:"\u65E0\u9898",description:"\u65E0\u63CF\u8FF0"},components:{callout:{note:"\u7B14\u8BB0",abstract:"\u6458\u8981",info:"\u63D0\u793A",todo:"\u5F85\u529E",tip:"\u63D0\u793A",success:"\u6210\u529F",question:"\u95EE\u9898",warning:"\u8B66\u544A",failure:"\u5931\u8D25",danger:"\u5371\u9669",bug:"\u9519\u8BEF",example:"\u793A\u4F8B",quote:"\u5F15\u7528"},backlinks:{title:"\u53CD\u5411\u94FE\u63A5",noBacklinksFound:"\u65E0\u6CD5\u627E\u5230\u53CD\u5411\u94FE\u63A5"},themeToggle:{lightMode:"\u4EAE\u8272\u6A21\u5F0F",darkMode:"\u6697\u8272\u6A21\u5F0F"},readerMode:{title:"\u9605\u8BFB\u6A21\u5F0F"},explorer:{title:"\u63A2\u7D22"},footer:{createdWith:"Created with"},graph:{title:"\u5173\u7CFB\u56FE\u8C31"},recentNotes:{title:"\u6700\u8FD1\u7684\u7B14\u8BB0",seeRemainingMore:__name(({remaining})=>`\u67E5\u770B\u66F4\u591A${remaining}\u7BC7\u7B14\u8BB0 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u5305\u542B${targetSlug}`,"transcludeOf"),linkToOriginal:"\u6307\u5411\u539F\u59CB\u7B14\u8BB0\u7684\u94FE\u63A5"},search:{title:"\u641C\u7D22",searchBarPlaceholder:"\u641C\u7D22\u4E9B\u4EC0\u4E48"},tableOfContents:{title:"\u76EE\u5F55"},contentMeta:{readingTime:__name(({minutes})=>`${minutes}\u5206\u949F\u9605\u8BFB`,"readingTime")}},pages:{rss:{recentNotes:"\u6700\u8FD1\u7684\u7B14\u8BB0",lastFewNotes:__name(({count})=>`\u6700\u8FD1\u7684${count}\u6761\u7B14\u8BB0`,"lastFewNotes")},error:{title:"\u65E0\u6CD5\u627E\u5230",notFound:"\u79C1\u6709\u7B14\u8BB0\u6216\u7B14\u8BB0\u4E0D\u5B58\u5728\u3002",home:"\u8FD4\u56DE\u9996\u9875"},folderContent:{folder:"\u6587\u4EF6\u5939",itemsUnderFolder:__name(({count})=>`\u6B64\u6587\u4EF6\u5939\u4E0B\u6709${count}\u6761\u7B14\u8BB0\u3002`,"itemsUnderFolder")},tagContent:{tag:"\u6807\u7B7E",tagIndex:"\u6807\u7B7E\u7D22\u5F15",itemsUnderTag:__name(({count})=>`\u6B64\u6807\u7B7E\u4E0B\u6709${count}\u6761\u7B14\u8BB0\u3002`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u663E\u793A\u524D${count}\u4E2A\u6807\u7B7E\u3002`,"showingFirst"),totalTags:__name(({count})=>`\u603B\u5171\u6709${count}\u4E2A\u6807\u7B7E\u3002`,"totalTags")}}};var zh_TW_default={propertyDefaults:{title:"\u7121\u984C",description:"\u7121\u63CF\u8FF0"},components:{callout:{note:"\u7B46\u8A18",abstract:"\u6458\u8981",info:"\u63D0\u793A",todo:"\u5F85\u8FA6",tip:"\u63D0\u793A",success:"\u6210\u529F",question:"\u554F\u984C",warning:"\u8B66\u544A",failure:"\u5931\u6557",danger:"\u5371\u96AA",bug:"\u932F\u8AA4",example:"\u7BC4\u4F8B",quote:"\u5F15\u7528"},backlinks:{title:"\u53CD\u5411\u9023\u7D50",noBacklinksFound:"\u7121\u6CD5\u627E\u5230\u53CD\u5411\u9023\u7D50"},themeToggle:{lightMode:"\u4EAE\u8272\u6A21\u5F0F",darkMode:"\u6697\u8272\u6A21\u5F0F"},readerMode:{title:"\u95B1\u8B80\u6A21\u5F0F"},explorer:{title:"\u63A2\u7D22"},footer:{createdWith:"Created with"},graph:{title:"\u95DC\u4FC2\u5716\u8B5C"},recentNotes:{title:"\u6700\u8FD1\u7684\u7B46\u8A18",seeRemainingMore:__name(({remaining})=>`\u67E5\u770B\u66F4\u591A ${remaining} \u7BC7\u7B46\u8A18 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u5305\u542B ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u6307\u5411\u539F\u59CB\u7B46\u8A18\u7684\u9023\u7D50"},search:{title:"\u641C\u5C0B",searchBarPlaceholder:"\u641C\u5C0B\u4E9B\u4EC0\u9EBC"},tableOfContents:{title:"\u76EE\u9304"},contentMeta:{readingTime:__name(({minutes})=>`\u95B1\u8B80\u6642\u9593\u7D04 ${minutes} \u5206\u9418`,"readingTime")}},pages:{rss:{recentNotes:"\u6700\u8FD1\u7684\u7B46\u8A18",lastFewNotes:__name(({count})=>`\u6700\u8FD1\u7684 ${count} \u689D\u7B46\u8A18`,"lastFewNotes")},error:{title:"\u7121\u6CD5\u627E\u5230",notFound:"\u79C1\u4EBA\u7B46\u8A18\u6216\u7B46\u8A18\u4E0D\u5B58\u5728\u3002",home:"\u8FD4\u56DE\u9996\u9801"},folderContent:{folder:"\u8CC7\u6599\u593E",itemsUnderFolder:__name(({count})=>`\u6B64\u8CC7\u6599\u593E\u4E0B\u6709 ${count} \u689D\u7B46\u8A18\u3002`,"itemsUnderFolder")},tagContent:{tag:"\u6A19\u7C64",tagIndex:"\u6A19\u7C64\u7D22\u5F15",itemsUnderTag:__name(({count})=>`\u6B64\u6A19\u7C64\u4E0B\u6709 ${count} \u689D\u7B46\u8A18\u3002`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u986F\u793A\u524D ${count} \u500B\u6A19\u7C64\u3002`,"showingFirst"),totalTags:__name(({count})=>`\u7E3D\u5171\u6709 ${count} \u500B\u6A19\u7C64\u3002`,"totalTags")}}};var vi_VN_default={propertyDefaults:{title:"Kh\xF4ng c\xF3 ti\xEAu \u0111\u1EC1",description:"Kh\xF4ng c\xF3 m\xF4 t\u1EA3 \u0111\u01B0\u1EE3c cung c\u1EA5p"},components:{callout:{note:"Ghi Ch\xFA",abstract:"T\xF3m T\u1EAFt",info:"Th\xF4ng tin",todo:"C\u1EA7n L\xE0m",tip:"G\u1EE3i \xDD",success:"Th\xE0nh C\xF4ng",question:"Nghi V\u1EA5n",warning:"C\u1EA3nh B\xE1o",failure:"Th\u1EA5t B\u1EA1i",danger:"Nguy Hi\u1EC3m",bug:"L\u1ED7i",example:"V\xED D\u1EE5",quote:"Tr\xEDch D\u1EABn"},backlinks:{title:"Li\xEAn K\u1EBFt Ng\u01B0\u1EE3c",noBacklinksFound:"Kh\xF4ng c\xF3 li\xEAn k\u1EBFt ng\u01B0\u1EE3c \u0111\u01B0\u1EE3c t\xECm th\u1EA5y"},themeToggle:{lightMode:"S\xE1ng",darkMode:"T\u1ED1i"},readerMode:{title:"Ch\u1EBF \u0111\u1ED9 \u0111\u1ECDc"},explorer:{title:"Trong b\xE0i n\xE0y"},footer:{createdWith:"\u0110\u01B0\u1EE3c t\u1EA1o b\u1EDFi"},graph:{title:"Bi\u1EC3u \u0110\u1ED3"},recentNotes:{title:"B\xE0i vi\u1EBFt g\u1EA7n \u0111\xE2y",seeRemainingMore:__name(({remaining})=>`Xem ${remaining} th\xEAm \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Bao g\u1ED3m ${targetSlug}`,"transcludeOf"),linkToOriginal:"Li\xEAn K\u1EBFt G\u1ED1c"},search:{title:"T\xECm Ki\u1EBFm",searchBarPlaceholder:"T\xECm ki\u1EBFm th\xF4ng tin"},tableOfContents:{title:"B\u1EA3ng N\u1ED9i Dung"},contentMeta:{readingTime:__name(({minutes})=>`\u0111\u1ECDc ${minutes} ph\xFAt`,"readingTime")}},pages:{rss:{recentNotes:"Nh\u1EEFng b\xE0i g\u1EA7n \u0111\xE2y",lastFewNotes:__name(({count})=>`${count} B\xE0i g\u1EA7n \u0111\xE2y`,"lastFewNotes")},error:{title:"Kh\xF4ng T\xECm Th\u1EA5y",notFound:"Trang n\xE0y \u0111\u01B0\u1EE3c b\u1EA3o m\u1EADt ho\u1EB7c kh\xF4ng t\u1ED3n t\u1EA1i.",home:"Tr\u1EDF v\u1EC1 trang ch\u1EE7"},folderContent:{folder:"Th\u01B0 M\u1EE5c",itemsUnderFolder:__name(({count})=>count===1?"1 m\u1EE5c trong th\u01B0 m\u1EE5c n\xE0y.":`${count} m\u1EE5c trong th\u01B0 m\u1EE5c n\xE0y.`,"itemsUnderFolder")},tagContent:{tag:"Th\u1EBB",tagIndex:"Th\u1EBB M\u1EE5c L\u1EE5c",itemsUnderTag:__name(({count})=>count===1?"1 m\u1EE5c g\u1EAFn th\u1EBB n\xE0y.":`${count} m\u1EE5c g\u1EAFn th\u1EBB n\xE0y.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Hi\u1EC3n th\u1ECB tr\u01B0\u1EDBc ${count} th\u1EBB.`,"showingFirst"),totalTags:__name(({count})=>`T\xECm th\u1EA5y ${count} th\u1EBB t\u1ED5ng c\u1ED9ng.`,"totalTags")}}};var pt_BR_default={propertyDefaults:{title:"Sem t\xEDtulo",description:"Sem descri\xE7\xE3o"},components:{callout:{note:"Nota",abstract:"Abstrato",info:"Info",todo:"Pend\xEAncia",tip:"Dica",success:"Sucesso",question:"Pergunta",warning:"Aviso",failure:"Falha",danger:"Perigo",bug:"Bug",example:"Exemplo",quote:"Cita\xE7\xE3o"},backlinks:{title:"Backlinks",noBacklinksFound:"Sem backlinks encontrados"},themeToggle:{lightMode:"Tema claro",darkMode:"Tema escuro"},readerMode:{title:"Modo leitor"},explorer:{title:"Explorador"},footer:{createdWith:"Criado com"},graph:{title:"Vis\xE3o de gr\xE1fico"},recentNotes:{title:"Notas recentes",seeRemainingMore:__name(({remaining})=>`Veja mais ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transcrever de ${targetSlug}`,"transcludeOf"),linkToOriginal:"Link ao original"},search:{title:"Pesquisar",searchBarPlaceholder:"Pesquisar por algo"},tableOfContents:{title:"Sum\xE1rio"},contentMeta:{readingTime:__name(({minutes})=>`Leitura de ${minutes} min`,"readingTime")}},pages:{rss:{recentNotes:"Notas recentes",lastFewNotes:__name(({count})=>`\xDAltimas ${count} notas`,"lastFewNotes")},error:{title:"N\xE3o encontrado",notFound:"Esta p\xE1gina \xE9 privada ou n\xE3o existe.",home:"Retornar a p\xE1gina inicial"},folderContent:{folder:"Arquivo",itemsUnderFolder:__name(({count})=>count===1?"1 item neste arquivo.":`${count} items neste arquivo.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Sum\xE1rio de Tags",itemsUnderTag:__name(({count})=>count===1?"1 item com esta tag.":`${count} items com esta tag.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Mostrando as ${count} primeiras tags.`,"showingFirst"),totalTags:__name(({count})=>`Encontradas ${count} tags.`,"totalTags")}}};var hu_HU_default={propertyDefaults:{title:"N\xE9vtelen",description:"Nincs le\xEDr\xE1s"},components:{callout:{note:"Jegyzet",abstract:"Abstract",info:"Inform\xE1ci\xF3",todo:"Tennival\xF3",tip:"Tipp",success:"Siker",question:"K\xE9rd\xE9s",warning:"Figyelmeztet\xE9s",failure:"Hiba",danger:"Vesz\xE9ly",bug:"Bug",example:"P\xE9lda",quote:"Id\xE9zet"},backlinks:{title:"Visszautal\xE1sok",noBacklinksFound:"Nincs visszautal\xE1s"},themeToggle:{lightMode:"Vil\xE1gos m\xF3d",darkMode:"S\xF6t\xE9t m\xF3d"},readerMode:{title:"Olvas\xF3 m\xF3d"},explorer:{title:"F\xE1jlb\xF6ng\xE9sz\u0151"},footer:{createdWith:"K\xE9sz\xEDtve ezzel:"},graph:{title:"Grafikonn\xE9zet"},recentNotes:{title:"Legut\xF3bbi jegyzetek",seeRemainingMore:__name(({remaining})=>`${remaining} tov\xE1bbi megtekint\xE9se \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug} \xE1thivatkoz\xE1sa`,"transcludeOf"),linkToOriginal:"Hivatkoz\xE1s az eredetire"},search:{title:"Keres\xE9s",searchBarPlaceholder:"Keress valamire"},tableOfContents:{title:"Tartalomjegyz\xE9k"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} perces olvas\xE1s`,"readingTime")}},pages:{rss:{recentNotes:"Legut\xF3bbi jegyzetek",lastFewNotes:__name(({count})=>`Legut\xF3bbi ${count} jegyzet`,"lastFewNotes")},error:{title:"Nem tal\xE1lhat\xF3",notFound:"Ez a lap vagy priv\xE1t vagy nem l\xE9tezik.",home:"Vissza a kezd\u0151lapra"},folderContent:{folder:"Mappa",itemsUnderFolder:__name(({count})=>`Ebben a mapp\xE1ban ${count} elem tal\xE1lhat\xF3.`,"itemsUnderFolder")},tagContent:{tag:"C\xEDmke",tagIndex:"C\xEDmke index",itemsUnderTag:__name(({count})=>`${count} elem tal\xE1lhat\xF3 ezzel a c\xEDmk\xE9vel.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Els\u0151 ${count} c\xEDmke megjelen\xEDtve.`,"showingFirst"),totalTags:__name(({count})=>`\xD6sszesen ${count} c\xEDmke tal\xE1lhat\xF3.`,"totalTags")}}};var fa_IR_default={propertyDefaults:{title:"\u0628\u062F\u0648\u0646 \u0639\u0646\u0648\u0627\u0646",description:"\u062A\u0648\u0636\u06CC\u062D \u062E\u0627\u0635\u06CC \u0627\u0636\u0627\u0641\u0647 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A"},direction:"rtl",components:{callout:{note:"\u06CC\u0627\u062F\u062F\u0627\u0634\u062A",abstract:"\u0686\u06A9\u06CC\u062F\u0647",info:"\u0627\u0637\u0644\u0627\u0639\u0627\u062A",todo:"\u0627\u0642\u062F\u0627\u0645",tip:"\u0646\u06A9\u062A\u0647",success:"\u062A\u06CC\u06A9",question:"\u0633\u0624\u0627\u0644",warning:"\u0647\u0634\u062F\u0627\u0631",failure:"\u0634\u06A9\u0633\u062A",danger:"\u062E\u0637\u0631",bug:"\u0628\u0627\u06AF",example:"\u0645\u062B\u0627\u0644",quote:"\u0646\u0642\u0644 \u0642\u0648\u0644"},backlinks:{title:"\u0628\u06A9\u200C\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627",noBacklinksFound:"\u0628\u062F\u0648\u0646 \u0628\u06A9\u200C\u0644\u06CC\u0646\u06A9"},themeToggle:{lightMode:"\u062D\u0627\u0644\u062A \u0631\u0648\u0634\u0646",darkMode:"\u062D\u0627\u0644\u062A \u062A\u0627\u0631\u06CC\u06A9"},readerMode:{title:"\u062D\u0627\u0644\u062A \u062E\u0648\u0627\u0646\u062F\u0646"},explorer:{title:"\u0645\u0637\u0627\u0644\u0628"},footer:{createdWith:"\u0633\u0627\u062E\u062A\u0647 \u0634\u062F\u0647 \u0628\u0627"},graph:{title:"\u0646\u0645\u0627\u06CC \u06AF\u0631\u0627\u0641"},recentNotes:{title:"\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631",seeRemainingMore:__name(({remaining})=>`${remaining} \u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u062F\u06CC\u06AF\u0631 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0627\u0632 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u067E\u06CC\u0648\u0646\u062F \u0628\u0647 \u0627\u0635\u0644\u06CC"},search:{title:"\u062C\u0633\u062A\u062C\u0648",searchBarPlaceholder:"\u0645\u0637\u0644\u0628\u06CC \u0631\u0627 \u062C\u0633\u062A\u062C\u0648 \u06A9\u0646\u06CC\u062F"},tableOfContents:{title:"\u0641\u0647\u0631\u0633\u062A"},contentMeta:{readingTime:__name(({minutes})=>`\u0632\u0645\u0627\u0646 \u062A\u0642\u0631\u06CC\u0628\u06CC \u0645\u0637\u0627\u0644\u0639\u0647: ${minutes} \u062F\u0642\u06CC\u0642\u0647`,"readingTime")}},pages:{rss:{recentNotes:"\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC \u0627\u062E\u06CC\u0631",lastFewNotes:__name(({count})=>`${count} \u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u0627\u062E\u06CC\u0631`,"lastFewNotes")},error:{title:"\u06CC\u0627\u0641\u062A \u0646\u0634\u062F",notFound:"\u0627\u06CC\u0646 \u0635\u0641\u062D\u0647 \u06CC\u0627 \u062E\u0635\u0648\u0635\u06CC \u0627\u0633\u062A \u06CC\u0627 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F",home:"\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0635\u0641\u062D\u0647 \u0627\u0635\u0644\u06CC"},folderContent:{folder:"\u067E\u0648\u0634\u0647",itemsUnderFolder:__name(({count})=>count===1?".\u06CC\u06A9 \u0645\u0637\u0644\u0628 \u062F\u0631 \u0627\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0627\u0633\u062A":`${count} \u0645\u0637\u0644\u0628 \u062F\u0631 \u0627\u06CC\u0646 \u067E\u0648\u0634\u0647 \u0627\u0633\u062A.`,"itemsUnderFolder")},tagContent:{tag:"\u0628\u0631\u0686\u0633\u0628",tagIndex:"\u0641\u0647\u0631\u0633\u062A \u0628\u0631\u0686\u0633\u0628\u200C\u0647\u0627",itemsUnderTag:__name(({count})=>count===1?"\u06CC\u06A9 \u0645\u0637\u0644\u0628 \u0628\u0627 \u0627\u06CC\u0646 \u0628\u0631\u0686\u0633\u0628":`${count} \u0645\u0637\u0644\u0628 \u0628\u0627 \u0627\u06CC\u0646 \u0628\u0631\u0686\u0633\u0628.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u062F\u0631 \u062D\u0627\u0644 \u0646\u0645\u0627\u06CC\u0634 ${count} \u0628\u0631\u0686\u0633\u0628.`,"showingFirst"),totalTags:__name(({count})=>`${count} \u0628\u0631\u0686\u0633\u0628 \u06CC\u0627\u0641\u062A \u0634\u062F.`,"totalTags")}}};var pl_PL_default={propertyDefaults:{title:"Bez nazwy",description:"Brak opisu"},components:{callout:{note:"Notatka",abstract:"Streszczenie",info:"informacja",todo:"Do zrobienia",tip:"Wskaz\xF3wka",success:"Zrobione",question:"Pytanie",warning:"Ostrze\u017Cenie",failure:"Usterka",danger:"Niebiezpiecze\u0144stwo",bug:"B\u0142\u0105d w kodzie",example:"Przyk\u0142ad",quote:"Cytat"},backlinks:{title:"Odno\u015Bniki zwrotne",noBacklinksFound:"Brak po\u0142\u0105cze\u0144 zwrotnych"},themeToggle:{lightMode:"Trzyb jasny",darkMode:"Tryb ciemny"},readerMode:{title:"Tryb czytania"},explorer:{title:"Przegl\u0105daj"},footer:{createdWith:"Stworzone z u\u017Cyciem"},graph:{title:"Graf"},recentNotes:{title:"Najnowsze notatki",seeRemainingMore:__name(({remaining})=>`Zobacz ${remaining} nastepnych \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Osadzone ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0141\u0105cze do orygina\u0142u"},search:{title:"Szukaj",searchBarPlaceholder:"Wpisz fraz\u0119 wyszukiwania"},tableOfContents:{title:"Spis tre\u015Bci"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min. czytania `,"readingTime")}},pages:{rss:{recentNotes:"Najnowsze notatki",lastFewNotes:__name(({count})=>`Ostatnie ${count} notatek`,"lastFewNotes")},error:{title:"Nie znaleziono",notFound:"Ta strona jest prywatna lub nie istnieje.",home:"Powr\xF3t do strony g\u0142\xF3wnej"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"W tym folderze jest 1 element.":`Element\xF3w w folderze: ${count}.`,"itemsUnderFolder")},tagContent:{tag:"Znacznik",tagIndex:"Spis znacznik\xF3w",itemsUnderTag:__name(({count})=>count===1?"Oznaczony 1 element.":`Element\xF3w z tym znacznikiem: ${count}.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Pokazuje ${count} pierwszych znacznik\xF3w.`,"showingFirst"),totalTags:__name(({count})=>`Znalezionych wszystkich znacznik\xF3w: ${count}.`,"totalTags")}}};var cs_CZ_default={propertyDefaults:{title:"Bez n\xE1zvu",description:"Nebyl uveden \u017E\xE1dn\xFD popis"},components:{callout:{note:"Pozn\xE1mka",abstract:"Abstract",info:"Info",todo:"Todo",tip:"Tip",success:"\xDAsp\u011Bch",question:"Ot\xE1zka",warning:"Upozorn\u011Bn\xED",failure:"Chyba",danger:"Nebezpe\u010D\xED",bug:"Bug",example:"P\u0159\xEDklad",quote:"Citace"},backlinks:{title:"P\u0159\xEDchoz\xED odkazy",noBacklinksFound:"Nenalezeny \u017E\xE1dn\xE9 p\u0159\xEDchoz\xED odkazy"},themeToggle:{lightMode:"Sv\u011Btl\xFD re\u017Eim",darkMode:"Tmav\xFD re\u017Eim"},readerMode:{title:"Re\u017Eim \u010Dte\u010Dky"},explorer:{title:"Proch\xE1zet"},footer:{createdWith:"Vytvo\u0159eno pomoc\xED"},graph:{title:"Graf"},recentNotes:{title:"Nejnov\u011Bj\u0161\xED pozn\xE1mky",seeRemainingMore:__name(({remaining})=>`Zobraz ${remaining} dal\u0161\xEDch \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Zobrazen\xED ${targetSlug}`,"transcludeOf"),linkToOriginal:"Odkaz na p\u016Fvodn\xED dokument"},search:{title:"Hledat",searchBarPlaceholder:"Hledejte n\u011Bco"},tableOfContents:{title:"Obsah"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min \u010Dten\xED`,"readingTime")}},pages:{rss:{recentNotes:"Nejnov\u011Bj\u0161\xED pozn\xE1mky",lastFewNotes:__name(({count})=>`Posledn\xEDch ${count} pozn\xE1mek`,"lastFewNotes")},error:{title:"Nenalezeno",notFound:"Tato str\xE1nka je bu\u010F soukrom\xE1, nebo neexistuje.",home:"N\xE1vrat na domovskou str\xE1nku"},folderContent:{folder:"Slo\u017Eka",itemsUnderFolder:__name(({count})=>count===1?"1 polo\u017Eka v t\xE9to slo\u017Ece.":`${count} polo\u017Eek v t\xE9to slo\u017Ece.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Rejst\u0159\xEDk tag\u016F",itemsUnderTag:__name(({count})=>count===1?"1 polo\u017Eka s t\xEDmto tagem.":`${count} polo\u017Eek s t\xEDmto tagem.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Zobrazuj\xED se prvn\xED ${count} tagy.`,"showingFirst"),totalTags:__name(({count})=>`Nalezeno celkem ${count} tag\u016F.`,"totalTags")}}};var tr_TR_default={propertyDefaults:{title:"\u0130simsiz",description:"Herhangi bir a\xE7\u0131klama eklenmedi"},components:{callout:{note:"Not",abstract:"\xD6zet",info:"Bilgi",todo:"Yap\u0131lacaklar",tip:"\u0130pucu",success:"Ba\u015Far\u0131l\u0131",question:"Soru",warning:"Uyar\u0131",failure:"Ba\u015Far\u0131s\u0131z",danger:"Tehlike",bug:"Hata",example:"\xD6rnek",quote:"Al\u0131nt\u0131"},backlinks:{title:"Backlinkler",noBacklinksFound:"Backlink bulunamad\u0131"},themeToggle:{lightMode:"A\xE7\u0131k mod",darkMode:"Koyu mod"},readerMode:{title:"Okuma modu"},explorer:{title:"Gezgin"},footer:{createdWith:"\u015Eununla olu\u015Fturuldu"},graph:{title:"Grafik G\xF6r\xFCn\xFCm\xFC"},recentNotes:{title:"Son Notlar",seeRemainingMore:__name(({remaining})=>`${remaining} tane daha g\xF6r \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`${targetSlug} sayfas\u0131ndan al\u0131nt\u0131`,"transcludeOf"),linkToOriginal:"Orijinal ba\u011Flant\u0131"},search:{title:"Arama",searchBarPlaceholder:"Bir \u015Fey aray\u0131n"},tableOfContents:{title:"\u0130\xE7indekiler"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} dakika okuma s\xFCresi`,"readingTime")}},pages:{rss:{recentNotes:"Son notlar",lastFewNotes:__name(({count})=>`Son ${count} not`,"lastFewNotes")},error:{title:"Bulunamad\u0131",notFound:"Bu sayfa ya \xF6zel ya da mevcut de\u011Fil.",home:"Anasayfaya geri d\xF6n"},folderContent:{folder:"Klas\xF6r",itemsUnderFolder:__name(({count})=>count===1?"Bu klas\xF6r alt\u0131nda 1 \xF6\u011Fe.":`Bu klas\xF6r alt\u0131ndaki ${count} \xF6\u011Fe.`,"itemsUnderFolder")},tagContent:{tag:"Etiket",tagIndex:"Etiket S\u0131ras\u0131",itemsUnderTag:__name(({count})=>count===1?"Bu etikete sahip 1 \xF6\u011Fe.":`Bu etiket alt\u0131ndaki ${count} \xF6\u011Fe.`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0130lk ${count} etiket g\xF6steriliyor.`,"showingFirst"),totalTags:__name(({count})=>`Toplam ${count} adet etiket bulundu.`,"totalTags")}}};var th_TH_default={propertyDefaults:{title:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E0A\u0E37\u0E48\u0E2D",description:"\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E30\u0E1A\u0E38\u0E04\u0E33\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E22\u0E48\u0E2D"},components:{callout:{note:"\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38",abstract:"\u0E1A\u0E17\u0E04\u0E31\u0E14\u0E22\u0E48\u0E2D",info:"\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",todo:"\u0E15\u0E49\u0E2D\u0E07\u0E17\u0E33\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21",tip:"\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33",success:"\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22",question:"\u0E04\u0E33\u0E16\u0E32\u0E21",warning:"\u0E04\u0E33\u0E40\u0E15\u0E37\u0E2D\u0E19",failure:"\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14",danger:"\u0E2D\u0E31\u0E19\u0E15\u0E23\u0E32\u0E22",bug:"\u0E1A\u0E31\u0E4A\u0E01",example:"\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07",quote:"\u0E04\u0E33\u0E1E\u0E39\u0E01\u0E22\u0E01\u0E21\u0E32"},backlinks:{title:"\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E01\u0E25\u0E48\u0E32\u0E27\u0E16\u0E36\u0E07",noBacklinksFound:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E42\u0E22\u0E07\u0E21\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49"},themeToggle:{lightMode:"\u0E42\u0E2B\u0E21\u0E14\u0E2A\u0E27\u0E48\u0E32\u0E07",darkMode:"\u0E42\u0E2B\u0E21\u0E14\u0E21\u0E37\u0E14"},readerMode:{title:"\u0E42\u0E2B\u0E21\u0E14\u0E2D\u0E48\u0E32\u0E19"},explorer:{title:"\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2B\u0E19\u0E49\u0E32"},footer:{createdWith:"\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E14\u0E49\u0E27\u0E22"},graph:{title:"\u0E21\u0E38\u0E21\u0E21\u0E2D\u0E07\u0E01\u0E23\u0E32\u0E1F"},recentNotes:{title:"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14",seeRemainingMore:__name(({remaining})=>`\u0E14\u0E39\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2D\u0E35\u0E01 ${remaining} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u0E23\u0E27\u0E21\u0E02\u0E49\u0E32\u0E21\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32\u0E08\u0E32\u0E01 ${targetSlug}`,"transcludeOf"),linkToOriginal:"\u0E14\u0E39\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E49\u0E19\u0E17\u0E32\u0E07"},search:{title:"\u0E04\u0E49\u0E19\u0E2B\u0E32",searchBarPlaceholder:"\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E1A\u0E32\u0E07\u0E2D\u0E22\u0E48\u0E32\u0E07"},tableOfContents:{title:"\u0E2A\u0E32\u0E23\u0E1A\u0E31\u0E0D"},contentMeta:{readingTime:__name(({minutes})=>`\u0E2D\u0E48\u0E32\u0E19\u0E23\u0E32\u0E27 ${minutes} \u0E19\u0E32\u0E17\u0E35`,"readingTime")}},pages:{rss:{recentNotes:"\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14",lastFewNotes:__name(({count})=>`${count} \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14`,"lastFewNotes")},error:{title:"\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49",notFound:"\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49\u0E2D\u0E32\u0E08\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27\u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E2A\u0E23\u0E49\u0E32\u0E07",home:"\u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01"},folderContent:{folder:"\u0E42\u0E1F\u0E25\u0E40\u0E14\u0E2D\u0E23\u0E4C",itemsUnderFolder:__name(({count})=>`\u0E21\u0E35 ${count} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E42\u0E1F\u0E25\u0E40\u0E14\u0E2D\u0E23\u0E4C\u0E19\u0E35\u0E49`,"itemsUnderFolder")},tagContent:{tag:"\u0E41\u0E17\u0E47\u0E01",tagIndex:"\u0E41\u0E17\u0E47\u0E01\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",itemsUnderTag:__name(({count})=>`\u0E21\u0E35 ${count} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E19\u0E41\u0E17\u0E47\u0E01\u0E19\u0E35\u0E49`,"itemsUnderTag"),showingFirst:__name(({count})=>`\u0E41\u0E2A\u0E14\u0E07 ${count} \u0E41\u0E17\u0E47\u0E01\u0E41\u0E23\u0E01`,"showingFirst"),totalTags:__name(({count})=>`\u0E21\u0E35\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 ${count} \u0E41\u0E17\u0E47\u0E01`,"totalTags")}}};var lt_LT_default={propertyDefaults:{title:"Be Pavadinimo",description:"Apra\u0161ymas Nepateiktas"},components:{callout:{note:"Pastaba",abstract:"Santrauka",info:"Informacija",todo:"Darb\u0173 s\u0105ra\u0161as",tip:"Patarimas",success:"S\u0117kmingas",question:"Klausimas",warning:"\u012Esp\u0117jimas",failure:"Nes\u0117kmingas",danger:"Pavojus",bug:"Klaida",example:"Pavyzdys",quote:"Citata"},backlinks:{title:"Atgalin\u0117s Nuorodos",noBacklinksFound:"Atgalini\u0173 Nuorod\u0173 Nerasta"},themeToggle:{lightMode:"\u0160viesus Re\u017Eimas",darkMode:"Tamsus Re\u017Eimas"},readerMode:{title:"Modalit\xE0 lettore"},explorer:{title:"Nar\u0161ykl\u0117"},footer:{createdWith:"Sukurta Su"},graph:{title:"Grafiko Vaizdas"},recentNotes:{title:"Naujausi U\u017Era\u0161ai",seeRemainingMore:__name(({remaining})=>`Per\u017Ei\u016Br\u0117ti dar ${remaining} \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`\u012Eterpimas i\u0161 ${targetSlug}`,"transcludeOf"),linkToOriginal:"Nuoroda \u012F original\u0105"},search:{title:"Paie\u0161ka",searchBarPlaceholder:"Ie\u0161koti"},tableOfContents:{title:"Turinys"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min skaitymo`,"readingTime")}},pages:{rss:{recentNotes:"Naujausi u\u017Era\u0161ai",lastFewNotes:__name(({count})=>count===1?"Paskutinis 1 u\u017Era\u0161as":count<10?`Paskutiniai ${count} u\u017Era\u0161ai`:`Paskutiniai ${count} u\u017Era\u0161\u0173`,"lastFewNotes")},error:{title:"Nerasta",notFound:"Arba \u0161is puslapis yra pasiekiamas tik tam tikriems vartotojams, arba tokio puslapio n\u0117ra.",home:"Gr\u012F\u017Eti \u012F pagrindin\u012F puslap\u012F"},folderContent:{folder:"Aplankas",itemsUnderFolder:__name(({count})=>count===1?"1 elementas \u0161iame aplanke.":count<10?`${count} elementai \u0161iame aplanke.`:`${count} element\u0173 \u0161iame aplanke.`,"itemsUnderFolder")},tagContent:{tag:"\u017Dyma",tagIndex:"\u017Dym\u0173 indeksas",itemsUnderTag:__name(({count})=>count===1?"1 elementas su \u0161ia \u017Eyma.":count<10?`${count} elementai su \u0161ia \u017Eyma.`:`${count} element\u0173 su \u0161ia \u017Eyma.`,"itemsUnderTag"),showingFirst:__name(({count})=>count<10?`Rodomos pirmosios ${count} \u017Eymos.`:`Rodomos pirmosios ${count} \u017Eym\u0173.`,"showingFirst"),totalTags:__name(({count})=>count===1?"Rasta i\u0161 viso 1 \u017Eyma.":count<10?`Rasta i\u0161 viso ${count} \u017Eymos.`:`Rasta i\u0161 viso ${count} \u017Eym\u0173.`,"totalTags")}}};var fi_FI_default={propertyDefaults:{title:"Nimet\xF6n",description:"Ei kuvausta saatavilla"},components:{callout:{note:"Merkint\xE4",abstract:"Tiivistelm\xE4",info:"Info",todo:"Teht\xE4v\xE4lista",tip:"Vinkki",success:"Onnistuminen",question:"Kysymys",warning:"Varoitus",failure:"Ep\xE4onnistuminen",danger:"Vaara",bug:"Virhe",example:"Esimerkki",quote:"Lainaus"},backlinks:{title:"Takalinkit",noBacklinksFound:"Takalinkkej\xE4 ei l\xF6ytynyt"},themeToggle:{lightMode:"Vaalea tila",darkMode:"Tumma tila"},readerMode:{title:"Lukijatila"},explorer:{title:"Selain"},footer:{createdWith:"Luotu k\xE4ytt\xE4en"},graph:{title:"Verkkon\xE4kym\xE4"},recentNotes:{title:"Viimeisimm\xE4t muistiinpanot",seeRemainingMore:__name(({remaining})=>`N\xE4yt\xE4 ${remaining} lis\xE4\xE4 \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Upote kohteesta ${targetSlug}`,"transcludeOf"),linkToOriginal:"Linkki alkuper\xE4iseen"},search:{title:"Haku",searchBarPlaceholder:"Hae jotain"},tableOfContents:{title:"Sis\xE4llysluettelo"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min lukuaika`,"readingTime")}},pages:{rss:{recentNotes:"Viimeisimm\xE4t muistiinpanot",lastFewNotes:__name(({count})=>`Viimeiset ${count} muistiinpanoa`,"lastFewNotes")},error:{title:"Ei l\xF6ytynyt",notFound:"T\xE4m\xE4 sivu on joko yksityinen tai sit\xE4 ei ole olemassa.",home:"Palaa etusivulle"},folderContent:{folder:"Kansio",itemsUnderFolder:__name(({count})=>count===1?"1 kohde t\xE4ss\xE4 kansiossa.":`${count} kohdetta t\xE4ss\xE4 kansiossa.`,"itemsUnderFolder")},tagContent:{tag:"Tunniste",tagIndex:"Tunnisteluettelo",itemsUnderTag:__name(({count})=>count===1?"1 kohde t\xE4ll\xE4 tunnisteella.":`${count} kohdetta t\xE4ll\xE4 tunnisteella.`,"itemsUnderTag"),showingFirst:__name(({count})=>`N\xE4ytet\xE4\xE4n ensimm\xE4iset ${count} tunnistetta.`,"showingFirst"),totalTags:__name(({count})=>`L\xF6ytyi yhteens\xE4 ${count} tunnistetta.`,"totalTags")}}};var nb_NO_default={propertyDefaults:{title:"Uten navn",description:"Ingen beskrivelse angitt"},components:{callout:{note:"Notis",abstract:"Abstrakt",info:"Info",todo:"Husk p\xE5",tip:"Tips",success:"Suksess",question:"Sp\xF8rsm\xE5l",warning:"Advarsel",failure:"Feil",danger:"Farlig",bug:"Bug",example:"Eksempel",quote:"Sitat"},backlinks:{title:"Tilbakekoblinger",noBacklinksFound:"Ingen tilbakekoblinger funnet"},themeToggle:{lightMode:"Lys modus",darkMode:"M\xF8rk modus"},readerMode:{title:"L\xE6semodus"},explorer:{title:"Utforsker"},footer:{createdWith:"Laget med"},graph:{title:"Graf-visning"},recentNotes:{title:"Nylige notater",seeRemainingMore:__name(({remaining})=>`Se ${remaining} til \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transkludering of ${targetSlug}`,"transcludeOf"),linkToOriginal:"Lenke til original"},search:{title:"S\xF8k",searchBarPlaceholder:"S\xF8k etter noe"},tableOfContents:{title:"Oversikt"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} min lesning`,"readingTime")}},pages:{rss:{recentNotes:"Nylige notat",lastFewNotes:__name(({count})=>`Siste ${count} notat`,"lastFewNotes")},error:{title:"Ikke funnet",notFound:"Enten er denne siden privat eller s\xE5 finnes den ikke.",home:"Returner til hovedsiden"},folderContent:{folder:"Mappe",itemsUnderFolder:__name(({count})=>count===1?"1 gjenstand i denne mappen.":`${count} gjenstander i denne mappen.`,"itemsUnderFolder")},tagContent:{tag:"Tagg",tagIndex:"Tagg Indeks",itemsUnderTag:__name(({count})=>count===1?"1 gjenstand med denne taggen.":`${count} gjenstander med denne taggen.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Viser f\xF8rste ${count} tagger.`,"showingFirst"),totalTags:__name(({count})=>`Fant totalt ${count} tagger.`,"totalTags")}}};var id_ID_default={propertyDefaults:{title:"Tanpa Judul",description:"Tidak ada deskripsi"},components:{callout:{note:"Catatan",abstract:"Abstrak",info:"Info",todo:"Daftar Tugas",tip:"Tips",success:"Berhasil",question:"Pertanyaan",warning:"Peringatan",failure:"Gagal",danger:"Bahaya",bug:"Bug",example:"Contoh",quote:"Kutipan"},backlinks:{title:"Tautan Balik",noBacklinksFound:"Tidak ada tautan balik ditemukan"},themeToggle:{lightMode:"Mode Terang",darkMode:"Mode Gelap"},readerMode:{title:"Mode Pembaca"},explorer:{title:"Penjelajah"},footer:{createdWith:"Dibuat dengan"},graph:{title:"Tampilan Grafik"},recentNotes:{title:"Catatan Terbaru",seeRemainingMore:__name(({remaining})=>`Lihat ${remaining} lagi \u2192`,"seeRemainingMore")},transcludes:{transcludeOf:__name(({targetSlug})=>`Transklusi dari ${targetSlug}`,"transcludeOf"),linkToOriginal:"Tautan ke asli"},search:{title:"Cari",searchBarPlaceholder:"Cari sesuatu"},tableOfContents:{title:"Daftar Isi"},contentMeta:{readingTime:__name(({minutes})=>`${minutes} menit baca`,"readingTime")}},pages:{rss:{recentNotes:"Catatan terbaru",lastFewNotes:__name(({count})=>`${count} catatan terakhir`,"lastFewNotes")},error:{title:"Tidak Ditemukan",notFound:"Halaman ini bersifat privat atau tidak ada.",home:"Kembali ke Beranda"},folderContent:{folder:"Folder",itemsUnderFolder:__name(({count})=>count===1?"1 item di bawah folder ini.":`${count} item di bawah folder ini.`,"itemsUnderFolder")},tagContent:{tag:"Tag",tagIndex:"Indeks Tag",itemsUnderTag:__name(({count})=>count===1?"1 item dengan tag ini.":`${count} item dengan tag ini.`,"itemsUnderTag"),showingFirst:__name(({count})=>`Menampilkan ${count} tag pertama.`,"showingFirst"),totalTags:__name(({count})=>`Ditemukan total ${count} tag.`,"totalTags")}}};var TRANSLATIONS={"en-US":en_US_default,"en-GB":en_GB_default,"fr-FR":fr_FR_default,"it-IT":it_IT_default,"ja-JP":ja_JP_default,"de-DE":de_DE_default,"nl-NL":nl_NL_default,"nl-BE":nl_NL_default,"ro-RO":ro_RO_default,"ro-MD":ro_RO_default,"ca-ES":ca_ES_default,"es-ES":es_ES_default,"ar-SA":ar_SA_default,"ar-AE":ar_SA_default,"ar-QA":ar_SA_default,"ar-BH":ar_SA_default,"ar-KW":ar_SA_default,"ar-OM":ar_SA_default,"ar-YE":ar_SA_default,"ar-IR":ar_SA_default,"ar-SY":ar_SA_default,"ar-IQ":ar_SA_default,"ar-JO":ar_SA_default,"ar-PL":ar_SA_default,"ar-LB":ar_SA_default,"ar-EG":ar_SA_default,"ar-SD":ar_SA_default,"ar-LY":ar_SA_default,"ar-MA":ar_SA_default,"ar-TN":ar_SA_default,"ar-DZ":ar_SA_default,"ar-MR":ar_SA_default,"uk-UA":uk_UA_default,"ru-RU":ru_RU_default,"ko-KR":ko_KR_default,"zh-CN":zh_CN_default,"zh-TW":zh_TW_default,"vi-VN":vi_VN_default,"pt-BR":pt_BR_default,"hu-HU":hu_HU_default,"fa-IR":fa_IR_default,"pl-PL":pl_PL_default,"cs-CZ":cs_CZ_default,"tr-TR":tr_TR_default,"th-TH":th_TH_default,"lt-LT":lt_LT_default,"fi-FI":fi_FI_default,"nb-NO":nb_NO_default,"id-ID":id_ID_default},defaultTranslation="en-US",i18n=__name(locale=>TRANSLATIONS[locale??defaultTranslation],"i18n");var defaultOptions={delimiters:"---",language:"yaml"};function coalesceAliases(data,aliases){for(let alias of aliases)if(data[alias]!==void 0&&data[alias]!==null)return data[alias]}__name(coalesceAliases,"coalesceAliases");function coerceToArray(input){if(input!=null)return Array.isArray(input)||(input=input.toString().split(",").map(tag=>tag.trim())),input.filter(tag=>typeof tag=="string"||typeof tag=="number").map(tag=>tag.toString())}__name(coerceToArray,"coerceToArray");function getAliasSlugs(aliases){let res=[];for(let alias of aliases){let mockFp=getFileExtension(alias)==="md"?alias:alias+".md",slug=slugifyFilePath(mockFp);res.push(slug)}return res}__name(getAliasSlugs,"getAliasSlugs");var FrontMatter=__name(userOpts=>{let opts={...defaultOptions,...userOpts};return{name:"FrontMatter",markdownPlugins(ctx){let{cfg,allSlugs}=ctx;return[[remarkFrontmatter,["yaml","toml"]],()=>(_,file)=>{let fileData=Buffer.from(file.value),{data}=matter(fileData,{...opts,engines:{yaml:__name(s=>yaml.load(s,{schema:yaml.JSON_SCHEMA}),"yaml"),toml:__name(s=>toml.parse(s),"toml")}});data.title!=null&&data.title.toString()!==""?data.title=data.title.toString():data.title=file.stem??i18n(cfg.configuration.locale).propertyDefaults.title;let tags=coerceToArray(coalesceAliases(data,["tags","tag"]));tags&&(data.tags=[...new Set(tags.map(tag=>slugTag(tag)))]);let aliases=coerceToArray(coalesceAliases(data,["aliases","alias"]));if(aliases&&(data.aliases=aliases,file.data.aliases=getAliasSlugs(aliases),allSlugs.push(...file.data.aliases)),data.permalink!=null&&data.permalink.toString()!==""){data.permalink=data.permalink.toString();let aliases2=file.data.aliases??[];aliases2.push(data.permalink),file.data.aliases=aliases2,allSlugs.push(data.permalink)}let cssclasses=coerceToArray(coalesceAliases(data,["cssclasses","cssclass"]));cssclasses&&(data.cssclasses=cssclasses);let socialImage=coalesceAliases(data,["socialImage","image","cover"]),created=coalesceAliases(data,["created","date"]);created&&(data.created=created);let modified=coalesceAliases(data,["modified","lastmod","updated","last-modified"]);modified&&(data.modified=modified),data.modified||=created;let published=coalesceAliases(data,["published","publishDate","date"]);published&&(data.published=published),socialImage&&(data.socialImage=socialImage);let uniqueSlugs=[...new Set(allSlugs)];allSlugs.splice(0,allSlugs.length,...uniqueSlugs),file.data.frontmatter=data}]}}},"FrontMatter");import remarkGfm from"remark-gfm";import smartypants from"remark-smartypants";import rehypeSlug from"rehype-slug";import rehypeAutolinkHeadings from"rehype-autolink-headings";var defaultOptions2={enableSmartyPants:!0,linkHeadings:!0},GitHubFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions2,...userOpts};return{name:"GitHubFlavoredMarkdown",markdownPlugins(){return opts.enableSmartyPants?[remarkGfm,smartypants]:[remarkGfm]},htmlPlugins(){return opts.linkHeadings?[rehypeSlug,[rehypeAutolinkHeadings,{behavior:"append",properties:{role:"anchor",ariaHidden:!0,tabIndex:-1,"data-no-popover":!0},content:{type:"element",tagName:"svg",properties:{width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},children:[{type:"element",tagName:"path",properties:{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"},children:[]},{type:"element",tagName:"path",properties:{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"},children:[]}]}}]]:[]}}},"GitHubFlavoredMarkdown");import rehypeCitation from"rehype-citation";import{visit}from"unist-util-visit";import fs from"fs";import{Repository}from"@napi-rs/simple-git";import path2 from"path";import{styleText as styleText4}from"util";var defaultOptions3={priority:["frontmatter","git","filesystem"]},iso8601DateOnlyRegex=/^\d{4}-\d{2}-\d{2}$/;function coerceDate(fp,d){typeof d=="string"&&iso8601DateOnlyRegex.test(d)&&(d=`${d}T00:00:00`);let dt=new Date(d),invalidDate=isNaN(dt.getTime())||dt.getTime()===0;return invalidDate&&d!==void 0&&console.log(styleText4("yellow",`
Warning: found invalid date "${d}" in \`${fp}\`. Supported formats: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format`)),invalidDate?new Date:dt}__name(coerceDate,"coerceDate");var CreatedModifiedDate=__name(userOpts=>{let opts={...defaultOptions3,...userOpts};return{name:"CreatedModifiedDate",markdownPlugins(ctx){return[()=>{let repo,repositoryWorkdir;if(opts.priority.includes("git"))try{repo=Repository.discover(ctx.argv.directory),repositoryWorkdir=repo.workdir()??ctx.argv.directory}catch{console.log(styleText4("yellow",`
Warning: couldn't find git repository for ${ctx.argv.directory}`))}return async(_tree,file)=>{let created,modified,published,fp=file.data.relativePath,fullFp=file.data.filePath;for(let source of opts.priority)if(source==="filesystem"){let st=await fs.promises.stat(fullFp);created||=st.birthtimeMs,modified||=st.mtimeMs}else if(source==="frontmatter"&&file.data.frontmatter)created||=file.data.frontmatter.created,modified||=file.data.frontmatter.modified,published||=file.data.frontmatter.published;else if(source==="git"&&repo)try{let relativePath=path2.relative(repositoryWorkdir,fullFp);modified||=await repo.getFileLatestModifiedDateAsync(relativePath)}catch{console.log(styleText4("yellow",`
Warning: ${file.data.filePath} isn't yet tracked by git, dates will be inaccurate`))}file.data.dates={created:coerceDate(fp,created),modified:coerceDate(fp,modified),published:coerceDate(fp,published)}}}]}}},"CreatedModifiedDate");import remarkMath from"remark-math";import rehypeKatex from"rehype-katex";import rehypeMathjax from"rehype-mathjax/svg";import rehypeTypst from"@myriaddreamin/rehype-typst";var Latex=__name(opts=>{let engine=opts?.renderEngine??"katex",macros=opts?.customMacros??{};return{name:"Latex",markdownPlugins(){return[remarkMath]},htmlPlugins(){switch(engine){case"katex":return[[rehypeKatex,{output:"html",macros,...opts?.katexOptions??{}}]];case"typst":return[[rehypeTypst,opts?.typstOptions??{}]];case"mathjax":return[[rehypeMathjax,{macros,...opts?.mathJaxOptions??{}}]];default:return[[rehypeMathjax,{macros,...opts?.mathJaxOptions??{}}]]}},externalResources(){switch(engine){case"katex":return{css:[{content:"https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"}],js:[{src:"https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",loadTime:"afterDOMReady",contentType:"external"}]}}}}},"Latex");import{toString}from"hast-util-to-string";var escapeHTML=__name(unsafe=>unsafe.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"),"escapeHTML"),unescapeHTML=__name(html=>html.replaceAll("&amp;","&").replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&quot;",'"').replaceAll("&#039;","'"),"unescapeHTML");var defaultOptions4={descriptionLength:150,maxDescriptionLength:300,replaceExternalLinks:!0},urlRegex=new RegExp(/(https?:\/\/)?(?<domain>([\da-z\.-]+)\.([a-z\.]{2,6})(:\d+)?)(?<path>[\/\w\.-]*)(\?[\/\w\.=&;-]*)?/,"g"),Description=__name(userOpts=>{let opts={...defaultOptions4,...userOpts};return{name:"Description",htmlPlugins(){return[()=>async(tree,file)=>{let frontMatterDescription=file.data.frontmatter?.description,text=escapeHTML(toString(tree));if(opts.replaceExternalLinks&&(frontMatterDescription=frontMatterDescription?.replace(urlRegex,"$<domain>$<path>"),text=text.replace(urlRegex,"$<domain>$<path>")),frontMatterDescription){file.data.description=frontMatterDescription,file.data.text=text;return}let sentences=text.replace(/\s+/g," ").split(/\.\s/),finalDesc="",sentenceIdx=0;for(;sentenceIdx<sentences.length;){let sentence=sentences[sentenceIdx];if(!sentence)break;let currentSentence=sentence.endsWith(".")?sentence:sentence+".";if(finalDesc.length+currentSentence.length+(finalDesc?1:0)<=opts.descriptionLength||sentenceIdx===0)finalDesc+=(finalDesc?" ":"")+currentSentence,sentenceIdx++;else break}file.data.description=finalDesc.length>opts.maxDescriptionLength?finalDesc.slice(0,opts.maxDescriptionLength)+"...":finalDesc,file.data.text=text}]}}},"Description");import path3 from"path";import{visit as visit2}from"unist-util-visit";import isAbsoluteUrl from"is-absolute-url";var defaultOptions5={markdownLinkResolution:"absolute",prettyLinks:!0,openLinksInNewTab:!1,lazyLoad:!1,externalLinkIcon:!0},CrawlLinks=__name(userOpts=>{let opts={...defaultOptions5,...userOpts};return{name:"LinkProcessing",htmlPlugins(ctx){return[()=>(tree,file)=>{let curSlug=simplifySlug(file.data.slug),outgoing=new Set,transformOptions={strategy:opts.markdownLinkResolution,allSlugs:ctx.allSlugs};visit2(tree,"element",(node,_index,_parent)=>{if(node.tagName==="a"&&node.properties&&typeof node.properties.href=="string"){let dest=node.properties.href,classes=node.properties.className??[],isExternal=isAbsoluteUrl(dest);classes.push(isExternal?"external":"internal"),isExternal&&opts.externalLinkIcon&&node.children.push({type:"element",tagName:"svg",properties:{"aria-hidden":"true",class:"external-icon",style:"max-width:0.8em;max-height:0.8em",viewBox:"0 0 512 512"},children:[{type:"element",tagName:"path",properties:{d:"M320 0H288V64h32 82.7L201.4 265.4 178.7 288 224 333.3l22.6-22.6L448 109.3V192v32h64V192 32 0H480 320zM32 32H0V64 480v32H32 456h32V480 352 320H424v32 96H64V96h96 32V32H160 32z"},children:[]}]}),node.children.length===1&&node.children[0].type==="text"&&node.children[0].value!==dest&&classes.push("alias"),node.properties.className=classes,isExternal&&opts.openLinksInNewTab&&(node.properties.target="_blank");let isInternal=!(isAbsoluteUrl(dest)||dest.startsWith("#"));if(isInternal){dest=node.properties.href=transformLink(file.data.slug,dest,transformOptions);let canonicalDest=new URL(dest,"https://base.com/"+stripSlashes(curSlug,!0)).pathname,[destCanonical,_destAnchor]=splitAnchor(canonicalDest);destCanonical.endsWith("/")&&(destCanonical+="index");let full=decodeURIComponent(stripSlashes(destCanonical,!0)),simple=simplifySlug(full);outgoing.add(simple),node.properties["data-slug"]=full}opts.prettyLinks&&isInternal&&node.children.length===1&&node.children[0].type==="text"&&!node.children[0].value.startsWith("#")&&(node.children[0].value=path3.basename(node.children[0].value))}if(["img","video","audio","iframe"].includes(node.tagName)&&node.properties&&typeof node.properties.src=="string"&&(opts.lazyLoad&&(node.properties.loading="lazy"),!isAbsoluteUrl(node.properties.src))){let dest=node.properties.src;dest=node.properties.src=transformLink(file.data.slug,dest,transformOptions),node.properties.src=dest}}),file.data.links=[...outgoing]}]}}},"CrawlLinks");import{findAndReplace as mdastFindReplace}from"mdast-util-find-and-replace";import rehypeRaw from"rehype-raw";import{SKIP,visit as visit3}from"unist-util-visit";import path4 from"path";var callout_inline_default=`function n(){let t=this.parentElement;t.classList.toggle("is-collapsed");let e=t.getElementsByClassName("callout-content")[0];if(!e)return;let l=t.classList.contains("is-collapsed");e.style.gridTemplateRows=l?"0fr":"1fr"}function c(){let t=document.getElementsByClassName("callout is-collapsible");for(let e of t){let l=e.getElementsByClassName("callout-title")[0],s=e.getElementsByClassName("callout-content")[0];if(!l||!s)continue;l.addEventListener("click",n),window.addCleanup(()=>l.removeEventListener("click",n));let o=e.classList.contains("is-collapsed");s.style.gridTemplateRows=o?"0fr":"1fr"}}document.addEventListener("nav",c);
`;var checkbox_inline_default='var m=Object.create;var f=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var y=Object.getPrototypeOf,b=Object.prototype.hasOwnProperty;var R=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var j=(e,t,n,E)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of S(t))!b.call(e,i)&&i!==n&&f(e,i,{get:()=>t[i],enumerable:!(E=x(t,i))||E.enumerable});return e};var w=(e,t,n)=>(n=e!=null?m(y(e)):{},j(t||!e||!e.__esModule?f(n,"default",{value:e,enumerable:!0}):n,e));var p=R(($,g)=>{"use strict";g.exports=L;function B(e){return e instanceof Buffer?Buffer.from(e):new e.constructor(e.buffer.slice(),e.byteOffset,e.length)}function L(e){if(e=e||{},e.circles)return v(e);let t=new Map;if(t.set(Date,F=>new Date(F)),t.set(Map,(F,l)=>new Map(E(Array.from(F),l))),t.set(Set,(F,l)=>new Set(E(Array.from(F),l))),e.constructorHandlers)for(let F of e.constructorHandlers)t.set(F[0],F[1]);let n=null;return e.proto?o:i;function E(F,l){let u=Object.keys(F),D=new Array(u.length);for(let s=0;s<u.length;s++){let r=u[s],A=F[r];typeof A!="object"||A===null?D[r]=A:A.constructor!==Object&&(n=t.get(A.constructor))?D[r]=n(A,l):ArrayBuffer.isView(A)?D[r]=B(A):D[r]=l(A)}return D}function i(F){if(typeof F!="object"||F===null)return F;if(Array.isArray(F))return E(F,i);if(F.constructor!==Object&&(n=t.get(F.constructor)))return n(F,i);let l={};for(let u in F){if(Object.hasOwnProperty.call(F,u)===!1)continue;let D=F[u];typeof D!="object"||D===null?l[u]=D:D.constructor!==Object&&(n=t.get(D.constructor))?l[u]=n(D,i):ArrayBuffer.isView(D)?l[u]=B(D):l[u]=i(D)}return l}function o(F){if(typeof F!="object"||F===null)return F;if(Array.isArray(F))return E(F,o);if(F.constructor!==Object&&(n=t.get(F.constructor)))return n(F,o);let l={};for(let u in F){let D=F[u];typeof D!="object"||D===null?l[u]=D:D.constructor!==Object&&(n=t.get(D.constructor))?l[u]=n(D,o):ArrayBuffer.isView(D)?l[u]=B(D):l[u]=o(D)}return l}}function v(e){let t=[],n=[],E=new Map;if(E.set(Date,u=>new Date(u)),E.set(Map,(u,D)=>new Map(o(Array.from(u),D))),E.set(Set,(u,D)=>new Set(o(Array.from(u),D))),e.constructorHandlers)for(let u of e.constructorHandlers)E.set(u[0],u[1]);let i=null;return e.proto?l:F;function o(u,D){let s=Object.keys(u),r=new Array(s.length);for(let A=0;A<s.length;A++){let c=s[A],C=u[c];if(typeof C!="object"||C===null)r[c]=C;else if(C.constructor!==Object&&(i=E.get(C.constructor)))r[c]=i(C,D);else if(ArrayBuffer.isView(C))r[c]=B(C);else{let a=t.indexOf(C);a!==-1?r[c]=n[a]:r[c]=D(C)}}return r}function F(u){if(typeof u!="object"||u===null)return u;if(Array.isArray(u))return o(u,F);if(u.constructor!==Object&&(i=E.get(u.constructor)))return i(u,F);let D={};t.push(u),n.push(D);for(let s in u){if(Object.hasOwnProperty.call(u,s)===!1)continue;let r=u[s];if(typeof r!="object"||r===null)D[s]=r;else if(r.constructor!==Object&&(i=E.get(r.constructor)))D[s]=i(r,F);else if(ArrayBuffer.isView(r))D[s]=B(r);else{let A=t.indexOf(r);A!==-1?D[s]=n[A]:D[s]=F(r)}}return t.pop(),n.pop(),D}function l(u){if(typeof u!="object"||u===null)return u;if(Array.isArray(u))return o(u,l);if(u.constructor!==Object&&(i=E.get(u.constructor)))return i(u,l);let D={};t.push(u),n.push(D);for(let s in u){let r=u[s];if(typeof r!="object"||r===null)D[s]=r;else if(r.constructor!==Object&&(i=E.get(r.constructor)))D[s]=i(r,l);else if(ArrayBuffer.isView(r))D[s]=B(r);else{let A=t.indexOf(r);A!==-1?D[s]=n[A]:D[s]=l(r)}}return t.pop(),n.pop(),D}}});var T=Object.hasOwnProperty;var d=w(p(),1),O=(0,d.default)();function h(e){return e.document.body.dataset.slug}var k=e=>`${h(window)}-checkbox-${e}`;document.addEventListener("nav",()=>{document.querySelectorAll("input.checkbox-toggle").forEach((t,n)=>{let E=k(n),i=o=>{let F=o.target?.checked?"true":"false";localStorage.setItem(E,F)};t.addEventListener("change",i),window.addCleanup(()=>t.removeEventListener("change",i)),localStorage.getItem(E)==="true"&&(t.checked=!0)})});\n';var mermaid_inline_default='function Y(p,t){if(!p)return;function e(c){c.target===this&&(c.preventDefault(),c.stopPropagation(),t())}function s(c){c.key.startsWith("Esc")&&(c.preventDefault(),t())}p?.addEventListener("click",e),window.addCleanup(()=>p?.removeEventListener("click",e)),document.addEventListener("keydown",s),window.addCleanup(()=>document.removeEventListener("keydown",s))}function B(p){for(;p.firstChild;)p.removeChild(p.firstChild)}var x=class{constructor(t,e){this.container=t;this.content=e;this.setupEventListeners(),this.setupNavigationControls(),this.resetTransform()}isDragging=!1;startPan={x:0,y:0};currentPan={x:0,y:0};scale=1;MIN_SCALE=.5;MAX_SCALE=3;cleanups=[];setupEventListeners(){let t=this.onMouseDown.bind(this),e=this.onMouseMove.bind(this),s=this.onMouseUp.bind(this),c=this.resetTransform.bind(this);this.container.addEventListener("mousedown",t),document.addEventListener("mousemove",e),document.addEventListener("mouseup",s),window.addEventListener("resize",c);let u=this.onTouchStart.bind(this),o=this.onTouchMove.bind(this),n=this.onTouchEnd.bind(this);this.container.addEventListener("touchstart",u,{passive:!1}),document.addEventListener("touchmove",o,{passive:!1}),document.addEventListener("touchend",n),this.cleanups.push(()=>this.container.removeEventListener("mousedown",t),()=>document.removeEventListener("mousemove",e),()=>document.removeEventListener("mouseup",s),()=>window.removeEventListener("resize",c),()=>this.container.removeEventListener("touchstart",u),()=>document.removeEventListener("touchmove",o),()=>document.removeEventListener("touchend",n))}cleanup(){for(let t of this.cleanups)t()}setupNavigationControls(){let t=document.createElement("div");t.className="mermaid-controls";let e=this.createButton("+",()=>this.zoom(.25)),s=this.createButton("-",()=>this.zoom(-.25)),c=this.createButton("Reset",()=>this.resetTransform());t.appendChild(s),t.appendChild(c),t.appendChild(e),this.container.appendChild(t)}createButton(t,e){let s=document.createElement("button");return s.textContent=t,s.className="mermaid-control-button",s.addEventListener("click",e),window.addCleanup(()=>s.removeEventListener("click",e)),s}onMouseDown(t){t.button===0&&(this.isDragging=!0,this.startPan={x:t.clientX-this.currentPan.x,y:t.clientY-this.currentPan.y},this.container.style.cursor="grabbing")}onMouseMove(t){this.isDragging&&(t.preventDefault(),this.currentPan={x:t.clientX-this.startPan.x,y:t.clientY-this.startPan.y},this.updateTransform())}onMouseUp(){this.isDragging=!1,this.container.style.cursor="grab"}isPinching=!1;initialPinchDistance=0;lastPinchCenter={x:0,y:0};onTouchStart(t){if(t.touches.length===2){this.isPinching=!0,this.isDragging=!1;let e=t.touches[0],s=t.touches[1];this.initialPinchDistance=Math.hypot(s.clientX-e.clientX,s.clientY-e.clientY),this.lastPinchCenter={x:(e.clientX+s.clientX)/2,y:(e.clientY+s.clientY)/2},t.preventDefault()}else if(t.touches.length===1&&!this.isPinching){this.isDragging=!0;let e=t.touches[0];this.startPan={x:e.clientX-this.currentPan.x,y:e.clientY-this.currentPan.y}}}onTouchMove(t){if(t.touches.length===2&&this.isPinching){t.preventDefault();let e=t.touches[0],s=t.touches[1],c=Math.hypot(s.clientX-e.clientX,s.clientY-e.clientY),u={x:(e.clientX+s.clientX)/2,y:(e.clientY+s.clientY)/2},o=c/this.initialPinchDistance,n=this.scale*o,i=Math.min(Math.max(n,this.MIN_SCALE),this.MAX_SCALE),a=this.container.getBoundingClientRect(),h=this.lastPinchCenter.x-a.left,d=this.lastPinchCenter.y-a.top,f=(h-this.currentPan.x)/this.scale,l=(d-this.currentPan.y)/this.scale,E=i-this.scale;this.scale=i,this.currentPan.x=h-f*this.scale,this.currentPan.y=d-l*this.scale,this.initialPinchDistance=c,this.lastPinchCenter=u,this.updateTransform()}else if(this.isDragging&&t.touches.length===1&&!this.isPinching){t.preventDefault();let e=t.touches[0];this.currentPan={x:e.clientX-this.startPan.x,y:e.clientY-this.startPan.y},this.updateTransform()}}onTouchEnd(t){if(t.touches.length===0)this.isDragging=!1,this.isPinching=!1;else if(t.touches.length===1&&this.isPinching){this.isPinching=!1,this.isDragging=!0;let e=t.touches[0];this.startPan={x:e.clientX-this.currentPan.x,y:e.clientY-this.currentPan.y}}}zoom(t){let e=Math.min(Math.max(this.scale+t,this.MIN_SCALE),this.MAX_SCALE),s=this.content.getBoundingClientRect(),c=s.width/2,u=s.height/2,o=e-this.scale;this.currentPan.x-=c*o,this.currentPan.y-=u*o,this.scale=e,this.updateTransform()}updateTransform(){this.content.style.transform=`translate(${this.currentPan.x}px, ${this.currentPan.y}px) scale(${this.scale})`}resetTransform(){let e=this.content.querySelector("svg").getBoundingClientRect(),s=this.container.getBoundingClientRect();this.scale=1;let c=e.width*this.scale,u=e.height*this.scale;this.currentPan={x:(s.width-c)/2,y:(s.height-u)/2},this.updateTransform()}},q=["--secondary","--tertiary","--gray","--light","--lightgray","--highlight","--dark","--darkgray","--codeFont"],A;document.addEventListener("nav",async()=>{let t=document.querySelector(".center").querySelectorAll("code.mermaid");if(t.length===0)return;A||=await import("https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.esm.min.mjs");let e=A.default,s=new WeakMap;for(let o of t)s.set(o,o.innerText);async function c(){for(let i of t){i.removeAttribute("data-processed");let a=s.get(i);a&&(i.innerHTML=a)}let o=q.reduce((i,a)=>(i[a]=window.getComputedStyle(document.documentElement).getPropertyValue(a),i),{}),n=document.documentElement.getAttribute("saved-theme")==="dark";e.initialize({startOnLoad:!1,securityLevel:"loose",theme:n?"dark":"base",themeVariables:{fontFamily:o["--codeFont"],primaryColor:o["--light"],primaryTextColor:o["--darkgray"],primaryBorderColor:o["--tertiary"],lineColor:o["--darkgray"],secondaryColor:o["--secondary"],tertiaryColor:o["--tertiary"],clusterBkg:o["--light"],edgeLabelBackground:o["--highlight"]}}),await e.run({nodes:t})}await c(),document.addEventListener("themechange",c),window.addCleanup(()=>document.removeEventListener("themechange",c));function u(){for(let o of t){let n=o.parentElement;if(!n)continue;let i=!1,a=0,h=0,d=0,f=0,l=r=>{let v=r.target;r.button!==0||v.tagName==="A"||v.closest("button")||(i=!0,a=r.clientX,h=r.clientY,d=n.scrollLeft,f=n.scrollTop,n.style.cursor="grabbing",r.preventDefault())},E=r=>{if(!i)return;r.preventDefault();let v=r.clientX-a,g=r.clientY-h;n.scrollLeft=d-v,n.scrollTop=f-g},M=()=>{i&&(i=!1,n.style.cursor="grab")},P=()=>{i&&(i=!1,n.style.cursor="grab")},L=0,y=1,m=!1,w=r=>{let v=r.target;if(!(v.tagName==="A"||v.closest("button"))){if(r.touches.length===2){m=!0,i=!1;let g=r.touches[0],T=r.touches[1];L=Math.hypot(T.clientX-g.clientX,T.clientY-g.clientY),r.preventDefault()}else if(r.touches.length===1){let g=r.touches[0];i=!0,m=!1,a=g.clientX,h=g.clientY,d=n.scrollLeft,f=n.scrollTop}}},H=r=>{if(r.touches.length===2&&m){r.preventDefault();let D=r.touches[0],S=r.touches[1],X=Math.hypot(S.clientX-D.clientX,S.clientY-D.clientY),R=X/L,N=y*R,k=Math.min(Math.max(N,.5),3),C=o.querySelector("svg");C&&(C.style.transform=`scale(${k})`,C.style.transformOrigin="center center",C.style.transition="none"),L=X,y=k;return}if(!i||r.touches.length!==1)return;r.preventDefault();let v=r.touches[0],g=v.clientX-a,T=v.clientY-h;n.scrollLeft=d-g,n.scrollTop=f-T},b=()=>{i=!1,m&&(m=!1)};n.addEventListener("mousedown",l),document.addEventListener("mousemove",E),document.addEventListener("mouseup",M),n.addEventListener("mouseleave",P),n.addEventListener("touchstart",w,{passive:!1}),n.addEventListener("touchmove",H,{passive:!1}),n.addEventListener("touchend",b),n.style.cursor="grab",window.addCleanup(()=>{n.removeEventListener("mousedown",l),document.removeEventListener("mousemove",E),document.removeEventListener("mouseup",M),n.removeEventListener("mouseleave",P),n.removeEventListener("touchstart",w),n.removeEventListener("touchmove",H),n.removeEventListener("touchend",b)})}}u();for(let o=0;o<t.length;o++){let M=function(){let y=l.querySelector("#mermaid-space"),m=l.querySelector(".mermaid-content");if(!m)return;B(m);let w=n.querySelector("svg").cloneNode(!0);m.appendChild(w),l.classList.add("active"),y.style.cursor="grab",document.body.style.overflow="hidden",E=new x(y,m)},P=function(){l.classList.remove("active"),E?.cleanup(),E=null,document.body.style.overflow=""},n=t[o],i=n.parentElement,a=i.querySelector(".clipboard-button"),h=i.querySelector(".expand-button"),d=window.getComputedStyle(a),f=a.offsetWidth+parseFloat(d.marginLeft||"0")+parseFloat(d.marginRight||"0");h.style.right=`calc(${f}px + 0.3rem)`,i.prepend(h);let l=i.querySelector("#mermaid-container");if(!l)return;let E=null;h.addEventListener("click",M),Y(l,P);let L=y=>{y.target===l&&P()};l.addEventListener("click",L),window.addCleanup(()=>{E?.cleanup(),h.removeEventListener("click",M),l.removeEventListener("click",L)})}});\n';var mermaid_inline_default2=`.expand-button {
  position: absolute;
  display: flex;
  float: right;
  padding: 0.4rem;
  margin: 0.3rem;
  right: 0;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
.expand-button > svg {
  fill: var(--light);
  filter: contrast(0.3);
}
.expand-button:hover {
  cursor: pointer;
  border-color: var(--secondary);
}
.expand-button:focus {
  outline: 0;
}

pre:hover > .expand-button {
  opacity: 1;
  transition: 0.2s;
}

#mermaid-container {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: none;
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.5);
}
#mermaid-container.active {
  display: inline-block;
}
#mermaid-container > #mermaid-space {
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80vh;
  width: 80vw;
  overflow: hidden;
}
@media (max-width: 768px) {
  #mermaid-container > #mermaid-space {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    height: 90vh;
    width: 95vw;
  }
}
#mermaid-container > #mermaid-space > .mermaid-content {
  padding: 0;
  position: relative;
  transform-origin: 0 0;
  transition: transform 0.1s ease;
  overflow: visible;
  min-height: 200px;
  min-width: 200px;
  width: 100%;
  height: 100%;
}
#mermaid-container > #mermaid-space > .mermaid-content pre {
  margin: 0;
  border: none;
}
#mermaid-container > #mermaid-space > .mermaid-content svg {
  max-width: none;
  height: auto;
}
#mermaid-container > #mermaid-space > .mermaid-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 8px;
  padding: 8px;
  background: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--lightgray);
  background: var(--light);
  color: var(--dark);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-family: var(--bodyFont);
  transition: all 0.2s ease;
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:hover {
  background: var(--lightgray);
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:active {
  transform: translateY(1px);
}
#mermaid-container > #mermaid-space > .mermaid-controls .mermaid-control-button:nth-child(2) {
  width: auto;
  padding: 0 12px;
  font-size: 14px;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbIm1lcm1haWQuaW5saW5lLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7OztBQUtGO0VBQ0U7RUFDQTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHQTtFQWJGO0lBY0k7SUFDQTtJQUNBO0lBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7O0FBSUY7RUFDRTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIuZXhwYW5kLWJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxvYXQ6IHJpZ2h0O1xuICBwYWRkaW5nOiAwLjRyZW07XG4gIG1hcmdpbjogMC4zcmVtO1xuICByaWdodDogMDsgLy8gTk9URTogcmlnaHQgd2lsbCBiZSBzZXQgaW4gbWVybWFpZC5pbmxpbmUudHNcbiAgY29sb3I6IHZhcigtLWdyYXkpO1xuICBib3JkZXItY29sb3I6IHZhcigtLWRhcmspO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gIGJvcmRlcjogMXB4IHNvbGlkO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIG9wYWNpdHk6IDA7XG4gIHRyYW5zaXRpb246IDAuMnM7XG5cbiAgJiA+IHN2ZyB7XG4gICAgZmlsbDogdmFyKC0tbGlnaHQpO1xuICAgIGZpbHRlcjogY29udHJhc3QoMC4zKTtcbiAgfVxuXG4gICY6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG4gIH1cblxuICAmOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG59XG5cbnByZSB7XG4gICY6aG92ZXIgPiAuZXhwYW5kLWJ1dHRvbiB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2l0aW9uOiAwLjJzO1xuICB9XG59XG5cbiNtZXJtYWlkLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgY29udGFpbjogbGF5b3V0O1xuICB6LWluZGV4OiA5OTk7XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBoZWlnaHQ6IDEwMHZoO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBkaXNwbGF5OiBub25lO1xuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjUpO1xuXG4gICYuYWN0aXZlIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIH1cblxuICAmID4gI21lcm1haWQtc3BhY2Uge1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgdG9wOiA1MCU7XG4gICAgbGVmdDogNTAlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICAgIGhlaWdodDogODB2aDtcbiAgICB3aWR0aDogODB2dztcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIFxuICAgIC8vIEVuYWJsZSBzY3JvbGxpbmcgb24gbW9iaWxlIGRldmljZXNcbiAgICBAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgICAgIG92ZXJmbG93OiBhdXRvO1xuICAgICAgLXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6IHRvdWNoO1xuICAgICAgaGVpZ2h0OiA5MHZoO1xuICAgICAgd2lkdGg6IDk1dnc7XG4gICAgfVxuXG4gICAgJiA+IC5tZXJtYWlkLWNvbnRlbnQge1xuICAgICAgcGFkZGluZzogMDtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIHRyYW5zZm9ybS1vcmlnaW46IDAgMDtcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjFzIGVhc2U7XG4gICAgICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgICAgIG1pbi1oZWlnaHQ6IDIwMHB4O1xuICAgICAgbWluLXdpZHRoOiAyMDBweDtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuXG4gICAgICBwcmUge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgIH1cblxuICAgICAgc3ZnIHtcbiAgICAgICAgbWF4LXdpZHRoOiBub25lO1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICB9XG4gICAgfVxuXG4gICAgJiA+IC5tZXJtYWlkLWNvbnRyb2xzIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGJvdHRvbTogMjBweDtcbiAgICAgIHJpZ2h0OiAyMHB4O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGdhcDogOHB4O1xuICAgICAgcGFkZGluZzogOHB4O1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tbGlnaHQpO1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDRweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gICAgICB6LWluZGV4OiAyO1xuXG4gICAgICAubWVybWFpZC1jb250cm9sLWJ1dHRvbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB3aWR0aDogMzJweDtcbiAgICAgICAgaGVpZ2h0OiAzMnB4O1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodCk7XG4gICAgICAgIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcigtLWJvZHlGb250KTtcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodGdyYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxcHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3R5bGUgdGhlIHJlc2V0IGJ1dHRvbiBkaWZmZXJlbnRseVxuICAgICAgICAmOm50aC1jaGlsZCgyKSB7XG4gICAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgICAgcGFkZGluZzogMCAxMnB4O1xuICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19 */`;import{toHast}from"mdast-util-to-hast";import{toHtml}from"hast-util-to-html";function capitalize(s){return s.substring(0,1).toUpperCase()+s.substring(1)}__name(capitalize,"capitalize");function classNames(displayClass,...classes){return displayClass&&classes.push(displayClass),classes.join(" ")}__name(classNames,"classNames");var defaultOptions6={comments:!0,highlight:!0,wikilinks:!0,callouts:!0,mermaid:!0,parseTags:!0,parseArrows:!0,parseBlockReferences:!0,enableInHtmlEmbed:!1,enableYouTubeEmbed:!0,enableVideoEmbed:!0,enableCheckbox:!1,disableBrokenWikilinks:!1},calloutMapping={note:"note",abstract:"abstract",summary:"abstract",tldr:"abstract",info:"info",todo:"todo",tip:"tip",hint:"tip",important:"tip",success:"success",check:"success",done:"success",question:"question",help:"question",faq:"question",warning:"warning",attention:"warning",caution:"warning",failure:"failure",missing:"failure",fail:"failure",danger:"danger",error:"danger",bug:"bug",example:"example",quote:"quote",cite:"quote"},arrowMapping={"->":"&rarr;","-->":"&rArr;","=>":"&rArr;","==>":"&rArr;","<-":"&larr;","<--":"&lArr;","<=":"&lArr;","<==":"&lArr;"};function canonicalizeCallout(calloutName){let normalizedCallout=calloutName.toLowerCase();return calloutMapping[normalizedCallout]??calloutName}__name(canonicalizeCallout,"canonicalizeCallout");var externalLinkRegex=/^https?:\/\//i,arrowRegex=new RegExp(/(-{1,2}>|={1,2}>|<-{1,2}|<={1,2})/g),wikilinkRegex=new RegExp(/!?\[\[([^\[\]\|\#\\]+)?(#+[^\[\]\|\#\\]+)?(\\?\|[^\[\]\#]*)?\]\]/g),tableRegex=new RegExp(/^\|([^\n])+\|\n(\|)( ?:?-{3,}:? ?\|)+\n(\|([^\n])+\|\n?)+/gm),tableWikilinkRegex=new RegExp(/(!?\[\[[^\]]*?\]\]|\[\^[^\]]*?\])/g),highlightRegex=new RegExp(/==([^=]+)==/g),commentRegex=new RegExp(/%%[\s\S]*?%%/g),calloutRegex=new RegExp(/^\[\!([\w-]+)\|?(.+?)?\]([+-]?)/),calloutLineRegex=new RegExp(/^> *\[\!\w+\|?.*?\][+-]?.*$/gm),tagRegex=new RegExp(/(?<=^| )#((?:[-_\p{L}\p{Emoji}\p{M}\d])+(?:\/[-_\p{L}\p{Emoji}\p{M}\d]+)*)/gu),blockReferenceRegex=new RegExp(/\^([-_A-Za-z0-9]+)$/g),ytLinkRegex=/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,ytPlaylistLinkRegex=/[?&]list=([^#?&]*)/,videoExtensionRegex=new RegExp(/\.(mp4|webm|ogg|avi|mov|flv|wmv|mkv|mpg|mpeg|3gp|m4v)$/),wikilinkImageEmbedRegex=new RegExp(/^(?<alt>(?!^\d*x?\d*$).*?)?(\|?\s*?(?<width>\d+)(x(?<height>\d+))?)?$/),ObsidianFlavoredMarkdown=__name(userOpts=>{let opts={...defaultOptions6,...userOpts},mdastToHtml=__name(ast=>{let hast=toHast(ast,{allowDangerousHtml:!0});return toHtml(hast,{allowDangerousHtml:!0})},"mdastToHtml");return{name:"ObsidianFlavoredMarkdown",textTransform(_ctx,src){return opts.comments&&(src=src.replace(commentRegex,"")),opts.callouts&&(src=src.replace(calloutLineRegex,value=>value+`
> `)),opts.wikilinks&&(src=src.replace(tableRegex,value=>value.replace(tableWikilinkRegex,(_value,raw)=>{let escaped=raw??"";return escaped=escaped.replace("#","\\#"),escaped=escaped.replace(/((^|[^\\])(\\\\)*)\|/g,"$1\\|"),escaped})),src=src.replace(wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,[fp,anchor]=splitAnchor(`${rawFp??""}${rawHeader??""}`),blockRef=rawHeader?.startsWith("#^")?"^":"",displayAnchor=anchor?`#${blockRef}${anchor.trim().replace(/^#+/,"")}`:"",displayAlias=rawAlias??rawHeader?.replace("#","|")??"",embedDisplay=value.startsWith("!")?"!":"";return rawFp?.match(externalLinkRegex)?`${embedDisplay}[${displayAlias.replace(/^\|/,"")}](${rawFp})`:`${embedDisplay}[[${fp}${displayAnchor}${displayAlias}]]`})),src},markdownPlugins(ctx){let plugins=[];return plugins.push(()=>(tree,file)=>{let replacements=[],base=pathToRoot(file.data.slug);opts.wikilinks&&replacements.push([wikilinkRegex,(value,...capture)=>{let[rawFp,rawHeader,rawAlias]=capture,fp=rawFp?.trim()??"",anchor=rawHeader?.trim()??"",alias=rawAlias?.slice(1).trim();if(value.startsWith("!")){let ext=path4.extname(fp).toLowerCase(),url2=slugifyFilePath(fp);if([".png",".jpg",".jpeg",".gif",".bmp",".svg",".webp"].includes(ext)){let match=wikilinkImageEmbedRegex.exec(alias??""),alt=match?.groups?.alt??"",width=match?.groups?.width??"auto",height=match?.groups?.height??"auto";return{type:"image",url:url2,data:{hProperties:{width,height,alt}}}}else{if([".mp4",".webm",".ogv",".mov",".mkv"].includes(ext))return{type:"html",value:`<video src="${url2}" controls></video>`};if([".mp3",".webm",".wav",".m4a",".ogg",".3gp",".flac"].includes(ext))return{type:"html",value:`<audio src="${url2}" controls></audio>`};if([".pdf"].includes(ext))return{type:"html",value:`<iframe src="${url2}" class="pdf"></iframe>`};{let block=anchor;return{type:"html",data:{hProperties:{transclude:!0}},value:`<blockquote class="transclude" data-url="${url2}" data-block="${block}" data-embed-alias="${alias}"><a href="${url2+anchor}" class="transclude-inner">Transclude of ${url2}${block}</a></blockquote>`}}}}if(opts.disableBrokenWikilinks){let slug=slugifyFilePath(fp);if(!(ctx.allSlugs&&ctx.allSlugs.includes(slug)))return{type:"html",value:`<a class="internal broken">${alias??fp}</a>`}}return{type:"link",url:fp+anchor,children:[{type:"text",value:alias??fp}]}}]),opts.highlight&&replacements.push([highlightRegex,(_value,...capture)=>{let[inner]=capture;return{type:"html",value:`<span class="text-highlight">${inner}</span>`}}]),opts.parseArrows&&replacements.push([arrowRegex,(value,..._capture)=>{let maybeArrow=arrowMapping[value];return maybeArrow===void 0?SKIP:{type:"html",value:`<span>${maybeArrow}</span>`}}]),opts.parseTags&&replacements.push([tagRegex,(_value,tag)=>{if(/^[\/\d]+$/.test(tag))return!1;if(tag=slugTag(tag),file.data.frontmatter){let noteTags=file.data.frontmatter.tags??[];file.data.frontmatter.tags=[...new Set([...noteTags,tag])]}return{type:"link",url:base+`/tags/${tag}`,data:{hProperties:{className:["tag-link"]}},children:[{type:"text",value:tag}]}}]),opts.enableInHtmlEmbed&&visit3(tree,"html",node=>{for(let[regex,replace]of replacements)typeof replace=="string"?node.value=node.value.replace(regex,replace):node.value=node.value.replace(regex,(substring,...args)=>{let replaceValue=replace(substring,...args);return typeof replaceValue=="string"?replaceValue:Array.isArray(replaceValue)?replaceValue.map(mdastToHtml).join(""):typeof replaceValue=="object"&&replaceValue!==null?mdastToHtml(replaceValue):substring})}),mdastFindReplace(tree,replacements)}),opts.enableVideoEmbed&&plugins.push(()=>(tree,_file)=>{visit3(tree,"image",(node,index,parent)=>{if(parent&&index!=null&&videoExtensionRegex.test(node.url)){let newNode={type:"html",value:`<video controls src="${node.url}"></video>`};return parent.children.splice(index,1,newNode),SKIP}})}),opts.callouts&&plugins.push(()=>(tree,_file)=>{visit3(tree,"blockquote",node=>{if(node.children.length===0)return;let[firstChild,...calloutContent]=node.children;if(firstChild.type!=="paragraph"||firstChild.children[0]?.type!=="text")return;let text=firstChild.children[0].value,restOfTitle=firstChild.children.slice(1),[firstLine,...remainingLines]=text.split(`
`),remainingText=remainingLines.join(`
`),match=firstLine.match(calloutRegex);if(match&&match.input){let[calloutDirective,typeString,calloutMetaData,collapseChar]=match,calloutType=canonicalizeCallout(typeString.toLowerCase()),collapse=collapseChar==="+"||collapseChar==="-",defaultState=collapseChar==="-"?"collapsed":"expanded",titleContent=match.input.slice(calloutDirective.length).trim(),titleNode={type:"paragraph",children:[{type:"text",value:titleContent===""&&restOfTitle.length===0?capitalize(typeString).replace(/-/g," "):titleContent+" "},...restOfTitle]},blockquoteContent=[{type:"html",value:`<div
                  class="callout-title"
                >
                  <div class="callout-icon"></div>
                  <div class="callout-title-inner">${mdastToHtml(titleNode)}</div>
                  ${collapse?'<div class="fold-callout-icon"></div>':""}
                </div>`}];remainingText.length>0&&blockquoteContent.push({type:"paragraph",children:[{type:"text",value:remainingText}]}),calloutContent.length>0&&(node.children=[node.children[0],{data:{hProperties:{className:["callout-content"]},hName:"div"},type:"blockquote",children:[...calloutContent]}]),node.children.splice(0,1,...blockquoteContent);let classNames2=["callout",calloutType];collapse&&classNames2.push("is-collapsible"),defaultState==="collapsed"&&classNames2.push("is-collapsed"),node.data={hProperties:{...node.data?.hProperties??{},className:classNames2.join(" "),"data-callout":calloutType,"data-callout-fold":collapse,"data-callout-metadata":calloutMetaData}}}})}),opts.mermaid&&plugins.push(()=>(tree,file)=>{visit3(tree,"code",node=>{node.lang==="mermaid"&&(file.data.hasMermaidDiagram=!0,node.data={hProperties:{className:["mermaid"],"data-clipboard":JSON.stringify(node.value)}})})}),plugins},htmlPlugins(){let plugins=[rehypeRaw];return opts.parseBlockReferences&&plugins.push(()=>{let inlineTagTypes=new Set(["p","li"]),blockTagTypes=new Set(["blockquote"]);return(tree,file)=>{file.data.blocks={},visit3(tree,"element",(node,index,parent)=>{if(blockTagTypes.has(node.tagName)){let nextChild=parent?.children.at(index+2);if(nextChild&&nextChild.tagName==="p"){let text=nextChild.children.at(0);if(text&&text.value&&text.type==="text"){let matches=text.value.match(blockReferenceRegex);if(matches&&matches.length>=1){parent.children.splice(index+2,1);let block=matches[0].slice(1);Object.keys(file.data.blocks).includes(block)||(node.properties={...node.properties,id:block},file.data.blocks[block]=node)}}}}else if(inlineTagTypes.has(node.tagName)){let last=node.children.at(-1);if(last&&last.value&&typeof last.value=="string"){let matches=last.value.match(blockReferenceRegex);if(matches&&matches.length>=1){last.value=last.value.slice(0,-matches[0].length);let block=matches[0].slice(1);if(last.value===""){let idx=(index??1)-1;for(;idx>=0;){let element=parent?.children.at(idx);if(!element)break;if(element.type!=="element")idx-=1;else{Object.keys(file.data.blocks).includes(block)||(element.properties={...element.properties,id:block},file.data.blocks[block]=element);return}}}else Object.keys(file.data.blocks).includes(block)||(node.properties={...node.properties,id:block},file.data.blocks[block]=node)}}}}),file.data.htmlAst=tree}}),opts.enableYouTubeEmbed&&plugins.push(()=>tree=>{visit3(tree,"element",node=>{if(node.tagName==="img"&&typeof node.properties.src=="string"){let match=node.properties.src.match(ytLinkRegex),videoId=match&&match[2].length==11?match[2]:null,playlistId=node.properties.src.match(ytPlaylistLinkRegex)?.[1];videoId?(node.tagName="iframe",node.properties={class:"external-embed youtube",allow:"fullscreen",frameborder:0,width:"600px",src:playlistId?`https://www.youtube.com/embed/${videoId}?list=${playlistId}`:`https://www.youtube.com/embed/${videoId}`}):playlistId&&(node.tagName="iframe",node.properties={class:"external-embed youtube",allow:"fullscreen",frameborder:0,width:"600px",src:`https://www.youtube.com/embed/videoseries?list=${playlistId}`})}})}),opts.enableCheckbox&&plugins.push(()=>(tree,_file)=>{visit3(tree,"element",node=>{if(node.tagName==="input"&&node.properties.type==="checkbox"){let isChecked=node.properties?.checked??!1;node.properties={type:"checkbox",disabled:!1,checked:isChecked,class:"checkbox-toggle"}}})}),opts.mermaid&&plugins.push(()=>(tree,_file)=>{visit3(tree,"element",(node,_idx,parent)=>{node.tagName==="code"&&(node.properties?.className??[])?.includes("mermaid")&&(parent.children=[{type:"element",tagName:"button",properties:{className:["expand-button"],"aria-label":"Expand mermaid diagram","data-view-component":!0},children:[{type:"element",tagName:"svg",properties:{width:16,height:16,viewBox:"0 0 16 16",fill:"currentColor"},children:[{type:"element",tagName:"path",properties:{fillRule:"evenodd",d:"M3.72 3.72a.75.75 0 011.06 1.06L2.56 7h10.88l-2.22-2.22a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.56l2.22 2.22a.75.75 0 11-1.06 1.06l-3.5-3.5a.75.75 0 010-1.06l3.5-3.5z"},children:[]}]}]},node,{type:"element",tagName:"div",properties:{id:"mermaid-container",role:"dialog"},children:[{type:"element",tagName:"div",properties:{id:"mermaid-space"},children:[{type:"element",tagName:"div",properties:{className:["mermaid-content"]},children:[]}]}]}])})}),plugins},externalResources(){let js=[],css=[];return opts.enableCheckbox&&js.push({script:checkbox_inline_default,loadTime:"afterDOMReady",contentType:"inline"}),opts.callouts&&js.push({script:callout_inline_default,loadTime:"afterDOMReady",contentType:"inline"}),opts.mermaid&&(js.push({script:mermaid_inline_default,loadTime:"afterDOMReady",contentType:"inline",moduleType:"module"}),css.push({content:mermaid_inline_default2,inline:!0})),{js,css}}}},"ObsidianFlavoredMarkdown");import rehypeRaw2 from"rehype-raw";var relrefRegex=new RegExp(/\[([^\]]+)\]\(\{\{< relref "([^"]+)" >\}\}\)/,"g"),predefinedHeadingIdRegex=new RegExp(/(.*) {#(?:.*)}/,"g"),hugoShortcodeRegex=new RegExp(/{{(.*)}}/,"g"),figureTagRegex=new RegExp(/< ?figure src="(.*)" ?>/,"g"),inlineLatexRegex=new RegExp(/\\\\\((.+?)\\\\\)/,"g"),blockLatexRegex=new RegExp(/(?:\\begin{equation}|\\\\\(|\\\\\[)([\s\S]*?)(?:\\\\\]|\\\\\)|\\end{equation})/,"g"),quartzLatexRegex=new RegExp(/\$\$[\s\S]*?\$\$|\$.*?\$/,"g");import rehypePrettyCode from"rehype-pretty-code";var defaultOptions7={theme:{light:"github-light",dark:"github-dark"},keepBackground:!1},SyntaxHighlighting=__name(userOpts=>{let opts={...defaultOptions7,...userOpts};return{name:"SyntaxHighlighting",htmlPlugins(){return[[rehypePrettyCode,opts]]}}},"SyntaxHighlighting");import{visit as visit4}from"unist-util-visit";import{toString as toString2}from"mdast-util-to-string";import Slugger from"github-slugger";var defaultOptions8={maxDepth:3,minEntries:1,showByDefault:!0,collapseByDefault:!1},slugAnchor2=new Slugger,TableOfContents=__name(userOpts=>{let opts={...defaultOptions8,...userOpts};return{name:"TableOfContents",markdownPlugins(){return[()=>async(tree,file)=>{if(file.data.frontmatter?.enableToc??opts.showByDefault){slugAnchor2.reset();let toc=[],highestDepth=opts.maxDepth;visit4(tree,"heading",node=>{if(node.depth<=opts.maxDepth){let text=toString2(node);highestDepth=Math.min(highestDepth,node.depth),toc.push({depth:node.depth,text,slug:slugAnchor2.slug(text)})}}),toc.length>0&&toc.length>opts.minEntries&&(file.data.toc=toc.map(entry=>({...entry,depth:entry.depth-highestDepth})),file.data.collapseToc=opts.collapseByDefault)}}]}}},"TableOfContents");import remarkBreaks from"remark-breaks";var HardLineBreaks=__name(()=>({name:"HardLineBreaks",markdownPlugins(){return[remarkBreaks]}}),"HardLineBreaks");import{visit as visit5}from"unist-util-visit";import{findAndReplace as mdastFindReplace2}from"mdast-util-find-and-replace";var orRegex=new RegExp(/{{or:(.*?)}}/,"g"),TODORegex=new RegExp(/{{.*?\bTODO\b.*?}}/,"g"),DONERegex=new RegExp(/{{.*?\bDONE\b.*?}}/,"g"),blockquoteRegex=new RegExp(/(\[\[>\]\])\s*(.*)/,"g"),roamHighlightRegex=new RegExp(/\^\^(.+)\^\^/,"g"),roamItalicRegex=new RegExp(/__(.+)__/,"g");var RemoveDrafts=__name(()=>({name:"RemoveDrafts",shouldPublish(_ctx,[_tree,vfile]){return!(vfile.data?.frontmatter?.draft===!0||vfile.data?.frontmatter?.draft==="true")}}),"RemoveDrafts");import path6 from"path";import{jsx}from"preact/jsx-runtime";var Header=__name(({children})=>children.length>0?jsx("header",{children}):null,"Header");Header.css=`
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;
}

header h1 {
  margin: 0;
  flex: auto;
}
`;var Header_default=__name((()=>Header),"default");var clipboard_inline_default=`var r='<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg>',l='<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>';document.addEventListener("nav",()=>{let a=document.getElementsByTagName("pre");for(let t=0;t<a.length;t++){let n=a[t].getElementsByTagName("code")[0];if(n){let o=function(){navigator.clipboard.writeText(i).then(()=>{e.blur(),e.innerHTML=l,setTimeout(()=>{e.innerHTML=r,e.style.borderColor=""},2e3)},d=>console.error(d))};var c=o;let i=(n.dataset.clipboard?JSON.parse(n.dataset.clipboard):n.innerText).replace(/\\n\\n/g,\`
\`),e=document.createElement("button");e.className="clipboard-button",e.type="button",e.innerHTML=r,e.ariaLabel="Copy source",e.addEventListener("click",o),window.addCleanup(()=>e.removeEventListener("click",o)),a[t].prepend(e)}}});
`;var clipboard_default=`.clipboard-button {
  position: absolute;
  display: flex;
  float: right;
  right: 0;
  padding: 0.4rem;
  margin: 0.3rem;
  color: var(--gray);
  border-color: var(--dark);
  background-color: var(--light);
  border: 1px solid;
  border-radius: 5px;
  opacity: 0;
  transition: 0.2s;
}
.clipboard-button > svg {
  fill: var(--light);
  filter: contrast(0.3);
}
.clipboard-button:hover {
  cursor: pointer;
  border-color: var(--secondary);
}
.clipboard-button:focus {
  outline: 0;
}

pre:hover > .clipboard-button {
  opacity: 1;
  transition: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImNsaXBib2FyZC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTs7QUFHRjtFQUNFOzs7QUFLRjtFQUNFO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIuY2xpcGJvYXJkLWJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxvYXQ6IHJpZ2h0O1xuICByaWdodDogMDtcbiAgcGFkZGluZzogMC40cmVtO1xuICBtYXJnaW46IDAuM3JlbTtcbiAgY29sb3I6IHZhcigtLWdyYXkpO1xuICBib3JkZXItY29sb3I6IHZhcigtLWRhcmspO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gIGJvcmRlcjogMXB4IHNvbGlkO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIG9wYWNpdHk6IDA7XG4gIHRyYW5zaXRpb246IDAuMnM7XG5cbiAgJiA+IHN2ZyB7XG4gICAgZmlsbDogdmFyKC0tbGlnaHQpO1xuICAgIGZpbHRlcjogY29udHJhc3QoMC4zKTtcbiAgfVxuXG4gICY6aG92ZXIge1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLXNlY29uZGFyeSk7XG4gIH1cblxuICAmOmZvY3VzIHtcbiAgICBvdXRsaW5lOiAwO1xuICB9XG59XG5cbnByZSB7XG4gICY6aG92ZXIgPiAuY2xpcGJvYXJkLWJ1dHRvbiB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2l0aW9uOiAwLjJzO1xuICB9XG59XG4iXX0= */`;import{jsx as jsx2}from"preact/jsx-runtime";var Body=__name(({children})=>jsx2("div",{id:"quartz-body",children}),"Body");Body.afterDOMLoaded=clipboard_inline_default;Body.css=clipboard_default;var Body_default=__name((()=>Body),"default");import{render}from"preact-render-to-string";import{randomUUID}from"crypto";import{jsx as jsx3}from"preact/jsx-runtime";function JSResourceToScriptElement(resource,preserve){let scriptType=resource.moduleType??"application/javascript",spaPreserve=preserve??resource.spaPreserve;if(resource.contentType==="external")return jsx3("script",{src:resource.src,type:scriptType,"spa-preserve":spaPreserve},resource.src);{let content=resource.script;return jsx3("script",{type:scriptType,"spa-preserve":spaPreserve,dangerouslySetInnerHTML:{__html:content}},randomUUID())}}__name(JSResourceToScriptElement,"JSResourceToScriptElement");function CSSResourceToStyleElement(resource,preserve){let spaPreserve=preserve??resource.spaPreserve;return resource.inline??!1?jsx3("style",{children:resource.content}):jsx3("link",{href:resource.content,rel:"stylesheet",type:"text/css","spa-preserve":spaPreserve},resource.content)}__name(CSSResourceToStyleElement,"CSSResourceToStyleElement");function concatenateResources(...resources){return resources.filter(resource=>resource!==void 0).flat()}__name(concatenateResources,"concatenateResources");import{visit as visit6}from"unist-util-visit";import{jsx as jsx4,jsxs}from"preact/jsx-runtime";var headerRegex=new RegExp(/h[1-6]/);function pageResources(baseDir,staticResources){let contentIndexScript=`const fetchData = fetch("${joinSegments(baseDir,"static/contentIndex.json")}").then(data => data.json())`,resources={css:[{content:joinSegments(baseDir,"index.css")},...staticResources.css],js:[{src:joinSegments(baseDir,"prescript.js"),loadTime:"beforeDOMReady",contentType:"external"},{loadTime:"beforeDOMReady",contentType:"inline",spaPreserve:!0,script:contentIndexScript},...staticResources.js],additionalHead:staticResources.additionalHead};return resources.js.push({src:joinSegments(baseDir,"postscript.js"),loadTime:"afterDOMReady",moduleType:"module",contentType:"external"}),resources}__name(pageResources,"pageResources");function renderTranscludes(root,cfg,slug,componentData){visit6(root,"element",(node,_index,_parent)=>{if(node.tagName==="blockquote"&&(node.properties?.className??[]).includes("transclude")){let inner=node.children[0],transcludeTarget=inner.properties["data-slug"]??slug,page=componentData.allFiles.find(f=>f.slug===transcludeTarget);if(!page)return;let blockRef=node.properties.dataBlock;if(blockRef?.startsWith("#^")){blockRef=blockRef.slice(2);let blockNode=page.blocks?.[blockRef];blockNode&&(blockNode.tagName==="li"&&(blockNode={type:"element",tagName:"ul",properties:{},children:[blockNode]}),node.children=[normalizeHastElement(blockNode,slug,transcludeTarget),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal","transclude-src"]},children:[{type:"text",value:i18n(cfg.locale).components.transcludes.linkToOriginal}]}])}else if(blockRef?.startsWith("#")&&page.htmlAst){blockRef=blockRef.slice(1);let startIdx,startDepth,endIdx;for(let[i,el]of page.htmlAst.children.entries()){if(!(el.type==="element"&&el.tagName.match(headerRegex)))continue;let depth=Number(el.tagName.substring(1));if(startIdx===void 0||startDepth===void 0)el.properties?.id===blockRef&&(startIdx=i,startDepth=depth);else if(depth<=startDepth){endIdx=i;break}}if(startIdx===void 0)return;node.children=[...page.htmlAst.children.slice(startIdx,endIdx).map(child=>normalizeHastElement(child,slug,transcludeTarget)),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal","transclude-src"]},children:[{type:"text",value:i18n(cfg.locale).components.transcludes.linkToOriginal}]}]}else page.htmlAst&&(node.children=[{type:"element",tagName:"h1",properties:{},children:[{type:"text",value:page.frontmatter?.title??i18n(cfg.locale).components.transcludes.transcludeOf({targetSlug:page.slug})}]},...page.htmlAst.children.map(child=>normalizeHastElement(child,slug,transcludeTarget)),{type:"element",tagName:"a",properties:{href:inner.properties?.href,class:["internal","transclude-src"]},children:[{type:"text",value:i18n(cfg.locale).components.transcludes.linkToOriginal}]}])}})}__name(renderTranscludes,"renderTranscludes");function renderPage(cfg,slug,componentData,components,pageResources2){let root=clone(componentData.tree);renderTranscludes(root,cfg,slug,componentData),componentData.tree=root;let{head:Head,header,beforeBody,pageBody:Content2,afterBody,left,right,footer:Footer}=components,Header2=Header_default(),Body2=Body_default(),LeftComponent=jsx4("div",{class:"left sidebar",children:left.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),RightComponent=jsx4("div",{class:"right sidebar",children:right.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))}),lang=componentData.fileData.frontmatter?.lang??cfg.locale?.split("-")[0]??"en",direction=i18n(cfg.locale).direction??"ltr",doc=jsxs("html",{lang,dir:direction,children:[jsx4(Head,{...componentData}),jsx4("body",{"data-slug":slug,children:jsx4("div",{id:"quartz-root",class:"page",children:jsxs(Body2,{...componentData,children:[LeftComponent,jsxs("div",{class:"center",children:[jsxs("div",{class:"page-header",children:[jsx4(Header2,{...componentData,children:header.map(HeaderComponent=>jsx4(HeaderComponent,{...componentData}))}),jsx4("div",{class:"popover-hint",children:beforeBody.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))})]}),jsx4(Content2,{...componentData}),jsx4("hr",{}),jsx4("div",{class:"page-footer",children:afterBody.map(BodyComponent=>jsx4(BodyComponent,{...componentData}))})]}),RightComponent,jsx4(Footer,{...componentData})]})})}),pageResources2.js.filter(resource=>resource.loadTime==="afterDOMReady").map(res=>JSResourceToScriptElement(res))]});return`<!DOCTYPE html>
`+render(doc)}__name(renderPage,"renderPage");import{toJsxRuntime}from"hast-util-to-jsx-runtime";import{Fragment,jsx as jsx5,jsxs as jsxs2}from"preact/jsx-runtime";import{jsx as jsx6}from"preact/jsx-runtime";var customComponents={table:__name(props=>jsx6("div",{class:"table-container",children:jsx6("table",{...props})}),"table")};function htmlToJsx(fp,tree){try{return toJsxRuntime(tree,{Fragment,jsx:jsx5,jsxs:jsxs2,elementAttributeNameCase:"html",components:customComponents})}catch(e){trace(`Failed to parse Markdown in \`${fp}\` into JSX`,e)}}__name(htmlToJsx,"htmlToJsx");import{jsx as jsx7}from"preact/jsx-runtime";var Content=__name(({fileData,tree})=>{let content=htmlToJsx(fileData.filePath,tree),classString=["popover-hint",...fileData.frontmatter?.cssclasses??[]].join(" ");return jsx7("article",{class:classString,children:content})},"Content"),Content_default=__name((()=>Content),"default");var listPage_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
ul.section-ul {
  list-style: none;
  margin-top: 2em;
  padding-left: 0;
}

li.section-li {
  margin-bottom: 1em;
}
li.section-li > .section {
  display: grid;
  grid-template-columns: fit-content(8em) 3fr 1fr;
}
@media all and ((max-width: 800px)) {
  li.section-li > .section > .tags {
    display: none;
  }
}
li.section-li > .section > .desc > h3 > a {
  background-color: transparent;
}
li.section-li > .section .meta {
  margin: 0 1em 0 0;
  opacity: 0.6;
}

.popover .section {
  grid-template-columns: fit-content(8em) 1fr !important;
}
.popover .section > .tags {
  display: none;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbIi4uXFwuLlxcc3R5bGVzXFx2YXJpYWJsZXMuc2NzcyIsImxpc3RQYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUNBQTtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTs7QUFFQTtFQUNFO0VBQ0E7O0FBRUE7RUFDRTtJQUNFOzs7QUFJSjtFQUNFOztBQUdGO0VBQ0U7RUFDQTs7O0FBTU47RUFDRTs7QUFFQTtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcInNhc3M6bWFwXCI7XG5cbi8qKlxuICogTGF5b3V0IGJyZWFrcG9pbnRzXG4gKiAkbW9iaWxlOiBzY3JlZW4gd2lkdGggYmVsb3cgdGhpcyB2YWx1ZSB3aWxsIHVzZSBtb2JpbGUgc3R5bGVzXG4gKiAkZGVza3RvcDogc2NyZWVuIHdpZHRoIGFib3ZlIHRoaXMgdmFsdWUgd2lsbCB1c2UgZGVza3RvcCBzdHlsZXNcbiAqIFNjcmVlbiB3aWR0aCBiZXR3ZWVuICRtb2JpbGUgYW5kICRkZXNrdG9wIHdpZHRoIHdpbGwgdXNlIHRoZSB0YWJsZXQgbGF5b3V0LlxuICogYXNzdW1pbmcgbW9iaWxlIDwgZGVza3RvcFxuICovXG4kYnJlYWtwb2ludHM6IChcbiAgbW9iaWxlOiA4MDBweCxcbiAgZGVza3RvcDogMTIwMHB4LFxuKTtcblxuJG1vYmlsZTogXCIobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSlcIjtcbiR0YWJsZXQ6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pIGFuZCAobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG4kZGVza3RvcDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG5cbiRwYWdlV2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9O1xuJHNpZGVQYW5lbFdpZHRoOiAzMjBweDsgLy8zODBweDtcbiR0b3BTcGFjaW5nOiA2cmVtO1xuJGJvbGRXZWlnaHQ6IDcwMDtcbiRzZW1pQm9sZFdlaWdodDogNjAwO1xuJG5vcm1hbFdlaWdodDogNDAwO1xuXG4kbW9iaWxlR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCJhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0XCJcXFxuICAgICAgXCJncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1mb290ZXJcIicsXG4pO1xuJHRhYmxldEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlclwiJyxcbik7XG4kZGVza3RvcEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0byAjeyRzaWRlUGFuZWxXaWR0aH1cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyIGdyaWQtc2lkZWJhci1yaWdodFwiJyxcbik7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcblxudWwuc2VjdGlvbi11bCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG4gIG1hcmdpbi10b3A6IDJlbTtcbiAgcGFkZGluZy1sZWZ0OiAwO1xufVxuXG5saS5zZWN0aW9uLWxpIHtcbiAgbWFyZ2luLWJvdHRvbTogMWVtO1xuXG4gICYgPiAuc2VjdGlvbiB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGZpdC1jb250ZW50KDhlbSkgM2ZyIDFmcjtcblxuICAgIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgICAmID4gLnRhZ3Mge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgIH1cblxuICAgICYgPiAuZGVzYyA+IGgzID4gYSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICB9XG5cbiAgICAmIC5tZXRhIHtcbiAgICAgIG1hcmdpbjogMCAxZW0gMCAwO1xuICAgICAgb3BhY2l0eTogMC42O1xuICAgIH1cbiAgfVxufVxuXG4vLyBtb2RpZmljYXRpb25zIGluIHBvcG92ZXIgY29udGV4dFxuLnBvcG92ZXIgLnNlY3Rpb24ge1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGZpdC1jb250ZW50KDhlbSkgMWZyICFpbXBvcnRhbnQ7XG5cbiAgJiA+IC50YWdzIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4iXX0= */`;import{jsx as jsx8}from"preact/jsx-runtime";function getDate(cfg,data){if(!cfg.defaultDateType)throw new Error("Field 'defaultDateType' was not set in the configuration object of quartz.config.ts. See https://quartz.jzhao.xyz/configuration#general-configuration for more details.");return data.dates?.[cfg.defaultDateType]}__name(getDate,"getDate");function formatDate(d,locale="en-US"){return d.toLocaleDateString(locale,{year:"numeric",month:"short",day:"2-digit"})}__name(formatDate,"formatDate");function Date2({date,locale}){return jsx8("time",{datetime:date.toISOString(),children:formatDate(date,locale)})}__name(Date2,"Date");import{jsx as jsx9,jsxs as jsxs3}from"preact/jsx-runtime";function byDateAndAlphabeticalFolderFirst(cfg){return(f1,f2)=>{let f1IsFolder=isFolderPath(f1.slug??""),f2IsFolder=isFolderPath(f2.slug??"");if(f1IsFolder&&!f2IsFolder)return-1;if(!f1IsFolder&&f2IsFolder)return 1;if(f1.dates&&f2.dates)return getDate(cfg,f2).getTime()-getDate(cfg,f1).getTime();if(f1.dates&&!f2.dates)return-1;if(!f1.dates&&f2.dates)return 1;let f1Title=f1.frontmatter?.title.toLowerCase()??"",f2Title=f2.frontmatter?.title.toLowerCase()??"";return f1Title.localeCompare(f2Title)}}__name(byDateAndAlphabeticalFolderFirst,"byDateAndAlphabeticalFolderFirst");var PageList=__name(({cfg,fileData,allFiles,limit,sort})=>{let sorter=sort??byDateAndAlphabeticalFolderFirst(cfg),list=allFiles.sort(sorter);return limit&&(list=list.slice(0,limit)),jsx9("ul",{class:"section-ul",children:list.map(page=>{let title=page.frontmatter?.title,tags=page.frontmatter?.tags??[];return jsx9("li",{class:"section-li",children:jsxs3("div",{class:"section",children:[jsx9("p",{class:"meta",children:page.dates&&jsx9(Date2,{date:getDate(cfg,page),locale:cfg.locale})}),jsx9("div",{class:"desc",children:jsx9("h3",{children:jsx9("a",{href:resolveRelative(fileData.slug,page.slug),class:"internal",children:title})})}),jsx9("ul",{class:"tags",children:tags.map(tag=>jsx9("li",{children:jsx9("a",{class:"internal tag-link",href:resolveRelative(fileData.slug,`tags/${tag}`),children:tag})}))})]})})})})},"PageList");PageList.css=`
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`;import{Fragment as Fragment2,jsx as jsx10,jsxs as jsxs4}from"preact/jsx-runtime";var defaultOptions9={numPages:10},TagContent_default=__name((opts=>{let options2={...defaultOptions9,...opts},TagContent=__name(props=>{let{tree,fileData,allFiles,cfg}=props,slug=fileData.slug;if(!(slug?.startsWith("tags/")||slug==="tags"))throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`);let tag=simplifySlug(slug.slice(5)),allPagesWithTag=__name(tag2=>allFiles.filter(file=>(file.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes).includes(tag2)),"allPagesWithTag"),content=tree.children.length===0?fileData.description:htmlToJsx(fileData.filePath,tree),classes=(fileData.frontmatter?.cssclasses??[]).join(" ");if(tag==="/"){let tags=[...new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes))].sort((a,b)=>a.localeCompare(b)),tagItemMap=new Map;for(let tag2 of tags)tagItemMap.set(tag2,allPagesWithTag(tag2));return jsxs4("div",{class:"popover-hint",children:[jsx10("article",{class:classes,children:jsx10("p",{children:content})}),jsx10("p",{children:i18n(cfg.locale).pages.tagContent.totalTags({count:tags.length})}),jsx10("div",{children:tags.map(tag2=>{let pages=tagItemMap.get(tag2),listProps={...props,allFiles:pages},contentPage=allFiles.filter(file=>file.slug===`tags/${tag2}`).at(0),root=contentPage?.htmlAst,content2=!root||root?.children.length===0?contentPage?.description:htmlToJsx(contentPage.filePath,root),tagListingPage=`/tags/${tag2}`,href=resolveRelative(fileData.slug,tagListingPage);return jsxs4("div",{children:[jsx10("h2",{children:jsx10("a",{class:"internal tag-link",href,children:tag2})}),content2&&jsx10("p",{children:content2}),jsxs4("div",{class:"page-listing",children:[jsxs4("p",{children:[i18n(cfg.locale).pages.tagContent.itemsUnderTag({count:pages.length}),pages.length>options2.numPages&&jsxs4(Fragment2,{children:[" ",jsx10("span",{children:i18n(cfg.locale).pages.tagContent.showingFirst({count:options2.numPages})})]})]}),jsx10(PageList,{limit:options2.numPages,...listProps,sort:options2?.sort})]})]})})})]})}else{let pages=allPagesWithTag(tag),listProps={...props,allFiles:pages};return jsxs4("div",{class:"popover-hint",children:[jsx10("article",{class:classes,children:content}),jsxs4("div",{class:"page-listing",children:[jsx10("p",{children:i18n(cfg.locale).pages.tagContent.itemsUnderTag({count:pages.length})}),jsx10("div",{children:jsx10(PageList,{...listProps,sort:options2?.sort})})]})]})}},"TagContent");return TagContent.css=concatenateResources(listPage_default,PageList.css),TagContent}),"default");var FileTrieNode=class _FileTrieNode{static{__name(this,"FileTrieNode")}isFolder;children;slugSegments;fileSegmentHint;displayNameOverride;data;constructor(segments,data){this.children=[],this.slugSegments=segments,this.data=data??null,this.isFolder=!1,this.displayNameOverride=void 0}get displayName(){let nonIndexTitle=this.data?.title==="index"?void 0:this.data?.title;return this.displayNameOverride??nonIndexTitle??this.fileSegmentHint??this.slugSegment??""}set displayName(name){this.displayNameOverride=name}get slug(){let path12=joinSegments(...this.slugSegments);return this.isFolder?joinSegments(path12,"index"):path12}get slugSegment(){return this.slugSegments[this.slugSegments.length-1]}makeChild(path12,file){let fullPath=[...this.slugSegments,path12[0]],child=new _FileTrieNode(fullPath,file);return this.children.push(child),child}insert(path12,file){if(path12.length===0)throw new Error("path is empty");this.isFolder=!0;let segment=path12[0];if(path12.length===1)segment==="index"?this.data??=file:this.makeChild(path12,file);else if(path12.length>1){let child=this.children.find(c=>c.slugSegment===segment)??this.makeChild(path12,void 0),fileParts=file.filePath.split("/");child.fileSegmentHint=fileParts.at(-path12.length),child.insert(path12.slice(1),file)}}add(file){this.insert(file.slug.split("/"),file)}findNode(path12){return path12.length===0||path12.length===1&&path12[0]==="index"?this:this.children.find(c=>c.slugSegment===path12[0])?.findNode(path12.slice(1))}ancestryChain(path12){if(path12.length===0||path12.length===1&&path12[0]==="index")return[this];let child=this.children.find(c=>c.slugSegment===path12[0]);if(!child)return;let childPath=child.ancestryChain(path12.slice(1));if(childPath)return[this,...childPath]}filter(filterFn){this.children=this.children.filter(filterFn),this.children.forEach(child=>child.filter(filterFn))}map(mapFn){mapFn(this),this.children.forEach(child=>child.map(mapFn))}sort(sortFn){this.children=this.children.sort(sortFn),this.children.forEach(e=>e.sort(sortFn))}static fromEntries(entries){let trie=new _FileTrieNode([]);return entries.forEach(([,entry])=>trie.add(entry)),trie}entries(){let traverse=__name(node=>[[node.slug,node]].concat(...node.children.map(traverse)),"traverse");return traverse(this)}getFolderPaths(){return this.entries().filter(([_,node])=>node.isFolder).map(([path12,_])=>path12)}};function trieFromAllFiles(allFiles){let trie=new FileTrieNode([]);return allFiles.forEach(file=>{file.frontmatter&&trie.add({...file,slug:file.slug,title:file.frontmatter.title,filePath:file.filePath})}),trie}__name(trieFromAllFiles,"trieFromAllFiles");import{jsx as jsx11,jsxs as jsxs5}from"preact/jsx-runtime";var defaultOptions10={showFolderCount:!0,showSubfolders:!0},FolderContent_default=__name((opts=>{let options2={...defaultOptions10,...opts},FolderContent=__name(props=>{let{tree,fileData,allFiles,cfg}=props,folder=(props.ctx.trie??=trieFromAllFiles(allFiles)).findNode(fileData.slug.split("/"));if(!folder)return null;let allPagesInFolder=folder.children.map(node=>{if(node.data)return node.data;if(node.isFolder&&options2.showSubfolders){let getMostRecentDates=__name(()=>{let maybeDates;for(let child of node.children)child.data?.dates&&(maybeDates?(child.data.dates.created>maybeDates.created&&(maybeDates.created=child.data.dates.created),child.data.dates.modified>maybeDates.modified&&(maybeDates.modified=child.data.dates.modified),child.data.dates.published>maybeDates.published&&(maybeDates.published=child.data.dates.published)):maybeDates={...child.data.dates});return maybeDates??{created:new Date,modified:new Date,published:new Date}},"getMostRecentDates");return{slug:node.slug,dates:getMostRecentDates(),frontmatter:{title:node.displayName,tags:[]}}}}).filter(page=>page!==void 0)??[],classes=(fileData.frontmatter?.cssclasses??[]).join(" "),listProps={...props,sort:options2.sort,allFiles:allPagesInFolder},content=tree.children.length===0?fileData.description:htmlToJsx(fileData.filePath,tree);return jsxs5("div",{class:"popover-hint",children:[jsx11("article",{class:classes,children:content}),jsxs5("div",{class:"page-listing",children:[options2.showFolderCount&&jsx11("p",{children:i18n(cfg.locale).pages.folderContent.itemsUnderFolder({count:allPagesInFolder.length})}),jsx11("div",{children:jsx11(PageList,{...listProps})})]})]})},"FolderContent");return FolderContent.css=concatenateResources(listPage_default,PageList.css),FolderContent}),"default");import{jsx as jsx12,jsxs as jsxs6}from"preact/jsx-runtime";var NotFound=__name(({cfg})=>{let baseDir=new URL(`https://${cfg.baseUrl??"example.com"}`).pathname;return jsxs6("article",{class:"popover-hint",children:[jsx12("h1",{children:"404"}),jsx12("p",{children:i18n(cfg.locale).pages.error.notFound}),jsx12("a",{href:baseDir,children:i18n(cfg.locale).pages.error.home})]})},"NotFound"),__default=__name((()=>NotFound),"default");import{jsx as jsx13}from"preact/jsx-runtime";var ArticleTitle=__name(({fileData,displayClass})=>{let title=fileData.frontmatter?.title,isProfile=fileData.frontmatter?.type==="profile";return title&&isProfile?jsx13("h1",{class:classNames(displayClass,"article-title"),children:title}):null},"ArticleTitle");ArticleTitle.css=`
.article-title {
  margin: 2rem 0 0 0;
}
`;var ArticleTitle_default=__name((()=>ArticleTitle),"default");var darkmode_inline_default=`var c=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark",d=localStorage.getItem("theme")??c;document.documentElement.setAttribute("saved-theme",d);var a=t=>{let n=new CustomEvent("themechange",{detail:{theme:t}});document.dispatchEvent(n)};document.addEventListener("nav",()=>{let t=()=>{let e=document.documentElement.getAttribute("saved-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("saved-theme",e),localStorage.setItem("theme",e),a(e)},n=e=>{let m=e.matches?"dark":"light";document.documentElement.setAttribute("saved-theme",m),localStorage.setItem("theme",m),a(m)};for(let e of document.getElementsByClassName("darkmode"))e.addEventListener("click",t),window.addCleanup(()=>e.removeEventListener("click",t));let o=window.matchMedia("(prefers-color-scheme: dark)");o.addEventListener("change",n),window.addCleanup(()=>o.removeEventListener("change",n))});
`;var darkmode_default=`.darkmode {
  cursor: pointer;
  padding: 0;
  position: relative;
  background: none;
  border: none;
  width: 20px;
  height: 20px;
  margin: 0;
  text-align: inherit;
  flex-shrink: 0;
}
.darkmode svg {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 10px);
  fill: var(--darkgray);
  transition: opacity 0.1s ease;
}

:root[saved-theme=dark] {
  color-scheme: dark;
}

:root[saved-theme=light] {
  color-scheme: light;
}

:root[saved-theme=dark] .darkmode > .dayIcon {
  display: none;
}
:root[saved-theme=dark] .darkmode > .nightIcon {
  display: inline;
}

:root .darkmode > .dayIcon {
  display: inline;
}
:root .darkmode > .nightIcon {
  display: none;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImRhcmttb2RlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBSUo7RUFDRTs7O0FBR0Y7RUFDRTs7O0FBSUE7RUFDRTs7QUFFRjtFQUNFOzs7QUFLRjtFQUNFOztBQUVGO0VBQ0UiLCJzb3VyY2VzQ29udGVudCI6WyIuZGFya21vZGUge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHBhZGRpbmc6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuICB3aWR0aDogMjBweDtcbiAgaGVpZ2h0OiAyMHB4O1xuICBtYXJnaW46IDA7XG4gIHRleHQtYWxpZ246IGluaGVyaXQ7XG4gIGZsZXgtc2hyaW5rOiAwO1xuXG4gICYgc3ZnIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICAgIHRvcDogY2FsYyg1MCUgLSAxMHB4KTtcbiAgICBmaWxsOiB2YXIoLS1kYXJrZ3JheSk7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjFzIGVhc2U7XG4gIH1cbn1cblxuOnJvb3Rbc2F2ZWQtdGhlbWU9XCJkYXJrXCJdIHtcbiAgY29sb3Itc2NoZW1lOiBkYXJrO1xufVxuXG46cm9vdFtzYXZlZC10aGVtZT1cImxpZ2h0XCJdIHtcbiAgY29sb3Itc2NoZW1lOiBsaWdodDtcbn1cblxuOnJvb3Rbc2F2ZWQtdGhlbWU9XCJkYXJrXCJdIC5kYXJrbW9kZSB7XG4gICYgPiAuZGF5SWNvbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuICAmID4gLm5pZ2h0SWNvbiB7XG4gICAgZGlzcGxheTogaW5saW5lO1xuICB9XG59XG5cbjpyb290IC5kYXJrbW9kZSB7XG4gICYgPiAuZGF5SWNvbiB7XG4gICAgZGlzcGxheTogaW5saW5lO1xuICB9XG4gICYgPiAubmlnaHRJY29uIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG4iXX0= */`;import{jsx as jsx14,jsxs as jsxs7}from"preact/jsx-runtime";var Darkmode=__name(({displayClass,cfg})=>jsxs7("button",{class:classNames(displayClass,"darkmode"),children:[jsxs7("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",class:"dayIcon",x:"0px",y:"0px",viewBox:"0 0 35 35",style:"enable-background:new 0 0 35 35",xmlSpace:"preserve","aria-label":i18n(cfg.locale).components.themeToggle.darkMode,children:[jsx14("title",{children:i18n(cfg.locale).components.themeToggle.darkMode}),jsx14("path",{d:"M6,17.5C6,16.672,5.328,16,4.5,16h-3C0.672,16,0,16.672,0,17.5    S0.672,19,1.5,19h3C5.328,19,6,18.328,6,17.5z M7.5,26c-0.414,0-0.789,0.168-1.061,0.439l-2,2C4.168,28.711,4,29.086,4,29.5    C4,30.328,4.671,31,5.5,31c0.414,0,0.789-0.168,1.06-0.44l2-2C8.832,28.289,9,27.914,9,27.5C9,26.672,8.329,26,7.5,26z M17.5,6    C18.329,6,19,5.328,19,4.5v-3C19,0.672,18.329,0,17.5,0S16,0.672,16,1.5v3C16,5.328,16.671,6,17.5,6z M27.5,9    c0.414,0,0.789-0.168,1.06-0.439l2-2C30.832,6.289,31,5.914,31,5.5C31,4.672,30.329,4,29.5,4c-0.414,0-0.789,0.168-1.061,0.44    l-2,2C26.168,6.711,26,7.086,26,7.5C26,8.328,26.671,9,27.5,9z M6.439,8.561C6.711,8.832,7.086,9,7.5,9C8.328,9,9,8.328,9,7.5    c0-0.414-0.168-0.789-0.439-1.061l-2-2C6.289,4.168,5.914,4,5.5,4C4.672,4,4,4.672,4,5.5c0,0.414,0.168,0.789,0.439,1.06    L6.439,8.561z M33.5,16h-3c-0.828,0-1.5,0.672-1.5,1.5s0.672,1.5,1.5,1.5h3c0.828,0,1.5-0.672,1.5-1.5S34.328,16,33.5,16z     M28.561,26.439C28.289,26.168,27.914,26,27.5,26c-0.828,0-1.5,0.672-1.5,1.5c0,0.414,0.168,0.789,0.439,1.06l2,2    C28.711,30.832,29.086,31,29.5,31c0.828,0,1.5-0.672,1.5-1.5c0-0.414-0.168-0.789-0.439-1.061L28.561,26.439z M17.5,29    c-0.829,0-1.5,0.672-1.5,1.5v3c0,0.828,0.671,1.5,1.5,1.5s1.5-0.672,1.5-1.5v-3C19,29.672,18.329,29,17.5,29z M17.5,7    C11.71,7,7,11.71,7,17.5S11.71,28,17.5,28S28,23.29,28,17.5S23.29,7,17.5,7z M17.5,25c-4.136,0-7.5-3.364-7.5-7.5    c0-4.136,3.364-7.5,7.5-7.5c4.136,0,7.5,3.364,7.5,7.5C25,21.636,21.636,25,17.5,25z"})]}),jsxs7("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",class:"nightIcon",x:"0px",y:"0px",viewBox:"0 0 100 100",style:"enable-background:new 0 0 100 100",xmlSpace:"preserve","aria-label":i18n(cfg.locale).components.themeToggle.lightMode,children:[jsx14("title",{children:i18n(cfg.locale).components.themeToggle.lightMode}),jsx14("path",{d:"M96.76,66.458c-0.853-0.852-2.15-1.064-3.23-0.534c-6.063,2.991-12.858,4.571-19.655,4.571  C62.022,70.495,50.88,65.88,42.5,57.5C29.043,44.043,25.658,23.536,34.076,6.47c0.532-1.08,0.318-2.379-0.534-3.23  c-0.851-0.852-2.15-1.064-3.23-0.534c-4.918,2.427-9.375,5.619-13.246,9.491c-9.447,9.447-14.65,22.008-14.65,35.369  c0,13.36,5.203,25.921,14.65,35.368s22.008,14.65,35.368,14.65c13.361,0,25.921-5.203,35.369-14.65  c3.872-3.871,7.064-8.328,9.491-13.246C97.826,68.608,97.611,67.309,96.76,66.458z"})]})]}),"Darkmode");Darkmode.beforeDOMLoaded=darkmode_inline_default;Darkmode.css=darkmode_default;var readermode_inline_default=`var n=!1,d=t=>{let e=new CustomEvent("readermodechange",{detail:{mode:t}});document.dispatchEvent(e)};document.addEventListener("nav",()=>{let t=()=>{n=!n;let e=n?"on":"off";document.documentElement.setAttribute("reader-mode",e),d(e)};for(let e of document.getElementsByClassName("readermode"))e.addEventListener("click",t),window.addCleanup(()=>e.removeEventListener("click",t));document.documentElement.setAttribute("reader-mode",n?"on":"off")});
`;var readermode_default=`.readermode {
  cursor: pointer;
  padding: 0;
  position: relative;
  background: none;
  border: none;
  width: 20px;
  height: 20px;
  margin: 0;
  text-align: inherit;
  flex-shrink: 0;
}
.readermode svg {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 10px);
  fill: var(--darkgray);
  stroke: var(--darkgray);
  transition: opacity 0.1s ease;
}

:root[reader-mode=on] .sidebar.left, :root[reader-mode=on] .sidebar.right {
  opacity: 0;
  transition: opacity 0.2s ease;
}
:root[reader-mode=on] .sidebar.left:hover, :root[reader-mode=on] .sidebar.right:hover {
  opacity: 1;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbInJlYWRlcm1vZGUuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUtGO0VBRUU7RUFDQTs7QUFFQTtFQUNFIiwic291cmNlc0NvbnRlbnQiOlsiLnJlYWRlcm1vZGUge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHBhZGRpbmc6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuICB3aWR0aDogMjBweDtcbiAgaGVpZ2h0OiAyMHB4O1xuICBtYXJnaW46IDA7XG4gIHRleHQtYWxpZ246IGluaGVyaXQ7XG4gIGZsZXgtc2hyaW5rOiAwO1xuXG4gICYgc3ZnIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICAgIHRvcDogY2FsYyg1MCUgLSAxMHB4KTtcbiAgICBmaWxsOiB2YXIoLS1kYXJrZ3JheSk7XG4gICAgc3Ryb2tlOiB2YXIoLS1kYXJrZ3JheSk7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjFzIGVhc2U7XG4gIH1cbn1cblxuOnJvb3RbcmVhZGVyLW1vZGU9XCJvblwiXSB7XG4gICYgLnNpZGViYXIubGVmdCxcbiAgJiAuc2lkZWJhci5yaWdodCB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMnMgZWFzZTtcblxuICAgICY6aG92ZXIge1xuICAgICAgb3BhY2l0eTogMTtcbiAgICB9XG4gIH1cbn1cbiJdfQ== */`;import{jsx as jsx15,jsxs as jsxs8}from"preact/jsx-runtime";var ReaderMode=__name(({displayClass,cfg})=>jsx15("button",{class:classNames(displayClass,"readermode"),children:jsxs8("svg",{xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1",class:"readerIcon",fill:"currentColor",stroke:"currentColor","stroke-width":"0.2","stroke-linecap":"round","stroke-linejoin":"round",width:"64px",height:"64px",viewBox:"0 0 24 24","aria-label":i18n(cfg.locale).components.readerMode.title,children:[jsx15("title",{children:i18n(cfg.locale).components.readerMode.title}),jsx15("g",{transform:"translate(-1.8, -1.8) scale(1.15, 1.2)",children:jsx15("path",{d:"M8.9891247,2.5 C10.1384702,2.5 11.2209868,2.96705384 12.0049645,3.76669482 C12.7883914,2.96705384 13.8709081,2.5 15.0202536,2.5 L18.7549359,2.5 C19.1691495,2.5 19.5049359,2.83578644 19.5049359,3.25 L19.5046891,4.004 L21.2546891,4.00457396 C21.6343849,4.00457396 21.9481801,4.28672784 21.9978425,4.6528034 L22.0046891,4.75457396 L22.0046891,20.25 C22.0046891,20.6296958 21.7225353,20.943491 21.3564597,20.9931534 L21.2546891,21 L2.75468914,21 C2.37499337,21 2.06119817,20.7178461 2.01153575,20.3517706 L2.00468914,20.25 L2.00468914,4.75457396 C2.00468914,4.37487819 2.28684302,4.061083 2.65291858,4.01142057 L2.75468914,4.00457396 L4.50368914,4.004 L4.50444233,3.25 C4.50444233,2.87030423 4.78659621,2.55650904 5.15267177,2.50684662 L5.25444233,2.5 L8.9891247,2.5 Z M4.50368914,5.504 L3.50468914,5.504 L3.50468914,19.5 L10.9478955,19.4998273 C10.4513189,18.9207296 9.73864328,18.5588115 8.96709342,18.5065584 L8.77307039,18.5 L5.25444233,18.5 C4.87474657,18.5 4.56095137,18.2178461 4.51128895,17.8517706 L4.50444233,17.75 L4.50368914,5.504 Z M19.5049359,17.75 C19.5049359,18.1642136 19.1691495,18.5 18.7549359,18.5 L15.2363079,18.5 C14.3910149,18.5 13.5994408,18.8724714 13.0614828,19.4998273 L20.5046891,19.5 L20.5046891,5.504 L19.5046891,5.504 L19.5049359,17.75 Z M18.0059359,3.999 L15.0202536,4 L14.8259077,4.00692283 C13.9889509,4.06666544 13.2254227,4.50975805 12.7549359,5.212 L12.7549359,17.777 L12.7782651,17.7601316 C13.4923805,17.2719483 14.3447024,17 15.2363079,17 L18.0059359,16.999 L18.0056891,4.798 L18.0033792,4.75457396 L18.0056891,4.71 L18.0059359,3.999 Z M8.9891247,4 L6.00368914,3.999 L6.00599909,4.75457396 L6.00599909,4.75457396 L6.00368914,4.783 L6.00368914,16.999 L8.77307039,17 C9.57551536,17 10.3461406,17.2202781 11.0128313,17.6202194 L11.2536891,17.776 L11.2536891,5.211 C10.8200889,4.56369974 10.1361548,4.13636104 9.37521067,4.02745763 L9.18347055,4.00692283 L8.9891247,4 Z"})})]})}),"ReaderMode");ReaderMode.beforeDOMLoaded=readermode_inline_default;ReaderMode.css=readermode_default;var ReaderMode_default=__name((()=>ReaderMode),"default");var DEFAULT_SANS_SERIF='system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',DEFAULT_MONO='"Cascadia Code", "Cascadia Mono", "Courier New", ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace';function getFontSpecificationName(spec){return typeof spec=="string"?spec:spec.name}__name(getFontSpecificationName,"getFontSpecificationName");function formatFontSpecification(type,spec){typeof spec=="string"&&(spec={name:spec});let defaultIncludeWeights=type==="header"?[400,700]:[400,600],defaultIncludeItalic=type==="body",weights=spec.weights??defaultIncludeWeights,italic=spec.includeItalic??defaultIncludeItalic,features=[];if(italic&&features.push("ital"),weights.length>1){let weightSpec=italic?weights.flatMap(w=>[`0,${w}`,`1,${w}`]).sort().join(";"):weights.join(";");features.push(`wght@${weightSpec}`)}return features.length>0?`${spec.name}:${features.join(",")}`:spec.name}__name(formatFontSpecification,"formatFontSpecification");function googleFontHref(theme){let{header,body,code}=theme.typography,headerFont=formatFontSpecification("header",header),bodyFont=formatFontSpecification("body",body),codeFont=formatFontSpecification("code",code);return`https://fonts.googleapis.com/css2?family=${headerFont}&family=${bodyFont}&family=${codeFont}&display=swap`}__name(googleFontHref,"googleFontHref");function googleFontSubsetHref(theme,text){let title=theme.typography.title||theme.typography.header;return`https://fonts.googleapis.com/css2?family=${formatFontSpecification("title",title)}&text=${encodeURIComponent(text)}&display=swap`}__name(googleFontSubsetHref,"googleFontSubsetHref");var fontMimeMap={truetype:"ttf",woff:"woff",woff2:"woff2",opentype:"otf"};async function processGoogleFonts(stylesheet,baseUrl){let fontSourceRegex=/url\((https:\/\/fonts.gstatic.com\/.+(?:\/|(?:kit=))(.+?)[.&].+?)\)\sformat\('(\w+?)'\);/g,fontFiles=[],processedStylesheet=stylesheet,match;for(;(match=fontSourceRegex.exec(stylesheet))!==null;){let url=match[1],filename=match[2],extension=fontMimeMap[match[3].toLowerCase()],staticUrl=`https://${baseUrl}/static/fonts/${filename}.${extension}`;processedStylesheet=processedStylesheet.replace(url,staticUrl),fontFiles.push({url,filename,extension})}return{processedStylesheet,fontFiles}}__name(processGoogleFonts,"processGoogleFonts");function joinStyles(theme,...stylesheet){return`
${stylesheet.join(`

`)}

:root {
  --light: ${theme.colors.lightMode.light};
  --lightgray: ${theme.colors.lightMode.lightgray};
  --gray: ${theme.colors.lightMode.gray};
  --darkgray: ${theme.colors.lightMode.darkgray};
  --dark: ${theme.colors.lightMode.dark};
  --secondary: ${theme.colors.lightMode.secondary};
  --tertiary: ${theme.colors.lightMode.tertiary};
  --highlight: ${theme.colors.lightMode.highlight};
  --textHighlight: ${theme.colors.lightMode.textHighlight};

  --titleFont: "${getFontSpecificationName(theme.typography.title||theme.typography.header)}", ${DEFAULT_SANS_SERIF};
  --headerFont: "${getFontSpecificationName(theme.typography.header)}", ${DEFAULT_SANS_SERIF};
  --bodyFont: "${getFontSpecificationName(theme.typography.body)}", ${DEFAULT_SANS_SERIF};
  --codeFont: "${getFontSpecificationName(theme.typography.code)}", ${DEFAULT_MONO};
}

:root[saved-theme="dark"] {
  --light: ${theme.colors.darkMode.light};
  --lightgray: ${theme.colors.darkMode.lightgray};
  --gray: ${theme.colors.darkMode.gray};
  --darkgray: ${theme.colors.darkMode.darkgray};
  --dark: ${theme.colors.darkMode.dark};
  --secondary: ${theme.colors.darkMode.secondary};
  --tertiary: ${theme.colors.darkMode.tertiary};
  --highlight: ${theme.colors.darkMode.highlight};
  --textHighlight: ${theme.colors.darkMode.textHighlight};
}
`}__name(joinStyles,"joinStyles");import readingTime from"reading-time";import{jsx as jsx16,jsxs as jsxs9}from"preact/jsx-runtime";import sharp from"sharp";import satori from"satori";import path5 from"path";import fs2 from"fs";var write=__name(async({ctx,slug,ext,content})=>{let pathToPage=joinSegments(ctx.argv.output,slug+ext),dir=path5.dirname(pathToPage);return await fs2.promises.mkdir(dir,{recursive:!0}),await fs2.promises.writeFile(pathToPage,content),pathToPage},"write");import{Fragment as Fragment3,jsx as jsx17,jsxs as jsxs10}from"preact/jsx-runtime";var CustomOgImagesEmitterName="CustomOgImages";import{Fragment as Fragment4,jsx as jsx18,jsxs as jsxs11}from"preact/jsx-runtime";var Head_default=__name((()=>__name(({cfg,fileData,externalResources,ctx})=>{let titleSuffix=cfg.pageTitleSuffix??"",title=(fileData.frontmatter?.title??i18n(cfg.locale).propertyDefaults.title)+titleSuffix,description=fileData.frontmatter?.socialDescription??fileData.frontmatter?.description??unescapeHTML(fileData.description?.trim()??i18n(cfg.locale).propertyDefaults.description),{css,js,additionalHead}=externalResources,url=new URL(`https://${cfg.baseUrl??"example.com"}`),path12=url.pathname,baseDir=fileData.slug==="404"?path12:pathToRoot(fileData.slug),iconPath=joinSegments(baseDir,"static/icon.png"),socialUrl=fileData.slug==="404"?url.toString():joinSegments(url.toString(),fileData.slug),usesCustomOgImage=ctx.cfg.plugins.emitters.some(e=>e.name===CustomOgImagesEmitterName),ogImageDefaultPath=`https://${cfg.baseUrl}/static/og-image.png`;return jsxs11("head",{children:[jsx18("title",{children:title}),jsx18("meta",{charSet:"utf-8"}),cfg.theme.cdnCaching&&cfg.theme.fontOrigin==="googleFonts"&&jsxs11(Fragment4,{children:[jsx18("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),jsx18("link",{rel:"preconnect",href:"https://fonts.gstatic.com"}),jsx18("link",{rel:"stylesheet",href:googleFontHref(cfg.theme)}),cfg.theme.typography.title&&jsx18("link",{rel:"stylesheet",href:googleFontSubsetHref(cfg.theme,cfg.pageTitle)})]}),jsx18("link",{rel:"preconnect",href:"https://cdnjs.cloudflare.com",crossOrigin:"anonymous"}),jsx18("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),jsx18("meta",{name:"og:site_name",content:cfg.pageTitle}),jsx18("meta",{property:"og:title",content:title}),jsx18("meta",{property:"og:type",content:"website"}),jsx18("meta",{name:"twitter:card",content:"summary_large_image"}),jsx18("meta",{name:"twitter:title",content:title}),jsx18("meta",{name:"twitter:description",content:description}),jsx18("meta",{property:"og:description",content:description}),jsx18("meta",{property:"og:image:alt",content:description}),!usesCustomOgImage&&jsxs11(Fragment4,{children:[jsx18("meta",{property:"og:image",content:ogImageDefaultPath}),jsx18("meta",{property:"og:image:url",content:ogImageDefaultPath}),jsx18("meta",{name:"twitter:image",content:ogImageDefaultPath}),jsx18("meta",{property:"og:image:type",content:`image/${getFileExtension(ogImageDefaultPath)??"png"}`})]}),cfg.baseUrl&&jsxs11(Fragment4,{children:[jsx18("meta",{property:"twitter:domain",content:cfg.baseUrl}),jsx18("meta",{property:"og:url",content:socialUrl}),jsx18("meta",{property:"twitter:url",content:socialUrl})]}),jsx18("link",{rel:"icon",href:iconPath}),jsx18("meta",{name:"description",content:description}),jsx18("meta",{name:"generator",content:"Quartz"}),css.map(resource=>CSSResourceToStyleElement(resource,!0)),js.filter(resource=>resource.loadTime==="beforeDOMReady").map(res=>JSResourceToScriptElement(res,!0)),additionalHead.map(resource=>typeof resource=="function"?resource(fileData):resource)]})},"Head")),"default");import{jsx as jsx19}from"preact/jsx-runtime";var PageTitle=__name(({fileData,cfg,displayClass})=>{let title=cfg?.pageTitle??i18n(cfg.locale).propertyDefaults.title,baseDir=pathToRoot(fileData.slug);return jsx19("h2",{class:classNames(displayClass,"page-title"),children:jsx19("a",{href:baseDir,children:title})})},"PageTitle");PageTitle.css=`
.page-title {
  font-size: 1.1rem;
  margin: 0;
  font-family: var(--titleFont);
  font-weight: 700;
}

.page-title a {
  color: var(--secondary) !important;
  font-weight: 700;
}

.page-title a:hover {
  color: var(--tertiary) !important;
}
`;var PageTitle_default=__name((()=>PageTitle),"default");import readingTime2 from"reading-time";import{jsx as jsx20}from"preact/jsx-runtime";import{jsx as jsx21}from"preact/jsx-runtime";function Spacer({displayClass}){return jsx21("div",{class:classNames(displayClass,"spacer")})}__name(Spacer,"Spacer");var Spacer_default=__name((()=>Spacer),"default");import{jsx as jsx22,jsxs as jsxs12}from"preact/jsx-runtime";var OverflowList=__name(({children,...props})=>jsxs12("ul",{...props,class:[props.class,"overflow"].filter(Boolean).join(" "),id:props.id,children:[children,jsx22("li",{class:"overflow-end"})]}),"OverflowList"),numLists=0,OverflowList_default=__name(()=>{let id=`list-${numLists++}`;return{OverflowList:__name(props=>jsx22(OverflowList,{...props,id}),"OverflowList"),overflowListAfterDOMLoaded:`
document.addEventListener("nav", (e) => {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const parentUl = entry.target.parentElement
      if (!parentUl) return
      if (entry.isIntersecting) {
        parentUl.classList.remove("gradient-active")
      } else {
        parentUl.classList.add("gradient-active")
      }
    }
  })

  const ul = document.getElementById("${id}")
  if (!ul) return

  const end = ul.querySelector(".overflow-end")
  if (!end) return

  observer.observe(end)
  window.addCleanup(() => observer.disconnect())
})
`}},"default");import{jsx as jsx23,jsxs as jsxs13}from"preact/jsx-runtime";var explorer_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
@media all and ((max-width: 800px)) {
  .page > #quartz-body > :not(.sidebar.left:has(.explorer)) {
    transition: transform 300ms ease-in-out;
  }
  .page > #quartz-body.lock-scroll > :not(.sidebar.left:has(.explorer)) {
    transform: translateX(100dvw);
    transition: transform 300ms ease-in-out;
  }
  .page > #quartz-body .sidebar.left:has(.explorer) {
    box-sizing: border-box;
    position: sticky;
    background-color: var(--light);
    padding: 1rem 0 1rem 0;
    margin: 0;
  }
  .page > #quartz-body .hide-until-loaded ~ .explorer-content {
    display: none;
  }
}
.explorer {
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  min-height: 1.2rem;
  flex: 0 1 auto;
}
.explorer.collapsed {
  flex: 0 1 1.2rem;
}
.explorer.collapsed .fold {
  transform: rotateZ(-90deg);
}
.explorer .fold {
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  opacity: 0.8;
}
@media all and ((max-width: 800px)) {
  .explorer {
    order: -1;
    height: initial;
    overflow: hidden;
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: auto;
    margin-bottom: auto;
  }
}
.explorer button.mobile-explorer {
  display: none;
}
.explorer button.desktop-explorer {
  display: flex;
}
@media all and ((max-width: 800px)) {
  .explorer button.mobile-explorer {
    display: flex;
  }
  .explorer button.desktop-explorer {
    display: none;
  }
}
@media all and not ((max-width: 800px)) {
  .explorer.desktop-only {
    display: flex;
  }
}
.explorer svg {
  pointer-events: all;
  transition: transform 0.35s ease;
}
.explorer svg > polyline {
  pointer-events: none;
}

button.mobile-explorer,
button.desktop-explorer {
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  padding: 0;
  color: var(--dark);
  display: flex;
  align-items: center;
}
button.mobile-explorer h2,
button.desktop-explorer h2 {
  font-size: 0.875rem;
  display: inline-block;
  margin: 0;
}

.explorer-content {
  list-style: none;
  overflow: hidden;
  overflow-y: auto;
  margin-top: 0.5rem;
}
.explorer-content ul {
  list-style: none;
  margin: 0;
  padding: 0;
  overscroll-behavior: contain;
}
.explorer-content ul li > a {
  color: #1a1a1a !important;
  opacity: 1 !important;
  pointer-events: all;
  background-color: transparent !important;
  text-decoration: none !important;
}
.explorer-content ul li > a.active {
  opacity: 1;
  color: var(--tertiary) !important;
}
.explorer-content .folder-outer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-in-out;
}
.explorer-content .folder-outer.open {
  grid-template-rows: 1fr;
}
.explorer-content .folder-outer > ul {
  overflow: hidden;
  margin-left: 6px;
  padding-left: 0.8rem;
  border-left: 1px solid var(--lightgray);
}

.folder-container {
  flex-direction: row;
  display: flex;
  align-items: center;
  user-select: none;
}
.folder-container div > a {
  color: var(--darkgray) !important;
  font-family: var(--headerFont);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5rem;
  display: inline-block;
  background-color: transparent !important;
  text-decoration: none !important;
}
.folder-container div > a:hover {
  color: var(--tertiary) !important;
}
.folder-container div > button {
  color: var(--dark);
  background-color: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  padding-left: 0;
  padding-right: 0;
  display: flex;
  align-items: center;
  font-family: var(--headerFont);
}
.folder-container div > button span {
  font-size: 0.875rem;
  display: inline-block;
  color: var(--darkgray) !important;
  font-weight: 600;
  margin: 0;
  line-height: 1.5rem;
  pointer-events: none;
}

.folder-icon {
  margin-right: 5px;
  color: var(--secondary);
  cursor: pointer;
  transition: transform 0.3s ease;
  backface-visibility: visible;
  flex-shrink: 0;
}

li:has(> .folder-outer:not(.open)) > .folder-container > svg {
  transform: rotate(-90deg);
}

.folder-icon:hover {
  color: var(--tertiary);
}

@media all and ((max-width: 800px)) {
  .explorer.collapsed {
    flex: 0 0 34px;
  }
  .explorer.collapsed > .explorer-content {
    transform: translateX(-100vw);
    visibility: hidden;
  }
  .explorer:not(.collapsed) {
    flex: 0 0 34px;
  }
  .explorer:not(.collapsed) > .explorer-content {
    transform: translateX(0);
    visibility: visible;
  }
  .explorer .explorer-content {
    box-sizing: border-box;
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 0;
    background-color: var(--light);
    max-width: 100vw;
    width: 100vw;
    transform: translateX(-100vw);
    transition: transform 200ms ease, visibility 200ms ease;
    overflow: hidden;
    padding: 4rem 0 2rem 0;
    height: 100dvh;
    max-height: 100dvh;
    visibility: hidden;
  }
  .explorer .mobile-explorer {
    margin: 0;
    padding: 5px;
    z-index: 101;
  }
  .explorer .mobile-explorer .lucide-menu {
    stroke: var(--darkgray);
  }
}

@media all and ((max-width: 800px)) {
  .mobile-no-scroll {
    overscroll-behavior: none;
  }
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbIi4uXFwuLlxcc3R5bGVzXFx2YXJpYWJsZXMuc2NzcyIsImV4cGxvcmVyLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUNBQTtFQUdJO0lBQ0U7O0VBRUY7SUFDRTtJQUNBOztFQUlGO0lBQ0U7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7RUFHRjtJQUNFOzs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUVBO0VBQ0E7O0FBQ0E7RUFDRTs7QUFDQTtFQUNFOztBQUlKO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBcEJGO0lBcUJJO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOzs7QUFHRjtFQUNFOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtJQUNFOztFQUdGO0lBQ0U7OztBQUtGO0VBREY7SUFFSTs7O0FBSUo7RUFDRTtFQUNBOztBQUVBO0VBQ0U7OztBQUtOO0FBQUE7RUFFRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0FBQUE7RUFDRTtFQUNBO0VBQ0E7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUtOO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBLGFEOUlhO0VDK0liO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTtFQUNBLGFEektXO0VDMEtYO0VBQ0E7RUFDQTs7O0FBS047RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7OztBQUdGO0VBQ0U7OztBQUlBO0VBQ0U7SUFDRTs7RUFFQTtJQUNFO0lBQ0E7O0VBSUo7SUFDRTs7RUFFQTtJQUNFO0lBQ0E7O0VBSUo7SUFDRTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFlBQ0U7SUFFRjtJQUNBO0lBQ0E7SUFDQTtJQUNBOztFQUdGO0lBQ0U7SUFDQTtJQUNBOztFQUVBO0lBQ0U7Ozs7QUFPTjtFQURGO0lBRUkiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwic2FzczptYXBcIjtcblxuLyoqXG4gKiBMYXlvdXQgYnJlYWtwb2ludHNcbiAqICRtb2JpbGU6IHNjcmVlbiB3aWR0aCBiZWxvdyB0aGlzIHZhbHVlIHdpbGwgdXNlIG1vYmlsZSBzdHlsZXNcbiAqICRkZXNrdG9wOiBzY3JlZW4gd2lkdGggYWJvdmUgdGhpcyB2YWx1ZSB3aWxsIHVzZSBkZXNrdG9wIHN0eWxlc1xuICogU2NyZWVuIHdpZHRoIGJldHdlZW4gJG1vYmlsZSBhbmQgJGRlc2t0b3Agd2lkdGggd2lsbCB1c2UgdGhlIHRhYmxldCBsYXlvdXQuXG4gKiBhc3N1bWluZyBtb2JpbGUgPCBkZXNrdG9wXG4gKi9cbiRicmVha3BvaW50czogKFxuICBtb2JpbGU6IDgwMHB4LFxuICBkZXNrdG9wOiAxMjAwcHgsXG4pO1xuXG4kbW9iaWxlOiBcIihtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KVwiO1xuJHRhYmxldDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSkgYW5kIChtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcbiRkZXNrdG9wOiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcblxuJHBhZ2VXaWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX07XG4kc2lkZVBhbmVsV2lkdGg6IDMyMHB4OyAvLzM4MHB4O1xuJHRvcFNwYWNpbmc6IDZyZW07XG4kYm9sZFdlaWdodDogNzAwO1xuJHNlbWlCb2xkV2VpZ2h0OiA2MDA7XG4kbm9ybWFsV2VpZ2h0OiA0MDA7XG5cbiRtb2JpbGVHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcImF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnRcIlxcXG4gICAgICBcImdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLWZvb3RlclwiJyxcbik7XG4kdGFibGV0R3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyXCInLFxuKTtcbiRkZXNrdG9wR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvICN7JHNpZGVQYW5lbFdpZHRofVwiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCInLFxuKTtcbiIsIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuXG5AbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAucGFnZSA+ICNxdWFydHotYm9keSB7XG4gICAgLy8gU2hpZnQgcGFnZSBwb3NpdGlvbiB3aGVuIHRvZ2dsaW5nIEV4cGxvcmVyIG9uIG1vYmlsZS5cbiAgICAmID4gOm5vdCguc2lkZWJhci5sZWZ0OmhhcyguZXhwbG9yZXIpKSB7XG4gICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMzAwbXMgZWFzZS1pbi1vdXQ7XG4gICAgfVxuICAgICYubG9jay1zY3JvbGwgPiA6bm90KC5zaWRlYmFyLmxlZnQ6aGFzKC5leHBsb3JlcikpIHtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDBkdncpO1xuICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDMwMG1zIGVhc2UtaW4tb3V0O1xuICAgIH1cblxuICAgIC8vIFN0aWNreSB0b3AgYmFyIChzdGF5cyBpbiBwbGFjZSB3aGVuIHNjcm9sbGluZyBkb3duIG9uIG1vYmlsZSkuXG4gICAgLnNpZGViYXIubGVmdDpoYXMoLmV4cGxvcmVyKSB7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgcG9zaXRpb246IHN0aWNreTtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0KTtcbiAgICAgIHBhZGRpbmc6IDFyZW0gMCAxcmVtIDA7XG4gICAgICBtYXJnaW46IDA7XG4gICAgfVxuXG4gICAgLmhpZGUtdW50aWwtbG9hZGVkIH4gLmV4cGxvcmVyLWNvbnRlbnQge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gIH1cbn1cblxuLmV4cGxvcmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgb3ZlcmZsb3cteTogaGlkZGVuO1xuXG4gIG1pbi1oZWlnaHQ6IDEuMnJlbTtcbiAgZmxleDogMCAxIGF1dG87XG4gICYuY29sbGFwc2VkIHtcbiAgICBmbGV4OiAwIDEgMS4ycmVtO1xuICAgICYgLmZvbGQge1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGVaKC05MGRlZyk7XG4gICAgfVxuICB9XG5cbiAgJiAuZm9sZCB7XG4gICAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO1xuICAgIG9wYWNpdHk6IDAuODtcbiAgfVxuXG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgb3JkZXI6IC0xO1xuICAgIGhlaWdodDogaW5pdGlhbDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgIGFsaWduLXNlbGY6IGZsZXgtc3RhcnQ7XG4gICAgbWFyZ2luLXRvcDogYXV0bztcbiAgICBtYXJnaW4tYm90dG9tOiBhdXRvO1xuICB9XG5cbiAgYnV0dG9uLm1vYmlsZS1leHBsb3JlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuXG4gIGJ1dHRvbi5kZXNrdG9wLWV4cGxvcmVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICB9XG5cbiAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICBidXR0b24ubW9iaWxlLWV4cGxvcmVyIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuXG4gICAgYnV0dG9uLmRlc2t0b3AtZXhwbG9yZXIge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gIH1cblxuICAmLmRlc2t0b3Atb25seSB7XG4gICAgQG1lZGlhIGFsbCBhbmQgbm90ICgkbW9iaWxlKSB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgIH1cbiAgfVxuXG4gIHN2ZyB7XG4gICAgcG9pbnRlci1ldmVudHM6IGFsbDtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zNXMgZWFzZTtcblxuICAgICYgPiBwb2x5bGluZSB7XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB9XG4gIH1cbn1cblxuYnV0dG9uLm1vYmlsZS1leHBsb3JlcixcbmJ1dHRvbi5kZXNrdG9wLWV4cGxvcmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogbm9uZTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAwO1xuICBjb2xvcjogdmFyKC0tZGFyayk7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgJiBoMiB7XG4gICAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgbWFyZ2luOiAwO1xuICB9XG59XG5cbi5leHBsb3Jlci1jb250ZW50IHtcbiAgbGlzdC1zdHlsZTogbm9uZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xuXG4gICYgdWwge1xuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgb3ZlcnNjcm9sbC1iZWhhdmlvcjogY29udGFpbjtcblxuICAgICYgbGkgPiBhIHtcbiAgICAgIGNvbG9yOiAjMWExYTFhICFpbXBvcnRhbnQ7XG4gICAgICBvcGFjaXR5OiAxICFpbXBvcnRhbnQ7XG4gICAgICBwb2ludGVyLWV2ZW50czogYWxsO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZSAhaW1wb3J0YW50O1xuXG4gICAgICAmLmFjdGl2ZSB7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgIGNvbG9yOiB2YXIoLS10ZXJ0aWFyeSkgIWltcG9ydGFudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAuZm9sZGVyLW91dGVyIHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtcm93czogMGZyO1xuICAgIHRyYW5zaXRpb246IGdyaWQtdGVtcGxhdGUtcm93cyAwLjNzIGVhc2UtaW4tb3V0O1xuICB9XG5cbiAgLmZvbGRlci1vdXRlci5vcGVuIHtcbiAgICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmcjtcbiAgfVxuXG4gIC5mb2xkZXItb3V0ZXIgPiB1bCB7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBtYXJnaW4tbGVmdDogNnB4O1xuICAgIHBhZGRpbmctbGVmdDogMC44cmVtO1xuICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgfVxufVxuXG4uZm9sZGVyLWNvbnRhaW5lciB7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuXG4gICYgZGl2ID4gYSB7XG4gICAgY29sb3I6IHZhcigtLWRhcmtncmF5KSAhaW1wb3J0YW50O1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1oZWFkZXJGb250KTtcbiAgICBmb250LXNpemU6IDAuODc1cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiAkc2VtaUJvbGRXZWlnaHQ7XG4gICAgbGluZS1oZWlnaHQ6IDEuNXJlbTtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDtcbiAgfVxuXG4gICYgZGl2ID4gYTpob3ZlciB7XG4gICAgY29sb3I6IHZhcigtLXRlcnRpYXJ5KSAhaW1wb3J0YW50O1xuICB9XG5cbiAgJiBkaXYgPiBidXR0b24ge1xuICAgIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1oZWFkZXJGb250KTtcblxuICAgICYgc3BhbiB7XG4gICAgICBmb250LXNpemU6IDAuODc1cmVtO1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgY29sb3I6IHZhcigtLWRhcmtncmF5KSAhaW1wb3J0YW50O1xuICAgICAgZm9udC13ZWlnaHQ6ICRzZW1pQm9sZFdlaWdodDtcbiAgICAgIG1hcmdpbjogMDtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxLjVyZW07XG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB9XG4gIH1cbn1cblxuLmZvbGRlci1pY29uIHtcbiAgbWFyZ2luLXJpZ2h0OiA1cHg7XG4gIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XG4gIGJhY2tmYWNlLXZpc2liaWxpdHk6IHZpc2libGU7XG4gIGZsZXgtc2hyaW5rOiAwO1xufVxuXG5saTpoYXMoPiAuZm9sZGVyLW91dGVyOm5vdCgub3BlbikpID4gLmZvbGRlci1jb250YWluZXIgPiBzdmcge1xuICB0cmFuc2Zvcm06IHJvdGF0ZSgtOTBkZWcpO1xufVxuXG4uZm9sZGVyLWljb246aG92ZXIge1xuICBjb2xvcjogdmFyKC0tdGVydGlhcnkpO1xufVxuXG4uZXhwbG9yZXIge1xuICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICYuY29sbGFwc2VkIHtcbiAgICAgIGZsZXg6IDAgMCAzNHB4O1xuXG4gICAgICAmID4gLmV4cGxvcmVyLWNvbnRlbnQge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTEwMHZ3KTtcbiAgICAgICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgICAgfVxuICAgIH1cblxuICAgICY6bm90KC5jb2xsYXBzZWQpIHtcbiAgICAgIGZsZXg6IDAgMCAzNHB4O1xuXG4gICAgICAmID4gLmV4cGxvcmVyLWNvbnRlbnQge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7XG4gICAgICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLmV4cGxvcmVyLWNvbnRlbnQge1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIHotaW5kZXg6IDEwMDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogMDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICBtYXJnaW4tdG9wOiAwO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbGlnaHQpO1xuICAgICAgbWF4LXdpZHRoOiAxMDB2dztcbiAgICAgIHdpZHRoOiAxMDB2dztcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwdncpO1xuICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgdHJhbnNmb3JtIDIwMG1zIGVhc2UsXG4gICAgICAgIHZpc2liaWxpdHkgMjAwbXMgZWFzZTtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICBwYWRkaW5nOiA0cmVtIDAgMnJlbSAwO1xuICAgICAgaGVpZ2h0OiAxMDBkdmg7XG4gICAgICBtYXgtaGVpZ2h0OiAxMDBkdmg7XG4gICAgICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gICAgfVxuXG4gICAgLm1vYmlsZS1leHBsb3JlciB7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICBwYWRkaW5nOiA1cHg7XG4gICAgICB6LWluZGV4OiAxMDE7XG5cbiAgICAgIC5sdWNpZGUtbWVudSB7XG4gICAgICAgIHN0cm9rZTogdmFyKC0tZGFya2dyYXkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4ubW9iaWxlLW5vLXNjcm9sbCB7XG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgb3ZlcnNjcm9sbC1iZWhhdmlvcjogbm9uZTtcbiAgfVxufVxuIl19 */`;var explorer_inline_default=`var M=Object.create;var y=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var j=Object.getOwnPropertyNames;var k=Object.getPrototypeOf,P=Object.prototype.hasOwnProperty;var U=(e,u)=>()=>(u||e((u={exports:{}}).exports,u),u.exports);var q=(e,u,t,F)=>{if(u&&typeof u=="object"||typeof u=="function")for(let n of j(u))!P.call(e,n)&&n!==t&&y(e,n,{get:()=>u[n],enumerable:!(F=R(u,n))||F.enumerable});return e};var I=(e,u,t)=>(t=e!=null?M(k(e)):{},q(u||!e||!e.__esModule?y(t,"default",{value:e,enumerable:!0}):t,e));var b=U((tu,T)=>{"use strict";T.exports=W;function g(e){return e instanceof Buffer?Buffer.from(e):new e.constructor(e.buffer.slice(),e.byteOffset,e.length)}function W(e){if(e=e||{},e.circles)return _(e);let u=new Map;if(u.set(Date,l=>new Date(l)),u.set(Map,(l,o)=>new Map(F(Array.from(l),o))),u.set(Set,(l,o)=>new Set(F(Array.from(l),o))),e.constructorHandlers)for(let l of e.constructorHandlers)u.set(l[0],l[1]);let t=null;return e.proto?c:n;function F(l,o){let D=Object.keys(l),r=new Array(D.length);for(let i=0;i<D.length;i++){let s=D[i],a=l[s];typeof a!="object"||a===null?r[s]=a:a.constructor!==Object&&(t=u.get(a.constructor))?r[s]=t(a,o):ArrayBuffer.isView(a)?r[s]=g(a):r[s]=o(a)}return r}function n(l){if(typeof l!="object"||l===null)return l;if(Array.isArray(l))return F(l,n);if(l.constructor!==Object&&(t=u.get(l.constructor)))return t(l,n);let o={};for(let D in l){if(Object.hasOwnProperty.call(l,D)===!1)continue;let r=l[D];typeof r!="object"||r===null?o[D]=r:r.constructor!==Object&&(t=u.get(r.constructor))?o[D]=t(r,n):ArrayBuffer.isView(r)?o[D]=g(r):o[D]=n(r)}return o}function c(l){if(typeof l!="object"||l===null)return l;if(Array.isArray(l))return F(l,c);if(l.constructor!==Object&&(t=u.get(l.constructor)))return t(l,c);let o={};for(let D in l){let r=l[D];typeof r!="object"||r===null?o[D]=r:r.constructor!==Object&&(t=u.get(r.constructor))?o[D]=t(r,c):ArrayBuffer.isView(r)?o[D]=g(r):o[D]=c(r)}return o}}function _(e){let u=[],t=[],F=new Map;if(F.set(Date,D=>new Date(D)),F.set(Map,(D,r)=>new Map(c(Array.from(D),r))),F.set(Set,(D,r)=>new Set(c(Array.from(D),r))),e.constructorHandlers)for(let D of e.constructorHandlers)F.set(D[0],D[1]);let n=null;return e.proto?o:l;function c(D,r){let i=Object.keys(D),s=new Array(i.length);for(let a=0;a<i.length;a++){let f=i[a],E=D[f];if(typeof E!="object"||E===null)s[f]=E;else if(E.constructor!==Object&&(n=F.get(E.constructor)))s[f]=n(E,r);else if(ArrayBuffer.isView(E))s[f]=g(E);else{let d=u.indexOf(E);d!==-1?s[f]=t[d]:s[f]=r(E)}}return s}function l(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return c(D,l);if(D.constructor!==Object&&(n=F.get(D.constructor)))return n(D,l);let r={};u.push(D),t.push(r);for(let i in D){if(Object.hasOwnProperty.call(D,i)===!1)continue;let s=D[i];if(typeof s!="object"||s===null)r[i]=s;else if(s.constructor!==Object&&(n=F.get(s.constructor)))r[i]=n(s,l);else if(ArrayBuffer.isView(s))r[i]=g(s);else{let a=u.indexOf(s);a!==-1?r[i]=t[a]:r[i]=l(s)}}return u.pop(),t.pop(),r}function o(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return c(D,o);if(D.constructor!==Object&&(n=F.get(D.constructor)))return n(D,o);let r={};u.push(D),t.push(r);for(let i in D){let s=D[i];if(typeof s!="object"||s===null)r[i]=s;else if(s.constructor!==Object&&(n=F.get(s.constructor)))r[i]=n(s,o);else if(ArrayBuffer.isView(s))r[i]=g(s);else{let a=u.indexOf(s);a!==-1?r[i]=t[a]:r[i]=o(s)}}return u.pop(),t.pop(),r}}});var uu=Object.hasOwnProperty;var L=I(b(),1),V=(0,L.default)();function S(e){let u=v(J(e,"index"),!0);return u.length===0?"/":u}function $(e){let u=e.split("/").filter(t=>t!=="").slice(0,-1).map(t=>"..").join("/");return u.length===0&&(u="."),u}function x(e,u){return B($(e),S(u))}function B(...e){if(e.length===0)return"";let u=e.filter(t=>t!==""&&t!=="/").map(t=>v(t)).join("/");return e[0].startsWith("/")&&(u="/"+u),e[e.length-1].endsWith("/")&&(u=u+"/"),u}function z(e,u){return e===u||e.endsWith("/"+u)}function J(e,u){return z(e,u)&&(e=e.slice(0,-u.length)),e}function v(e,u){return e.startsWith("/")&&(e=e.substring(1)),!u&&e.endsWith("/")&&(e=e.slice(0,-1)),e}var m=class e{isFolder;children;slugSegments;fileSegmentHint;displayNameOverride;data;constructor(u,t){this.children=[],this.slugSegments=u,this.data=t??null,this.isFolder=!1,this.displayNameOverride=void 0}get displayName(){let u=this.data?.title==="index"?void 0:this.data?.title;return this.displayNameOverride??u??this.fileSegmentHint??this.slugSegment??""}set displayName(u){this.displayNameOverride=u}get slug(){let u=B(...this.slugSegments);return this.isFolder?B(u,"index"):u}get slugSegment(){return this.slugSegments[this.slugSegments.length-1]}makeChild(u,t){let F=[...this.slugSegments,u[0]],n=new e(F,t);return this.children.push(n),n}insert(u,t){if(u.length===0)throw new Error("path is empty");this.isFolder=!0;let F=u[0];if(u.length===1)F==="index"?this.data??=t:this.makeChild(u,t);else if(u.length>1){let n=this.children.find(l=>l.slugSegment===F)??this.makeChild(u,void 0),c=t.filePath.split("/");n.fileSegmentHint=c.at(-u.length),n.insert(u.slice(1),t)}}add(u){this.insert(u.slug.split("/"),u)}findNode(u){return u.length===0||u.length===1&&u[0]==="index"?this:this.children.find(t=>t.slugSegment===u[0])?.findNode(u.slice(1))}ancestryChain(u){if(u.length===0||u.length===1&&u[0]==="index")return[this];let t=this.children.find(n=>n.slugSegment===u[0]);if(!t)return;let F=t.ancestryChain(u.slice(1));if(F)return[this,...F]}filter(u){this.children=this.children.filter(u),this.children.forEach(t=>t.filter(u))}map(u){u(this),this.children.forEach(t=>t.map(u))}sort(u){this.children=this.children.sort(u),this.children.forEach(t=>t.sort(u))}static fromEntries(u){let t=new e([]);return u.forEach(([,F])=>t.add(F)),t}entries(){let u=t=>[[t.slug,t]].concat(...t.children.map(u));return u(this)}getFolderPaths(){return this.entries().filter(([u,t])=>t.isFolder).map(([u,t])=>u)}};var p;function w(){let e=this.closest(".explorer");if(!e)return;let u=e.classList.toggle("collapsed");e.setAttribute("aria-expanded",e.getAttribute("aria-expanded")==="true"?"false":"true"),u?document.documentElement.classList.remove("mobile-no-scroll"):document.documentElement.classList.add("mobile-no-scroll")}function h(e){e.stopPropagation();let u=e.target;if(!u)return;let F=u.nodeName==="svg"?u.parentElement:u.parentElement?.parentElement;if(!F)return;let n=F.nextElementSibling;if(!n)return;n.classList.toggle("open");let c=!n.classList.contains("open");Q(n,c);let l=p.find(D=>D.path===F.dataset.folderpath);l?l.collapsed=c:p.push({path:F.dataset.folderpath,collapsed:c});let o=JSON.stringify(p);localStorage.setItem("fileTree",o)}function N(e,u){let n=document.getElementById("template-file").content.cloneNode(!0).querySelector("li"),c=n.querySelector("a");return c.href=x(e,u.slug),c.dataset.for=u.slug,c.textContent=u.displayName,e===u.slug&&c.classList.add("active"),n}function H(e,u,t){let c=document.getElementById("template-folder").content.cloneNode(!0).querySelector("li"),l=c.querySelector(".folder-container"),o=l.querySelector("div"),D=c.querySelector(".folder-outer"),r=D.querySelector("ul"),i=u.slug;if(l.dataset.folderpath=i,t.folderClickBehavior==="link"){let E=o.querySelector(".folder-button"),d=document.createElement("a");d.href=x(e,i),d.dataset.for=i,d.className="folder-title",d.textContent=u.displayName,E.replaceWith(d)}else{let E=o.querySelector(".folder-title");E.textContent=u.displayName}let s=p.find(E=>E.path===i)?.collapsed??t.folderDefaultState==="collapsed",a=S(i),f=a===e.slice(0,a.length);(!s||f)&&D.classList.add("open");for(let E of u.children){let d=E.isFolder?H(e,E,t):N(e,E);r.appendChild(d)}return c}async function Z(e){let u=document.querySelectorAll("div.explorer");for(let t of u){let F=JSON.parse(t.dataset.dataFns||"{}"),n={folderClickBehavior:t.dataset.behavior||"collapse",folderDefaultState:t.dataset.collapsed||"collapsed",useSavedState:t.dataset.savestate==="true",order:F.order||["filter","map","sort"],sortFn:new Function("return "+(F.sortFn||"undefined"))(),filterFn:new Function("return "+(F.filterFn||"undefined"))(),mapFn:new Function("return "+(F.mapFn||"undefined"))()},c=localStorage.getItem("fileTree"),l=c&&n.useSavedState?JSON.parse(c):[],o=new Map(l.map(C=>[C.path,C.collapsed])),D=await fetchData,r=[...Object.entries(D)],i=m.fromEntries(r);for(let C of n.order)switch(C){case"filter":n.filterFn&&i.filter(n.filterFn);break;case"map":n.mapFn&&i.map(n.mapFn);break;case"sort":n.sortFn&&i.sort(n.sortFn);break}p=i.getFolderPaths().map(C=>{let A=o.get(C);return{path:C,collapsed:A===void 0?n.folderDefaultState==="collapsed":A}});let a=t.querySelector(".explorer-ul");if(!a)continue;let f=document.createDocumentFragment();for(let C of i.children){let A=C.isFolder?H(e,C,n):N(e,C);f.appendChild(A)}a.insertBefore(f,a.firstChild);let E=sessionStorage.getItem("explorerScrollTop");if(E)a.scrollTop=parseInt(E);else{let C=a.querySelector(".active");C&&C.scrollIntoView({behavior:"smooth"})}let d=t.getElementsByClassName("explorer-toggle");for(let C of d)C.addEventListener("click",w),window.addCleanup(()=>C.removeEventListener("click",w));if(n.folderClickBehavior==="collapse"){let C=t.getElementsByClassName("folder-button");for(let A of C)A.addEventListener("click",h),window.addCleanup(()=>A.removeEventListener("click",h))}let O=t.getElementsByClassName("folder-icon");for(let C of O)C.addEventListener("click",h),window.addCleanup(()=>C.removeEventListener("click",h))}}document.addEventListener("prenav",async()=>{let e=document.querySelector(".explorer-ul");e&&sessionStorage.setItem("explorerScrollTop",e.scrollTop.toString())});document.addEventListener("nav",async e=>{let u=e.detail.url;await Z(u);for(let t of document.getElementsByClassName("explorer")){let F=t.querySelector(".mobile-explorer");if(!F)return;F.checkVisibility()&&(t.classList.add("collapsed"),t.setAttribute("aria-expanded","false"),document.documentElement.classList.remove("mobile-no-scroll")),F.classList.remove("hide-until-loaded")}});window.addEventListener("resize",function(){let e=document.querySelector(".explorer");if(e&&!e.classList.contains("collapsed")){document.documentElement.classList.add("mobile-no-scroll");return}});function Q(e,u){return u?e.classList.remove("open"):e.classList.add("open")}
`;import{jsx as jsx24,jsxs as jsxs14}from"preact/jsx-runtime";var defaultOptions11={folderDefaultState:"collapsed",folderClickBehavior:"link",useSavedState:!0,mapFn:__name(node=>node,"mapFn"),sortFn:__name((a,b)=>!a.isFolder&&!b.isFolder||a.isFolder&&b.isFolder?a.displayName.localeCompare(b.displayName,void 0,{numeric:!0,sensitivity:"base"}):!a.isFolder&&b.isFolder?1:-1,"sortFn"),filterFn:__name(node=>node.slugSegment!=="tags","filterFn"),order:["filter","map","sort"]},numExplorers=0,Explorer_default=__name((userOpts=>{let opts={...defaultOptions11,...userOpts},{OverflowList:OverflowList2,overflowListAfterDOMLoaded}=OverflowList_default(),Explorer=__name(({cfg,displayClass})=>{let id=`explorer-${numExplorers++}`;return jsxs14("div",{class:classNames(displayClass,"explorer"),"data-behavior":opts.folderClickBehavior,"data-collapsed":opts.folderDefaultState,"data-savestate":opts.useSavedState,"data-data-fns":JSON.stringify({order:opts.order,sortFn:opts.sortFn.toString(),filterFn:opts.filterFn.toString(),mapFn:opts.mapFn.toString()}),children:[jsx24("button",{type:"button",class:"explorer-toggle mobile-explorer hide-until-loaded","data-mobile":!0,"aria-controls":id,children:jsxs14("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"lucide-menu",children:[jsx24("line",{x1:"4",x2:"20",y1:"12",y2:"12"}),jsx24("line",{x1:"4",x2:"20",y1:"6",y2:"6"}),jsx24("line",{x1:"4",x2:"20",y1:"18",y2:"18"})]})}),jsxs14("button",{type:"button",class:"title-button explorer-toggle desktop-explorer","data-mobile":!1,"aria-expanded":!0,children:[jsx24("h2",{children:opts.title??i18n(cfg.locale).components.explorer.title}),jsx24("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"5 8 14 8",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"fold",children:jsx24("polyline",{points:"6 9 12 15 18 9"})})]}),jsx24("div",{id,class:"explorer-content","aria-expanded":!1,role:"group",children:jsx24(OverflowList2,{class:"explorer-ul"})}),jsx24("template",{id:"template-file",children:jsx24("li",{children:jsx24("a",{href:"#"})})}),jsx24("template",{id:"template-folder",children:jsxs14("li",{children:[jsxs14("div",{class:"folder-container",children:[jsx24("svg",{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"12",viewBox:"5 8 14 8",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round",class:"folder-icon",children:jsx24("polyline",{points:"6 9 12 15 18 9"})}),jsx24("div",{children:jsx24("button",{class:"folder-button",children:jsx24("span",{class:"folder-title"})})})]}),jsx24("div",{class:"folder-outer",children:jsx24("ul",{class:"content"})})]})})]})},"Explorer");return Explorer.css=explorer_default,Explorer.afterDOMLoaded=concatenateResources(explorer_inline_default,overflowListAfterDOMLoaded),Explorer}),"default");import{jsx as jsx25}from"preact/jsx-runtime";var TagList=__name(({fileData,displayClass})=>{let tags=fileData.frontmatter?.tags;return tags&&tags.length>0?jsx25("ul",{class:classNames(displayClass,"tags"),children:tags.map(tag=>{let linkDest=resolveRelative(fileData.slug,`tags/${tag}`);return jsx25("li",{children:jsx25("a",{href:linkDest,class:"internal tag-link",children:tag})})})}):null},"TagList");TagList.css=`
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.section-li > .section > .tags {
  justify-content: flex-end;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`;var TagList_default=__name((()=>TagList),"default");import{jsx as jsx26,jsxs as jsxs15}from"preact/jsx-runtime";var backlinks_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
.backlinks {
  flex-direction: column;
}
.backlinks > h3 {
  font-size: 1rem;
  margin: 0;
}
.backlinks > ul.overflow {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  max-height: calc(100% - 2rem);
  overscroll-behavior: contain;
}
.backlinks > ul.overflow > li {
  margin-bottom: 0.3rem;
}
.backlinks > ul.overflow > li > a {
  background-color: transparent;
  line-height: 1.2;
  display: inline-block;
}
@media all and ((max-width: 800px)) {
  .backlinks {
    max-height: none !important;
    height: auto !important;
  }
  .backlinks > ul.overflow {
    max-height: none !important;
    overflow: visible !important;
    overflow-y: visible !important;
    overscroll-behavior: auto;
    height: auto !important;
  }
  .backlinks:has(> ul.overflow) {
    max-height: none !important;
    overflow: visible !important;
    overflow-y: visible !important;
  }
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbIi4uXFwuLlxcc3R5bGVzXFx2YXJpYWJsZXMuc2NzcyIsImJhY2tsaW5rcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FDQUE7RUFDRTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7O0FBT047RUE1QkY7SUE4Qkk7SUFDQTs7RUFFQTtJQUNFO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7O0VBSUY7SUFDRTtJQUNBO0lBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwic2FzczptYXBcIjtcblxuLyoqXG4gKiBMYXlvdXQgYnJlYWtwb2ludHNcbiAqICRtb2JpbGU6IHNjcmVlbiB3aWR0aCBiZWxvdyB0aGlzIHZhbHVlIHdpbGwgdXNlIG1vYmlsZSBzdHlsZXNcbiAqICRkZXNrdG9wOiBzY3JlZW4gd2lkdGggYWJvdmUgdGhpcyB2YWx1ZSB3aWxsIHVzZSBkZXNrdG9wIHN0eWxlc1xuICogU2NyZWVuIHdpZHRoIGJldHdlZW4gJG1vYmlsZSBhbmQgJGRlc2t0b3Agd2lkdGggd2lsbCB1c2UgdGhlIHRhYmxldCBsYXlvdXQuXG4gKiBhc3N1bWluZyBtb2JpbGUgPCBkZXNrdG9wXG4gKi9cbiRicmVha3BvaW50czogKFxuICBtb2JpbGU6IDgwMHB4LFxuICBkZXNrdG9wOiAxMjAwcHgsXG4pO1xuXG4kbW9iaWxlOiBcIihtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KVwiO1xuJHRhYmxldDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSkgYW5kIChtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcbiRkZXNrdG9wOiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcblxuJHBhZ2VXaWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX07XG4kc2lkZVBhbmVsV2lkdGg6IDMyMHB4OyAvLzM4MHB4O1xuJHRvcFNwYWNpbmc6IDZyZW07XG4kYm9sZFdlaWdodDogNzAwO1xuJHNlbWlCb2xkV2VpZ2h0OiA2MDA7XG4kbm9ybWFsV2VpZ2h0OiA0MDA7XG5cbiRtb2JpbGVHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcImF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnRcIlxcXG4gICAgICBcImdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLWZvb3RlclwiJyxcbik7XG4kdGFibGV0R3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyXCInLFxuKTtcbiRkZXNrdG9wR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvICN7JHNpZGVQYW5lbFdpZHRofVwiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCInLFxuKTtcbiIsIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuXG4uYmFja2xpbmtzIHtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAmID4gaDMge1xuICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICBtYXJnaW46IDA7XG4gIH1cblxuICAmID4gdWwub3ZlcmZsb3cge1xuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgcGFkZGluZzogMDtcbiAgICBtYXJnaW46IDAuNXJlbSAwO1xuICAgIG1heC1oZWlnaHQ6IGNhbGMoMTAwJSAtIDJyZW0pO1xuICAgIG92ZXJzY3JvbGwtYmVoYXZpb3I6IGNvbnRhaW47XG5cbiAgICAmID4gbGkge1xuICAgICAgbWFyZ2luLWJvdHRvbTogMC4zcmVtOyAvLyBTbWFsbCBzcGFjaW5nIGJldHdlZW4gZGlmZmVyZW50IGxpbmtzXG4gICAgICBcbiAgICAgICYgPiBhIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjI7IC8vIFRpZ2h0ZXIgbGluZSBzcGFjaW5nIHdpdGhpbiBhIHNpbmdsZSBsaW5rIHdoZW4gaXQgd3JhcHNcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrOyAvLyBBbGxvdyBsaW5lIHdyYXBwaW5nXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gT24gbW9iaWxlLCByZW1vdmUgbWF4LWhlaWdodCBhbmQgb3ZlcmZsb3cgY29uc3RyYWludHNcbiAgLy8gc28gYmFja2xpbmtzIGZsb3cgbmF0dXJhbGx5IGFzIHBhcnQgb2YgdGhlIHBhZ2VcbiAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICAvLyBPdmVycmlkZSB0aGUgbWF4LWhlaWdodDogMjRyZW0gZnJvbSBiYXNlLnNjc3Mgc2lkZWJhci5yaWdodCA+ICpcbiAgICBtYXgtaGVpZ2h0OiBub25lICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XG4gICAgXG4gICAgJiA+IHVsLm92ZXJmbG93IHtcbiAgICAgIG1heC1oZWlnaHQ6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgIG92ZXJmbG93OiB2aXNpYmxlICFpbXBvcnRhbnQ7XG4gICAgICBvdmVyZmxvdy15OiB2aXNpYmxlICFpbXBvcnRhbnQ7XG4gICAgICBvdmVyc2Nyb2xsLWJlaGF2aW9yOiBhdXRvO1xuICAgICAgaGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XG4gICAgfVxuICAgIFxuICAgIC8vIEFsc28gb3ZlcnJpZGUgcGFyZW50IGRpdiBjb25zdHJhaW50cyBpZiBhbnlcbiAgICAmOmhhcyg+IHVsLm92ZXJmbG93KSB7XG4gICAgICBtYXgtaGVpZ2h0OiBub25lICFpbXBvcnRhbnQ7XG4gICAgICBvdmVyZmxvdzogdmlzaWJsZSAhaW1wb3J0YW50O1xuICAgICAgb3ZlcmZsb3cteTogdmlzaWJsZSAhaW1wb3J0YW50O1xuICAgIH1cbiAgfVxufVxuIl19 */`;import{Fragment as Fragment5,jsx as jsx27,jsxs as jsxs16}from"preact/jsx-runtime";var defaultOptions12={hideWhenEmpty:!0},Backlinks_default=__name((opts=>{let options2={...defaultOptions12,...opts},{OverflowList:OverflowList2,overflowListAfterDOMLoaded}=OverflowList_default(),Backlinks=__name(({fileData,allFiles,displayClass,cfg})=>{let slug=simplifySlug(fileData.slug),backlinkFiles=allFiles.filter(file=>file.links?.includes(slug)),isProfile=fileData.frontmatter?.type==="profile",profileId=fileData.frontmatter?.ID,basePath=pathToRoot(fileData.slug),filteredBacklinkFiles=isProfile?backlinkFiles.filter(file=>file.frontmatter?.type!=="profile"):backlinkFiles,hasRegularBacklinks=filteredBacklinkFiles.length>0,hasChapterBacklinks=isProfile&&profileId!==void 0;return options2.hideWhenEmpty&&!hasRegularBacklinks&&!hasChapterBacklinks?null:jsxs16("div",{class:classNames(displayClass,"backlinks"),"data-profile-id":profileId||"","data-base-path":basePath,children:[jsx27("h3",{children:i18n(cfg.locale).components.backlinks.title}),jsx27(OverflowList2,{children:hasRegularBacklinks||hasChapterBacklinks?jsx27(Fragment5,{children:filteredBacklinkFiles.map(f=>jsx27("li",{children:jsx27("a",{href:resolveRelative(fileData.slug,f.slug),class:"internal",children:f.frontmatter?.title})}))}):jsx27("li",{children:i18n(cfg.locale).components.backlinks.noBacklinksFound})})]})},"Backlinks");Backlinks.css=backlinks_default;let chapterBacklinksScript=`
    // Function to load chapter backlinks
    let isLoadingBacklinks = false;
    
    function loadChapterBacklinks() {
      // Prevent multiple simultaneous calls
      if (isLoadingBacklinks) {
        console.log('[Backlinks] Already loading, skipping duplicate call');
        return;
      }
      
      const backlinksContainer = document.querySelector('.backlinks[data-profile-id]');
      if (!backlinksContainer) return;
      
      const profileId = backlinksContainer.getAttribute('data-profile-id');
      const basePath = backlinksContainer.getAttribute('data-base-path') || '';
      
      if (!profileId) return;
      
      isLoadingBacklinks = true;
      
      // Remove existing chapter backlinks to avoid duplicates
      const existingChapterBacklinks = backlinksContainer.querySelectorAll('.chapter-backlink');
      existingChapterBacklinks.forEach(function(link) {
        link.parentElement.remove();
      });
      
      // Ensure basePath ends with / if it's not empty
      const normalizedBasePath = basePath && !basePath.endsWith('/') ? basePath + '/' : basePath;
      
      // Load backlinks index
      fetch(normalizedBasePath + 'static/backlinks-index.json')
        .then(function(response) {
          if (!response.ok) {
            console.log('[Backlinks] No backlinks index found');
            return null;
          }
          return response.json();
        })
        .then(function(backlinksIndex) {
          if (!backlinksIndex) {
            isLoadingBacklinks = false;
            return;
          }
          
          const chapterBacklinks = backlinksIndex[profileId];
          if (!chapterBacklinks || chapterBacklinks.length === 0) {
            isLoadingBacklinks = false;
            return;
          }
          
          // Find the overflow list (ul element)
          const overflowList = backlinksContainer.querySelector('ul.overflow');
          if (!overflowList) {
            isLoadingBacklinks = false;
            return;
          }
          
          // Create list items for each chapter backlink
          chapterBacklinks.forEach(function(backlink) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            
            // Build the URL with chapter hash fragment
            const profileUrl = normalizedBasePath + 'profiles/' + encodeURIComponent(backlink.profileSlug);
            const chapterHash = '#chapter=' + backlink.chapterSlug + '&tab=biography';
            link.href = profileUrl + chapterHash;
            link.className = 'internal chapter-backlink';
            
            // Format: Just the chapter title
            link.textContent = backlink.chapterTitle;
            
            li.appendChild(link);
            // Insert before the overflow-end element if it exists, otherwise append
            const overflowEnd = overflowList.querySelector('.overflow-end');
            if (overflowEnd) {
              overflowList.insertBefore(li, overflowEnd);
            } else {
              overflowList.appendChild(li);
            }
          });
          
          console.log('[Backlinks] Loaded', chapterBacklinks.length, 'chapter backlinks for', profileId);
          isLoadingBacklinks = false;
        })
        .catch(function(err) {
          console.log('[Backlinks] Error loading backlinks index:', err);
          isLoadingBacklinks = false;
        });
    }
    
    // Load on navigation event (covers both initial load and SPA navigation)
    document.addEventListener('nav', function() {
      loadChapterBacklinks();
    });
  `;return Backlinks.afterDOMLoaded=concatenateResources(overflowListAfterDOMLoaded,chapterBacklinksScript),Backlinks}),"default");var search_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
.search {
  min-width: fit-content;
  max-width: 14rem;
}
@media all and ((max-width: 800px)) {
  .search {
    flex-grow: 0.3;
  }
}
.search > .search-button {
  background-color: transparent;
  border: 1px var(--lightgray) solid;
  border-radius: 4px;
  font-family: inherit;
  font-size: inherit;
  height: 2rem;
  padding: 0 1rem 0 0;
  display: flex;
  align-items: center;
  text-align: inherit;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
}
.search > .search-button > p {
  display: inline;
  color: var(--gray);
}
.search > .search-button svg {
  cursor: pointer;
  width: 18px;
  min-width: 18px;
  margin: 0 0.5rem;
}
.search > .search-button svg .search-path {
  stroke: var(--darkgray);
  stroke-width: 1.5px;
  transition: stroke 0.5s ease;
}
.search > .search-container {
  position: fixed;
  contain: layout;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  display: none;
  backdrop-filter: blur(4px);
}
.search > .search-container.active {
  display: inline-block;
}
.search > .search-container > .search-space {
  width: 65%;
  margin-top: 12vh;
  margin-left: auto;
  margin-right: auto;
}
@media all and not ((min-width: 1200px)) {
  .search > .search-container > .search-space {
    width: 90%;
  }
}
.search > .search-container > .search-space > * {
  width: 100%;
  border-radius: 7px;
  background: var(--light);
  box-shadow: 0 14px 50px rgba(27, 33, 48, 0.12), 0 10px 30px rgba(27, 33, 48, 0.16);
  margin-bottom: 2em;
}
.search > .search-container > .search-space > input {
  box-sizing: border-box;
  padding: 0.5em 1em;
  font-family: var(--bodyFont);
  color: var(--dark);
  font-size: 1.1em;
  border: 1px solid var(--lightgray);
}
.search > .search-container > .search-space > input:focus {
  outline: none;
}
.search > .search-container > .search-space > .search-layout {
  display: none;
  flex-direction: row;
  border: 1px solid var(--lightgray);
  flex: 0 0 100%;
  box-sizing: border-box;
}
.search > .search-container > .search-space > .search-layout.display-results {
  display: flex;
}
.search > .search-container > .search-space > .search-layout[data-preview] > .results-container {
  flex: 0 0 min(30%, 450px);
}
@media all and not ((max-width: 800px)) {
  .search > .search-container > .search-space > .search-layout[data-preview] .result-card > p.preview {
    display: none;
  }
  .search > .search-container > .search-space > .search-layout[data-preview] > div:first-child {
    border-right: 1px solid var(--lightgray);
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
  }
  .search > .search-container > .search-space > .search-layout[data-preview] > div:last-child {
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
  }
}
.search > .search-container > .search-space > .search-layout > div {
  height: 63vh;
  border-radius: 5px;
}
@media all and ((max-width: 800px)) {
  .search > .search-container > .search-space > .search-layout {
    flex-direction: column;
  }
  .search > .search-container > .search-space > .search-layout > .preview-container {
    display: none !important;
  }
  .search > .search-container > .search-space > .search-layout[data-preview] > .results-container {
    width: 100%;
    height: auto;
    flex: 0 0 100%;
  }
}
.search > .search-container > .search-space > .search-layout .highlight {
  background: color-mix(in srgb, var(--tertiary) 60%, rgba(255, 255, 255, 0));
  border-radius: 5px;
  scroll-margin-top: 2rem;
}
.search > .search-container > .search-space > .search-layout > .preview-container {
  flex-grow: 1;
  display: block;
  overflow: hidden;
  font-family: inherit;
  color: var(--dark);
  line-height: 1.5em;
  font-weight: 400;
  overflow-y: auto;
  padding: 0 2rem;
}
.search > .search-container > .search-space > .search-layout > .preview-container .preview-inner {
  margin: 0 auto;
  width: min(800px, 100%);
}
.search > .search-container > .search-space > .search-layout > .preview-container a[role=anchor] {
  background-color: transparent;
}
.search > .search-container > .search-space > .search-layout > .results-container {
  overflow-y: auto;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card {
  overflow: hidden;
  padding: 1em;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid var(--lightgray);
  width: 100%;
  display: block;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  text-transform: none;
  text-align: left;
  outline: none;
  font-weight: inherit;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card:hover, .search > .search-container > .search-space > .search-layout > .results-container .result-card:focus, .search > .search-container > .search-space > .search-layout > .results-container .result-card.focus {
  background: var(--lightgray);
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > h3 {
  margin: 0;
}
@media all and not ((max-width: 800px)) {
  .search > .search-container > .search-space > .search-layout > .results-container .result-card > p.card-description, .search > .search-container > .search-space > .search-layout > .results-container .result-card > div.card-description {
    display: none;
  }
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > ul.tags {
  margin-top: 0.45rem;
  margin-bottom: 0;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > ul > li > p {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
  line-height: 1.4rem;
  font-weight: 700;
  color: var(--secondary);
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > ul > li > p.match-tag {
  color: var(--tertiary);
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > p {
  margin-bottom: 0;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > .card-description .profile-info-list {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  margin: 0;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > .card-description .profile-info-list dt {
  color: #666;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}
.search > .search-container > .search-space > .search-layout > .results-container .result-card > .card-description .profile-info-list dd {
  margin: 0;
  color: #000;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbIi4uXFwuLlxcc3R5bGVzXFx2YXJpYWJsZXMuc2NzcyIsInNlYXJjaC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FDQUE7RUFDRTtFQUNBOztBQUNBO0VBSEY7SUFJSTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQU5GO0lBT0k7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0EsWUFDRTtFQUVGOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTs7QUFHRjtFQUVJO0lBQ0U7O0VBSUE7SUFDRTtJQUNBO0lBQ0E7O0VBR0Y7SUFDRTtJQUNBOzs7QUFNUjtFQUNFO0VBQ0E7O0FBR0Y7RUF6Q0Y7SUEwQ0k7O0VBRUE7SUFDRTs7RUFHRjtJQUNFO0lBQ0E7SUFDQTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxhRHpJSztFQzBJTDtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFHRjtFQUNFOztBQUlKO0VBQ0U7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBR0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUdFOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtJQUVFOzs7QUFJSjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsYUQ1TUQ7RUM2TUM7O0FBRUE7RUFDRTs7QUFJSjtFQUNFOztBQUtBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcInNhc3M6bWFwXCI7XG5cbi8qKlxuICogTGF5b3V0IGJyZWFrcG9pbnRzXG4gKiAkbW9iaWxlOiBzY3JlZW4gd2lkdGggYmVsb3cgdGhpcyB2YWx1ZSB3aWxsIHVzZSBtb2JpbGUgc3R5bGVzXG4gKiAkZGVza3RvcDogc2NyZWVuIHdpZHRoIGFib3ZlIHRoaXMgdmFsdWUgd2lsbCB1c2UgZGVza3RvcCBzdHlsZXNcbiAqIFNjcmVlbiB3aWR0aCBiZXR3ZWVuICRtb2JpbGUgYW5kICRkZXNrdG9wIHdpZHRoIHdpbGwgdXNlIHRoZSB0YWJsZXQgbGF5b3V0LlxuICogYXNzdW1pbmcgbW9iaWxlIDwgZGVza3RvcFxuICovXG4kYnJlYWtwb2ludHM6IChcbiAgbW9iaWxlOiA4MDBweCxcbiAgZGVza3RvcDogMTIwMHB4LFxuKTtcblxuJG1vYmlsZTogXCIobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSlcIjtcbiR0YWJsZXQ6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pIGFuZCAobWF4LXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG4kZGVza3RvcDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBkZXNrdG9wKX0pXCI7XG5cbiRwYWdlV2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9O1xuJHNpZGVQYW5lbFdpZHRoOiAzMjBweDsgLy8zODBweDtcbiR0b3BTcGFjaW5nOiA2cmVtO1xuJGJvbGRXZWlnaHQ6IDcwMDtcbiRzZW1pQm9sZFdlaWdodDogNjAwO1xuJG5vcm1hbFdlaWdodDogNDAwO1xuXG4kbW9iaWxlR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCJhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0XCJcXFxuICAgICAgXCJncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1mb290ZXJcIicsXG4pO1xuJHRhYmxldEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvXCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlclwiJyxcbik7XG4kZGVza3RvcEdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0byAjeyRzaWRlUGFuZWxXaWR0aH1cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWNlbnRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyIGdyaWQtc2lkZWJhci1yaWdodFwiJyxcbik7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcblxuLnNlYXJjaCB7XG4gIG1pbi13aWR0aDogZml0LWNvbnRlbnQ7XG4gIG1heC13aWR0aDogMTRyZW07XG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgZmxleC1ncm93OiAwLjM7XG4gIH1cblxuICAmID4gLnNlYXJjaC1idXR0b24ge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIGJvcmRlcjogMXB4IHZhcigtLWxpZ2h0Z3JheSkgc29saWQ7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuICAgIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgICBoZWlnaHQ6IDJyZW07XG4gICAgcGFkZGluZzogMCAxcmVtIDAgMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgdGV4dC1hbGlnbjogaW5oZXJpdDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgICYgPiBwIHtcbiAgICAgIGRpc3BsYXk6IGlubGluZTtcbiAgICAgIGNvbG9yOiB2YXIoLS1ncmF5KTtcbiAgICB9XG5cbiAgICAmIHN2ZyB7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICB3aWR0aDogMThweDtcbiAgICAgIG1pbi13aWR0aDogMThweDtcbiAgICAgIG1hcmdpbjogMCAwLjVyZW07XG5cbiAgICAgIC5zZWFyY2gtcGF0aCB7XG4gICAgICAgIHN0cm9rZTogdmFyKC0tZGFya2dyYXkpO1xuICAgICAgICBzdHJva2Utd2lkdGg6IDEuNXB4O1xuICAgICAgICB0cmFuc2l0aW9uOiBzdHJva2UgMC41cyBlYXNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICYgPiAuc2VhcmNoLWNvbnRhaW5lciB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGNvbnRhaW46IGxheW91dDtcbiAgICB6LWluZGV4OiA5OTk7XG4gICAgbGVmdDogMDtcbiAgICB0b3A6IDA7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xuXG4gICAgJi5hY3RpdmUge1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIH1cblxuICAgICYgPiAuc2VhcmNoLXNwYWNlIHtcbiAgICAgIHdpZHRoOiA2NSU7XG4gICAgICBtYXJnaW4tdG9wOiAxMnZoO1xuICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG5cbiAgICAgIEBtZWRpYSBhbGwgYW5kIG5vdCAoJGRlc2t0b3ApIHtcbiAgICAgICAgd2lkdGg6IDkwJTtcbiAgICAgIH1cblxuICAgICAgJiA+ICoge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogN3B4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodCk7XG4gICAgICAgIGJveC1zaGFkb3c6XG4gICAgICAgICAgMCAxNHB4IDUwcHggcmdiYSgyNywgMzMsIDQ4LCAwLjEyKSxcbiAgICAgICAgICAwIDEwcHggMzBweCByZ2JhKDI3LCAzMywgNDgsIDAuMTYpO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAyZW07XG4gICAgICB9XG5cbiAgICAgICYgPiBpbnB1dCB7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIHBhZGRpbmc6IDAuNWVtIDFlbTtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcigtLWJvZHlGb250KTtcbiAgICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgICAgICBmb250LXNpemU6IDEuMWVtO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuXG4gICAgICAgICY6Zm9jdXMge1xuICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJiA+IC5zZWFyY2gtbGF5b3V0IHtcbiAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgZmxleDogMCAwIDEwMCU7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgICAgICAgJi5kaXNwbGF5LXJlc3VsdHMge1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIH1cblxuICAgICAgICAmW2RhdGEtcHJldmlld10gPiAucmVzdWx0cy1jb250YWluZXIge1xuICAgICAgICAgIGZsZXg6IDAgMCBtaW4oMzAlLCA0NTBweCk7XG4gICAgICAgIH1cblxuICAgICAgICBAbWVkaWEgYWxsIGFuZCBub3QgKCRtb2JpbGUpIHtcbiAgICAgICAgICAmW2RhdGEtcHJldmlld10ge1xuICAgICAgICAgICAgJiAucmVzdWx0LWNhcmQgPiBwLnByZXZpZXcge1xuICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmID4gZGl2IHtcbiAgICAgICAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICAgICAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogdW5zZXQ7XG4gICAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IHVuc2V0O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiB1bnNldDtcbiAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiB1bnNldDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICYgPiBkaXYge1xuICAgICAgICAgIGhlaWdodDogY2FsYyg3NXZoIC0gMTJ2aCk7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgICAgICAgJiA+IC5wcmV2aWV3LWNvbnRhaW5lciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJltkYXRhLXByZXZpZXddID4gLnJlc3VsdHMtY29udGFpbmVyIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiBhdXRvO1xuICAgICAgICAgICAgZmxleDogMCAwIDEwMCU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJiAuaGlnaGxpZ2h0IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tdGVydGlhcnkpIDYwJSwgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKSk7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgICAgICAgIHNjcm9sbC1tYXJnaW4tdG9wOiAycmVtO1xuICAgICAgICB9XG5cbiAgICAgICAgJiA+IC5wcmV2aWV3LWNvbnRhaW5lciB7XG4gICAgICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gICAgICAgICAgY29sb3I6IHZhcigtLWRhcmspO1xuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjVlbTtcbiAgICAgICAgICBmb250LXdlaWdodDogJG5vcm1hbFdlaWdodDtcbiAgICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgICAgIHBhZGRpbmc6IDAgMnJlbTtcblxuICAgICAgICAgICYgLnByZXZpZXctaW5uZXIge1xuICAgICAgICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgICAgICAgICB3aWR0aDogbWluKCRwYWdlV2lkdGgsIDEwMCUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFbcm9sZT1cImFuY2hvclwiXSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmID4gLnJlc3VsdHMtY29udGFpbmVyIHtcbiAgICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuXG4gICAgICAgICAgJiAucmVzdWx0LWNhcmQge1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHBhZGRpbmc6IDFlbTtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycyBlYXNlO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcblxuICAgICAgICAgICAgLy8gbm9ybWFsaXplIGNhcmQgcHJvcHNcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBpbmhlcml0O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMDAlO1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTU7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGluaGVyaXQ7XG5cbiAgICAgICAgICAgICY6aG92ZXIsXG4gICAgICAgICAgICAmOmZvY3VzLFxuICAgICAgICAgICAgJi5mb2N1cyB7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0Z3JheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYgPiBoMyB7XG4gICAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQG1lZGlhIGFsbCBhbmQgbm90ICgkbW9iaWxlKSB7XG4gICAgICAgICAgICAgICYgPiBwLmNhcmQtZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICYgPiBkaXYuY2FyZC1kZXNjcmlwdGlvbiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmID4gdWwudGFncyB7XG4gICAgICAgICAgICAgIG1hcmdpbi10b3A6IDAuNDVyZW07XG4gICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYgPiB1bCA+IGxpID4gcCB7XG4gICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taGlnaGxpZ2h0KTtcbiAgICAgICAgICAgICAgcGFkZGluZzogMC4ycmVtIDAuNHJlbTtcbiAgICAgICAgICAgICAgbWFyZ2luOiAwIDAuMXJlbTtcbiAgICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNHJlbTtcbiAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6ICRib2xkV2VpZ2h0O1xuICAgICAgICAgICAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcblxuICAgICAgICAgICAgICAmLm1hdGNoLXRhZyB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcigtLXRlcnRpYXJ5KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmID4gcCB7XG4gICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFN0eWxlIHByb2ZpbGUtaW5mby1saXN0IGluIGNhcmQtZGVzY3JpcHRpb24gdG8gbWF0Y2ggcHJvZmlsZSBwYWdlXG4gICAgICAgICAgICAmID4gLmNhcmQtZGVzY3JpcHRpb24ge1xuICAgICAgICAgICAgICAucHJvZmlsZS1pbmZvLWxpc3Qge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBhdXRvIDFmcjtcbiAgICAgICAgICAgICAgICBnYXA6IDAuNXJlbSAxcmVtO1xuICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBkdCB7XG4gICAgICAgICAgICAgICAgICBjb2xvcjogIzY2NjtcbiAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZGQge1xuICAgICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgICAgICAgY29sb3I6ICMwMDA7XG4gICAgICAgICAgICAgICAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19 */`;var search_inline_default='var Te=Object.create;var Xt=Object.defineProperty;var je=Object.getOwnPropertyDescriptor;var Re=Object.getOwnPropertyNames;var He=Object.getPrototypeOf,Oe=Object.prototype.hasOwnProperty;var Yt=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Ie=(t,e,n,u)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Re(e))!Oe.call(t,i)&&i!==n&&Xt(t,i,{get:()=>e[i],enumerable:!(u=je(e,i))||u.enumerable});return t};var Gt=(t,e,n)=>(n=t!=null?Te(He(t)):{},Ie(e||!t||!t.__esModule?Xt(n,"default",{value:t,enumerable:!0}):n,t));var Rt=Yt(()=>{});var we=Yt((vn,ye)=>{"use strict";ye.exports=en;function at(t){return t instanceof Buffer?Buffer.from(t):new t.constructor(t.buffer.slice(),t.byteOffset,t.length)}function en(t){if(t=t||{},t.circles)return nn(t);let e=new Map;if(e.set(Date,r=>new Date(r)),e.set(Map,(r,o)=>new Map(u(Array.from(r),o))),e.set(Set,(r,o)=>new Set(u(Array.from(r),o))),t.constructorHandlers)for(let r of t.constructorHandlers)e.set(r[0],r[1]);let n=null;return t.proto?s:i;function u(r,o){let l=Object.keys(r),h=new Array(l.length);for(let c=0;c<l.length;c++){let f=l[c],p=r[f];typeof p!="object"||p===null?h[f]=p:p.constructor!==Object&&(n=e.get(p.constructor))?h[f]=n(p,o):ArrayBuffer.isView(p)?h[f]=at(p):h[f]=o(p)}return h}function i(r){if(typeof r!="object"||r===null)return r;if(Array.isArray(r))return u(r,i);if(r.constructor!==Object&&(n=e.get(r.constructor)))return n(r,i);let o={};for(let l in r){if(Object.hasOwnProperty.call(r,l)===!1)continue;let h=r[l];typeof h!="object"||h===null?o[l]=h:h.constructor!==Object&&(n=e.get(h.constructor))?o[l]=n(h,i):ArrayBuffer.isView(h)?o[l]=at(h):o[l]=i(h)}return o}function s(r){if(typeof r!="object"||r===null)return r;if(Array.isArray(r))return u(r,s);if(r.constructor!==Object&&(n=e.get(r.constructor)))return n(r,s);let o={};for(let l in r){let h=r[l];typeof h!="object"||h===null?o[l]=h:h.constructor!==Object&&(n=e.get(h.constructor))?o[l]=n(h,s):ArrayBuffer.isView(h)?o[l]=at(h):o[l]=s(h)}return o}}function nn(t){let e=[],n=[],u=new Map;if(u.set(Date,l=>new Date(l)),u.set(Map,(l,h)=>new Map(s(Array.from(l),h))),u.set(Set,(l,h)=>new Set(s(Array.from(l),h))),t.constructorHandlers)for(let l of t.constructorHandlers)u.set(l[0],l[1]);let i=null;return t.proto?o:r;function s(l,h){let c=Object.keys(l),f=new Array(c.length);for(let p=0;p<c.length;p++){let a=c[p],d=l[a];if(typeof d!="object"||d===null)f[a]=d;else if(d.constructor!==Object&&(i=u.get(d.constructor)))f[a]=i(d,h);else if(ArrayBuffer.isView(d))f[a]=at(d);else{let D=e.indexOf(d);D!==-1?f[a]=n[D]:f[a]=h(d)}}return f}function r(l){if(typeof l!="object"||l===null)return l;if(Array.isArray(l))return s(l,r);if(l.constructor!==Object&&(i=u.get(l.constructor)))return i(l,r);let h={};e.push(l),n.push(h);for(let c in l){if(Object.hasOwnProperty.call(l,c)===!1)continue;let f=l[c];if(typeof f!="object"||f===null)h[c]=f;else if(f.constructor!==Object&&(i=u.get(f.constructor)))h[c]=i(f,r);else if(ArrayBuffer.isView(f))h[c]=at(f);else{let p=e.indexOf(f);p!==-1?h[c]=n[p]:h[c]=r(f)}}return e.pop(),n.pop(),h}function o(l){if(typeof l!="object"||l===null)return l;if(Array.isArray(l))return s(l,o);if(l.constructor!==Object&&(i=u.get(l.constructor)))return i(l,o);let h={};e.push(l),n.push(h);for(let c in l){let f=l[c];if(typeof f!="object"||f===null)h[c]=f;else if(f.constructor!==Object&&(i=u.get(f.constructor)))h[c]=i(f,o);else if(ArrayBuffer.isView(f))h[c]=at(f);else{let p=e.indexOf(f);p!==-1?h[c]=n[p]:h[c]=o(f)}}return e.pop(),n.pop(),h}}});var C;function $(t,e,n){let u=typeof n,i=typeof t;if(u!=="undefined"){if(i!=="undefined"){if(n){if(i==="function"&&u===i)return function(o){return t(n(o))};if(e=t.constructor,e===n.constructor){if(e===Array)return n.concat(t);if(e===Map){var s=new Map(n);for(var r of t)s.set(r[0],r[1]);return s}if(e===Set){r=new Set(n);for(s of t.values())r.add(s);return r}}}return t}return n}return i==="undefined"?e:t}function rt(t,e){return typeof t>"u"?e:t}function z(){return Object.create(null)}function U(t){return typeof t=="string"}function gt(t){return typeof t=="object"}function pt(t,e){if(U(e))t=t[e];else for(let n=0;t&&n<e.length;n++)t=t[e[n]];return t}var ze=/[^\\p{L}\\p{N}]+/u,Pe=/(\\d{3})/g,_e=/(\\D)(\\d{3})/g,$e=/(\\d{3})(\\D)/g,qt=/[\\u0300-\\u036f]/g;function ct(t={}){if(!this||this.constructor!==ct)return new ct(...arguments);if(arguments.length)for(t=0;t<arguments.length;t++)this.assign(arguments[t]);else this.assign(t)}C=ct.prototype;C.assign=function(t){this.normalize=$(t.normalize,!0,this.normalize);let e=t.include,n=e||t.exclude||t.split,u;if(n||n===""){if(typeof n=="object"&&n.constructor!==RegExp){let i="";u=!e,e||(i+="\\\\p{Z}"),n.letter&&(i+="\\\\p{L}"),n.number&&(i+="\\\\p{N}",u=!!e),n.symbol&&(i+="\\\\p{S}"),n.punctuation&&(i+="\\\\p{P}"),n.control&&(i+="\\\\p{C}"),(n=n.char)&&(i+=typeof n=="object"?n.join(""):n);try{this.split=new RegExp("["+(e?"^":"")+i+"]+","u")}catch{this.split=/\\s+/}}else this.split=n,u=n===!1||"a1a".split(n).length<2;this.numeric=$(t.numeric,u)}else{try{this.split=$(this.split,ze)}catch{this.split=/\\s+/}this.numeric=$(t.numeric,$(this.numeric,!0))}if(this.prepare=$(t.prepare,null,this.prepare),this.finalize=$(t.finalize,null,this.finalize),n=t.filter,this.filter=typeof n=="function"?n:$(n&&new Set(n),null,this.filter),this.dedupe=$(t.dedupe,!0,this.dedupe),this.matcher=$((n=t.matcher)&&new Map(n),null,this.matcher),this.mapper=$((n=t.mapper)&&new Map(n),null,this.mapper),this.stemmer=$((n=t.stemmer)&&new Map(n),null,this.stemmer),this.replacer=$(t.replacer,null,this.replacer),this.minlength=$(t.minlength,1,this.minlength),this.maxlength=$(t.maxlength,1024,this.maxlength),this.rtl=$(t.rtl,!1,this.rtl),(this.cache=n=$(t.cache,!0,this.cache))&&(this.F=null,this.L=typeof n=="number"?n:2e5,this.B=new Map,this.D=new Map,this.I=this.H=128),this.h="",this.J=null,this.A="",this.K=null,this.matcher)for(let i of this.matcher.keys())this.h+=(this.h?"|":"")+i;if(this.stemmer)for(let i of this.stemmer.keys())this.A+=(this.A?"|":"")+i;return this};C.addStemmer=function(t,e){return this.stemmer||(this.stemmer=new Map),this.stemmer.set(t,e),this.A+=(this.A?"|":"")+t,this.K=null,this.cache&&nt(this),this};C.addFilter=function(t){return typeof t=="function"?this.filter=t:(this.filter||(this.filter=new Set),this.filter.add(t)),this.cache&&nt(this),this};C.addMapper=function(t,e){return typeof t=="object"?this.addReplacer(t,e):t.length>1?this.addMatcher(t,e):(this.mapper||(this.mapper=new Map),this.mapper.set(t,e),this.cache&&nt(this),this)};C.addMatcher=function(t,e){return typeof t=="object"?this.addReplacer(t,e):t.length<2&&(this.dedupe||this.mapper)?this.addMapper(t,e):(this.matcher||(this.matcher=new Map),this.matcher.set(t,e),this.h+=(this.h?"|":"")+t,this.J=null,this.cache&&nt(this),this)};C.addReplacer=function(t,e){return typeof t=="string"?this.addMatcher(t,e):(this.replacer||(this.replacer=[]),this.replacer.push(t,e),this.cache&&nt(this),this)};C.encode=function(t,e){if(this.cache&&t.length<=this.H)if(this.F){if(this.B.has(t))return this.B.get(t)}else this.F=setTimeout(nt,50,this);this.normalize&&(typeof this.normalize=="function"?t=this.normalize(t):t=qt?t.normalize("NFKD").replace(qt,"").toLowerCase():t.toLowerCase()),this.prepare&&(t=this.prepare(t)),this.numeric&&t.length>3&&(t=t.replace(_e,"$1 $2").replace($e,"$1 $2").replace(Pe,"$1 "));let n=!(this.dedupe||this.mapper||this.filter||this.matcher||this.stemmer||this.replacer),u=[],i=z(),s,r,o=this.split||this.split===""?t.split(this.split):[t];for(let h=0,c,f;h<o.length;h++)if((c=f=o[h])&&!(c.length<this.minlength||c.length>this.maxlength)){if(e){if(i[c])continue;i[c]=1}else{if(s===c)continue;s=c}if(n)u.push(c);else if(!this.filter||(typeof this.filter=="function"?this.filter(c):!this.filter.has(c))){if(this.cache&&c.length<=this.I)if(this.F){var l=this.D.get(c);if(l||l===""){l&&u.push(l);continue}}else this.F=setTimeout(nt,50,this);if(this.stemmer){this.K||(this.K=new RegExp("(?!^)("+this.A+")$"));let p;for(;p!==c&&c.length>2;)p=c,c=c.replace(this.K,a=>this.stemmer.get(a))}if(c&&(this.mapper||this.dedupe&&c.length>1)){l="";for(let p=0,a="",d,D;p<c.length;p++)d=c.charAt(p),d===a&&this.dedupe||((D=this.mapper&&this.mapper.get(d))||D===""?D===a&&this.dedupe||!(a=D)||(l+=D):l+=a=d);c=l}if(this.matcher&&c.length>1&&(this.J||(this.J=new RegExp("("+this.h+")","g")),c=c.replace(this.J,p=>this.matcher.get(p))),c&&this.replacer)for(l=0;c&&l<this.replacer.length;l+=2)c=c.replace(this.replacer[l],this.replacer[l+1]);if(this.cache&&f.length<=this.I&&(this.D.set(f,c),this.D.size>this.L&&(this.D.clear(),this.I=this.I/1.1|0)),c){if(c!==f)if(e){if(i[c])continue;i[c]=1}else{if(r===c)continue;r=c}u.push(c)}}}return this.finalize&&(u=this.finalize(u)||u),this.cache&&t.length<=this.H&&(this.B.set(t,u),this.B.size>this.L&&(this.B.clear(),this.H=this.H/1.1|0)),u};function nt(t){t.F=null,t.B.clear(),t.D.clear()}function $t(t,e,n){n||(e||typeof t!="object"?typeof e=="object"&&(n=e,e=0):n=t),n&&(t=n.query||t,e=n.limit||e);let u=""+(e||0);n&&(u+=(n.offset||0)+!!n.context+!!n.suggest+(n.resolve!==!1)+(n.resolution||this.resolution)+(n.boost||0)),t=(""+t).toLowerCase(),this.cache||(this.cache=new st);let i=this.cache.get(t+u);if(!i){let s=n&&n.cache;s&&(n.cache=!1),i=this.search(t,e,n),s&&(n.cache=s),this.cache.set(t+u,i)}return i}function st(t){this.limit=t&&t!==!0?t:1e3,this.cache=new Map,this.h=""}st.prototype.set=function(t,e){this.cache.set(this.h=t,e),this.cache.size>this.limit&&this.cache.delete(this.cache.keys().next().value)};st.prototype.get=function(t){let e=this.cache.get(t);return e&&this.h!==t&&(this.cache.delete(t),this.cache.set(this.h=t,e)),e};st.prototype.remove=function(t){for(let e of this.cache){let n=e[0];e[1].includes(t)&&this.cache.delete(n)}};st.prototype.clear=function(){this.cache.clear(),this.h=""};var te={normalize:!1,numeric:!1,dedupe:!1},Ct={},Ht=new Map([["b","p"],["v","f"],["w","f"],["z","s"],["x","s"],["d","t"],["n","m"],["c","k"],["g","k"],["j","k"],["q","k"],["i","e"],["y","e"],["u","o"]]),ee=new Map([["ae","a"],["oe","o"],["sh","s"],["kh","k"],["th","t"],["ph","f"],["pf","f"]]),ne=[/([^aeo])h(.)/g,"$1$2",/([aeo])h([^aeo]|$)/g,"$1$2",/(.)\\1+/g,"$1"],ie={a:"",e:"",i:"",o:"",u:"",y:"",b:1,f:1,p:1,v:1,c:2,g:2,j:2,k:2,q:2,s:2,x:2,z:2,\\u00DF:2,d:3,t:3,l:4,m:5,n:5,r:6},Nt={Exact:te,Default:Ct,Normalize:Ct,LatinBalance:{mapper:Ht},LatinAdvanced:{mapper:Ht,matcher:ee,replacer:ne},LatinExtra:{mapper:Ht,replacer:ne.concat([/(?!^)[aeo]/g,""]),matcher:ee},LatinSoundex:{dedupe:!1,include:{letter:!0},finalize:function(t){for(let n=0;n<t.length;n++){var e=t[n];let u=e.charAt(0),i=ie[u];for(let s=1,r;s<e.length&&(r=e.charAt(s),r==="h"||r==="w"||!(r=ie[r])||r===i||(u+=r,i=r,u.length!==4));s++);t[n]=u}}},CJK:{split:""},LatinExact:te,LatinDefault:Ct,LatinSimple:Ct};function ue(t,e,n,u){let i=[];for(let s=0,r;s<t.index.length;s++)if(r=t.index[s],e>=r.length)e-=r.length;else{e=r[u?"splice":"slice"](e,n);let o=e.length;if(o&&(i=i.length?i.concat(e):e,n-=o,u&&(t.length-=o),!n))break;e=0}return i}function ft(t){if(!this||this.constructor!==ft)return new ft(t);this.index=t?[t]:[],this.length=t?t.length:0;let e=this;return new Proxy([],{get(n,u){if(u==="length")return e.length;if(u==="push")return function(i){e.index[e.index.length-1].push(i),e.length++};if(u==="pop")return function(){if(e.length)return e.length--,e.index[e.index.length-1].pop()};if(u==="indexOf")return function(i){let s=0;for(let r=0,o,l;r<e.index.length;r++){if(o=e.index[r],l=o.indexOf(i),l>=0)return s+l;s+=o.length}return-1};if(u==="includes")return function(i){for(let s=0;s<e.index.length;s++)if(e.index[s].includes(i))return!0;return!1};if(u==="slice")return function(i,s){return ue(e,i||0,s||e.length,!1)};if(u==="splice")return function(i,s){return ue(e,i||0,s||e.length,!0)};if(u==="constructor")return Array;if(typeof u!="symbol")return(n=e.index[u/2**31|0])&&n[u]},set(n,u,i){return n=u/2**31|0,(e.index[n]||(e.index[n]=[]))[u]=i,e.length++,!0}})}ft.prototype.clear=function(){this.index.length=0};ft.prototype.push=function(){};function K(t=8){if(!this||this.constructor!==K)return new K(t);this.index=z(),this.h=[],this.size=0,t>32?(this.B=ae,this.A=BigInt(t)):(this.B=fe,this.A=t)}K.prototype.get=function(t){let e=this.index[this.B(t)];return e&&e.get(t)};K.prototype.set=function(t,e){var n=this.B(t);let u=this.index[n];u?(n=u.size,u.set(t,e),(n-=u.size)&&this.size++):(this.index[n]=u=new Map([[t,e]]),this.h.push(u),this.size++)};function J(t=8){if(!this||this.constructor!==J)return new J(t);this.index=z(),this.h=[],this.size=0,t>32?(this.B=ae,this.A=BigInt(t)):(this.B=fe,this.A=t)}J.prototype.add=function(t){var e=this.B(t);let n=this.index[e];n?(e=n.size,n.add(t),(e-=n.size)&&this.size++):(this.index[e]=n=new Set([t]),this.h.push(n),this.size++)};C=K.prototype;C.has=J.prototype.has=function(t){let e=this.index[this.B(t)];return e&&e.has(t)};C.delete=J.prototype.delete=function(t){let e=this.index[this.B(t)];e&&e.delete(t)&&this.size--};C.clear=J.prototype.clear=function(){this.index=z(),this.h=[],this.size=0};C.values=J.prototype.values=function*(){for(let t=0;t<this.h.length;t++)for(let e of this.h[t].values())yield e};C.keys=J.prototype.keys=function*(){for(let t=0;t<this.h.length;t++)for(let e of this.h[t].keys())yield e};C.entries=J.prototype.entries=function*(){for(let t=0;t<this.h.length;t++)for(let e of this.h[t].entries())yield e};function fe(t){let e=2**this.A-1;if(typeof t=="number")return t&e;let n=0,u=this.A+1;for(let i=0;i<t.length;i++)n=(n*u^t.charCodeAt(i))&e;return this.A===32?n+2**31:n}function ae(t){let e=BigInt(2)**this.A-BigInt(1);var n=typeof t;if(n==="bigint")return t&e;if(n==="number")return BigInt(t)&e;n=BigInt(0);let u=this.A+BigInt(1);for(let i=0;i<t.length;i++)n=(n*u^BigInt(t.charCodeAt(i)))&e;return n}var lt,Dt;async function Ne(t){t=t.data;var e=t.task;let n=t.id,u=t.args;switch(e){case"init":Dt=t.options||{},(e=t.factory)?(Function("return "+e)()(self),lt=new self.FlexSearch.Index(Dt),delete self.FlexSearch):lt=new V(Dt),postMessage({id:n});break;default:let i;e==="export"&&(u[1]?(u[0]=Dt.export,u[2]=0,u[3]=1):u=null),e==="import"?u[0]&&(t=await Dt.import.call(lt,u[0]),lt.import(u[0],t)):((i=u&&lt[e].apply(lt,u))&&i.then&&(i=await i),i&&i.await&&(i=await i.await),e==="search"&&i.result&&(i=i.result)),postMessage(e==="search"?{id:n,msg:i}:{id:n})}}function Wt(t){ot.call(t,"add"),ot.call(t,"append"),ot.call(t,"search"),ot.call(t,"update"),ot.call(t,"remove"),ot.call(t,"searchCache")}var It,se,wt;function We(){It=wt=0}function ot(t){this[t+"Async"]=function(){let e=arguments;var n=e[e.length-1];let u;if(typeof n=="function"&&(u=n,delete e[e.length-1]),It?wt||(wt=Date.now()-se>=this.priority*this.priority*3):(It=setTimeout(We,0),se=Date.now()),wt){let s=this;return new Promise(r=>{setTimeout(function(){r(s[t+"Async"].apply(s,e))},0)})}let i=this[t].apply(this,e);return n=i.then?i:new Promise(s=>s(i)),u&&n.then(u),n}}var Y=0;function it(t={},e){function n(o){function l(h){h=h.data||h;let c=h.id,f=c&&s.h[c];f&&(f(h.msg),delete s.h[c])}if(this.worker=o,this.h=z(),this.worker)return i?this.worker.on("message",l):this.worker.onmessage=l,t.config?new Promise(function(h){Y>1e9&&(Y=0),s.h[++Y]=function(){h(s)},s.worker.postMessage({id:Y,task:"init",factory:u,options:t})}):(this.priority=t.priority||4,this.encoder=e||null,this.worker.postMessage({task:"init",factory:u,options:t}),this)}if(!this||this.constructor!==it)return new it(t);let u=typeof self<"u"?self._factory:typeof window<"u"?window._factory:null;u&&(u=u.toString());let i=typeof window>"u",s=this,r=Ue(u,i,t.worker);return r.then?r.then(function(o){return n.call(s,o)}):n.call(this,r)}G("add");G("append");G("search");G("update");G("remove");G("clear");G("export");G("import");it.prototype.searchCache=$t;Wt(it.prototype);function G(t){it.prototype[t]=function(){let e=this,n=[].slice.call(arguments);var u=n[n.length-1];let i;return typeof u=="function"&&(i=u,n.pop()),u=new Promise(function(s){t==="export"&&typeof n[0]=="function"&&(n[0]=null),Y>1e9&&(Y=0),e.h[++Y]=s,e.worker.postMessage({task:t,id:Y,args:n})}),i?(u.then(i),this):u}}function Ue(t,e,n){return e?typeof module<"u"?new(Rt()).Worker(__dirname+"/worker/node.js"):Promise.resolve().then(()=>Gt(Rt())).then(function(u){return new u.Worker(import.meta.dirname+"/node/node.mjs")}):t?new window.Worker(URL.createObjectURL(new Blob(["onmessage="+Ne.toString()],{type:"text/javascript"}))):new window.Worker(typeof n=="string"?n:import.meta.url.replace("/worker.js","/worker/worker.js").replace("flexsearch.bundle.module.min.js","module/worker/worker.js"),{type:"module"})}ut.prototype.add=function(t,e,n){if(gt(t)&&(e=t,t=pt(e,this.key)),e&&(t||t===0)){if(!n&&this.reg.has(t))return this.update(t,e);for(let o=0,l;o<this.field.length;o++){l=this.B[o];var u=this.index.get(this.field[o]);if(typeof l=="function"){var i=l(e);i&&u.add(t,i,n,!0)}else i=l.G,(!i||i(e))&&(l.constructor===String?l=[""+l]:U(l)&&(l=[l]),Pt(e,l,this.D,0,u,t,l[0],n))}if(this.tag)for(u=0;u<this.A.length;u++){var s=this.A[u];i=this.tag.get(this.F[u]);let o=z();if(typeof s=="function"){if(s=s(e),!s)continue}else{var r=s.G;if(r&&!r(e))continue;s.constructor===String&&(s=""+s),s=pt(e,s)}if(i&&s){U(s)&&(s=[s]);for(let l=0,h,c;l<s.length;l++)if(h=s[l],!o[h]&&(o[h]=1,(r=i.get(h))?c=r:i.set(h,c=[]),!n||!c.includes(t))){if(c.length===2**31-1){if(r=new ft(c),this.fastupdate)for(let f of this.reg.values())f.includes(c)&&(f[f.indexOf(c)]=r);i.set(h,c=r)}c.push(t),this.fastupdate&&((r=this.reg.get(t))?r.push(c):this.reg.set(t,[c]))}}}if(this.store&&(!n||!this.store.has(t))){let o;if(this.h){o=z();for(let l=0,h;l<this.h.length;l++){if(h=this.h[l],(n=h.G)&&!n(e))continue;let c;if(typeof h=="function"){if(c=h(e),!c)continue;h=[h.O]}else if(U(h)||h.constructor===String){o[h]=e[h];continue}zt(e,o,h,0,h[0],c)}}this.store.set(t,o||e)}this.worker&&(this.fastupdate||this.reg.add(t))}return this};function zt(t,e,n,u,i,s){if(t=t[i],u===n.length-1)e[i]=s||t;else if(t)if(t.constructor===Array)for(e=e[i]=Array(t.length),i=0;i<t.length;i++)zt(t,e,n,u,i);else e=e[i]||(e[i]=z()),i=n[++u],zt(t,e,n,u,i)}function Pt(t,e,n,u,i,s,r,o){if(t=t[r])if(u===e.length-1){if(t.constructor===Array){if(n[u]){for(e=0;e<t.length;e++)i.add(s,t[e],!0,!0);return}t=t.join(" ")}i.add(s,t,o,!0)}else if(t.constructor===Array)for(r=0;r<t.length;r++)Pt(t,e,n,u,i,s,r,o);else r=e[++u],Pt(t,e,n,u,i,s,r,o)}function Ut(t,e,n,u){if(!t.length)return t;if(t.length===1)return t=t[0],t=n||t.length>e?t.slice(n,n+e):t,u?ht.call(this,t):t;let i=[];for(let s=0,r,o;s<t.length;s++)if((r=t[s])&&(o=r.length)){if(n){if(n>=o){n-=o;continue}r=r.slice(n,n+e),o=r.length,n=0}if(o>e&&(r=r.slice(0,e),o=e),!i.length&&o>=e)return u?ht.call(this,r):r;if(i.push(r),e-=o,!e)break}return i=i.length>1?[].concat.apply([],i):i[0],u?ht.call(this,i):i}function Lt(t,e,n,u){var i=u[0];if(i[0]&&i[0].query)return t[e].apply(t,i);if(!(e!=="and"&&e!=="not"||t.result.length||t.await||i.suggest))return u.length>1&&(i=u[u.length-1]),(u=i.resolve)?t.await||t.result:t;let s=[],r=0,o=0,l,h,c,f,p;for(e=0;e<u.length;e++)if(i=u[e]){var a=void 0;if(i.constructor===O)a=i.await||i.result;else if(i.then||i.constructor===Array)a=i;else{r=i.limit||0,o=i.offset||0,c=i.suggest,h=i.resolve,l=((f=i.highlight||t.highlight)||i.enrich)&&h,a=i.queue;let d=i.async||a,D=i.index,g=i.query;if(D?t.index||(t.index=D):D=t.index,g||i.tag){let y=i.field||i.pluck;if(y&&(!g||t.query&&!f||(t.query=g,t.field=y,t.highlight=f),D=D.index.get(y)),a&&(p||t.await)){p=1;let F,x=t.C.length,S=new Promise(function(j){F=j});(function(j,b){S.h=function(){b.index=null,b.resolve=!1;let k=d?j.searchAsync(b):j.search(b);return k.then?k.then(function(A){return t.C[x]=A=A.result||A,F(A),A}):(k=k.result||k,F(k),k)}})(D,Object.assign({},i)),t.C.push(S),s[e]=S;continue}else i.resolve=!1,i.index=null,a=d?D.searchAsync(i):D.search(i),i.resolve=h,i.index=D}else if(i.and)a=At(i,"and",D);else if(i.or)a=At(i,"or",D);else if(i.not)a=At(i,"not",D);else if(i.xor)a=At(i,"xor",D);else continue}a.await?(p=1,a=a.await):a.then?(p=1,a=a.then(function(d){return d.result||d})):a=a.result||a,s[e]=a}if(p&&!t.await&&(t.await=new Promise(function(d){t.return=d})),p){let d=Promise.all(s).then(function(D){for(let g=0;g<t.C.length;g++)if(t.C[g]===d){t.C[g]=function(){return n.call(t,D,r,o,l,h,c,f)};break}Kt(t)});t.C.push(d)}else if(t.await)t.C.push(function(){return n.call(t,s,r,o,l,h,c,f)});else return n.call(t,s,r,o,l,h,c,f);return h?t.await||t.result:t}function At(t,e,n){t=t[e];let u=t[0]||t;return u.index||(u.index=n),n=new O(u),t.length>1&&(n=n[e].apply(n,t.slice(1))),n}O.prototype.or=function(){return Lt(this,"or",Ke,arguments)};function Ke(t,e,n,u,i,s,r){return t.length&&(this.result.length&&t.push(this.result),t.length<2?this.result=t[0]:(this.result=De(t,e,n,!1,this.h),n=0)),i&&(this.await=null),i?this.resolve(e,n,u,r):this}O.prototype.and=function(){return Lt(this,"and",Je,arguments)};function Je(t,e,n,u,i,s,r){if(!s&&!this.result.length)return i?this.result:this;let o;if(t.length)if(this.result.length&&t.unshift(this.result),t.length<2)this.result=t[0];else{let l=0;for(let h=0,c,f;h<t.length;h++)if((c=t[h])&&(f=c.length))l<f&&(l=f);else if(!s){l=0;break}l?(this.result=xt(t,l,e,n,s,this.h,i),o=!0):this.result=[]}else s||(this.result=t);return i&&(this.await=null),i?this.resolve(e,n,u,r,o):this}O.prototype.xor=function(){return Lt(this,"xor",Ve,arguments)};function Ve(t,e,n,u,i,s,r){if(t.length)if(this.result.length&&t.unshift(this.result),t.length<2)this.result=t[0];else{t:{s=n;var o=this.h;let l=[],h=z(),c=0;for(let f=0,p;f<t.length;f++)if(p=t[f]){c<p.length&&(c=p.length);for(let a=0,d;a<p.length;a++)if(d=p[a])for(let D=0,g;D<d.length;D++)g=d[D],h[g]=h[g]?2:1}for(let f=0,p,a=0;f<c;f++)for(let d=0,D;d<t.length;d++)if((D=t[d])&&(p=D[f])){for(let g=0,y;g<p.length;g++)if(y=p[g],h[y]===1)if(s)s--;else if(i){if(l.push(y),l.length===e){t=l;break t}}else{let F=f+(d?o:0);if(l[F]||(l[F]=[]),l[F].push(y),++a===e){t=l;break t}}}t=l}this.result=t,o=!0}else s||(this.result=t);return i&&(this.await=null),i?this.resolve(e,n,u,r,o):this}O.prototype.not=function(){return Lt(this,"not",Ze,arguments)};function Ze(t,e,n,u,i,s,r){if(!s&&!this.result.length)return i?this.result:this;if(t.length&&this.result.length){t:{s=n;var o=[];t=new Set(t.flat().flat());for(let l=0,h,c=0;l<this.result.length;l++)if(h=this.result[l]){for(let f=0,p;f<h.length;f++)if(p=h[f],!t.has(p)){if(s)s--;else if(i){if(o.push(p),o.length===e){t=o;break t}}else if(o[l]||(o[l]=[]),o[l].push(p),++c===e){t=o;break t}}}t=o}this.result=t,o=!0}return i&&(this.await=null),i?this.resolve(e,n,u,r,o):this}function Bt(t,e,n,u,i){let s,r,o;typeof i=="string"?(s=i,i=""):s=i.template,r=s.indexOf("$1"),o=s.substring(r+2),r=s.substring(0,r);let l=i&&i.boundary,h=!i||i.clip!==!1,c=i&&i.merge&&o&&r&&new RegExp(o+" "+r,"g");i=i&&i.ellipsis;var f=0;if(typeof i=="object"){var p=i.template;f=p.length-2,i=i.pattern}typeof i!="string"&&(i=i===!1?"":"..."),f&&(i=p.replace("$1",i)),p=i.length-f;let a,d;typeof l=="object"&&(a=l.before,a===0&&(a=-1),d=l.after,d===0&&(d=-1),l=l.total||9e5),f=new Map;for(let H=0,P,I,Z;H<e.length;H++){let W;if(u)W=e,Z=u;else{var D=e[H];if(Z=D.field,!Z)continue;W=D.result}I=n.get(Z),P=I.encoder,D=f.get(P),typeof D!="string"&&(D=P.encode(t),f.set(P,D));for(let X=0;X<W.length;X++){var g=W[X].doc;if(!g||(g=pt(g,Z),!g))continue;var y=g.trim().split(/\\s+/);if(!y.length)continue;g="";var F=[];let Et=[];for(var x=-1,S=-1,j=0,b=0;b<y.length;b++){var k=y[b],A=P.encode(k);A=A.length>1?A.join(" "):A[0];let w;if(A&&k){for(var v=k.length,E=(P.split?k.replace(P.split,""):k).length-A.length,m="",B=0,M=0;M<D.length;M++){var R=D[M];if(R){var L=R.length;L+=E,B&&L<=B||(R=A.indexOf(R),R>-1&&(m=(R?k.substring(0,R):"")+r+k.substring(R,R+L)+o+(R+L<v?k.substring(R+L):""),B=L,w=!0))}}m&&(l&&(x<0&&(x=g.length+(g?1:0)),S=g.length+(g?1:0)+m.length,j+=v,Et.push(F.length),F.push({match:m})),g+=(g?" ":"")+m)}if(!w)k=y[b],g+=(g?" ":"")+k,l&&F.push({text:k});else if(l&&j>=l)break}if(j=Et.length*(s.length-2),a||d||l&&g.length-j>l)if(j=l+j-p*2,b=S-x,a>0&&(b+=a),d>0&&(b+=d),b<=j)y=a?x-(a>0?a:0):x-((j-b)/2|0),F=d?S+(d>0?d:0):y+j,h||(y>0&&g.charAt(y)!==" "&&g.charAt(y-1)!==" "&&(y=g.indexOf(" ",y),y<0&&(y=0)),F<g.length&&g.charAt(F-1)!==" "&&g.charAt(F)!==" "&&(F=g.lastIndexOf(" ",F),F<S?F=S:++F)),g=(y?i:"")+g.substring(y,F)+(F<g.length?i:"");else{for(S=[],x={},j={},b={},k={},A={},m=E=v=0,M=B=1;;){var T=void 0;for(let w=0,_;w<Et.length;w++){if(_=Et[w],m)if(E!==m){if(b[w+1])continue;if(_+=m,x[_]){v-=p,j[w+1]=1,b[w+1]=1;continue}if(_>=F.length-1){if(_>=F.length){b[w+1]=1,_>=y.length&&(j[w+1]=1);continue}v-=p}if(g=F[_].text,L=d&&A[w])if(L>0){if(g.length>L)if(b[w+1]=1,h)g=g.substring(0,L);else continue;(L-=g.length)||(L=-1),A[w]=L}else{b[w+1]=1;continue}if(v+g.length+1<=l)g=" "+g,S[w]+=g;else if(h)T=l-v-1,T>0&&(g=" "+g.substring(0,T),S[w]+=g),b[w+1]=1;else{b[w+1]=1;continue}}else{if(b[w])continue;if(_-=E,x[_]){v-=p,b[w]=1,j[w]=1;continue}if(_<=0){if(_<0){b[w]=1,j[w]=1;continue}v-=p}if(g=F[_].text,L=a&&k[w])if(L>0){if(g.length>L)if(b[w]=1,h)g=g.substring(g.length-L);else continue;(L-=g.length)||(L=-1),k[w]=L}else{b[w]=1;continue}if(v+g.length+1<=l)g+=" ",S[w]=g+S[w];else if(h)T=g.length+1-(l-v),T>=0&&T<g.length&&(g=g.substring(T)+" ",S[w]=g+S[w]),b[w]=1;else{b[w]=1;continue}}else{g=F[_].match,a&&(k[w]=a),d&&(A[w]=d),w&&v++;let jt;if(_?!w&&p&&(v+=p):(j[w]=1,b[w]=1),_>=y.length-1||_<F.length-1&&F[_+1].match?jt=1:p&&(v+=p),v-=s.length-2,!w||v+g.length<=l)S[w]=g;else{T=B=M=j[w]=0;break}jt&&(j[w+1]=1,b[w+1]=1)}v+=g.length,T=x[_]=1}if(T)E===m?m++:E++;else{if(E===m?B=0:M=0,!B&&!M)break;B?(E++,m=E):m++}}g="";for(let w=0,_;w<S.length;w++)_=(w&&j[w]?" ":(w&&!i?" ":"")+i)+S[w],g+=_;i&&!j[S.length]&&(g+=i)}c&&(g=g.replace(c," ")),W[X].highlight=g}if(u)break}return e}function O(t,e){if(!this||this.constructor!==O)return new O(t,e);let n=0,u,i,s,r,o,l;if(t&&t.index){let h=t;if(e=h.index,n=h.boost||0,i=h.query){s=h.field||h.pluck,r=h.highlight;let c=h.resolve;t=h.async||h.queue,h.resolve=!1,h.index=null,t=t?e.searchAsync(h):e.search(h),h.resolve=c,h.index=e,t=t.result||t}else t=[]}if(t&&t.then){let h=this;t=t.then(function(c){h.C[0]=h.result=c.result||c,Kt(h)}),u=[t],t=[],o=new Promise(function(c){l=c})}this.index=e||null,this.result=t||[],this.h=n,this.C=u||[],this.await=o||null,this.return=l||null,this.highlight=r||null,this.query=i||"",this.field=s||""}C=O.prototype;C.limit=function(t){if(this.await){let e=this;this.C.push(function(){return e.limit(t).result})}else if(this.result.length){let e=[];for(let n=0,u;n<this.result.length;n++)if(u=this.result[n])if(u.length<=t){if(e[n]=u,t-=u.length,!t)break}else{e[n]=u.slice(0,t);break}this.result=e}return this};C.offset=function(t){if(this.await){let e=this;this.C.push(function(){return e.offset(t).result})}else if(this.result.length){let e=[];for(let n=0,u;n<this.result.length;n++)(u=this.result[n])&&(u.length<=t?t-=u.length:(e[n]=u.slice(t),t=0));this.result=e}return this};C.boost=function(t){if(this.await){let e=this;this.C.push(function(){return e.boost(t).result})}else this.h+=t;return this};function Kt(t,e){let n=t.result;var u=t.await;t.await=null;for(let i=0,s;i<t.C.length;i++)if(s=t.C[i]){if(typeof s=="function")n=s(),t.C[i]=n=n.result||n,i--;else if(s.h)n=s.h(),t.C[i]=n=n.result||n,i--;else if(s.then)return t.await=u}return u=t.return,t.C=[],t.return=null,e||u(n),n}C.resolve=function(t,e,n,u,i){let s=this.await?Kt(this,!0):this.result;if(s.then){let r=this;return s.then(function(){return r.resolve(t,e,n,u,i)})}return s.length&&(typeof t=="object"?(u=t.highlight||this.highlight,n=!!u||t.enrich,e=t.offset,t=t.limit):(u=u||this.highlight,n=!!u||n),s=i?n?ht.call(this.index,s):s:Ut.call(this.index,s,t||100,e,n)),this.finalize(s,u)};C.finalize=function(t,e){if(t.then){let u=this;return t.then(function(i){return u.finalize(i,e)})}e&&t.length&&this.query&&(t=Bt(this.query,t,this.index.index,this.field,e));let n=this.return;return this.highlight=this.index=this.result=this.C=this.await=this.return=null,this.query=this.field="",n&&n(t),t};function xt(t,e,n,u,i,s,r){let o=t.length,l=[],h,c;h=z();for(let f=0,p,a,d,D;f<e;f++)for(let g=0;g<o;g++)if(d=t[g],f<d.length&&(p=d[f]))for(let y=0;y<p.length;y++){if(a=p[y],(c=h[a])?h[a]++:(c=0,h[a]=1),D=l[c]||(l[c]=[]),!r){let F=f+(g||!i?0:s||0);D=D[F]||(D[F]=[])}if(D.push(a),r&&n&&c===o-1&&D.length-u===n)return u?D.slice(u):D}if(t=l.length)if(i)l=l.length>1?De(l,n,u,r,s):(l=l[0])&&n&&l.length>n||u?l.slice(u,n+u):l;else{if(t<o)return[];if(l=l[t-1],n||u)if(r)(l.length>n||u)&&(l=l.slice(u,n+u));else{i=[];for(let f=0,p;f<l.length;f++)if(p=l[f]){if(u&&p.length>u)u-=p.length;else if((n&&p.length>n||u)&&(p=p.slice(u,n+u),n-=p.length,u&&(u-=p.length)),i.push(p),!n)break}l=i}}return l}function De(t,e,n,u,i){let s=[],r=z(),o;var l=t.length;let h;if(u){for(i=l-1;i>=0;i--)if(h=(u=t[i])&&u.length){for(l=0;l<h;l++)if(o=u[l],!r[o]){if(r[o]=1,n)n--;else if(s.push(o),s.length===e)return s}}}else for(let c=l-1,f,p=0;c>=0;c--){f=t[c];for(let a=0;a<f.length;a++)if(h=(u=f[a])&&u.length){for(let d=0;d<h;d++)if(o=u[d],!r[o])if(r[o]=1,n)n--;else{let D=(a+(c<l-1&&i||0))/(c+1)|0;if((s[D]||(s[D]=[])).push(o),++p===e)return s}}}return s}function Qe(t,e,n){let u=z(),i=[];for(let s=0,r;s<e.length;s++){r=e[s];for(let o=0;o<r.length;o++)u[r[o]]=1}if(n)for(let s=0,r;s<t.length;s++)r=t[s],u[r]&&(i.push(r),u[r]=0);else for(let s=0,r,o;s<t.result.length;s++)for(r=t.result[s],e=0;e<r.length;e++)o=r[e],u[o]&&((i[s]||(i[s]=[])).push(o),u[o]=0);return i}z();ut.prototype.search=function(t,e,n,u){n||(!e&&gt(t)?(n=t,t=""):gt(e)&&(n=e,e=0));let i=[];var s=[];let r,o,l,h,c,f,p=0,a=!0,d;if(n){n.constructor===Array&&(n={index:n}),t=n.query||t,r=n.pluck,o=n.merge,h=n.boost,f=r||n.field||(f=n.index)&&(f.index?null:f);var D=this.tag&&n.tag;l=n.suggest,a=n.resolve!==!1,c=n.cache,d=a&&this.store&&n.highlight;var g=!!d||a&&this.store&&n.enrich;e=n.limit||e;var y=n.offset||0;if(e||(e=a?100:0),D&&(!this.db||!u)){D.constructor!==Array&&(D=[D]);var F=[];for(let k=0,A;k<D.length;k++)if(A=D[k],A.field&&A.tag){var x=A.tag;if(x.constructor===Array)for(var S=0;S<x.length;S++)F.push(A.field,x[S]);else F.push(A.field,x)}else{x=Object.keys(A);for(let v=0,E,m;v<x.length;v++)if(E=x[v],m=A[E],m.constructor===Array)for(S=0;S<m.length;S++)F.push(E,m[S]);else F.push(E,m)}if(D=F,!t){if(s=[],F.length)for(D=0;D<F.length;D+=2){if(this.db){if(u=this.index.get(F[D]),!u)continue;s.push(u=u.db.tag(F[D+1],e,y,g))}else u=Xe.call(this,F[D],F[D+1],e,y,g);i.push(a?{field:F[D],tag:F[D+1],result:u}:[u])}if(s.length){let k=this;return Promise.all(s).then(function(A){for(let v=0;v<A.length;v++)a?i[v].result=A[v]:i[v]=A[v];return a?i:new O(i.length>1?xt(i,1,0,0,l,h):i[0],k)})}return a?i:new O(i.length>1?xt(i,1,0,0,l,h):i[0],this)}}a||r||!(f=f||this.field)||(U(f)?r=f:(f.constructor===Array&&f.length===1&&(f=f[0]),r=f.field||f.index)),f&&f.constructor!==Array&&(f=[f])}f||(f=this.field);let j;F=(this.worker||this.db)&&!u&&[];for(let k=0,A,v,E;k<f.length;k++){if(v=f[k],this.db&&this.tag&&!this.B[k])continue;let m;if(U(v)||(m=v,v=m.field,t=m.query||t,e=rt(m.limit,e),y=rt(m.offset,y),l=rt(m.suggest,l),d=a&&this.store&&rt(m.highlight,d),g=!!d||a&&this.store&&rt(m.enrich,g),c=rt(m.cache,c)),u)A=u[k];else{x=m||n||{},S=x.enrich;var b=this.index.get(v);if(D&&(this.db&&(x.tag=D,j=b.db.support_tag_search,x.field=f),!j&&S&&(x.enrich=!1)),A=c?b.searchCache(t,e,x):b.search(t,e,x),S&&(x.enrich=S),F){F[k]=A;continue}}if(E=(A=A.result||A)&&A.length,D&&E){if(x=[],S=0,this.db&&u){if(!j)for(b=f.length;b<u.length;b++){let B=u[b];if(B&&B.length)S++,x.push(B);else if(!l)return a?i:new O(i,this)}}else for(let B=0,M,R;B<D.length;B+=2){if(M=this.tag.get(D[B]),!M){if(l)continue;return a?i:new O(i,this)}if(R=(M=M&&M.get(D[B+1]))&&M.length)S++,x.push(M);else if(!l)return a?i:new O(i,this)}if(S){if(A=Qe(A,x,a),E=A.length,!E&&!l)return a?A:new O(A,this);S--}}if(E)s[p]=v,i.push(A),p++;else if(f.length===1)return a?i:new O(i,this)}if(F){if(this.db&&D&&D.length&&!j)for(g=0;g<D.length;g+=2){if(s=this.index.get(D[g]),!s){if(l)continue;return a?i:new O(i,this)}F.push(s.db.tag(D[g+1],e,y,!1))}let k=this;return Promise.all(F).then(function(A){return n&&(n.resolve=a),A.length&&(A=k.search(t,e,n,A)),A})}if(!p)return a?i:new O(i,this);if(r&&(!g||!this.store))return i=i[0],a?i:new O(i,this);for(F=[],y=0;y<s.length;y++){if(D=i[y],g&&D.length&&typeof D[0].doc>"u"&&(this.db?F.push(D=this.index.get(this.field[0]).db.enrich(D)):D=ht.call(this,D)),r)return a?d?Bt(t,D,this.index,r,d):D:new O(D,this);i[y]={field:s[y],result:D}}if(g&&this.db&&F.length){let k=this;return Promise.all(F).then(function(A){for(let v=0;v<A.length;v++)i[v].result=A[v];return d&&(i=Bt(t,i,k.index,r,d)),o?re(i):i})}return d&&(i=Bt(t,i,this.index,r,d)),o?re(i):i};function re(t){let e=[],n=z(),u=z();for(let i=0,s,r,o,l,h,c,f;i<t.length;i++){s=t[i],r=s.field,o=s.result;for(let p=0;p<o.length;p++)h=o[p],typeof h!="object"?h={id:l=h}:l=h.id,(c=n[l])?c.push(r):(h.field=n[l]=[r],e.push(h)),(f=h.highlight)&&(c=u[l],c||(u[l]=c={},h.highlight=c),c[r]=f)}return e}function Xe(t,e,n,u,i){return t=this.tag.get(t),t?(t=t.get(e),t?(e=t.length-u,e>0&&((n&&e>n||u)&&(t=t.slice(u,u+n)),i&&(t=ht.call(this,t))),t):[]):[]}function ht(t){if(!this||!this.store)return t;if(this.db)return this.index.get(this.field[0]).db.enrich(t);let e=Array(t.length);for(let n=0,u;n<t.length;n++)u=t[n],e[n]={id:u,doc:this.store.get(u)};return e}function ut(t){if(!this||this.constructor!==ut)return new ut(t);let e=t.document||t.doc||t,n,u;if(this.B=[],this.field=[],this.D=[],this.key=(n=e.key||e.id)&&vt(n,this.D)||"id",(u=t.keystore||0)&&(this.keystore=u),this.fastupdate=!!t.fastupdate,this.reg=!this.fastupdate||t.worker||t.db?u?new J(u):new Set:u?new K(u):new Map,this.h=(n=e.store||null)&&n&&n!==!0&&[],this.store=n?u?new K(u):new Map:null,this.cache=(n=t.cache||null)&&new st(n),t.cache=!1,this.worker=t.worker||!1,this.priority=t.priority||4,this.index=Ye.call(this,t,e),this.tag=null,(n=e.tag)&&(typeof n=="string"&&(n=[n]),n.length)){this.tag=new Map,this.A=[],this.F=[];for(let i=0,s,r;i<n.length;i++){if(s=n[i],r=s.field||s,!r)throw Error("The tag field from the document descriptor is undefined.");s.custom?this.A[i]=s.custom:(this.A[i]=vt(r,this.D),s.filter&&(typeof this.A[i]=="string"&&(this.A[i]=new String(this.A[i])),this.A[i].G=s.filter)),this.F[i]=r,this.tag.set(r,new Map)}}if(this.worker){this.fastupdate=!1,t=[];for(let i of this.index.values())i.then&&t.push(i);if(t.length){let i=this;return Promise.all(t).then(function(s){let r=0;for(let o of i.index.entries()){let l=o[0],h=o[1];h.then&&(h=s[r],i.index.set(l,h),r++)}return i})}}else t.db&&(this.fastupdate=!1,this.mount(t.db))}C=ut.prototype;C.mount=function(t){let e=this.field;if(this.tag)for(let s=0,r;s<this.F.length;s++){r=this.F[s];var n=void 0;this.index.set(r,n=new V({},this.reg)),e===this.field&&(e=e.slice(0)),e.push(r),n.tag=this.tag.get(r)}n=[];let u={db:t.db,type:t.type,fastupdate:t.fastupdate};for(let s=0,r,o;s<e.length;s++){u.field=o=e[s],r=this.index.get(o);let l=new t.constructor(t.id,u);l.id=t.id,n[s]=l.mount(r),r.document=!0,s?r.bypass=!0:r.store=this.store}let i=this;return this.db=Promise.all(n).then(function(){i.db=!0})};C.commit=async function(){let t=[];for(let e of this.index.values())t.push(e.commit());await Promise.all(t),this.reg.clear()};C.destroy=function(){let t=[];for(let e of this.index.values())t.push(e.destroy());return Promise.all(t)};function Ye(t,e){let n=new Map,u=e.index||e.field||e;U(u)&&(u=[u]);for(let s=0,r,o;s<u.length;s++){if(r=u[s],U(r)||(o=r,r=r.field),o=gt(o)?Object.assign({},t,o):t,this.worker){var i=void 0;i=(i=o.encoder)&&i.encode?i:new ct(typeof i=="string"?Nt[i]:i||{}),i=new it(o,i),n.set(r,i)}this.worker||n.set(r,new V(o,this.reg)),o.custom?this.B[s]=o.custom:(this.B[s]=vt(r,this.D),o.filter&&(typeof this.B[s]=="string"&&(this.B[s]=new String(this.B[s])),this.B[s].G=o.filter)),this.field[s]=r}if(this.h){t=e.store,U(t)&&(t=[t]);for(let s=0,r,o;s<t.length;s++)r=t[s],o=r.field||r,r.custom?(this.h[s]=r.custom,r.custom.O=o):(this.h[s]=vt(o,this.D),r.filter&&(typeof this.h[s]=="string"&&(this.h[s]=new String(this.h[s])),this.h[s].G=r.filter))}return n}function vt(t,e){let n=t.split(":"),u=0;for(let i=0;i<n.length;i++)t=n[i],t[t.length-1]==="]"&&(t=t.substring(0,t.length-2))&&(e[u]=!0),t&&(n[u++]=t);return u<n.length&&(n.length=u),u>1?n:n[0]}C.append=function(t,e){return this.add(t,e,!0)};C.update=function(t,e){return this.remove(t).add(t,e)};C.remove=function(t){gt(t)&&(t=pt(t,this.key));for(var e of this.index.values())e.remove(t,!0);if(this.reg.has(t)){if(this.tag&&!this.fastupdate)for(let n of this.tag.values())for(let u of n){e=u[0];let i=u[1],s=i.indexOf(t);s>-1&&(i.length>1?i.splice(s,1):n.delete(e))}this.store&&this.store.delete(t),this.reg.delete(t)}return this.cache&&this.cache.remove(t),this};C.clear=function(){let t=[];for(let e of this.index.values()){let n=e.clear();n.then&&t.push(n)}if(this.tag)for(let e of this.tag.values())e.clear();return this.store&&this.store.clear(),this.cache&&this.cache.clear(),t.length?Promise.all(t):this};C.contain=function(t){return this.db?this.index.get(this.field[0]).db.has(t):this.reg.has(t)};C.cleanup=function(){for(let t of this.index.values())t.cleanup();return this};C.get=function(t){return this.db?this.index.get(this.field[0]).db.enrich(t).then(function(e){return e[0]&&e[0].doc||null}):this.store.get(t)||null};C.set=function(t,e){return typeof t=="object"&&(e=t,t=pt(e,this.key)),this.store.set(t,e),this};C.searchCache=$t;C.export=Ge;C.import=qe;Wt(ut.prototype);function Jt(t,e=0){let n=[],u=[];e&&(e=25e4/e*5e3|0);for(let i of t.entries())u.push(i),u.length===e&&(n.push(u),u=[]);return u.length&&n.push(u),n}function Vt(t,e){e||(e=new Map);for(let n=0,u;n<t.length;n++)u=t[n],e.set(u[0],u[1]);return e}function ge(t,e=0){let n=[],u=[];e&&(e=25e4/e*1e3|0);for(let i of t.entries())u.push([i[0],Jt(i[1])[0]]),u.length===e&&(n.push(u),u=[]);return u.length&&n.push(u),n}function pe(t,e){e||(e=new Map);for(let n=0,u,i;n<t.length;n++)u=t[n],i=e.get(u[0]),e.set(u[0],Vt(u[1],i));return e}function de(t){let e=[],n=[];for(let u of t.keys())n.push(u),n.length===25e4&&(e.push(n),n=[]);return n.length&&e.push(n),e}function Fe(t,e){e||(e=new Set);for(let n=0;n<t.length;n++)e.add(t[n]);return e}function kt(t,e,n,u,i,s,r=0){let o=u&&u.constructor===Array;var l=o?u.shift():u;if(!l)return this.export(t,e,i,s+1);if((l=t((e?e+".":"")+(r+1)+"."+n,JSON.stringify(l)))&&l.then){let h=this;return l.then(function(){return kt.call(h,t,e,n,o?u:null,i,s,r+1)})}return kt.call(this,t,e,n,o?u:null,i,s,r+1)}function Ge(t,e,n=0,u=0){if(n<this.field.length){let r=this.field[n];if((e=this.index.get(r).export(t,r,n,u=1))&&e.then){let o=this;return e.then(function(){return o.export(t,r,n+1)})}return this.export(t,r,n+1)}let i,s;switch(u){case 0:i="reg",s=de(this.reg),e=null;break;case 1:i="tag",s=this.tag&&ge(this.tag,this.reg.size),e=null;break;case 2:i="doc",s=this.store&&Jt(this.store),e=null;break;default:return}return kt.call(this,t,e,i,s||null,n,u)}function qe(t,e){var n=t.split(".");n[n.length-1]==="json"&&n.pop();let u=n.length>2?n[0]:"";if(n=n.length>2?n[2]:n[1],this.worker&&u)return this.index.get(u).import(t);if(e){if(typeof e=="string"&&(e=JSON.parse(e)),u)return this.index.get(u).import(n,e);switch(n){case"reg":this.fastupdate=!1,this.reg=Fe(e,this.reg);for(let i=0,s;i<this.field.length;i++)s=this.index.get(this.field[i]),s.fastupdate=!1,s.reg=this.reg;if(this.worker){e=[];for(let i of this.index.values())e.push(i.import(t));return Promise.all(e)}break;case"tag":this.tag=pe(e,this.tag);break;case"doc":this.store=Vt(e,this.store)}}}function le(t,e){let n="";for(let u of t.entries()){t=u[0];let i=u[1],s="";for(let r=0,o;r<i.length;r++){o=i[r]||[""];let l="";for(let h=0;h<o.length;h++)l+=(l?",":"")+(e==="string"?\'"\'+o[h]+\'"\':o[h]);l="["+l+"]",s+=(s?",":"")+l}s=\'["\'+t+\'",[\'+s+"]]",n+=(n?",":"")+s}return n}V.prototype.remove=function(t,e){let n=this.reg.size&&(this.fastupdate?this.reg.get(t):this.reg.has(t));if(n){if(this.fastupdate){for(let u=0,i,s;u<n.length;u++)if((i=n[u])&&(s=i.length))if(i[s-1]===t)i.pop();else{let r=i.indexOf(t);r>=0&&i.splice(r,1)}}else dt(this.map,t),this.depth&&dt(this.ctx,t);e||this.reg.delete(t)}return this.db&&(this.commit_task.push({del:t}),this.M&&me(this)),this.cache&&this.cache.remove(t),this};function dt(t,e){let n=0;var u=typeof e>"u";if(t.constructor===Array){for(let i=0,s,r,o;i<t.length;i++)if((s=t[i])&&s.length){if(u)return 1;if(r=s.indexOf(e),r>=0){if(s.length>1)return s.splice(r,1),1;if(delete t[i],n)return 1;o=1}else{if(o)return 1;n++}}}else for(let i of t.entries())u=i[0],dt(i[1],e)?n++:t.delete(u);return n}var tn={memory:{resolution:1},performance:{resolution:3,fastupdate:!0,context:{depth:1,resolution:1}},match:{tokenize:"forward"},score:{resolution:9,context:{depth:2,resolution:3}}};V.prototype.add=function(t,e,n,u){if(e&&(t||t===0)){if(!u&&!n&&this.reg.has(t))return this.update(t,e);u=this.depth,e=this.encoder.encode(e,!u);let h=e.length;if(h){let c=z(),f=z(),p=this.resolution;for(let a=0;a<h;a++){let d=e[this.rtl?h-1-a:a];var i=d.length;if(i&&(u||!f[d])){var s=this.score?this.score(e,d,a,null,0):yt(p,h,a),r="";switch(this.tokenize){case"tolerant":if(Q(this,f,d,s,t,n),i>2){for(let D=1,g,y,F,x;D<i-1;D++)g=d.charAt(D),y=d.charAt(D+1),F=d.substring(0,D)+y,x=d.substring(D+2),r=F+g+x,Q(this,f,r,s,t,n),r=F+x,Q(this,f,r,s,t,n);Q(this,f,d.substring(0,d.length-1),s,t,n)}break;case"full":if(i>2){for(let D=0,g;D<i;D++)for(s=i;s>D;s--){r=d.substring(D,s),g=this.rtl?i-1-D:D;var o=this.score?this.score(e,d,a,r,g):yt(p,h,a,i,g);Q(this,f,r,o,t,n)}break}case"bidirectional":case"reverse":if(i>1){for(o=i-1;o>0;o--){r=d[this.rtl?i-1-o:o]+r;var l=this.score?this.score(e,d,a,r,o):yt(p,h,a,i,o);Q(this,f,r,l,t,n)}r=""}case"forward":if(i>1){for(o=0;o<i;o++)r+=d[this.rtl?i-1-o:o],Q(this,f,r,s,t,n);break}default:if(Q(this,f,d,s,t,n),u&&h>1&&a<h-1)for(i=this.N,r=d,s=Math.min(u+1,this.rtl?a+1:h-a),o=1;o<s;o++){d=e[this.rtl?h-1-a-o:a+o],l=this.bidirectional&&d>r;let D=this.score?this.score(e,r,a,d,o-1):yt(i+(h/2>i?0:1),h,a,s-1,o-1);Q(this,c,l?r:d,D,t,n,l?d:r)}}}}this.fastupdate||this.reg.add(t)}}return this.db&&(this.commit_task.push(n?{ins:t}:{del:t}),this.M&&me(this)),this};function Q(t,e,n,u,i,s,r){let o,l;if(!(o=e[n])||r&&!o[r]){if(r?(e=o||(e[n]=z()),e[r]=1,l=t.ctx,(o=l.get(r))?l=o:l.set(r,l=t.keystore?new K(t.keystore):new Map)):(l=t.map,e[n]=1),(o=l.get(n))?l=o:l.set(n,l=o=[]),s){for(let h=0,c;h<o.length;h++)if((c=o[h])&&c.includes(i)){if(h<=u)return;c.splice(c.indexOf(i),1),t.fastupdate&&(e=t.reg.get(i))&&e.splice(e.indexOf(c),1);break}}if(l=l[u]||(l[u]=[]),l.push(i),l.length===2**31-1){if(e=new ft(l),t.fastupdate)for(let h of t.reg.values())h.includes(l)&&(h[h.indexOf(l)]=e);o[u]=l=e}t.fastupdate&&((u=t.reg.get(i))?u.push(l):t.reg.set(i,[l]))}}function yt(t,e,n,u,i){return n&&t>1?e+(u||0)<=t?n+(i||0):(t-1)/(e+(u||0))*(n+(i||0))+1|0:0}V.prototype.search=function(t,e,n){if(n||(e||typeof t!="object"?typeof e=="object"&&(n=e,e=0):(n=t,t="")),n&&n.cache)return n.cache=!1,t=this.searchCache(t,e,n),n.cache=!0,t;let u=[],i,s,r,o=0,l,h,c,f,p;n&&(t=n.query||t,e=n.limit||e,o=n.offset||0,s=n.context,r=n.suggest,p=(l=n.resolve)&&n.enrich,c=n.boost,f=n.resolution,h=this.db&&n.tag),typeof l>"u"&&(l=this.resolve),s=this.depth&&s!==!1;let a=this.encoder.encode(t,!s);if(i=a.length,e=e||(l?100:0),i===1)return he.call(this,a[0],"",e,o,l,p,h);if(i===2&&s&&!r)return he.call(this,a[1],a[0],e,o,l,p,h);let d=z(),D=0,g;if(s&&(g=a[0],D=1),f||f===0||(f=g?this.N:this.resolution),this.db){if(this.db.search&&(n=this.db.search(this,a,e,o,r,l,p,h),n!==!1))return n;let y=this;return(async function(){for(let F,x;D<i;D++){if((x=a[D])&&!d[x]){if(d[x]=1,F=await _t(y,x,g,0,0,!1,!1),F=ce(F,u,r,f)){u=F;break}g&&(r&&F&&u.length||(g=x))}r&&g&&D===i-1&&!u.length&&(f=y.resolution,g="",D=-1,d=z())}return oe(u,f,e,o,r,c,l)})()}for(let y,F;D<i;D++){if((F=a[D])&&!d[F]){if(d[F]=1,y=_t(this,F,g,0,0,!1,!1),y=ce(y,u,r,f)){u=y;break}g&&(r&&y&&u.length||(g=F))}r&&g&&D===i-1&&!u.length&&(f=this.resolution,g="",D=-1,d=z())}return oe(u,f,e,o,r,c,l)};function oe(t,e,n,u,i,s,r){let o=t.length,l=t;if(o>1)l=xt(t,e,n,u,i,s,r);else if(o===1)return r?Ut.call(null,t[0],n,u):new O(t[0],this);return r?l:new O(l,this)}function he(t,e,n,u,i,s,r){return t=_t(this,t,e,n,u,i,s,r),this.db?t.then(function(o){return i?o||[]:new O(o,this)}):t&&t.length?i?Ut.call(this,t,n,u):new O(t,this):i?[]:new O([],this)}function ce(t,e,n,u){let i=[];if(t&&t.length){if(t.length<=u){e.push(t);return}for(let s=0,r;s<u;s++)(r=t[s])&&(i[s]=r);if(i.length){e.push(i);return}}if(!n)return i}function _t(t,e,n,u,i,s,r,o){let l;return n&&(l=t.bidirectional&&e>n)&&(l=n,n=e,e=l),t.db?t.db.get(e,n,u,i,s,r,o):(t=n?(t=t.ctx.get(n))&&t.get(e):t.map.get(e),t)}function V(t,e){if(!this||this.constructor!==V)return new V(t);if(t){var n=U(t)?t:t.preset;n&&(t=Object.assign({},tn[n],t))}else t={};n=t.context;let u=n===!0?{depth:1}:n||{},i=U(t.encoder)?Nt[t.encoder]:t.encode||t.encoder||{};this.encoder=i.encode?i:typeof i=="object"?new ct(i):{encode:i},this.resolution=t.resolution||9,this.tokenize=n=(n=t.tokenize)&&n!=="default"&&n!=="exact"&&n||"strict",this.depth=n==="strict"&&u.depth||0,this.bidirectional=u.bidirectional!==!1,this.fastupdate=!!t.fastupdate,this.score=t.score||null,(n=t.keystore||0)&&(this.keystore=n),this.map=n?new K(n):new Map,this.ctx=n?new K(n):new Map,this.reg=e||(this.fastupdate?n?new K(n):new Map:n?new J(n):new Set),this.N=u.resolution||3,this.rtl=i.rtl||t.rtl||!1,this.cache=(n=t.cache||null)&&new st(n),this.resolve=t.resolve!==!1,(n=t.db)&&(this.db=this.mount(n)),this.M=t.commit!==!1,this.commit_task=[],this.commit_timer=null,this.priority=t.priority||4}C=V.prototype;C.mount=function(t){return this.commit_timer&&(clearTimeout(this.commit_timer),this.commit_timer=null),t.mount(this)};C.commit=function(){return this.commit_timer&&(clearTimeout(this.commit_timer),this.commit_timer=null),this.db.commit(this)};C.destroy=function(){return this.commit_timer&&(clearTimeout(this.commit_timer),this.commit_timer=null),this.db.destroy()};function me(t){t.commit_timer||(t.commit_timer=setTimeout(function(){t.commit_timer=null,t.db.commit(t)},1))}C.clear=function(){return this.map.clear(),this.ctx.clear(),this.reg.clear(),this.cache&&this.cache.clear(),this.db?(this.commit_timer&&clearTimeout(this.commit_timer),this.commit_timer=null,this.commit_task=[],this.db.clear()):this};C.append=function(t,e){return this.add(t,e,!0)};C.contain=function(t){return this.db?this.db.has(t):this.reg.has(t)};C.update=function(t,e){let n=this,u=this.remove(t);return u&&u.then?u.then(()=>n.add(t,e)):this.add(t,e)};C.cleanup=function(){return this.fastupdate?(dt(this.map),this.depth&&dt(this.ctx),this):this};C.searchCache=$t;C.export=function(t,e,n=0,u=0){let i,s;switch(u){case 0:i="reg",s=de(this.reg);break;case 1:i="cfg",s=null;break;case 2:i="map",s=Jt(this.map,this.reg.size);break;case 3:i="ctx",s=ge(this.ctx,this.reg.size);break;default:return}return kt.call(this,t,e,i,s,n,u)};C.import=function(t,e){if(e)switch(typeof e=="string"&&(e=JSON.parse(e)),t=t.split("."),t[t.length-1]==="json"&&t.pop(),t.length===3&&t.shift(),t=t.length>1?t[1]:t[0],t){case"reg":this.fastupdate=!1,this.reg=Fe(e,this.reg);break;case"map":this.map=Vt(e,this.map);break;case"ctx":this.ctx=pe(e,this.ctx)}};C.serialize=function(t=!0){let e="",n="",u="";if(this.reg.size){let s;for(var i of this.reg.keys())s||(s=typeof i),e+=(e?",":"")+(s==="string"?\'"\'+i+\'"\':i);e="index.reg=new Set(["+e+"]);",n=le(this.map,s),n="index.map=new Map(["+n+"]);";for(let r of this.ctx.entries()){i=r[0];let o=le(r[1],s);o="new Map(["+o+"])",o=\'["\'+i+\'",\'+o+"]",u+=(u?",":"")+o}u="index.ctx=new Map(["+u+"]);"}return t?"function inject(index){"+e+n+u+"}":e+n+u};Wt(V.prototype);var Ee=typeof window<"u"&&(window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB),bt=["map","ctx","tag","reg","cfg"],et=z();function St(t,e={}){if(!this||this.constructor!==St)return new St(t,e);typeof t=="object"&&(e=t,t=t.name),t||console.info("Default storage space was used, because a name was not passed."),this.id="flexsearch"+(t?":"+t.toLowerCase().replace(/[^a-z0-9_\\-]/g,""):""),this.field=e.field?e.field.toLowerCase().replace(/[^a-z0-9_\\-]/g,""):"",this.type=e.type,this.fastupdate=this.support_tag_search=!1,this.db=null,this.h={}}C=St.prototype;C.mount=function(t){return t.index?t.mount(this):(t.db=this,this.open())};C.open=function(){if(this.db)return this.db;let t=this;navigator.storage&&navigator.storage.persist(),et[t.id]||(et[t.id]=[]),et[t.id].push(t.field);let e=Ee.open(t.id,1);return e.onupgradeneeded=function(){let n=t.db=this.result;for(let u=0,i;u<bt.length;u++){i=bt[u];for(let s=0,r;s<et[t.id].length;s++)r=et[t.id][s],n.objectStoreNames.contains(i+(i!=="reg"&&r?":"+r:""))||n.createObjectStore(i+(i!=="reg"&&r?":"+r:""))}},t.db=q(e,function(n){t.db=n,t.db.onversionchange=function(){t.close()}})};C.close=function(){this.db&&this.db.close(),this.db=null};C.destroy=function(){let t=Ee.deleteDatabase(this.id);return q(t)};C.clear=function(){let t=[];for(let n=0,u;n<bt.length;n++){u=bt[n];for(let i=0,s;i<et[this.id].length;i++)s=et[this.id][i],t.push(u+(u!=="reg"&&s?":"+s:""))}let e=this.db.transaction(t,"readwrite");for(let n=0;n<t.length;n++)e.objectStore(t[n]).clear();return q(e)};C.get=function(t,e,n=0,u=0,i=!0,s=!1){t=this.db.transaction((e?"ctx":"map")+(this.field?":"+this.field:""),"readonly").objectStore((e?"ctx":"map")+(this.field?":"+this.field:"")).get(e?e+":"+t:t);let r=this;return q(t).then(function(o){let l=[];if(!o||!o.length)return l;if(i){if(!n&&!u&&o.length===1)return o[0];for(let h=0,c;h<o.length;h++)if((c=o[h])&&c.length){if(u>=c.length){u-=c.length;continue}let f=n?u+Math.min(c.length-u,n):c.length;for(let p=u;p<f;p++)l.push(c[p]);if(u=0,l.length===n)break}return s?r.enrich(l):l}return o})};C.tag=function(t,e=0,n=0,u=!1){t=this.db.transaction("tag"+(this.field?":"+this.field:""),"readonly").objectStore("tag"+(this.field?":"+this.field:"")).get(t);let i=this;return q(t).then(function(s){return!s||!s.length||n>=s.length?[]:!e&&!n?s:(s=s.slice(n,n+e),u?i.enrich(s):s)})};C.enrich=function(t){typeof t!="object"&&(t=[t]);let e=this.db.transaction("reg","readonly").objectStore("reg"),n=[];for(let u=0;u<t.length;u++)n[u]=q(e.get(t[u]));return Promise.all(n).then(function(u){for(let i=0;i<u.length;i++)u[i]={id:t[i],doc:u[i]?JSON.parse(u[i]):null};return u})};C.has=function(t){return t=this.db.transaction("reg","readonly").objectStore("reg").getKey(t),q(t).then(function(e){return!!e})};C.search=null;C.info=function(){};C.transaction=function(t,e,n){t+=t!=="reg"&&this.field?":"+this.field:"";let u=this.h[t+":"+e];if(u)return n.call(this,u);let i=this.db.transaction(t,e);this.h[t+":"+e]=u=i.objectStore(t);let s=n.call(this,u);return this.h[t+":"+e]=null,q(i).finally(function(){return i=u=null,s})};C.commit=async function(t){let e=t.commit_task,n=[];t.commit_task=[];for(let u=0,i;u<e.length;u++)i=e[u],i.del&&n.push(i.del);n.length&&await this.remove(n),t.reg.size&&(await this.transaction("map","readwrite",function(u){for(let i of t.map){let s=i[0],r=i[1];r.length&&(u.get(s).onsuccess=function(){let o=this.result;var l;if(o&&o.length){let h=Math.max(o.length,r.length);for(let c=0,f,p;c<h;c++)if((p=r[c])&&p.length){if((f=o[c])&&f.length)for(l=0;l<p.length;l++)f.push(p[l]);else o[c]=p;l=1}}else o=r,l=1;l&&u.put(o,s)})}}),await this.transaction("ctx","readwrite",function(u){for(let i of t.ctx){let s=i[0],r=i[1];for(let o of r){let l=o[0],h=o[1];h.length&&(u.get(s+":"+l).onsuccess=function(){let c=this.result;var f;if(c&&c.length){let p=Math.max(c.length,h.length);for(let a=0,d,D;a<p;a++)if((D=h[a])&&D.length){if((d=c[a])&&d.length)for(f=0;f<D.length;f++)d.push(D[f]);else c[a]=D;f=1}}else c=h,f=1;f&&u.put(c,s+":"+l)})}}}),t.store?await this.transaction("reg","readwrite",function(u){for(let i of t.store){let s=i[0],r=i[1];u.put(typeof r=="object"?JSON.stringify(r):1,s)}}):t.bypass||await this.transaction("reg","readwrite",function(u){for(let i of t.reg.keys())u.put(1,i)}),t.tag&&await this.transaction("tag","readwrite",function(u){for(let i of t.tag){let s=i[0],r=i[1];r.length&&(u.get(s).onsuccess=function(){let o=this.result;o=o&&o.length?o.concat(r):r,u.put(o,s)})}}),t.map.clear(),t.ctx.clear(),t.tag&&t.tag.clear(),t.store&&t.store.clear(),t.document||t.reg.clear())};function Ot(t,e,n){let u=t.value,i,s=0;for(let r=0,o;r<u.length;r++){if(o=n?u:u[r]){for(let l=0,h,c;l<e.length;l++)if(c=e[l],h=o.indexOf(c),h>=0)if(i=1,o.length>1)o.splice(h,1);else{u[r]=[];break}s+=o.length}if(n)break}s?i&&t.update(u):t.delete(),t.continue()}C.remove=function(t){return typeof t!="object"&&(t=[t]),Promise.all([this.transaction("map","readwrite",function(e){e.openCursor().onsuccess=function(){let n=this.result;n&&Ot(n,t)}}),this.transaction("ctx","readwrite",function(e){e.openCursor().onsuccess=function(){let n=this.result;n&&Ot(n,t)}}),this.transaction("tag","readwrite",function(e){e.openCursor().onsuccess=function(){let n=this.result;n&&Ot(n,t,!0)}}),this.transaction("reg","readwrite",function(e){for(let n=0;n<t.length;n++)e.delete(t[n])})])};function q(t,e){return new Promise((n,u)=>{t.onsuccess=t.oncomplete=function(){e&&e(this.result),e=null,n(this.result)},t.onerror=t.onblocked=u,t=null})}var Ce={Index:V,Charset:Nt,Encoder:ct,Document:ut,Worker:it,Resolver:O,IndexedDB:St,Language:{}};function Ae(t,e){if(!t)return;function n(i){i.target===this&&(i.preventDefault(),i.stopPropagation(),e())}function u(i){i.key.startsWith("Esc")&&(i.preventDefault(),e())}t?.addEventListener("click",n),window.addCleanup(()=>t?.removeEventListener("click",n)),document.addEventListener("keydown",u),window.addCleanup(()=>document.removeEventListener("keydown",u))}function Ft(t){for(;t.firstChild;)t.removeChild(t.firstChild)}var Bn=Object.hasOwnProperty;var Be=Gt(we(),1),un=(0,Be.default)();function sn(t){let e=be(hn(t,"index"),!0);return e.length===0?"/":e}var xe=(t,e,n)=>{let u=new URL(t.getAttribute(e),n);t.setAttribute(e,u.pathname+u.hash)};function ve(t,e){t.querySelectorAll(\'[href=""], [href^="./"], [href^="../"]\').forEach(n=>xe(n,"href",e)),t.querySelectorAll(\'[src=""], [src^="./"], [src^="../"]\').forEach(n=>xe(n,"src",e))}function rn(t){let e=t.split("/").filter(n=>n!=="").slice(0,-1).map(n=>"..").join("/");return e.length===0&&(e="."),e}function ke(t,e){return ln(rn(t),sn(e))}function ln(...t){if(t.length===0)return"";let e=t.filter(n=>n!==""&&n!=="/").map(n=>be(n)).join("/");return t[0].startsWith("/")&&(e="/"+e),t[t.length-1].endsWith("/")&&(e=e+"/"),e}function on(t,e){return t===e||t.endsWith("/"+e)}function hn(t,e){return on(t,e)&&(t=t.slice(0,-e.length)),t}function be(t,e){return t.startsWith("/")&&(t=t.substring(1)),!e&&t.endsWith("/")&&(t=t.slice(0,-1)),t}var tt="basic",N="",cn=t=>t.toLowerCase().split(/\\s+/).filter(e=>e.length>0),mt=new Ce.Document({encode:cn,document:{id:"id",tag:"tags",index:[{field:"title",tokenize:"forward"},{field:"content",tokenize:"forward"},{field:"tags",tokenize:"forward"}]}}),fn=new DOMParser,Zt=new Map,Mt=30,Tt=8,an=5,Me=t=>{let e=t.split(/\\s+/).filter(u=>u.trim()!==""),n=e.length;if(n>1)for(let u=1;u<n;u++)e.push(e.slice(0,u+1).join(" "));return e.sort((u,i)=>i.length-u.length)};function Se(t,e,n){let u=Me(t),i=e.split(/\\s+/).filter(l=>l!==""),s=0,r=i.length-1;if(n){let l=p=>u.some(a=>p.toLowerCase().startsWith(a.toLowerCase())),h=i.map(l),c=0,f=0;for(let p=0;p<Math.max(i.length-Mt,0);p++){let d=h.slice(p,p+Mt).reduce((D,g)=>D+(g?1:0),0);d>=c&&(c=d,f=p)}s=Math.max(f-Mt,0),r=Math.min(s+2*Mt,i.length-1),i=i.slice(s,r)}let o=i.map(l=>{for(let h of u)if(l.toLowerCase().includes(h.toLowerCase())){let c=new RegExp(h.toLowerCase(),"gi");return l.replace(c,\'<span class="highlight">$&</span>\')}return l}).join(" ");return`${s===0?"":"..."}${o}${r===i.length-1?"":"..."}`}function Dn(t){return t&&t.replace(/```\\s*mermaid[\\s\\S]*?```/gi,"").trim()}function Qt(t,e){let n=new DOMParser,u=Me(t),i=n.parseFromString(e.innerHTML,"text/html"),s=o=>{let l=document.createElement("span");return l.className="highlight",l.textContent=o,l},r=(o,l)=>{if(o.nodeType===Node.TEXT_NODE){let h=o.nodeValue??"",c=new RegExp(l.toLowerCase(),"gi"),f=h.match(c);if(!f||f.length===0)return;let p=document.createElement("span"),a=0;for(let d of f){let D=h.indexOf(d,a);p.appendChild(document.createTextNode(h.slice(a,D))),p.appendChild(s(d)),a=D+d.length}p.appendChild(document.createTextNode(h.slice(a))),o.parentNode?.replaceChild(p,o)}else if(o.nodeType===Node.ELEMENT_NODE){if(o.classList.contains("highlight"))return;Array.from(o.childNodes).forEach(h=>r(h,l))}};for(let o of u)r(i.body,o);return i.body}async function gn(t,e,n){let u=t.querySelector(".search-container");if(!u)return;let i=u.closest(".sidebar"),s=t.querySelector(".search-button");if(!s)return;let r=t.querySelector(".search-bar");if(!r)return;let o=t.querySelector(".search-layout");if(!o)return;let l=Object.keys(n),h=E=>{o.appendChild(E)},c=o.dataset.preview==="true",f,p,a=document.createElement("div");a.className="results-container",h(a),c&&(f=document.createElement("div"),f.className="preview-container",h(f));function d(){u.classList.remove("active"),r.value="",i&&(i.style.zIndex=""),Ft(a),f&&Ft(f),o.classList.remove("display-results"),tt="basic",s.focus()}function D(E){tt=E,i&&(i.style.zIndex="1"),u.classList.add("active"),r.focus()}let g=null;async function y(E){if(E.key==="k"&&(E.ctrlKey||E.metaKey)&&!E.shiftKey){E.preventDefault(),u.classList.contains("active")?d():D("basic");return}else if(E.shiftKey&&(E.ctrlKey||E.metaKey)&&E.key.toLowerCase()==="k"){E.preventDefault(),u.classList.contains("active")?d():D("tags"),r.value="#";return}if(g&&g.classList.remove("focus"),!!u.classList.contains("active")){if(E.key==="Enter"&&!E.isComposing)if(a.contains(document.activeElement)){let m=document.activeElement;if(m.classList.contains("no-match"))return;await A(m),m.click()}else{let m=document.getElementsByClassName("result-card")[0];if(!m||m.classList.contains("no-match"))return;await A(m),m.click()}else if(E.key==="ArrowUp"||E.shiftKey&&E.key==="Tab"){if(E.preventDefault(),a.contains(document.activeElement)){let m=g||document.activeElement,B=m?.previousElementSibling;m?.classList.remove("focus"),B?.focus(),B&&(g=B),await A(B)}}else if((E.key==="ArrowDown"||E.key==="Tab")&&(E.preventDefault(),document.activeElement===r||g!==null)){let m=g||document.getElementsByClassName("result-card")[0],B=m?.nextElementSibling;m?.classList.remove("focus"),B?.focus(),B&&(g=B),await A(B)}}}let F=(E,m)=>{let B=l[m],M=n[B].content??"",R=M.match(/<div[^>]*class[^>]*profile-info-box[^>]*>([\\s\\S]*?)<\\/div>/i);if(R&&R[1]){let L=R[1],P=new DOMParser().parseFromString(`<div>${L}</div>`,"text/html").body.firstElementChild;P?(Qt(E,P),M=P.innerHTML):M=L}else{let L=[{label:"Birth",pattern:/Birth:\\s*([^\\n]+)/i},{label:"Parents",pattern:/Parents:\\s*([^\\n]+)/i},{label:"Siblings",pattern:/Siblings:\\s*([^\\n]+)/i},{label:"Spouse",pattern:/Spouse:\\s*([^\\n]+)/i},{label:"Children",pattern:/Children:\\s*([^\\n]+)/i}],T=[];if(L.forEach(({label:H,pattern:P})=>{let I=M.match(P);I&&I[1]&&T.push(`<dt>${H}:</dt><dd>${I[1].trim()}</dd>`)}),T.length>0){M=`<dl class="profile-info-list">${T.join("")}</dl>`;let I=new DOMParser().parseFromString(`<div>${M}</div>`,"text/html").body.firstElementChild;I&&(Qt(E,I),M=I.innerHTML)}else M=Dn(M),M=Se(E,M,!0)}return{id:m,slug:B,title:tt==="tags"?n[B].title:Se(E,n[B].title??""),content:M,tags:x(E.substring(1),n[B].tags)}};function x(E,m){return!m||tt!=="tags"?[]:m.map(B=>B.toLowerCase().includes(E.toLowerCase())?`<li><p class="match-tag">#${B}</p></li>`:`<li><p>#${B}</p></li>`).slice(0,an)}function S(E){return new URL(ke(e,E),location.toString())}let j=({slug:E,title:m,content:B,tags:M})=>{let R=M.length>0?`<ul class="tags">${M.join("")}</ul>`:"",L=/<dl|<dt|<dd/.test(B),T=document.createElement("a");T.classList.add("result-card"),T.id=E,T.href=S(E).toString(),L?T.innerHTML=`\n        <h3 class="card-title">${m}</h3>\n        ${R}\n        <div class="card-description">${B}</div>\n      `:T.innerHTML=`\n        <h3 class="card-title">${m}</h3>\n        ${R}\n        <p class="card-description">${B}</p>\n      `,T.addEventListener("click",I=>{I.altKey||I.ctrlKey||I.metaKey||I.shiftKey||d()});let H=I=>{I.altKey||I.ctrlKey||I.metaKey||I.shiftKey||d()};async function P(I){if(!I.target)return;let Z=I.target;await A(Z)}return T.addEventListener("mouseenter",P),window.addCleanup(()=>T.removeEventListener("mouseenter",P)),T.addEventListener("click",H),window.addCleanup(()=>T.removeEventListener("click",H)),T};async function b(E){if(Ft(a),E.length===0?a.innerHTML=`<a class="result-card no-match">\n          <h3>No results.</h3>\n          <p>Try another search term?</p>\n      </a>`:a.append(...E.map(j)),E.length===0&&f)Ft(f);else{let m=a.firstElementChild;m.classList.add("focus"),g=m,await A(m)}}async function k(E){if(Zt.has(E))return Zt.get(E);let m=S(E).toString(),B=await fetch(m).then(M=>M.text()).then(M=>{if(M===void 0)throw new Error(`Could not fetch ${m}`);let R=fn.parseFromString(M??"","text/html");return ve(R,m),[...R.getElementsByClassName("popover-hint")]});return Zt.set(E,B),B}async function A(E){if(!o||!c||!E||!f)return;let m=E.id,B=await k(m).then(R=>{let L=R.flatMap(H=>[...Qt(N,H).children]),T=[];for(let H of L){if(H instanceof HTMLElement){if(H.querySelector("code.mermaid")||H.tagName==="CODE"&&H.classList.contains("mermaid")||H.id==="mermaid-container"||H.querySelector("#mermaid-container"))continue;if(H.tagName==="H2"){let W=H.textContent?.trim()||"";if(W==="Immediate Family"||W==="Ancestors (up to 2 Gen.)"||W==="Descendants (up to 2 Gen.)")continue}let I=H.querySelectorAll("h2"),Z=!1;for(let W of I){let X=W.textContent?.trim()||"";if(X==="Immediate Family"||X==="Ancestors (up to 2 Gen.)"||X==="Descendants (up to 2 Gen.)"){Z=!0;break}}if(Z)continue}T.push(H)}return T});p=document.createElement("div"),p.classList.add("preview-inner"),p.append(...B),f.replaceChildren(p),[...f.getElementsByClassName("highlight")].sort((R,L)=>L.innerHTML.length-R.innerHTML.length)[0]?.scrollIntoView({block:"start"})}async function v(E){if(!o||!mt)return;N=E.target.value,o.classList.toggle("display-results",N!==""),tt=N.startsWith("#")?"tags":"basic";let m;if(tt==="tags"){N=N.substring(1).trim();let L=N.indexOf(" ");if(L!=-1){let T=N.substring(0,L),H=N.substring(L+1).trim();m=await mt.searchAsync({query:H,limit:Math.max(Tt,1e4),index:["title","content"],tag:{tags:T}});for(let P of m)P.result=P.result.slice(0,Tt);tt="basic",N=H}else m=await mt.searchAsync({query:N,limit:Tt,index:["tags"]})}else tt==="basic"&&(m=await mt.searchAsync({query:N,limit:Tt,index:["title","content"]}));let B=L=>{let T=m.filter(H=>H.field===L);return T.length===0?[]:[...T[0].result]},R=[...new Set([...B("title"),...B("content"),...B("tags")])].map(L=>F(N,L));await b(R)}document.addEventListener("keydown",y),window.addCleanup(()=>document.removeEventListener("keydown",y)),s.addEventListener("click",()=>D("basic")),window.addCleanup(()=>s.removeEventListener("click",()=>D("basic"))),r.addEventListener("input",v),window.addCleanup(()=>r.removeEventListener("input",v)),Ae(u,d),await pn(n)}var Le=!1;async function pn(t){if(Le)return;let e=0,n=[];for(let[u,i]of Object.entries(t))n.push(mt.addAsync(e++,{id:e,slug:u,title:i.title,content:i.content,tags:i.tags}));await Promise.all(n),Le=!0}document.addEventListener("nav",async t=>{let e=t.detail.url,n=await fetchData,u=document.getElementsByClassName("search");for(let i of u)await gn(i,e,n)});\n';import{jsx as jsx28,jsxs as jsxs17}from"preact/jsx-runtime";var defaultOptions13={enablePreview:!0},Search_default=__name((userOpts=>{let Search=__name(({displayClass,cfg})=>{let opts={...defaultOptions13,...userOpts},searchPlaceholder=i18n(cfg.locale).components.search.searchBarPlaceholder;return jsxs17("div",{class:classNames(displayClass,"search"),children:[jsxs17("button",{class:"search-button",children:[jsxs17("svg",{role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 19.9 19.7",children:[jsx28("title",{children:"Search"}),jsxs17("g",{class:"search-path",fill:"none",children:[jsx28("path",{"stroke-linecap":"square",d:"M18.5 18.3l-5.4-5.4"}),jsx28("circle",{cx:"8",cy:"8",r:"7"})]})]}),jsx28("p",{children:i18n(cfg.locale).components.search.title})]}),jsx28("div",{class:"search-container",children:jsxs17("div",{class:"search-space",children:[jsx28("input",{autocomplete:"off",class:"search-bar",name:"search",type:"text","aria-label":searchPlaceholder,placeholder:searchPlaceholder}),jsx28("div",{class:"search-layout","data-preview":opts.enablePreview})]})})]})},"Search");return Search.afterDOMLoaded=search_inline_default,Search.css=search_default,Search}),"default");var footer_default=`footer {
  text-align: left;
  margin-bottom: 4rem;
  opacity: 0.7;
}
footer ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin-top: -1rem;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbImZvb3Rlci5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJmb290ZXIge1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBtYXJnaW4tYm90dG9tOiA0cmVtO1xuICBvcGFjaXR5OiAwLjc7XG5cbiAgJiB1bCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBtYXJnaW46IDA7XG4gICAgcGFkZGluZzogMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgZ2FwOiAxcmVtO1xuICAgIG1hcmdpbi10b3A6IC0xcmVtO1xuICB9XG59XG4iXX0= */`;var version="4.5.2";import{jsx as jsx29,jsxs as jsxs18}from"preact/jsx-runtime";var Footer_default=__name((opts=>{let Footer=__name(({displayClass,cfg})=>{let year=new Date().getFullYear(),links=opts?.links??[];return jsxs18("footer",{class:`${displayClass??""}`,children:[jsxs18("p",{children:[i18n(cfg.locale).components.footer.createdWith," ",jsxs18("a",{href:"https://quartz.jzhao.xyz/",children:["Quartz v",version]})," \xA9 ",year]}),jsx29("ul",{children:Object.entries(links).map(([text,link])=>jsx29("li",{children:jsx29("a",{href:link,children:text})}))})]})},"Footer");return Footer.css=footer_default,Footer}),"default");import{jsx as jsx30}from"preact/jsx-runtime";import{jsx as jsx31}from"preact/jsx-runtime";var MobileOnly_default=__name((component=>{let Component=component,MobileOnly=__name(props=>jsx31(Component,{displayClass:"mobile-only",...props}),"MobileOnly");return MobileOnly.displayName=component.displayName,MobileOnly.afterDOMLoaded=component?.afterDOMLoaded,MobileOnly.beforeDOMLoaded=component?.beforeDOMLoaded,MobileOnly.css=component?.css,MobileOnly}),"default");import{jsx as jsx32,jsxs as jsxs19}from"preact/jsx-runtime";import{jsx as jsx33,jsxs as jsxs20}from"preact/jsx-runtime";import{Fragment as Fragment6,jsx as jsx34}from"preact/jsx-runtime";import{jsx as jsx35}from"preact/jsx-runtime";var Flex_default=__name((config2=>{let Flex=__name(props=>{let direction=config2.direction??"row",wrap=config2.wrap??"nowrap",gap=config2.gap??"1rem";return jsx35("div",{class:classNames(props.displayClass,"flex-component"),style:`flex-direction: ${direction}; flex-wrap: ${wrap}; gap: ${gap};`,children:config2.components.map(c=>{let grow=c.grow?1:0,shrink=c.shrink??!0?1:0,basis=c.basis??"auto",order=c.order??0,align=c.align??"center",justify=c.justify??"center";return jsx35("div",{style:`flex-grow: ${grow}; flex-shrink: ${shrink}; flex-basis: ${basis}; order: ${order}; align-self: ${align}; justify-self: ${justify};`,children:jsx35(c.Component,{...props})})})})},"Flex");return Flex.afterDOMLoaded=concatenateResources(...config2.components.map(c=>c.Component.afterDOMLoaded)),Flex.beforeDOMLoaded=concatenateResources(...config2.components.map(c=>c.Component.beforeDOMLoaded)),Flex.css=concatenateResources(...config2.components.map(c=>c.Component.css)),Flex}),"default");import{jsx as jsx36}from"preact/jsx-runtime";var ConditionalRender_default=__name((config2=>{let ConditionalRender=__name(props=>config2.condition(props)?jsx36(config2.component,{...props}):null,"ConditionalRender");return ConditionalRender.afterDOMLoaded=config2.component.afterDOMLoaded,ConditionalRender.beforeDOMLoaded=config2.component.beforeDOMLoaded,ConditionalRender.css=config2.component.css,ConditionalRender}),"default");import{jsx as jsx37,jsxs as jsxs21}from"preact/jsx-runtime";var ProfileTabs_default=__name((()=>{let ProfileTabs=__name(({displayClass,fileData})=>{let profileId=fileData.frontmatter?.ID;if(!(fileData.frontmatter?.type==="profile")||!profileId)return null;let basePath=pathToRoot(fileData.slug);return jsxs21("div",{class:classNames(displayClass,"profile-tabs"),"data-profile-id":profileId,"data-base-path":basePath,children:[jsxs21("div",{class:"tabs-header",children:[jsx37("button",{class:"tab-button active","data-tab":"biography",children:"\u{1F4D6} Background"}),jsx37("button",{class:"tab-button","data-tab":"media",id:"media-tab-button",style:"display: none;",children:"\u{1F5BC}\uFE0F Gallery"}),jsx37("button",{class:"tab-button","data-tab":"documents",id:"documents-tab-button",style:"display: none;",children:"\u{1F4C4} Documents"})]}),jsxs21("div",{class:"tabs-content",children:[jsx37("div",{class:"tab-pane active","data-tab-content":"biography"}),jsx37("div",{class:"tab-pane","data-tab-content":"media",children:jsx37("div",{id:"media-content",children:jsx37("div",{class:"loading-message",children:"Loading gallery..."})})}),jsx37("div",{class:"tab-pane","data-tab-content":"documents",children:jsx37("div",{id:"documents-content",children:jsx37("div",{class:"loading-message",children:"Loading documents..."})})})]})]})},"ProfileTabs");return ProfileTabs.css=`
.profile-tabs {
  margin: 2rem 0;
}

.tabs-header {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid var(--lightgray);
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: var(--lightgray);
  border: 2px solid var(--lightgray);
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: var(--darkgray);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--gray);
    border-color: var(--gray);
    color: var(--light);
  }
  
  &.active {
    background: var(--secondary);
    border-color: var(--secondary);
    color: white;
  }
}

.tabs-content {
  .tab-pane {
    display: none;
    animation: fadeIn 0.3s ease;
    
    &.active {
      display: block;
    }
  }
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 3rem;
  background: var(--light);
  border-radius: 8px;
  color: var(--gray);
  font-size: 1.1rem;
}

.media-section {
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: var(--dark);
    border-bottom: 2px solid var(--lightgray);
    padding-bottom: 0.5rem;
  }
}

/* Gallery styles - High specificity to override custom.scss */
/* Masonry layout using CSS Multi-column for true masonry effect */
.tab-pane .gallery-grid,
[data-tab-content="media"] .gallery-grid,
.gallery-grid {
  column-count: 2 !important; /* 2 columns for masonry */
  column-gap: 0.75rem !important; /* Gap between columns */
  padding: 0 !important; /* No padding */
  margin-top: 1rem !important;
  break-inside: avoid !important; /* Prevent items from breaking across columns */
}

.tab-pane .gallery-item,
[data-tab-content="media"] .gallery-item,
.gallery-item {
  display: inline-block !important; /* Required for column-count masonry */
  width: 100% !important; /* Full width of column */
  vertical-align: top !important; /* Align items to top */
  border-radius: 0 !important; /* No border radius - cleaner look */
  overflow: visible !important; /* Ensure border and shadow are visible */
  background: transparent !important; /* No background */
  transition: transform 0.2s ease !important;
  margin: 0 0 0.75rem 0 !important; /* Margin bottom for spacing between items */
  cursor: pointer !important;
  break-inside: avoid !important; /* Prevent breaking across columns */
  page-break-inside: avoid !important; /* For older browsers */
  
  &:hover {
    transform: scale(1.01) !important; /* Subtle hover */
    z-index: 10 !important;
  }
  
  img {
    width: 100% !important;
    height: auto !important; /* Natural image height */
    cursor: pointer !important;
    background: white !important;
    display: block !important;
    border: 2px solid #333 !important;
    border-radius: 4px 4px 0 0 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    padding: 0 !important; /* No padding */
    margin: 0 !important; /* No margin */
    object-fit: contain !important; /* Show full image */
    max-width: 100% !important; /* Override base.scss */
    content-visibility: auto !important; /* Override base.scss */
  }
  
  .document-thumbnail {
    width: 100% !important;
    height: auto !important;
    cursor: pointer !important;
    background: white !important;
    display: block !important;
    border: 2px solid #333 !important;
    border-radius: 4px 4px 0 0 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
  }
  
  .document-icon-preview {
    width: 100% !important;
    min-height: 300px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: #f5f5f5 !important;
    border: 2px solid #333 !important;
    border-radius: 4px 4px 0 0 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    font-size: 5rem !important;
    color: #999 !important;
    cursor: pointer !important;
  }
  
  .image-caption {
    padding: 0.35rem 0.5rem !important; /* Very tight padding */
    font-size: 0.85rem !important;
    line-height: 1.3 !important; /* Tighter line height */
    background: #ffffff !important;
    margin: 0 !important; /* No margin */
    border: 1px solid #e1e4e8 !important;
    border-top: none !important; /* No border on top - attached to image */
    border-radius: 0 0 4px 4px !important;
    text-align: left !important;
    color: #666 !important;
    
    a {
      color: #0066cc !important;
      text-decoration: underline !important;
      
      &:hover {
        text-decoration: none !important;
        color: #0052a3 !important;
      }
    }
  }
}

.documents-list {
  padding: 1rem 0;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--light);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: background 0.2s ease;
  
  &:hover {
    background: var(--lightgray);
  }
  
  .document-icon {
    font-size: 2rem;
  }
  
  .document-info {
    flex: 1;
    
    .document-name {
      font-weight: 600;
      color: var(--dark);
      margin-bottom: 0.25rem;
    }
    
    .document-meta {
      font-size: 0.85rem;
      color: var(--gray);
    }
  }
  
  .document-download {
    padding: 0.5rem 1rem;
    background: var(--secondary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    
    &:hover {
      opacity: 0.8;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Chapter tabs (nested inside biography tab) */
.chapter-tabs-container {
  margin: 2rem 0;
}

.chapter-tabs-header {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid var(--lightgray);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.chapter-tab-button {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--gray);
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--darkgray);
    background: var(--lightgray);
  }
  
  &.active {
    color: var(--secondary);
    border-bottom-color: var(--secondary);
  }
}

.chapter-tabs-content {
  .chapter-tab-pane {
    display: none;
    animation: fadeIn 0.3s ease;
    
    &.active {
      display: block;
    }
  }
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .profile-tabs {
    margin: 1rem 0;
  }
  
  .tabs-header {
    gap: 0.2rem;
    margin-bottom: 0.75rem;
  }
  
  .tab-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    flex: 1;
    text-align: center;
    border-radius: 50px;
  }
  
  .chapter-tabs-container {
    margin: 1rem 0;
  }
  
  .chapter-tabs-header {
    gap: 0.15rem;
    margin-bottom: 0.75rem;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.25rem;
  }
  
  .chapter-tab-button {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
    white-space: nowrap;
    flex-shrink: 0;
    border-radius: 50px;
    min-width: fit-content;
  }
  
  /* Better text sizing for mobile */
  .chapter-tab-pane {
    font-size: 0.95rem;
    line-height: 1.6;
    
    h1 {
      font-size: 1.5rem;
      margin: 1rem 0 0.75rem;
    }
    
    h2 {
      font-size: 1.3rem;
      margin: 0.9rem 0 0.6rem;
    }
    
    h3 {
      font-size: 1.1rem;
      margin: 0.8rem 0 0.5rem;
    }
    
    p {
      margin: 0.75rem 0;
    }
    
    img {
      max-width: 100%;
      height: auto;
      margin: 1rem 0;
    }
  }
  
  /* Mermaid diagrams - make scrollable */
  .mermaid {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
    
    svg {
      max-width: none;
      height: auto;
    }
  }
  
  /* Profile info box */
  .profile-info-box {
    margin: 0.75rem 0;
    padding: 0.75rem;
  }
  
  .profile-info-list {
    font-size: 0.85rem;
    
    dt {
      font-size: 0.8rem;
    }
    
    dd {
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }
  }
  
  /* Gallery grid - smaller on mobile */
  .gallery-grid {
    column-count: 2 !important; /* Keep 2 columns on mobile */
    column-gap: 0.5rem !important; /* Even tighter on mobile */
    padding: 0 !important;
  }
  
  .gallery-item .image-caption {
    font-size: 0.75rem !important;
    padding: 0.3rem 0.4rem !important; /* Very tight on mobile */
  }
  
  /* Documents list - stack better */
  .document-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.75rem;
    gap: 0.5rem;
    
    .document-download {
      align-self: stretch;
      text-align: center;
    }
  }
  
  /* Reduce padding everywhere */
  .loading-message,
  .empty-message {
    padding: 2rem 1rem;
    font-size: 1rem;
  }
  
  .media-section h3 {
    font-size: 1.1rem;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .tab-button {
    padding: 0.4rem 0.6rem;
    font-size: 0.7rem;
    border-radius: 50px;
  }
  
  .chapter-tab-button {
    padding: 0.35rem 0.65rem;
    font-size: 0.8rem;
    border-radius: 50px;
  }
  
  .chapter-tab-pane {
    font-size: 0.9rem;
  }
  
  .tabs-header {
    gap: 0.25rem;
  }
  
  .chapter-tabs-header {
    gap: 0.25rem;
  }
}
`,ProfileTabs.afterDOMLoaded=`
// Store cleanup functions for tab button event listeners
let tabButtonCleanups = [];
let chaptersData = null;
let loadedChapters = {}; // Cache for loaded chapter content
let isInitialChapterLoad = true; // Track if this is the first chapter load to avoid duplicate history
let idToSlugMapping = null; // Cache for ID to slug mapping

// Initialize profile tabs - runs on every navigation
function initProfileTabs() {
  console.log('[ProfileTabs] initProfileTabs() called');
  
  // Reset initial chapter load flag for new profile
  isInitialChapterLoad = true;
  
  // Clear cached chapters and data from previous profile
  loadedChapters = {};
  chaptersData = null;
  idToSlugMapping = null; // Reset mapping cache for new profile
  
  // Clean up previous event listeners
  tabButtonCleanups.forEach(function(cleanup) {
    cleanup();
  });
  tabButtonCleanups = [];
  
  const profileTabs = document.querySelector('.profile-tabs');
  console.log('[ProfileTabs] profileTabs element:', profileTabs);
  if (!profileTabs) {
    // Not a profile page, skip initialization
    console.log('[ProfileTabs] No profileTabs found, skipping');
    return;
  }
  
  // Add biography banner will be added later, after we know where profile-tabs is
  
  const profileId = profileTabs.getAttribute('data-profile-id');
  let basePath = profileTabs.getAttribute('data-base-path') || '';
  // Ensure basePath ends with / if it's not empty
  if (basePath && !basePath.endsWith('/')) {
    basePath = basePath + '/';
  }
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const mediaTabButton = document.getElementById('media-tab-button');
  const documentsTabButton = document.getElementById('documents-tab-button');
  
  // Remove emojis from main tabs on mobile
  if (window.innerWidth <= 768) {
    tabButtons.forEach(function(button) {
      const text = button.textContent.trim();
      // Remove emojis (\u{1F4D6}, \u{1F5BC}\uFE0F, \u{1F4C4}) from button text
      button.textContent = text.replace(/\u{1F4D6}|\u{1F5BC}\uFE0F|\u{1F4C4}/g, '').trim();
    });
  }
  
  let mediaLoaded = false;
  let documentsLoaded = false;
  
  // Function to restore tab state from URL hash on initial load
  function restoreTabFromHash() {
    const hash = window.location.hash;
    if (!hash) return;
    
    // Check for tab parameter - support both #tab=biography and #tabbiography formats
    let tabName = null;
    const tabMatchWithEquals = hash.match(/[&?#]tab=([^&]+)/);
    if (tabMatchWithEquals) {
      tabName = tabMatchWithEquals[1];
    } else {
      // Check for format without equals: #tabbiography
      const tabMatchWithoutEquals = hash.match(/[#&]tab([^&]+)/);
      if (tabMatchWithoutEquals) {
        tabName = tabMatchWithoutEquals[1];
      }
    }
    
    if (tabName) {
      console.log('[ProfileTabs] Restoring tab from hash:', tabName);
      
      // Get tab elements
      const tabButton = document.querySelector('[data-tab="' + tabName + '"]');
      const tabPane = document.querySelector('[data-tab-content="' + tabName + '"]');
      
      if (tabButton && tabPane) {
        // Remove active from all tabs
        document.querySelectorAll('.tab-button').forEach(function(btn) {
          btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(function(pane) {
          pane.classList.remove('active');
        });
        
        // Activate the correct tab
        tabButton.classList.add('active');
        tabPane.classList.add('active');
        
        // Load media if switching to gallery tab
        // Always reload media when restoring from hash to ensure it's loaded
        if (tabName === 'media' && profileId) {
          const mediaContent = tabPane.querySelector('#media-content');
          // Check if media is already loaded (has content other than loading message)
          const hasContent = mediaContent && mediaContent.innerHTML && 
                            !mediaContent.innerHTML.includes('Loading') &&
                            !mediaContent.innerHTML.includes('Loading gallery');
          
          if (!hasContent) {
            console.log('[ProfileTabs] Loading media for restored gallery tab');
            loadMedia(profileId);
            mediaLoaded = true;
          }
        }
        
        // Load documents if switching to documents tab
        if (tabName === 'documents' && profileId) {
          const documentsContent = tabPane.querySelector('#documents-content');
          // Check if documents are already loaded
          const hasContent = documentsContent && documentsContent.innerHTML && 
                            !documentsContent.innerHTML.includes('Loading') &&
                            !documentsContent.innerHTML.includes('Loading documents');
          
          if (!hasContent) {
            console.log('[ProfileTabs] Loading documents for restored documents tab');
            loadDocuments(profileId);
            documentsLoaded = true;
          }
        }
      }
    }
  }
  
  console.log('[ProfileTabs] Initializing, profileId:', profileId, 'basePath:', basePath);
  
  if (!profileId) {
    return;
  }
  
  // Load chapters index
  function loadChaptersIndex() {
    fetch(basePath + 'static/chapters-index.json')
      .then(function(response) {
        if (!response.ok) {
          console.log('[ProfileTabs] No chapters index found');
          return null;
        }
        return response.json();
      })
      .then(function(data) {
        if (!data) return;
        
        chaptersData = data[profileId] || null;
        
        if (chaptersData) {
          console.log('[ProfileTabs] Found chapters for profile', profileId, chaptersData);
          
          // Add biography banner ONLY if this profile has chapters
          setTimeout(function() {
            const article = document.querySelector('article');
            const profileTabs = document.querySelector('.profile-tabs');
            const existingBanner = document.querySelector('.biography-banner-top');
            
            if (article && profileTabs && !existingBanner) {
              const banner = document.createElement('div');
              banner.className = 'biography-banner-top';
              banner.innerHTML = '\u{1F4D6} View Biography Chapters Below \u2B07\uFE0F';
              banner.style.cursor = 'pointer';
              banner.addEventListener('click', function() {
                // First, switch to Biography tab if not already active
                const biographyButton = document.querySelector('[data-tab="biography"]');
                const biographyPane = document.querySelector('[data-tab-content="biography"]');
                const currentActiveTab = document.querySelector('.tab-button.active');
                
                // Check if Biography tab is not active
                if (biographyButton && biographyPane && 
                    (!currentActiveTab || currentActiveTab.getAttribute('data-tab') !== 'biography')) {
                  // Remove active from all tabs
                  document.querySelectorAll('.tab-button').forEach(function(btn) {
                    btn.classList.remove('active');
                  });
                  document.querySelectorAll('.tab-pane').forEach(function(pane) {
                    pane.classList.remove('active');
                  });
                  
                  // Activate Biography tab
                  biographyButton.classList.add('active');
                  biographyPane.classList.add('active');
                }
                
                // Wait a bit for tab switch animation, then scroll
                setTimeout(function() {
                  const biographyHeading = document.querySelector('.biography-heading');
                  if (biographyHeading) {
                    biographyHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    // Fallback: scroll to biography tab content
                    const bioTab = document.querySelector('[data-tab-content="biography"]');
                    if (bioTab) {
                      bioTab.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }
                }, 100);
              });
              
              // Insert banner before ProfileTabs in article
              article.insertBefore(banner, profileTabs);
              console.log('[ProfileTabs] Added biography banner');
            }
          }, 150);
          
          // Wait a bit to ensure content has been moved to Biography tab
          setTimeout(function() {
            createChapterTabs(chaptersData);
          }, 200);
        }
      })
      .catch(function(err) {
        console.log('[ProfileTabs] Error loading chapters index:', err);
      });
  }
  
  // Check if profile has media content and show/hide the gallery and documents tabs accordingly
  function checkMediaContent() {
    // Add cache busting to prevent stale cache on mobile browsers
    const cacheBuster = '?t=' + Date.now();
    fetch(basePath + 'static/media-index.json' + cacheBuster, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
      .then(function(response) {
        if (!response.ok) {
          console.log('[ProfileTabs] No media index found');
          return null;
        }
        return response.json();
      })
      .then(function(data) {
        if (!data) return;
        
        const images = data.images[profileId] || [];
        const documents = data.documents[profileId] || [];
        
        console.log('[ProfileTabs] Found', images.length, 'images and', documents.length, 'documents for profile', profileId);
        
        // Show/hide gallery tab based on images
        if (images.length > 0) {
          if (mediaTabButton) {
            mediaTabButton.style.display = 'block';
          }
        } else {
          if (mediaTabButton) {
            mediaTabButton.style.display = 'none';
          }
        }
        
        // Show/hide documents tab based on documents
        if (documents.length > 0) {
          if (documentsTabButton) {
            documentsTabButton.style.display = 'block';
          }
        } else {
          if (documentsTabButton) {
            documentsTabButton.style.display = 'none';
          }
        }
      })
      .catch(function(err) {
        console.log('[ProfileTabs] Error checking media content:', err);
        if (mediaTabButton) {
          mediaTabButton.style.display = 'none';
        }
        if (documentsTabButton) {
          documentsTabButton.style.display = 'none';
        }
      });
  }
  
  // Check media content
  checkMediaContent();
  
  // Move ProfileTabs to article first (if it's in afterBody)
  function moveProfileTabsToArticle() {
    const profileTabs = document.querySelector('.profile-tabs');
    const article = document.querySelector('article');
    
    if (profileTabs && article && profileTabs.parentElement !== article) {
      article.appendChild(profileTabs);
      console.log('[ProfileTabs] Moved ProfileTabs to article');
    }
  }
  
  // Move profile info and diagrams from article to Biography tab
  function moveContentToBiographyTab() {
    const profileTabs = document.querySelector('.profile-tabs');
    const biographyPane = document.querySelector('[data-tab-content="biography"]');
    const article = document.querySelector('article');
    
    if (!profileTabs || !biographyPane || !article) {
      console.log('[ProfileTabs] Cannot find required elements');
      return;
    }
    
    // Move ProfileTabs to article first (if it's in afterBody)
    if (profileTabs.parentElement !== article) {
      article.appendChild(profileTabs);
      console.log('[ProfileTabs] Moved ProfileTabs to article');
    }
    
    // Get all children of article (profile info, diagrams, etc.)
    const articleChildren = Array.from(article.children);
    
    // Find where ProfileTabs is in article
    let profileTabsIndex = -1;
    for (let i = 0; i < articleChildren.length; i++) {
      if (articleChildren[i] === profileTabs) {
        profileTabsIndex = i;
        break;
      }
    }
    
    // Move all content before ProfileTabs to Biography tab
    // This includes profile info, diagrams, and biography content
    if (profileTabsIndex > 0) {
      const elementsToMove = [];
      for (let i = 0; i < profileTabsIndex; i++) {
        elementsToMove.push(articleChildren[i]);
      }
      
      // Process elements: remove placeholders, but keep biography content
      const cleanedElements = [];
      let skipNext = false;
      
      console.log('[ProfileTabs] elementsToMove count:', elementsToMove.length);
      
      elementsToMove.forEach(function(element, index) {
        console.log('[ProfileTabs] Processing element', index, ':', element.tagName, element.textContent ? element.textContent.substring(0, 50) : '');
        
        if (skipNext) {
          skipNext = false;
          return;
        }
        
        // Check if it's a placeholder Biography heading
        if (element.tagName && element.tagName.toLowerCase() === 'h2') {
          if (element.textContent && element.textContent.trim() === 'Biography') {
            // Check if next element is placeholder text
            const nextSibling = element.nextElementSibling;
            if (nextSibling && nextSibling.textContent && 
                nextSibling.textContent.includes('chapters will be loaded')) {
              // Skip both this heading and the next placeholder
              console.log('[ProfileTabs] Removing placeholder Biography heading and text');
              skipNext = true;
              nextSibling.remove();
              element.remove();
              return;
            } else {
              // It's a Biography heading with real content, remove only the heading
              console.log('[ProfileTabs] Removing Biography heading (keeping content after)');
              element.remove();
              return;
            }
          }
        }
        
        // Remove standalone placeholder paragraphs
        if (element.tagName && element.tagName.toLowerCase() === 'p') {
          if (element.textContent && element.textContent.includes('chapters will be loaded')) {
            console.log('[ProfileTabs] Removing placeholder paragraph');
            element.remove();
            return;
          }
        }
        
        // Keep this element
        console.log('[ProfileTabs] Keeping element:', element.tagName);
        cleanedElements.push(element);
      });
      
      // Use cleanedElements (already filtered)
      const validElements = cleanedElements.filter(function(element) {
        return element.parentElement !== null;
      });
      
      // Sort elements: profile info first, then diagrams, then biography content (paragraphs, etc.)
      const profileInfoElements = [];
      const diagramElements = [];
      const biographyContent = [];
      const otherElements = [];
      
      validElements.forEach(function(element) {
        const tagName = element.tagName ? element.tagName.toLowerCase() : '';
        const className = element.className ? element.className.toString() : '';
        
        // Check if it's profile info (dl = definition list)
        if (tagName === 'dl' || 
            (tagName === 'div' && element.querySelector('dl'))) {
          profileInfoElements.push(element);
        }
        // Check if it's a diagram (h2 that's not biography, or mermaid element, or code with mermaid)
        else if ((tagName === 'h2' && element.getAttribute('id') && !element.getAttribute('id').includes('biography')) || 
                 className.includes('mermaid') || 
                 element.querySelector('.mermaid') || 
                 element.querySelector('mermaid') ||
                 (tagName === 'code' && element.textContent && element.textContent.includes('graph'))) {
          diagramElements.push(element);
        }
        // Check if it's biography content (p, ul, ol, blockquote, etc.)
        else if (tagName === 'p' || tagName === 'ul' || tagName === 'ol' || 
                 tagName === 'blockquote' || tagName === 'div' || tagName === 'pre') {
          biographyContent.push(element);
        }
        else {
          otherElements.push(element);
        }
      });
      
      // Move elements in order: profile info, diagrams, biography content, other
      const sortedElements = profileInfoElements.concat(diagramElements).concat(biographyContent).concat(otherElements);
      
      // Remove any remaining placeholder text from biography pane
      const biographyHeading = biographyPane.querySelector('h2');
      if (biographyHeading && biographyHeading.textContent && 
          (biographyHeading.textContent.trim() === 'Biography' || 
           biographyHeading.textContent.trim().includes('Biography'))) {
        const nextSibling = biographyHeading.nextElementSibling;
        if (nextSibling && nextSibling.textContent && 
            nextSibling.textContent.includes('chapters will be loaded')) {
          nextSibling.remove();
        }
        biographyHeading.remove();
      }
      
      // Remove any paragraphs with placeholder text from biography pane
      const placeholderParagraphs = biographyPane.querySelectorAll('p');
      placeholderParagraphs.forEach(function(p) {
        if (p.textContent && p.textContent.includes('chapters will be loaded')) {
          p.remove();
        }
      });
      
      // Clear biography pane first (remove any existing content except chapter tabs)
      const existingChapterTabs = biographyPane.querySelector('.chapter-tabs-container');
      const existingChildren = Array.from(biographyPane.children);
      existingChildren.forEach(function(child) {
        if (child !== existingChapterTabs) {
          child.remove();
        }
      });
      
      // Move elements to Biography tab in order: profile info, diagrams
      // (chapter tabs will be added later by createChapterTabs)
      sortedElements.forEach(function(element) {
        if (existingChapterTabs) {
          // Insert before chapter tabs
          biographyPane.insertBefore(element, existingChapterTabs);
        } else {
          // Append if no chapter tabs yet
          biographyPane.appendChild(element);
        }
      });
      
      console.log('[ProfileTabs] Moved', sortedElements.length, 'elements to Biography tab (sorted)');
      
      // Re-initialize Mermaid diagrams after moving them
      setTimeout(function() {
        if (window.mermaid) {
          // Find all mermaid elements (including code blocks that contain mermaid)
          const mermaidElements = biographyPane.querySelectorAll('.mermaid, mermaid, code.language-mermaid');
          
          mermaidElements.forEach(function(element) {
            try {
              // Check if already initialized
              if (!element.hasAttribute('data-processed')) {
                // If it's a code element, we need to render it
                if (element.tagName && element.tagName.toLowerCase() === 'code') {
                  const mermaidCode = element.textContent;
                  if (mermaidCode) {
                    // Create a new div for mermaid
                    const mermaidDiv = document.createElement('div');
                    mermaidDiv.className = 'mermaid';
                    mermaidDiv.textContent = mermaidCode;
                    element.parentElement.replaceChild(mermaidDiv, element);
                    window.mermaid.init(undefined, mermaidDiv);
                    mermaidDiv.setAttribute('data-processed', 'true');
                  }
                } else {
                  window.mermaid.init(undefined, element);
                  element.setAttribute('data-processed', 'true');
                }
              }
            } catch (e) {
              console.log('[ProfileTabs] Error initializing Mermaid:', e);
            }
          });
          
          // Also try to trigger mermaid rendering if there's a global render function
          if (window.mermaid && typeof window.mermaid.run === 'function') {
            window.mermaid.run();
          }
        }
      }, 500);
    }
  }
  
  
  // Move ProfileTabs to article and content to Biography tab
  // Wait a bit to ensure DOM is ready
  setTimeout(function() {
    moveProfileTabsToArticle();
    moveContentToBiographyTab();
  }, 100);
  
  // Load chapters index
  loadChaptersIndex();
  
  // Create chapter tabs dynamically - inside the biography tab
  function createChapterTabs(chapters) {
    const biographyPane = document.querySelector('[data-tab-content="biography"]');
    if (!biographyPane) return;
    
    // Remove existing chapter tabs if they exist
    const existingChapterTabs = biographyPane.querySelector('.chapter-tabs-container');
    if (existingChapterTabs) {
      existingChapterTabs.remove();
    }
    
    // Create inner tabs structure for chapters inside biography tab
    const chapterTabsContainer = document.createElement('div');
    chapterTabsContainer.className = 'chapter-tabs-container';
    
    // Add Biography heading (for extended biography content below)
    const biographyHeading = document.createElement('h2');
    biographyHeading.className = 'biography-heading';
    biographyHeading.textContent = 'Biography';
    chapterTabsContainer.appendChild(biographyHeading);
    
    // Create chapter tabs header
    const chapterTabsHeader = document.createElement('div');
    chapterTabsHeader.className = 'chapter-tabs-header';
    
    // Create chapter tabs content
    const chapterTabsContent = document.createElement('div');
    chapterTabsContent.className = 'chapter-tabs-content';
    
    // Determine which chapter should be active initially
    const hash = window.location.hash;
    // Check if we're in media tab - if so, don't load chapters
    const isMediaTab = hash && hash.includes('tab=media');
    // Only extract chapter from hash if hash actually contains #chapter=
    // This prevents auto-scrolling when clicking plain profile links
    const hasChapterHash = hash && hash.includes('#chapter=');
    const initialChapterSlug = !isMediaTab && hasChapterHash
      ? hash.substring(hash.indexOf('#chapter=') + 9).split('&')[0].split('#')[0].trim()
      : null;
    
    // Add main chapter tab (Introduction) if exists
    if (chapters.main) {
      const mainButton = document.createElement('button');
      // Only set active if this is the initial chapter from URL hash
      const isInitialChapter = initialChapterSlug === chapters.main.slug;
      mainButton.className = 'chapter-tab-button' + (isInitialChapter ? ' active' : '');
      mainButton.setAttribute('data-chapter-tab', 'introduction');
      mainButton.setAttribute('data-chapter-slug', chapters.main.slug);
      // Remove emoji on mobile
      mainButton.textContent = window.innerWidth <= 768 ? 'Introduction' : '\u{1F4D6} Introduction';
      chapterTabsHeader.appendChild(mainButton);
      
      const mainPane = document.createElement('div');
      // Set active only if this is the initial chapter from hash, otherwise default to active for main chapter
      mainPane.className = 'chapter-tab-pane' + (isInitialChapter || !hasChapterHash ? ' active' : '');
      mainPane.setAttribute('data-chapter-tab-content', 'introduction');
      mainPane.setAttribute('data-chapter-slug', chapters.main.slug);
      mainPane.innerHTML = '<div class="loading-message">Loading chapter...</div>';
      chapterTabsContent.appendChild(mainPane);
    }
    
    // Add chapter tabs
    chapters.chapters.forEach(function(chapter, index) {
      const chapterButton = document.createElement('button');
      // Set active if this is the initial chapter from URL
      const isInitialChapter = initialChapterSlug === chapter.slug;
      chapterButton.className = 'chapter-tab-button' + (isInitialChapter ? ' active' : '');
      chapterButton.setAttribute('data-chapter-tab', 'chapter-' + (index + 1));
      chapterButton.setAttribute('data-chapter-slug', chapter.slug);
      // Remove emoji on mobile
      chapterButton.textContent = window.innerWidth <= 768 ? chapter.title : '\u{1F4C4} ' + chapter.title;
      chapterTabsHeader.appendChild(chapterButton);
      
      const chapterPane = document.createElement('div');
      chapterPane.className = 'chapter-tab-pane' + (isInitialChapter ? ' active' : '');
      chapterPane.setAttribute('data-chapter-tab-content', 'chapter-' + (index + 1));
      chapterPane.setAttribute('data-chapter-slug', chapter.slug);
      chapterPane.innerHTML = '<div class="loading-message">Loading chapter...</div>';
      chapterTabsContent.appendChild(chapterPane);
    });
    
    // Append tabs header and content to container
    chapterTabsContainer.appendChild(chapterTabsHeader);
    chapterTabsContainer.appendChild(chapterTabsContent);
    
    // Insert chapter tabs at the end of biography pane (after profile info and diagrams)
    // Find all non-chapter-tab elements and insert chapter tabs after them
    const existingContent = Array.from(biographyPane.children).filter(function(child) {
      return !child.classList.contains('chapter-tabs-container');
    });
    
    if (existingContent.length > 0) {
      // Insert after the last non-chapter-tab element
      const lastElement = existingContent[existingContent.length - 1];
      biographyPane.insertBefore(chapterTabsContainer, lastElement.nextSibling);
    } else {
      // If no existing content, just append
      biographyPane.appendChild(chapterTabsContainer);
    }
    
    // Setup chapter tab switching after tabs are created
    setTimeout(function() {
      document.querySelectorAll('.chapter-tab-button').forEach(function(button) {
        const clickHandler = function() {
          const chapterSlug = button.getAttribute('data-chapter-slug');
          if (chapterSlug) {
            switchToChapter(chapterSlug);
          }
        };
        
        button.addEventListener('click', clickHandler);
        tabButtonCleanups.push(function() {
          button.removeEventListener('click', clickHandler);
        });
      });
    }, 50);
    
    // Load the initial chapter ONLY if there's a hash fragment with #chapter=
    // This prevents auto-scrolling when clicking plain profile links
    const currentHash = window.location.hash;
    const isCurrentlyMediaTab = currentHash && currentHash.includes('tab=media');
    const hasChapterInHash = currentHash && currentHash.includes('#chapter=');
    if (initialChapterSlug && !isCurrentlyMediaTab && hasChapterInHash) {
      // Wait a bit to ensure switchToChapter function is defined
      setTimeout(function() {
        if (typeof switchToChapter === 'function') {
          switchToChapter(initialChapterSlug);
        } else {
          console.log('[ProfileTabs] switchToChapter not yet defined, retrying...');
          setTimeout(function() {
            if (typeof switchToChapter === 'function') {
              switchToChapter(initialChapterSlug);
            }
          }, 100);
        }
      }, 50);
    } else if (!hasChapterInHash && chapters.main) {
      // If no chapter hash, load main chapter content without scrolling
      // This ensures the main chapter is displayed but doesn't trigger scroll
      setTimeout(function() {
        if (typeof loadChapter === 'function') {
          loadChapter(chapters.main.slug);
        }
      }, 50);
    }
    
    // After creating chapter tabs, restore tab state from hash if needed
    // This ensures tab state is restored even if createChapterTabs was delayed
    setTimeout(function() {
      const hash = window.location.hash;
      if (hash && hash.includes('tab=media')) {
        console.log('[ProfileTabs] Restoring media tab after createChapterTabs');
        restoreTabFromHash();
      }
    }, 100);
  }
  
  // Switch to chapter (works with inner chapter tabs)
  function switchToChapter(chapterSlug, fromPopstate) {
    // Clean chapterSlug to ensure it doesn't contain hash fragments or parameters
    if (chapterSlug) {
      chapterSlug = chapterSlug.split('&')[0].split('#')[0].trim();
    }
    
    console.log('[ProfileTabs] Switching to chapter:', chapterSlug, 'fromPopstate:', fromPopstate);
    
    // Remove active from all chapter tab buttons
    document.querySelectorAll('.chapter-tab-button').forEach(function(button) {
      button.classList.remove('active');
    });
    
    // Remove active from all chapter tab panes
    document.querySelectorAll('.chapter-tab-pane').forEach(function(pane) {
      pane.classList.remove('active');
    });
    
    // Find and activate the correct chapter tab button
    const chapterTabButton = document.querySelector('.chapter-tab-button[data-chapter-slug="' + chapterSlug + '"]');
    if (chapterTabButton) {
      chapterTabButton.classList.add('active');
    }
    
    // Find and activate the correct chapter tab pane
    const chapterTabPane = document.querySelector('.chapter-tab-pane[data-chapter-slug="' + chapterSlug + '"]');
    if (chapterTabPane) {
      chapterTabPane.classList.add('active');
    }
    
    // Make sure biography tab is active (only if not explicitly in media tab)
    // Check current hash to see if we should stay in media tab
    const currentHash = window.location.hash;
    const isMediaTab = currentHash && currentHash.includes('tab=media');
    
    if (!isMediaTab) {
      const biographyButton = document.querySelector('[data-tab="biography"]');
      const biographyPane = document.querySelector('[data-tab-content="biography"]');
      if (biographyButton && biographyPane) {
        // Remove active from ALL main tabs first
        document.querySelectorAll('.tab-button').forEach(function(btn) {
          btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-pane').forEach(function(pane) {
          pane.classList.remove('active');
        });
        
        // Then activate biography
        biographyButton.classList.add('active');
        biographyPane.classList.add('active');
      }
    }
    
    // Load chapter content if not already loaded
    loadChapter(chapterSlug);
    
    // Save isInitialChapterLoad before it changes
    const shouldScrollToChapter = isInitialChapterLoad && !fromPopstate;
    
    // Update URL hash ONLY if not from popstate (to avoid double history entry)
    if (!fromPopstate) {
      const newUrl = window.location.pathname + '#chapter=' + chapterSlug + '&tab=biography';
      
      // Use replaceState for initial load (to avoid duplicate history entry)
      // Use pushState for user-initiated chapter changes
      if (isInitialChapterLoad) {
        history.replaceState({ chapter: chapterSlug, tab: 'biography' }, '', newUrl);
        isInitialChapterLoad = false; // Mark that we've done initial load
      } else {
        history.pushState({ chapter: chapterSlug, tab: 'biography' }, '', newUrl);
      }
    }
    
    // Auto-scroll to chapter if loading from URL hash (initial load)
    // Check if this is an initial load from URL hash
    if (shouldScrollToChapter) {
      // Wait for content to load, then scroll to chapter tab container
      setTimeout(function() {
        const chapterTabsContainer = document.querySelector('.chapter-tabs-container');
        if (chapterTabsContainer) {
          chapterTabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback: scroll to chapter pane
          const chapterPane = document.querySelector('.chapter-tab-pane[data-chapter-slug="' + chapterSlug + '"].active');
          if (chapterPane) {
            chapterPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 500); // Wait longer for content to load
    }
  }
  
  // Load chapter content
  function loadChapter(chapterSlug) {
    // Clean chapterSlug to ensure it doesn't contain hash fragments or parameters
    if (chapterSlug) {
      chapterSlug = chapterSlug.split('&')[0].split('#')[0].trim();
    }
    
    if (loadedChapters[chapterSlug]) {
      // Already loaded, just display it
      displayChapter(chapterSlug, loadedChapters[chapterSlug]);
      return;
    }
    
    // Find the chapter filename from chaptersData
    var chapterFilename = null;
    if (chaptersData) {
      // Check main chapter
      if (chaptersData.main && chaptersData.main.slug === chapterSlug) {
        chapterFilename = chaptersData.main.filename;
      } else {
        // Check other chapters
        for (var i = 0; i < chaptersData.chapters.length; i++) {
          if (chaptersData.chapters[i].slug === chapterSlug) {
            chapterFilename = chaptersData.chapters[i].filename;
            break;
          }
        }
      }
    }
    
    // Use filename if found, otherwise use slug
    var chapterFile = chapterFilename || (chapterSlug + '.md');
    const chapterPath = basePath + 'static/chapters/' + profileId + '/' + chapterFile;
    console.log('[ProfileTabs] Loading chapter:', chapterPath, '(slug:', chapterSlug + ')');
    
    // Load ID to slug mapping first, then fetch and parse chapter
    loadIdToSlugMapping(basePath).then(function() {
      return fetch(chapterPath + '?t=' + Date.now());
    })
      .then(function(response) {
        if (!response.ok) {
          console.log('[ProfileTabs] Chapter not found:', chapterPath, 'status:', response.status);
          throw new Error('Chapter not found: ' + chapterPath);
        }
        return response.text();
      })
      .then(function(content) {
        // Parse Markdown to HTML (simple conversion)
        const html = parseMarkdownToHTML(content, chaptersData, profileId, basePath);
        loadedChapters[chapterSlug] = html;
        displayChapter(chapterSlug, html);
      })
      .catch(function(err) {
        console.log('[ProfileTabs] Error loading chapter:', err);
        const pane = document.querySelector('.chapter-tab-pane[data-chapter-slug="' + chapterSlug + '"]');
        if (pane) {
          pane.innerHTML = '<div class="empty-message">Error loading chapter: ' + err.message + '</div>';
        }
      });
  }
  
  // Display chapter content
  function displayChapter(chapterSlug, html) {
    // Find the chapter tab pane (not the main tab pane)
    const pane = document.querySelector('.chapter-tab-pane[data-chapter-slug="' + chapterSlug + '"]');
    if (pane) {
      pane.innerHTML = html;
      
      // Convert chapter links to clickable buttons
      const chapterLinks = pane.querySelectorAll('.chapter-link');
      console.log('[ProfileTabs] Found', chapterLinks.length, 'chapter links in', chapterSlug);
      chapterLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const targetSlug = link.getAttribute('data-chapter-slug');
          console.log('[ProfileTabs] Chapter link clicked, target:', targetSlug);
          if (targetSlug) {
            switchToChapter(targetSlug, false);
          }
        });
      });
      
      // Re-initialize Mermaid diagrams if present
      setTimeout(function() {
        if (window.mermaid) {
          const mermaidElements = pane.querySelectorAll('.mermaid, mermaid, code.language-mermaid');
          mermaidElements.forEach(function(element) {
            try {
              if (!element.hasAttribute('data-processed')) {
                if (element.tagName && element.tagName.toLowerCase() === 'code') {
                  const mermaidCode = element.textContent;
                  if (mermaidCode) {
                    const mermaidDiv = document.createElement('div');
                    mermaidDiv.className = 'mermaid';
                    mermaidDiv.textContent = mermaidCode;
                    element.parentElement.replaceChild(mermaidDiv, element);
                    window.mermaid.init(undefined, mermaidDiv);
                    mermaidDiv.setAttribute('data-processed', 'true');
                  }
                } else {
                  window.mermaid.init(undefined, element);
                  element.setAttribute('data-processed', 'true');
                }
              }
            } catch (e) {
              console.log('[ProfileTabs] Error initializing Mermaid:', e);
            }
          });
        }
      }, 100);
    }
  }
  
  // Load ID to slug mapping (cached)
  function loadIdToSlugMapping(basePath) {
    if (idToSlugMapping !== null) {
      return Promise.resolve(idToSlugMapping);
    }
    
    return fetch(basePath + 'static/id-to-slug.json')
      .then(function(response) {
        if (!response.ok) {
          console.log('[ProfileTabs] Could not load id-to-slug.json');
          return {};
        }
        return response.json();
      })
      .then(function(mapping) {
        idToSlugMapping = mapping;
        return mapping;
      })
      .catch(function(err) {
        console.log('[ProfileTabs] Error loading id-to-slug.json:', err);
        idToSlugMapping = {}; // Cache empty mapping to avoid repeated requests
        return {};
      });
  }
  
  // Simple Markdown to HTML parser (basic conversion)
  function parseMarkdownToHTML(markdown, chaptersDataForLinks, profileIdForImages, basePathForImages) {
    var html = markdown;
    
    // Normalize line endings: convert CRLF to LF, then CR to LF
    var CR = String.fromCharCode(13);
    var LF = String.fromCharCode(10);
    var CRLF = CR + LF;
    html = html.split(CRLF).join(LF).split(CR).join(LF);
    
    // Detect base path from current URL (e.g., /FamilyHistory/ for GitHub Pages)
    // Must be defined before code blocks processing
    var siteBasePath = '';
    if (typeof window !== 'undefined') {
      var currentPath = window.location.pathname;
      // Extract base path: if path is /FamilyHistory/profiles/..., extract /FamilyHistory
      if (currentPath.indexOf('/profiles/') > 0) {
        var beforeProfiles = currentPath.substring(0, currentPath.indexOf('/profiles/'));
        // If beforeProfiles is not empty and not just '/', it's our base path
        if (beforeProfiles && beforeProfiles !== '' && beforeProfiles !== '/') {
          siteBasePath = beforeProfiles;
        }
      }
    }
    
    // Code blocks (triple backticks) - must be processed FIRST before any other Markdown
    // Match code blocks with optional language
    var backtick = String.fromCharCode(96);
    // Allow optional whitespace after opening backticks and language tag
    var codeBlockPattern = backtick + backtick + backtick + '(\\\\w+)?\\\\s*([\\\\s\\\\S]*?)' + backtick + backtick + backtick;
    var codeBlockRegex = new RegExp(codeBlockPattern, 'g');
    
    // Process code blocks - convert [Name|ID] and [Name](/profiles/...) links to HTML
    // Note: This is synchronous, so we need to handle async loading of id-to-slug mapping
    // For now, we'll process code blocks synchronously and use cached mapping if available
    html = html.replace(codeBlockRegex, function(match, lang, code) {
      // Remove leading/trailing newlines from code
      code = code.replace(/^\\n+|\\n+$/g, '');
      
      // Convert [Name|ID] format to Markdown links [Name](/profiles/Slug)
      // Use cached id-to-slug mapping if available
      code = code.replace(/\\[([^\\|]+)\\|(I\\d+)\\]/g, function(match, name, id) {
        // Try to find the slug for this ID from cached mapping
        var slug = id; // Default to ID if mapping not available
        if (idToSlugMapping && idToSlugMapping[id]) {
          slug = idToSlugMapping[id];
        } else {
          // If mapping not available, log warning but keep ID (will be checked later)
          console.log('[ProfileTabs] Warning: ID to slug mapping not available for', id, '- using ID as fallback');
        }
        return '[' + name + '](/profiles/' + encodeURIComponent(slug) + ')';
      });
      
      // Also handle [Name|numeric] format (if any exist - though they shouldn't)
      code = code.replace(/\\[([^\\|]+)\\|(\\d+)\\]/g, function(match, name, numericId) {
        // Try to find the slug for this numeric ID (with I prefix)
        var idWithPrefix = 'I' + numericId;
        var slug = numericId; // Default to numeric ID if mapping not available
        if (idToSlugMapping && idToSlugMapping[idWithPrefix]) {
          slug = idToSlugMapping[idWithPrefix];
        } else if (idToSlugMapping && idToSlugMapping[numericId]) {
          slug = idToSlugMapping[numericId];
        } else {
          console.log('[ProfileTabs] Warning: Could not find slug for numeric ID', numericId, '- using as-is');
        }
        return '[' + name + '](/profiles/' + encodeURIComponent(slug) + ')';
      });
      
      // Convert Markdown links [Name](/profiles/...) to HTML links inside code blocks
      // Pattern: [text](/profiles/something)
      var codeLinkPattern = new RegExp('\\\\[([^\\\\]]+)\\\\]\\\\(\\\\/profiles\\\\/([^)]+)\\\\)', 'g');
      code = code.replace(codeLinkPattern, function(match, text, pathPart) {
        // Check if this is a broken link (ID or number instead of slug)
        // Broken links: just a number (141), or ID pattern (I123)
        var isBroken = /^[0-9]+$/.test(pathPart) || /^I\\d+$/.test(pathPart);
        
        if (isBroken) {
          // Try to find the slug for this ID
          var slug = pathPart; // Default to original if not found
          
          if (idToSlugMapping) {
            // First try exact match
            if (idToSlugMapping[pathPart]) {
              slug = idToSlugMapping[pathPart];
            } else if (/^[0-9]+$/.test(pathPart)) {
              // If it's a number, try with I prefix
              var idWithPrefix = 'I' + pathPart;
              if (idToSlugMapping[idWithPrefix]) {
                slug = idToSlugMapping[idWithPrefix];
              } else {
                console.log('[ProfileTabs] Warning: Could not find slug for numeric ID', pathPart, 'or', idWithPrefix);
              }
            } else {
              console.log('[ProfileTabs] Warning: Could not find slug for ID', pathPart);
            }
          } else {
            console.log('[ProfileTabs] Warning: ID to slug mapping not loaded yet for link', pathPart);
          }
          
          pathPart = slug;
        }
        
        // Check if pathPart is already URL-encoded (contains % followed by hex digits)
        // If it's already encoded, use it as-is; otherwise encode it
        var isAlreadyEncoded = /%[0-9A-Fa-f]{2}/.test(pathPart);
        var finalPath = isAlreadyEncoded ? pathPart : encodeURIComponent(pathPart);
        
        return '<a href="' + siteBasePath + '/profiles/' + finalPath + '">' + text + '</a>';
      });
      
      // Escape remaining HTML in code (but keep the links we just created)
      // We need to be careful not to escape the <a> tags we just added
      var parts = code.split(/(<a[^>]*>.*?<\\/a>)/g);
      code = parts.map(function(part) {
        if (part.match(/^<a[^>]*>.*?<\\/a>$/)) {
          // This is a link we created, don't escape it
          return part;
        } else {
          // Escape HTML in other parts
          return part.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
      }).join('');
      
      var langAttr = lang ? ' class="language-' + lang + '"' : '';
      return '<pre><code' + langAttr + '>' + code + '</code></pre>';
    });
    
    // Images ![[image.png]] - MUST be processed BEFORE bold/italic/links
    html = html.replace(/!\\[\\[([^\\]]+)\\]\\]/g, function(match, imagePath) {
      // Extract filename from path
      var filename = imagePath.split('/').pop();
      // Images are in site/content/ and served directly by Quartz
      // Replace both spaces AND underscores with dashes to match what doit.py copies
      var filenameWithDashes = filename.replace(/[ _]/g, '-');
      // Use the basePath parameter if provided (from enclosing scope)
      var imageBasePath = basePathForImages || '';
      var imageSrc = imageBasePath + filenameWithDashes;
      var imageSrcWithSpaces = imageBasePath + encodeURIComponent(filename);
      // Escape quotes properly for HTML attribute
      var escapedFilename = filename.replace(/"/g, '&quot;');
      // Try with spaces if dashes fail (fallback)
      return '<img src="' + imageSrc + '" alt="' + escapedFilename + '" onerror="this.src=&quot;' + imageSrcWithSpaces + '&quot;">';
    });
    
    // Convert external links [text](https://...) to HTML FIRST (before profile links)
    // Pattern: [text](url) where url is NOT /profiles/...
    var externalLinkPattern = new RegExp('\\\\[([^\\\\]]+)\\\\]\\\\((https?://[^)]+)\\\\)', 'g');
    html = html.replace(externalLinkPattern, function(match, text, url) {
      return '<a href="' + url + '">' + text + '</a>';
    });
    
    // Fix absolute profile links by adding base path
    // Pattern: [text](/profiles/something) -> capture text and path
    // IMPORTANT: This must come AFTER external links to avoid matching them
    var linkPattern = new RegExp('\\\\[([^\\\\]]+)\\\\]\\\\((\\\\/profiles\\\\/[^)]+)\\\\)', 'g');
    html = html.replace(linkPattern, function(match, text, path) {
      return '<a href="' + siteBasePath + path + '">' + text + '</a>';
    });
    
    // Ordered lists (1. item, 2. item, etc.) - MUST be processed BEFORE converting [[links]]
    // Otherwise the links will be converted to HTML and the list detection won't work properly
    var lines = html.split('\\n');
    var inList = false;
    var listHtml = '';
    var processedLines = [];
    
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var listMatch = line.match(/^(\\d+)\\.\\s+(.*)$/);
      
      if (listMatch) {
        if (!inList) {
          inList = true;
          listHtml = '<ol>';
        }
        listHtml += '<li>' + listMatch[2] + '</li>';
      } else {
        if (inList) {
          listHtml += '</ol>';
          processedLines.push(listHtml);
          listHtml = '';
          inList = false;
        }
        processedLines.push(line);
      }
    }
    
    if (inList) {
      listHtml += '</ol>';
      processedLines.push(listHtml);
    }
    
    html = processedLines.join('\\n');
    
    // Links [[slug|Display Text]] or [[slug]] - convert to chapter links (MUST be after lists, before bold/italic)
    html = html.replace(/\\[\\[([^\\]]+)\\]\\]/g, function(match, text) {
      // Split by | to get slug and display text
      var parts = text.split('|');
      var slug = parts[0].trim();
      var displayText = parts.length > 1 ? parts[1].trim() : slug;
      
      // Extract filename from full path if present (e.g., "bios/I39965449/02-arrival_australia" -> "02-arrival_australia")
      if (slug.includes('/')) {
        var pathParts = slug.split('/');
        slug = pathParts[pathParts.length - 1];
      }
      
      // Try to find matching chapter by name or slug
      var targetSlug = null;
      if (chaptersDataForLinks) {
        // Check if it matches a chapter name or slug
        var normalizedSlug = slug.toLowerCase().replace(/_/g, '-');
        
        // Check main chapter
        if (chaptersDataForLinks.main && (
          chaptersDataForLinks.main.slug === normalizedSlug ||
          chaptersDataForLinks.main.name.toLowerCase() === normalizedSlug ||
          chaptersDataForLinks.main.filename.toLowerCase().replace('.md', '') === normalizedSlug
        )) {
          targetSlug = chaptersDataForLinks.main.slug;
        } else {
          // Check other chapters - try exact match first
          for (var i = 0; i < chaptersDataForLinks.chapters.length; i++) {
            var chapter = chaptersDataForLinks.chapters[i];
            var chapterNameNormalized = chapter.name.toLowerCase().replace(/_/g, '-');
            var chapterFilenameNormalized = chapter.filename.toLowerCase().replace('.md', '').replace(/_/g, '-');
            
            if (chapter.slug === normalizedSlug ||
                chapterNameNormalized === normalizedSlug ||
                chapterFilenameNormalized === normalizedSlug ||
                chapter.title.toLowerCase() === normalizedSlug) {
              targetSlug = chapter.slug;
              break;
            }
            
            // Try to match by removing leading numbers (e.g., "02-in_russia" matches "01-in-russia")
            var slugWithoutNumbers = normalizedSlug.replace(/^\\d+-/, '');
            var chapterNameWithoutNumbers = chapterNameNormalized.replace(/^\\d+-/, '');
            var chapterFilenameWithoutNumbers = chapterFilenameNormalized.replace(/^\\d+-/, '');
            
            if (slugWithoutNumbers === chapterNameWithoutNumbers ||
                slugWithoutNumbers === chapterFilenameWithoutNumbers) {
              targetSlug = chapter.slug;
              break;
            }
          }
        }
        
        // If no match found, try to create slug from text
        if (!targetSlug) {
          targetSlug = normalizedSlug;
        }
      } else {
        // Fallback: create slug from text
        targetSlug = slug.replace(/_/g, '-').toLowerCase();
      }
      
      return '<a href="javascript:void(0)" class="chapter-link" data-chapter-slug="' + targetSlug + '">' + displayText + '</a>';
    });
    
    // Store HTML blocks (img, a, pre, code tags) before processing bold/italic
    // to prevent markdown processing inside HTML attributes
    var htmlBlocks = [];
    var htmlBlockIndex = 0;
    
    // Replace HTML blocks with placeholders (process each type separately for safety)
    // First, replace img tags (self-closing)
    html = html.replace(/<img[^>]*>/g, function(match) {
      var placeholder = '___HTML_BLOCK_' + htmlBlockIndex + '___';
      htmlBlocks[htmlBlockIndex] = match;
      htmlBlockIndex++;
      return placeholder;
    });
    
    // Then replace other HTML tags (with content)
    // Process links inside <pre><code> blocks before storing them
    html = html.replace(/<(a|pre|code)([^>]*)>([\\s\\S]*?)<\\/(a|pre|code)>/g, function(match, tag1, attrs, content, tag2) {
      var processedMatch = match;
      // If this is a <pre><code> block, process links inside it
      if (tag1 === 'pre' && content.indexOf('<code') !== -1) {
        // Process markdown links inside the code block content
        processedMatch = match.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>');
      }
      var placeholder = '___HTML_BLOCK_' + htmlBlockIndex + '___';
      htmlBlocks[htmlBlockIndex] = processedMatch;
      htmlBlockIndex++;
      return placeholder;
    });
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Process bold and italic only in text segments (not in placeholders)
    // Split by placeholders, process each segment, then rejoin
    var segments = html.split(/(___HTML_BLOCK_\\d+___)/);
    for (var i = 0; i < segments.length; i++) {
      // Skip placeholders (they match the pattern ___HTML_BLOCK_N___)
      if (!segments[i].match(/^___HTML_BLOCK_\\d+___$/)) {
        // Bold
        segments[i] = segments[i].replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
        // Italic with *
        segments[i] = segments[i].replace(/\\*(.*?)\\*/g, '<em>$1</em>');
        // Italic with _ (match underscores not preceded/followed by word characters)
        // Captures: $1 = prefix (space/punctuation/start), $2 = content, $3 = suffix (space/punctuation/end)
        segments[i] = segments[i].replace(/(^|[^_\\w])_([^_]+)_((?=[^_\\w])|$)/g, '$1<em>$2</em>$3');
      }
    }
    html = segments.join('');
    
    // External links [text](url) - process BEFORE restoring HTML blocks
    // This allows links inside code blocks to be processed
    html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>');
    
    // Restore HTML blocks and process links inside code blocks
    html = html.replace(/___HTML_BLOCK_(\\d+)___/g, function(match, index) {
      var block = htmlBlocks[parseInt(index)];
      // Process links inside <pre><code> blocks
      if (block && block.indexOf('<pre') !== -1 && block.indexOf('<code') !== -1) {
        // Links inside code blocks should already be processed by the regex above
        // But if they weren't (because they were stored as placeholders), process them now
        block = block.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>');
      }
      return block;
    });
    
    // Handle line breaks (two spaces at end of line = <br>)
    // This must be done BEFORE paragraph processing
    // Support both Unix and Windows line endings
    html = html.replace(/  \\r?\\n/g, '<br>\\n');
    
    // First, extract and preserve multi-line HTML blocks (div, blockquote, etc.)
    // This prevents them from being broken by paragraph splitting
    var htmlBlocks = [];
    var htmlBlockCounter = 0;
    var htmlBlockPlaceholder = '___HTML_BLOCK_PLACEHOLDER___';
    
    // Match HTML blocks that span multiple lines (e.g., <div class="citation-box">...</div>)
    // This regex matches opening tag, content (including newlines), and closing tag
    // Use capturing groups: group 1 = full opening tag, group 2 = tag name, group 3 = content
    var htmlBlockRegex = new RegExp('<((div|blockquote|pre|ul|ol|table)[^>]*)>([\\s\\S]*?)</(div|blockquote|pre|ul|ol|table)>', 'gi');
    html = html.replace(htmlBlockRegex, function(match, fullTag, tagName1, content, tagName2) {
      var placeholder = htmlBlockPlaceholder + htmlBlockCounter + '___';
      htmlBlocks[htmlBlockCounter] = match;
      htmlBlockCounter++;
      return placeholder;
    });
    
    // Paragraphs - split by double newlines
    // But preserve HTML blocks (div, blockquote, pre, etc.)
    var paragraphs = html.split(/\\n\\n/);
    html = paragraphs.map(function(p) {
      p = p.trim();
      if (!p) return '';
      
      // If it's a placeholder for an HTML block, restore it
      var placeholderMatch = p.match(new RegExp(htmlBlockPlaceholder + '(\\d+)___'));
      if (placeholderMatch) {
        var blockIndex = parseInt(placeholderMatch[1]);
        return htmlBlocks[blockIndex];
      }
      
      // If it's already an HTML block element, don't wrap in <p>
      if (p.match(/^<(div|blockquote|pre|ul|ol|table|h[1-6]|hr)/i)) {
        return p;
      }
      
      // If it starts with a closing tag, don't wrap
      if (p.match(/^<\\//)) {
        return p;
      }
      
      // If it's a complete HTML block (has both opening and closing tags), don't wrap
      if (p.match(/^<[^>]+>.*<\\/[^>]+>$/)) {
        return p;
      }
      
      // Otherwise, wrap in <p> tag
      if (p && !p.match(/^<[h|d|u|o|l]/)) {
        return '<p>' + p + '</p>';
      }
      return p;
    }).join('\\n');
    
    // Inline code (single backticks) - escape backticks properly
    // Must be after code blocks to avoid matching triple backticks
    var inlineCodeRegex = /\`([^\`]+)\`/g;
    html = html.replace(inlineCodeRegex, '<code>$1</code>');
    
    return html;
  }
  
  // Load PDF.js and render first page as thumbnail
  function loadPdfThumbnail(pdfUrl, canvas) {
    // Check if PDF.js is already loaded
    if (typeof window.pdfjsLib === 'undefined') {
      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="pdf.js"]');
      if (existingScript) {
        // Wait for it to load
        existingScript.addEventListener('load', function() {
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            renderPdfThumbnail(pdfUrl, canvas);
          }
        });
        return;
      }
      
      // Load PDF.js from CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = function() {
        if (window.pdfjsLib) {
          // Set worker path
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          renderPdfThumbnail(pdfUrl, canvas);
        }
      };
      script.onerror = function() {
        console.error('Failed to load PDF.js');
        showPdfError(canvas);
      };
      document.head.appendChild(script);
    } else {
      renderPdfThumbnail(pdfUrl, canvas);
    }
  }
  
  function showPdfError(canvas) {
    const ctx = canvas.getContext('2d');
    const maxWidth = 600;
    const maxHeight = 400;
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, maxWidth, maxHeight);
    ctx.fillStyle = '#999';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PDF Preview', maxWidth / 2, maxHeight / 2);
  }
  
  function renderPdfThumbnail(pdfUrl, canvas) {
    if (!window.pdfjsLib) {
      showPdfError(canvas);
      return;
    }
    
    const ctx = canvas.getContext('2d');
    const scale = 2; // Higher scale for better quality
    const maxWidth = 600; // Match image width in gallery
    const maxHeight = 800; // Match image max height
    
    // Show loading state
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, maxWidth, maxHeight);
    ctx.fillStyle = '#999';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', maxWidth / 2, maxHeight / 2);
    
    window.pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
      return pdf.getPage(1); // Get first page
    }).then(function(page) {
      // Get the viewport at scale 1 to get the natural page dimensions
      const naturalViewport = page.getViewport({ scale: 1 });
      const naturalWidth = naturalViewport.width;
      const naturalHeight = naturalViewport.height;
      const aspectRatio = naturalWidth / naturalHeight;
      
      // Calculate dimensions to fit in maxWidth x maxHeight while maintaining aspect ratio
      let canvasWidth = naturalWidth;
      let canvasHeight = naturalHeight;
      
      // Fit to max dimensions while maintaining aspect ratio
      if (canvasWidth > maxWidth || canvasHeight > maxHeight) {
        if (canvasWidth / maxWidth > canvasHeight / maxHeight) {
          canvasWidth = maxWidth;
          canvasHeight = canvasWidth / aspectRatio;
        } else {
          canvasHeight = maxHeight;
          canvasWidth = canvasHeight * aspectRatio;
        }
      }
      
      // Set canvas size to match the calculated dimensions
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Calculate the scale needed to render the page at the canvas size
      const renderScale = canvasWidth / naturalWidth;
      
      // Create viewport at the correct scale to fit the canvas
      const renderViewport = page.getViewport({ scale: renderScale });
      
      // Render the page
      const renderContext = {
        canvasContext: ctx,
        viewport: renderViewport
      };
      
      return page.render(renderContext).promise;
    }).catch(function(error) {
      console.error('Error loading PDF thumbnail:', error);
      showPdfError(canvas);
    });
  }
  
  // Load media (images only)
  function loadMedia(profileId) {
    console.log('[ProfileTabs] Loading media for profile:', profileId);
    // Find media-content within the media tab pane
    const mediaPane = document.querySelector('[data-tab-content="media"]');
    const mediaContent = mediaPane ? mediaPane.querySelector('#media-content') : document.getElementById('media-content');
    if (!mediaContent) {
      console.log('[ProfileTabs] media-content not found');
      return;
    }
    
    const profileTabs = document.querySelector('.profile-tabs');
    let pageBasePath = profileTabs ? profileTabs.getAttribute('data-base-path') || '' : '';
    // Ensure pageBasePath ends with / if it's not empty
    if (pageBasePath && !pageBasePath.endsWith('/')) {
      pageBasePath = pageBasePath + '/';
    }
    const documentsBasePath = pageBasePath + 'static/documents/' + profileId + '/';
    
    // Add cache busting to prevent stale cache on mobile browsers
    const cacheBuster = '?t=' + Date.now();
    fetch(pageBasePath + 'static/media-index.json' + cacheBuster, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
      .then(function(response) {
        if (!response.ok) throw new Error('No media index');
        return response.json();
      })
      .then(function(data) {
        const images = data.images[profileId] || [];
        
        console.log('[ProfileTabs] Found', images.length, 'images');
        
        if (images.length === 0) {
          mediaContent.innerHTML = '<div class="empty-message">No images available</div>';
          return;
        }
        
        mediaContent.innerHTML = '';
        
        // Add images section
        const imagesSection = document.createElement('div');
        imagesSection.className = 'media-section';
        imagesSection.innerHTML = '<h3>Images</h3><div class="gallery-grid"></div>';
        mediaContent.appendChild(imagesSection);
        
        const galleryGrid = imagesSection.querySelector('.gallery-grid');
        
        images.forEach(function(img) {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          
          // Build the correct path for the image
          let imagePath;
          if (img.path) {
            // img.path is like "/static/documents/ID/filename.jpg"
            // Remove leading slash and prepend pageBasePath
            imagePath = pageBasePath + (img.path.startsWith('/') ? img.path.substring(1) : img.path);
          } else {
            // Fallback to constructing from filename (for images without path)
            imagePath = documentsBasePath + img.filename;
          }
          const imageAlt = img.caption ? img.caption.replace(/<[^>]*>/g, '') : ''; // Strip HTML for alt text
          // Convert newlines to <br> tags for line breaks in caption
          const newlineChar = String.fromCharCode(10);
          let formattedCaption = img.caption ? img.caption.split(newlineChar).join('<br>') : '';
          
          // Fix profile links in caption to include base path (for GitHub Pages)
          // Use pageBasePath which is already available and correct
          // Remove trailing slash from pageBasePath if present (links already start with /)
          var basePathForLinks = pageBasePath;
          if (basePathForLinks && basePathForLinks.endsWith('/')) {
            basePathForLinks = basePathForLinks.substring(0, basePathForLinks.length - 1);
          }
          
          // Fix absolute profile links in caption HTML by adding base path
          // Pattern: href="/profiles/something" -> add base path before /profiles
          if (formattedCaption && basePathForLinks) {
            var linkPattern = new RegExp('href="(\\\\/profiles\\\\/[^"]+)"', 'g');
            formattedCaption = formattedCaption.replace(linkPattern, function(match, path) {
              return 'href="' + basePathForLinks + path + '"';
            });
          }
          
          // Create image element
          const imgElement = document.createElement('img');
          imgElement.src = imagePath;
          imgElement.alt = imageAlt;
          
          item.appendChild(imgElement);
          if (formattedCaption) {
            const captionDiv = document.createElement('div');
            captionDiv.className = 'image-caption';
            captionDiv.innerHTML = formattedCaption;
            item.appendChild(captionDiv);
          }
          
          // Click to open full size
          item.addEventListener('click', function(e) {
            // Don't open if clicking on a link in the caption
            if (e.target.tagName.toLowerCase() === 'a') {
              return;
            }
            window.open(imagePath, '_blank');
          });
          
          galleryGrid.appendChild(item);
        });
      })
      .catch(function(err) {
        console.log('[ProfileTabs] Media loading error:', err);
        mediaContent.innerHTML = '<div class="empty-message">Error loading gallery</div>';
      });
  }
  
  // Load documents (non-image files)
  function loadDocuments(profileId) {
    console.log('[ProfileTabs] Loading documents for profile:', profileId);
    // Find documents-content within the documents tab pane
    const documentsPane = document.querySelector('[data-tab-content="documents"]');
    const documentsContent = documentsPane ? documentsPane.querySelector('#documents-content') : document.getElementById('documents-content');
    if (!documentsContent) {
      console.log('[ProfileTabs] documents-content not found');
      return;
    }
    
    const profileTabs = document.querySelector('.profile-tabs');
    let pageBasePath = profileTabs ? profileTabs.getAttribute('data-base-path') || '' : '';
    // Ensure pageBasePath ends with / if it's not empty
    if (pageBasePath && !pageBasePath.endsWith('/')) {
      pageBasePath = pageBasePath + '/';
    }
    const documentsBasePath = pageBasePath + 'static/documents/' + profileId + '/';
    
    // Add cache busting to prevent stale cache on mobile browsers
    const cacheBuster = '?t=' + Date.now();
    fetch(pageBasePath + 'static/media-index.json' + cacheBuster, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      }
    })
      .then(function(response) {
        if (!response.ok) throw new Error('No media index');
        return response.json();
      })
      .then(function(data) {
        const documents = data.documents[profileId] || [];
        
        console.log('[ProfileTabs] Found', documents.length, 'documents');
        
        if (documents.length === 0) {
          documentsContent.innerHTML = '<div class="empty-message">No documents available</div>';
          return;
        }
        
        documentsContent.innerHTML = '';
        
        // Add documents section
        const docsSection = document.createElement('div');
        docsSection.className = 'media-section';
        docsSection.innerHTML = '<h3>Documents</h3><div class="gallery-grid"></div>';
        documentsContent.appendChild(docsSection);
        
        const docsGrid = docsSection.querySelector('.gallery-grid');
        
        documents.forEach(function(doc) {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          
          const documentUrl = documentsBasePath + doc.filename;
          const isPdf = doc.filename.toLowerCase().endsWith('.pdf');
          
          // Create preview container (like image)
          if (isPdf) {
            // For PDFs, create a canvas for thumbnail
            const canvas = document.createElement('canvas');
            canvas.className = 'document-thumbnail';
            item.appendChild(canvas);
            
            // Load PDF.js and render first page
            loadPdfThumbnail(documentUrl, canvas);
          } else {
            // For other documents, show icon as image-like element
            const iconDiv = document.createElement('div');
            iconDiv.className = 'document-icon-preview';
            iconDiv.textContent = getDocumentIcon(doc.filename);
            item.appendChild(iconDiv);
          }
          
          // Add caption (like image caption)
          const captionText = doc.title || doc.filename;
          if (captionText) {
            const captionDiv = document.createElement('div');
            captionDiv.className = 'image-caption';
            captionDiv.textContent = captionText;
            if (doc.description) {
              captionDiv.innerHTML = '<strong>' + captionText + '</strong><br>' + doc.description;
            }
            item.appendChild(captionDiv);
          }
          
          // Click to open document
          item.addEventListener('click', function(e) {
            // Don't open if clicking on a link in the caption
            if (e.target.tagName.toLowerCase() === 'a') {
              return;
            }
            window.open(documentUrl, '_blank');
          });
          
          docsGrid.appendChild(item);
        });
      })
      .catch(function(err) {
        console.log('[ProfileTabs] Documents loading error:', err);
        documentsContent.innerHTML = '<div class="empty-message">Error loading documents</div>';
      });
  }
  
  function getDocumentIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
      'pdf': '\u{1F4D5}',
      'doc': '\u{1F4D8}',
      'docx': '\u{1F4D8}',
      'xls': '\u{1F4CA}',
      'xlsx': '\u{1F4CA}',
      'txt': '\u{1F4C4}',
      'jpg': '\u{1F5BC}\uFE0F',
      'jpeg': '\u{1F5BC}\uFE0F',
      'png': '\u{1F5BC}\uFE0F',
      'gif': '\u{1F5BC}\uFE0F',
      'wma': '\u{1F3B5}',
      'mp3': '\u{1F3B5}',
      'wav': '\u{1F3B5}',
      'mp4': '\u{1F3AC}',
      'avi': '\u{1F3AC}',
      'mov': '\u{1F3AC}'
    };
    return icons[ext] || '\u{1F4C4}';
  }
  
  // Tab switching with proper cleanup
  tabButtons.forEach(function(button) {
    const clickHandler = function() {
      const tabName = button.getAttribute('data-tab');
      console.log('[ProfileTabs] Switching to tab:', tabName);
      
      // Remove active class from all
      tabButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      tabPanes.forEach(function(pane) {
        pane.classList.remove('active');
      });
      
      // Add active to clicked
      button.classList.add('active');
      const targetPane = document.querySelector('[data-tab-content="' + tabName + '"]');
      if (targetPane) {
        targetPane.classList.add('active');
      }
      
      // Load content on first view
      if (tabName === 'media' && !mediaLoaded && profileId) {
        loadMedia(profileId);
        mediaLoaded = true;
      }
      
      if (tabName === 'documents' && !documentsLoaded && profileId) {
        loadDocuments(profileId);
        documentsLoaded = true;
      }
      
      // Update URL hash to preserve tab state
      const currentHash = window.location.hash;
      let newHash = '';
      
      // Parse current hash to extract chapter if exists
      let chapterSlug = null;
      if (currentHash) {
        const chapterMatch = currentHash.match(/[#&]chapter=([^&]+)/);
        if (chapterMatch) {
          chapterSlug = chapterMatch[1];
        }
      }
      
      // Build new hash: if there's a chapter, include it, otherwise just tab
      if (chapterSlug) {
        newHash = '#chapter=' + chapterSlug + '&tab=' + tabName;
      } else {
        newHash = '#tab=' + tabName;
      }
      
      // Update URL without triggering navigation
      history.pushState({ tab: tabName }, '', window.location.pathname + newHash);
    };
    
      button.addEventListener('click', clickHandler);
      tabButtonCleanups.push(function() {
        button.removeEventListener('click', clickHandler);
      });
    });
    
    // Handle browser back/forward button for chapter tabs and gallery tab
    // Use a flag to prevent duplicate handling
    let isHandlingPopstate = false;
    const popstateHandler = function(event) {
      if (isHandlingPopstate) {
        console.log('[ProfileTabs] Already handling popstate, skipping');
        return;
      }
      
      console.log('[ProfileTabs] Popstate event:', event.state, 'hash:', window.location.hash);
      
      // Check if we're still on the same profile
      const currentProfileTabs = document.querySelector('.profile-tabs');
      if (!currentProfileTabs) {
        console.log('[ProfileTabs] No profile-tabs element found, skipping popstate');
        return;
      }
      
      const currentProfileId = currentProfileTabs.getAttribute('data-profile-id');
      console.log('[ProfileTabs] Current profileId from DOM:', currentProfileId, 'Cached profileId:', profileId);
      
      // If profile changed, let the 'nav' event handler deal with it
      if (currentProfileId !== profileId) {
        console.log('[ProfileTabs] Profile changed! Skipping popstate, letting nav event handle it');
        return;
      }
      
      isHandlingPopstate = true;
      
      const hash = window.location.hash;
      
      // Parse hash for tab and chapter
      let tabName = null;
      let chapterSlug = null;
      
      if (hash) {
        // Check for tab parameter - support both #tab=media and #tabmedia formats
        const tabMatchWithEquals = hash.match(/[&?#]tab=([^&]+)/);
        if (tabMatchWithEquals) {
          tabName = tabMatchWithEquals[1];
        } else {
          // Check for format without equals: #tabbiography
          const tabMatchWithoutEquals = hash.match(/[#&]tab([^&]+)/);
          if (tabMatchWithoutEquals) {
            tabName = tabMatchWithoutEquals[1];
          }
        }
        
        // Check for chapter parameter (e.g., #chapter=slug or #chapter=slug&tab=biography)
        const chapterMatch = hash.match(/[#&]chapter=([^&]+)/);
        if (chapterMatch) {
          // Clean the chapter slug - remove any trailing parameters or hash fragments
          chapterSlug = chapterMatch[1].split('&')[0].split('#')[0].trim();
        }
      }
      
      // Restore tab state
      if (tabName === 'media') {
        console.log('[ProfileTabs] Restoring gallery tab from popstate');
        // Switch to gallery tab
        const mediaButton = document.querySelector('[data-tab="media"]');
        const mediaPane = document.querySelector('[data-tab-content="media"]');
        
        if (mediaButton && mediaPane) {
          // Remove active from all tabs
          tabButtons.forEach(function(btn) {
            btn.classList.remove('active');
          });
          tabPanes.forEach(function(pane) {
            pane.classList.remove('active');
          });
          
          // Activate gallery tab
          mediaButton.classList.add('active');
          mediaPane.classList.add('active');
          
          // Load media if not already loaded
          // Check if media content is empty or just has loading message
          const mediaContent = mediaPane.querySelector('#media-content');
          const hasContent = mediaContent && mediaContent.innerHTML && 
                            !mediaContent.innerHTML.includes('Loading') &&
                            !mediaContent.innerHTML.includes('Loading gallery') &&
                            !mediaContent.innerHTML.includes('empty-message');
          
          if (!hasContent && profileId) {
            console.log('[ProfileTabs] Loading media for gallery tab from popstate');
            loadMedia(profileId);
            mediaLoaded = true;
          }
        }
        
        // Don't restore chapters when in gallery tab
        return;
      } else if (tabName === 'documents') {
        console.log('[ProfileTabs] Restoring documents tab from popstate');
        // Switch to documents tab
        const documentsButton = document.querySelector('[data-tab="documents"]');
        const documentsPane = document.querySelector('[data-tab-content="documents"]');
        
        if (documentsButton && documentsPane) {
          // Remove active from all tabs
          tabButtons.forEach(function(btn) {
            btn.classList.remove('active');
          });
          tabPanes.forEach(function(pane) {
            pane.classList.remove('active');
          });
          
          // Activate documents tab
          documentsButton.classList.add('active');
          documentsPane.classList.add('active');
          
          // Load documents if not already loaded
          const documentsContent = documentsPane.querySelector('#documents-content');
          const hasContent = documentsContent && documentsContent.innerHTML && 
                            !documentsContent.innerHTML.includes('Loading') &&
                            !documentsContent.innerHTML.includes('Loading documents') &&
                            !documentsContent.innerHTML.includes('empty-message');
          
          if (!hasContent && profileId) {
            console.log('[ProfileTabs] Loading documents for documents tab from popstate');
            loadDocuments(profileId);
            documentsLoaded = true;
          }
        }
        
        // Don't restore chapters when in documents tab
        return;
      } else if (tabName === 'biography' || !tabName) {
        // Switch to biography tab (default)
        const biographyButton = document.querySelector('[data-tab="biography"]');
        const biographyPane = document.querySelector('[data-tab-content="biography"]');
        
        if (biographyButton && biographyPane) {
          // Remove active from all tabs
          tabButtons.forEach(function(btn) {
            btn.classList.remove('active');
          });
          tabPanes.forEach(function(pane) {
            pane.classList.remove('active');
          });
          
          // Activate biography tab
          biographyButton.classList.add('active');
          biographyPane.classList.add('active');
        }
      }
      
      // Handle chapter navigation (only if we're in biography tab, NOT in media or documents tab)
      // Don't restore chapters if we're in media or documents tab
      if (tabName !== 'media' && tabName !== 'documents') {
        if (chapterSlug) {
          // Validate that the chapter belongs to the current profile
          let isValidChapter = false;
          if (chaptersData) {
            // Check if chapter slug matches main chapter
            if (chaptersData.main && chaptersData.main.slug === chapterSlug) {
              isValidChapter = true;
            } else {
              // Check if chapter slug matches any other chapter
              for (let i = 0; i < chaptersData.chapters.length; i++) {
                if (chaptersData.chapters[i].slug === chapterSlug) {
                  isValidChapter = true;
                  break;
                }
              }
            }
          }
          
          if (isValidChapter) {
            console.log('[ProfileTabs] Restoring chapter from popstate:', chapterSlug);
            switchToChapter(chapterSlug, true);
          } else {
            console.log('[ProfileTabs] Chapter', chapterSlug, 'does not belong to current profile, showing default chapter');
            // Chapter doesn't belong to this profile - clear hash and show default
            if (chaptersData && chaptersData.main) {
              // Update URL to remove invalid chapter hash
              const newUrl = window.location.pathname + '#tab=biography';
              history.replaceState({ tab: 'biography' }, '', newUrl);
              // Show default chapter
              switchToChapter(chaptersData.main.slug, true);
            }
          }
        } else if (!hash || hash === '#' || hash === '#tab=biography' || hash === '#tabbiography') {
          // No chapter hash - go back to introduction if we have chapters
          if (chaptersData && chaptersData.main) {
            console.log('[ProfileTabs] No chapter hash, showing introduction');
            switchToChapter(chaptersData.main.slug, true);
          }
        }
      }
      
      // Reset flag after a short delay
      setTimeout(function() {
        isHandlingPopstate = false;
      }, 100);
    };
    
    window.addEventListener('popstate', popstateHandler);
    tabButtonCleanups.push(function() {
      window.removeEventListener('popstate', popstateHandler);
    });
    
    // Restore tab state from hash after initialization
    // Use longer timeout to ensure createChapterTabs has finished
    setTimeout(function() {
      restoreTabFromHash();
      // Also restore again after a bit more time in case createChapterTabs was delayed
      setTimeout(function() {
        const hash = window.location.hash;
        if (hash && (hash.includes('tab=media') || hash.includes('tabmedia') || 
                     hash.includes('tab=documents') || hash.includes('tabdocuments'))) {
          restoreTabFromHash();
        }
      }, 300);
    }, 500);
  }
  
  // Run on initial load
  initProfileTabs();
  
  // Run on every navigation (SPA)
  document.addEventListener('nav', function() {
    initProfileTabs();
  });
`,ProfileTabs}),"default");import{jsx as jsx38,jsxs as jsxs22}from"preact/jsx-runtime";import{jsx as jsx39,jsxs as jsxs23}from"preact/jsx-runtime";var NavBar=__name(({fileData,cfg,displayClass})=>{let baseDir=pathToRoot(fileData.slug);return jsx39("nav",{class:classNames(displayClass,"navbar"),children:jsxs23("div",{class:"navbar-container",children:[jsxs23("button",{class:"navbar-toggle","aria-label":"Toggle navigation menu",children:[jsx39("span",{}),jsx39("span",{}),jsx39("span",{})]}),jsxs23("ul",{class:"navbar-menu",children:[jsx39("li",{children:jsx39("a",{href:baseDir,children:"Home"})}),jsx39("li",{children:jsx39("a",{href:joinSegments(baseDir,"pages/all-profiles"),children:"All Profiles"})}),jsx39("li",{children:jsx39("a",{href:joinSegments(baseDir,"pages/profiles-of-interest"),children:"Profiles of Interest"})}),jsx39("li",{children:jsx39("a",{href:joinSegments(baseDir,"pages/about"),children:"About"})})]})]})})},"NavBar");NavBar.css=`
.navbar {
  background: var(--light);
  border-bottom: 1px solid var(--lightgray);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 100;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 0.25rem;
}

.navbar-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background: var(--darkgray);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.navbar-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.navbar-toggle.active span:nth-child(2) {
  opacity: 0;
}

.navbar-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.navbar-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.navbar-menu li {
  margin: 0;
}

.navbar-menu a {
  color: #1a1a1a !important;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  display: block;
  background-color: transparent !important;
}

.navbar-menu a:hover {
  color: var(--tertiary) !important;
  text-decoration: none !important;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 1rem;
  }
  
  .navbar-toggle {
    display: flex;
    z-index: 101;
  }
  
  .navbar-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    width: 100vw;
    background: var(--light);
    flex-direction: column;
    gap: 0;
    padding: 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .navbar-menu.active {
    max-height: 500px;
  }
  
  .navbar-menu li {
    padding: 0;
    width: 100%;
  }
  
  .navbar-menu a {
    padding: 1rem 1.5rem;
    width: 100%;
    box-sizing: border-box;
    display: block;
  }
  
  .navbar-menu a:hover {
    background: var(--lightgray);
  }
}
`;NavBar.afterDOMLoaded=`
const toggleButton = document.querySelector('.navbar-toggle');
const menu = document.querySelector('.navbar-menu');

if (toggleButton && menu) {
  toggleButton.addEventListener('click', function() {
    this.classList.toggle('active');
    menu.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInside = toggleButton.contains(event.target) || menu.contains(event.target);
    if (!isClickInside && menu.classList.contains('active')) {
      toggleButton.classList.remove('active');
      menu.classList.remove('active');
    }
  });
  
  // Close menu when clicking on a link
  const menuLinks = menu.querySelectorAll('a');
  menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      toggleButton.classList.remove('active');
      menu.classList.remove('active');
    });
  });
}
`;var NavBar_default=__name((()=>NavBar),"default");import{jsx as jsx40}from"preact/jsx-runtime";var AllImagesGallery_default=__name((()=>{let AllImagesGallery=__name(({displayClass,fileData})=>{if(!(fileData.slug==="pages/all-images"))return null;let basePath=pathToRoot(fileData.slug);return jsx40("div",{class:classNames(displayClass,"all-images-gallery"),id:"all-images-gallery-wrapper","data-base-path":basePath,children:jsx40("div",{id:"all-images-gallery-container",children:jsx40("div",{class:"loading-message",children:"Loading all images..."})})})},"AllImagesGallery");return AllImagesGallery.css=`
.all-images-gallery {
  margin: 2rem 0;
}

.all-images-gallery .loading-message,
.all-images-gallery .empty-message {
  text-align: center;
  padding: 3rem;
  background: var(--light);
  border-radius: 8px;
  color: var(--gray);
  font-size: 1.1rem;
}

/* Gallery grid with 4 columns - High specificity to override ProfileTabs */
#all-images-gallery-wrapper .gallery-grid,
#all-images-gallery-container .gallery-grid,
.all-images-gallery .gallery-grid,
div.all-images-gallery .gallery-grid {
  column-count: 4 !important;
  column-gap: 0.75rem !important;
  padding: 0 !important;
  margin-top: 1rem !important;
  break-inside: avoid !important;
  -webkit-column-count: 4 !important;
  -moz-column-count: 4 !important;
}

.all-images-gallery .gallery-item {
  display: inline-block !important;
  width: 100% !important;
  vertical-align: top !important;
  border-radius: 0 !important;
  overflow: visible !important;
  background: transparent !important;
  transition: transform 0.2s ease !important;
  margin: 0 0 0.75rem 0 !important;
  cursor: pointer !important;
  break-inside: avoid !important;
  page-break-inside: avoid !important;
  
  &:hover {
    transform: scale(1.01) !important;
    z-index: 10 !important;
  }
  
  img {
    width: 100% !important;
    height: auto !important;
    cursor: pointer !important;
    background: white !important;
    display: block !important;
    border: 2px solid #333 !important;
    border-radius: 4px 4px 0 0 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    padding: 0 !important;
    margin: 0 !important;
    object-fit: contain !important;
    max-width: 100% !important;
    content-visibility: auto !important;
  }
  
  .image-caption {
    padding: 0.35rem 0.5rem !important;
    font-size: 0.85rem !important;
    line-height: 1.3 !important;
    background: #ffffff !important;
    margin: 0 !important;
    border: 1px solid #e1e4e8 !important;
    border-top: none !important;
    border-radius: 0 0 4px 4px !important;
    text-align: left !important;
    color: #666 !important;
    
    a {
      color: #0066cc !important;
      text-decoration: underline !important;
      
      &:hover {
        text-decoration: none !important;
        color: #0052a3 !important;
      }
    }
  }
}

/* Responsive: 2 columns on tablets and mobile */
@media (max-width: 1024px) {
  #all-images-gallery-wrapper .gallery-grid,
  .all-images-gallery .gallery-grid,
  div.all-images-gallery .gallery-grid {
    column-count: 2 !important;
  }
}

@media (max-width: 768px) {
  #all-images-gallery-wrapper .gallery-grid,
  .all-images-gallery .gallery-grid,
  div.all-images-gallery .gallery-grid {
    column-count: 2 !important;
  }
}
`,AllImagesGallery.afterDOMLoaded=`
(function() {
  function loadAllImages() {
    const container = document.getElementById('all-images-gallery-container');
    if (!container) {
      console.log('[AllImagesGallery] Container not found');
      return;
    }
    
    const galleryElement = document.querySelector('.all-images-gallery');
    let pageBasePath = galleryElement ? galleryElement.getAttribute('data-base-path') || '' : '';
    if (pageBasePath && !pageBasePath.endsWith('/')) {
      pageBasePath = pageBasePath + '/';
    }
    
    fetch(pageBasePath + 'static/media-index.json')
      .then(function(response) {
        if (!response.ok) throw new Error('No media index');
        return response.json();
      })
      .then(function(data) {
        // Collect all images from all profiles
        const allImages = [];
        const seenPaths = new Set(); // Track unique image paths
        
        // Iterate through all profiles
        for (const profileId in data.images) {
          const images = data.images[profileId] || [];
          for (const img of images) {
            // Build the image path
            let imagePath;
            if (img.path) {
              imagePath = pageBasePath + (img.path.startsWith('/') ? img.path.substring(1) : img.path);
            } else {
              imagePath = pageBasePath + 'static/documents/' + profileId + '/' + img.filename;
            }
            
            // Only add if we haven't seen this path before
            if (!seenPaths.has(imagePath)) {
              seenPaths.add(imagePath);
              allImages.push({
                path: imagePath,
                caption: img.caption || '',
                filename: img.filename || ''
              });
            }
          }
        }
        
        console.log('[AllImagesGallery] Found', allImages.length, 'unique images');
        
        if (allImages.length === 0) {
          container.innerHTML = '<div class="empty-message">No images available</div>';
          return;
        }
        
        // Create gallery grid
        container.innerHTML = '<div class="gallery-grid" id="all-images-gallery-grid"></div>';
        const galleryGrid = container.querySelector('.gallery-grid');
        
        // Force 4 columns via inline style to override any conflicting CSS
        if (galleryGrid) {
          // Check window width for responsive behavior
          const width = window.innerWidth;
          if (width > 1024) {
            galleryGrid.style.setProperty('column-count', '4', 'important');
          } else if (width > 768) {
            galleryGrid.style.setProperty('column-count', '2', 'important');
          } else {
            galleryGrid.style.setProperty('column-count', '2', 'important');
          }
        }
        
        // Render all images
        allImages.forEach(function(img) {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          
          const imageAlt = img.caption ? img.caption.replace(/<[^>]*>/g, '') : '';
          const newlineChar = String.fromCharCode(10);
          let formattedCaption = img.caption ? img.caption.split(newlineChar).join('<br>') : '';
          
          // Fix profile links in caption to include base path
          var basePathForLinks = pageBasePath;
          if (basePathForLinks && basePathForLinks.endsWith('/')) {
            basePathForLinks = basePathForLinks.substring(0, basePathForLinks.length - 1);
          }
          
          if (formattedCaption && basePathForLinks) {
            var linkPattern = new RegExp('href="(\\\\/profiles\\\\/[^"]+)"', 'g');
            formattedCaption = formattedCaption.replace(linkPattern, function(match, path) {
              return 'href="' + basePathForLinks + path + '"';
            });
          }
          
          // Create image element
          const imgElement = document.createElement('img');
          imgElement.src = img.path;
          imgElement.alt = imageAlt;
          
          item.appendChild(imgElement);
          if (formattedCaption) {
            const captionDiv = document.createElement('div');
            captionDiv.className = 'image-caption';
            captionDiv.innerHTML = formattedCaption;
            item.appendChild(captionDiv);
          }
          
          // Click to open full size
          item.addEventListener('click', function(e) {
            if (e.target.tagName.toLowerCase() === 'a') {
              return;
            }
            window.open(img.path, '_blank');
          });
          
          galleryGrid.appendChild(item);
        });
        
        // Add resize listener to update column count responsively
        function updateColumnCount() {
          const grid = document.querySelector('#all-images-gallery-wrapper .gallery-grid') || 
                       document.querySelector('.all-images-gallery .gallery-grid');
          if (grid) {
            const width = window.innerWidth;
            if (width > 1024) {
              grid.style.setProperty('column-count', '4', 'important');
            } else if (width > 768) {
              grid.style.setProperty('column-count', '2', 'important');
            } else {
              grid.style.setProperty('column-count', '2', 'important');
            }
          }
        }
        
        // Update on window resize (with debounce)
        let resizeTimeout;
        window.addEventListener('resize', function() {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(updateColumnCount, 100);
        });
      })
      .catch(function(err) {
        console.log('[AllImagesGallery] Error loading images:', err);
        const container = document.getElementById('all-images-gallery-container');
        if (container) {
          container.innerHTML = '<div class="empty-message">Error loading images</div>';
        }
      });
  }
  
  // Load on initial page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllImages);
  } else {
    loadAllImages();
  }
  
  // Also load on SPA navigation
  document.addEventListener('nav', loadAllImages);
})();
`,AllImagesGallery}),"default");var sharedPageComponents={head:Head_default(),header:[NavBar_default()],afterBody:[ConditionalRender_default({component:ProfileTabs_default(),condition:__name(page=>page.fileData.frontmatter?.type==="profile","condition")}),ConditionalRender_default({component:AllImagesGallery_default(),condition:__name(page=>page.fileData.slug==="pages/all-images","condition")})],footer:Footer_default({links:{Home:"/","All Profiles":"/pages/all-profiles","Profiles of Interest":"/pages/profiles-of-interest",About:"/pages/about"}})},defaultContentPageLayout={beforeBody:[ArticleTitle_default(),TagList_default()],left:[PageTitle_default(),MobileOnly_default(Spacer_default()),Flex_default({components:[{Component:Search_default(),grow:!0},{Component:ReaderMode_default()}]}),Explorer_default()],right:[Backlinks_default()]},defaultListPageLayout={beforeBody:[ArticleTitle_default()],left:[PageTitle_default(),MobileOnly_default(Spacer_default()),Flex_default({components:[{Component:Search_default(),grow:!0}]}),Explorer_default()],right:[Backlinks_default()]};import{styleText as styleText5}from"util";async function processContent(ctx,tree,fileData,allFiles,opts,resources){let slug=fileData.slug,cfg=ctx.cfg.configuration,externalResources=pageResources(pathToRoot(slug),resources),content=renderPage(cfg,slug,{ctx,fileData,externalResources,cfg,children:[],tree,allFiles},opts,externalResources);return write({ctx,content,slug,ext:".html"})}__name(processContent,"processContent");var ContentPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultContentPageLayout,pageBody:Content_default(),...userOpts},{head:Head,header,beforeBody,pageBody,afterBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"ContentPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...afterBody,...left,...right,Footer]},async*emit(ctx,content,resources){let allFiles=content.map(c=>c[1].data),containsIndex=!1;for(let[tree,file]of content){let slug=file.data.slug;slug==="index"&&(containsIndex=!0),!(slug.endsWith("/index")||slug.startsWith("tags/"))&&(yield processContent(ctx,tree,file.data,allFiles,opts,resources))}containsIndex||console.log(styleText5("yellow",`
Warning: you seem to be missing an \`index.md\` home page file at the root of your \`${ctx.argv.directory}\` folder (\`${path6.join(ctx.argv.directory,"index.md")} does not exist\`). This may cause errors when deploying.`))},async*partialEmit(ctx,content,resources,changeEvents){let allFiles=content.map(c=>c[1].data),changedSlugs=new Set;for(let changeEvent of changeEvents)changeEvent.file&&(changeEvent.type==="add"||changeEvent.type==="change")&&changedSlugs.add(changeEvent.file.data.slug);for(let[tree,file]of content){let slug=file.data.slug;changedSlugs.has(slug)&&(slug.endsWith("/index")||slug.startsWith("tags/")||(yield processContent(ctx,tree,file.data,allFiles,opts,resources)))}}}},"ContentPage");import{VFile}from"vfile";function defaultProcessedContent(vfileData){let root={type:"root",children:[]},vfile=new VFile("");return vfile.data=vfileData,[root,vfile]}__name(defaultProcessedContent,"defaultProcessedContent");function computeTagInfo(allFiles,content,locale){let tags=new Set(allFiles.flatMap(data=>data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes));tags.add("index");let tagDescriptions=Object.fromEntries([...tags].map(tag=>{let title=tag==="index"?i18n(locale).pages.tagContent.tagIndex:`${i18n(locale).pages.tagContent.tag}: ${tag}`;return[tag,defaultProcessedContent({slug:joinSegments("tags",tag),frontmatter:{title,tags:[]}})]}));for(let[tree,file]of content){let slug=file.data.slug;if(slug.startsWith("tags/")){let tag=slug.slice(5);tags.has(tag)&&(tagDescriptions[tag]=[tree,file],file.data.frontmatter?.title===tag&&(file.data.frontmatter.title=`${i18n(locale).pages.tagContent.tag}: ${tag}`))}}return[tags,tagDescriptions]}__name(computeTagInfo,"computeTagInfo");async function processTagPage(ctx,tag,tagContent,allFiles,opts,resources){let slug=joinSegments("tags",tag),[tree,file]=tagContent,cfg=ctx.cfg.configuration,externalResources=pageResources(pathToRoot(slug),resources),componentData={ctx,fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content=renderPage(cfg,slug,componentData,opts,externalResources);return write({ctx,content,slug:file.data.slug,ext:".html"})}__name(processTagPage,"processTagPage");var TagPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:TagContent_default({sort:userOpts?.sort}),...userOpts},{head:Head,header,beforeBody,pageBody,afterBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"TagPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...afterBody,...left,...right,Footer]},async*emit(ctx,content,resources){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,[tags,tagDescriptions]=computeTagInfo(allFiles,content,cfg.locale);for(let tag of tags)yield processTagPage(ctx,tag,tagDescriptions[tag],allFiles,opts,resources)},async*partialEmit(ctx,content,resources,changeEvents){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,affectedTags=new Set;for(let changeEvent of changeEvents){if(!changeEvent.file)continue;let slug=changeEvent.file.data.slug;if(slug.startsWith("tags/")){let tag=slug.slice(5);affectedTags.add(tag)}(changeEvent.file.data.frontmatter?.tags??[]).flatMap(getAllSegmentPrefixes).forEach(tag=>affectedTags.add(tag)),affectedTags.add("index")}if(affectedTags.size>0){let[_tags,tagDescriptions]=computeTagInfo(allFiles,content,cfg.locale);for(let tag of affectedTags)tagDescriptions[tag]&&(yield processTagPage(ctx,tag,tagDescriptions[tag],allFiles,opts,resources))}}}},"TagPage");import path7 from"path";async function*processFolderInfo(ctx,folderInfo,allFiles,opts,resources){for(let[folder,folderContent]of Object.entries(folderInfo)){let slug=joinSegments(folder,"index"),[tree,file]=folderContent,cfg=ctx.cfg.configuration,externalResources=pageResources(pathToRoot(slug),resources),componentData={ctx,fileData:file.data,externalResources,cfg,children:[],tree,allFiles},content=renderPage(cfg,slug,componentData,opts,externalResources);yield write({ctx,content,slug,ext:".html"})}}__name(processFolderInfo,"processFolderInfo");function computeFolderInfo(folders,content,locale){let folderInfo=Object.fromEntries([...folders].map(folder=>[folder,defaultProcessedContent({slug:joinSegments(folder,"index"),frontmatter:{title:`${i18n(locale).pages.folderContent.folder}: ${folder}`,tags:[]}})]));for(let[tree,file]of content){let slug=stripSlashes(simplifySlug(file.data.slug));folders.has(slug)&&(folderInfo[slug]=[tree,file])}return folderInfo}__name(computeFolderInfo,"computeFolderInfo");function _getFolders(slug){var folderName=path7.dirname(slug??"");let parentFolderNames=[folderName];for(;folderName!==".";)folderName=path7.dirname(folderName??""),parentFolderNames.push(folderName);return parentFolderNames}__name(_getFolders,"_getFolders");var FolderPage=__name(userOpts=>{let opts={...sharedPageComponents,...defaultListPageLayout,pageBody:FolderContent_default({sort:userOpts?.sort}),...userOpts},{head:Head,header,beforeBody,pageBody,afterBody,left,right,footer:Footer}=opts,Header2=Header_default(),Body2=Body_default();return{name:"FolderPage",getQuartzComponents(){return[Head,Header2,Body2,...header,...beforeBody,pageBody,...afterBody,...left,...right,Footer]},async*emit(ctx,content,resources){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,folders=new Set(allFiles.flatMap(data=>data.slug?_getFolders(data.slug).filter(folderName=>folderName!=="."&&folderName!=="tags"):[])),folderInfo=computeFolderInfo(folders,content,cfg.locale);yield*processFolderInfo(ctx,folderInfo,allFiles,opts,resources)},async*partialEmit(ctx,content,resources,changeEvents){let allFiles=content.map(c=>c[1].data),cfg=ctx.cfg.configuration,affectedFolders=new Set;for(let changeEvent of changeEvents){if(!changeEvent.file)continue;let slug=changeEvent.file.data.slug;_getFolders(slug).filter(folderName=>folderName!=="."&&folderName!=="tags").forEach(folder=>affectedFolders.add(folder))}if(affectedFolders.size>0){let folderInfo=computeFolderInfo(affectedFolders,content,cfg.locale);yield*processFolderInfo(ctx,folderInfo,allFiles,opts,resources)}}}},"FolderPage");import{toHtml as toHtml2}from"hast-util-to-html";import{jsx as jsx41}from"preact/jsx-runtime";var defaultOptions14={enableSiteMap:!0,enableRSS:!0,rssLimit:10,rssFullHtml:!1,rssSlug:"index",includeEmptyFiles:!0};function generateSiteMap(cfg,idx){let base=cfg.baseUrl??"",createURLEntry=__name((slug,content)=>`<url>
    <loc>https://${joinSegments(base,encodeURI(slug))}</loc>
    ${content.date&&`<lastmod>${content.date.toISOString()}</lastmod>`}
  </url>`,"createURLEntry");return`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${Array.from(idx).map(([slug,content])=>createURLEntry(simplifySlug(slug),content)).join("")}</urlset>`}__name(generateSiteMap,"generateSiteMap");function generateRSSFeed(cfg,idx,limit){let base=cfg.baseUrl??"",createURLEntry=__name((slug,content)=>`<item>
    <title>${escapeHTML(content.title)}</title>
    <link>https://${joinSegments(base,encodeURI(slug))}</link>
    <guid>https://${joinSegments(base,encodeURI(slug))}</guid>
    <description><![CDATA[ ${content.richContent??content.description} ]]></description>
    <pubDate>${content.date?.toUTCString()}</pubDate>
  </item>`,"createURLEntry"),items=Array.from(idx).sort(([_,f1],[__,f2])=>f1.date&&f2.date?f2.date.getTime()-f1.date.getTime():f1.date&&!f2.date?-1:!f1.date&&f2.date?1:f1.title.localeCompare(f2.title)).map(([slug,content])=>createURLEntry(simplifySlug(slug),content)).slice(0,limit??idx.size).join("");return`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
      <title>${escapeHTML(cfg.pageTitle)}</title>
      <link>https://${base}</link>
      <description>${limit?i18n(cfg.locale).pages.rss.lastFewNotes({count:limit}):i18n(cfg.locale).pages.rss.recentNotes} on ${escapeHTML(cfg.pageTitle)}</description>
      <generator>Quartz -- quartz.jzhao.xyz</generator>
      ${items}
    </channel>
  </rss>`}__name(generateRSSFeed,"generateRSSFeed");var ContentIndex=__name(opts=>(opts={...defaultOptions14,...opts},{name:"ContentIndex",async*emit(ctx,content){let cfg=ctx.cfg.configuration,linkIndex=new Map;for(let[tree,file]of content){let slug=file.data.slug,date=getDate(ctx.cfg.configuration,file.data)??new Date;(opts?.includeEmptyFiles||file.data.text&&file.data.text!=="")&&linkIndex.set(slug,{slug,filePath:file.data.relativePath,title:file.data.frontmatter?.title,links:file.data.links??[],tags:file.data.frontmatter?.tags??[],content:file.data.text??"",richContent:opts?.rssFullHtml?escapeHTML(toHtml2(tree,{allowDangerousHtml:!0})):void 0,date,description:file.data.description??""})}opts?.enableSiteMap&&(yield write({ctx,content:generateSiteMap(cfg,linkIndex),slug:"sitemap",ext:".xml"})),opts?.enableRSS&&(yield write({ctx,content:generateRSSFeed(cfg,linkIndex,opts.rssLimit),slug:opts?.rssSlug??"index",ext:".xml"}));let fp=joinSegments("static","contentIndex"),simplifiedIndex=Object.fromEntries(Array.from(linkIndex).map(([slug,content2])=>(delete content2.description,delete content2.date,[slug,content2])));yield write({ctx,content:JSON.stringify(simplifiedIndex),slug:fp,ext:".json"})},externalResources:__name(ctx=>{if(opts?.enableRSS)return{additionalHead:[jsx41("link",{rel:"alternate",type:"application/rss+xml",title:"RSS Feed",href:`https://${ctx.cfg.configuration.baseUrl}/index.xml`})]}},"externalResources")}),"ContentIndex");import path8 from"path";async function*processFile(ctx,file){let ogSlug=simplifySlug(file.data.slug);for(let aliasTarget of file.data.aliases??[]){let aliasTargetSlug=isRelativeURL(aliasTarget)?path8.normalize(path8.join(ogSlug,"..",aliasTarget)):aliasTarget,redirUrl=resolveRelative(aliasTargetSlug,ogSlug);yield write({ctx,content:`
        <!DOCTYPE html>
        <html lang="en-us">
        <head>
        <title>${ogSlug}</title>
        <link rel="canonical" href="${redirUrl}">
        <meta name="robots" content="noindex">
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="0; url=${redirUrl}">
        </head>
        </html>
        `,slug:aliasTargetSlug,ext:".html"})}}__name(processFile,"processFile");var AliasRedirects=__name(()=>({name:"AliasRedirects",async*emit(ctx,content){for(let[_tree,file]of content)yield*processFile(ctx,file)},async*partialEmit(ctx,_content,_resources,changeEvents){for(let changeEvent of changeEvents)changeEvent.file&&(changeEvent.type==="add"||changeEvent.type==="change")&&(yield*processFile(ctx,changeEvent.file))}}),"AliasRedirects");import path10 from"path";import fs3 from"fs";import path9 from"path";import{globby}from"globby";function toPosixPath(fp){return fp.split(path9.sep).join("/")}__name(toPosixPath,"toPosixPath");async function glob(pattern,cwd,ignorePatterns){return(await globby(pattern,{cwd,ignore:ignorePatterns,gitignore:!0})).map(toPosixPath)}__name(glob,"glob");var filesToCopy=__name(async(argv,cfg)=>await glob("**",argv.directory,["**/*.md",...cfg.configuration.ignorePatterns]),"filesToCopy"),copyFile=__name(async(argv,fp)=>{let src=joinSegments(argv.directory,fp),name=slugifyFilePath(fp),dest=joinSegments(argv.output,name),dir=path10.dirname(dest);return await fs3.promises.mkdir(dir,{recursive:!0}),await fs3.promises.copyFile(src,dest),dest},"copyFile"),Assets=__name(()=>({name:"Assets",async*emit({argv,cfg}){let fps=await filesToCopy(argv,cfg);for(let fp of fps)yield copyFile(argv,fp)},async*partialEmit(ctx,_content,_resources,changeEvents){for(let changeEvent of changeEvents)if(path10.extname(changeEvent.path)!==".md"){if(changeEvent.type==="add"||changeEvent.type==="change")yield copyFile(ctx.argv,changeEvent.path);else if(changeEvent.type==="delete"){let name=slugifyFilePath(changeEvent.path),dest=joinSegments(ctx.argv.output,name);await fs3.promises.unlink(dest)}}}}),"Assets");import fs4 from"fs";import{dirname}from"path";var Static=__name(()=>({name:"Static",async*emit({argv,cfg}){let staticPath=joinSegments(QUARTZ,"static"),fps=await glob("**",staticPath,cfg.configuration.ignorePatterns),outputStaticPath=joinSegments(argv.output,"static");await fs4.promises.mkdir(outputStaticPath,{recursive:!0});for(let fp of fps){let src=joinSegments(staticPath,fp),dest=joinSegments(outputStaticPath,fp);await fs4.promises.mkdir(dirname(dest),{recursive:!0}),await fs4.promises.copyFile(src,dest),yield dest}},async*partialEmit(){}}),"Static");import sharp2 from"sharp";var Favicon=__name(()=>({name:"Favicon",async*emit({argv}){let iconPath=joinSegments(QUARTZ,"static","icon.png"),faviconContent=sharp2(iconPath).resize(48,48).toFormat("png");yield write({ctx:{argv},slug:"favicon",ext:".ico",content:faviconContent})},async*partialEmit(){}}),"Favicon");var spa_inline_default='var W=Object.create;var L=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var V=Object.getPrototypeOf,q=Object.prototype.hasOwnProperty;var z=(u,e)=>()=>(e||u((e={exports:{}}).exports,e),e.exports);var K=(u,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let F of I(e))!q.call(u,F)&&F!==t&&L(u,F,{get:()=>e[F],enumerable:!(r=_(e,F))||r.enumerable});return u};var Z=(u,e,t)=>(t=u!=null?W(V(u)):{},K(e||!u||!u.__esModule?L(t,"default",{value:u,enumerable:!0}):t,u));var k=z((gu,j)=>{"use strict";j.exports=eu;function f(u){return u instanceof Buffer?Buffer.from(u):new u.constructor(u.buffer.slice(),u.byteOffset,u.length)}function eu(u){if(u=u||{},u.circles)return tu(u);let e=new Map;if(e.set(Date,n=>new Date(n)),e.set(Map,(n,l)=>new Map(r(Array.from(n),l))),e.set(Set,(n,l)=>new Set(r(Array.from(n),l))),u.constructorHandlers)for(let n of u.constructorHandlers)e.set(n[0],n[1]);let t=null;return u.proto?i:F;function r(n,l){let D=Object.keys(n),o=new Array(D.length);for(let a=0;a<D.length;a++){let s=D[a],c=n[s];typeof c!="object"||c===null?o[s]=c:c.constructor!==Object&&(t=e.get(c.constructor))?o[s]=t(c,l):ArrayBuffer.isView(c)?o[s]=f(c):o[s]=l(c)}return o}function F(n){if(typeof n!="object"||n===null)return n;if(Array.isArray(n))return r(n,F);if(n.constructor!==Object&&(t=e.get(n.constructor)))return t(n,F);let l={};for(let D in n){if(Object.hasOwnProperty.call(n,D)===!1)continue;let o=n[D];typeof o!="object"||o===null?l[D]=o:o.constructor!==Object&&(t=e.get(o.constructor))?l[D]=t(o,F):ArrayBuffer.isView(o)?l[D]=f(o):l[D]=F(o)}return l}function i(n){if(typeof n!="object"||n===null)return n;if(Array.isArray(n))return r(n,i);if(n.constructor!==Object&&(t=e.get(n.constructor)))return t(n,i);let l={};for(let D in n){let o=n[D];typeof o!="object"||o===null?l[D]=o:o.constructor!==Object&&(t=e.get(o.constructor))?l[D]=t(o,i):ArrayBuffer.isView(o)?l[D]=f(o):l[D]=i(o)}return l}}function tu(u){let e=[],t=[],r=new Map;if(r.set(Date,D=>new Date(D)),r.set(Map,(D,o)=>new Map(i(Array.from(D),o))),r.set(Set,(D,o)=>new Set(i(Array.from(D),o))),u.constructorHandlers)for(let D of u.constructorHandlers)r.set(D[0],D[1]);let F=null;return u.proto?l:n;function i(D,o){let a=Object.keys(D),s=new Array(a.length);for(let c=0;c<a.length;c++){let A=a[c],E=D[A];if(typeof E!="object"||E===null)s[A]=E;else if(E.constructor!==Object&&(F=r.get(E.constructor)))s[A]=F(E,o);else if(ArrayBuffer.isView(E))s[A]=f(E);else{let R=e.indexOf(E);R!==-1?s[A]=t[R]:s[A]=o(E)}}return s}function n(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return i(D,n);if(D.constructor!==Object&&(F=r.get(D.constructor)))return F(D,n);let o={};e.push(D),t.push(o);for(let a in D){if(Object.hasOwnProperty.call(D,a)===!1)continue;let s=D[a];if(typeof s!="object"||s===null)o[a]=s;else if(s.constructor!==Object&&(F=r.get(s.constructor)))o[a]=F(s,n);else if(ArrayBuffer.isView(s))o[a]=f(s);else{let c=e.indexOf(s);c!==-1?o[a]=t[c]:o[a]=n(s)}}return e.pop(),t.pop(),o}function l(D){if(typeof D!="object"||D===null)return D;if(Array.isArray(D))return i(D,l);if(D.constructor!==Object&&(F=r.get(D.constructor)))return F(D,l);let o={};e.push(D),t.push(o);for(let a in D){let s=D[a];if(typeof s!="object"||s===null)o[a]=s;else if(s.constructor!==Object&&(F=r.get(s.constructor)))o[a]=F(s,l);else if(ArrayBuffer.isView(s))o[a]=f(s);else{let c=e.indexOf(s);c!==-1?o[a]=t[c]:o[a]=l(s)}}return e.pop(),t.pop(),o}}});var y=u=>(e,t)=>e[`node${u}`]===t[`node${u}`],Q=y("Name"),Y=y("Type"),G=y("Value");function T(u,e){if(u.attributes.length===0&&e.attributes.length===0)return[];let t=[],r=new Map,F=new Map;for(let i of u.attributes)r.set(i.name,i.value);for(let i of e.attributes){let n=r.get(i.name);i.value===n?r.delete(i.name):(typeof n<"u"&&r.delete(i.name),F.set(i.name,i.value))}for(let i of r.keys())t.push({type:5,name:i});for(let[i,n]of F.entries())t.push({type:4,name:i,value:n});return t}function m(u,e=!0){let t=`${u.localName}`;for(let{name:r,value:F}of u.attributes)e&&r.startsWith("data-")||(t+=`[${r}=${F}]`);return t+=u.innerHTML,t}function g(u){switch(u.tagName){case"BASE":case"TITLE":return u.localName;case"META":{if(u.hasAttribute("name"))return`meta[name="${u.getAttribute("name")}"]`;if(u.hasAttribute("property"))return`meta[name="${u.getAttribute("property")}"]`;break}case"LINK":{if(u.hasAttribute("rel")&&u.hasAttribute("href"))return`link[rel="${u.getAttribute("rel")}"][href="${u.getAttribute("href")}"]`;if(u.hasAttribute("href"))return`link[href="${u.getAttribute("href")}"]`;break}}return m(u)}function J(u){let[e,t=""]=u.split("?");return`${e}?t=${Date.now()}&${t.replace(/t=\\d+/g,"")}`}function C(u){if(u.nodeType===1&&u.hasAttribute("data-persist"))return u;if(u.nodeType===1&&u.localName==="script"){let e=document.createElement("script");for(let{name:t,value:r}of u.attributes)t==="src"&&(r=J(r)),e.setAttribute(t,r);return e.innerHTML=u.innerHTML,e}return u.cloneNode(!0)}function X(u,e){if(u.children.length===0&&e.children.length===0)return[];let t=[],r=new Map,F=new Map,i=new Map;for(let n of u.children)r.set(g(n),n);for(let n of e.children){let l=g(n),D=r.get(l);D?m(n,!1)!==m(D,!1)&&F.set(l,C(n)):i.set(l,C(n)),r.delete(l)}for(let n of u.childNodes){if(n.nodeType===1){let l=g(n);if(r.has(l)){t.push({type:1});continue}else if(F.has(l)){let D=F.get(l);t.push({type:3,attributes:T(n,D),children:U(n,D)});continue}}t.push(void 0)}for(let n of i.values())t.push({type:0,node:C(n)});return t}function U(u,e){let t=[],r=Math.max(u.childNodes.length,e.childNodes.length);for(let F=0;F<r;F++){let i=u.childNodes.item(F),n=e.childNodes.item(F);t[F]=p(i,n)}return t}function p(u,e){if(!u)return{type:0,node:C(e)};if(!e)return{type:1};if(Y(u,e)){if(u.nodeType===3){let t=u.nodeValue,r=e.nodeValue;if(t.trim().length===0&&r.trim().length===0)return}if(u.nodeType===1){if(Q(u,e)){let t=u.tagName==="HEAD"?X:U;return{type:3,attributes:T(u,e),children:t(u,e)}}return{type:2,node:C(e)}}else return u.nodeType===9?p(u.documentElement,e.documentElement):G(u,e)?void 0:{type:2,value:e.nodeValue}}return{type:2,node:C(e)}}function uu(u,e){if(e.length!==0)for(let{type:t,name:r,value:F}of e)t===5?u.removeAttribute(r):t===4&&u.setAttribute(r,F)}async function w(u,e,t){if(!e)return;let r;switch(u.nodeType===9?(u=u.documentElement,r=u):t?r=t:r=u,e.type){case 0:{let{node:F}=e;u.appendChild(F);return}case 1:{if(!r)return;u.removeChild(r);return}case 2:{if(!r)return;let{node:F,value:i}=e;if(typeof i=="string"){r.nodeValue=i;return}r.replaceWith(F);return}case 3:{if(!r)return;let{attributes:F,children:i}=e;uu(r,F);let n=Array.from(r.childNodes);await Promise.all(i.map((l,D)=>w(r,l,n[D])));return}}}function b(u,e){let t=p(u,e);return w(u,t)}var Bu=Object.hasOwnProperty;var O=Z(k(),1),Du=(0,O.default)();function v(u){return u.document.body.dataset.slug}var M=(u,e,t)=>{let r=new URL(u.getAttribute(e),t);u.setAttribute(e,r.pathname+r.hash)};function N(u,e){u.querySelectorAll(\'[href=""], [href^="./"], [href^="../"]\').forEach(t=>M(t,"href",e)),u.querySelectorAll(\'[src=""], [src^="./"], [src^="../"]\').forEach(t=>M(t,"src",e))}var nu=/<link rel="canonical" href="([^"]*)">/;async function P(u){let e=new URL(u);e.searchParams.set("_t",Date.now().toString());let t=await fetch(`${e}`,{cache:"no-store",headers:{"Cache-Control":"no-cache"}});if(!t.headers.get("content-type")?.startsWith("text/html"))return t;let r=await t.clone().text(),[F,i]=r.match(nu)??[];if(i){let n=new URL(i,u);return n.searchParams.set("_t",Date.now().toString()),fetch(`${n}`,{cache:"no-store",headers:{"Cache-Control":"no-cache"}})}return t}var ru=1,d=document.createElement("route-announcer"),Fu=u=>u?.nodeType===ru,ou=u=>{try{let e=new URL(u);if(window.location.origin===e.origin)return!0}catch{}return!1},iu=u=>{let e=u.origin===window.location.origin,t=u.pathname===window.location.pathname;return e&&t},H=({target:u})=>{if(!Fu(u)||u.attributes.getNamedItem("target")?.value==="_blank")return;let e=u.closest("a");if(!e||"routerIgnore"in e.dataset)return;let{href:t}=e;if(ou(t))return{url:new URL(t),scroll:"routerNoscroll"in e.dataset?!1:void 0}};function $(u){let e=new CustomEvent("nav",{detail:{url:u}});document.dispatchEvent(e)}var S=new Set;window.addCleanup=u=>S.add(u);function lu(){let u=document.createElement("div");u.className="navigation-progress",u.style.width="0",document.body.contains(u)||document.body.appendChild(u),setTimeout(()=>{u.style.width="80%"},100)}var B=!1,x;async function su(u,e=!1){B=!0,lu(),x=x||new DOMParser;let t=await P(u).then(D=>{if(D.headers.get("content-type")?.startsWith("text/html"))return D.text();window.location.assign(u)}).catch(()=>{window.location.assign(u)});if(!t)return;let r=new CustomEvent("prenav",{detail:{}});document.dispatchEvent(r),S.forEach(D=>D()),S.clear();let F=x.parseFromString(t,"text/html");N(F,u);let i=F.querySelector("title")?.textContent;if(i)document.title=i;else{let D=document.querySelector("h1");i=D?.innerText??D?.textContent??u.pathname}d.textContent!==i&&(d.textContent=i),d.dataset.persist="",F.body.appendChild(d),b(document.body,F.body),e||(u.hash?document.getElementById(decodeURIComponent(u.hash.substring(1)))?.scrollIntoView():window.scrollTo({top:0})),document.head.querySelectorAll(":not([spa-preserve])").forEach(D=>D.remove()),F.head.querySelectorAll(":not([spa-preserve])").forEach(D=>document.head.appendChild(D)),e||history.pushState({},"",u),$(v(window)),delete d.dataset.persist}async function h(u,e=!1){if(!B){B=!0;try{await su(u,e)}catch(t){console.error(t),window.location.assign(u)}finally{B=!1}}}window.spaNavigate=h;function au(){return typeof window<"u"&&(window.addEventListener("click",async u=>{let{url:e}=H(u)??{};if(!(!e||u.ctrlKey||u.metaKey)){if(u.preventDefault(),iu(e)&&e.hash){document.getElementById(decodeURIComponent(e.hash.substring(1)))?.scrollIntoView(),history.pushState({},"",e);return}h(e,!1)}}),window.addEventListener("popstate",u=>{let{url:e}=H(u)??{};window.location.hash&&window.location.pathname===e?.pathname||h(new URL(window.location.toString()),!0)})),new class{go(e){let t=new URL(e,window.location.toString());return h(t,!1)}back(){return window.history.back()}forward(){return window.history.forward()}}}au();$(v(window));if(!customElements.get("route-announcer")){let u={"aria-live":"assertive","aria-atomic":"true",style:"position: absolute; left: 0; top: 0; clip: rect(0 0 0 0); clip-path: inset(50%); overflow: hidden; white-space: nowrap; width: 1px; height: 1px"};customElements.define("route-announcer",class extends HTMLElement{constructor(){super()}connectedCallback(){for(let[t,r]of Object.entries(u))this.setAttribute(t,r)}})}\n';var popover_inline_default='var re=Object.create;var xt=Object.defineProperty;var se=Object.getOwnPropertyDescriptor;var ce=Object.getOwnPropertyNames;var le=Object.getPrototypeOf,ae=Object.prototype.hasOwnProperty;var De=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var fe=(t,e,n,u)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of ce(e))!ae.call(t,o)&&o!==n&&xt(t,o,{get:()=>e[o],enumerable:!(u=se(e,o))||u.enumerable});return t};var Fe=(t,e,n)=>(n=t!=null?re(le(t)):{},fe(e||!t||!t.__esModule?xt(n,"default",{value:t,enumerable:!0}):n,t));var Jt=De((En,Gt)=>{"use strict";Gt.exports=ze;function K(t){return t instanceof Buffer?Buffer.from(t):new t.constructor(t.buffer.slice(),t.byteOffset,t.length)}function ze(t){if(t=t||{},t.circles)return Ie(t);let e=new Map;if(e.set(Date,i=>new Date(i)),e.set(Map,(i,l)=>new Map(u(Array.from(i),l))),e.set(Set,(i,l)=>new Set(u(Array.from(i),l))),t.constructorHandlers)for(let i of t.constructorHandlers)e.set(i[0],i[1]);let n=null;return t.proto?r:o;function u(i,l){let s=Object.keys(i),c=new Array(s.length);for(let D=0;D<s.length;D++){let a=s[D],f=i[a];typeof f!="object"||f===null?c[a]=f:f.constructor!==Object&&(n=e.get(f.constructor))?c[a]=n(f,l):ArrayBuffer.isView(f)?c[a]=K(f):c[a]=l(f)}return c}function o(i){if(typeof i!="object"||i===null)return i;if(Array.isArray(i))return u(i,o);if(i.constructor!==Object&&(n=e.get(i.constructor)))return n(i,o);let l={};for(let s in i){if(Object.hasOwnProperty.call(i,s)===!1)continue;let c=i[s];typeof c!="object"||c===null?l[s]=c:c.constructor!==Object&&(n=e.get(c.constructor))?l[s]=n(c,o):ArrayBuffer.isView(c)?l[s]=K(c):l[s]=o(c)}return l}function r(i){if(typeof i!="object"||i===null)return i;if(Array.isArray(i))return u(i,r);if(i.constructor!==Object&&(n=e.get(i.constructor)))return n(i,r);let l={};for(let s in i){let c=i[s];typeof c!="object"||c===null?l[s]=c:c.constructor!==Object&&(n=e.get(c.constructor))?l[s]=n(c,r):ArrayBuffer.isView(c)?l[s]=K(c):l[s]=r(c)}return l}}function Ie(t){let e=[],n=[],u=new Map;if(u.set(Date,s=>new Date(s)),u.set(Map,(s,c)=>new Map(r(Array.from(s),c))),u.set(Set,(s,c)=>new Set(r(Array.from(s),c))),t.constructorHandlers)for(let s of t.constructorHandlers)u.set(s[0],s[1]);let o=null;return t.proto?l:i;function r(s,c){let D=Object.keys(s),a=new Array(D.length);for(let f=0;f<D.length;f++){let F=D[f],d=s[F];if(typeof d!="object"||d===null)a[F]=d;else if(d.constructor!==Object&&(o=u.get(d.constructor)))a[F]=o(d,c);else if(ArrayBuffer.isView(d))a[F]=K(d);else{let m=e.indexOf(d);m!==-1?a[F]=n[m]:a[F]=c(d)}}return a}function i(s){if(typeof s!="object"||s===null)return s;if(Array.isArray(s))return r(s,i);if(s.constructor!==Object&&(o=u.get(s.constructor)))return o(s,i);let c={};e.push(s),n.push(c);for(let D in s){if(Object.hasOwnProperty.call(s,D)===!1)continue;let a=s[D];if(typeof a!="object"||a===null)c[D]=a;else if(a.constructor!==Object&&(o=u.get(a.constructor)))c[D]=o(a,i);else if(ArrayBuffer.isView(a))c[D]=K(a);else{let f=e.indexOf(a);f!==-1?c[D]=n[f]:c[D]=i(a)}}return e.pop(),n.pop(),c}function l(s){if(typeof s!="object"||s===null)return s;if(Array.isArray(s))return r(s,l);if(s.constructor!==Object&&(o=u.get(s.constructor)))return o(s,l);let c={};e.push(s),n.push(c);for(let D in s){let a=s[D];if(typeof a!="object"||a===null)c[D]=a;else if(a.constructor!==Object&&(o=u.get(a.constructor)))c[D]=o(a,l);else if(ArrayBuffer.isView(a))c[D]=K(a);else{let f=e.indexOf(a);f!==-1?c[D]=n[f]:c[D]=l(a)}}return e.pop(),n.pop(),c}}});var $=Math.min,b=Math.max,J=Math.round;var S=t=>({x:t,y:t}),de={left:"right",right:"left",bottom:"top",top:"bottom"},me={start:"end",end:"start"};function Ft(t,e,n){return b(t,$(e,n))}function tt(t,e){return typeof t=="function"?t(e):t}function T(t){return t.split("-")[0]}function rt(t){return t.split("-")[1]}function dt(t){return t==="x"?"y":"x"}function mt(t){return t==="y"?"height":"width"}var ge=new Set(["top","bottom"]);function k(t){return ge.has(T(t))?"y":"x"}function gt(t){return dt(k(t))}function yt(t,e,n){n===void 0&&(n=!1);let u=rt(t),o=gt(t),r=mt(o),i=o==="x"?u===(n?"end":"start")?"right":"left":u==="start"?"bottom":"top";return e.reference[r]>e.floating[r]&&(i=G(i)),[i,G(i)]}function vt(t){let e=G(t);return[it(t),e,it(e)]}function it(t){return t.replace(/start|end/g,e=>me[e])}var wt=["left","right"],Bt=["right","left"],pe=["top","bottom"],he=["bottom","top"];function Ae(t,e,n){switch(t){case"top":case"bottom":return n?e?Bt:wt:e?wt:Bt;case"left":case"right":return e?pe:he;default:return[]}}function bt(t,e,n,u){let o=rt(t),r=Ae(T(t),n==="start",u);return o&&(r=r.map(i=>i+"-"+o),e&&(r=r.concat(r.map(it)))),r}function G(t){return t.replace(/left|right|bottom|top/g,e=>de[e])}function Ee(t){return{top:0,right:0,bottom:0,left:0,...t}}function pt(t){return typeof t!="number"?Ee(t):{top:t,right:t,bottom:t,left:t}}function M(t){let{x:e,y:n,width:u,height:o}=t;return{width:u,height:o,top:n,left:e,right:e+u,bottom:n+o,x:e,y:n}}function St(t,e,n){let{reference:u,floating:o}=t,r=k(e),i=gt(e),l=mt(i),s=T(e),c=r==="y",D=u.x+u.width/2-o.width/2,a=u.y+u.height/2-o.height/2,f=u[l]/2-o[l]/2,F;switch(s){case"top":F={x:D,y:u.y-o.height};break;case"bottom":F={x:D,y:u.y+u.height};break;case"right":F={x:u.x+u.width,y:a};break;case"left":F={x:u.x-o.width,y:a};break;default:F={x:u.x,y:u.y}}switch(rt(e)){case"start":F[i]-=f*(n&&c?-1:1);break;case"end":F[i]+=f*(n&&c?-1:1);break}return F}var Rt=async(t,e,n)=>{let{placement:u="bottom",strategy:o="absolute",middleware:r=[],platform:i}=n,l=r.filter(Boolean),s=await(i.isRTL==null?void 0:i.isRTL(e)),c=await i.getElementRects({reference:t,floating:e,strategy:o}),{x:D,y:a}=St(c,u,s),f=u,F={},d=0;for(let m=0;m<l.length;m++){let{name:g,fn:p}=l[m],{x:A,y:h,data:C,reset:E}=await p({x:D,y:a,initialPlacement:u,placement:f,strategy:o,middlewareData:F,rects:c,platform:i,elements:{reference:t,floating:e}});D=A??D,a=h??a,F={...F,[g]:{...F[g],...C}},E&&d<=50&&(d++,typeof E=="object"&&(E.placement&&(f=E.placement),E.rects&&(c=E.rects===!0?await i.getElementRects({reference:t,floating:e,strategy:o}):E.rects),{x:D,y:a}=St(c,f,s)),m=-1)}return{x:D,y:a,placement:f,strategy:o,middlewareData:F}};async function ht(t,e){var n;e===void 0&&(e={});let{x:u,y:o,platform:r,rects:i,elements:l,strategy:s}=t,{boundary:c="clippingAncestors",rootBoundary:D="viewport",elementContext:a="floating",altBoundary:f=!1,padding:F=0}=tt(e,t),d=pt(F),g=l[f?a==="floating"?"reference":"floating":a],p=M(await r.getClippingRect({element:(n=await(r.isElement==null?void 0:r.isElement(g)))==null||n?g:g.contextElement||await(r.getDocumentElement==null?void 0:r.getDocumentElement(l.floating)),boundary:c,rootBoundary:D,strategy:s})),A=a==="floating"?{x:u,y:o,width:i.floating.width,height:i.floating.height}:i.reference,h=await(r.getOffsetParent==null?void 0:r.getOffsetParent(l.floating)),C=await(r.isElement==null?void 0:r.isElement(h))?await(r.getScale==null?void 0:r.getScale(h))||{x:1,y:1}:{x:1,y:1},E=M(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:A,offsetParent:h,strategy:s}):A);return{top:(p.top-E.top+d.top)/C.y,bottom:(E.bottom-p.bottom+d.bottom)/C.y,left:(p.left-E.left+d.left)/C.x,right:(E.right-p.right+d.right)/C.x}}var Ot=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var n,u;let{placement:o,middlewareData:r,rects:i,initialPlacement:l,platform:s,elements:c}=e,{mainAxis:D=!0,crossAxis:a=!0,fallbackPlacements:f,fallbackStrategy:F="bestFit",fallbackAxisSideDirection:d="none",flipAlignment:m=!0,...g}=tt(t,e);if((n=r.arrow)!=null&&n.alignmentOffset)return{};let p=T(o),A=k(l),h=T(l)===l,C=await(s.isRTL==null?void 0:s.isRTL(c.floating)),E=f||(h||!m?[G(l)]:vt(l)),V=d!=="none";!f&&V&&E.push(...bt(l,m,d,C));let ot=[l,...E],Z=await ht(e,g),z=[],x=((u=r.flip)==null?void 0:u.overflows)||[];if(D&&z.push(Z[p]),a){let O=yt(o,i,C);z.push(Z[O[0]],Z[O[1]])}if(x=[...x,{placement:o,overflows:z}],!z.every(O=>O<=0)){var I,Q;let O=(((I=r.flip)==null?void 0:I.index)||0)+1,U=ot[O];if(U&&(!(a==="alignment"?A!==k(U):!1)||x.every(B=>k(B.placement)===A?B.overflows[0]>0:!0)))return{data:{index:O,overflows:x},reset:{placement:U}};let W=(Q=x.filter(P=>P.overflows[0]<=0).sort((P,B)=>P.overflows[1]-B.overflows[1])[0])==null?void 0:Q.placement;if(!W)switch(F){case"bestFit":{var q;let P=(q=x.filter(B=>{if(V){let j=k(B.placement);return j===A||j==="y"}return!0}).map(B=>[B.placement,B.overflows.filter(j=>j>0).reduce((j,ie)=>j+ie,0)]).sort((B,j)=>B[1]-j[1])[0])==null?void 0:q[0];P&&(W=P);break}case"initialPlacement":W=l;break}if(o!==W)return{reset:{placement:W}}}return{}}}};function Lt(t){let e=$(...t.map(r=>r.left)),n=$(...t.map(r=>r.top)),u=b(...t.map(r=>r.right)),o=b(...t.map(r=>r.bottom));return{x:e,y:n,width:u-e,height:o-n}}function Ce(t){let e=t.slice().sort((o,r)=>o.y-r.y),n=[],u=null;for(let o=0;o<e.length;o++){let r=e[o];!u||r.y-u.y>u.height/2?n.push([r]):n[n.length-1].push(r),u=r}return n.map(o=>M(Lt(o)))}var Pt=function(t){return t===void 0&&(t={}),{name:"inline",options:t,async fn(e){let{placement:n,elements:u,rects:o,platform:r,strategy:i}=e,{padding:l=2,x:s,y:c}=tt(t,e),D=Array.from(await(r.getClientRects==null?void 0:r.getClientRects(u.reference))||[]),a=Ce(D),f=M(Lt(D)),F=pt(l);function d(){if(a.length===2&&a[0].left>a[1].right&&s!=null&&c!=null)return a.find(g=>s>g.left-F.left&&s<g.right+F.right&&c>g.top-F.top&&c<g.bottom+F.bottom)||f;if(a.length>=2){if(k(n)==="y"){let x=a[0],I=a[a.length-1],Q=T(n)==="top",q=x.top,O=I.bottom,U=Q?x.left:I.left,W=Q?x.right:I.right,P=W-U,B=O-q;return{top:q,bottom:O,left:U,right:W,width:P,height:B,x:U,y:q}}let g=T(n)==="left",p=b(...a.map(x=>x.right)),A=$(...a.map(x=>x.left)),h=a.filter(x=>g?x.left===A:x.right===p),C=h[0].top,E=h[h.length-1].bottom,V=A,ot=p,Z=ot-V,z=E-C;return{top:C,bottom:E,left:V,right:ot,width:Z,height:z,x:V,y:C}}return f}let m=await r.getElementRects({reference:{getBoundingClientRect:d},floating:u.floating,strategy:i});return o.reference.x!==m.reference.x||o.reference.y!==m.reference.y||o.reference.width!==m.reference.width||o.reference.height!==m.reference.height?{reset:{rects:m}}:{}}}};var Tt=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){let{x:n,y:u,placement:o}=e,{mainAxis:r=!0,crossAxis:i=!1,limiter:l={fn:g=>{let{x:p,y:A}=g;return{x:p,y:A}}},...s}=tt(t,e),c={x:n,y:u},D=await ht(e,s),a=k(T(o)),f=dt(a),F=c[f],d=c[a];if(r){let g=f==="y"?"top":"left",p=f==="y"?"bottom":"right",A=F+D[g],h=F-D[p];F=Ft(A,F,h)}if(i){let g=a==="y"?"top":"left",p=a==="y"?"bottom":"right",A=d+D[g],h=d-D[p];d=Ft(A,d,h)}let m=l.fn({...e,[f]:F,[a]:d});return{...m,data:{x:m.x-n,y:m.y-u,enabled:{[f]:r,[a]:i}}}}}};function ct(){return typeof window<"u"}function N(t){return Mt(t)?(t.nodeName||"").toLowerCase():"#document"}function w(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function L(t){var e;return(e=(Mt(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Mt(t){return ct()?t instanceof Node||t instanceof w(t).Node:!1}function y(t){return ct()?t instanceof Element||t instanceof w(t).Element:!1}function R(t){return ct()?t instanceof HTMLElement||t instanceof w(t).HTMLElement:!1}function kt(t){return!ct()||typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof w(t).ShadowRoot}var xe=new Set(["inline","contents"]);function X(t){let{overflow:e,overflowX:n,overflowY:u,display:o}=v(t);return/auto|scroll|overlay|hidden|clip/.test(e+u+n)&&!xe.has(o)}var we=new Set(["table","td","th"]);function Ht(t){return we.has(N(t))}var Be=[":popover-open",":modal"];function et(t){return Be.some(e=>{try{return t.matches(e)}catch{return!1}})}var ye=["transform","translate","scale","rotate","perspective"],ve=["transform","translate","scale","rotate","perspective","filter"],be=["paint","layout","strict","content"];function lt(t){let e=at(),n=y(t)?v(t):t;return ye.some(u=>n[u]?n[u]!=="none":!1)||(n.containerType?n.containerType!=="normal":!1)||!e&&(n.backdropFilter?n.backdropFilter!=="none":!1)||!e&&(n.filter?n.filter!=="none":!1)||ve.some(u=>(n.willChange||"").includes(u))||be.some(u=>(n.contain||"").includes(u))}function Wt(t){let e=H(t);for(;R(e)&&!_(e);){if(lt(e))return e;if(et(e))return null;e=H(e)}return null}function at(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}var Se=new Set(["html","body","#document"]);function _(t){return Se.has(N(t))}function v(t){return w(t).getComputedStyle(t)}function nt(t){return y(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function H(t){if(N(t)==="html")return t;let e=t.assignedSlot||t.parentNode||kt(t)&&t.host||L(t);return kt(e)?e.host:e}function jt(t){let e=H(t);return _(e)?t.ownerDocument?t.ownerDocument.body:t.body:R(e)&&X(e)?e:jt(e)}function st(t,e,n){var u;e===void 0&&(e=[]),n===void 0&&(n=!0);let o=jt(t),r=o===((u=t.ownerDocument)==null?void 0:u.body),i=w(o);if(r){let l=Dt(i);return e.concat(i,i.visualViewport||[],X(o)?o:[],l&&n?st(l):[])}return e.concat(o,st(o,[],n))}function Dt(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function _t(t){let e=v(t),n=parseFloat(e.width)||0,u=parseFloat(e.height)||0,o=R(t),r=o?t.offsetWidth:n,i=o?t.offsetHeight:u,l=J(n)!==r||J(u)!==i;return l&&(n=r,u=i),{width:n,height:u,$:l}}function Vt(t){return y(t)?t:t.contextElement}function Y(t){let e=Vt(t);if(!R(e))return S(1);let n=e.getBoundingClientRect(),{width:u,height:o,$:r}=_t(e),i=(r?J(n.width):n.width)/u,l=(r?J(n.height):n.height)/o;return(!i||!Number.isFinite(i))&&(i=1),(!l||!Number.isFinite(l))&&(l=1),{x:i,y:l}}var Re=S(0);function zt(t){let e=w(t);return!at()||!e.visualViewport?Re:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Oe(t,e,n){return e===void 0&&(e=!1),!n||e&&n!==w(t)?!1:e}function ut(t,e,n,u){e===void 0&&(e=!1),n===void 0&&(n=!1);let o=t.getBoundingClientRect(),r=Vt(t),i=S(1);e&&(u?y(u)&&(i=Y(u)):i=Y(t));let l=Oe(r,n,u)?zt(r):S(0),s=(o.left+l.x)/i.x,c=(o.top+l.y)/i.y,D=o.width/i.x,a=o.height/i.y;if(r){let f=w(r),F=u&&y(u)?w(u):u,d=f,m=Dt(d);for(;m&&u&&F!==d;){let g=Y(m),p=m.getBoundingClientRect(),A=v(m),h=p.left+(m.clientLeft+parseFloat(A.paddingLeft))*g.x,C=p.top+(m.clientTop+parseFloat(A.paddingTop))*g.y;s*=g.x,c*=g.y,D*=g.x,a*=g.y,s+=h,c+=C,d=w(m),m=Dt(d)}}return M({width:D,height:a,x:s,y:c})}function ft(t,e){let n=nt(t).scrollLeft;return e?e.left+n:ut(L(t)).left+n}function It(t,e){let n=t.getBoundingClientRect(),u=n.left+e.scrollLeft-ft(t,n),o=n.top+e.scrollTop;return{x:u,y:o}}function Le(t){let{elements:e,rect:n,offsetParent:u,strategy:o}=t,r=o==="fixed",i=L(u),l=e?et(e.floating):!1;if(u===i||l&&r)return n;let s={scrollLeft:0,scrollTop:0},c=S(1),D=S(0),a=R(u);if((a||!a&&!r)&&((N(u)!=="body"||X(i))&&(s=nt(u)),R(u))){let F=ut(u);c=Y(u),D.x=F.x+u.clientLeft,D.y=F.y+u.clientTop}let f=i&&!a&&!r?It(i,s):S(0);return{width:n.width*c.x,height:n.height*c.y,x:n.x*c.x-s.scrollLeft*c.x+D.x+f.x,y:n.y*c.y-s.scrollTop*c.y+D.y+f.y}}function Pe(t){return Array.from(t.getClientRects())}function Te(t){let e=L(t),n=nt(t),u=t.ownerDocument.body,o=b(e.scrollWidth,e.clientWidth,u.scrollWidth,u.clientWidth),r=b(e.scrollHeight,e.clientHeight,u.scrollHeight,u.clientHeight),i=-n.scrollLeft+ft(t),l=-n.scrollTop;return v(u).direction==="rtl"&&(i+=b(e.clientWidth,u.clientWidth)-o),{width:o,height:r,x:i,y:l}}var $t=25;function ke(t,e){let n=w(t),u=L(t),o=n.visualViewport,r=u.clientWidth,i=u.clientHeight,l=0,s=0;if(o){r=o.width,i=o.height;let D=at();(!D||D&&e==="fixed")&&(l=o.offsetLeft,s=o.offsetTop)}let c=ft(u);if(c<=0){let D=u.ownerDocument,a=D.body,f=getComputedStyle(a),F=D.compatMode==="CSS1Compat"&&parseFloat(f.marginLeft)+parseFloat(f.marginRight)||0,d=Math.abs(u.clientWidth-a.clientWidth-F);d<=$t&&(r-=d)}else c<=$t&&(r+=c);return{width:r,height:i,x:l,y:s}}var Me=new Set(["absolute","fixed"]);function He(t,e){let n=ut(t,!0,e==="fixed"),u=n.top+t.clientTop,o=n.left+t.clientLeft,r=R(t)?Y(t):S(1),i=t.clientWidth*r.x,l=t.clientHeight*r.y,s=o*r.x,c=u*r.y;return{width:i,height:l,x:s,y:c}}function Ut(t,e,n){let u;if(e==="viewport")u=ke(t,n);else if(e==="document")u=Te(L(t));else if(y(e))u=He(e,n);else{let o=zt(t);u={x:e.x-o.x,y:e.y-o.y,width:e.width,height:e.height}}return M(u)}function qt(t,e){let n=H(t);return n===e||!y(n)||_(n)?!1:v(n).position==="fixed"||qt(n,e)}function We(t,e){let n=e.get(t);if(n)return n;let u=st(t,[],!1).filter(l=>y(l)&&N(l)!=="body"),o=null,r=v(t).position==="fixed",i=r?H(t):t;for(;y(i)&&!_(i);){let l=v(i),s=lt(i);!s&&l.position==="fixed"&&(o=null),(r?!s&&!o:!s&&l.position==="static"&&!!o&&Me.has(o.position)||X(i)&&!s&&qt(t,i))?u=u.filter(D=>D!==i):o=l,i=H(i)}return e.set(t,u),u}function je(t){let{element:e,boundary:n,rootBoundary:u,strategy:o}=t,i=[...n==="clippingAncestors"?et(e)?[]:We(e,this._c):[].concat(n),u],l=i[0],s=i.reduce((c,D)=>{let a=Ut(e,D,o);return c.top=b(a.top,c.top),c.right=$(a.right,c.right),c.bottom=$(a.bottom,c.bottom),c.left=b(a.left,c.left),c},Ut(e,l,o));return{width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}}function $e(t){let{width:e,height:n}=_t(t);return{width:e,height:n}}function Ue(t,e,n){let u=R(e),o=L(e),r=n==="fixed",i=ut(t,!0,r,e),l={scrollLeft:0,scrollTop:0},s=S(0);function c(){s.x=ft(o)}if(u||!u&&!r)if((N(e)!=="body"||X(o))&&(l=nt(e)),u){let F=ut(e,!0,r,e);s.x=F.x+e.clientLeft,s.y=F.y+e.clientTop}else o&&c();r&&!u&&o&&c();let D=o&&!u&&!r?It(o,l):S(0),a=i.left+l.scrollLeft-s.x-D.x,f=i.top+l.scrollTop-s.y-D.y;return{x:a,y:f,width:i.width,height:i.height}}function At(t){return v(t).position==="static"}function Nt(t,e){if(!R(t)||v(t).position==="fixed")return null;if(e)return e(t);let n=t.offsetParent;return L(t)===n&&(n=n.ownerDocument.body),n}function Xt(t,e){let n=w(t);if(et(t))return n;if(!R(t)){let o=H(t);for(;o&&!_(o);){if(y(o)&&!At(o))return o;o=H(o)}return n}let u=Nt(t,e);for(;u&&Ht(u)&&At(u);)u=Nt(u,e);return u&&_(u)&&At(u)&&!lt(u)?n:u||Wt(t)||n}var Ne=async function(t){let e=this.getOffsetParent||Xt,n=this.getDimensions,u=await n(t.floating);return{reference:Ue(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:u.width,height:u.height}}};function _e(t){return v(t).direction==="rtl"}var Ve={convertOffsetParentRelativeRectToViewportRelativeRect:Le,getDocumentElement:L,getClippingRect:je,getOffsetParent:Xt,getElementRects:Ne,getClientRects:Pe,getDimensions:$e,getScale:Y,isElement:y,isRTL:_e};var Yt=Tt,Kt=Ot;var Zt=Pt;var Qt=(t,e,n)=>{let u=new Map,o={platform:Ve,...n},r={...o.platform,_c:u};return Rt(t,e,{...o,platform:r})};var hn=Object.hasOwnProperty;var te=Fe(Jt(),1),qe=(0,te.default)();var ee=(t,e,n)=>{let u=new URL(t.getAttribute(e),n);t.setAttribute(e,u.pathname+u.hash)};function ne(t,e){t.querySelectorAll(\'[href=""], [href^="./"], [href^="../"]\').forEach(n=>ee(n,"href",e)),t.querySelectorAll(\'[src=""], [src^="./"], [src^="../"]\').forEach(n=>ee(n,"src",e))}var Xe=/<link rel="canonical" href="([^"]*)">/;async function ue(t){let e=new URL(t);e.searchParams.set("_t",Date.now().toString());let n=await fetch(`${e}`,{cache:"no-store",headers:{"Cache-Control":"no-cache"}});if(!n.headers.get("content-type")?.startsWith("text/html"))return n;let u=await n.clone().text(),[o,r]=u.match(Xe)??[];if(r){let i=new URL(r,t);return i.searchParams.set("_t",Date.now().toString()),fetch(`${i}`,{cache:"no-store",headers:{"Cache-Control":"no-cache"}})}return n}var Ye=new DOMParser,Et=null;async function oe({clientX:t,clientY:e}){let n=Et=this;if(n.dataset.noPopover==="true")return;async function u(m){let{x:g,y:p}=await Qt(n,m,{strategy:"fixed",middleware:[Zt({x:t,y:e}),Yt(),Kt()]});Object.assign(m.style,{transform:`translate(${g.toFixed()}px, ${p.toFixed()}px)`})}function o(m){if(Ct(),m.classList.add("active-popover"),u(m),i!==""){let g=`#popover-internal-${i.slice(1)}`,p=d.querySelector(g);p&&d.scroll({top:p.offsetTop-12,behavior:"instant"})}}let r=new URL(n.href),i=decodeURIComponent(r.hash);r.hash="",r.search="";let l=`popover-${n.pathname}`,s=document.getElementById(l);if(document.getElementById(l)){o(s);return}let c=await ue(r).catch(m=>{console.error(m)});if(!c)return;let[D]=c.headers.get("Content-Type").split(";"),[a,f]=D.split("/"),F=document.createElement("div");F.id=l,F.classList.add("popover");let d=document.createElement("div");switch(d.classList.add("popover-inner"),d.dataset.contentType=D??void 0,F.appendChild(d),a){case"image":let m=document.createElement("img");m.src=r.toString(),m.alt=r.pathname,d.appendChild(m);break;case"application":switch(f){case"pdf":let h=document.createElement("iframe");h.src=r.toString(),d.appendChild(h);break;default:break}break;default:let g=await c.text(),p=Ye.parseFromString(g,"text/html");ne(p,r),p.querySelectorAll("[id]").forEach(h=>{let C=`popover-internal-${h.id}`;h.id=C});let A=[...p.getElementsByClassName("popover-hint")];if(A.length===0)return;A.forEach(h=>d.appendChild(h))}document.getElementById(l)||(document.body.appendChild(F),Et===this&&o(F))}function Ct(){Et=null,document.querySelectorAll(".popover").forEach(e=>e.classList.remove("active-popover"))}document.addEventListener("nav",()=>{let t=[...document.querySelectorAll("a.internal")];for(let e of t)e.addEventListener("mouseenter",oe),e.addEventListener("mouseleave",Ct),window.addCleanup(()=>{e.removeEventListener("mouseenter",oe),e.removeEventListener("mouseleave",Ct)})});\n';var custom_default=`@charset "UTF-8";
/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
code[data-theme*=" "] {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

code[data-theme*=" "] span {
  color: var(--shiki-light);
}

[saved-theme=dark] code[data-theme*=" "] {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}

[saved-theme=dark] code[data-theme*=" "] span {
  color: var(--shiki-dark);
}

.callout {
  border: 1px solid var(--border);
  background-color: var(--bg);
  border-radius: 5px;
  padding: 0 1rem;
  overflow-y: hidden;
  box-sizing: border-box;
  --callout-icon-note: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>');
  --callout-icon-abstract: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>');
  --callout-icon-info: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>');
  --callout-icon-todo: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>');
  --callout-icon-tip: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg> ');
  --callout-icon-success: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ');
  --callout-icon-question: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> ');
  --callout-icon-warning: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>');
  --callout-icon-failure: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> ');
  --callout-icon-danger: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> ');
  --callout-icon-bug: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="14" x="8" y="6" rx="4"></rect><path d="m19 7-3 2"></path><path d="m5 7 3 2"></path><path d="m19 19-3-2"></path><path d="m5 19 3-2"></path><path d="M20 13h-4"></path><path d="M4 13h4"></path><path d="m10 4 1 2"></path><path d="m14 4-1 2"></path></svg>');
  --callout-icon-example: url('data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> ');
  --callout-icon-quote: url('data:image/svg+xml; utf8, <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>');
  --callout-icon-fold: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Cpolyline points="6 9 12 15 18 9"%3E%3C/polyline%3E%3C/svg%3E');
}
.callout > .callout-content {
  display: grid;
  transition: grid-template-rows 0.1s cubic-bezier(0.02, 0.01, 0.47, 1);
  overflow: hidden;
}
.callout > .callout-content > :first-child {
  margin-top: 0;
}
.callout[data-callout] {
  --color: #448aff;
  --border: #448aff44;
  --bg: #448aff10;
  --callout-icon: var(--callout-icon-note);
}
.callout[data-callout=abstract] {
  --color: #00b0ff;
  --border: #00b0ff44;
  --bg: #00b0ff10;
  --callout-icon: var(--callout-icon-abstract);
}
.callout[data-callout=info], .callout[data-callout=todo] {
  --color: #00b8d4;
  --border: #00b8d444;
  --bg: #00b8d410;
  --callout-icon: var(--callout-icon-info);
}
.callout[data-callout=todo] {
  --callout-icon: var(--callout-icon-todo);
}
.callout[data-callout=tip] {
  --color: #00bfa5;
  --border: #00bfa544;
  --bg: #00bfa510;
  --callout-icon: var(--callout-icon-tip);
}
.callout[data-callout=success] {
  --color: #09ad7a;
  --border: #09ad7144;
  --bg: #09ad7110;
  --callout-icon: var(--callout-icon-success);
}
.callout[data-callout=question] {
  --color: #dba642;
  --border: #dba64244;
  --bg: #dba64210;
  --callout-icon: var(--callout-icon-question);
}
.callout[data-callout=warning] {
  --color: #db8942;
  --border: #db894244;
  --bg: #db894210;
  --callout-icon: var(--callout-icon-warning);
}
.callout[data-callout=failure], .callout[data-callout=danger], .callout[data-callout=bug] {
  --color: #db4242;
  --border: #db424244;
  --bg: #db424210;
  --callout-icon: var(--callout-icon-failure);
}
.callout[data-callout=bug] {
  --callout-icon: var(--callout-icon-bug);
}
.callout[data-callout=danger] {
  --callout-icon: var(--callout-icon-danger);
}
.callout[data-callout=example] {
  --color: #7a43b5;
  --border: #7a43b544;
  --bg: #7a43b510;
  --callout-icon: var(--callout-icon-example);
}
.callout[data-callout=quote] {
  --color: var(--secondary);
  --border: var(--lightgray);
  --callout-icon: var(--callout-icon-quote);
}
.callout.is-collapsed > .callout-title > .fold-callout-icon {
  transform: rotateZ(-90deg);
}
.callout.is-collapsed .callout-content > :first-child {
  transition: height 0.1s cubic-bezier(0.02, 0.01, 0.47, 1), margin 0.1s cubic-bezier(0.02, 0.01, 0.47, 1);
  overflow-y: clip;
  height: 0;
  margin-top: -1rem;
}

.callout-title {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  padding: 1rem 0;
  color: var(--color);
  --icon-size: 18px;
}
.callout-title .fold-callout-icon {
  transition: transform 0.15s ease;
  opacity: 0.8;
  cursor: pointer;
  --callout-icon: var(--callout-icon-fold);
}
.callout-title > .callout-title-inner > p {
  color: var(--color);
  margin: 0;
}
.callout-title .callout-icon, .callout-title .fold-callout-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  flex: 0 0 var(--icon-size);
  background-size: var(--icon-size) var(--icon-size);
  background-position: center;
  background-color: var(--color);
  mask-image: var(--callout-icon);
  mask-size: var(--icon-size) var(--icon-size);
  mask-position: center;
  mask-repeat: no-repeat;
  padding: 0.2rem 0;
}
.callout-title .callout-title-inner {
  font-weight: 600;
}

html {
  scroll-behavior: smooth;
  text-size-adjust: none;
  overflow-x: hidden;
  width: 100vw;
}

body {
  margin: 0;
  box-sizing: border-box;
  background-color: var(--light);
  font-family: var(--bodyFont);
  color: var(--darkgray);
}

.text-highlight {
  background-color: var(--textHighlight);
  padding: 0 0.1rem;
  border-radius: 5px;
}

::selection {
  background: color-mix(in srgb, var(--tertiary) 60%, rgba(255, 255, 255, 0));
  color: var(--darkgray);
}

p,
ul,
text,
a,
tr,
td,
li,
ol,
ul,
.katex,
.math,
.typst-doc,
.typst-doc * {
  color: var(--darkgray);
  fill: var(--darkgray);
  overflow-wrap: break-word;
  text-wrap: pretty;
}

.math.math-display {
  text-align: center;
}

article > mjx-container.MathJax,
article blockquote > div > mjx-container.MathJax {
  display: flex;
}
article > mjx-container.MathJax > svg,
article blockquote > div > mjx-container.MathJax > svg {
  margin-left: auto;
  margin-right: auto;
}
article blockquote > div > mjx-container.MathJax > svg {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

strong {
  font-weight: 600;
}

a {
  font-weight: normal;
  text-decoration: none;
  transition: color 0.2s ease;
  color: var(--secondary);
}
a:hover {
  color: var(--tertiary);
}
a.internal {
  text-decoration: none;
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  line-height: 1.4rem;
}
a.internal.broken {
  color: var(--secondary);
  opacity: 0.5;
  transition: opacity 0.2s ease;
}
a.internal.broken:hover {
  opacity: 0.8;
}
a.internal:has(> img) {
  background-color: transparent;
  border-radius: 0;
  padding: 0;
}
a.internal.tag-link::before {
  content: "#";
}
a.external .external-icon {
  height: 1ex;
  margin: 0 0.15em;
}
a.external .external-icon > path {
  fill: var(--dark);
}

.flex-component {
  display: flex;
}

.desktop-only {
  display: initial;
}
.desktop-only.flex-component {
  display: flex;
}
@media all and ((max-width: 800px)) {
  .desktop-only {
    display: none;
  }
  .desktop-only.flex-component {
    display: none;
  }
}

.mobile-only {
  display: none;
}
.mobile-only.flex-component {
  display: none;
}
@media all and ((max-width: 800px)) {
  .mobile-only {
    display: initial;
  }
  .mobile-only.flex-component {
    display: flex;
  }
}

.page {
  max-width: calc(1200px + 300px);
  margin: 0 auto;
}
.page article > h1 {
  font-size: 2rem;
}
.page article li:has(> input[type=checkbox]) {
  list-style-type: none;
  padding-left: 0;
}
.page article li:has(> input[type=checkbox]:checked) {
  text-decoration: line-through;
  text-decoration-color: var(--gray);
  color: var(--gray);
}
.page article li > * {
  margin-top: 0;
  margin-bottom: 0;
}
.page article p > strong {
  color: var(--dark);
}
.page > #quartz-body {
  display: grid;
  grid-template-columns: 320px auto 320px;
  grid-template-rows: auto auto auto;
  column-gap: 5px;
  row-gap: 5px;
  grid-template-areas: "grid-sidebar-left grid-header grid-sidebar-right"      "grid-sidebar-left grid-center grid-sidebar-right"      "grid-sidebar-left grid-footer grid-sidebar-right";
}
@media all and ((min-width: 800px) and (max-width: 1200px)) {
  .page > #quartz-body {
    grid-template-columns: 320px auto;
    grid-template-rows: auto auto auto auto;
    column-gap: 5px;
    row-gap: 5px;
    grid-template-areas: "grid-sidebar-left grid-header"      "grid-sidebar-left grid-center"      "grid-sidebar-left grid-sidebar-right"      "grid-sidebar-left grid-footer";
  }
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body {
    grid-template-columns: auto;
    grid-template-rows: auto auto auto auto auto;
    column-gap: 5px;
    row-gap: 5px;
    grid-template-areas: "grid-sidebar-left"      "grid-header"      "grid-center"      "grid-sidebar-right"      "grid-footer";
  }
}
@media all and not ((min-width: 1200px)) {
  .page > #quartz-body {
    padding: 0 1rem;
  }
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body {
    margin: 0 auto;
  }
}
.page > #quartz-body .sidebar {
  gap: 1.2rem;
  top: 0;
  box-sizing: border-box;
  padding: 6rem 2rem 2rem 2rem;
  display: flex;
  height: 100vh;
  position: sticky;
}
.page > #quartz-body .sidebar.left {
  z-index: 1;
  grid-area: grid-sidebar-left;
  flex-direction: column;
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .sidebar.left {
    gap: 0;
    align-items: center;
    position: initial;
    display: flex;
    height: unset;
    flex-direction: row;
    padding: 0;
    padding-top: 2rem;
  }
}
.page > #quartz-body .sidebar.right {
  grid-area: grid-sidebar-right;
  margin-right: 0;
  flex-direction: column;
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .sidebar.right {
    margin-left: inherit;
    margin-right: inherit;
  }
}
@media all and not ((min-width: 1200px)) {
  .page > #quartz-body .sidebar.right {
    position: initial;
    height: unset;
    width: 100%;
    flex-direction: row;
    padding: 0;
  }
  .page > #quartz-body .sidebar.right > * {
    flex: 1;
    max-height: 24rem;
  }
  .page > #quartz-body .sidebar.right > .toc {
    display: none;
  }
}
.page > #quartz-body .page-header, .page > #quartz-body .page-footer {
  margin-top: 1rem;
}
.page > #quartz-body .page-header {
  grid-area: grid-header;
  margin: 6rem 0 0 0;
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .page-header {
    margin-top: 0;
    padding: 0;
  }
}
.page > #quartz-body .center > article {
  grid-area: grid-center;
}
.page > #quartz-body footer {
  grid-area: grid-footer;
}
.page > #quartz-body .center, .page > #quartz-body footer {
  max-width: 100%;
  min-width: 100%;
  margin-left: auto;
  margin-right: auto;
}
@media all and ((min-width: 800px) and (max-width: 1200px)) {
  .page > #quartz-body .center, .page > #quartz-body footer {
    margin-right: 0;
  }
}
@media all and ((max-width: 800px)) {
  .page > #quartz-body .center, .page > #quartz-body footer {
    margin-right: 0;
    margin-left: 0;
  }
}
.page > #quartz-body footer {
  margin-left: 0;
}

.footnotes {
  margin-top: 2rem;
  border-top: 1px solid var(--lightgray);
}

input[type=checkbox] {
  transform: translateY(2px);
  color: var(--secondary);
  border: 1px solid var(--lightgray);
  border-radius: 3px;
  background-color: var(--light);
  position: relative;
  margin-inline-end: 0.2rem;
  margin-inline-start: -1.4rem;
  appearance: none;
  width: 16px;
  height: 16px;
}
input[type=checkbox]:checked {
  border-color: var(--secondary);
  background-color: var(--secondary);
}
input[type=checkbox]:checked::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  display: block;
  border: solid var(--light);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

blockquote {
  margin: 1rem 0;
  border-left: 3px solid var(--secondary);
  padding-left: 1rem;
  transition: border-color 0.2s ease;
}

h1,
h2,
h3,
h4,
h5,
h6,
thead {
  font-family: var(--headerFont);
  color: var(--dark);
  font-weight: revert;
  margin-bottom: 0;
}
article > h1 > a[role=anchor],
article > h2 > a[role=anchor],
article > h3 > a[role=anchor],
article > h4 > a[role=anchor],
article > h5 > a[role=anchor],
article > h6 > a[role=anchor],
article > thead > a[role=anchor] {
  color: var(--dark);
  background-color: transparent;
}

h1[id] > a[href^="#"],
h2[id] > a[href^="#"],
h3[id] > a[href^="#"],
h4[id] > a[href^="#"],
h5[id] > a[href^="#"],
h6[id] > a[href^="#"] {
  margin: 0 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  transform: translateY(-0.1rem);
  font-family: var(--codeFont);
  user-select: none;
}
h1[id]:hover > a,
h2[id]:hover > a,
h3[id]:hover > a,
h4[id]:hover > a,
h5[id]:hover > a,
h6[id]:hover > a {
  opacity: 1;
}
h1:not([id]) > a[role=anchor],
h2:not([id]) > a[role=anchor],
h3:not([id]) > a[role=anchor],
h4:not([id]) > a[role=anchor],
h5:not([id]) > a[role=anchor],
h6:not([id]) > a[role=anchor] {
  display: none;
}

h1 {
  font-size: 1.4rem;
  margin-top: 1.9rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.4rem;
  margin-top: 1.9rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.12rem;
  margin-top: 1.62rem;
  margin-bottom: 1rem;
}

h4,
h5,
h6 {
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

figure[data-rehype-pretty-code-figure] {
  margin: 0;
  position: relative;
  line-height: 1.6rem;
  position: relative;
}
figure[data-rehype-pretty-code-figure] > [data-rehype-pretty-code-title] {
  font-family: var(--codeFont);
  font-size: 0.9rem;
  padding: 0.1rem 0.5rem;
  border: 1px solid var(--lightgray);
  width: fit-content;
  border-radius: 5px;
  margin-bottom: -0.5rem;
  color: var(--darkgray);
}
figure[data-rehype-pretty-code-figure] > pre {
  padding: 0;
}

pre {
  font-family: var(--codeFont);
  padding: 0 0.5rem;
  border-radius: 5px;
  overflow-x: auto;
  border: 1px solid var(--lightgray);
  position: relative;
}
pre:has(> code.mermaid) {
  border: none;
}
pre > code {
  background: none;
  padding: 0;
  font-size: 0.85rem;
  counter-reset: line;
  counter-increment: line 0;
  display: grid;
  padding: 0.5rem 0;
  overflow-x: auto;
}
pre > code [data-highlighted-chars] {
  background-color: var(--highlight);
  border-radius: 5px;
}
pre > code > [data-line] {
  padding: 0 0.25rem;
  box-sizing: border-box;
  border-left: 3px solid transparent;
}
pre > code > [data-line][data-highlighted-line] {
  background-color: var(--highlight);
  border-left: 3px solid var(--secondary);
}
pre > code > [data-line]::before {
  content: counter(line);
  counter-increment: line;
  width: 1rem;
  margin-right: 1rem;
  display: inline-block;
  text-align: right;
  color: rgba(115, 138, 148, 0.6);
}
pre > code[data-line-numbers-max-digits="2"] > [data-line]::before {
  width: 2rem;
}
pre > code[data-line-numbers-max-digits="3"] > [data-line]::before {
  width: 3rem;
}

code {
  font-size: 0.9em;
  color: var(--dark);
  font-family: var(--codeFont);
  border-radius: 5px;
  padding: 0.1rem 0.2rem;
  background: var(--lightgray);
}

tbody,
li,
p {
  line-height: 1.6rem;
}

.table-container {
  overflow-x: auto;
}
.table-container > table {
  margin: 1rem;
  padding: 1.5rem;
  border-collapse: collapse;
}
.table-container > table th,
.table-container > table td {
  min-width: 75px;
}
.table-container > table > * {
  line-height: 2rem;
}

th {
  text-align: left;
  padding: 0.4rem 0.7rem;
  border-bottom: 2px solid var(--gray);
}

td {
  padding: 0.2rem 0.7rem;
}

tr {
  border-bottom: 1px solid var(--lightgray);
}
tr:last-child {
  border-bottom: none;
}

img {
  max-width: 100%;
  border-radius: 5px;
  margin: 1rem 0;
  content-visibility: auto;
}

p > img + em {
  display: block;
  transform: translateY(-1rem);
}

hr {
  width: 100%;
  margin: 2rem auto;
  height: 1px;
  border: none;
  background-color: var(--lightgray);
}

audio,
video {
  width: 100%;
  border-radius: 5px;
}

.spacer {
  flex: 2 1 auto;
}

div:has(> .overflow) {
  max-height: 100%;
  overflow-y: hidden;
}

ul.overflow,
ol.overflow {
  max-height: 100%;
  overflow-y: auto;
  width: 100%;
  margin-bottom: 0;
  content: "";
  clear: both;
}
ul.overflow > li.overflow-end,
ol.overflow > li.overflow-end {
  height: 0.5rem;
  margin: 0;
}
ul.overflow.gradient-active,
ol.overflow.gradient-active {
  mask-image: linear-gradient(to bottom, black calc(100% - 50px), transparent 100%);
}

.transclude ul {
  padding-left: 1rem;
}

.katex-display {
  display: initial;
  overflow-x: auto;
  overflow-y: hidden;
}

.external-embed.youtube,
iframe.pdf {
  aspect-ratio: 16/9;
  height: 100%;
  width: 100%;
  border-radius: 5px;
}

.navigation-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--secondary);
  transition: width 0.2s ease;
  z-index: 9999;
}

/* Family History Website - Custom Styles for Profiles */
/* Dual-Pane Layout for Profile Pages */
body:has([data-slug*="profiles/People/"]) #quartz-body {
  display: grid !important;
  grid-template-columns: 20% 80% !important;
  gap: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
}
body:has([data-slug*="profiles/People/"]) #quartz-body .sidebar.left {
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}
body:has([data-slug*="profiles/People/"]) #quartz-body .center {
  padding: 0 4rem;
}
body:has([data-slug*="profiles/People/"]) #quartz-body .sidebar.right {
  display: flex !important; /* Show right sidebar for backlinks */
}

/* Profile Header Styling */
.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--light);
  border-radius: 8px;
  border-left: 4px solid var(--secondary);
}

/* Mermaid Diagram Enhancement */
pre:has(> code.mermaid) {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
  cursor: grab;
  user-select: none;
}
pre:has(> code.mermaid):active {
  cursor: grabbing;
}

.mermaid {
  background: var(--light);
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.mermaid .node {
  cursor: pointer;
  transition: all 0.2s ease;
}
.mermaid .node:hover rect {
  filter: brightness(1.1);
  stroke-width: 3px !important;
}
.mermaid a {
  color: #0066cc !important;
  text-decoration: none;
  cursor: pointer !important;
}
.mermaid a:hover {
  text-decoration: underline;
}
.mermaid .nodeLabel {
  color: #0066cc !important;
}
.mermaid svg {
  max-width: none;
  height: auto;
}

/* Responsive - Mobile stacks vertically */
@media (max-width: 1024px) {
  body:has([data-slug*="profiles/People/"]) .page {
    grid-template-columns: 1fr;
  }
}
:root {
  color-scheme: light !important;
}

article {
  max-width: 800px;
  line-height: 1.6;
  font-size: 0.95rem;
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
}
article a {
  color: #0066cc;
  font-weight: normal;
  background-color: transparent !important;
  padding: 0 !important;
  transition: color 0.2s ease, text-decoration 0.2s ease;
}
article a:hover {
  text-decoration: underline;
}
article strong {
  color: #666;
  font-weight: 600;
}
article p, article span, article div {
  color: #000;
}
article h2 {
  font-size: 1.2rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.tab-pane {
  max-width: 800px;
  line-height: 1.6;
  font-size: 0.95rem;
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
}
.tab-pane a {
  color: #0066cc;
  font-weight: normal;
  background-color: transparent !important;
  padding: 0 !important;
  transition: color 0.2s ease, text-decoration 0.2s ease;
}
.tab-pane a:hover {
  text-decoration: underline;
}
.tab-pane strong {
  color: #666;
  font-weight: 600;
}
.tab-pane p, .tab-pane span, .tab-pane div {
  color: #000;
}
.tab-pane h2 {
  font-size: 1.2rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}
.tab-pane .media-section {
  margin-bottom: 2rem;
}
.tab-pane .media-section h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}
.tab-pane .empty-message {
  text-align: center;
  color: #666;
  padding: 2rem;
  font-style: italic;
}
.tab-pane .loading-message {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.profile-info-list {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem 1rem;
  margin: 0;
}
.profile-info-list dt {
  color: #666;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}
.profile-info-list dd {
  margin: 0;
  color: #000;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.navbar-menu a,
.navbar a,
.explorer a,
.explorer-content ul li > a,
.folder-container div > a,
.folder-container div > button span {
  color: #1a1a1a !important;
}
.navbar-menu a:hover,
.navbar a:hover,
.explorer a:hover,
.explorer-content ul li > a:hover,
.folder-container div > a:hover,
.folder-container div > button span:hover {
  color: var(--tertiary) !important;
}

article, .tab-pane {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9375rem !important;
  line-height: 1.7;
  color: #2a2a2a;
  max-width: 658px !important;
  margin: 0 auto;
}
article p, .tab-pane p {
  direction: inherit;
  unicode-bidi: -webkit-plaintext;
  unicode-bidi: -moz-plaintext;
  unicode-bidi: plaintext;
  text-align: start;
}
article em, .tab-pane em {
  unicode-bidi: -webkit-plaintext;
  unicode-bidi: -moz-plaintext;
  unicode-bidi: plaintext;
}
article > strong, .tab-pane > strong {
  display: block;
  unicode-bidi: -webkit-plaintext;
  unicode-bidi: -moz-plaintext;
  unicode-bidi: plaintext;
  text-align: start;
}
article .chapter-link, .tab-pane .chapter-link {
  color: #0066cc;
  text-decoration: none;
  cursor: pointer;
}
article .chapter-link:hover, .tab-pane .chapter-link:hover {
  text-decoration: underline;
}

.chapter-tab-pane, .chapter-tabs-content {
  direction: ltr;
}
.chapter-tab-pane p, .chapter-tabs-content p {
  direction: ltr;
  text-align: left;
  unicode-bidi: embed;
}
.chapter-tab-pane em, .chapter-tab-pane strong, .chapter-tabs-content em, .chapter-tabs-content strong {
  unicode-bidi: embed;
}
.chapter-tab-pane .rtl-paragraph, .chapter-tab-pane [dir=rtl], .chapter-tabs-content .rtl-paragraph, .chapter-tabs-content [dir=rtl] {
  direction: rtl;
  text-align: right;
  unicode-bidi: embed;
}
.chapter-tab-pane .rtl-paragraph p, .chapter-tab-pane [dir=rtl] p, .chapter-tabs-content .rtl-paragraph p, .chapter-tabs-content [dir=rtl] p {
  direction: rtl;
  text-align: right;
}
.chapter-tab-pane > strong, .chapter-tab-pane > em, .chapter-tabs-content > strong, .chapter-tabs-content > em {
  display: block;
  unicode-bidi: plaintext;
  text-align: start;
}
.chapter-tab-pane a:not(.chapter-link), .chapter-tabs-content a:not(.chapter-link) {
  color: #0066cc !important;
  text-decoration: none;
}
.chapter-tab-pane a:not(.chapter-link):hover, .chapter-tabs-content a:not(.chapter-link):hover {
  text-decoration: underline;
}
.chapter-tab-pane a:not(.chapter-link):visited, .chapter-tabs-content a:not(.chapter-link):visited {
  color: #551a8b !important;
}
.chapter-tab-pane a.chapter-link, .chapter-tabs-content a.chapter-link {
  color: #0066cc !important;
  text-decoration: none;
  cursor: pointer;
}
.chapter-tab-pane a.chapter-link:hover, .chapter-tabs-content a.chapter-link:hover {
  text-decoration: underline;
}
.chapter-tab-pane a.chapter-link:visited, .chapter-tabs-content a.chapter-link:visited {
  color: #551a8b !important;
}
.chapter-tab-pane h1, .chapter-tab-pane h2, .chapter-tab-pane h3, .chapter-tab-pane h4, .chapter-tabs-content h1, .chapter-tabs-content h2, .chapter-tabs-content h3, .chapter-tabs-content h4 {
  color: var(--secondary);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}
.chapter-tab-pane h1, .chapter-tabs-content h1 {
  font-size: 1.75rem;
  border-bottom: 2px solid var(--lightgray);
  padding-bottom: 0.5rem;
}
.chapter-tab-pane h2, .chapter-tabs-content h2 {
  font-size: 1.5rem;
}
.chapter-tab-pane h3, .chapter-tabs-content h3 {
  font-size: 1.25rem;
  color: #2c5aa0;
}
.chapter-tab-pane h4, .chapter-tabs-content h4 {
  font-size: 1.1rem;
  color: #2c5aa0;
}

.chapter-tabs-container {
  margin: 2rem 0;
}

.biography-banner,
.biography-banner-top {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 1px solid #d0d7de;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  margin: 1rem 0 1.5rem 0;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  color: #24292f;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.biography-banner:hover,
.biography-banner-top:hover {
  background: linear-gradient(135deg, #e8ebf0 0%, #b3bfd1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.biography-banner:active,
.biography-banner-top:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.biography-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--secondary);
}

.chapter-tabs-header {
  display: flex;
  gap: 0.75rem;
  border-bottom: 3px solid var(--lightgray);
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.chapter-tab-button {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  transition: all 0.3s ease;
}
.chapter-tab-button:hover {
  color: #000;
  background: #e8e8e8;
  border-color: #ccc;
}
.chapter-tab-button.active {
  color: white;
  background: var(--secondary);
  border-color: var(--secondary);
  font-weight: 600;
}

.chapter-tabs-content .chapter-tab-pane {
  display: none;
  animation: fadeIn 0.3s ease;
}
.chapter-tabs-content .chapter-tab-pane.active {
  display: block;
}

article img:not(.gallery-item img), .tab-pane img:not(.gallery-item img) {
  margin: 2rem auto;
  display: block;
  max-width: 100%;
  border: 2px solid #333;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px;
  background: white;
}
article strong > em:only-child, .tab-pane strong > em:only-child {
  display: block;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-top: -1rem;
  margin-bottom: 2rem;
  font-style: italic;
  font-weight: normal;
}
article blockquote, .tab-pane blockquote {
  background: #f9f9f9;
  border-left: 4px solid #0066cc;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #333;
  border-radius: 4px;
}
article blockquote p, .tab-pane blockquote p {
  margin: 0.5rem 0;
}
article hr, .tab-pane hr {
  border: none;
  border-top: 2px solid #e0e0e0;
  margin: 3rem 0;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
}
article .citation-box, .tab-pane .citation-box {
  background: #fdf6e3;
  border: 2px dashed #d4b896;
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 6px;
  font-family: Georgia, serif;
}
article .citation-box::before, .tab-pane .citation-box::before {
  content: "\u{1F4F0} ";
  font-size: 1.2rem;
  margin-right: 0.5rem;
}
article .info-box, .tab-pane .info-box {
  background: #e3f2fd;
  border-left: 4px solid #1976d2;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  font-size: 0.95rem;
}
article .info-box::before, .tab-pane .info-box::before {
  content: "\u2139\uFE0F ";
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  article, .tab-pane {
    max-width: 100% !important;
    padding: 1rem !important;
    margin: 0 !important;
  }
  .chapter-tab-pane {
    max-width: 100% !important;
    padding: 1rem !important;
  }
  article img:not(.gallery-item img),
  .tab-pane img:not(.gallery-item img) {
    padding: 4px;
    margin: 1rem auto;
  }
  .citation-box, .info-box {
    padding: 0.75rem !important;
    margin: 1rem 0 !important;
    font-size: 0.85rem;
  }
  .index-quote-hebrew {
    font-size: 0.9rem !important;
  }
  .index-quote-english {
    font-size: 0.825rem !important;
  }
}
@media (max-width: 480px) {
  article, .tab-pane, .chapter-tab-pane {
    padding: 0.75rem !important;
  }
  .citation-box, .info-box {
    padding: 0.5rem !important;
    margin: 0.75rem 0 !important;
    font-size: 0.8rem;
  }
  .index-quote-hebrew {
    font-size: 0.9rem !important;
  }
  .index-quote-english {
    font-size: 0.825rem !important;
  }
}
article pre, .tab-pane pre, .chapter-tab-pane pre {
  font-family: "Cascadia Code", "Cascadia Mono", "Consolas", "Courier New", monospace !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  background-color: #f5f5f5 !important;
  border: 1px solid #e0e0e0 !important;
  padding: 1rem 1.5rem !important;
  margin: 1.5rem 0 !important;
  border-radius: 6px !important;
  overflow-x: auto !important;
  white-space: pre !important;
}
article pre > code, .tab-pane pre > code, .chapter-tab-pane pre > code {
  font-size: 14px !important;
  line-height: 1.5 !important;
  white-space: pre !important;
  display: block !important;
}
article pre > code > [data-line]::before, .tab-pane pre > code > [data-line]::before, .chapter-tab-pane pre > code > [data-line]::before {
  display: none !important;
}
article pre > code a, .tab-pane pre > code a, .chapter-tab-pane pre > code a {
  display: inline !important;
  white-space: pre !important;
  margin: 0 !important;
  padding: 0 !important;
  text-decoration: underline !important;
  color: #0066cc !important;
  word-break: keep-all !important;
  line-break: auto !important;
  overflow-wrap: normal !important;
  word-wrap: normal !important;
  vertical-align: baseline !important;
  float: none !important;
  clear: none !important;
}
article pre > code a::before, article pre > code a::after, .tab-pane pre > code a::before, .tab-pane pre > code a::after, .chapter-tab-pane pre > code a::before, .chapter-tab-pane pre > code a::after {
  content: none !important;
  display: none !important;
}
article pre > code a + *, .tab-pane pre > code a + *, .chapter-tab-pane pre > code a + * {
  margin-left: 0 !important;
}
article pre > code a:hover, .tab-pane pre > code a:hover, .chapter-tab-pane pre > code a:hover {
  color: #0052a3 !important;
}

article pre code a,
.tab-pane pre code a,
.chapter-tab-pane pre code a {
  display: inline !important;
  white-space: pre !important;
}

:root[saved-theme=dark] article pre, :root[saved-theme=dark] .tab-pane pre, :root[saved-theme=dark] .chapter-tab-pane pre {
  background-color: #f5f5f5 !important;
  border-color: #e0e0e0 !important;
  color: inherit !important;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxzdHlsZXMiLCJzb3VyY2VzIjpbInZhcmlhYmxlcy5zY3NzIiwic3ludGF4LnNjc3MiLCJjYWxsb3V0cy5zY3NzIiwiYmFzZS5zY3NzIiwiZmFtaWx5LXByb2ZpbGVzLnNjc3MiLCJjdXN0b20uc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUNGQTtFQUNFO0VBQ0E7OztBQUdGO0VBQ0U7OztBQUdGO0VBQ0U7RUFDQTs7O0FBR0Y7RUFDRTs7O0FDWkY7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFZQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQXZCQTtFQUNFO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQW1CSjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFFRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFHRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7QUFJQTtFQUNFOztBQUdGO0VBQ0UsWUFDRTtFQUVGO0VBQ0E7RUFDQTs7O0FBS047RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBRUE7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7O0FBR0Y7RUFFRTtFQUNBO0VBQ0E7RUFHQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0UsYUZ6SmE7OztBR2hCakI7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBRUY7RUFDRTtFQUNBOzs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQWFFO0VBQ0E7RUFDQTtFQUNBOzs7QUFJQTtFQUNFOzs7QUFLRjtBQUFBO0VBRUU7O0FBQ0E7QUFBQTtFQUNFO0VBQ0E7O0FBR0o7RUFDRTtFQUNBOzs7QUFJSjtFQUNFLGFIbERlOzs7QUdxRGpCO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7O0FBQ0E7RUFDRTs7QUFJSjtFQUNFO0VBQ0E7RUFDQTs7QUFHQTtFQUNFOztBQUtOO0VBQ0U7RUFDQTs7QUFFQTtFQUNFOzs7QUFLTjtFQUNFOzs7QUFHRjtFQUNFOztBQUNBO0VBQ0U7O0FBRUY7RUFMRjtJQVNJOztFQUhBO0lBQ0U7Ozs7QUFNTjtFQUNFOztBQUNBO0VBQ0U7O0FBRUY7RUFMRjtJQVNJOztFQUhBO0lBQ0U7Ozs7QUFNTjtFQUNFO0VBQ0E7O0FBRUU7RUFDRTs7QUFHRjtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFSRjtJQVNJO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7OztBQUVGO0VBZkY7SUFnQkk7SUFDQTtJQUNBO0lBQ0E7SUFDQTs7O0FBR0Y7RUF2QkY7SUF3Qkk7OztBQUVGO0VBMUJGO0lBMkJJOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUNBO0VBSkY7SUFLSTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTs7QUFDQTtFQUpGO0lBS0k7SUFDQTs7O0FBRUY7RUFSRjtJQVNJO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7O0VBQ0E7SUFDRTtJQUNBOztFQUVGO0lBQ0U7OztBQUlOO0VBRUU7O0FBR0Y7RUFDRTtFQUNBOztBQUNBO0VBSEY7SUFJSTtJQUNBOzs7QUFJSjtFQUNFOztBQUdGO0VBQ0U7O0FBR0Y7RUFFRTtFQUNBO0VBQ0E7RUFDQTs7QUFDQTtFQU5GO0lBT0k7OztBQUVGO0VBVEY7SUFVSTtJQUNBOzs7QUFHSjtFQUNFOzs7QUFLTjtFQUNFO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBS047RUFDRTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFPRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQUNFO0VBQ0E7OztBQVVGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFDRTs7QUFHRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7RUFDRTs7O0FBS0o7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTs7O0FBR0Y7QUFBQTtBQUFBO0VBR0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBSUo7RUFDRTs7QUFHRjtFQUNFOzs7QUFLTjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7QUFBQTtBQUFBO0VBR0U7OztBQUdGO0VBQ0U7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7QUFBQTtFQUVFOztBQUdGO0VBQ0U7OztBQUtOO0VBQ0U7RUFDQTtFQUNBOzs7QUFHRjtFQUNFOzs7QUFHRjtFQUNFOztBQUNBO0VBQ0U7OztBQUlKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0VBQ0U7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtBQUFBO0VBRUU7RUFDQTs7O0FBR0Y7RUFDRTs7O0FBR0Y7RUFDRTtFQUNBOzs7QUFHRjtBQUFBO0VBRUU7RUFDQTtFQUNBO0VBQ0E7RUFHQTtFQUNBOztBQUVBO0FBQUE7RUFDRTtFQUNBOztBQUdGO0FBQUE7RUFDRTs7O0FBS0Y7RUFDRTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7OztBQUdGO0FBQUE7RUFFRTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUN2bkJGO0FBRUE7QUFFRTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTs7O0FBS047QUFDQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7OztBQUdGO0FBQ0E7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7O0FBSUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7O0FBS0o7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFLSjtFQUNFOztBQUlGO0VBQ0U7RUFDQTs7O0FBSUo7QUFDQTtFQUNFO0lBQ0U7OztBQ3pGSjtFQUNFOzs7QUFJRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFHQTtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7QUFLSjtFQUNFO0VBQ0E7O0FBSUY7RUFDRTs7QUFJRjtFQUNFO0VBQ0E7RUFDQTs7O0FBS0o7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0E7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBS0o7RUFDRTtFQUNBOztBQUlGO0VBQ0U7O0FBSUY7RUFDRTtFQUNBO0VBQ0E7O0FBTUY7RUFDRTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFLSjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOzs7QUFLSjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7O0FBS0o7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBTUU7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0VBQ0U7OztBQUtKO0VBRUU7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUlBO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFJRjtFQUNFO0VBQ0E7RUFDQTs7QUFJRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBSUY7RUFDRTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTs7O0FBTU47RUFFRTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFOztBQUlGO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7RUFDQTs7QUFLSjtFQUNFO0VBQ0E7RUFDQTs7QUFJRjtFQUNFO0VBQ0E7O0FBRUE7RUFDRTs7QUFHRjtFQUNFOztBQUtKO0VBQ0U7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBR0Y7RUFDRTs7QUFLSjtFQUNFO0VBQ0E7RUFDQTtFQUNBOztBQUdGO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0VBQ0U7O0FBR0Y7RUFDRTtFQUNBOztBQUdGO0VBQ0U7RUFDQTs7O0FBS0o7RUFDRTs7O0FBSUY7QUFBQTtFQUVFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtBQUFBO0VBQ0U7RUFDQTtFQUNBOztBQUdGO0FBQUE7RUFDRTtFQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7O0FBR0Y7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBOzs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFO0VBQ0E7RUFDQTs7QUFHRjtFQUNFO0VBQ0E7RUFDQTtFQUNBOzs7QUFLRjtFQUNFO0VBQ0E7O0FBRUE7RUFDRTs7O0FBVUo7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUtGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFJRjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUVBO0VBQ0U7O0FBS0o7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBSUY7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBO0VBQ0E7O0FBS0o7RUFDRTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBRUE7RUFDRTtFQUNBOzs7QUFNTjtFQUNFO0lBQ0U7SUFDQTtJQUNBOztFQUdGO0lBQ0U7SUFDQTs7RUFLRjtBQUFBO0lBRUU7SUFDQTs7RUFJRjtJQUNFO0lBQ0E7SUFDQTs7RUFJRjtJQUNFOztFQUdGO0lBQ0U7OztBQUtKO0VBQ0U7SUFDRTs7RUFJRjtJQUNFO0lBQ0E7SUFDQTs7RUFJRjtJQUNFOztFQUdGO0lBQ0U7OztBQUtKO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0E7RUFDRTtFQUNBO0VBQ0E7RUFDQTs7QUFFQTtFQUNFOztBQUtGO0VBQ0U7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBR0E7RUFFRTtFQUNBOztBQUlGO0VBQ0U7O0FBR0Y7RUFDRTs7O0FBUVI7QUFBQTtBQUFBO0VBR0U7RUFDQTs7O0FBS0E7RUFDRTtFQUNBO0VBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwic2FzczptYXBcIjtcblxuLyoqXG4gKiBMYXlvdXQgYnJlYWtwb2ludHNcbiAqICRtb2JpbGU6IHNjcmVlbiB3aWR0aCBiZWxvdyB0aGlzIHZhbHVlIHdpbGwgdXNlIG1vYmlsZSBzdHlsZXNcbiAqICRkZXNrdG9wOiBzY3JlZW4gd2lkdGggYWJvdmUgdGhpcyB2YWx1ZSB3aWxsIHVzZSBkZXNrdG9wIHN0eWxlc1xuICogU2NyZWVuIHdpZHRoIGJldHdlZW4gJG1vYmlsZSBhbmQgJGRlc2t0b3Agd2lkdGggd2lsbCB1c2UgdGhlIHRhYmxldCBsYXlvdXQuXG4gKiBhc3N1bWluZyBtb2JpbGUgPCBkZXNrdG9wXG4gKi9cbiRicmVha3BvaW50czogKFxuICBtb2JpbGU6IDgwMHB4LFxuICBkZXNrdG9wOiAxMjAwcHgsXG4pO1xuXG4kbW9iaWxlOiBcIihtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KVwiO1xuJHRhYmxldDogXCIobWluLXdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfSkgYW5kIChtYXgtd2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcbiRkZXNrdG9wOiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSlcIjtcblxuJHBhZ2VXaWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX07XG4kc2lkZVBhbmVsV2lkdGg6IDMyMHB4OyAvLzM4MHB4O1xuJHRvcFNwYWNpbmc6IDZyZW07XG4kYm9sZFdlaWdodDogNzAwO1xuJHNlbWlCb2xkV2VpZ2h0OiA2MDA7XG4kbm9ybWFsV2VpZ2h0OiA0MDA7XG5cbiRtb2JpbGVHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcImF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnRcIlxcXG4gICAgICBcImdyaWQtaGVhZGVyXCJcXFxuICAgICAgXCJncmlkLWNlbnRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLWZvb3RlclwiJyxcbik7XG4kdGFibGV0R3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG9cIixcbiAgcm93R2FwOiBcIjVweFwiLFxuICBjb2x1bW5HYXA6IFwiNXB4XCIsXG4gIHRlbXBsYXRlQXJlYXM6XG4gICAgJ1wiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtZm9vdGVyXCInLFxuKTtcbiRkZXNrdG9wR3JpZDogKFxuICB0ZW1wbGF0ZVJvd3M6IFwiYXV0byBhdXRvIGF1dG9cIixcbiAgdGVtcGxhdGVDb2x1bW5zOiBcIiN7JHNpZGVQYW5lbFdpZHRofSBhdXRvICN7JHNpZGVQYW5lbFdpZHRofVwiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlciBncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtY2VudGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCInLFxuKTtcbiIsImNvZGVbZGF0YS10aGVtZSo9XCIgXCJdIHtcbiAgY29sb3I6IHZhcigtLXNoaWtpLWxpZ2h0KTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpa2ktbGlnaHQtYmcpO1xufVxuXG5jb2RlW2RhdGEtdGhlbWUqPVwiIFwiXSBzcGFuIHtcbiAgY29sb3I6IHZhcigtLXNoaWtpLWxpZ2h0KTtcbn1cblxuW3NhdmVkLXRoZW1lPVwiZGFya1wiXSBjb2RlW2RhdGEtdGhlbWUqPVwiIFwiXSB7XG4gIGNvbG9yOiB2YXIoLS1zaGlraS1kYXJrKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hpa2ktZGFyay1iZyk7XG59XG5cbltzYXZlZC10aGVtZT1cImRhcmtcIl0gY29kZVtkYXRhLXRoZW1lKj1cIiBcIl0gc3BhbiB7XG4gIGNvbG9yOiB2YXIoLS1zaGlraS1kYXJrKTtcbn1cbiIsIkB1c2UgXCIuL3ZhcmlhYmxlcy5zY3NzXCIgYXMgKjtcbkB1c2UgXCJzYXNzOmNvbG9yXCI7XG5cbi5jYWxsb3V0IHtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmcpO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIHBhZGRpbmc6IDAgMXJlbTtcbiAgb3ZlcmZsb3cteTogaGlkZGVuO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXG4gICYgPiAuY2FsbG91dC1jb250ZW50IHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIHRyYW5zaXRpb246IGdyaWQtdGVtcGxhdGUtcm93cyAwLjFzIGN1YmljLWJlemllcigwLjAyLCAwLjAxLCAwLjQ3LCAxKTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgJiA+IDpmaXJzdC1jaGlsZCB7XG4gICAgICBtYXJnaW4tdG9wOiAwO1xuICAgIH1cbiAgfVxuXG4gIC0tY2FsbG91dC1pY29uLW5vdGU6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LCA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxsaW5lIHgxPVwiMThcIiB5MT1cIjJcIiB4Mj1cIjIyXCIgeTI9XCI2XCI+PC9saW5lPjxwYXRoIGQ9XCJNNy41IDIwLjUgMTkgOWwtNC00TDMuNSAxNi41IDIgMjJ6XCI+PC9wYXRoPjwvc3ZnPicpO1xuICAtLWNhbGxvdXQtaWNvbi1hYnN0cmFjdDogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHJlY3QgeD1cIjhcIiB5PVwiMlwiIHdpZHRoPVwiOFwiIGhlaWdodD1cIjRcIiByeD1cIjFcIiByeT1cIjFcIj48L3JlY3Q+PHBhdGggZD1cIk0xNiA0aDJhMiAyIDAgMCAxIDIgMnYxNGEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMlY2YTIgMiAwIDAgMSAyLTJoMlwiPjwvcGF0aD48cGF0aCBkPVwiTTEyIDExaDRcIj48L3BhdGg+PHBhdGggZD1cIk0xMiAxNmg0XCI+PC9wYXRoPjxwYXRoIGQ9XCJNOCAxMWguMDFcIj48L3BhdGg+PHBhdGggZD1cIk04IDE2aC4wMVwiPjwvcGF0aD48L3N2Zz4nKTtcbiAgLS1jYWxsb3V0LWljb24taW5mbzogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiPjwvY2lyY2xlPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjE2XCIgeDI9XCIxMlwiIHkyPVwiMTJcIj48L2xpbmU+PGxpbmUgeDE9XCIxMlwiIHkxPVwiOFwiIHgyPVwiMTIuMDFcIiB5Mj1cIjhcIj48L2xpbmU+PC9zdmc+Jyk7XG4gIC0tY2FsbG91dC1pY29uLXRvZG86IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LCA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMTIgMjJjNS41MjMgMCAxMC00LjQ3NyAxMC0xMFMxNy41MjMgMiAxMiAyIDIgNi40NzcgMiAxMnM0LjQ3NyAxMCAxMCAxMHpcIj48L3BhdGg+PHBhdGggZD1cIm05IDEyIDIgMiA0LTRcIj48L3BhdGg+PC9zdmc+Jyk7XG4gIC0tY2FsbG91dC1pY29uLXRpcDogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTguNSAxNC41QTIuNSAyLjUgMCAwIDAgMTEgMTJjMC0xLjM4LS41LTItMS0zLTEuMDcyLTIuMTQzLS4yMjQtNC4wNTQgMi02IC41IDIuNSAyIDQuOSA0IDYuNSAyIDEuNiAzIDMuNSAzIDUuNWE3IDcgMCAxIDEtMTQgMGMwLTEuMTUzLjQzMy0yLjI5NCAxLTNhMi41IDIuNSAwIDAgMCAyLjUgMi41elwiPjwvcGF0aD48L3N2Zz4gJyk7XG4gIC0tY2FsbG91dC1pY29uLXN1Y2Nlc3M6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHBvbHlsaW5lIHBvaW50cz1cIjIwIDYgOSAxNyA0IDEyXCI+PC9wb2x5bGluZT48L3N2Zz4gJyk7XG4gIC0tY2FsbG91dC1pY29uLXF1ZXN0aW9uOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCw8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIj48L2NpcmNsZT48cGF0aCBkPVwiTTkuMDkgOWEzIDMgMCAwIDEgNS44MyAxYzAgMi0zIDMtMyAzXCI+PC9wYXRoPjxsaW5lIHgxPVwiMTJcIiB5MT1cIjE3XCIgeDI9XCIxMi4wMVwiIHkyPVwiMTdcIj48L2xpbmU+PC9zdmc+ICcpO1xuICAtLWNhbGxvdXQtaWNvbi13YXJuaW5nOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCwgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwibTIxLjczIDE4LTgtMTRhMiAyIDAgMCAwLTMuNDggMGwtOCAxNEEyIDIgMCAwIDAgNCAyMWgxNmEyIDIgMCAwIDAgMS43My0zWlwiPjwvcGF0aD48bGluZSB4MT1cIjEyXCIgeTE9XCI5XCIgeDI9XCIxMlwiIHkyPVwiMTNcIj48L2xpbmU+PGxpbmUgeDE9XCIxMlwiIHkxPVwiMTdcIiB4Mj1cIjEyLjAxXCIgeTI9XCIxN1wiPjwvbGluZT48L3N2Zz4nKTtcbiAgLS1jYWxsb3V0LWljb24tZmFpbHVyZTogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48bGluZSB4MT1cIjE4XCIgeTE9XCI2XCIgeDI9XCI2XCIgeTI9XCIxOFwiPjwvbGluZT48bGluZSB4MT1cIjZcIiB5MT1cIjZcIiB4Mj1cIjE4XCIgeTI9XCIxOFwiPjwvbGluZT48L3N2Zz4gJyk7XG4gIC0tY2FsbG91dC1pY29uLWRhbmdlcjogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cG9seWdvbiBwb2ludHM9XCIxMyAyIDMgMTQgMTIgMTQgMTEgMjIgMjEgMTAgMTIgMTAgMTMgMlwiPjwvcG9seWdvbj48L3N2Zz4gJyk7XG4gIC0tY2FsbG91dC1pY29uLWJ1ZzogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWw7IHV0ZjgsIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PHJlY3Qgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB4PVwiOFwiIHk9XCI2XCIgcng9XCI0XCI+PC9yZWN0PjxwYXRoIGQ9XCJtMTkgNy0zIDJcIj48L3BhdGg+PHBhdGggZD1cIm01IDcgMyAyXCI+PC9wYXRoPjxwYXRoIGQ9XCJtMTkgMTktMy0yXCI+PC9wYXRoPjxwYXRoIGQ9XCJtNSAxOSAzLTJcIj48L3BhdGg+PHBhdGggZD1cIk0yMCAxM2gtNFwiPjwvcGF0aD48cGF0aCBkPVwiTTQgMTNoNFwiPjwvcGF0aD48cGF0aCBkPVwibTEwIDQgMSAyXCI+PC9wYXRoPjxwYXRoIGQ9XCJtMTQgNC0xIDJcIj48L3BhdGg+PC9zdmc+Jyk7XG4gIC0tY2FsbG91dC1pY29uLWV4YW1wbGU6IHVybCgnZGF0YTppbWFnZS9zdmcreG1sOyB1dGY4LDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PGxpbmUgeDE9XCI4XCIgeTE9XCI2XCIgeDI9XCIyMVwiIHkyPVwiNlwiPjwvbGluZT48bGluZSB4MT1cIjhcIiB5MT1cIjEyXCIgeDI9XCIyMVwiIHkyPVwiMTJcIj48L2xpbmU+PGxpbmUgeDE9XCI4XCIgeTE9XCIxOFwiIHgyPVwiMjFcIiB5Mj1cIjE4XCI+PC9saW5lPjxsaW5lIHgxPVwiM1wiIHkxPVwiNlwiIHgyPVwiMy4wMVwiIHkyPVwiNlwiPjwvbGluZT48bGluZSB4MT1cIjNcIiB5MT1cIjEyXCIgeDI9XCIzLjAxXCIgeTI9XCIxMlwiPjwvbGluZT48bGluZSB4MT1cIjNcIiB5MT1cIjE4XCIgeDI9XCIzLjAxXCIgeTI9XCIxOFwiPjwvbGluZT48L3N2Zz4gJyk7XG4gIC0tY2FsbG91dC1pY29uLXF1b3RlOiB1cmwoJ2RhdGE6aW1hZ2Uvc3ZnK3htbDsgdXRmOCwgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48cGF0aCBkPVwiTTMgMjFjMyAwIDctMSA3LThWNWMwLTEuMjUtLjc1Ni0yLjAxNy0yLTJINGMtMS4yNSAwLTIgLjc1LTIgMS45NzJWMTFjMCAxLjI1Ljc1IDIgMiAyIDEgMCAxIDAgMSAxdjFjMCAxLTEgMi0yIDJzLTEgLjAwOC0xIDEuMDMxVjIwYzAgMSAwIDEgMSAxelwiPjwvcGF0aD48cGF0aCBkPVwiTTE1IDIxYzMgMCA3LTEgNy04VjVjMC0xLjI1LS43NTctMi4wMTctMi0yaC00Yy0xLjI1IDAtMiAuNzUtMiAxLjk3MlYxMWMwIDEuMjUuNzUgMiAyIDJoLjc1YzAgMi4yNS4yNSA0LTIuNzUgNHYzYzAgMSAwIDEgMSAxelwiPjwvcGF0aD48L3N2Zz4nKTtcbiAgLS1jYWxsb3V0LWljb24tZm9sZDogdXJsKCdkYXRhOmltYWdlL3N2Zyt4bWwsJTNDc3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjI0XCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCIlM0UlM0Nwb2x5bGluZSBwb2ludHM9XCI2IDkgMTIgMTUgMTggOVwiJTNFJTNDL3BvbHlsaW5lJTNFJTNDL3N2ZyUzRScpO1xuXG4gICZbZGF0YS1jYWxsb3V0XSB7XG4gICAgLS1jb2xvcjogIzQ0OGFmZjtcbiAgICAtLWJvcmRlcjogIzQ0OGFmZjQ0O1xuICAgIC0tYmc6ICM0NDhhZmYxMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLW5vdGUpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJhYnN0cmFjdFwiXSB7XG4gICAgLS1jb2xvcjogIzAwYjBmZjtcbiAgICAtLWJvcmRlcjogIzAwYjBmZjQ0O1xuICAgIC0tYmc6ICMwMGIwZmYxMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLWFic3RyYWN0KTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwiaW5mb1wiXSxcbiAgJltkYXRhLWNhbGxvdXQ9XCJ0b2RvXCJdIHtcbiAgICAtLWNvbG9yOiAjMDBiOGQ0O1xuICAgIC0tYm9yZGVyOiAjMDBiOGQ0NDQ7XG4gICAgLS1iZzogIzAwYjhkNDEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24taW5mbyk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cInRvZG9cIl0ge1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tdG9kbyk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cInRpcFwiXSB7XG4gICAgLS1jb2xvcjogIzAwYmZhNTtcbiAgICAtLWJvcmRlcjogIzAwYmZhNTQ0O1xuICAgIC0tYmc6ICMwMGJmYTUxMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLXRpcCk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cInN1Y2Nlc3NcIl0ge1xuICAgIC0tY29sb3I6ICMwOWFkN2E7XG4gICAgLS1ib3JkZXI6ICMwOWFkNzE0NDtcbiAgICAtLWJnOiAjMDlhZDcxMTA7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi1zdWNjZXNzKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwicXVlc3Rpb25cIl0ge1xuICAgIC0tY29sb3I6ICNkYmE2NDI7XG4gICAgLS1ib3JkZXI6ICNkYmE2NDI0NDtcbiAgICAtLWJnOiAjZGJhNjQyMTA7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi1xdWVzdGlvbik7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cIndhcm5pbmdcIl0ge1xuICAgIC0tY29sb3I6ICNkYjg5NDI7XG4gICAgLS1ib3JkZXI6ICNkYjg5NDI0NDtcbiAgICAtLWJnOiAjZGI4OTQyMTA7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi13YXJuaW5nKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwiZmFpbHVyZVwiXSxcbiAgJltkYXRhLWNhbGxvdXQ9XCJkYW5nZXJcIl0sXG4gICZbZGF0YS1jYWxsb3V0PVwiYnVnXCJdIHtcbiAgICAtLWNvbG9yOiAjZGI0MjQyO1xuICAgIC0tYm9yZGVyOiAjZGI0MjQyNDQ7XG4gICAgLS1iZzogI2RiNDI0MjEwO1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tZmFpbHVyZSk7XG4gIH1cblxuICAmW2RhdGEtY2FsbG91dD1cImJ1Z1wiXSB7XG4gICAgLS1jYWxsb3V0LWljb246IHZhcigtLWNhbGxvdXQtaWNvbi1idWcpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJkYW5nZXJcIl0ge1xuICAgIC0tY2FsbG91dC1pY29uOiB2YXIoLS1jYWxsb3V0LWljb24tZGFuZ2VyKTtcbiAgfVxuXG4gICZbZGF0YS1jYWxsb3V0PVwiZXhhbXBsZVwiXSB7XG4gICAgLS1jb2xvcjogIzdhNDNiNTtcbiAgICAtLWJvcmRlcjogIzdhNDNiNTQ0O1xuICAgIC0tYmc6ICM3YTQzYjUxMDtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLWV4YW1wbGUpO1xuICB9XG5cbiAgJltkYXRhLWNhbGxvdXQ9XCJxdW90ZVwiXSB7XG4gICAgLS1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICAtLWJvcmRlcjogdmFyKC0tbGlnaHRncmF5KTtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLXF1b3RlKTtcbiAgfVxuXG4gICYuaXMtY29sbGFwc2VkIHtcbiAgICAmID4gLmNhbGxvdXQtdGl0bGUgPiAuZm9sZC1jYWxsb3V0LWljb24ge1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGVaKC05MGRlZyk7XG4gICAgfVxuXG4gICAgLmNhbGxvdXQtY29udGVudCA+IDpmaXJzdC1jaGlsZCB7XG4gICAgICB0cmFuc2l0aW9uOlxuICAgICAgICBoZWlnaHQgMC4xcyBjdWJpYy1iZXppZXIoMC4wMiwgMC4wMSwgMC40NywgMSksXG4gICAgICAgIG1hcmdpbiAwLjFzIGN1YmljLWJlemllcigwLjAyLCAwLjAxLCAwLjQ3LCAxKTtcbiAgICAgIG92ZXJmbG93LXk6IGNsaXA7XG4gICAgICBoZWlnaHQ6IDA7XG4gICAgICBtYXJnaW4tdG9wOiAtMXJlbTtcbiAgICB9XG4gIH1cbn1cblxuLmNhbGxvdXQtdGl0bGUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZ2FwOiA1cHg7XG4gIHBhZGRpbmc6IDFyZW0gMDtcbiAgY29sb3I6IHZhcigtLWNvbG9yKTtcblxuICAtLWljb24tc2l6ZTogMThweDtcblxuICAmIC5mb2xkLWNhbGxvdXQtaWNvbiB7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMTVzIGVhc2U7XG4gICAgb3BhY2l0eTogMC44O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAtLWNhbGxvdXQtaWNvbjogdmFyKC0tY2FsbG91dC1pY29uLWZvbGQpO1xuICB9XG5cbiAgJiA+IC5jYWxsb3V0LXRpdGxlLWlubmVyID4gcCB7XG4gICAgY29sb3I6IHZhcigtLWNvbG9yKTtcbiAgICBtYXJnaW46IDA7XG4gIH1cblxuICAuY2FsbG91dC1pY29uLFxuICAmIC5mb2xkLWNhbGxvdXQtaWNvbiB7XG4gICAgd2lkdGg6IHZhcigtLWljb24tc2l6ZSk7XG4gICAgaGVpZ2h0OiB2YXIoLS1pY29uLXNpemUpO1xuICAgIGZsZXg6IDAgMCB2YXIoLS1pY29uLXNpemUpO1xuXG4gICAgLy8gaWNvbiBzdXBwb3J0XG4gICAgYmFja2dyb3VuZC1zaXplOiB2YXIoLS1pY29uLXNpemUpIHZhcigtLWljb24tc2l6ZSk7XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbG9yKTtcbiAgICBtYXNrLWltYWdlOiB2YXIoLS1jYWxsb3V0LWljb24pO1xuICAgIG1hc2stc2l6ZTogdmFyKC0taWNvbi1zaXplKSB2YXIoLS1pY29uLXNpemUpO1xuICAgIG1hc2stcG9zaXRpb246IGNlbnRlcjtcbiAgICBtYXNrLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgIHBhZGRpbmc6IDAuMnJlbSAwO1xuICB9XG5cbiAgLmNhbGxvdXQtdGl0bGUtaW5uZXIge1xuICAgIGZvbnQtd2VpZ2h0OiAkc2VtaUJvbGRXZWlnaHQ7XG4gIH1cbn1cbiIsIkB1c2UgXCJzYXNzOm1hcFwiO1xuXG5AdXNlIFwiLi92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XG5AdXNlIFwiLi9zeW50YXguc2Nzc1wiO1xuQHVzZSBcIi4vY2FsbG91dHMuc2Nzc1wiO1xuXG5odG1sIHtcbiAgc2Nyb2xsLWJlaGF2aW9yOiBzbW9vdGg7XG4gIHRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgd2lkdGg6IDEwMHZ3O1xufVxuXG5ib2R5IHtcbiAgbWFyZ2luOiAwO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gIGZvbnQtZmFtaWx5OiB2YXIoLS1ib2R5Rm9udCk7XG4gIGNvbG9yOiB2YXIoLS1kYXJrZ3JheSk7XG59XG5cbi50ZXh0LWhpZ2hsaWdodCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRleHRIaWdobGlnaHQpO1xuICBwYWRkaW5nOiAwIDAuMXJlbTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xufVxuOjpzZWxlY3Rpb24ge1xuICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tdGVydGlhcnkpIDYwJSwgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKSk7XG4gIGNvbG9yOiB2YXIoLS1kYXJrZ3JheSk7XG59XG5cbnAsXG51bCxcbnRleHQsXG5hLFxudHIsXG50ZCxcbmxpLFxub2wsXG51bCxcbi5rYXRleCxcbi5tYXRoLFxuLnR5cHN0LWRvYyxcbi50eXBzdC1kb2MgKiB7XG4gIGNvbG9yOiB2YXIoLS1kYXJrZ3JheSk7XG4gIGZpbGw6IHZhcigtLWRhcmtncmF5KTtcbiAgb3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcbiAgdGV4dC13cmFwOiBwcmV0dHk7XG59XG5cbi5tYXRoIHtcbiAgJi5tYXRoLWRpc3BsYXkge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgfVxufVxuXG5hcnRpY2xlIHtcbiAgPiBtangtY29udGFpbmVyLk1hdGhKYXgsXG4gIGJsb2NrcXVvdGUgPiBkaXYgPiBtangtY29udGFpbmVyLk1hdGhKYXgge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgPiBzdmcge1xuICAgICAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgfVxuICB9XG4gIGJsb2NrcXVvdGUgPiBkaXYgPiBtangtY29udGFpbmVyLk1hdGhKYXggPiBzdmcge1xuICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgfVxufVxuXG5zdHJvbmcge1xuICBmb250LXdlaWdodDogJHNlbWlCb2xkV2VpZ2h0O1xufVxuXG5hIHtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2U7XG4gIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuXG4gICY6aG92ZXIge1xuICAgIGNvbG9yOiB2YXIoLS10ZXJ0aWFyeSk7XG4gIH1cblxuICAmLmludGVybmFsIHtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgcGFkZGluZzogMDtcbiAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjRyZW07XG5cbiAgICAmLmJyb2tlbiB7XG4gICAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICAgIG9wYWNpdHk6IDAuNTtcbiAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4ycyBlYXNlO1xuICAgICAgJjpob3ZlciB7XG4gICAgICAgIG9wYWNpdHk6IDAuODtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAmOmhhcyg+IGltZykge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgcGFkZGluZzogMDtcbiAgICB9XG4gICAgJi50YWctbGluayB7XG4gICAgICAmOjpiZWZvcmUge1xuICAgICAgICBjb250ZW50OiBcIiNcIjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAmLmV4dGVybmFsIC5leHRlcm5hbC1pY29uIHtcbiAgICBoZWlnaHQ6IDFleDtcbiAgICBtYXJnaW46IDAgMC4xNWVtO1xuXG4gICAgPiBwYXRoIHtcbiAgICAgIGZpbGw6IHZhcigtLWRhcmspO1xuICAgIH1cbiAgfVxufVxuXG4uZmxleC1jb21wb25lbnQge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uZGVza3RvcC1vbmx5IHtcbiAgZGlzcGxheTogaW5pdGlhbDtcbiAgJi5mbGV4LWNvbXBvbmVudCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgfVxuICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICYuZmxleC1jb21wb25lbnQge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuXG4ubW9iaWxlLW9ubHkge1xuICBkaXNwbGF5OiBub25lO1xuICAmLmZsZXgtY29tcG9uZW50IHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgJi5mbGV4LWNvbXBvbmVudCB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgIH1cbiAgICBkaXNwbGF5OiBpbml0aWFsO1xuICB9XG59XG5cbi5wYWdlIHtcbiAgbWF4LXdpZHRoOiBjYWxjKCN7bWFwLmdldCgkYnJlYWtwb2ludHMsIGRlc2t0b3ApfSArIDMwMHB4KTtcbiAgbWFyZ2luOiAwIGF1dG87XG4gICYgYXJ0aWNsZSB7XG4gICAgJiA+IGgxIHtcbiAgICAgIGZvbnQtc2l6ZTogMnJlbTtcbiAgICB9XG5cbiAgICAmIGxpOmhhcyg+IGlucHV0W3R5cGU9XCJjaGVja2JveFwiXSkge1xuICAgICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xuICAgICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgIH1cblxuICAgICYgbGk6aGFzKD4gaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQpIHtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogbGluZS10aHJvdWdoO1xuICAgICAgdGV4dC1kZWNvcmF0aW9uLWNvbG9yOiB2YXIoLS1ncmF5KTtcbiAgICAgIGNvbG9yOiB2YXIoLS1ncmF5KTtcbiAgICB9XG5cbiAgICAmIGxpID4gKiB7XG4gICAgICBtYXJnaW4tdG9wOiAwO1xuICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICB9XG5cbiAgICBwID4gc3Ryb25nIHtcbiAgICAgIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgICB9XG4gIH1cblxuICAmID4gI3F1YXJ0ei1ib2R5IHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogI3ttYXAuZ2V0KCRkZXNrdG9wR3JpZCwgdGVtcGxhdGVDb2x1bW5zKX07XG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAje21hcC5nZXQoJGRlc2t0b3BHcmlkLCB0ZW1wbGF0ZVJvd3MpfTtcbiAgICBjb2x1bW4tZ2FwOiAje21hcC5nZXQoJGRlc2t0b3BHcmlkLCBjb2x1bW5HYXApfTtcbiAgICByb3ctZ2FwOiAje21hcC5nZXQoJGRlc2t0b3BHcmlkLCByb3dHYXApfTtcbiAgICBncmlkLXRlbXBsYXRlLWFyZWFzOiAje21hcC5nZXQoJGRlc2t0b3BHcmlkLCB0ZW1wbGF0ZUFyZWFzKX07XG5cbiAgICBAbWVkaWEgYWxsIGFuZCAoJHRhYmxldCkge1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAje21hcC5nZXQoJHRhYmxldEdyaWQsIHRlbXBsYXRlQ29sdW1ucyl9O1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAje21hcC5nZXQoJHRhYmxldEdyaWQsIHRlbXBsYXRlUm93cyl9O1xuICAgICAgY29sdW1uLWdhcDogI3ttYXAuZ2V0KCR0YWJsZXRHcmlkLCBjb2x1bW5HYXApfTtcbiAgICAgIHJvdy1nYXA6ICN7bWFwLmdldCgkdGFibGV0R3JpZCwgcm93R2FwKX07XG4gICAgICBncmlkLXRlbXBsYXRlLWFyZWFzOiAje21hcC5nZXQoJHRhYmxldEdyaWQsIHRlbXBsYXRlQXJlYXMpfTtcbiAgICB9XG4gICAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogI3ttYXAuZ2V0KCRtb2JpbGVHcmlkLCB0ZW1wbGF0ZUNvbHVtbnMpfTtcbiAgICAgIGdyaWQtdGVtcGxhdGUtcm93czogI3ttYXAuZ2V0KCRtb2JpbGVHcmlkLCB0ZW1wbGF0ZVJvd3MpfTtcbiAgICAgIGNvbHVtbi1nYXA6ICN7bWFwLmdldCgkbW9iaWxlR3JpZCwgY29sdW1uR2FwKX07XG4gICAgICByb3ctZ2FwOiAje21hcC5nZXQoJG1vYmlsZUdyaWQsIHJvd0dhcCl9O1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1hcmVhczogI3ttYXAuZ2V0KCRtb2JpbGVHcmlkLCB0ZW1wbGF0ZUFyZWFzKX07XG4gICAgfVxuXG4gICAgQG1lZGlhIGFsbCBhbmQgbm90ICgkZGVza3RvcCkge1xuICAgICAgcGFkZGluZzogMCAxcmVtO1xuICAgIH1cbiAgICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgfVxuXG4gICAgJiAuc2lkZWJhciB7XG4gICAgICBnYXA6IDEuMnJlbTtcbiAgICAgIHRvcDogMDtcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICBwYWRkaW5nOiAkdG9wU3BhY2luZyAycmVtIDJyZW0gMnJlbTtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBoZWlnaHQ6IDEwMHZoO1xuICAgICAgcG9zaXRpb246IHN0aWNreTtcbiAgICB9XG5cbiAgICAmIC5zaWRlYmFyLmxlZnQge1xuICAgICAgei1pbmRleDogMTtcbiAgICAgIGdyaWQtYXJlYTogZ3JpZC1zaWRlYmFyLWxlZnQ7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgQG1lZGlhIGFsbCBhbmQgKCRtb2JpbGUpIHtcbiAgICAgICAgZ2FwOiAwO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBwb3NpdGlvbjogaW5pdGlhbDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgaGVpZ2h0OiB1bnNldDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgcGFkZGluZy10b3A6IDJyZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgJiAuc2lkZWJhci5yaWdodCB7XG4gICAgICBncmlkLWFyZWE6IGdyaWQtc2lkZWJhci1yaWdodDtcbiAgICAgIG1hcmdpbi1yaWdodDogMDtcbiAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICAgICBtYXJnaW4tbGVmdDogaW5oZXJpdDtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiBpbmhlcml0O1xuICAgICAgfVxuICAgICAgQG1lZGlhIGFsbCBhbmQgbm90ICgkZGVza3RvcCkge1xuICAgICAgICBwb3NpdGlvbjogaW5pdGlhbDtcbiAgICAgICAgaGVpZ2h0OiB1bnNldDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgICYgPiAqIHtcbiAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgIG1heC1oZWlnaHQ6IDI0cmVtO1xuICAgICAgICB9XG4gICAgICAgICYgPiAudG9jIHtcbiAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgICYgLnBhZ2UtaGVhZGVyLFxuICAgICYgLnBhZ2UtZm9vdGVyIHtcbiAgICAgIG1hcmdpbi10b3A6IDFyZW07XG4gICAgfVxuXG4gICAgJiAucGFnZS1oZWFkZXIge1xuICAgICAgZ3JpZC1hcmVhOiBncmlkLWhlYWRlcjtcbiAgICAgIG1hcmdpbjogJHRvcFNwYWNpbmcgMCAwIDA7XG4gICAgICBAbWVkaWEgYWxsIGFuZCAoJG1vYmlsZSkge1xuICAgICAgICBtYXJnaW4tdG9wOiAwO1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgfVxuICAgIH1cblxuICAgICYgLmNlbnRlciA+IGFydGljbGUge1xuICAgICAgZ3JpZC1hcmVhOiBncmlkLWNlbnRlcjtcbiAgICB9XG5cbiAgICAmIGZvb3RlciB7XG4gICAgICBncmlkLWFyZWE6IGdyaWQtZm9vdGVyO1xuICAgIH1cblxuICAgICYgLmNlbnRlcixcbiAgICAmIGZvb3RlciB7XG4gICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgICBtaW4td2lkdGg6IDEwMCU7XG4gICAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICAgIG1hcmdpbi1yaWdodDogYXV0bztcbiAgICAgIEBtZWRpYSBhbGwgYW5kICgkdGFibGV0KSB7XG4gICAgICAgIG1hcmdpbi1yaWdodDogMDtcbiAgICAgIH1cbiAgICAgIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgICAgIG1hcmdpbi1yaWdodDogMDtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDA7XG4gICAgICB9XG4gICAgfVxuICAgICYgZm9vdGVyIHtcbiAgICAgIG1hcmdpbi1sZWZ0OiAwO1xuICAgIH1cbiAgfVxufVxuXG4uZm9vdG5vdGVzIHtcbiAgbWFyZ2luLXRvcDogMnJlbTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG59XG5cbmlucHV0W3R5cGU9XCJjaGVja2JveFwiXSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgycHgpO1xuICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodCk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luLWlubGluZS1lbmQ6IDAuMnJlbTtcbiAgbWFyZ2luLWlubGluZS1zdGFydDogLTEuNHJlbTtcbiAgYXBwZWFyYW5jZTogbm9uZTtcbiAgd2lkdGg6IDE2cHg7XG4gIGhlaWdodDogMTZweDtcblxuICAmOmNoZWNrZWQge1xuICAgIGJvcmRlci1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpO1xuXG4gICAgJjo6YWZ0ZXIge1xuICAgICAgY29udGVudDogXCJcIjtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGxlZnQ6IDRweDtcbiAgICAgIHRvcDogMXB4O1xuICAgICAgd2lkdGg6IDRweDtcbiAgICAgIGhlaWdodDogOHB4O1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBib3JkZXI6IHNvbGlkIHZhcigtLWxpZ2h0KTtcbiAgICAgIGJvcmRlci13aWR0aDogMCAycHggMnB4IDA7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZyk7XG4gICAgfVxuICB9XG59XG5cbmJsb2NrcXVvdGUge1xuICBtYXJnaW46IDFyZW0gMDtcbiAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnkpO1xuICBwYWRkaW5nLWxlZnQ6IDFyZW07XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzIGVhc2U7XG59XG5cbmgxLFxuaDIsXG5oMyxcbmg0LFxuaDUsXG5oNixcbnRoZWFkIHtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWhlYWRlckZvbnQpO1xuICBjb2xvcjogdmFyKC0tZGFyayk7XG4gIGZvbnQtd2VpZ2h0OiByZXZlcnQ7XG4gIG1hcmdpbi1ib3R0b206IDA7XG5cbiAgYXJ0aWNsZSA+ICYgPiBhW3JvbGU9XCJhbmNob3JcIl0ge1xuICAgIGNvbG9yOiB2YXIoLS1kYXJrKTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgfVxufVxuXG5oMSxcbmgyLFxuaDMsXG5oNCxcbmg1LFxuaDYge1xuICAmW2lkXSA+IGFbaHJlZl49XCIjXCJdIHtcbiAgICBtYXJnaW46IDAgMC41cmVtO1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjJzIGVhc2U7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0wLjFyZW0pO1xuICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1jb2RlRm9udCk7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIH1cblxuICAmW2lkXTpob3ZlciA+IGEge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cblxuICAmOm5vdChbaWRdKSA+IGFbcm9sZT1cImFuY2hvclwiXSB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuXG4vLyB0eXBvZ3JhcGh5IGltcHJvdmVtZW50c1xuaDEge1xuICBmb250LXNpemU6IDEuNHJlbTtcbiAgbWFyZ2luLXRvcDogMS45cmVtO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuXG5oMiB7XG4gIGZvbnQtc2l6ZTogMS40cmVtO1xuICBtYXJnaW4tdG9wOiAxLjlyZW07XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG59XG5cbmgzIHtcbiAgZm9udC1zaXplOiAxLjEycmVtO1xuICBtYXJnaW4tdG9wOiAxLjYycmVtO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xufVxuXG5oNCxcbmg1LFxuaDYge1xuICBmb250LXNpemU6IDFyZW07XG4gIG1hcmdpbi10b3A6IDEuNXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cblxuZmlndXJlW2RhdGEtcmVoeXBlLXByZXR0eS1jb2RlLWZpZ3VyZV0ge1xuICBtYXJnaW46IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbGluZS1oZWlnaHQ6IDEuNnJlbTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICYgPiBbZGF0YS1yZWh5cGUtcHJldHR5LWNvZGUtdGl0bGVdIHtcbiAgICBmb250LWZhbWlseTogdmFyKC0tY29kZUZvbnQpO1xuICAgIGZvbnQtc2l6ZTogMC45cmVtO1xuICAgIHBhZGRpbmc6IDAuMXJlbSAwLjVyZW07XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgICB3aWR0aDogZml0LWNvbnRlbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xuICAgIG1hcmdpbi1ib3R0b206IC0wLjVyZW07XG4gICAgY29sb3I6IHZhcigtLWRhcmtncmF5KTtcbiAgfVxuXG4gICYgPiBwcmUge1xuICAgIHBhZGRpbmc6IDA7XG4gIH1cbn1cblxucHJlIHtcbiAgZm9udC1mYW1pbHk6IHZhcigtLWNvZGVGb250KTtcbiAgcGFkZGluZzogMCAwLjVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgb3ZlcmZsb3cteDogYXV0bztcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGlnaHRncmF5KTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICY6aGFzKD4gY29kZS5tZXJtYWlkKSB7XG4gICAgYm9yZGVyOiBub25lO1xuICB9XG5cbiAgJiA+IGNvZGUge1xuICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgcGFkZGluZzogMDtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gICAgY291bnRlci1yZXNldDogbGluZTtcbiAgICBjb3VudGVyLWluY3JlbWVudDogbGluZSAwO1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgcGFkZGluZzogMC41cmVtIDA7XG4gICAgb3ZlcmZsb3cteDogYXV0bztcblxuICAgICYgW2RhdGEtaGlnaGxpZ2h0ZWQtY2hhcnNdIHtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWhpZ2hsaWdodCk7XG4gICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgfVxuXG4gICAgJiA+IFtkYXRhLWxpbmVdIHtcbiAgICAgIHBhZGRpbmc6IDAgMC4yNXJlbTtcbiAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICBib3JkZXItbGVmdDogM3B4IHNvbGlkIHRyYW5zcGFyZW50O1xuXG4gICAgICAmW2RhdGEtaGlnaGxpZ2h0ZWQtbGluZV0ge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1oaWdobGlnaHQpO1xuICAgICAgICBib3JkZXItbGVmdDogM3B4IHNvbGlkIHZhcigtLXNlY29uZGFyeSk7XG4gICAgICB9XG5cbiAgICAgICY6OmJlZm9yZSB7XG4gICAgICAgIGNvbnRlbnQ6IGNvdW50ZXIobGluZSk7XG4gICAgICAgIGNvdW50ZXItaW5jcmVtZW50OiBsaW5lO1xuICAgICAgICB3aWR0aDogMXJlbTtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICBjb2xvcjogcmdiYSgxMTUsIDEzOCwgMTQ4LCAwLjYpO1xuICAgICAgfVxuICAgIH1cblxuICAgICZbZGF0YS1saW5lLW51bWJlcnMtbWF4LWRpZ2l0cz1cIjJcIl0gPiBbZGF0YS1saW5lXTo6YmVmb3JlIHtcbiAgICAgIHdpZHRoOiAycmVtO1xuICAgIH1cblxuICAgICZbZGF0YS1saW5lLW51bWJlcnMtbWF4LWRpZ2l0cz1cIjNcIl0gPiBbZGF0YS1saW5lXTo6YmVmb3JlIHtcbiAgICAgIHdpZHRoOiAzcmVtO1xuICAgIH1cbiAgfVxufVxuXG5jb2RlIHtcbiAgZm9udC1zaXplOiAwLjllbTtcbiAgY29sb3I6IHZhcigtLWRhcmspO1xuICBmb250LWZhbWlseTogdmFyKC0tY29kZUZvbnQpO1xuICBib3JkZXItcmFkaXVzOiA1cHg7XG4gIHBhZGRpbmc6IDAuMXJlbSAwLjJyZW07XG4gIGJhY2tncm91bmQ6IHZhcigtLWxpZ2h0Z3JheSk7XG59XG5cbnRib2R5LFxubGksXG5wIHtcbiAgbGluZS1oZWlnaHQ6IDEuNnJlbTtcbn1cblxuLnRhYmxlLWNvbnRhaW5lciB7XG4gIG92ZXJmbG93LXg6IGF1dG87XG5cbiAgJiA+IHRhYmxlIHtcbiAgICBtYXJnaW46IDFyZW07XG4gICAgcGFkZGluZzogMS41cmVtO1xuICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XG5cbiAgICB0aCxcbiAgICB0ZCB7XG4gICAgICBtaW4td2lkdGg6IDc1cHg7XG4gICAgfVxuXG4gICAgJiA+ICoge1xuICAgICAgbGluZS1oZWlnaHQ6IDJyZW07XG4gICAgfVxuICB9XG59XG5cbnRoIHtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgcGFkZGluZzogMC40cmVtIDAuN3JlbTtcbiAgYm9yZGVyLWJvdHRvbTogMnB4IHNvbGlkIHZhcigtLWdyYXkpO1xufVxuXG50ZCB7XG4gIHBhZGRpbmc6IDAuMnJlbSAwLjdyZW07XG59XG5cbnRyIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gICY6bGFzdC1jaGlsZCB7XG4gICAgYm9yZGVyLWJvdHRvbTogbm9uZTtcbiAgfVxufVxuXG5pbWcge1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgbWFyZ2luOiAxcmVtIDA7XG4gIGNvbnRlbnQtdmlzaWJpbGl0eTogYXV0bztcbn1cblxucCA+IGltZyArIGVtIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXJlbSk7XG59XG5cbmhyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIG1hcmdpbjogMnJlbSBhdXRvO1xuICBoZWlnaHQ6IDFweDtcbiAgYm9yZGVyOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1saWdodGdyYXkpO1xufVxuXG5hdWRpbyxcbnZpZGVvIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbn1cblxuLnNwYWNlciB7XG4gIGZsZXg6IDIgMSBhdXRvO1xufVxuXG5kaXY6aGFzKD4gLm92ZXJmbG93KSB7XG4gIG1heC1oZWlnaHQ6IDEwMCU7XG4gIG92ZXJmbG93LXk6IGhpZGRlbjtcbn1cblxudWwub3ZlcmZsb3csXG5vbC5vdmVyZmxvdyB7XG4gIG1heC1oZWlnaHQ6IDEwMCU7XG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW4tYm90dG9tOiAwO1xuXG4gIC8vIGNsZWFyZml4XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGNsZWFyOiBib3RoO1xuXG4gICYgPiBsaS5vdmVyZmxvdy1lbmQge1xuICAgIGhlaWdodDogMC41cmVtO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gICYuZ3JhZGllbnQtYWN0aXZlIHtcbiAgICBtYXNrLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCBibGFjayBjYWxjKDEwMCUgLSA1MHB4KSwgdHJhbnNwYXJlbnQgMTAwJSk7XG4gIH1cbn1cblxuLnRyYW5zY2x1ZGUge1xuICB1bCB7XG4gICAgcGFkZGluZy1sZWZ0OiAxcmVtO1xuICB9XG59XG5cbi5rYXRleC1kaXNwbGF5IHtcbiAgZGlzcGxheTogaW5pdGlhbDtcbiAgb3ZlcmZsb3cteDogYXV0bztcbiAgb3ZlcmZsb3cteTogaGlkZGVuO1xufVxuXG4uZXh0ZXJuYWwtZW1iZWQueW91dHViZSxcbmlmcmFtZS5wZGYge1xuICBhc3BlY3QtcmF0aW86IDE2IC8gOTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xufVxuXG4ubmF2aWdhdGlvbi1wcm9ncmVzcyB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMDtcbiAgaGVpZ2h0OiAzcHg7XG4gIGJhY2tncm91bmQ6IHZhcigtLXNlY29uZGFyeSk7XG4gIHRyYW5zaXRpb246IHdpZHRoIDAuMnMgZWFzZTtcbiAgei1pbmRleDogOTk5OTtcbn1cbiIsIi8qIEZhbWlseSBIaXN0b3J5IFdlYnNpdGUgLSBDdXN0b20gU3R5bGVzIGZvciBQcm9maWxlcyAqL1xuXG4vKiBEdWFsLVBhbmUgTGF5b3V0IGZvciBQcm9maWxlIFBhZ2VzICovXG5ib2R5OmhhcyhbZGF0YS1zbHVnKj1cInByb2ZpbGVzL1Blb3BsZS9cIl0pIHtcbiAgI3F1YXJ0ei1ib2R5IHtcbiAgICBkaXNwbGF5OiBncmlkICFpbXBvcnRhbnQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAyMCUgODAlICFpbXBvcnRhbnQ7XG4gICAgZ2FwOiAwICFpbXBvcnRhbnQ7XG4gICAgbWF4LXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XG4gICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgICBcbiAgICAuc2lkZWJhci5sZWZ0IHtcbiAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICBtYXgtaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMTAwcHgpO1xuICAgIH1cbiAgICBcbiAgICAuY2VudGVyIHtcbiAgICAgIHBhZGRpbmc6IDAgNHJlbTtcbiAgICB9XG4gICAgXG4gICAgLnNpZGViYXIucmlnaHQge1xuICAgICAgZGlzcGxheTogZmxleCAhaW1wb3J0YW50OyAvKiBTaG93IHJpZ2h0IHNpZGViYXIgZm9yIGJhY2tsaW5rcyAqL1xuICAgIH1cbiAgfVxufVxuXG4vKiBQcm9maWxlIEhlYWRlciBTdHlsaW5nICovXG4ucHJvZmlsZS1oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEuNXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbiAgcGFkZGluZzogMS41cmVtO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodCk7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgYm9yZGVyLWxlZnQ6IDRweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnkpO1xufVxuXG4vKiBNZXJtYWlkIERpYWdyYW0gRW5oYW5jZW1lbnQgKi9cbnByZTpoYXMoPiBjb2RlLm1lcm1haWQpIHtcbiAgb3ZlcmZsb3cteDogYXV0bztcbiAgb3ZlcmZsb3cteTogaGlkZGVuO1xuICAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2g7XG4gIG1heC13aWR0aDogMTAwJTtcbiAgY3Vyc29yOiBncmFiO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgXG4gICY6YWN0aXZlIHtcbiAgICBjdXJzb3I6IGdyYWJiaW5nO1xuICB9XG59XG5cbi5tZXJtYWlkIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tbGlnaHQpO1xuICBwYWRkaW5nOiAycmVtO1xuICBib3JkZXItcmFkaXVzOiA4cHg7XG4gIG1hcmdpbjogMnJlbSAwO1xuICBib3gtc2hhZG93OiAwIDJweCA4cHggcmdiYSgwLCAwLCAwLCAwLjA1KTtcbiAgXG4gIC5ub2RlIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcbiAgICBcbiAgICAmOmhvdmVyIHJlY3Qge1xuICAgICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuMSk7XG4gICAgICBzdHJva2Utd2lkdGg6IDNweCAhaW1wb3J0YW50O1xuICAgIH1cbiAgfVxuXG4gIC8vIExpbmtzIGluIE1lcm1haWQgZGlhZ3JhbXMgc2hvdWxkIGJlIGJsdWVcbiAgYSB7XG4gICAgY29sb3I6ICMwMDY2Y2MgIWltcG9ydGFudDtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyICFpbXBvcnRhbnQ7XG4gICAgXG4gICAgJjpob3ZlciB7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICB9XG4gIH1cblxuICAvLyBBbHNvIHN0eWxlIHRoZSB0ZXh0IGluc2lkZSBub2Rlc1xuICAubm9kZUxhYmVsIHtcbiAgICBjb2xvcjogIzAwNjZjYyAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAvLyBFbnN1cmUgU1ZHIGRvZXNuJ3Qgb3ZlcmZsb3dcbiAgc3ZnIHtcbiAgICBtYXgtd2lkdGg6IG5vbmU7XG4gICAgaGVpZ2h0OiBhdXRvO1xuICB9XG59XG5cbi8qIFJlc3BvbnNpdmUgLSBNb2JpbGUgc3RhY2tzIHZlcnRpY2FsbHkgKi9cbkBtZWRpYSAobWF4LXdpZHRoOiAxMDI0cHgpIHtcbiAgYm9keTpoYXMoW2RhdGEtc2x1Zyo9XCJwcm9maWxlcy9QZW9wbGUvXCJdKSAucGFnZSB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gIH1cbn1cblxuIiwiQHVzZSBcIi4vYmFzZS5zY3NzXCI7XG5cbi8vIEZhbWlseSBIaXN0b3J5IFdlYnNpdGUgLSBDdXN0b20gc3R5bGVzXG5AaW1wb3J0IFwiLi9mYW1pbHktcHJvZmlsZXMuc2Nzc1wiO1xuXG4vLyBGb3JjZSBsaWdodCBtb2RlIC0gZGlzYWJsZSBkYXJrIG1vZGUgZW50aXJlbHlcbjpyb290IHtcbiAgY29sb3Itc2NoZW1lOiBsaWdodCAhaW1wb3J0YW50O1xufVxuXG4vLyBHbG9iYWwgY29udGVudCB3aWR0aCBsaW1pdGF0aW9uIGZvciBiZXR0ZXIgcmVhZGFiaWxpdHlcbmFydGljbGUge1xuICBtYXgtd2lkdGg6IDgwMHB4O1xuICBsaW5lLWhlaWdodDogMS42O1xuICBmb250LXNpemU6IDAuOTVyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNWY1ZjU7XG4gIHBhZGRpbmc6IDJyZW07XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcblxuICAvLyBMaW5rcyBpbiBhcnRpY2xlIGNvbnRlbnQ6IGJsdWUgd2l0aCB1bmRlcmxpbmUgb24gaG92ZXJcbiAgYSB7XG4gICAgY29sb3I6ICMwMDY2Y2M7XG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIGVhc2UsIHRleHQtZGVjb3JhdGlvbiAwLjJzIGVhc2U7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpZWxkIGxhYmVscyAoQmlydGg6LCBQYXJlbnRzOiwgZXRjLikgaW4gZ3JheVxuICBzdHJvbmcge1xuICAgIGNvbG9yOiAjNjY2O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIH1cblxuICAvLyBSZWd1bGFyIHRleHQgaW4gYmxhY2tcbiAgcCwgc3BhbiwgZGl2IHtcbiAgICBjb2xvcjogIzAwMDtcbiAgfVxuXG4gIC8vIFNtYWxsZXIgaGVhZGluZyBzaXplcyBmb3IgZGlhZ3JhbXNcbiAgaDIge1xuICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xuICAgIG1hcmdpbi10b3A6IDEuNXJlbTtcbiAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICB9XG59XG5cbi8vIEFsc28gbGltaXQgdGFiIGNvbnRlbnQgd2lkdGggZm9yIHByb2ZpbGUgcGFnZXNcbi50YWItcGFuZSB7XG4gIG1heC13aWR0aDogODAwcHg7XG4gIGxpbmUtaGVpZ2h0OiAxLjY7XG4gIGZvbnQtc2l6ZTogMC45NXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNTtcbiAgcGFkZGluZzogMnJlbTtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuXG4gIC8vIExpbmtzIGluIHRhYiBjb250ZW50OiBibHVlIHdpdGggdW5kZXJsaW5lIG9uIGhvdmVyXG4gIGEge1xuICAgIGNvbG9yOiAjMDA2NmNjO1xuICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgdHJhbnNpdGlvbjogY29sb3IgMC4ycyBlYXNlLCB0ZXh0LWRlY29yYXRpb24gMC4ycyBlYXNlO1xuXG4gICAgJjpob3ZlciB7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICB9XG4gIH1cblxuICAvLyBGaWVsZCBsYWJlbHMgKEJpcnRoOiwgUGFyZW50czosIGV0Yy4pIGluIGdyYXlcbiAgc3Ryb25nIHtcbiAgICBjb2xvcjogIzY2NjtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICB9XG5cbiAgLy8gUmVndWxhciB0ZXh0IGluIGJsYWNrXG4gIHAsIHNwYW4sIGRpdiB7XG4gICAgY29sb3I6ICMwMDA7XG4gIH1cblxuICAvLyBTbWFsbGVyIGhlYWRpbmcgc2l6ZXMgZm9yIGRpYWdyYW1zXG4gIGgyIHtcbiAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICBtYXJnaW4tdG9wOiAxLjVyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgfVxuICBcbiAgLy8gR2FsbGVyeSBzdHlsZXMgYXJlIG5vdyBpbiBQcm9maWxlVGFicy50c3ggY29tcG9uZW50IENTU1xuICAvLyBSZW1vdmVkIHRvIGF2b2lkIGNvbmZsaWN0cyAtIGFsbCBnYWxsZXJ5IHN0eWxpbmcgaXMgaW4gUHJvZmlsZVRhYnMudHN4XG4gIFxuICAubWVkaWEtc2VjdGlvbiB7XG4gICAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbiAgICBcbiAgICBoMyB7XG4gICAgICBmb250LXNpemU6IDEuM3JlbTtcbiAgICAgIG1hcmdpbi1ib3R0b206IDFyZW07XG4gICAgICBjb2xvcjogIzMzMztcbiAgICB9XG4gIH1cbiAgXG4gIFxuICAuZW1wdHktbWVzc2FnZSB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGNvbG9yOiAjNjY2O1xuICAgIHBhZGRpbmc6IDJyZW07XG4gICAgZm9udC1zdHlsZTogaXRhbGljO1xuICB9XG4gIFxuICAubG9hZGluZy1tZXNzYWdlIHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgY29sb3I6ICM2NjY7XG4gICAgcGFkZGluZzogMnJlbTtcbiAgfVxufVxuXG4vLyBEZWZpbml0aW9uIGxpc3Qgc3R5bGluZyBmb3IgcHJvZmlsZSBpbmZvIChhcHBsaWVzIHRvIGJvdGggYXJ0aWNsZSBhbmQgdGFiLXBhbmUpXG4ucHJvZmlsZS1pbmZvLWxpc3Qge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IGF1dG8gMWZyO1xuICBnYXA6IDAuNXJlbSAxcmVtO1xuICBtYXJnaW46IDA7XG5cbiAgZHQge1xuICAgIGNvbG9yOiAjNjY2O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB9XG5cbiAgZGQge1xuICAgIG1hcmdpbjogMDtcbiAgICBjb2xvcjogIzAwMDtcbiAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG4gICAgb3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcbiAgfVxufVxuXG4vLyBOYXZiYXIgYW5kIEV4cGxvcmVyIGxpbmtzIHNob3VsZCBiZSBEQVJLIEJMQUNLIChub3QgZ3JheSkgLSBTVFJPTkcgT1ZFUlJJREVcbi5uYXZiYXItbWVudSBhLFxuLm5hdmJhciBhLFxuLmV4cGxvcmVyIGEsXG4uZXhwbG9yZXItY29udGVudCB1bCBsaSA+IGEsXG4uZm9sZGVyLWNvbnRhaW5lciBkaXYgPiBhLFxuLmZvbGRlci1jb250YWluZXIgZGl2ID4gYnV0dG9uIHNwYW4ge1xuICBjb2xvcjogIzFhMWExYSAhaW1wb3J0YW50O1xuICBcbiAgJjpob3ZlciB7XG4gICAgY29sb3I6IHZhcigtLXRlcnRpYXJ5KSAhaW1wb3J0YW50O1xuICB9XG59XG5cbi8vIEJpb2dyYXBoeSBzdHlsaW5nIC0gVHlwb2dyYXBoeVxuYXJ0aWNsZSwgLnRhYi1wYW5lIHtcbiAgLy8gQm9vay1saWtlIHR5cG9ncmFwaHlcbiAgZm9udC1mYW1pbHk6ICdTZWdvZSBVSScsIFRhaG9tYSwgR2VuZXZhLCBWZXJkYW5hLCBzYW5zLXNlcmlmO1xuICBmb250LXNpemU6IDAuOTM3NXJlbSAhaW1wb3J0YW50OyAvLyAxNXB4IChvbmUgbGV2ZWwgdXAgZnJvbSAxNHB4KVxuICBsaW5lLWhlaWdodDogMS43O1xuICBjb2xvcjogIzJhMmEyYTtcbiAgbWF4LXdpZHRoOiA2NThweCAhaW1wb3J0YW50OyAvLyA1JSB3aWRlciB0aGFuIDYyN3B4XG4gIG1hcmdpbjogMCBhdXRvO1xuICBcbiAgLy8gSGVicmV3L1JUTCB0ZXh0IC0gbWFudWFsIG92ZXJyaWRlIHdpdGggQ1NTIGNsYXNzIG9yIGlubGluZSBzdHlsZXNcbiAgLy8gRm9yIG5vdywgdXNlIGRpcj1cImF1dG9cIiBiZWhhdmlvciAgXG4gIHAge1xuICAgIGRpcmVjdGlvbjogaW5oZXJpdDtcbiAgICB1bmljb2RlLWJpZGk6IC13ZWJraXQtcGxhaW50ZXh0O1xuICAgIHVuaWNvZGUtYmlkaTogLW1vei1wbGFpbnRleHQ7XG4gICAgdW5pY29kZS1iaWRpOiBwbGFpbnRleHQ7XG4gICAgdGV4dC1hbGlnbjogc3RhcnQ7XG4gIH1cbiAgXG4gIC8vIEl0YWxpYy9lbXBoYXNpcyB0YWdzIGluIEhlYnJld1xuICBlbSB7XG4gICAgdW5pY29kZS1iaWRpOiAtd2Via2l0LXBsYWludGV4dDtcbiAgICB1bmljb2RlLWJpZGk6IC1tb3otcGxhaW50ZXh0O1xuICAgIHVuaWNvZGUtYmlkaTogcGxhaW50ZXh0O1xuICB9XG4gIFxuICAvLyBTdGFuZGFsb25lIHN0cm9uZyB0YWdzIChsaWtlIFwi16TXqNen15kg15DXkdeV16pcIilcbiAgPiBzdHJvbmcge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHVuaWNvZGUtYmlkaTogLXdlYmtpdC1wbGFpbnRleHQ7XG4gICAgdW5pY29kZS1iaWRpOiAtbW96LXBsYWludGV4dDsgIFxuICAgIHVuaWNvZGUtYmlkaTogcGxhaW50ZXh0O1xuICAgIHRleHQtYWxpZ246IHN0YXJ0O1xuICB9XG4gIFxuICAvLyBDaGFwdGVyIGxpbmtzIChpbnRlcm5hbCBuYXZpZ2F0aW9uIGJldHdlZW4gY2hhcHRlcnMpXG4gIC5jaGFwdGVyLWxpbmsge1xuICAgIGNvbG9yOiAjMDA2NmNjO1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgXG4gICAgJjpob3ZlciB7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICB9XG4gIH1cbn1cblxuLy8gTGlua3MgYW5kIHN0eWxpbmcgaW4gY2hhcHRlciBjb250ZW50XG4uY2hhcHRlci10YWItcGFuZSwgLmNoYXB0ZXItdGFicy1jb250ZW50IHtcbiAgLy8gRm9yY2UgTFRSIGRpcmVjdGlvbiBmb3IgRW5nbGlzaCBjb250ZW50IHdpdGggZW1iZWRkZWQgSGVicmV3XG4gIGRpcmVjdGlvbjogbHRyO1xuICBcbiAgcCB7XG4gICAgZGlyZWN0aW9uOiBsdHI7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICB1bmljb2RlLWJpZGk6IGVtYmVkO1xuICB9XG4gIFxuICBlbSwgc3Ryb25nIHtcbiAgICB1bmljb2RlLWJpZGk6IGVtYmVkO1xuICB9XG4gIFxuICAvLyBIZWJyZXcgcGFyYWdyYXBocyAtIHVzZSA8ZGl2IGNsYXNzPVwicnRsLXBhcmFncmFwaFwiPiBvciA8ZGl2IGRpcj1cInJ0bFwiPlxuICAucnRsLXBhcmFncmFwaCwgW2Rpcj1cInJ0bFwiXSB7XG4gICAgZGlyZWN0aW9uOiBydGw7XG4gICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgdW5pY29kZS1iaWRpOiBlbWJlZDtcbiAgICBcbiAgICBwIHtcbiAgICAgIGRpcmVjdGlvbjogcnRsO1xuICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgfVxuICB9XG4gIFxuICAvLyBTdGFuZGFsb25lIHN0cm9uZy9lbSB0YWdzIChub3QgaW5zaWRlIHApIHNob3VsZCBhbHNvIGFsaWduXG4gID4gc3Ryb25nLCA+IGVtIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICB1bmljb2RlLWJpZGk6IHBsYWludGV4dDtcbiAgICB0ZXh0LWFsaWduOiBzdGFydDtcbiAgfVxuICBcbiAgLy8gUmVndWxhciBsaW5rcyAobWFrZSB0aGVtIGJsdWUgbGlrZSBwcm9maWxlIGxpbmtzKVxuICBhOm5vdCguY2hhcHRlci1saW5rKSB7XG4gICAgY29sb3I6ICMwMDY2Y2MgIWltcG9ydGFudDtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgXG4gICAgJjpob3ZlciB7XG4gICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICB9XG4gICAgXG4gICAgJjp2aXNpdGVkIHtcbiAgICAgIGNvbG9yOiAjNTUxYThiICFpbXBvcnRhbnQ7XG4gICAgfVxuICB9XG4gIFxuICAvLyBDaGFwdGVyIGxpbmtzIHNob3VsZCBiZSBibHVlIGxpa2UgcHJvZmlsZSBsaW5rc1xuICBhLmNoYXB0ZXItbGluayB7XG4gICAgY29sb3I6ICMwMDY2Y2MgIWltcG9ydGFudDtcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIFxuICAgICY6aG92ZXIge1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgfVxuICAgIFxuICAgICY6dmlzaXRlZCB7XG4gICAgICBjb2xvcjogIzU1MWE4YiAhaW1wb3J0YW50OyAgLy8gUHVycGxlIGZvciB2aXNpdGVkIGxpbmtzXG4gICAgfVxuICB9XG4gIFxuICAvLyBDb2xvcmVkIGhlYWRpbmdzIGluIGJpb2dyYXBoeSBjb250ZW50XG4gIGgxLCBoMiwgaDMsIGg0IHtcbiAgICBjb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICBtYXJnaW4tdG9wOiAxLjVyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMC43NXJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICB9XG4gIFxuICBoMSB7XG4gICAgZm9udC1zaXplOiAxLjc1cmVtO1xuICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgIHBhZGRpbmctYm90dG9tOiAwLjVyZW07XG4gIH1cbiAgXG4gIGgyIHtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgfVxuICBcbiAgaDMge1xuICAgIGZvbnQtc2l6ZTogMS4yNXJlbTtcbiAgICBjb2xvcjogIzJjNWFhMDsgLy8gU2xpZ2h0bHkgZGFya2VyIGJsdWVcbiAgfVxuICBcbiAgaDQge1xuICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xuICAgIGNvbG9yOiAjMmM1YWEwO1xuICB9XG59XG5cbi8vIENoYXB0ZXIgdGFicyAobmVzdGVkIGluc2lkZSBiaW9ncmFwaHkgdGFiKVxuLmNoYXB0ZXItdGFicy1jb250YWluZXIge1xuICBtYXJnaW46IDJyZW0gMDtcbn1cblxuLy8gQmlvZ3JhcGh5IGhlYWRpbmdcbi5iaW9ncmFwaHktYmFubmVyLFxuLmJpb2dyYXBoeS1iYW5uZXItdG9wIHtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2Y1ZjdmYSAwJSwgI2MzY2ZlMiAxMDAlKTtcbiAgYm9yZGVyOiAxcHggc29saWQgI2QwZDdkZTtcbiAgYm9yZGVyLXJhZGl1czogOHB4O1xuICBwYWRkaW5nOiAwLjc1cmVtIDEuNXJlbTtcbiAgbWFyZ2luOiAxcmVtIDAgMS41cmVtIDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBmb250LXdlaWdodDogNTAwO1xuICBjb2xvcjogIzI0MjkyZjtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICBcbiAgJjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2U4ZWJmMCAwJSwgI2IzYmZkMSAxMDAlKTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gICAgYm94LXNoYWRvdzogMCA0cHggOHB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gIH1cbiAgXG4gICY6YWN0aXZlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgYm94LXNoYWRvdzogMCAxcHggM3B4IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgfVxufVxuXG4uYmlvZ3JhcGh5LWhlYWRpbmcge1xuICBmb250LXNpemU6IDEuNXJlbTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgY29sb3I6ICMxYTFhMWE7XG4gIG1hcmdpbi1ib3R0b206IDFyZW07XG4gIHBhZGRpbmctYm90dG9tOiAwLjVyZW07XG4gIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCB2YXIoLS1zZWNvbmRhcnkpO1xufVxuXG4uY2hhcHRlci10YWJzLWhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMC43NXJlbTtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkIHZhcigtLWxpZ2h0Z3JheSk7XG4gIG1hcmdpbi1ib3R0b206IDEuNXJlbTtcbiAgZmxleC13cmFwOiB3cmFwO1xufVxuXG4uY2hhcHRlci10YWItYnV0dG9uIHtcbiAgcGFkZGluZzogMC41cmVtIDFyZW07XG4gIGJhY2tncm91bmQ6ICNmNWY1ZjU7XG4gIGJvcmRlcjogMnB4IHNvbGlkICNkZGQ7XG4gIGJvcmRlci1yYWRpdXM6IDUwcHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZm9udC1zaXplOiAwLjlyZW07XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGNvbG9yOiAjNTU1O1xuICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlO1xuXG4gICY6aG92ZXIge1xuICAgIGNvbG9yOiAjMDAwO1xuICAgIGJhY2tncm91bmQ6ICNlOGU4ZTg7XG4gICAgYm9yZGVyLWNvbG9yOiAjY2NjO1xuICB9XG5cbiAgJi5hY3RpdmUge1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zZWNvbmRhcnkpO1xuICAgIGJvcmRlci1jb2xvcjogdmFyKC0tc2Vjb25kYXJ5KTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICB9XG59XG5cbi5jaGFwdGVyLXRhYnMtY29udGVudCB7XG4gIC5jaGFwdGVyLXRhYi1wYW5lIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICAgIGFuaW1hdGlvbjogZmFkZUluIDAuM3MgZWFzZTtcblxuICAgICYuYWN0aXZlIHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIH1cbiAgfVxufVxuXG4vLyBCYWNrIHRvIGFydGljbGUvdGFiLXBhbmUgY29udGV4dFxuYXJ0aWNsZSwgLnRhYi1wYW5lIHtcbiAgLy8gSW1hZ2VzIGFuZCBDYXB0aW9uc1xuICAvLyBJbWFnZXM6IGNlbnRlcmVkIHdpdGggYmxhY2sgZnJhbWUgYW5kIHNoYWRvd1xuICAvLyBCVVQgZXhjbHVkZSBnYWxsZXJ5IGltYWdlcyB3aGljaCBoYXZlIHRoZWlyIG93biBzdHlsaW5nXG4gIGltZzpub3QoLmdhbGxlcnktaXRlbSBpbWcpIHtcbiAgICBtYXJnaW46IDJyZW0gYXV0bztcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgYm9yZGVyOiAycHggc29saWQgIzMzMztcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgcGFkZGluZzogOHB4O1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICB9XG5cbiAgLy8gSW1hZ2UgY2FwdGlvbnM6ICoqX2NhcHRpb24gdGV4dF8qKiAoc3Ryb25nICsgZW0pXG4gIC8vIE9ubHkgZW0gdGhhdCBpcyB0aGUgT05MWSBjaGlsZCBvZiBzdHJvbmcgd2lsbCBiZSBzdHlsZWQgYXMgY2FwdGlvblxuICBzdHJvbmcgPiBlbTpvbmx5LWNoaWxkIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgZm9udC1zaXplOiAwLjlyZW07XG4gICAgY29sb3I6ICM2NjY7XG4gICAgbWFyZ2luLXRvcDogLTFyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMnJlbTtcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gICAgZm9udC13ZWlnaHQ6IG5vcm1hbDsgLy8gQ2FuY2VsIHRoZSBib2xkIGZyb20gc3Ryb25nXG4gIH1cblxuICAvLyBCbG9ja3F1b3RlczogZWxlZ2FudCBzdHlsaW5nIGZvciBsb25nIHF1b3RhdGlvbnNcbiAgYmxvY2txdW90ZSB7XG4gICAgYmFja2dyb3VuZDogI2Y5ZjlmOTtcbiAgICBib3JkZXItbGVmdDogNHB4IHNvbGlkICMwMDY2Y2M7XG4gICAgcGFkZGluZzogMXJlbSAxLjVyZW07XG4gICAgbWFyZ2luOiAxLjVyZW0gMDtcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gICAgY29sb3I6ICMzMzM7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuXG4gICAgcCB7XG4gICAgICBtYXJnaW46IDAuNXJlbSAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIFNlY3Rpb24gc2VwYXJhdG9yczogZWxlZ2FudCBob3Jpem9udGFsIHJ1bGVzXG4gIGhyIHtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYm9yZGVyLXRvcDogMnB4IHNvbGlkICNlMGUwZTA7XG4gICAgbWFyZ2luOiAzcmVtIDA7XG4gICAgd2lkdGg6IDYwJTtcbiAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gIH1cblxuICAvLyBDaXRhdGlvbiBib3hlcyBmb3IgbmV3c3BhcGVyIHF1b3Rlc1xuICAuY2l0YXRpb24tYm94IHtcbiAgICBiYWNrZ3JvdW5kOiAjZmRmNmUzO1xuICAgIGJvcmRlcjogMnB4IGRhc2hlZCAjZDRiODk2O1xuICAgIHBhZGRpbmc6IDEuNXJlbTtcbiAgICBtYXJnaW46IDJyZW0gMDtcbiAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgZm9udC1mYW1pbHk6IEdlb3JnaWEsIHNlcmlmO1xuICAgIFxuICAgICY6OmJlZm9yZSB7XG4gICAgICBjb250ZW50OiBcIvCfk7AgXCI7XG4gICAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICAgIG1hcmdpbi1yaWdodDogMC41cmVtO1xuICAgIH1cbiAgfVxuXG4gIC8vIEluZm8gYm94ZXMgZm9yIGF1dGhvciBub3Rlc1xuICAuaW5mby1ib3gge1xuICAgIGJhY2tncm91bmQ6ICNlM2YyZmQ7XG4gICAgYm9yZGVyLWxlZnQ6IDRweCBzb2xpZCAjMTk3NmQyO1xuICAgIHBhZGRpbmc6IDFyZW0gMS41cmVtO1xuICAgIG1hcmdpbjogMS41cmVtIDA7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIGZvbnQtc2l6ZTogMC45NXJlbTtcblxuICAgICY6OmJlZm9yZSB7XG4gICAgICBjb250ZW50OiBcIuKEue+4jyBcIjtcbiAgICAgIG1hcmdpbi1yaWdodDogMC41cmVtO1xuICAgIH1cbiAgfVxufVxuXG4vLyBNb2JpbGUgcmVzcG9uc2l2ZSAtIGZ1bGwgd2lkdGggY29udGVudFxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIGFydGljbGUsIC50YWItcGFuZSB7XG4gICAgbWF4LXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XG4gICAgcGFkZGluZzogMXJlbSAhaW1wb3J0YW50O1xuICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAuY2hhcHRlci10YWItcGFuZSB7XG4gICAgbWF4LXdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XG4gICAgcGFkZGluZzogMXJlbSAhaW1wb3J0YW50O1xuICB9XG4gIFxuICAvLyBSZWR1Y2UgaW1hZ2UgcGFkZGluZyBvbiBtb2JpbGVcbiAgLy8gQlVUIGV4Y2x1ZGUgZ2FsbGVyeSBpbWFnZXMgd2hpY2ggaGF2ZSB0aGVpciBvd24gc3R5bGluZ1xuICBhcnRpY2xlIGltZzpub3QoLmdhbGxlcnktaXRlbSBpbWcpLCBcbiAgLnRhYi1wYW5lIGltZzpub3QoLmdhbGxlcnktaXRlbSBpbWcpIHtcbiAgICBwYWRkaW5nOiA0cHg7XG4gICAgbWFyZ2luOiAxcmVtIGF1dG87XG4gIH1cbiAgXG4gIC8vIFJlZHVjZSBjaXRhdGlvbiBib3ggcGFkZGluZyBvbiBtb2JpbGVcbiAgLmNpdGF0aW9uLWJveCwgLmluZm8tYm94IHtcbiAgICBwYWRkaW5nOiAwLjc1cmVtICFpbXBvcnRhbnQ7XG4gICAgbWFyZ2luOiAxcmVtIDAgIWltcG9ydGFudDtcbiAgICBmb250LXNpemU6IDAuODVyZW07XG4gIH1cbiAgXG4gIC8vIFJlZHVjZSBpbmRleCBxdW90ZSBmb250IHNpemUgYnkgMjUlIG9uIG1vYmlsZSAob25seSBhZmZlY3RzIGluZGV4Lm1kKVxuICAuaW5kZXgtcXVvdGUtaGVicmV3IHtcbiAgICBmb250LXNpemU6IDAuOXJlbSAhaW1wb3J0YW50OyAvLyA3NSUgb2YgMS4ycmVtXG4gIH1cbiAgXG4gIC5pbmRleC1xdW90ZS1lbmdsaXNoIHtcbiAgICBmb250LXNpemU6IDAuODI1cmVtICFpbXBvcnRhbnQ7IC8vIDc1JSBvZiAxLjFyZW1cbiAgfVxufVxuXG4vLyBFeHRyYSBzbWFsbCBkZXZpY2VzIC0gZXZlbiBsZXNzIHBhZGRpbmdcbkBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCkge1xuICBhcnRpY2xlLCAudGFiLXBhbmUsIC5jaGFwdGVyLXRhYi1wYW5lIHtcbiAgICBwYWRkaW5nOiAwLjc1cmVtICFpbXBvcnRhbnQ7XG4gIH1cbiAgXG4gIC8vIEV2ZW4gc21hbGxlciBwYWRkaW5nIGZvciBjaXRhdGlvbiBib3hlcyBvbiB0aW55IHNjcmVlbnNcbiAgLmNpdGF0aW9uLWJveCwgLmluZm8tYm94IHtcbiAgICBwYWRkaW5nOiAwLjVyZW0gIWltcG9ydGFudDtcbiAgICBtYXJnaW46IDAuNzVyZW0gMCAhaW1wb3J0YW50O1xuICAgIGZvbnQtc2l6ZTogMC44cmVtO1xuICB9XG4gIFxuICAvLyBLZWVwIGluZGV4IHF1b3RlIHNtYWxsZXIgb24gZXh0cmEgc21hbGwgZGV2aWNlcyB0b28gKG9ubHkgYWZmZWN0cyBpbmRleC5tZClcbiAgLmluZGV4LXF1b3RlLWhlYnJldyB7XG4gICAgZm9udC1zaXplOiAwLjlyZW0gIWltcG9ydGFudDtcbiAgfVxuICBcbiAgLmluZGV4LXF1b3RlLWVuZ2xpc2gge1xuICAgIGZvbnQtc2l6ZTogMC44MjVyZW0gIWltcG9ydGFudDtcbiAgfVxufVxuXG4vLyBPYnNpZGlhbi1zdHlsZSBjb2RlIGJsb2NrcyBmb3IgZmFtaWx5IHRyZWVzXG5hcnRpY2xlIHByZSwgLnRhYi1wYW5lIHByZSwgLmNoYXB0ZXItdGFiLXBhbmUgcHJlIHtcbiAgZm9udC1mYW1pbHk6ICdDYXNjYWRpYSBDb2RlJywgJ0Nhc2NhZGlhIE1vbm8nLCAnQ29uc29sYXMnLCAnQ291cmllciBOZXcnLCBtb25vc3BhY2UgIWltcG9ydGFudDtcbiAgZm9udC1zaXplOiAxNHB4ICFpbXBvcnRhbnQ7XG4gIGxpbmUtaGVpZ2h0OiAxLjUgIWltcG9ydGFudDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y1ZjVmNSAhaW1wb3J0YW50O1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTBlMGUwICFpbXBvcnRhbnQ7XG4gIHBhZGRpbmc6IDFyZW0gMS41cmVtICFpbXBvcnRhbnQ7XG4gIG1hcmdpbjogMS41cmVtIDAgIWltcG9ydGFudDtcbiAgYm9yZGVyLXJhZGl1czogNnB4ICFpbXBvcnRhbnQ7XG4gIG92ZXJmbG93LXg6IGF1dG8gIWltcG9ydGFudDtcbiAgd2hpdGUtc3BhY2U6IHByZSAhaW1wb3J0YW50O1xuICBcbiAgLy8gUmVtb3ZlIGxpbmUgbnVtYmVycyBmb3IgZmFtaWx5IHRyZWVzXG4gICYgPiBjb2RlIHtcbiAgICBmb250LXNpemU6IDE0cHggIWltcG9ydGFudDtcbiAgICBsaW5lLWhlaWdodDogMS41ICFpbXBvcnRhbnQ7XG4gICAgd2hpdGUtc3BhY2U6IHByZSAhaW1wb3J0YW50O1xuICAgIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XG4gICAgXG4gICAgJiA+IFtkYXRhLWxpbmVdOjpiZWZvcmUge1xuICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgIH1cbiAgICBcbiAgICAvLyBGaXggbGlua3MgaW5zaWRlIGNvZGUgYmxvY2tzIC0gcHJldmVudCBsaW5lIGJyZWFrc1xuICAgIC8vIExpbmtzIHNob3VsZCBiZSBpbmxpbmUgYW5kIG5vdCBjYXVzZSBsaW5lIGJyZWFrc1xuICAgIGEge1xuICAgICAgZGlzcGxheTogaW5saW5lICFpbXBvcnRhbnQ7XG4gICAgICB3aGl0ZS1zcGFjZTogcHJlICFpbXBvcnRhbnQ7XG4gICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICAgIHBhZGRpbmc6IDAgIWltcG9ydGFudDtcbiAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lICFpbXBvcnRhbnQ7XG4gICAgICBjb2xvcjogIzAwNjZjYyAhaW1wb3J0YW50O1xuICAgICAgd29yZC1icmVhazoga2VlcC1hbGwgIWltcG9ydGFudDtcbiAgICAgIGxpbmUtYnJlYWs6IGF1dG8gIWltcG9ydGFudDtcbiAgICAgIG92ZXJmbG93LXdyYXA6IG5vcm1hbCAhaW1wb3J0YW50O1xuICAgICAgd29yZC13cmFwOiBub3JtYWwgIWltcG9ydGFudDtcbiAgICAgIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZSAhaW1wb3J0YW50O1xuICAgICAgZmxvYXQ6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgIGNsZWFyOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICBcbiAgICAgIC8vIFByZXZlbnQgYW55IHBzZXVkby1lbGVtZW50cyBmcm9tIGNhdXNpbmcgYnJlYWtzXG4gICAgICAmOjpiZWZvcmUsXG4gICAgICAmOjphZnRlciB7XG4gICAgICAgIGNvbnRlbnQ6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBFbnN1cmUgbm8gbGluZSBicmVha3MgYmVmb3JlIG9yIGFmdGVyXG4gICAgICAmICsgKiB7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAwICFpbXBvcnRhbnQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgICY6aG92ZXIge1xuICAgICAgICBjb2xvcjogIzAwNTJhMyAhaW1wb3J0YW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbn1cblxuLy8gQWRkaXRpb25hbCBydWxlIHRvIGVuc3VyZSBsaW5rcyBpbiBjb2RlIGJsb2NrcyBkb24ndCBicmVha1xuYXJ0aWNsZSBwcmUgY29kZSBhLFxuLnRhYi1wYW5lIHByZSBjb2RlIGEsXG4uY2hhcHRlci10YWItcGFuZSBwcmUgY29kZSBhIHtcbiAgZGlzcGxheTogaW5saW5lICFpbXBvcnRhbnQ7XG4gIHdoaXRlLXNwYWNlOiBwcmUgIWltcG9ydGFudDtcbn1cblxuLy8gRm9yY2UgbGlnaHQgbW9kZSBvbmx5IC0gZGFyayBtb2RlIGRpc2FibGVkXG46cm9vdFtzYXZlZC10aGVtZT1cImRhcmtcIl0ge1xuICBhcnRpY2xlIHByZSwgLnRhYi1wYW5lIHByZSwgLmNoYXB0ZXItdGFiLXBhbmUgcHJlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjVmNWY1ICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLWNvbG9yOiAjZTBlMGUwICFpbXBvcnRhbnQ7XG4gICAgY29sb3I6IGluaGVyaXQgIWltcG9ydGFudDtcbiAgfVxufVxuIl19 */`;var popover_default=`/**
 * Layout breakpoints
 * $mobile: screen width below this value will use mobile styles
 * $desktop: screen width above this value will use desktop styles
 * Screen width between $mobile and $desktop width will use the tablet layout.
 * assuming mobile < desktop
 */
@keyframes dropin {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  1% {
    opacity: 0;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}
.popover {
  z-index: 999;
  position: fixed;
  overflow: visible;
  padding: 1rem;
  left: 0;
  top: 0;
  will-change: transform;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
.popover > .popover-inner {
  position: relative;
  width: 30rem;
  max-height: 20rem;
  padding: 0 1rem 1rem 1rem;
  font-weight: initial;
  font-style: initial;
  line-height: normal;
  font-size: initial;
  font-family: var(--bodyFont);
  border: 1px solid var(--lightgray);
  background-color: var(--light);
  border-radius: 5px;
  box-shadow: 6px 6px 36px 0 rgba(0, 0, 0, 0.25);
  overflow: auto;
  overscroll-behavior: contain;
  white-space: normal;
  user-select: none;
  cursor: default;
}
.popover > .popover-inner[data-content-type][data-content-type*=pdf], .popover > .popover-inner[data-content-type][data-content-type*=image] {
  padding: 0;
  max-height: 100%;
}
.popover > .popover-inner[data-content-type][data-content-type*=image] img {
  margin: 0;
  border-radius: 0;
  display: block;
}
.popover > .popover-inner[data-content-type][data-content-type*=pdf] iframe {
  width: 100%;
}
.popover h1 {
  font-size: 1.5rem;
}
@media all and ((max-width: 800px)) {
  .popover {
    display: none !important;
  }
}

.active-popover,
.popover:hover {
  animation: dropin 0.3s ease;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
}
/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiQzpcXHByb2plY3RzXFxWNFxcc2l0ZVxccXVhcnR6XFxjb21wb25lbnRzXFxzdHlsZXMiLCJzb3VyY2VzIjpbIi4uXFwuLlxcc3R5bGVzXFx2YXJpYWJsZXMuc2NzcyIsInBvcG92ZXIuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQ0FBO0VBQ0U7SUFDRTtJQUNBOztFQUVGO0lBQ0U7O0VBRUY7SUFDRTtJQUNBOzs7QUFJSjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBaURBO0VBQ0E7RUFDQSxZQUNFOztBQWxERjtFQUNFO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFJQTtFQUVFO0VBQ0E7O0FBSUE7RUFDRTtFQUNBO0VBQ0E7O0FBS0Y7RUFDRTs7QUFLTjtFQUNFOztBQVNGO0VBOURGO0lBK0RJOzs7O0FBSUo7QUFBQTtFQUVFO0VBQ0E7RUFDQSIsInNvdXJjZXNDb250ZW50IjpbIkB1c2UgXCJzYXNzOm1hcFwiO1xuXG4vKipcbiAqIExheW91dCBicmVha3BvaW50c1xuICogJG1vYmlsZTogc2NyZWVuIHdpZHRoIGJlbG93IHRoaXMgdmFsdWUgd2lsbCB1c2UgbW9iaWxlIHN0eWxlc1xuICogJGRlc2t0b3A6IHNjcmVlbiB3aWR0aCBhYm92ZSB0aGlzIHZhbHVlIHdpbGwgdXNlIGRlc2t0b3Agc3R5bGVzXG4gKiBTY3JlZW4gd2lkdGggYmV0d2VlbiAkbW9iaWxlIGFuZCAkZGVza3RvcCB3aWR0aCB3aWxsIHVzZSB0aGUgdGFibGV0IGxheW91dC5cbiAqIGFzc3VtaW5nIG1vYmlsZSA8IGRlc2t0b3BcbiAqL1xuJGJyZWFrcG9pbnRzOiAoXG4gIG1vYmlsZTogODAwcHgsXG4gIGRlc2t0b3A6IDEyMDBweCxcbik7XG5cbiRtb2JpbGU6IFwiKG1heC13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgbW9iaWxlKX0pXCI7XG4kdGFibGV0OiBcIihtaW4td2lkdGg6ICN7bWFwLmdldCgkYnJlYWtwb2ludHMsIG1vYmlsZSl9KSBhbmQgKG1heC13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9KVwiO1xuJGRlc2t0b3A6IFwiKG1pbi13aWR0aDogI3ttYXAuZ2V0KCRicmVha3BvaW50cywgZGVza3RvcCl9KVwiO1xuXG4kcGFnZVdpZHRoOiAje21hcC5nZXQoJGJyZWFrcG9pbnRzLCBtb2JpbGUpfTtcbiRzaWRlUGFuZWxXaWR0aDogMzIwcHg7IC8vMzgwcHg7XG4kdG9wU3BhY2luZzogNnJlbTtcbiRib2xkV2VpZ2h0OiA3MDA7XG4kc2VtaUJvbGRXZWlnaHQ6IDYwMDtcbiRub3JtYWxXZWlnaHQ6IDQwMDtcblxuJG1vYmlsZUdyaWQ6IChcbiAgdGVtcGxhdGVSb3dzOiBcImF1dG8gYXV0byBhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiYXV0b1wiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdFwiXFxcbiAgICAgIFwiZ3JpZC1oZWFkZXJcIlxcXG4gICAgICBcImdyaWQtY2VudGVyXCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItcmlnaHRcIlxcXG4gICAgICBcImdyaWQtZm9vdGVyXCInLFxuKTtcbiR0YWJsZXRHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0byBhdXRvXCIsXG4gIHRlbXBsYXRlQ29sdW1uczogXCIjeyRzaWRlUGFuZWxXaWR0aH0gYXV0b1wiLFxuICByb3dHYXA6IFwiNXB4XCIsXG4gIGNvbHVtbkdhcDogXCI1cHhcIixcbiAgdGVtcGxhdGVBcmVhczpcbiAgICAnXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWhlYWRlclwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1jZW50ZXJcIlxcXG4gICAgICBcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1mb290ZXJcIicsXG4pO1xuJGRlc2t0b3BHcmlkOiAoXG4gIHRlbXBsYXRlUm93czogXCJhdXRvIGF1dG8gYXV0b1wiLFxuICB0ZW1wbGF0ZUNvbHVtbnM6IFwiI3skc2lkZVBhbmVsV2lkdGh9IGF1dG8gI3skc2lkZVBhbmVsV2lkdGh9XCIsXG4gIHJvd0dhcDogXCI1cHhcIixcbiAgY29sdW1uR2FwOiBcIjVweFwiLFxuICB0ZW1wbGF0ZUFyZWFzOlxuICAgICdcImdyaWQtc2lkZWJhci1sZWZ0IGdyaWQtaGVhZGVyIGdyaWQtc2lkZWJhci1yaWdodFwiXFxcbiAgICAgIFwiZ3JpZC1zaWRlYmFyLWxlZnQgZ3JpZC1jZW50ZXIgZ3JpZC1zaWRlYmFyLXJpZ2h0XCJcXFxuICAgICAgXCJncmlkLXNpZGViYXItbGVmdCBncmlkLWZvb3RlciBncmlkLXNpZGViYXItcmlnaHRcIicsXG4pO1xuIiwiQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiIGFzICo7XG5cbkBrZXlmcmFtZXMgZHJvcGluIHtcbiAgMCUge1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICB9XG4gIDElIHtcbiAgICBvcGFjaXR5OiAwO1xuICB9XG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgfVxufVxuXG4ucG9wb3ZlciB7XG4gIHotaW5kZXg6IDk5OTtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBvdmVyZmxvdzogdmlzaWJsZTtcbiAgcGFkZGluZzogMXJlbTtcbiAgbGVmdDogMDtcbiAgdG9wOiAwO1xuICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xuXG4gICYgPiAucG9wb3Zlci1pbm5lciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHdpZHRoOiAzMHJlbTtcbiAgICBtYXgtaGVpZ2h0OiAyMHJlbTtcbiAgICBwYWRkaW5nOiAwIDFyZW0gMXJlbSAxcmVtO1xuICAgIGZvbnQtd2VpZ2h0OiBpbml0aWFsO1xuICAgIGZvbnQtc3R5bGU6IGluaXRpYWw7XG4gICAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcbiAgICBmb250LXNpemU6IGluaXRpYWw7XG4gICAgZm9udC1mYW1pbHk6IHZhcigtLWJvZHlGb250KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saWdodGdyYXkpO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWxpZ2h0KTtcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgYm94LXNoYWRvdzogNnB4IDZweCAzNnB4IDAgcmdiYSgwLCAwLCAwLCAwLjI1KTtcbiAgICBvdmVyZmxvdzogYXV0bztcbiAgICBvdmVyc2Nyb2xsLWJlaGF2aW9yOiBjb250YWluO1xuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgY3Vyc29yOiBkZWZhdWx0O1xuICB9XG5cbiAgJiA+IC5wb3BvdmVyLWlubmVyW2RhdGEtY29udGVudC10eXBlXSB7XG4gICAgJltkYXRhLWNvbnRlbnQtdHlwZSo9XCJwZGZcIl0sXG4gICAgJltkYXRhLWNvbnRlbnQtdHlwZSo9XCJpbWFnZVwiXSB7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgICAgbWF4LWhlaWdodDogMTAwJTtcbiAgICB9XG5cbiAgICAmW2RhdGEtY29udGVudC10eXBlKj1cImltYWdlXCJdIHtcbiAgICAgIGltZyB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJltkYXRhLWNvbnRlbnQtdHlwZSo9XCJwZGZcIl0ge1xuICAgICAgaWZyYW1lIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaDEge1xuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICB9XG5cbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOlxuICAgIG9wYWNpdHkgMC4zcyBlYXNlLFxuICAgIHZpc2liaWxpdHkgMC4zcyBlYXNlO1xuXG4gIEBtZWRpYSBhbGwgYW5kICgkbW9iaWxlKSB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbi5hY3RpdmUtcG9wb3Zlcixcbi5wb3BvdmVyOmhvdmVyIHtcbiAgYW5pbWF0aW9uOiBkcm9waW4gMC4zcyBlYXNlO1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjJzO1xufVxuIl19 */`;import{Features,transform}from"lightningcss";import{transform as transpile}from"esbuild";function getComponentResources(ctx){let allComponents=new Set;for(let emitter of ctx.cfg.plugins.emitters){let components=emitter.getQuartzComponents?.(ctx)??[];for(let component of components)allComponents.add(component)}let componentResources={css:new Set,beforeDOMLoaded:new Set,afterDOMLoaded:new Set};function normalizeResource(resource){return resource?Array.isArray(resource)?resource:[resource]:[]}__name(normalizeResource,"normalizeResource");for(let component of allComponents){let{css,beforeDOMLoaded,afterDOMLoaded}=component,normalizedCss=normalizeResource(css),normalizedBeforeDOMLoaded=normalizeResource(beforeDOMLoaded),normalizedAfterDOMLoaded=normalizeResource(afterDOMLoaded);normalizedCss.forEach(c=>componentResources.css.add(c)),normalizedBeforeDOMLoaded.forEach(b=>componentResources.beforeDOMLoaded.add(b)),normalizedAfterDOMLoaded.forEach(a=>componentResources.afterDOMLoaded.add(a))}return{css:[...componentResources.css],beforeDOMLoaded:[...componentResources.beforeDOMLoaded],afterDOMLoaded:[...componentResources.afterDOMLoaded]}}__name(getComponentResources,"getComponentResources");async function joinScripts(scripts){let script=scripts.map(script2=>`(function () {${script2}})();`).join(`
`);return(await transpile(script,{minify:!0})).code}__name(joinScripts,"joinScripts");function addGlobalPageResources(ctx,componentResources){let cfg=ctx.cfg.configuration;if(cfg.enablePopovers&&(componentResources.afterDOMLoaded.push(popover_inline_default),componentResources.css.push(popover_default)),cfg.analytics?.provider==="google"){let tagId=cfg.analytics.tagId;componentResources.afterDOMLoaded.push(`
      const gtagScript = document.createElement('script');
      gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=${tagId}';
      gtagScript.defer = true;
      gtagScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', '${tagId}', { send_page_view: false });
        gtag('event', 'page_view', { page_title: document.title, page_location: location.href });
        document.addEventListener('nav', () => {
          gtag('event', 'page_view', { page_title: document.title, page_location: location.href });
        });
      };
      
      document.head.appendChild(gtagScript);
    `)}else if(cfg.analytics?.provider==="plausible"){let plausibleHost=cfg.analytics.host??"https://plausible.io";componentResources.afterDOMLoaded.push(`
      const plausibleScript = document.createElement('script');
      plausibleScript.src = '${plausibleHost}/js/script.manual.js';
      plausibleScript.setAttribute('data-domain', location.hostname);
      plausibleScript.defer = true;
      plausibleScript.onload = () => {
        window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
        plausible('pageview');
        document.addEventListener('nav', () => {
          plausible('pageview');
        });
      };

      document.head.appendChild(plausibleScript);
    `)}else if(cfg.analytics?.provider==="umami")componentResources.afterDOMLoaded.push(`
      const umamiScript = document.createElement("script");
      umamiScript.src = "${cfg.analytics.host??"https://analytics.umami.is"}/script.js";
      umamiScript.setAttribute("data-website-id", "${cfg.analytics.websiteId}");
      umamiScript.setAttribute("data-auto-track", "true");
      umamiScript.defer = true;

      document.head.appendChild(umamiScript);
    `);else if(cfg.analytics?.provider==="goatcounter")componentResources.afterDOMLoaded.push(`
      const goatcounterScriptPre = document.createElement('script');
      goatcounterScriptPre.textContent = \`
        window.goatcounter = { no_onload: true };
      \`;
      document.head.appendChild(goatcounterScriptPre);

      const endpoint = "https://${cfg.analytics.websiteId}.${cfg.analytics.host??"goatcounter.com"}/count";
      const goatcounterScript = document.createElement('script');
      goatcounterScript.src = "${cfg.analytics.scriptSrc??"https://gc.zgo.at/count.js"}";
      goatcounterScript.defer = true;
      goatcounterScript.setAttribute('data-goatcounter', endpoint);
      goatcounterScript.onload = () => {
        window.goatcounter.endpoint = endpoint;
        goatcounter.count({ path: location.pathname });
        document.addEventListener('nav', () => {
          goatcounter.count({ path: location.pathname });
        });
      };

      document.head.appendChild(goatcounterScript);
    `);else if(cfg.analytics?.provider==="posthog")componentResources.afterDOMLoaded.push(`
      const posthogScript = document.createElement("script");
      posthogScript.innerHTML= \`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init('${cfg.analytics.apiKey}', {
        api_host: '${cfg.analytics.host??"https://app.posthog.com"}',
        capture_pageview: false,
      });
      document.addEventListener('nav', () => {
        posthog.capture('$pageview', { path: location.pathname });
      })\`

      document.head.appendChild(posthogScript);
    `);else if(cfg.analytics?.provider==="tinylytics"){let siteId=cfg.analytics.siteId;componentResources.afterDOMLoaded.push(`
      const tinylyticsScript = document.createElement('script');
      tinylyticsScript.src = 'https://tinylytics.app/embed/${siteId}.js?spa';
      tinylyticsScript.defer = true;
      tinylyticsScript.onload = () => {
        window.tinylytics.triggerUpdate();
        document.addEventListener('nav', () => {
          window.tinylytics.triggerUpdate();
        });
      };
      
      document.head.appendChild(tinylyticsScript);
    `)}else cfg.analytics?.provider==="cabin"?componentResources.afterDOMLoaded.push(`
      const cabinScript = document.createElement("script")
      cabinScript.src = "${cfg.analytics.host??"https://scripts.withcabin.com"}/hello.js"
      cabinScript.defer = true
      document.head.appendChild(cabinScript)
    `):cfg.analytics?.provider==="clarity"?componentResources.afterDOMLoaded.push(`
      const clarityScript = document.createElement("script")
      clarityScript.innerHTML= \`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.defer=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${cfg.analytics.projectId}");\`
      document.head.appendChild(clarityScript)
    `):cfg.analytics?.provider==="matomo"?componentResources.afterDOMLoaded.push(`
      const matomoScript = document.createElement("script");
      matomoScript.innerHTML = \`
      let _paq = window._paq = window._paq || [];

      // Track SPA navigation
      // https://developer.matomo.org/guides/spa-tracking
      document.addEventListener("nav", () => {
        _paq.push(['setCustomUrl', location.pathname]);
        _paq.push(['setDocumentTitle', document.title]);
        _paq.push(['trackPageView']);
      });

      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        const u="//${cfg.analytics.host}/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', ${cfg.analytics.siteId}]);
        const d=document, g=d.createElement('script'), s=d.getElementsByTagName
('script')[0];
        g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
      })();
      \`
      document.head.appendChild(matomoScript);
    `):cfg.analytics?.provider==="vercel"&&(componentResources.beforeDOMLoaded.push(`
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    `),componentResources.afterDOMLoaded.push(`
      const vercelInsightsScript = document.createElement("script")
      vercelInsightsScript.src = "/_vercel/insights/script.js"
      vercelInsightsScript.defer = true
      document.head.appendChild(vercelInsightsScript)
    `));cfg.enableSPA?componentResources.afterDOMLoaded.push(spa_inline_default):componentResources.afterDOMLoaded.push(`
      window.spaNavigate = (url, _) => window.location.assign(url)
      window.addCleanup = () => {}
      const event = new CustomEvent("nav", { detail: { url: document.body.dataset.slug } })
      document.dispatchEvent(event)
    `)}__name(addGlobalPageResources,"addGlobalPageResources");var ComponentResources=__name(()=>({name:"ComponentResources",async*emit(ctx,_content,_resources){let cfg=ctx.cfg.configuration,componentResources=getComponentResources(ctx),googleFontsStyleSheet="";if(cfg.theme.fontOrigin!=="local"){if(cfg.theme.fontOrigin==="googleFonts"&&!cfg.theme.cdnCaching){let theme=ctx.cfg.configuration.theme;if(googleFontsStyleSheet=await(await fetch(googleFontHref(theme))).text(),theme.typography.title){let title=ctx.cfg.configuration.pageTitle,response2=await fetch(googleFontSubsetHref(theme,title));googleFontsStyleSheet+=`
${await response2.text()}`}if(!cfg.baseUrl)throw new Error("baseUrl must be defined when using Google Fonts without cfg.theme.cdnCaching");let{processedStylesheet,fontFiles}=await processGoogleFonts(googleFontsStyleSheet,cfg.baseUrl);googleFontsStyleSheet=processedStylesheet;for(let fontFile of fontFiles){let res=await fetch(fontFile.url);if(!res.ok)throw new Error(`Failed to fetch font ${fontFile.filename}`);let buf=await res.arrayBuffer();yield write({ctx,slug:joinSegments("static","fonts",fontFile.filename),ext:`.${fontFile.extension}`,content:Buffer.from(buf)})}}}addGlobalPageResources(ctx,componentResources);let stylesheet=joinStyles(ctx.cfg.configuration.theme,googleFontsStyleSheet,...componentResources.css,custom_default),[prescript,postscript]=await Promise.all([joinScripts(componentResources.beforeDOMLoaded),joinScripts(componentResources.afterDOMLoaded)]);yield write({ctx,slug:"index",ext:".css",content:transform({filename:"index.css",code:Buffer.from(stylesheet),minify:!0,targets:{safari:984576,ios_saf:984576,edge:7536640,firefox:6684672,chrome:7143424},include:Features.MediaQueries}).code.toString()}),yield write({ctx,slug:"prescript",ext:".js",content:prescript}),yield write({ctx,slug:"postscript",ext:".js",content:postscript})},async*partialEmit(){}}),"ComponentResources");var NotFoundPage=__name(()=>{let opts={...sharedPageComponents,pageBody:__default(),beforeBody:[],left:[],right:[]},{head:Head,pageBody,footer:Footer}=opts,Body2=Body_default();return{name:"404Page",getQuartzComponents(){return[Head,Body2,pageBody,Footer]},async*emit(ctx,_content,resources){let cfg=ctx.cfg.configuration,slug="404",path12=new URL(`https://${cfg.baseUrl??"example.com"}`).pathname,notFound=i18n(cfg.locale).pages.error.title,[tree,vfile]=defaultProcessedContent({slug,text:notFound,description:notFound,frontmatter:{title:notFound,tags:[]}}),externalResources=pageResources(path12,resources),componentData={ctx,fileData:vfile.data,externalResources,cfg,children:[],tree,allFiles:[]};yield write({ctx,content:renderPage(cfg,slug,componentData,opts,externalResources),slug,ext:".html"})},async*partialEmit(){}}},"NotFoundPage");function getStaticResourcesFromPlugins(ctx){let staticResources={css:[],js:[],additionalHead:[]};for(let transformer of[...ctx.cfg.plugins.transformers,...ctx.cfg.plugins.emitters]){let res=transformer.externalResources?transformer.externalResources(ctx):{};res?.js&&staticResources.js.push(...res.js),res?.css&&staticResources.css.push(...res.css),res?.additionalHead&&staticResources.additionalHead.push(...res.additionalHead)}if(ctx.argv.serve){let wsUrl=ctx.argv.remoteDevHost?`wss://${ctx.argv.remoteDevHost}:${ctx.argv.wsPort}`:`ws://localhost:${ctx.argv.wsPort}`;staticResources.js.push({loadTime:"afterDOMReady",contentType:"inline",script:`
        const socket = new WebSocket('${wsUrl}')
        // reload(true) ensures resources like images and scripts are fetched again in firefox
        socket.addEventListener('message', () => document.location.reload(true))
      `})}return staticResources}__name(getStaticResourcesFromPlugins,"getStaticResourcesFromPlugins");import{styleText as styleText6}from"util";async function emitContent(ctx,content){let{argv,cfg}=ctx,perf=new PerfTimer,log=new QuartzLogger(ctx.argv.verbose);log.start("Emitting files");let emittedFiles=0,staticResources=getStaticResourcesFromPlugins(ctx);await Promise.all(cfg.plugins.emitters.map(async emitter=>{try{let emitted=await emitter.emit(ctx,content,staticResources);if(Symbol.asyncIterator in emitted)for await(let file of emitted)emittedFiles++,ctx.argv.verbose?console.log(`[emit:${emitter.name}] ${file}`):log.updateText(`${emitter.name} -> ${styleText6("gray",file)}`);else{emittedFiles+=emitted.length;for(let file of emitted)ctx.argv.verbose?console.log(`[emit:${emitter.name}] ${file}`):log.updateText(`${emitter.name} -> ${styleText6("gray",file)}`)}}catch(err){trace(`Failed to emit from plugin \`${emitter.name}\``,err)}})),log.end(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince()}`)}__name(emitContent,"emitContent");var config={configuration:{pageTitle:"Hoffman Family History",pageTitleSuffix:" | \u05DE\u05E9\u05E4\u05D7\u05D4",enableSPA:!0,enablePopovers:!0,analytics:{provider:"plausible"},locale:"en-US",baseUrl:process.env.BASE_URL||"localhost:8080",ignorePatterns:["private","templates",".obsidian"],defaultDateType:"modified",theme:{fontOrigin:"googleFonts",cdnCaching:!0,typography:{header:"Schibsted Grotesk",body:"Source Sans Pro",code:"Roboto Mono"},colors:{lightMode:{light:"#faf8f8",lightgray:"#e5e5e5",gray:"#b8b8b8",darkgray:"#4e4e4e",dark:"#2b2b2b",secondary:"#284b63",tertiary:"#84a59d",highlight:"rgba(143, 159, 169, 0.15)",textHighlight:"#fff23688"},darkMode:{light:"#faf8f8",lightgray:"#e5e5e5",gray:"#b8b8b8",darkgray:"#4e4e4e",dark:"#2b2b2b",secondary:"#284b63",tertiary:"#84a59d",highlight:"rgba(143, 159, 169, 0.15)",textHighlight:"#fff23688"}}}},plugins:{transformers:[FrontMatter(),CreatedModifiedDate({priority:["frontmatter","git","filesystem"]}),SyntaxHighlighting({theme:{light:"github-light",dark:"github-light"},keepBackground:!1}),ObsidianFlavoredMarkdown({enableInHtmlEmbed:!1}),GitHubFlavoredMarkdown(),HardLineBreaks(),TableOfContents(),CrawlLinks({markdownLinkResolution:"shortest"}),Description(),Latex({renderEngine:"katex"})],filters:[RemoveDrafts()],emitters:[AliasRedirects(),ComponentResources(),ContentPage(),FolderPage(),TagPage(),ContentIndex({enableSiteMap:!0,enableRSS:!0}),Assets(),Static(),Favicon(),NotFoundPage()]}},quartz_config_default=config;import chokidar from"chokidar";import fs5 from"fs";import{fileURLToPath}from"url";var options={retrieveSourceMap(source){if(source.includes(".quartz-cache")){let realSource=fileURLToPath(source.split("?",2)[0]+".map");return{map:fs5.readFileSync(realSource,"utf8")}}else return null}};function randomIdNonSecure(){return Math.random().toString(36).substring(2,8)}__name(randomIdNonSecure,"randomIdNonSecure");import{minimatch}from"minimatch";sourceMapSupport.install(options);async function buildQuartz(argv,mut,clientRefresh){let ctx={buildId:randomIdNonSecure(),argv,cfg:quartz_config_default,allSlugs:[],allFiles:[],incremental:!1},perf=new PerfTimer,output=argv.output,pluginCount=Object.values(quartz_config_default.plugins).flat().length,pluginNames=__name(key=>quartz_config_default.plugins[key].map(plugin=>plugin.name),"pluginNames");argv.verbose&&(console.log(`Loaded ${pluginCount} plugins`),console.log(`  Transformers: ${pluginNames("transformers").join(", ")}`),console.log(`  Filters: ${pluginNames("filters").join(", ")}`),console.log(`  Emitters: ${pluginNames("emitters").join(", ")}`));let release=await mut.acquire();perf.addEvent("clean"),await rm(output,{recursive:!0,force:!0}),console.log(`Cleaned output directory \`${output}\` in ${perf.timeSince("clean")}`),perf.addEvent("glob");let allFiles=await glob("**/*.*",argv.directory,quartz_config_default.configuration.ignorePatterns),markdownPaths=allFiles.filter(fp=>fp.endsWith(".md")).sort();console.log(`Found ${markdownPaths.length} input files from \`${argv.directory}\` in ${perf.timeSince("glob")}`);let filePaths=markdownPaths.map(fp=>joinSegments(argv.directory,fp));ctx.allFiles=allFiles,ctx.allSlugs=allFiles.map(fp=>slugifyFilePath(fp));let parsedFiles=await parseMarkdown(ctx,filePaths),filteredContent=filterContent(ctx,parsedFiles);if(await emitContent(ctx,filteredContent),console.log(styleText7("green",`Done processing ${markdownPaths.length} files in ${perf.timeSince()}`)),release(),argv.watch)return ctx.incremental=!0,startWatching(ctx,mut,parsedFiles,clientRefresh)}__name(buildQuartz,"buildQuartz");async function startWatching(ctx,mut,initialContent,clientRefresh){let{argv,allFiles}=ctx,contentMap=new Map;for(let filePath of allFiles)contentMap.set(filePath,{type:"other"});for(let content of initialContent){let[_tree,vfile]=content;contentMap.set(vfile.data.relativePath,{type:"markdown",content})}let gitIgnoredMatcher=await isGitIgnored(),buildData={ctx,mut,contentMap,ignored:__name(fp=>{let pathStr=toPosixPath(fp.toString());if(pathStr.startsWith(".git/")||gitIgnoredMatcher(pathStr))return!0;for(let pattern of quartz_config_default.configuration.ignorePatterns)if(minimatch(pathStr,pattern))return!0;return!1},"ignored"),changesSinceLastBuild:{},lastBuildMs:0},watcher=chokidar.watch(".",{persistent:!0,cwd:argv.directory,ignoreInitial:!0}),changes=[];return watcher.on("add",fp=>{fp=toPosixPath(fp),!buildData.ignored(fp)&&(changes.push({path:fp,type:"add"}),rebuild(changes,clientRefresh,buildData))}).on("change",fp=>{fp=toPosixPath(fp),!buildData.ignored(fp)&&(changes.push({path:fp,type:"change"}),rebuild(changes,clientRefresh,buildData))}).on("unlink",fp=>{fp=toPosixPath(fp),!buildData.ignored(fp)&&(changes.push({path:fp,type:"delete"}),rebuild(changes,clientRefresh,buildData))}),async()=>{await watcher.close()}}__name(startWatching,"startWatching");async function rebuild(changes,clientRefresh,buildData){let{ctx,contentMap,mut,changesSinceLastBuild}=buildData,{argv,cfg}=ctx,buildId=randomIdNonSecure();ctx.buildId=buildId,buildData.lastBuildMs=new Date().getTime();let numChangesInBuild=changes.length,release=await mut.acquire();if(ctx.buildId!==buildId){release();return}let perf=new PerfTimer;perf.addEvent("rebuild"),console.log(styleText7("yellow","Detected change, rebuilding..."));for(let change of changes)changesSinceLastBuild[change.path]=change.type;let staticResources=getStaticResourcesFromPlugins(ctx),pathsToParse=[];for(let[fp,type]of Object.entries(changesSinceLastBuild)){if(type==="delete"||path11.extname(fp)!==".md")continue;let fullPath=joinSegments(argv.directory,toPosixPath(fp));pathsToParse.push(fullPath)}let parsed=await parseMarkdown(ctx,pathsToParse);for(let content of parsed)contentMap.set(content[1].data.relativePath,{type:"markdown",content});for(let[file,change]of Object.entries(changesSinceLastBuild))change==="delete"&&contentMap.delete(file),change==="add"&&path11.extname(file)!==".md"&&contentMap.set(file,{type:"other"});let changeEvents=Object.entries(changesSinceLastBuild).map(([fp,type])=>{let path12=fp,processedContent=contentMap.get(path12);if(processedContent?.type==="markdown"){let[_tree,file]=processedContent.content;return{type,path:path12,file}}return{type,path:path12}});ctx.allFiles=Array.from(contentMap.keys()),ctx.allSlugs=ctx.allFiles.map(fp=>slugifyFilePath(fp));let processedFiles=filterContent(ctx,Array.from(contentMap.values()).filter(file=>file.type==="markdown").map(file=>file.content)),emittedFiles=0;for(let emitter of cfg.plugins.emitters){let emitted=await(emitter.partialEmit??emitter.emit)(ctx,processedFiles,staticResources,changeEvents);if(emitted!==null){if(Symbol.asyncIterator in emitted)for await(let file of emitted)emittedFiles++,ctx.argv.verbose&&console.log(`[emit:${emitter.name}] ${file}`);else if(emittedFiles+=emitted.length,ctx.argv.verbose)for(let file of emitted)console.log(`[emit:${emitter.name}] ${file}`)}}console.log(`Emitted ${emittedFiles} files to \`${argv.output}\` in ${perf.timeSince("rebuild")}`),console.log(styleText7("green",`Done rebuilding in ${perf.timeSince()}`)),changes.splice(0,numChangesInBuild),clientRefresh(),release()}__name(rebuild,"rebuild");var build_default=__name(async(argv,mut,clientRefresh)=>{try{return await buildQuartz(argv,mut,clientRefresh)}catch(err){trace(`
Exiting Quartz due to a fatal error`,err)}},"default");export{build_default as default};
//# sourceMappingURL=transpiled-build.mjs.map
