'use strict';
const el=id=>document.getElementById(id);
const catalog=window.toyCarCatalog;
const modelKeys=Object.keys(catalog);
for(const [key,entry] of Object.entries(catalog)){const b=document.createElement('button');b.dataset.model=key;b.textContent=entry.label||key;b.setAttribute('aria-pressed','false');document.querySelector('.shapes').append(b);}
window.toyGarageState={model:'race',color:'#ef5548',steering:0,throttle:0,driving:false,toddler:true,easy:true,muted:false,reset:0};
const state=window.toyGarageState;
let photoData='',image=new Image(),uploadGeneration=0;
function status(message){el('status').textContent=message;}
function persist(){try{localStorage.setItem('toy-garage-v1',JSON.stringify({model:state.model,color:state.color,easy:state.easy,toddler:state.toddler,name:el('name').value,photo:photoData}));status('Garage saved on this device.');}catch{status('Storage is full or unavailable. You can still drive; this change may not stay saved.');}}
function showPhoto(data){photoData=data;image.src=data;el('photo').src=data;el('photo').style.display='block';el('placeholder').style.display='none';el('badgephoto').src=data;el('badgephoto').style.display='block';}
function chooseModel(model){if(!modelKeys.includes(model))return;state.model=model;el('color').disabled=!!catalog[model].preserve_colors;document.querySelectorAll('[data-model]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.model===model));}
function setColor(color){if(catalog[state.model].preserve_colors)color=catalog[state.model].color||'#ffffff';if(!/^#[0-9a-f]{6}$/i.test(color))return;state.color=color;el('color').value=color;}
function setMode(toddler){releaseControls();state.toddler=!!toddler;state.reset++;document.body.classList.toggle('toddler',state.toddler);el('mode').textContent=state.toddler?'Toddler · auto steering':'Manual · steer yourself';el('mode').setAttribute('aria-pressed',state.toddler);}
function setEasy(easy){state.easy=!!easy;el('easy').textContent=state.easy?'Slow & gentle':'A little faster';el('easy').setAttribute('aria-pressed',state.easy);}

function rgbHex(r,g,b){return '#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');}
function sampleColor(img){
 const c=document.createElement('canvas');c.width=64;c.height=64;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,64,64);const pixels=ctx.getImageData(12,12,40,40).data;const bins=new Map();
 for(let i=0;i<pixels.length;i+=4){const [r,g,b]=pixels.slice(i,i+3),max=Math.max(r,g,b),min=Math.min(r,g,b);if(max<45||max-min<35)continue;const key=[r,g,b].map(v=>Math.floor(v/32)).join(',');let bin=bins.get(key)||{count:0,r:0,g:0,b:0};bin.count++;bin.r+=r;bin.g+=g;bin.b+=b;bins.set(key,bin);}
 const best=[...bins.values()].sort((a,b)=>b.count-a.count)[0];return best?rgbHex(best.r/best.count,best.g/best.count,best.b/best.count):null;
}
async function loadPhoto(file){
 if(!file)return;const generation=++uploadGeneration;if(!file.type.startsWith('image/')){status('Please choose a photo.');return;}if(file.size>20*1024*1024){status('Please choose a photo smaller than 20 MB.');return;}
 const url=URL.createObjectURL(file);status('Preparing your photo…');
 try{const incoming=new Image();incoming.src=url;await incoming.decode();if(generation!==uploadGeneration)return;const ratio=Math.min(1,720/Math.max(incoming.width,incoming.height)),c=document.createElement('canvas');c.width=Math.round(incoming.width*ratio);c.height=Math.round(incoming.height*ratio);c.getContext('2d').drawImage(incoming,0,0,c.width,c.height);showPhoto(c.toDataURL('image/jpeg',.8));const color=sampleColor(incoming);if(color)setColor(color);persist();status(color?'Photo ready! Tap the car paint to fine-tune its color.':'Photo ready! Tap its paint or choose a color.');}catch{if(generation===uploadGeneration)status('This photo could not open. Try a JPEG or PNG.');}finally{URL.revokeObjectURL(url);}
}
['camera','file'].forEach(id=>el(id).addEventListener('change',e=>{loadPhoto(e.target.files[0]);e.target.value='';}));
el('photo').addEventListener('click',e=>{if(catalog[state.model].preserve_colors||!image.complete||!image.naturalWidth)return;const r=e.currentTarget.getBoundingClientRect(),scale=Math.min(r.width/image.naturalWidth,r.height/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale,x=(e.clientX-r.left-(r.width-w)/2)/scale,y=(e.clientY-r.top-(r.height-h)/2)/scale;if(x<0||y<0||x>=image.naturalWidth||y>=image.naturalHeight)return;const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);const p=ctx.getImageData(Math.floor(x),Math.floor(y),1,1).data;setColor(rgbHex(p[0],p[1],p[2]));persist();});
document.querySelectorAll('[data-model]').forEach(b=>b.onclick=()=>{chooseModel(b.dataset.model);const entry=catalog[state.model];if(entry.preserve_colors)setColor(entry.color||'#ffffff');if(entry.name)el('name').value=entry.name;if(entry.photo)showPhoto(entry.photo);persist();});
el('color').oninput=e=>setColor(e.target.value);el('color').onchange=persist;el('name').onchange=persist;el('easy').onclick=()=>{setEasy(!state.easy);persist();};
el('drive').onclick=()=>{persist();el('badgename').textContent=el('name').value.trim()||'My little car';state.driving=true;el('garage').hidden=true;el('hud').style.display='block';el('canvas').focus();};
function releaseControls(){state.steering=0;state.throttle=0;document.querySelector('.gas').textContent='GO';held.clear();document.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}
el('backgarage').onclick=()=>{releaseControls();state.driving=false;el('garage').hidden=false;el('hud').style.display='none';};
el('home').onclick=()=>{releaseControls();state.reset++;};
el('mute').onclick=()=>{state.muted=!state.muted;el('mute').textContent=state.muted?'Sound off':'Sound on';el('mute').setAttribute('aria-pressed',state.muted);};
const held=new Map();
function updateControls(){let steering=0,throttle=0;held.forEach(b=>{steering+=Number(b.dataset.steer||0);throttle+=Number(b.dataset.throttle||0);});state.steering=Math.max(-1,Math.min(1,steering));state.throttle=Math.max(-1,Math.min(1,throttle));}
document.querySelectorAll('.drivebuttons button').forEach(b=>{
 b.addEventListener('pointerdown',e=>{if(state.toddler)return;e.preventDefault();b.setPointerCapture(e.pointerId);held.set(e.pointerId,b);b.classList.add('held');updateControls();});
 function end(e){if(state.toddler)return;held.delete(e.pointerId);if(![...held.values()].includes(b))b.classList.remove('held');updateControls();}
 ['pointerup','pointercancel','lostpointercapture'].forEach(event=>b.addEventListener(event,end));
});
window.addEventListener('blur',releaseControls);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseControls();});

el('mode').onclick=()=>{setMode(!state.toddler);persist();};
document.querySelector('.gas').addEventListener('click',()=>{if(!state.toddler)return;state.throttle=state.throttle?0:1;document.querySelector('.gas').textContent=state.throttle?'STOP':'GO';});
setMode(true);chooseModel(state.model);
try{const saved=JSON.parse(localStorage.getItem('toy-garage-v1')||'null');if(saved&&typeof saved==='object'){chooseModel(saved.model);setColor(saved.color||'');setEasy(saved.easy!==false);setMode(saved.toddler!==false);if(typeof saved.name==='string')el('name').value=saved.name.slice(0,24);if(typeof saved.photo==='string'&&(saved.photo.startsWith('data:image/jpeg;base64,')||Object.values(catalog).some(c=>c.photo===saved.photo))&&saved.photo.length<1500000)showPhoto(saved.photo);}}catch{status('Start a fresh garage.');}
