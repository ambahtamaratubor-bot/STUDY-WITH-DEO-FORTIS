const SURL='https://yygjkqkzbdjnyyrrhdku.supabase.co';
const SKEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Z2prcWt6YmRqbnl5cnJoZGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjgyNTcsImV4cCI6MjA5MzYwNDI1N30.6mJTBhjWphURBnFefQziVreQW8WjYJLAAjMx6Sv-Kfk';
const RESEND_KEY='re_NbpuzGhW_N5WRkmwF68SZ12yEy3q9Z7m9';
const ADMIN_EMAIL='deofortistutors@gmail.com';
const sb=window.supabase.createClient(SURL,SKEY);
let pkgsLoaded=false;
async function sendAdminEmail(subject,body){
try{
await fetch('https://api.resend.com/emails',{
method:'POST',
headers:{'Content-Type':'application/json','Authorization':'Bearer '+RESEND_KEY},
body:JSON.stringify({from:'Deo Fortis <onboarding@resend.dev>',to:ADMIN_EMAIL,subject,html:body})
});
}catch(e){console.log('Email error:',e);}
}
let S={page:'landing',user:null,profile:null};
let signingUp=false;
function go(p){S.page=p;render();}
sb.auth.onAuthStateChange((_,session)=>{
  if(signingUp)return;
  if(session){S.user=session.user;getProfile(session.user.id);}
  else{S.user=null;S.profile=null;go('landing');}
});
async function getProfile(id){
const{data}=await sb.from('profiles').select('*').eq('id',id).single();
if(data){
  if(data.is_free_tier===null||data.is_free_tier===undefined){
    if(data.status==='approved'){
      await sb.from('profiles').update({is_free_tier:false}).eq('id',id);
      data.is_free_tier=false;
    }else{
      const wasFreeSignup=localStorage.getItem('signupType')==='free';
      const tierValue=wasFreeSignup?true:false;
      await sb.from('profiles').update({is_free_tier:tierValue}).eq('id',id);
      data.is_free_tier=tierValue;
    }
  }
  S.profile=data;
  if(data.is_free_tier===true){
    go('dashboard');
  }else if(data.status==='approved'){
    go('dashboard');
  }else{
    go('pending');
  }
}
}
function h(tag,attr,kids){
const e=document.createElement(tag);
if(attr)Object.entries(attr).forEach(([k,v])=>{
if(k==='cls')e.className=v;
else if(k==='html')e.innerHTML=v;
else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);
else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);
else e[k]=v;
});
if(kids)kids.filter(Boolean).forEach(k=>e.append(typeof k==='string'||typeof k==='number'?document.createTextNode(String(k)):k));
return e;
}
function div(a,k){return h('div',a,k);}
function btn(text,cls,onclick,extra){const b=h('button',{cls:'btn '+cls,onclick,...extra},[text]);return b;}
function inp(ph,type='text',val=''){const i=h('input',{cls:'input',placeholder:ph,type,value:val});return i;}
function fmtMS(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function fmtHMS(s){return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor((s%3600)/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function lbl(text){return h('label',{cls:'label',html:text});}
function field(labelText,inputEl,mb='mb-16'){const w=div({style:{marginBottom:mb==='mb-16'?'16px':'20px'}});w.append(lbl(labelText),inputEl);return w;}

// ═══════════════════════════════
// ICONS (inline SVG, replaces emojis)
// ═══════════════════════════════
const ICONS={
target:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
question:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
layers:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
pencil:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3l4 4L7 21H3v-4L17 3z"/><path d="M15 5l4 4"/></svg>`,
trophy:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M12 13V2"/></svg>`,
message:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
brain:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18z"/><path d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>`,
puzzle:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-3.408 0l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z"/></svg>`,
star:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
chart:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
moon:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
alert:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
mail:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>`,
file:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
book:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
lightbulb:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
zap:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
sparkles:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/></svg>`,
home:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
lock:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
upload:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
check:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
x:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
bookOpen:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
mic:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>`,
};

function render(){
const root=document.getElementById('root');
root.innerHTML='';
const pages={landing,signup,login,pending,dashboard,study,flashcards,vignette,leaderboard,admin,feynman};
root.append((pages[S.page]||landing)());
if(window.activeSessionId){showNoiseBar();showTimerBar();}else{removeNoiseBar();removeTimerBar();}
}

function showNoiseBar(){
if(document.getElementById('noise-bar'))return;
sb.from('admin_settings').select('noise_rain,noise_ocean,noise_cafe,noise_white').single().then(({data})=>{
if(!data)return;
const links={rain:data.noise_rain||'',ocean:data.noise_ocean||'',cafe:data.noise_cafe||'',white:data.noise_white||''};
if(!links.rain&&!links.ocean&&!links.cafe&&!links.white)return;
const bar=document.createElement('div');bar.id='noise-bar';bar.style.cssText='position:fixed;bottom:0;left:0;right:0;background:rgba(15,14,10,0.97);border-top:1px solid var(--border);padding:8px 24px;display:flex;align-items:center;gap:12px;z-index:9999;';
const ifr=document.createElement('iframe');ifr.id='noise-ifr';ifr.allow='autoplay';ifr.style.cssText='display:none;width:0;height:0;border:none;';
const label=document.createElement('span');label.style.cssText="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--dim);flex-shrink:0;text-transform:uppercase;";label.textContent='White Noise';
bar.append(label);
let activeKey=null;
[['rain','Rain',links.rain],['ocean','Ocean',links.ocean],['cafe','Cafe',links.cafe],['white','White',links.white]].forEach(([key,lbl2,url])=>{
if(!url)return;
const b=document.createElement('button');b.textContent=lbl2;b.style.cssText="font-family:'DM Mono',monospace;font-size:10px;padding:6px 10px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;border-radius:2px;";
b.onclick=()=>{
if(activeKey===key){ifr.src='';b.style.background='transparent';b.style.color='var(--muted)';b.style.border='1px solid var(--border)';activeKey=null;return;}
bar.querySelectorAll('button').forEach(b2=>{b2.style.background='transparent';b2.style.color='var(--muted)';b2.style.border='1px solid var(--border)';});
ifr.src=url+'?autoplay=1';b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';activeKey=key;
};
bar.append(b);
});
bar.append(ifr);
document.body.style.paddingBottom='56px';
document.body.append(bar);
});
}

function removeNoiseBar(){
const bar=document.getElementById('noise-bar');
if(bar)bar.remove();
document.body.style.paddingBottom='0';
}

function showTimerBar(){
if(document.getElementById('timer-bar'))return;
const bar=document.createElement('div');bar.id='timer-bar';
bar.style.cssText='position:fixed;top:0;left:0;right:0;background:rgba(15,14,10,0.97);border-bottom:1px solid var(--border);padding:6px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999;cursor:pointer;';
bar.onclick=()=>go('study');
const left=document.createElement('div');left.style.cssText="display:flex;align-items:center;gap:12px;";
const label=document.createElement('span');label.style.cssText="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:2px;color:var(--dim);text-transform:uppercase;";label.textContent='Study Session Active';
const timerSpan=document.createElement('span');timerSpan.id='timer-bar-time';timerSpan.style.cssText="font-family:'DM Mono',monospace;font-size:14px;color:var(--gold);font-weight:700;";timerSpan.textContent='--:--';
const sessionSpan=document.createElement('span');sessionSpan.id='timer-bar-session';sessionSpan.style.cssText="font-family:'DM Mono',monospace;font-size:9px;color:var(--muted);letter-spacing:1px;";sessionSpan.textContent='';
left.append(label,timerSpan,sessionSpan);
const right=document.createElement('span');right.style.cssText="font-family:'DM Mono',monospace;font-size:9px;color:var(--dim);letter-spacing:1px;";right.textContent='tap to return →';
bar.append(left,right);
document.body.style.paddingTop='36px';
document.body.prepend(bar);
// Start updating timer bar every second
window._timerBarInterval=setInterval(updateTimerBar,1000);
updateTimerBar();
}

function updateTimerBar(){
try{
let rem,isB,sess,total;
if(window.pomPlan){
  const plan=window.pomPlan;
  const mt=plan.isBreakMode?plan.breakSec:plan.workSec;
  const elapsed=Math.floor((Date.now()-plan.startedAtTimestamp)/1000);
  rem=Math.max(0,mt-elapsed);
  isB=plan.isBreakMode;sess=plan.currentCycle;total=plan.totalSessions;
}else{
  const saved=localStorage.getItem('pomodoroState');
  if(!saved)return;
  const st=JSON.parse(saved);
  const mt=st.mt||(st.isBreak?(st.cfg?.breakMins||5):(st.cfg?.workMins||25))*60;
  const elapsed=st.segStart?Math.floor((Date.now()-st.segStart)/1000):(st.elapsed||0);
  rem=Math.max(0,mt-elapsed);
  isB=st.isBreak;sess=st.curSess||1;total=st.cfg?.sessions||4;
}
const t=document.getElementById('timer-bar-time');
const s=document.getElementById('timer-bar-session');
if(t){t.textContent=fmtMS(rem);t.style.color=isB?'var(--teal)':'var(--gold)';}
if(s)s.textContent=isB?'BREAK':'FOCUS · Session '+sess+(total?' of '+total:'');
}catch(e){}
}

function removeTimerBar(){
const bar=document.getElementById('timer-bar');
if(bar)bar.remove();
if(window._timerBarInterval)clearInterval(window._timerBarInterval);
document.body.style.paddingTop='0';
}
// ═══════════════════════════════
// STREAK
// ═══════════════════════════════
async function updateStreak(){
  function toYMD(d){return d.toISOString().split('T')[0];}
  function getDayName(d){return['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];}
  // Use local date not UTC
  function todayLocal(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  const todayStr=todayLocal();
  const lastDateStr=S.profile?.last_study_date;
  // Already studied today
  if(lastDateStr===todayStr)return;
  let newStreak;
  if(!lastDateStr){
    newStreak=1;
  }else{
    const restDays=S.profile?.rest_days||[];
    // Build gap days between lastDate and today (exclusive both ends)
    const last=new Date(lastDateStr+'T12:00:00');// noon to avoid DST issues
    const tod=new Date(todayStr+'T12:00:00');
    const gapDays=[];
    const cur=new Date(last);cur.setDate(cur.getDate()+1);
    while(toYMD(cur)<todayStr){gapDays.push(getDayName(new Date(cur)));cur.setDate(cur.getDate()+1);}
    if(gapDays.length===0){
      // lastDate was yesterday
      newStreak=(S.profile.streak_count||0)+1;
    }else if(gapDays.every(d=>restDays.includes(d))){
      // all gap days are rest days — streak continues
      newStreak=(S.profile.streak_count||0)+1;
    }else{
      // streak broken
      newStreak=1;
    }
  }
  await sb.from('profiles').update({streak_count:newStreak,last_study_date:todayStr}).eq('id',S.user.id);
  if(S.profile){S.profile.streak_count=newStreak;S.profile.last_study_date=todayStr;}
}

// ═══════════════════════════════
// GOALS MODAL
// ═══════════════════════════════
function showGoalsModal(){
  const overlay=div({style:{position:'fixed',top:'0',left:'0',right:'0',bottom:'0',background:'rgba(0,0,0,0.85)',zIndex:'9999',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}});
  let currentDaily=S.profile?.study_goals?.daily_hours||4;
  let currentWeekly=S.profile?.study_goals?.weekly_hours||20;
  let topicGoals={...(S.profile?.topic_goals||{})};

  const modal=div({style:{maxWidth:'520px',width:'100%',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',padding:'32px',maxHeight:'90vh',overflowY:'auto'}});
  overlay.append(modal);
  document.body.append(overlay);

  // HEADER
  const headerRow=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}});
  headerRow.append(
    h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',color:'var(--gold)',margin:'0'},html:'Study Goals'}),
    btn('✕','',()=>overlay.remove(),{style:{background:'none',border:'none',color:'var(--dim)',fontSize:'20px',cursor:'pointer',padding:'4px'}})
  );
  modal.append(headerRow);

  // DAILY SLIDER
  const dailyValSpan=h('span',{style:{color:'var(--gold)'},html:currentDaily+'h'});
  const dailyLabelRow=div({style:{fontFamily:"Inter,sans-serif",fontSize:'9px',textTransform:'uppercase',color:'var(--dim)',marginBottom:'4px'}});
  dailyLabelRow.append(document.createTextNode('Daily Goal — '),dailyValSpan);
  const dailySlider=h('input',{type:'range',min:'1',max:'12',value:String(currentDaily),style:{width:'100%',accentColor:'var(--gold)',margin:'8px 0 20px 0'}});
  dailySlider.oninput=e=>{currentDaily=parseInt(e.target.value);dailyValSpan.textContent=currentDaily+'h';};
  modal.append(dailyLabelRow,dailySlider);

  // WEEKLY SLIDER
  const weeklyValSpan=h('span',{style:{color:'var(--gold)'},html:currentWeekly+'h'});
  const weeklyLabelRow=div({style:{fontFamily:"Inter,sans-serif",fontSize:'9px',textTransform:'uppercase',color:'var(--dim)',marginBottom:'4px'}});
  weeklyLabelRow.append(document.createTextNode('Weekly Goal — '),weeklyValSpan);
  const weeklySlider=h('input',{type:'range',min:'5',max:'60',value:String(currentWeekly),style:{width:'100%',accentColor:'var(--gold)',margin:'8px 0 24px 0'}});
  weeklySlider.oninput=e=>{currentWeekly=parseInt(e.target.value);weeklyValSpan.textContent=currentWeekly+'h';};
  modal.append(weeklyLabelRow,weeklySlider);

  // TOPIC GOALS HEADER
  modal.append(
    h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'16px',marginBottom:'2px'},html:'Topic Goals'}),
    h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--dim)',marginBottom:'12px'},html:'track hours per subject'})
  );

  // TOPIC ADD ROW
  const topicInput=inp('e.g. Cardiology');
  topicInput.style.flex='1';
  const topicHoursValSpan=h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--teal)',minWidth:'32px'},html:'5h'});
  const topicSlider=h('input',{type:'range',min:'1',max:'20',value:'5',style:{width:'120px',accentColor:'var(--teal)'}});
  topicSlider.oninput=e=>topicHoursValSpan.textContent=e.target.value+'h';
  const addRow=div({style:{display:'flex',gap:'10px',alignItems:'center',marginBottom:'16px'}});
  addRow.append(
    topicInput,topicSlider,topicHoursValSpan,
    btn('Add','btn-outline',()=>{
      const topic=topicInput.value.trim();
      if(!topic)return;
      topicGoals[topic.toLowerCase()]=parseInt(topicSlider.value);
      topicInput.value='';topicSlider.value='5';topicHoursValSpan.textContent='5h';
      refreshTopicList();
    },{style:{padding:'6px 12px',fontSize:'11px'}})
  );
  modal.append(addRow);

  // TOPIC TAG LIST
  const topicListDiv=div({style:{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'24px'}});
  modal.append(topicListDiv);
  function refreshTopicList(){
    topicListDiv.innerHTML='';
    Object.entries(topicGoals).forEach(([topic,hours])=>{
      const tag=div({style:{border:'1px solid var(--border)',borderRadius:'2px',padding:'6px 12px',display:'flex',alignItems:'center',gap:'8px',background:'var(--card2)'}});
      tag.append(
        h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--text)'},html:topic.charAt(0).toUpperCase()+topic.slice(1)}),
        h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--teal)'},html:hours+'h'}),
        btn('✕','',()=>{delete topicGoals[topic];refreshTopicList();},{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',padding:'0',fontSize:'12px'}})
      );
      topicListDiv.append(tag);
    });
  }
  refreshTopicList();

  // SAVE BUTTON
  const saveMsg=div({style:{textAlign:'center',color:'var(--teal)',marginTop:'12px',fontFamily:"Inter,sans-serif",fontSize:'11px',display:'none'},html:'✓ Saved!'});
  modal.append(
    btn('Save Goals','btn-gold',async()=>{
      const studyGoals={daily_hours:currentDaily,weekly_hours:currentWeekly};
      const{error}=await sb.from('profiles').update({study_goals:studyGoals,topic_goals:topicGoals}).eq('id',S.user.id);
      if(!error){
        if(!S.profile)S.profile={};
        S.profile.study_goals=studyGoals;
        S.profile.topic_goals=topicGoals;
        saveMsg.style.color='var(--teal)';
        saveMsg.innerHTML='✓ Saved!';
        saveMsg.style.display='block';
        setTimeout(async()=>{
          const{data:fresh}=await sb.from('profiles').select('*').eq('id',S.user.id).single();
          if(fresh)S.profile=fresh;
          overlay.remove();
          renderGoalsProgress();
        },800);
      }else{
        saveMsg.style.color='#ff4444';
        saveMsg.innerHTML='✗ Failed: '+error.message;
        saveMsg.style.display='block';
      }
    },{style:{width:'100%'}}),
    saveMsg
  );
}

// ═══════════════════════════════
// GOALS PROGRESS
// ═══════════════════════════════
function renderGoalsProgress(){
  const el=document.getElementById('goals-progress');
  if(!el)return;
  const goals=S.profile?.topic_goals||{};
  const studyGoals=S.profile?.study_goals||{daily_hours:4,weekly_hours:20};
  el.innerHTML='';
  function getLocalDateRange(){
    const now=new Date();
    const start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const end=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
    return{start:start.toISOString(),end:end.toISOString()};
  }
  function getWeekRange(){
    const now=new Date();
    const diff=now.getDay()===0?6:now.getDay()-1;
    const monday=new Date(now);monday.setDate(now.getDate()-diff);monday.setHours(0,0,0,0);
    return{start:monday.toISOString(),end:new Date().toISOString()};
  }
  function formatTime(mins){
    const h=Math.floor(mins/60);const m=mins%60;
    if(h===0)return m+'m';if(m===0)return h+'h';return h+'h '+m+'m';
  }
  const todayRange=getLocalDateRange();const weekRange=getWeekRange();
  sb.from('study_sessions').select('topic,duration_minutes,started_at').eq('user_id',S.user.id).not('ended_at','is',null).then(({data:sessions})=>{
    const list=sessions||[];
    let todayMins=0;let weekMins=0;
    list.forEach(s=>{
      const t=new Date(s.started_at).toISOString();
      if(t>=todayRange.start&&t<todayRange.end)todayMins+=s.duration_minutes||0;
      if(t>=weekRange.start&&t<=weekRange.end)weekMins+=s.duration_minutes||0;
    });
    const dailyGoalMins=(studyGoals.daily_hours||0)*60;
    const weeklyGoalMins=(studyGoals.weekly_hours||0)*60;
    function makeBar(label,actual,goal){
      const pct=Math.min(100,Math.round((actual/goal)*100));
      const color=actual>=goal?'var(--teal)':'var(--gold)';
      const row=div({style:{marginBottom:'14px'}});
      row.append(
        div({style:{display:'flex',justifyContent:'space-between',marginBottom:'4px'}},[
          h('span',{style:{fontFamily:'Inter,sans-serif',fontSize:'12px',color:'var(--text)'},html:label}),
          h('span',{style:{fontFamily:'Inter,sans-serif',fontSize:'12px',color:actual>=goal?'var(--teal)':'var(--gold)'},html:formatTime(actual)+' / '+formatTime(goal)})
        ]),
        div({style:{background:'var(--card2)',borderRadius:'2px',height:'6px',overflow:'hidden'}},[
          div({style:{height:'100%',width:pct+'%',background:color,borderRadius:'2px',transition:'width 0.6s ease'}})
        ])
      );
      return row;
    }
    if(dailyGoalMins>0)el.append(makeBar("Today's Goal",todayMins,dailyGoalMins));
    if(weeklyGoalMins>0)el.append(makeBar("This Week's Goal",weekMins,weeklyGoalMins));
    if((dailyGoalMins>0||weeklyGoalMins>0)&&Object.keys(goals).length){
      el.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'12px 0'}}));
    }
    if(!Object.keys(goals).length&&dailyGoalMins===0&&weeklyGoalMins===0){
      el.innerHTML='<div style="font-size:13px;color:var(--muted);font-family:Inter,sans-serif;padding:8px 0">No goals set. Click Study Goals to add some.</div>';
      return;
    }
    const actual={};
    list.forEach(s=>{
      if(!s.topic)return;
      Object.keys(goals).forEach(goalTopic=>{
        if(s.topic.toLowerCase().includes(goalTopic.toLowerCase())){
          actual[goalTopic]=(actual[goalTopic]||0)+(s.duration_minutes||0);
        }
      });
    });
    Object.entries(goals).forEach(([topic,targetHours])=>{
      const actualHours=Math.round((actual[topic]||0)/60*10)/10;
      const pct=Math.min(100,Math.round((actualHours/targetHours)*100));
      const row=div({style:{marginBottom:'12px'}});
      row.append(
        div({style:{display:'flex',justifyContent:'space-between',marginBottom:'4px'}},[
          h('span',{style:{fontFamily:'Inter,sans-serif',fontSize:'13px',color:'var(--text)'},html:topic.charAt(0).toUpperCase()+topic.slice(1)}),
          h('span',{style:{fontFamily:'Inter,sans-serif',fontSize:'13px',color:'var(--teal)'},html:actualHours+'h / '+targetHours+'h'})
        ]),
        div({style:{background:'var(--card2)',borderRadius:'2px',height:'6px',overflow:'hidden'}},[
          div({style:{height:'100%',width:pct+'%',background:pct>=100?'var(--teal)':'var(--gold)',borderRadius:'2px',transition:'width 0.6s ease'}})
        ])
      );
      el.append(row);
    });
  });
}

// ═══════════════════════════════
// REST DAYS MODAL
// ═══════════════════════════════
function showRestDaysModal(){
  const overlay=div({style:{position:'fixed',top:'0',left:'0',right:'0',bottom:'0',background:'rgba(0,0,0,0.85)',zIndex:'9999',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}});
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  let selectedDays=[...(S.profile?.rest_days||[])];

  const modal=div({style:{maxWidth:'520px',width:'100%',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',padding:'32px',maxHeight:'90vh',overflowY:'auto'}});
  overlay.append(modal);
  document.body.append(overlay);

  // HEADER
  const headerRow=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}});
  headerRow.append(
    h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',color:'var(--gold)',margin:'0'},html:'Rest Days'}),
    btn('✕','',()=>overlay.remove(),{style:{background:'none',border:'none',color:'var(--dim)',fontSize:'20px',cursor:'pointer',padding:'4px'}})
  );
  modal.append(headerRow);

  // DESCRIPTION
  modal.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--muted)',marginBottom:'24px'},html:'Rest days never break your study streak — take a break without losing progress.'}));

  // DAY BUTTONS GRID
  const daysGrid=div({style:{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'8px',marginBottom:'32px'}});
  modal.append(daysGrid);

  function refreshDays(){
    daysGrid.innerHTML='';
    days.forEach(day=>{
      const isSelected=selectedDays.includes(day);
      const dayBtn=div({style:{padding:'10px 4px',fontSize:'12px',fontFamily:"Inter,sans-serif",fontWeight:'500',textAlign:'center',width:'100%',background:isSelected?'var(--gold)':'transparent',color:isSelected?'var(--bg)':'var(--text)',border:isSelected?'1px solid var(--gold)':'1px solid var(--border)',borderRadius:'4px',cursor:'pointer',transition:'all 0.2s'},html:day,onclick:()=>{
        if(selectedDays.includes(day)){selectedDays=selectedDays.filter(d=>d!==day);}
        else{selectedDays.push(day);}
        refreshDays();
      }});
      daysGrid.append(dayBtn);
    });
  }
  refreshDays();

  // SAVE
  const saveMsg=div({style:{textAlign:'center',color:'var(--teal)',marginTop:'12px',fontFamily:"Inter,sans-serif",fontSize:'11px',display:'none'},html:'✓ Saved!'});
  modal.append(
    btn('Save Rest Days','btn-gold',async()=>{
      const{error}=await sb.from('profiles').update({rest_days:selectedDays}).eq('id',S.user.id);
      if(!error){
        if(!S.profile)S.profile={};
        S.profile.rest_days=selectedDays;
        saveMsg.style.display='block';
        setTimeout(()=>overlay.remove(),800);
      }
    },{style:{width:'100%'}}),
    saveMsg
  );
}

// ═══════════════════════════════
// LANDING
// ═══════════════════════════════
function landing(){
const page=div({});
let scrolled=false;
let cfg={video:'',links:{monthly:'#',sixmonth:'#',yearly:'#'},testimonials:[],packages:[]};
const nav=div({cls:'top-nav',id:'tnav'});
nav.append(
div({cls:'logo',html:'Deo Fortis'}),
div({style:{display:'flex',gap:'32px',alignItems:'center'}},[
h('a',{cls:'nav-link',href:'#plans',html:'Plans'}),
h('a',{cls:'nav-link',href:'#tutoring',html:'Tutoring'}),
btn('Log In','btn-outline',()=>go('login'),{style:{padding:'8px 18px'}}),
])
);
window.onscroll=()=>{const s=window.scrollY>60;if(s!==scrolled){scrolled=s;nav.classList.toggle('scrolled',s);}};
page.append(nav);
// HERO
const hero=div({cls:'section fade',style:{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',paddingTop:'140px',position:'relative'}});
const shelf=div({style:{position:'absolute',top:'100px',right:'0',opacity:'.1',display:'flex',alignItems:'flex-end',gap:'3px',borderBottom:'4px solid #3A3020'}});
[{h:160,w:22,c:'#8B4513'},{h:200,w:30,c:'#2F4F4F'},{h:140,w:18,c:'#8B0000'},{h:185,w:26,c:'#4B0082'},{h:220,w:34,c:'#556B2F'},{h:150,w:20,c:'#8B6914'},{h:175,w:28,c:'#1C3A5E'},{h:130,w:16,c:'#6B3A2A'},{h:195,w:24,c:'#2E4A1E'},{h:210,w:32,c:'#4A1942'}].forEach(b=>shelf.append(div({style:{height:b.h+'px',width:b.w+'px',background:b.c,borderRadius:'2px 2px 0 0'}})));
hero.append(shelf);
const hc=div({style:{position:'relative',zIndex:'1'}});
hc.append(
h('span',{cls:'chapter',html:'— A Premium Study Platform —'}),
h('h1',{cls:'big',html:'Study with<br><em class="gold-em">Deo Fortis!</em>'}),
h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'28px 0',maxWidth:'480px'}}),
h('p',{cls:'muted',style:{fontSize:'16px',lineHeight:'1.8',maxWidth:'520px'},html:'A structured, evidence-based study system built for students who are done making excuses and ready to actually retain what they learn.'})
);
const hbtns=div({style:{display:'flex',gap:'16px',marginTop:'32px',flexWrap:'wrap',alignItems:'center'}});
hbtns.append(h('a',{cls:'btn btn-gold',href:'#plans',html:'View Plans →'}));
const vbtn=div({style:{display:'inline-flex',alignItems:'center',gap:'10px',padding:'12px 24px',border:'1px solid var(--border)',borderRadius:'2px',fontFamily:"Inter,sans-serif",fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)',cursor:'pointer'}});
vbtn.append(div({style:{width:'24px',height:'24px',borderRadius:'50%',border:'1px solid var(--dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'var(--gold)',html:'▶'}}),document.createTextNode('Watch Demo (Optional)'));
vbtn.onclick=()=>showVidModal(cfg.video);
hbtns.append(vbtn);
hc.append(hbtns);
const stats=div({style:{display:'flex',gap:'48px',marginTop:'56px',flexWrap:'wrap'}});
[['3','Recall Formats'],['100%','Full Access'],['∞','Sessions']].forEach(([n,l])=>{
const s=div({style:{borderLeft:'2px solid var(--border)',paddingLeft:'16px'}});
s.append(div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'36px',color:'var(--gold)',lineHeight:'1',fontWeight:'700'},html:n}),div({cls:'mono',style:{marginTop:'6px'},html:l}));
stats.append(s);
});
hc.append(stats);
hero.append(hc);
page.append(hero);
const features=['Full Pomodoro System','Active Recall Engine (Theory, Anki, Vignette)','Request Recall Sessions Anytime','Personalised Study Timetable','Clock In / Clock Out Tracking','Leaderboard Access','Community Access','Accountability System','Admin-Curated Content','Study Analytics'];
// PLANS
const plansSection=div({cls:'section',id:'plans'});
plansSection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter I — Enrolment'}),h('h2',{cls:'big',style:{marginBottom:'12px'},html:'Choose Your<br><em class="gold-em">Duration</em>'}),h('p',{cls:'muted',style:{maxWidth:'500px',fontSize:'15px',marginBottom:'8px'},html:'Every plan includes the full platform. You are simply choosing how long your access lasts.'}),div({cls:'quote',style:{maxWidth:'480px',marginBottom:'40px',marginTop:'24px'},html:'"The longer you commit, the less you pay per month."'}));
const plansGrid=div({cls:'grid-auto',id:'plans-grid'});
const planDefs=[{name:'Monthly',price:'$10',period:'/ month',dur:'1 Month',color:'var(--gold)',key:'monthly'},{name:'6 Months',price:'$39',period:'/ 6 months',dur:'6 Months',color:'var(--teal)',popular:true,key:'sixmonth'},{name:'1 Year',price:'$59',period:'/ year',dur:'12 Months',color:'var(--purple)',key:'yearly'}];
planDefs.forEach(plan=>{
const card=div({cls:'plan-card',style:{borderColor:plan.popular?plan.color+'55':'var(--border)',borderTopWidth:plan.popular?'3px':'1px',borderTopColor:plan.popular?plan.color:'var(--border)'}});
if(plan.popular)card.append(div({cls:'popular-tag',html:'Best Value'}));
card.append(div({cls:'mono',style:{marginBottom:'8px',marginTop:plan.popular?'16px':'0'},html:plan.name}));
card.append(div({style:{display:'flex',alignItems:'baseline',gap:'6px',marginBottom:'4px'}},[h('span',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'52px',color:plan.color,lineHeight:'1',fontWeight:'700'},html:plan.price}),h('span',{style:{fontSize:'14px',color:'var(--dim)',fontWeight:'300'},html:plan.period})]));
card.append(div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:plan.color,letterSpacing:'1px',marginBottom:'24px',opacity:'.8'},html:plan.dur+' of full access'}));
card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',marginBottom:'20px'}}));
const fl=div({style:{marginBottom:'28px'}});
features.forEach(f=>{const item=div({cls:'check-item'});item.append(h('span',{style:{color:plan.color,fontSize:'12px',marginTop:'2px',flexShrink:'0'},html:'✦'}),h('span',{},[f]));fl.append(item);});
card.append(fl);
const eb=h('a',{cls:'btn btn-gold',style:{background:plan.color,color:'#0F0E0A',width:'100%',textAlign:'center',display:'block'},html:'Enrol — '+plan.price,id:'enrol-'+plan.key});
eb.href='#';
eb.onclick=e=>{e.preventDefault();showEnrolModal(plan,cfg.links[plan.key]||'#');};
card.append(eb);
card.append(h('p',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)',textAlign:'center',marginTop:'12px',letterSpacing:'1px',textTransform:'uppercase'},html:'Approval required · Payment via Selar'}));
plansGrid.append(card);
});
plansSection.append(plansGrid);
// FREE TIER OPTION
const freeSection=div({style:{textAlign:'center',marginTop:'8px',paddingBottom:'16px'}});
freeSection.append(
  h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'32px 0'}}),
  h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',fontStyle:'italic',color:'var(--muted)',marginBottom:'8px'},html:'Or start for free'}),
  h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',marginBottom:'20px'},html:'Pomodoro timer + white noise. No credit card needed.'}),
  btn('Start Free →','btn-outline',()=>{localStorage.setItem('signupType','free');go('signup');},{style:{padding:'12px 32px',fontSize:'13px'}})
);
plansSection.append(freeSection);
page.append(plansSection);
// TUTORING
const tutSection=div({cls:'section',id:'tutoring'});
tutSection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter II — Personal Tutoring'}),h('h2',{cls:'big',style:{marginBottom:'12px'},html:'Work With Our<br><em class="gold-em">Tutors</em>'}),h('p',{cls:'muted',style:{maxWidth:'500px',fontSize:'15px',marginBottom:'8px'},html:"Book a session with one of our tutors — we'll work through it with you at your pace."}),div({cls:'quote',style:{maxWidth:'480px',marginBottom:'40px',marginTop:'24px'},html:'"The right guidance at the right time changes everything."'}));
tutSection.append(div({cls:'grid-auto',id:'pkg-grid'}));
page.append(tutSection);
// WHY
const whySection=div({cls:'section',id:'why'});
whySection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter III — The Method'}),h('h2',{cls:'big',style:{marginBottom:'12px'},html:"What You'll<br><em class='gold-em'>Actually Get</em>"}),h('p',{cls:'muted',style:{maxWidth:'520px',fontSize:'15px',marginBottom:'40px'},html:'This is not a list of features. This is a study system built for results.'}));
const rg=div({cls:'grid-auto'});
[{icon:' ',title:'Pomodoro Technique',desc:'Structured sessions built around proven time management. Work hard, rest smart, repeat.'},{icon:' ',title:'Active Recall Sessions',desc:'Request a recall session anytime. Theory, Anki-style, or vignette — you choose the format.'},{icon:' ',title:'Study Timetable',desc:'Get a personalised follow-up timetable built around your goals and weak areas.'},{icon:' ',title:'Leaderboard',desc:'Compete with other students. Rankings based on real study hours logged.'},{icon:' ',title:'Community',desc:'You are not studying alone. Be part of a group that holds each other accountable.'},{icon:' ',title:'Accountability',desc:'Clock in. Clock out. Your real study hours tracked. No lying to yourself.'}].forEach(r=>{
const card=div({cls:'reason-card'});
card.append(div({style:{fontSize:'28px',marginBottom:'14px'},html:r.icon}),h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:'600',fontSize:'17px',marginBottom:'8px',color:'var(--text)'},html:r.title}),h('p',{style:{fontSize:'14px',color:'#6A6050',lineHeight:'1.7',fontWeight:'300'},html:r.desc}));
rg.append(card);
});
whySection.append(rg);
page.append(whySection);

// FEYNMAN ARENA SECTION
const feynmanSection=div({cls:'section',id:'feynman-landing'});
feynmanSection.append(
  div({cls:'divider'}),
  h('br'),
  h('span',{cls:'chapter',html:'Chapter IV — The Feynman Method'}),
  h('h2',{cls:'big',style:{marginBottom:'12px'},html:"If You Can Teach It,<br><em class='gold-em'>You Know It.</em>"}),
  h('p',{cls:'muted',style:{maxWidth:'560px',fontSize:'15px',lineHeight:'1.8',marginBottom:'40px'},html:"The Feynman Technique is the most powerful learning method in existence. If you can explain a concept to a 6 year old in plain language — no jargon, no shortcuts — you truly understand it. Deo Fortis puts this at the centre of how you study."})
);
const feynmanGrid=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'20px',marginTop:'8px'}});
[
  {title:'Submit Your Explanation',desc:'Write or speak your Feynman explanation for any topic. Our tutors review every submission — the best ones are crowned 👑 King of the Week.',accent:'var(--gold)'},
  {title:'Wall of Fame',desc:'Top explanations are published on the Wall of Fame. Your peers learn from you. You earn points. Everyone wins.',accent:'var(--teal)'},
  {title:'Voice to Text',desc:'Can\'t type fast enough? Use our built-in voice recognition to dictate your explanation in real time. Just speak and it transcribes.',accent:'var(--purple)'}
].forEach(item=>{
  const card=div({cls:'reason-card'});
  card.append(
    div({style:{width:'3px',height:'32px',background:item.accent,borderRadius:'2px',marginBottom:'16px'}}),
    h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:'600',fontSize:'17px',marginBottom:'8px',color:'var(--text)'},html:item.title}),
    h('p',{style:{fontSize:'14px',color:'#6A6050',lineHeight:'1.7',fontWeight:'300'},html:item.desc})
  );
  feynmanGrid.append(card);
});
feynmanSection.append(feynmanGrid);
feynmanSection.append(div({style:{marginTop:'40px',padding:'32px',border:'1px solid var(--border)',borderLeft:'4px solid var(--gold)',borderRadius:'4px',background:'#131209',maxWidth:'680px'}},[
  h('div',{style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'20px',color:'var(--gold)',marginBottom:'8px'},html:'"If you cannot explain it simply, you do not understand it well enough."'}),
  h('div',{style:{fontSize:'12px',color:'var(--dim)',letterSpacing:'1px',textTransform:'uppercase'},html:'— Richard Feynman'})
]));
page.append(feynmanSection);

// GAMIFIED LEARNING SECTION
const gameSection=div({cls:'section',id:'gamified'});
gameSection.append(
  div({cls:'divider'}),
  h('br'),
  h('span',{cls:'chapter',html:'Chapter V — Gamified Learning'}),
  h('h2',{cls:'big',style:{marginBottom:'4px'},html:"Medicine While<br><em class='gold-em'>Having Fun.</em>"}),
  h('p',{cls:'muted',style:{maxWidth:'520px',fontSize:'15px',lineHeight:'1.8',marginBottom:'40px'},html:"Who said studying medicine had to be painful? We built game mechanics into the platform so you stay sharp, stay motivated, and actually enjoy the process."})
);
const gameGrid=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'24px'}});
[
  {
    tag:'Riddle Decks',
    title:'Can You Crack It?',
    desc:'Medical riddles presented as gamified decks. Each level harder than the last. Complete a deck, unlock the next. Score 65% or above to pass — below that, you go again.',
    detail:'Test your diagnostic reasoning without memorising facts. If you know your stuff, the answer clicks. If you don\'t — you\'ll know exactly what to study next.',
    accent:'var(--teal)'
  },
  {
    tag:'Emoji Bitz',
    title:'Diagnose the Emoji.',
    desc:'A condition described entirely in emojis. Your job? Name it. Fast. Fun. Surprisingly effective at locking in clinical presentations.',
    detail:'🤒🫁💊 = Pneumonia. Simple concept. Powerful memory hook. Students consistently report Emoji Bitz as their favourite feature on the platform.',
    accent:'var(--purple)'
  }
].forEach(item=>{
  const card=div({cls:'reason-card',style:{borderTop:'3px solid '+item.accent}});
  card.append(
    div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'10px',fontWeight:'700',letterSpacing:'2px',textTransform:'uppercase',color:item.accent,marginBottom:'12px'}},[ item.tag]),
    h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:'700',fontSize:'22px',marginBottom:'12px',color:'var(--text)',lineHeight:'1.2'},html:item.title}),
    h('p',{style:{fontSize:'14px',color:'var(--muted)',lineHeight:'1.7',marginBottom:'16px',fontWeight:'400'},html:item.desc}),
    h('p',{style:{fontSize:'13px',color:'#6A6050',lineHeight:'1.7',fontWeight:'300'},html:item.detail})
  );
  gameGrid.append(card);
});
gameSection.append(gameGrid);
page.append(gameSection);

// TESTIMONIALS
const tsSection=div({cls:'section',id:'ts-section',style:{display:'none'}});
tsSection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter IV — Results'}),h('h2',{cls:'big',style:{marginBottom:'40px'},html:"What Students<br><em class='gold-em'>Are Saying</em>"}),div({cls:'grid-auto',id:'ts-grid'}));
page.append(tsSection);
// HOW
const howSection=div({cls:'section'});
howSection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter V — The Process'}),h('h2',{cls:'big',style:{marginBottom:'40px'},html:"How to<br><em class='gold-em'>Get Started</em>"}));
const hg=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',borderTop:'1px solid var(--border)',borderLeft:'1px solid var(--border)'}});
[{num:'I',title:'Choose a Plan',desc:'Pick the duration that works for you.'},{num:'II',title:'Pay via Selar',desc:'Complete your payment securely. Takes about 2 minutes.'},{num:'III',title:'Get Approved',desc:'Your payment is verified and account approved.'},{num:'IV',title:'Begin Studying',desc:'Log in and start your first session.'}].forEach(step=>{
const s=div({style:{padding:'32px 28px',borderRight:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}});
s.append(div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontStyle:'italic',fontSize:'48px',color:'var(--border)',lineHeight:'1',marginBottom:'16px'},html:step.num}),h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'17px',color:'var(--text)',marginBottom:'8px',fontWeight:'600'},html:step.title}),h('p',{style:{fontSize:'14px',color:'#6A6050',lineHeight:'1.7',fontWeight:'300'},html:step.desc}));
hg.append(s);
});
howSection.append(hg);
page.append(howSection);
// FOOTER
const footer=div({style:{borderTop:'1px solid var(--border)',padding:'48px',textAlign:'center'}});
footer.append(div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontStyle:'italic',fontSize:'28px',color:'var(--gold)',marginBottom:'10px'},html:'Deo Fortis'}),div({style:{color:'var(--gold)',opacity:'.4',letterSpacing:'8px',marginBottom:'12px'},html:'✦ ✦ ✦'}),h('p',{style:{fontSize:'14px',color:'var(--dim)',fontWeight:'300'},html:'Study with purpose. Results follow.'}),btn('Admin','',()=>go('admin'),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'11px',marginTop:'24px',fontFamily:"Inter,sans-serif",letterSpacing:'2px',textTransform:'uppercase'}}));
page.append(footer);
// Load data
(async()=>{
const{data:s}=await sb.from('admin_settings').select('*').single();
if(s){cfg.video=s.video_url||'';cfg.links={monthly:s.link_monthly||'#',sixmonth:s.link_sixmonth||'#',yearly:s.link_yearly||'#'};
planDefs.forEach(p=>{const b=document.getElementById('enrol-'+p.key);if(b)b.href=cfg.links[p.key]||'#';});
}
const{data:pkgs}=await sb.from('tutoring_packages').select('*').order('id');
const pg=document.getElementById('pkg-grid');
if(pg&&pkgs&&pkgs.length&&!pkgsLoaded){pkgsLoaded=true;pkgs.forEach((pkg,i)=>{
const card=div({cls:'plan-card',style:{borderTopWidth:'3px',borderTopColor:i===0?'var(--gold)':'var(--purple)',borderColor:i===0?'#C8A96E33':'#A89BC833'}});
card.append(div({cls:'mono',style:{marginBottom:'8px'},html:pkg.name}),div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'48px',color:i===0?'var(--gold)':'var(--purple)',lineHeight:'1',fontWeight:'700',marginBottom:'8px'},html:pkg.price}),div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:i===0?'var(--gold)':'var(--purple)',letterSpacing:'1px',marginBottom:'24px',opacity:'.8'},html:pkg.sessions}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',marginBottom:'20px'}}));
const fl=div({style:{marginBottom:'28px'}});
(pkg.features||'').split(',').forEach(f=>{const item=div({cls:'check-item'});item.append(h('span',{style:{color:i===0?'var(--gold)':'var(--purple)',fontSize:'12px',flexShrink:'0'},html:'✦'}),h('span',{},[f.trim()]));fl.append(item);});
card.append(fl);
const ab=h('a',{cls:'btn',style:{background:i===0?'var(--gold)':'var(--purple)',color:'#0F0E0A',width:'100%',textAlign:'center',display:'block'},html:'Book — '+pkg.price});
ab.href=pkg.selar_link||'#';ab.target='_blank';
card.append(ab,h('p',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)',textAlign:'center',marginTop:'12px',letterSpacing:'1px',textTransform:'uppercase'},html:'Includes study portal access'}));
pg.append(card);
});
// Custom session card
if(pg){
const customCard=div({cls:'plan-card',style:{borderTopWidth:'3px',borderTopColor:'var(--gold)',borderColor:'#C8A96E33'}});
customCard.append(
div({cls:'mono',style:{marginBottom:'8px'},html:'Custom Session'}),
div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'48px',color:'var(--gold)',lineHeight:'1',fontWeight:'700',marginBottom:'8px'},html:'$15'}),
div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--gold)',letterSpacing:'1px',marginBottom:'24px',opacity:'.8'},html:'per session'}),
h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',marginBottom:'20px'}}),
h('p',{style:{fontSize:'14px',color:'var(--muted)',lineHeight:'1.8',marginBottom:'28px'},html:"Need help with a specific topic, your study timetable, or just not sure where to start? Book a single session with one of our tutors — we'll figure it out together. No commitment, no package required."})
);
const customBtn=h('a',{cls:'btn',style:{background:'var(--gold)',color:'#0F0E0A',width:'100%',textAlign:'center',display:'block'},html:'Book a Session — $15',id:'custom-session-btn'});
customBtn.href=s?.link_custom||'#';customBtn.target='_blank';
customCard.append(customBtn,h('p',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)',textAlign:'center',marginTop:'12px',letterSpacing:'1px',textTransform:'uppercase'},html:'One session · No commitment'}));
pg.append(customCard);
}}
const{data:ts}=await sb.from('testimonials').select('*').order('created_at',{ascending:false});
const tss=document.getElementById('ts-section');
const tsg=document.getElementById('ts-grid');
if(ts&&ts.length&&tss&&tsg){tss.style.display='block';ts.forEach(t=>{const c=div({cls:'card'});c.append(div({style:{fontSize:'24px',color:'var(--gold)',marginBottom:'16px',opacity:'.6'},html:'"'}),h('p',{style:{fontSize:'15px',color:'var(--muted)',lineHeight:'1.8',marginBottom:'20px',fontStyle:'italic',fontWeight:'300'},html:t.content}),div({style:{borderTop:'1px solid var(--border)',paddingTop:'16px'}},[div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'15px',color:'var(--text)',fontWeight:'600'},html:t.name}),t.title?div({cls:'mono',style:{marginTop:'4px'},html:t.title}):null].filter(Boolean)));tsg.append(c);});}
})();
return page;
}
function showEnrolModal(plan, selarLink){
const ov=div({cls:'modal-bg'});
ov.onclick=e=>{if(e.target===ov)ov.remove();};
const box=div({cls:'card',style:{maxWidth:'480px',width:'100%',maxHeight:'90vh',overflowY:'auto'}});
const errEl=div({cls:'err hidden'});
const nameI=inp('Your full name');
const emailI=inp('your@email.com','email');
const passI=inp('Min. 6 characters','password');
const pass2I=inp('Confirm password','password');
function wrapWithEye(inputEl){
  const wrapper=div({style:{position:'relative',display:'flex',alignItems:'center'}});
  inputEl.style.flex='1';
  inputEl.style.paddingRight='44px';
  const toggleBtn=h('button',{style:{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'14px',padding:'4px 8px'}},[document.createTextNode('👁')]);
  let isVisible=false;
  toggleBtn.onclick=()=>{
    isVisible=!isVisible;
    inputEl.type=isVisible?'text':'password';
    toggleBtn.innerHTML=isVisible?'👁‍🗨':'👁';
  };
  wrapper.append(inputEl,toggleBtn);
  return wrapper;
}
const wrappedPass=wrapWithEye(passI);
const wrappedPass2=wrapWithEye(pass2I);
const badge=div({style:{background:plan.color,color:'#0F0E0A',borderRadius:'4px',padding:'12px 16px',marginBottom:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}});
badge.append(div({},[div({style:{fontFamily:"Inter,sans-serif",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'4px'},html:'Selected Plan'}),div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'20px',fontWeight:'700'},html:plan.name+' — '+plan.price})]),div({style:{fontFamily:"Inter,sans-serif",fontSize:'10px',letterSpacing:'1px'},html:plan.dur+' access'}));
const submitBtn=btn('Create Account & Pay','btn-gold',async()=>{
errEl.classList.add('hidden');
if(!nameI.value||!emailI.value||!passI.value){errEl.classList.remove('hidden');errEl.textContent='Please fill in all fields.';return;}
if(passI.value.length<6){errEl.classList.remove('hidden');errEl.textContent='Password must be at least 6 characters.';return;}
if(passI.value!==pass2I.value){errEl.classList.remove('hidden');errEl.textContent='Passwords do not match.';return;}
const nameVal=nameI.value.trim();
const emailVal=emailI.value.trim();
const passVal=passI.value;
submitBtn.textContent='Creating Account...';submitBtn.disabled=true;
const{data,error}=await sb.auth.signUp({email:emailVal,password:passVal,options:{data:{full_name:nameVal,plan:plan.name}}});
if(error){errEl.classList.remove('hidden');errEl.textContent=error.message;submitBtn.textContent='Create Account & Pay';submitBtn.disabled=false;return;}
sendAdminEmail('New Signup — Deo Fortis','<h2>New Student Signed Up</h2><p><b>Name:</b> '+nameVal+'</p><p><b>Email:</b> '+emailVal+'</p><p><b>Plan:</b> '+plan.name+'</p>');
ov.remove();
window.open(selarLink,'_blank');
showSignupSuccess(nameVal,selarLink);
},{style:{width:'100%',padding:'16px',marginTop:'8px'}});
box.append(div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}},[h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px'},html:'Create Account'}),btn('x','',()=>ov.remove(),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'18px',cursor:'pointer'}})]),badge,errEl,field('Full Name',nameI),field('Email',emailI),field('Password',wrappedPass),field('Confirm Password',wrappedPass2),submitBtn,h('p',{style:{fontSize:'12px',color:'var(--dim)',textAlign:'center',marginTop:'12px',fontFamily:"Inter,sans-serif",letterSpacing:'1px'},html:'You will be redirected to Selar to complete payment'}),h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'12px'},html:'Already have an account? <button onclick="go(\'login\')" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px">Log in</button>'}));
ov.append(box);document.body.append(ov);
}
function showSignupSuccess(name,selarLink){
const ov=div({cls:'modal-bg'});
const box=div({cls:'card',style:{maxWidth:'440px',width:'100%',textAlign:'center'}});
box.append(div({style:{fontSize:'48px',marginBottom:'16px'},html:' '}),h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',marginBottom:'12px'},html:'Account Created!'}),h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.8',marginBottom:'24px'},html:'Hi '+name+'! Complete your payment on Selar to get approved and gain full access.'}),h('a',{cls:'btn btn-gold',style:{display:'block',textAlign:'center',marginBottom:'12px'},href:selarLink,target:'_blank',html:'Complete Payment on Selar →'}),h('p',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'16px'},html:"You'll be approved as soon as your payment is verified"}),btn('Log In After Paying','btn-outline',()=>{ov.remove();go('login');},{style:{marginTop:'16px',width:'100%'}}));
ov.append(box);document.body.append(ov);
}
function showVidModal(url){
const ov=div({cls:'modal-bg'});
ov.onclick=e=>{if(e.target===ov)ov.remove();};
const box=div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',width:'100%',maxWidth:'720px',overflow:'hidden'}});
const hdr=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',borderBottom:'1px solid var(--border)'}});
hdr.append(h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)'},html:'Platform Demo'}),btn('✕','',()=>ov.remove(),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'18px'}}));
const va=div({style:{aspectRatio:'16/9',background:'#000',display:'flex',alignItems:'center',justifyContent:'center'}});
if(url){const ifr=h('iframe',{src:url,style:{width:'100%',height:'100%',border:'none'},allowFullscreen:true});va.append(ifr);}
else va.append(h('p',{style:{fontFamily:"Inter,sans-serif",color:'var(--dim)',fontSize:'11px',letterSpacing:'2px'},html:'VIDEO NOT UPLOADED YET'}));
box.append(hdr,va);ov.append(box);document.body.append(ov);
}
// ═══════════════════════════════
// SIGNUP
// ═══════════════════════════════
function signup(){
const page=div({cls:'center',style:{minHeight:'100vh',padding:'24px'}});
let sel=null;
try{const s=sessionStorage.getItem('selPlan');if(s)sel=JSON.parse(s);}catch(e){}
let payLinks={monthly:'#',sixmonth:'#',yearly:'#'};
sb.from('admin_settings').select('link_monthly,link_sixmonth,link_yearly').single().then(({data})=>{if(data)payLinks={monthly:data.link_monthly||'#',sixmonth:data.link_sixmonth||'#',yearly:data.link_yearly||'#'};});
const wrap=div({cls:'fade',style:{width:'100%',maxWidth:'560px'}});
const fc=div({cls:'card',style:{marginBottom:'20px'}});
fc.append(
h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'4px'},html:'Deo Fortis'}),
h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),
h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',marginBottom:'4px'},html:'Create Account'}),
h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'20px'},html:'Fill in your details to get started.'})
);
if(sel){
const badge=div({style:{borderRadius:'4px',padding:'12px 16px',marginBottom:'16px',display:'flex',justifyContent:'space-between',alignItems:'center',background:sel.color,color:'#0F0E0A'}});
const bl=div({});bl.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'4px'},html:'Selected Plan'}),h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'20px',fontWeight:'700'},html:sel.name+' — '+sel.price}));
badge.append(bl,h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px'},html:sel.dur+' access'}));fc.append(badge);
}
const errEl=div({cls:'err hidden',id:'su-err'});fc.append(errEl);
// All inputs use unique IDs for reliable value capture
const nameInput=document.createElement('input');nameInput.id='su-name';nameInput.type='text';nameInput.placeholder='Your full name';nameInput.style.cssText='width:100%;background:var(--bg);border:1px solid var(--border);border-radius:2px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;box-sizing:border-box;font-family:Georgia,serif;';
const emailInput=document.createElement('input');emailInput.id='su-email';emailInput.type='email';emailInput.placeholder='your@email.com';emailInput.style.cssText=nameInput.style.cssText;
const passInput=document.createElement('input');passInput.id='su-pass';passInput.type='password';passInput.placeholder='Min. 6 characters';passInput.style.cssText=nameInput.style.cssText;
const pass2Input=document.createElement('input');pass2Input.id='su-pass2';pass2Input.type='password';pass2Input.placeholder='Confirm your password';pass2Input.style.cssText=nameInput.style.cssText;
function wrapWithEye(inputEl){
  const wrapper=div({style:{position:'relative'}});
  inputEl.style.paddingRight='50px';
  const toggleBtn=h('button',{style:{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'14px',padding:'4px 8px'}},[document.createTextNode('👁')]);
  let isVisible=false;
  toggleBtn.onclick=()=>{
    isVisible=!isVisible;
    inputEl.type=isVisible?'text':'password';
    toggleBtn.innerHTML=isVisible?'👁‍🗨':'👁';
  };
  wrapper.append(inputEl,toggleBtn);
  return wrapper;
}
const wrappedPass=wrapWithEye(passInput);
const wrappedPass2=wrapWithEye(pass2Input);
function wrapField(labelText,inputWrapper){const w=div({style:{marginBottom:'16px'}});const l=h('label',{cls:'label',html:labelText});w.append(l,inputWrapper);return w;}
fc.append(wrapField('Full Name',nameInput),wrapField('Email',emailInput),wrapField('Password',wrappedPass),wrapField('Confirm Password',wrappedPass2));
const submitBtn=document.createElement('button');
submitBtn.style.cssText='width:100%;padding:16px;font-family:"DM Mono",monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border:none;border-radius:2px;background:var(--gold);color:#0F0E0A;margin-top:8px;';
submitBtn.textContent=sel?'Create Account — '+sel.price:'Create Account';
submitBtn.onclick=async function(){
const nameVal=document.getElementById('su-name').value.trim();
const emailVal=document.getElementById('su-email').value.trim();
const passVal=document.getElementById('su-pass').value;
const pass2Val=document.getElementById('su-pass2').value;
const errBox=document.getElementById('su-err');
errBox.classList.add('hidden');
if(!nameVal){errBox.classList.remove('hidden');errBox.textContent='Please enter your full name.';return;}
if(!emailVal){errBox.classList.remove('hidden');errBox.textContent='Please enter your email.';return;}
if(!passVal||passVal.length<6){errBox.classList.remove('hidden');errBox.textContent='Password must be at least 6 characters.';return;}
if(passVal!==pass2Val){errBox.classList.remove('hidden');errBox.textContent='Passwords do not match.';return;}
submitBtn.textContent='Creating Account...';submitBtn.disabled=true;
try{
signingUp=true;
const{data,error}=await sb.auth.signUp({email:emailVal,password:passVal,options:{data:{full_name:nameVal}}});
if(error){
signingUp=false;
if(error.message.toLowerCase().includes('already registered')||error.message.toLowerCase().includes('already exists')){
  if(!sel){errBox.classList.remove('hidden');errBox.textContent='Account already exists. Please select a plan to upgrade.';submitBtn.textContent='Create Account';submitBtn.disabled=false;return;}
  const{data:existingProfile}=await sb.from('profiles').select('id').eq('email',emailVal).single();
  if(existingProfile){await sb.from('profiles').update({plan:sel.name,status:'pending'}).eq('id',existingProfile.id);}
  const link=sel?(payLinks[sel.key]||sel.link||'#'):'#';
  if(link&&link!=='#')window.open(link,'_blank');
  wrap.innerHTML='';
  const dc=div({cls:'card',style:{textAlign:'center'}});
  dc.append(
    h('div',{style:{fontSize:'48px',marginBottom:'16px'},html:'👑'}),
    h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',marginBottom:'12px'},html:'Complete Your Upgrade'}),
    h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.8',marginBottom:'24px'},html:'Your payment link has opened. Once payment is confirmed your account will be upgraded to full access.'}),
    h('p',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'16px'},html:"You'll be upgraded as soon as your payment is verified"}),
    btn('Log In','btn-outline',()=>go('login'),{style:{marginTop:'16px',width:'100%'}})
  );
  wrap.append(dc);
  return;
}
errBox.classList.remove('hidden');errBox.textContent=error.message;submitBtn.textContent=sel?'Create Account — '+sel.price:'Create Account';submitBtn.disabled=false;return;
}
if(data&&data.user){
const isFreeSignup=localStorage.getItem('signupType')==='free';
const profileData={id:data.user.id,email:emailVal,full_name:nameVal,status:isFreeSignup?'approved':'pending',is_free_tier:isFreeSignup?true:false};
if(sel)profileData.plan=sel.name;
await new Promise(r=>setTimeout(r,1000));
await sb.from('profiles').upsert(profileData,{onConflict:'id'});
localStorage.removeItem('signupType');
if(isFreeSignup){
sendAdminEmail('New Free Signup — Deo Fortis','<h2>New Free Student</h2><p>Name: '+nameVal+'</p><p>Email: '+emailVal+'</p>');
S.user=data.user;
S.profile={
  id:data.user.id,
  email:emailVal,
  full_name:nameVal,
  status:'approved',
  is_free_tier:true,
  plan:sel?sel.name:null,
  total_points:0,
  total_study_minutes:0,
  streak_count:0,
  total_anki_sessions:0,
  study_goals:{daily_hours:4,weekly_hours:20},
  topic_goals:{},
  rest_days:[]
};
signingUp=false;
go('dashboard');
return;
}
sendAdminEmail('New Signup — Deo Fortis','<h2>New Student</h2><p>Name: '+nameVal+'</p><p>Email: '+emailVal+'</p><p>Plan: '+(sel?sel.name:'None')+'</p>');
signingUp=false;
sessionStorage.removeItem('selPlan');
const link=sel?(payLinks[sel.key]||sel.link||'#'):'#';
if(link&&link!=='#')window.open(link,'_blank');
wrap.innerHTML='';
const dc=div({cls:'card',style:{textAlign:'center'}});
dc.append(h('div',{style:{fontSize:'48px',marginBottom:'16px'},html:' '}),h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'16px'},html:'Deo Fortis'}),h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',marginBottom:'12px'},html:'Account Created!'}),h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.8',marginBottom:'24px'},html:'Hi '+nameVal+'! Complete your payment to get approved.'}));
if(link&&link!=='#'){const payBtn=document.createElement('a');payBtn.href=link;payBtn.target='_blank';payBtn.textContent='Complete Payment '+(sel?'— '+sel.price:'')+' →';payBtn.style.cssText='display:block;text-align:center;padding:12px 28px;font-family:"DM Mono",monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;background:var(--gold);color:#0F0E0A;text-decoration:none;border-radius:2px;margin-bottom:12px;';dc.append(payBtn);}
dc.append(h('p',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'16px'},html:"You'll be approved as soon as your payment is verified"}));
const lb=btn('Log In After Paying','btn-outline',()=>go('login'),{style:{marginTop:'16px',width:'100%'}});dc.append(lb);wrap.append(dc);
}
}catch(e){const eb2=document.getElementById('su-err');if(eb2){eb2.classList.remove('hidden');eb2.textContent='Something went wrong. Please try again.';}submitBtn.textContent=sel?'Create Account — '+sel.price:'Create Account';submitBtn.disabled=false;}
};
fc.append(submitBtn);wrap.append(fc);
const isFreeSig=localStorage.getItem('signupType')==='free';
if(!sel&&!isFreeSig){
const ps=div({style:{marginBottom:'20px'}});
ps.append(h('p',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',marginBottom:'16px'},html:'Select Your Plan'}));
const pl=div({style:{display:'grid',gap:'12px'}});
let links2={monthly:'#',sixmonth:'#',yearly:'#'};
sb.from('admin_settings').select('*').single().then(({data})=>{if(data)links2={monthly:data.link_monthly||'#',sixmonth:data.link_sixmonth||'#',yearly:data.link_yearly||'#'};});
[{name:'Monthly',price:'$10',period:'/ month',dur:'1 Month',color:'var(--gold)',key:'monthly'},{name:'6 Months',price:'$39',period:'/ 6 months',dur:'6 Months',color:'var(--teal)',popular:true,key:'sixmonth'},{name:'1 Year',price:'$59',period:'/ year',dur:'12 Months',color:'var(--purple)',key:'yearly'}].forEach(plan=>{
const card=div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',padding:'20px 24px',cursor:'pointer',transition:'all .2s',position:'relative'},id:'pc-'+plan.key});
if(plan.popular)card.append(h('span',{style:{position:'absolute',top:'-1px',right:'16px',background:'var(--teal)',color:'#0F0E0A',fontFamily:"Inter,sans-serif",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',padding:'3px 10px',borderRadius:'0 0 4px 4px'},html:'Best Value'}));
const row=div({style:{display:'flex',alignItems:'center',justifyContent:'space-between'}});
const left=div({});left.append(h('div',{cls:'mono',style:{marginBottom:'4px'},html:plan.name}),h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'28px',color:plan.color,fontWeight:'700',lineHeight:'1'},html:plan.price+' <span style="font-size:13px;color:var(--dim);font-weight:300">'+plan.period+'</span>'}));
const radio=div({style:{width:'22px',height:'22px',borderRadius:'50%',border:'2px solid var(--border)',flexShrink:'0'}});radio.id='pr-'+plan.key;row.append(left,radio);card.append(row,h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:plan.color,letterSpacing:'1px',marginTop:'6px',opacity:'.7'},html:plan.dur+' of full access'}));
card.onclick=()=>{
[{name:'Monthly',key:'monthly'},{name:'6 Months',key:'sixmonth'},{name:'1 Year',key:'yearly'}].forEach(p2=>{const c=document.getElementById('pc-'+p2.key);const r=document.getElementById('pr-'+p2.key);if(c){c.style.border='1px solid var(--border)';c.style.background='var(--card)';}if(r){r.innerHTML='';r.style.border='2px solid var(--border)';}});
card.style.border='1px solid '+plan.color;card.style.background='#1a1a0f';radio.style.border='2px solid '+plan.color;radio.innerHTML='<div style="width:10px;height:10px;border-radius:50%;background:'+plan.color+'"></div>';
sel={...plan,link:links2[plan.key]||'#'};submitBtn.textContent='Create Account — '+plan.price;
};pl.append(card);
});
ps.append(pl);wrap.append(ps);
}
const lp=div({style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'16px'}});lp.append(document.createTextNode('Already have an account? '));const ll=document.createElement('button');ll.style.cssText='background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px;';ll.textContent='Log in';ll.onclick=()=>go('login');lp.append(ll);
const bp=div({style:{textAlign:'center',marginTop:'8px'}});const bl2=document.createElement('button');bl2.style.cssText="background:none;border:none;color:var(--dim);cursor:pointer;font-size:12px;font-family:Inter,sans-serif;letter-spacing:1px;";bl2.textContent='← Back to home';bl2.onclick=()=>go('landing');bp.append(bl2);
wrap.append(lp,bp);page.append(wrap);return page;
}
// ═══════════════════════════════
// LOGIN
// ═══════════════════════════════
function login(){
const page=div({cls:'center',style:{minHeight:'100vh',padding:'24px'}});
const card=div({cls:'card fade',style:{width:'100%',maxWidth:'400px'}});
const errEl=div({cls:'err hidden'});
const emailI=inp('your@email.com','email');const passI=inp('Your password','password');
function wrapWithEye(inputEl){
  const wrapper=div({style:{position:'relative'}});
  inputEl.style.paddingRight='50px';
  const toggleBtn=h('button',{style:{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'14px',padding:'4px 8px'}},[document.createTextNode('👁')]);
  let isVisible=false;
  toggleBtn.onclick=()=>{
    isVisible=!isVisible;
    inputEl.type=isVisible?'text':'password';
    toggleBtn.innerHTML=isVisible?'👁‍🗨':'👁';
  };
  wrapper.append(inputEl,toggleBtn);
  return wrapper;
}
const wrappedPassI=wrapWithEye(passI);
// Forgot password
const fpBtn=document.createElement('button');fpBtn.style.cssText='background:none;border:none;color:var(--gold);cursor:pointer;font-size:12px;font-family:"DM Mono",monospace;letter-spacing:1px;display:block;margin-bottom:16px;';fpBtn.textContent='Forgot password?';
fpBtn.onclick=async()=>{const em=emailI.value.trim();if(!em){errEl.classList.remove('hidden');errEl.textContent='Enter your email first.';return;}const{error}=await sb.auth.resetPasswordForEmail(em);if(error){errEl.classList.remove('hidden');errEl.textContent=error.message;}else{errEl.classList.remove('hidden');errEl.style.background='#0a1f18';errEl.style.border='1px solid var(--teal)';errEl.style.color='var(--teal)';errEl.textContent='Password reset email sent! Check your inbox.';}};
const sb2=btn('Log In','btn-gold',async()=>{
errEl.classList.add('hidden');sb2.textContent='Logging in...';sb2.disabled=true;
const{data,error}=await sb.auth.signInWithPassword({email:emailI.value,password:passI.value});
if(error){errEl.classList.remove('hidden');errEl.textContent=error.message;sb2.textContent='Log In';sb2.disabled=false;return;}
// onAuthStateChange handles redirect
},{style:{width:'100%',marginBottom:'16px'}});
passI.onkeydown=e=>{if(e.key==='Enter')sb2.click();};
card.append(div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'4px'},html:'Deo Fortis'}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',marginBottom:'4px'},html:'Welcome Back'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'Log in to continue your studies.'}),errEl,field('Email',emailI),field('Password',wrappedPassI,'mb-24'),sb2,fpBtn,h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'16px'},html:"Don't have an account? <button onclick=\"go('landing')\" style=\"background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px\">Sign up via home page</button>"}),h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'8px'},html:"<button onclick=\"go('landing')\" style=\"background:none;border:none;color:var(--dim);cursor:pointer;font-size:12px\">← Back to home</button>"}));
page.append(card);return page;
}
// ═══════════════════════════════
// PENDING
// ═══════════════════════════════
function pending(){
const page=div({cls:'center',style:{minHeight:'100vh',padding:'24px'}});
const card=div({cls:'card fade',style:{width:'100%',maxWidth:'480px',textAlign:'center'}});
card.append(div({style:{fontSize:'48px',marginBottom:'20px'},html:' '}),div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'16px'},html:'Deo Fortis'}),h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',marginBottom:'12px'},html:'Awaiting Approval'}),h('p',{cls:'muted',style:{fontSize:'15px',lineHeight:'1.7',marginBottom:'24px'},html:'Thanks for joining Deo Fortis! Your account is pending approval. You will be approved as soon as your payment is verified.'}),div({cls:'quote',style:{marginBottom:'24px',textAlign:'left'},html:'"Great students are patient students."'}),btn('Log Out','btn-outline',()=>sb.auth.signOut()));
page.append(card);return page;
}
// ═══════════════════════════════
// UPGRADE MODAL
// ═══════════════════════════════
function showUpgradeModal(){
  const overlay=div({style:{position:'fixed',top:'0',left:'0',right:'0',bottom:'0',background:'rgba(0,0,0,0.85)',zIndex:'9999',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}});
  const modal=div({style:{maxWidth:'480px',width:'100%',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',padding:'32px'}});
  modal.append(
    h('div',{style:{fontSize:'48px',textAlign:'center',marginBottom:'16px'},html:'👑'}),
    h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',color:'var(--gold)',textAlign:'center',marginBottom:'8px'},html:'Upgrade to Full Access'}),
    h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',textAlign:'center',marginBottom:'24px'},html:'Unlock everything from $10/month'})
  );
  const grid=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 12px',marginBottom:'24px'}});
  ['Full Pomodoro History','Streak Tracking','4,000 Q-Bank Questions','10,400 Flashcards','Leaderboard Access','Active Recall Requests'].forEach(feature=>{
    grid.append(div({style:{display:'flex',alignItems:'center',gap:'8px'}},[
      h('span',{style:{color:'var(--teal)',fontSize:'14px'},html:'✓'}),
      h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--text)'},html:feature})
    ]));
  });
  modal.append(grid);
  modal.append(
    btn('Upgrade Now →','btn-gold',()=>{overlay.remove();go('landing');},{style:{width:'100%',marginBottom:'12px'}}),
    btn('Maybe later','',()=>overlay.remove(),{style:{background:'none',border:'none',fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',cursor:'pointer',width:'100%',textAlign:'center'}})
  );
  overlay.append(modal);
  document.body.append(overlay);
}

// ═══════════════════════════════
// COLLAPSIBLE SECTION HELPER
// ═══════════════════════════════
function collapsibleSection(title,contentBuilder){
  const card=div({cls:'card',style:{marginBottom:'16px'}});
  let loaded=false;
  const chevron=h('span',{style:{fontSize:'14px',color:'var(--dim)'},html:'▶'});
  const header=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',paddingBottom:'12px',borderBottom:'1px solid var(--border)'}});
  header.append(h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',margin:'0'},html:title}),chevron);
  const contentDiv=div({style:{display:'none',paddingTop:'16px'}});
  header.onclick=()=>{
    const open=contentDiv.style.display==='block';
    contentDiv.style.display=open?'none':'block';
    chevron.innerHTML=open?'▶':'▼';
    if(!loaded&&!open){contentBuilder(contentDiv);loaded=true;}
  };
  card.append(header,contentDiv);
  return card;
}

// ═══════════════════════════════
// DASHBOARD
// ═══════════════════════════════
function dashboard(){
const page=div({});
const p=S.profile||{};
const isFree=p.is_free_tier===true;

// NAV
const nav=div({cls:'dash-nav'});
nav.append(
  div({cls:'logo',html:'Deo Fortis'}),
  div({style:{display:'flex',gap:'8px'}},[
    btn('Study','btn-outline',()=>go('study'),{style:{padding:'8px 16px'}}),
    btn('Cards','btn-outline',()=>go('flashcards'),{style:{padding:'8px 16px'}}),
    btn('Q-Bank','btn-outline',()=>go('vignette'),{style:{padding:'8px 16px'}}),
    btn('Leaderboard','btn-outline',()=>isFree?showUpgradeModal():go('leaderboard'),{style:{padding:'8px 16px'}}),
    btn('Log Out','btn-outline',()=>sb.auth.signOut(),{style:{padding:'8px 16px'}})
  ])
);
page.append(nav);

// INNER CONTAINER
const container=div({cls:'inner'});
page.append(container);

// STAT CARD HELPER
function statCard(title,value,barColor,subLabel=''){
  const wrap=div({style:{position:'relative',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'2px',overflow:'hidden'}});
  wrap.append(
    div({style:{position:'absolute',top:'0',left:'0',right:'0',height:'2px',background:barColor}}),
    div({style:{padding:'16px'}},[
      h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'32px',color:'#ffffff',fontWeight:'700',marginBottom:'2px'},html:String(value)}),
      h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'12px',textTransform:'uppercase',color:'var(--muted)',letterSpacing:'1px'},html:title}),
      subLabel?h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'12px',color:'var(--teal)',marginTop:'4px'},html:subLabel}):null
    ].filter(Boolean))
  );
  return wrap;
}

// ACTION BUTTON HELPER
function actionButton(icon,label,onClick){
  const btn2=div({style:{border:'1px solid var(--border)',padding:'12px',borderRadius:'2px',cursor:'pointer',background:'transparent',textAlign:'center'},onclick:onClick});
  btn2.onmouseenter=()=>btn2.style.background='#C8A96E08';
  btn2.onmouseleave=()=>btn2.style.background='transparent';
  btn2.append(
    h('div',{style:{fontSize:'20px',marginBottom:'6px'},html:icon}),
    h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'13px',color:'var(--text)'},html:label}),
    h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'11px',color:'var(--muted)'},html:'→'})
  );
  return btn2;
}

// GREETING ROW + STREAK BADGE
const greetingRow=div({style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',flexWrap:'wrap',gap:'16px'}});
greetingRow.append(
  div({},[
    h('span',{cls:'chapter',html:'Welcome Back'}),
    h('h1',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'28px',fontWeight:'700',marginBottom:'4px',color:'var(--text)'},html:p.full_name||'Scholar'}),
    h('p',{cls:'muted',style:{fontSize:'12px'},html:'Plan: <span style="color:var(--gold)">'+(p.plan||'Active')+'</span> · Expires: <span style="color:var(--text)">'+(p.access_expires_at?new Date(p.access_expires_at).toLocaleDateString():'Active')+'</span>'})
  ]),
  div({style:{background:'linear-gradient(135deg,#2a1a05,#1a1208)',border:'1px solid #C8A96E33',padding:'8px 14px',borderRadius:'4px',display:'flex',alignItems:'center',gap:'8px',flexShrink:'0'}},[
    h('span',{style:{fontSize:'20px'},html:'🔥'}),
    div({},[
      h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',color:'var(--gold)',fontWeight:'700',lineHeight:'1'},html:String(isFree?Math.min(1,p.streak_count||0):(p.streak_count||0))}),
      h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'12px',color:'var(--muted)'},html:isFree?'locked':'day streak'})
    ])
  ])
);
container.append(greetingRow);

// NEW CONTENT BANNER
if(S.profile?.has_new_content){
  const banner=div({style:{background:'linear-gradient(135deg,#0a1f18,#0d2a1e)',border:'1px solid var(--teal)',borderRadius:'4px',padding:'14px 20px',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}});
  banner.append(
    div({style:{display:'flex',alignItems:'center',gap:'12px'}},[
      div({style:{lineHeight:'1'},html:ICONS.brain}),
      div({},[
        div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'16px',color:'var(--teal)',fontWeight:'600',marginBottom:'2px'},html:'Your recall content is ready!'}),
        div({style:{fontSize:'13px',color:'var(--muted)'},html:'Your active recall request has been fulfilled. Go to Flashcards or Q-Bank to access it.'})
      ])
    ]),
    btn('Dismiss','',async()=>{
      await sb.from('profiles').update({has_new_content:false}).eq('id',S.user.id);
      banner.remove();
    },{style:{background:'none',border:'1px solid var(--teal)',color:'var(--teal)',fontSize:'11px',padding:'6px 12px',flexShrink:'0'}})
  );
  container.append(banner);
}

// STAT CARDS — 2 columns
const statsGrid=div({style:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px',marginBottom:'28px'}});
statsGrid.append(
  statCard('Hours Studied',Math.floor((p.total_study_minutes||0)/60)+'h','var(--gold)'),
  statCard('Total Points',p.total_points||0,'var(--gold)')
);
container.append(statsGrid);

// GOALS PROGRESS SECTION
const goalsSection=div({cls:'card',style:{marginBottom:'28px'}});
let goalsOpen=true;
const goalsHeader=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px',cursor:'pointer'}});
const goalsToggle=h('span',{style:{color:'var(--dim)',fontSize:'12px',transition:'transform 0.2s'},html:'▼'});
goalsHeader.append(
  div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',flex:'1'}},[
    div({},[
      h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'2px'},html:'Study Progress'}),
      h('div',{cls:'mono',style:{fontSize:'9px'},html:'goals vs actual hours'})
    ]),
    div({style:{display:'flex',gap:'8px',alignItems:'center'}},[
      btn('Study Goals','btn-outline',()=>{event.stopPropagation();showGoalsModal();},{style:{fontSize:'11px',padding:'6px 14px'}}),
      btn('Rest Days','btn-outline',()=>{event.stopPropagation();showRestDaysModal();},{style:{fontSize:'11px',padding:'6px 14px'}}),
      goalsToggle
    ])
  ])
);
const goalProgressEl=div({});
goalProgressEl.id='goals-progress';
goalsHeader.onclick=()=>{
  goalsOpen=!goalsOpen;
  goalProgressEl.style.display=goalsOpen?'block':'none';
  goalsToggle.style.transform=goalsOpen?'rotate(0deg)':'rotate(-90deg)';
};
goalsSection.append(goalsHeader,goalProgressEl);
container.append(goalsSection);
setTimeout(renderGoalsProgress,1200);

// SECTION 1 — Study Consistency
const studyConsistencySection=collapsibleSection('Study Consistency',(contentDiv)=>{
  (async()=>{
    const today=new Date();
    const daysToMonday=today.getDay()===0?6:today.getDay()-1;
    const monday=new Date(today);monday.setDate(today.getDate()-daysToMonday);monday.setHours(0,0,0,0);
    const{data:sessions}=await sb.from('study_sessions').select('started_at,duration_minutes').eq('user_id',S.user.id).not('ended_at','is',null).gte('started_at',monday.toISOString());
    const dailyGoal=S.profile?.study_goals?.daily_hours||4;
    const weekDays=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const dailyMinutes={};
    (sessions||[]).forEach(s=>{
      const d=new Date(s.started_at);
      const name=weekDays[d.getDay()===0?6:d.getDay()-1];
      dailyMinutes[name]=(dailyMinutes[name]||0)+(s.duration_minutes||0);
    });
    contentDiv.append(h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'12px',color:'var(--muted)',marginBottom:'12px'},html:'hours studied this week'}));
    const chartContainer=div({style:{display:'flex',justifyContent:'space-around',alignItems:'flex-end',height:'100px',marginBottom:'8px'}});
    let daysStudied=0;
    weekDays.forEach(day=>{
      const hours=(dailyMinutes[day]||0)/60;
      const barH=Math.min(80,Math.round((hours/dailyGoal)*80));
      const barColor=hours>=dailyGoal?'var(--teal)':hours>0?'var(--gold)':'var(--border)';
      if(hours>0)daysStudied++;
      const col=div({style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}});
      col.append(
        h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'10px',color:'var(--muted)'},html:hours>0?hours.toFixed(1)+'h':'0h'}),
        div({style:{height:'80px',width:'24px',background:'var(--card2)',borderRadius:'2px',display:'flex',alignItems:'flex-end'}},[
          div({style:{height:barH+'px',width:'100%',background:barColor,borderRadius:'2px'}})
        ]),
        h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'10px',color:'var(--muted)'},html:day})
      );
      chartContainer.append(col);
    });
    contentDiv.append(chartContainer,h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'13px',color:'var(--teal)',marginTop:'8px'},html:daysStudied+'/7 days this week'}));
  })();
});
container.append(studyConsistencySection);
if(isFree){studyConsistencySection.style.opacity='0.3';studyConsistencySection.style.pointerEvents='none';}

// SECTION 2 — Q-Bank Performance
const qbankSection=collapsibleSection('Q-Bank Performance',(contentDiv)=>{
  (async()=>{
    const{data:scores}=await sb.from('vignette_scores').select('score,total,topic,created_at').eq('user_id',S.user.id).order('created_at',{ascending:false}).limit(10);
    if(!scores||!scores.length){contentDiv.append(h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'13px',color:'var(--muted)',textAlign:'center',padding:'16px'},html:'No Q-Bank attempts yet.'}));return;}
    const reversed=[...scores].reverse();
    const pcts=reversed.map(s=>Math.round((s.score/s.total)*100));
    const avg=Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length);
    const headerRow=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}});
    headerRow.append(
      h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'12px',color:'var(--muted)'},html:'last 10 quiz scores'}),
      h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'13px',color:'var(--gold)'},html:'Avg: '+avg+'%'})
    );
    contentDiv.append(headerRow);
    const chartContainer=div({style:{display:'flex',alignItems:'flex-end',gap:'4px',height:'100px'}});
    reversed.forEach((score,i)=>{
      const pct=pcts[i];
      const barH=Math.min(80,Math.round((pct/100)*80));
      const barColor=pct>=80?'var(--teal)':pct>=60?'var(--gold)':'#8B3A3A';
      const col=div({style:{display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',flex:'1'}});
      col.append(
        h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'10px',color:'var(--teal)'},html:pct+'%'}),
        div({style:{width:'20px',borderRadius:'2px',height:barH+'px',background:barColor}}),
        h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'9px',color:'var(--muted)'},html:(score.topic||'Quiz').substring(0,6)})
      );
      chartContainer.append(col);
    });
    contentDiv.append(chartContainer);
  })();
});
container.append(qbankSection);
if(isFree){qbankSection.style.opacity='0.3';qbankSection.style.pointerEvents='none';}

// SECTION 3 — Flashcard Progress
const flashcardSection=collapsibleSection('Flashcard Progress',(contentDiv)=>{
  (async()=>{
    const{data:progress}=await sb.from('flashcard_progress').select('difficulty').eq('user_id',S.user.id);
    if(!progress||!progress.length){contentDiv.append(h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'13px',color:'var(--muted)',textAlign:'center',padding:'16px'},html:'No flashcard activity yet.'}));return;}
    let easy=0,iffy=0,hard=0;
    progress.forEach(p=>{if(p.difficulty==='Easy')easy++;else if(p.difficulty==='Iffy')iffy++;else if(p.difficulty==='Hard')hard++;});
    const total=easy+iffy+hard;
    contentDiv.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--dim)',marginBottom:'16px'},html:'current card ratings'}));
    [{label:'Easy',count:easy,color:'var(--teal)'},{label:'Iffy',count:iffy,color:'var(--gold)'},{label:'Hard',count:hard,color:'#8B3A3A'}].forEach(stat=>{
      const pct=total>0?(stat.count/total)*100:0;
      const row=div({style:{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}});
      row.append(
        h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:stat.color,width:'40px'},html:stat.label}),
        div({style:{flex:'1',height:'10px',background:'var(--card2)',borderRadius:'2px',overflow:'hidden'}},[
          div({style:{height:'100%',width:pct+'%',background:stat.color,borderRadius:'2px'}})
        ]),
        h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)',minWidth:'32px',textAlign:'right'},html:String(stat.count)})
      );
      contentDiv.append(row);
    });
  })();
});
container.append(flashcardSection);
if(isFree){flashcardSection.style.opacity='0.3';flashcardSection.style.pointerEvents='none';}

// TWO COLUMN — recent sessions + quick actions
const twoCol=div({style:{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'16px',marginBottom:'24px'}});
container.append(twoCol);

// LEFT — Recent Sessions
const recentCard=div({cls:'card'});
recentCard.append(
  h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'4px'},html:'Recent Sessions'}),
  h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'12px',color:'var(--muted)',marginBottom:'16px'},html:'your last 5 study blocks'}),
  div({id:'slist',html:'<p style="font-size:14px;color:var(--dim)">Loading...</p>'})
);
twoCol.append(recentCard);

// RIGHT — Quick Actions (loaded async for community link)
(async()=>{
  const{data:adminData}=await sb.from('admin_settings').select('community_link,support_email').single();
  const commLink=adminData?.community_link||'#';
  const supportEmail=adminData?.support_email||'';
  const actionsCard=div({cls:'card'});
  actionsCard.append(
    h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'4px'},html:'Quick Actions'}),
    h('div',{style:{fontFamily:'Inter,sans-serif',fontSize:'12px',color:'var(--muted)',marginBottom:'16px'},html:'navigate'}),
    div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}},[
      actionButton(ICONS.target,'Start Session',()=>go('study')),
      actionButton(ICONS.question,'Q-Bank',()=>go('vignette')),
      actionButton(ICONS.layers,'Flashcards',()=>go('flashcards')),
      actionButton(ICONS.trophy,'Leaderboard',()=>isFree?showUpgradeModal():go('leaderboard')),
      actionButton(ICONS.message,'Community',()=>{if(commLink&&commLink!=='#')window.open(commLink,'_blank');}),
      actionButton(ICONS.brain,'Feynman Arena',()=>go('feynman'))
    ])
  );
  twoCol.append(actionsCard);

  // COMMUNITY CARD
  const commCard=div({cls:'card',style:{marginTop:'16px',background:'linear-gradient(135deg,#1a1509,#141309)',border:'1px solid #C8A96E44',padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}});
  const commLeft=div({style:{display:'flex',alignItems:'center',gap:'12px'}});
  const commTxt=div({});
  commTxt.append(
    h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'17px',color:'var(--text)',fontWeight:'600',marginBottom:'2px'},html:'Join Our Community'}),
    h('div',{style:{fontSize:'13px',color:'var(--muted)'},html:'Connect with other students and stay accountable.'})
  );
  commLeft.append(h('div',{style:{fontSize:'28px'},html:ICONS.message}),commTxt);
  const commBtn=document.createElement('a');
  commBtn.href=commLink;commBtn.target='_blank';commBtn.id='comm-btn';
  commBtn.textContent='Join Now →';
  commBtn.style.cssText='display:'+(commLink&&commLink!=='#'?'block':'none')+';padding:10px 20px;font-family:"DM Mono",monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;background:var(--gold);color:#0F0E0A;text-decoration:none;border-radius:2px;flex-shrink:0;';
  commCard.append(commLeft,commBtn);
  container.append(commCard);

  // SUPPORT CARD
  const supCard=div({cls:'card',style:{marginTop:'12px',padding:'16px 24px',display:'flex',alignItems:'center',gap:'12px'}});
  const supTxt=div({});
  supTxt.append(h('span',{style:{fontSize:'13px',color:'var(--muted)'},html:'Need help? '}));
  const supLink=document.createElement('a');
  supLink.href='mailto:'+(supportEmail||'');supLink.id='sup-link';
  supLink.textContent='Contact support';supLink.style.color='var(--gold)';supLink.style.fontSize='13px';
  supTxt.append(supLink);
  supCard.append(h('div',{style:{fontSize:'20px'},html:ICONS.mail}),supTxt);
  container.append(supCard);
})();

// THEORY PDFs
(async()=>{
  const{data:pdfs}=await sb.from('theory_pdfs').select('*').eq('user_id',S.user.id).order('created_at',{ascending:false});
  if(pdfs&&pdfs.length){
    const pdfCard=div({cls:'card',style:{marginTop:'12px'}});
    pdfCard.append(h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'16px'},html:'Theory Questions'}));
    pdfs.forEach(pdf=>{
      const row=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}});
      row.append(h('span',{style:{fontSize:'14px',color:'var(--text)'},html:pdf.topic+' — '+pdf.filename}));
      row.append(btn('View PDF','btn-outline',()=>{
        const win=window.open();
        win.document.write('<iframe src="data:application/pdf;base64,'+pdf.data+'" style="width:100%;height:100vh;border:none;"></iframe>');
      },{style:{fontSize:'11px',padding:'6px 12px'}}));
      pdfCard.append(row);
    });
    container.append(pdfCard);
  }
})();

// LOAD SESSIONS
async function loadSess(){
  if(isFree){
    const sl=document.getElementById('slist');
    if(sl)sl.innerHTML='<div style="text-align:center;padding:20px;font-family:Inter,sans-serif;font-size:13px;color:var(--muted)">Session history not saved on free tier.<br><span style="color:var(--gold);cursor:pointer" onclick="showUpgradeModal()">Upgrade to track your progress →</span></div>';
    return;
  }
  const{data}=await sb.from('study_sessions').select('*').eq('user_id',S.user.id).order('started_at',{ascending:false}).limit(5);
  const sl=document.getElementById('slist');
  if(!sl)return;
  if(!data||!data.length){sl.innerHTML='<p style="font-size:14px;color:var(--dim)">No sessions yet.</p>';return;}
  sl.innerHTML='';
  data.forEach(s=>{
    const row=div({style:{padding:'10px 0',borderBottom:'1px solid var(--border)'}});
    const start=new Date(s.started_at);
    const end=s.ended_at?new Date(s.ended_at):null;
    const dateStr=start.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
    const startTime=start.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const endTime=end?end.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}):'ongoing';
    const mins=s.duration_minutes||(end?Math.round((end-start)/60000):0);
    row.append(
      div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2px'}},[
        h('span',{style:{fontSize:'13px',color:'var(--text)',fontWeight:'500'},html:dateStr}),
        h('span',{style:{fontFamily:'Inter,sans-serif',fontSize:'13px',color:'var(--gold)',fontWeight:'600'},html:mins>0?mins+' mins':'—'})
      ]),
      div({style:{fontFamily:'Inter,sans-serif',fontSize:'12px',color:'#aaaaaa'},html:startTime+' → '+endTime+(s.topic?' · '+s.topic:'')})
    );
    sl.append(row);
  });
}
setTimeout(loadSess,1000);

// ORPHANED SESSION
(async()=>{
  const{data:orphans}=await sb.from('study_sessions').select('*').eq('user_id',S.user.id).is('ended_at',null).order('started_at',{ascending:false}).limit(1);
  if(!orphans||!orphans.length)return;
  const orphan=orphans[0];
  const startDate=new Date(orphan.started_at);
  if((Date.now()-startDate)<5*60*1000)return;
  const banner=div({style:{background:'linear-gradient(135deg,#1a1205,#1a0f05)',border:'1px solid var(--gold)',borderRadius:'4px',padding:'16px 20px',marginTop:'16px'}});
  banner.append(
    div({style:{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}},[
      div({style:{fontSize:'20px'},html:ICONS.alert}),
      div({},[
        div({style:{fontSize:'14px',color:'var(--text)',fontWeight:'600',marginBottom:'2px'},html:'Unfinished Study Session'}),
        div({style:{fontSize:'12px',color:'var(--muted)'},html:'You have a session from '+startDate.toLocaleDateString()+' at '+startDate.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})+' that was never clocked out.'})
      ])
    ]),
    div({style:{display:'flex',gap:'10px',flexWrap:'wrap'}},[
      btn('Clock Out Now','btn-gold',async()=>{
        const mins=Math.max(1,Math.round((Date.now()-startDate)/60000));
        await sb.from('study_sessions').update({ended_at:new Date().toISOString(),duration_minutes:mins}).eq('id',orphan.id);
        await sb.from('profiles').update({total_study_minutes:(S.profile?.total_study_minutes||0)+mins,total_points:(S.profile?.total_points||0)+5}).eq('id',S.user.id);
        banner.remove();
        setTimeout(loadSess,500);
      },{style:{fontSize:'11px',padding:'8px 16px'}}),
      btn('Discard Session','btn-outline',async()=>{
        await sb.from('study_sessions').update({ended_at:new Date().toISOString(),duration_minutes:0}).eq('id',orphan.id);
        banner.remove();
      },{style:{fontSize:'11px',padding:'8px 16px'}})
    ])
  );
  container.append(banner);
})();

setAITopic('general medicine');
setTimeout(()=>initAIChat(),500);
return page;
}
// ═══════════════════════════════
// STUDY (POMODORO)
// ═══════════════════════════════
function study(){
const page=div({cls:'center',style:{minHeight:'100vh',padding:'24px',flexDirection:'column'}});
let cfg={topic:'',workMins:25,breakMins:5,sessions:4,useRecall:false,recallStyle:'',recallDetails:''};
let timer=0,running=false,curSess=1,isBreak=false,interval=null,reqSent=false;
// Restore timer state from localStorage if exists
const _saved=localStorage.getItem('pomodoroState');
if(_saved){try{const st=JSON.parse(_saved);timer=st.timer||0;curSess=st.curSess||1;isBreak=st.isBreak||false;cfg=Object.assign(cfg,st.cfg||{});window.activeSessionId=st.activeSessionId||null;window.sessionStartTime=st.sessionStartTime||null;}catch(e){}}
// If there's an active pomPlan, go straight to timer
if(window.activeSessionId&&window.pomPlan){
  sb.from('admin_settings').select('noise_rain,noise_ocean,noise_cafe,noise_white').single().then(({data:nd})=>{
    if(nd)noiseLinks2={rain:nd.noise_rain||'',ocean:nd.noise_ocean||'',cafe:nd.noise_cafe||'',white:nd.noise_white||''};
    showTimer();
  });
  return page;
}
function showSetup(){
page.innerHTML='';
const card=div({cls:'card fade',style:{width:'100%',maxWidth:'540px'}});
card.append(btn('← Back','',()=>go('dashboard'),{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'12px',fontFamily:"Inter,sans-serif",letterSpacing:'1px',marginBottom:'16px'}}));
card.append(h('span',{cls:'chapter',html:'Study Setup'}),h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'26px',marginBottom:'24px'},html:'Configure Your Session'}));
const topI=inp('e.g. Bacteriology, Cardiology','text',cfg.topic);topI.id='st-topic';topI.oninput=e=>cfg.topic=e.target.value;
card.append(field('What topic are you studying?',topI));
card.append(h('label',{cls:'label',html:'Pomodoro Configuration'}));
const pg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'8px'}});
const wI=inp('25','number',String(cfg.workMins));wI.min='1';wI.max='120';wI.oninput=e=>cfg.workMins=parseInt(e.target.value)||25;
const bI=inp('5','number',String(cfg.breakMins));bI.min='1';bI.max='60';bI.oninput=e=>cfg.breakMins=parseInt(e.target.value)||5;
const sI=inp('4','number',String(cfg.sessions));sI.min='1';sI.max='20';sI.oninput=e=>cfg.sessions=parseInt(e.target.value)||4;
[[wI,'Work (mins)'],[bI,'Break (mins)'],[sI,'Sessions']].forEach(([i,l])=>{const w=div({});w.append(h('label',{cls:'label',style:{fontSize:'9px'},html:l}),i);pg.append(w);});
card.append(pg,h('p',{cls:'mono',style:{marginBottom:'20px'},html:'Set your own work time, break time and number of sessions'}));
if(S.profile?.is_free_tier){
  card.append(div({style:{background:'rgba(200,169,110,0.05)',border:'1px solid var(--border)',borderRadius:'4px',padding:'16px',marginBottom:'20px',textAlign:'center'}},[
    h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--dim)',marginBottom:'12px'},html:'Active Recall is a paid feature.'}),
    btn('Upgrade to Unlock','btn-outline',()=>showUpgradeModal(),{style:{fontSize:'11px',padding:'6px 14px'}})
  ]));
}else{
card.append(h('label',{cls:'label',html:'Request Active Recall?'}));
const rb=div({style:{display:'flex',gap:'12px',marginBottom:'20px'}});
['Yes','No'].forEach(v=>{
const b=btn(v,'btn-outline',()=>{cfg.useRecall=v==='Yes';rb.querySelectorAll('button').forEach(b2=>{b2.style.background='transparent';b2.style.color='var(--muted)';b2.style.border='1px solid var(--border)';});b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';ro.style.display=cfg.useRecall?'block':'none';});
b.style.flex='1';if((v==='Yes'&&cfg.useRecall)||(v==='No'&&!cfg.useRecall)){b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';}
rb.append(b);
});
card.append(rb);
const ro=div({style:{display:cfg.useRecall?'block':'none'}});
ro.append(h('label',{cls:'label',html:'Recall Style'}));
const sg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'20px'}});
[['flashcard',' Flashcard'],['vignette',' Vignette'],['theory',' Theory']].forEach(([v,l])=>{
const b=btn(l,'btn-outline',()=>{cfg.recallStyle=v;sg.querySelectorAll('button').forEach(b2=>{b2.style.background='transparent';b2.style.color='var(--muted)';b2.style.border='1px solid var(--border)';});b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';});
b.style.fontSize='11px';if(cfg.recallStyle===v){b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';}
sg.append(b);
});
ro.append(sg);
const qtyI=inp('e.g. 20','number','');qtyI.min='1';qtyI.max='200';
ro.append(h('label',{cls:'label',html:'How many questions / cards do you want?'}),qtyI);
const detI=h('textarea',{cls:'input',placeholder:'e.g. Focus on gram positive bacteria, NBME style...',style:{minHeight:'80px',resize:'vertical',marginBottom:'20px'}});
detI.value=cfg.recallDetails;detI.oninput=e=>cfg.recallDetails=e.target.value;
ro.append(h('label',{cls:'label',html:'Be Specific (optional)'}),detI);
const sentMsg=div({cls:'ok',style:{display:reqSent?'block':'none',marginBottom:'20px'},html:'✓ Request sent! You will be notified when your content is ready.'});
const sendBtn=btn('Send Recall Request →','btn-teal',async()=>{
if(!cfg.recallStyle)return;
await sb.from('recall_requests').insert({user_id:S.user.id,user_name:S.profile?.full_name,user_email:S.profile?.email,topic:cfg.topic,style:cfg.recallStyle,details:cfg.recallDetails,quantity:parseInt(qtyI.value)||0,status:'pending'});
sendAdminEmail('🧠 New Recall Request — Deo Fortis','<h2>New Active Recall Request</h2><p><b>Student:</b> '+S.profile?.full_name+'</p><p><b>Email:</b> '+S.profile?.email+'</p><p><b>Topic:</b> '+cfg.topic+'</p><p><b>Style:</b> '+cfg.recallStyle+'</p><p><b>Quantity:</b> '+(qtyI.value||'Not specified')+'</p><p><b>Details:</b> '+(cfg.recallDetails||'None')+'</p>');
reqSent=true;sentMsg.style.display='block';sendBtn.style.display='none';
},{style:{width:'100%',marginBottom:'20px',display:reqSent?'none':'block'}});
ro.append(sentMsg,sendBtn);
card.append(ro);
}
let noiseLinks2={rain:'',ocean:'',cafe:'',white:''};
const startBtn=btn('Start Session →','btn-gold',()=>{
cfg.topic=topI.value?.trim();if(!cfg.topic)return;
showClockIn();
},{style:{width:'100%'}});
card.append(startBtn);
page.append(card);
}
function showClockIn(){
page.innerHTML='';
const card=div({cls:'card fade',style:{width:'100%',maxWidth:'400px',textAlign:'center'}});
card.append(
  btn('← Back','',()=>showSetup(),{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'12px',fontFamily:"Inter,sans-serif",letterSpacing:'1px',marginBottom:'16px',display:'block'}}),
  h('span',{cls:'chapter',html:'Ready to Study?'}),
  div({style:{fontSize:'64px',margin:'24px 0'},html:ICONS.bookOpen}),
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'28px',marginBottom:'8px'},html:'Clock In'}),
  h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'32px'},html:'Click below to start your session and begin the timer.'})
);
const cinBtn=btn('⏵ Clock In & Start Timer','btn-gold',async()=>{
  cinBtn.textContent='Clocking in...';cinBtn.disabled=true;
  const{data:sess,error}=await sb.from('study_sessions').insert({user_id:S.user.id,topic:cfg.topic||'General Study',started_at:new Date().toISOString()}).select().single();
  if(error){cinBtn.textContent='⏵ Clock In & Start Timer';cinBtn.disabled=false;alert('Failed to clock in. Try again.');return;}
  window.activeSessionId=sess.id;
  window.sessionStartTime=Date.now();
  // Save to localStorage for recovery
  localStorage.setItem('activeSession',JSON.stringify({id:sess.id,startTime:Date.now(),topic:cfg.topic||'General Study'}));
  // Initialize fresh pomPlan
  window.pomPlan={
    topic:cfg.topic||'General Study',
    totalSessions:cfg.sessions||4,
    workSec:(cfg.workMins||25)*60,
    breakSec:(cfg.breakMins||5)*60,
    currentCycle:1,
    isBreakMode:false,
    startedAtTimestamp:Date.now()
  };
  showNoiseBar();showTimerBar();
  showTimer();
},{style:{width:'100%',padding:'16px'}});
card.append(cinBtn);
page.append(card);
}
function showSessionComplete(){
page.innerHTML='';
const card=div({cls:'card fade',style:{width:'100%',maxWidth:'400px',textAlign:'center'}});
card.append(
  div({style:{fontSize:'64px',margin:'24px 0'},html:ICONS.sparkles}),
  h('span',{cls:'chapter',html:'All Sessions Complete!'}),
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'28px',marginBottom:'8px'},html:'Well Done!'}),
  h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.8',marginBottom:'32px'},html:"You completed all your Pomodoro sessions. Ready to clock out and save your progress?"})
);
card.append(
  btn('⏹ Clock Out & Save','btn-gold',()=>showClockOut(),{style:{width:'100%',padding:'16px',marginBottom:'12px'}}),
  btn('Keep Going →','btn-outline',()=>{
    // Let them start a new session
    if(window.pomInterval){clearInterval(window.pomInterval);window.pomInterval=null;}
    showSetup();
  },{style:{width:'100%'}})
);
if(S.profile?.is_free_tier){
  const upsell=div({style:{background:'linear-gradient(135deg,#2a1a05,#1a1208)',border:'1px solid var(--gold)',padding:'16px 20px',borderRadius:'4px',marginTop:'16px'}});
  upsell.append(
    h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--muted)',marginBottom:'8px'},html:"Great session! Your progress wasn't saved."}),
    h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',marginBottom:'16px'},html:'Upgrade to track your hours, build streaks, and climb the leaderboard — from $10/month.'}),
    btn('Upgrade Now →','btn-gold',()=>showUpgradeModal())
  );
  card.append(upsell);
}
const feynmanPrompt=div({style:{marginTop:'16px',background:'linear-gradient(135deg,#1a1509,#141309)',border:'1px solid var(--gold)',borderRadius:'4px',padding:'16px 20px',textAlign:'center'}});
feynmanPrompt.append(
  h('div',{style:{lineHeight:'1',marginBottom:'8px'},html:ICONS.brain}),
  h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'16px',color:'var(--gold)',marginBottom:'4px'},html:'Visit the Feynman Arena'}),
  h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',marginBottom:'12px'},html:'Teach what you just learned. Cement it forever.'}),
  btn('Go to Feynman Arena →','btn-outline',()=>go('feynman'),{style:{fontSize:'11px',padding:'8px 20px'}})
);
card.append(feynmanPrompt);
page.append(card);
}

function showClockOut(){
page.innerHTML='';
const mins=window.sessionStartTime?Math.max(1,Math.round((Date.now()-window.sessionStartTime)/60000)):0;
const card=div({cls:'card fade',style:{width:'100%',maxWidth:'400px',textAlign:'center'}});
card.append(
  div({style:{margin:'24px 0',lineHeight:'1'},html:ICONS.check}),
  h('span',{cls:'chapter',html:'Session Complete!'}),
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'28px',marginBottom:'8px'},html:'Clock Out'}),
  h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'8px'},html:'Great work! You studied for:'}),
  div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'48px',color:'var(--gold)',marginBottom:'32px'},html:mins+' mins'})
);
const coutBtn=btn('⏹ Clock Out & Save Session','btn-gold',async()=>{
  coutBtn.textContent='Saving...';coutBtn.disabled=true;
  try{
    // Recover session from localStorage if window vars lost
    if(!window.activeSessionId||!window.sessionStartTime){
      const saved=localStorage.getItem('activeSession');
      if(saved){const p=JSON.parse(saved);window.activeSessionId=p.id;window.sessionStartTime=p.startTime;}
    }
    if(!window.activeSessionId){alert('No active session found.');go('dashboard');return;}
    const endTimeISO=new Date().toISOString();
    const actualMins=Math.max(1,Math.round((Date.now()-window.sessionStartTime)/60000));
    // Update study session
    const{error:se}=await sb.from('study_sessions').update({ended_at:endTimeISO,duration_minutes:actualMins}).eq('id',window.activeSessionId).eq('user_id',S.user.id);
    if(se){console.error('Session update error:',se);throw se;}
    // Verify the write
    let verified=false;
    for(let i=0;i<5;i++){
      await new Promise(r=>setTimeout(r,400));
      const{data:check}=await sb.from('study_sessions').select('ended_at').eq('id',window.activeSessionId).single();
      if(check?.ended_at){verified=true;break;}
    }
    if(!verified)console.warn('Could not verify session write, proceeding anyway');
    // Update profile
    await sb.from('profiles').update({total_study_minutes:(S.profile?.total_study_minutes||0)+actualMins,total_points:(S.profile?.total_points||0)+5}).eq('id',S.user.id);
    await updateStreak();
    // Clear all state
    window.activeSessionId=null;window.sessionStartTime=null;window.pomPlan=null;
    localStorage.removeItem('pomodoroState');localStorage.removeItem('activeSession');
    removeNoiseBar();removeTimerBar();
    go('dashboard');
  }catch(e){
    console.error('Clock out error:',e);
    coutBtn.textContent='⏹ Clock Out & Save Session';coutBtn.disabled=false;
    alert('Failed to save session. Please try again.');
  }
},{style:{width:'100%',padding:'16px'}});
card.append(coutBtn,btn('Back to Dashboard','btn-outline',()=>go('dashboard'),{style:{width:'100%',marginTop:'12px'}}));
page.append(card);
}
function showTimer(){
// ── DeepSeek engine: single source of truth in window.pomPlan ──
// Stop any existing interval
if(window.pomInterval){clearInterval(window.pomInterval);window.pomInterval=null;}

// Build or restore plan
if(!window.pomPlan){
  window.pomPlan={
    topic:cfg.topic,
    totalSessions:cfg.sessions,
    workSec:cfg.workMins*60,
    breakSec:cfg.breakMins*60,
    currentCycle:curSess,
    isBreakMode:isBreak,
    startedAtTimestamp:Date.now()
  };
}
const plan=window.pomPlan;
// sync outer vars
curSess=plan.currentCycle;
isBreak=plan.isBreakMode;

function computeRem(){
  const mt=plan.isBreakMode?plan.breakSec:plan.workSec;
  const elapsed=Math.floor((Date.now()-plan.startedAtTimestamp)/1000);
  return Math.max(0,mt-elapsed);
}

// Build UI
page.innerHTML='';
const mt=plan.isBreakMode?plan.breakSec:plan.workSec;
const r=80,circ=2*Math.PI*r;
const card=div({cls:'card fade',style:{textAlign:'center',maxWidth:'400px',width:'100%'}});
card.append(
  h('span',{cls:'chapter',html:plan.isBreakMode?'Break Time':'Session '+plan.currentCycle+' of '+plan.totalSessions}),
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'20px',marginBottom:'8px',color:plan.isBreakMode?'var(--teal)':'var(--text)'},html:plan.topic})
);
const svgNS='http://www.w3.org/2000/svg';
const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('width','200');svg.setAttribute('height','200');svg.style.transform='rotate(-90deg)';
const bgC=document.createElementNS(svgNS,'circle');bgC.setAttribute('cx','100');bgC.setAttribute('cy','100');bgC.setAttribute('r',String(r));bgC.setAttribute('fill','none');bgC.setAttribute('stroke','var(--border)');bgC.setAttribute('stroke-width','6');
const fgC=document.createElementNS(svgNS,'circle');fgC.setAttribute('cx','100');fgC.setAttribute('cy','100');fgC.setAttribute('r',String(r));fgC.setAttribute('fill','none');fgC.setAttribute('stroke',plan.isBreakMode?'var(--teal)':'var(--gold)');fgC.setAttribute('stroke-width','6');fgC.setAttribute('stroke-dasharray',String(circ));fgC.setAttribute('stroke-dashoffset',String(circ));fgC.setAttribute('stroke-linecap','round');fgC.style.transition='stroke-dashoffset 0.5s linear';
svg.append(bgC,fgC);
const tw=div({style:{position:'relative',width:'200px',height:'200px',margin:'24px auto'}});tw.append(svg);
const tc=div({style:{position:'absolute',inset:'0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}});
const td=div({style:{fontFamily:"Inter,sans-serif",fontSize:'32px',color:plan.isBreakMode?'var(--teal)':'var(--gold)'},html:fmtMS(computeRem())});
const ml=div({cls:'mono',style:{marginTop:'4px'},html:plan.isBreakMode?'BREAK':'FOCUS'});
tc.append(td,ml);tw.append(tc);card.append(tw);
const br=div({style:{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'16px',flexWrap:'wrap'}});
let tickLock=false;
let segDone=false;
function tick(){
  if(segDone||tickLock)return;
  tickLock=true;
  try{
    const rem=computeRem();
    const mt2=plan.isBreakMode?plan.breakSec:plan.workSec;
    td.textContent=fmtMS(rem);
    fgC.setAttribute('stroke-dashoffset',String(circ*Math.max(0,rem/mt2)));
    // save state for timer bar
    localStorage.setItem('pomodoroState',JSON.stringify({
      segStart:plan.startedAtTimestamp,
      mt:mt2,curSess:plan.currentCycle,
      isBreak:plan.isBreakMode,cfg,
      activeSessionId:window.activeSessionId,
      sessionStartTime:window.sessionStartTime
    }));
    updateTimerBar();
    if(rem<=0){
      segDone=true;
      clearInterval(window.pomInterval);window.pomInterval=null;
      // transition
      if(plan.isBreakMode){
        plan.isBreakMode=false;plan.currentCycle++;
        if(plan.currentCycle>plan.totalSessions){
          // All sessions complete — show completion screen
          window.pomPlan=null;showSessionComplete();return;
        }
      }else{
        if(plan.currentCycle>=plan.totalSessions){
          // Last focus done — show completion screen
          window.pomPlan=null;showSessionComplete();return;
        }
        plan.isBreakMode=true;
      }
      plan.startedAtTimestamp=Date.now();
      curSess=plan.currentCycle;isBreak=plan.isBreakMode;
      showTimer();
    }
  }finally{tickLock=false;}
}
br.append(
  btn('End Session','btn-gold',()=>{if(window.pomInterval){clearInterval(window.pomInterval);window.pomInterval=null;}window.pomPlan=null;showClockOut();}),
  btn('← Dashboard','btn-outline',()=>go('dashboard'),{style:{fontSize:'11px'}})
);
card.append(br);
const qr=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}});
qr.append(btn('Flashcards','btn-outline',()=>go('flashcards'),{style:{fontSize:'11px'}}),btn('Q-Bank','btn-outline',()=>go('vignette'),{style:{fontSize:'11px'}}));
card.append(qr);
card.append(
  div({style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--dim)',textAlign:'center',marginTop:'8px',letterSpacing:'1px'},html:'Step away? Click End Session to save your progress.'}),
  div({style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--gold)',textAlign:'center',marginTop:'4px',letterSpacing:'1px'},html:'↑ Tap the timer bar at the top to return to this page anytime.'})
);
page.append(card);
// White noise
if(noiseLinks2.rain||noiseLinks2.ocean||noiseLinks2.cafe||noiseLinks2.white){
const ns=div({style:{marginTop:'16px',width:'100%',maxWidth:'400px'}});
ns.append(div({cls:'mono',style:{marginBottom:'8px',textAlign:'center'},html:'White Noise'}));
const ng=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}});
[['rain','Rain',noiseLinks2.rain],['ocean','Ocean',noiseLinks2.ocean],['cafe','Cafe',noiseLinks2.cafe],['white','White',noiseLinks2.white]].forEach(([key,label,url])=>{
  if(!url)return;
  const wrap=div({style:{borderRadius:'4px',overflow:'hidden',border:'1px solid var(--border)'}});
  wrap.append(div({style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--muted)',letterSpacing:'1px',padding:'4px 8px',background:'var(--card)'},html:label}),h('iframe',{src:url+'?autoplay=0&controls=1',style:{width:'100%',height:'80px',border:'none'},allow:'autoplay'}));
  ng.append(wrap);
});
ns.append(ng);page.append(ns);
}
// Always auto-start — no pause button
window.pomInterval=setInterval(tick,250);
// visibilitychange — just resync, interval keeps running
if(window._visHandler)document.removeEventListener('visibilitychange',window._visHandler,true);
window._visHandler=function(){if(!document.hidden&&window.pomPlan)tick();};
document.addEventListener('visibilitychange',window._visHandler,true);
}
showSetup();return page;
}
// ═══════════════════════════════
// FLASHCARDS
// ═══════════════════════════════
function flashcards(){
const page=div({});
const isFree=S.profile?.is_free_tier===true;
const nav=div({cls:'dash-nav'});
nav.append(div({cls:'logo',html:'Deo Fortis'}),btn('← Dashboard','btn-outline',()=>{sessionStorage.removeItem('vignette_resume');go('dashboard');},{style:{padding:'8px 16px'}}));
page.append(nav);
let decks=[],selDeck=null,cards=[],queue=[],curIdx=0,flipped=false,prog={easy:0,iffy:0,hard:0};
const inner=div({cls:'inner-sm'});page.append(inner);
async function showDecks(){
inner.innerHTML='';
inner.append(h('span',{cls:'chapter',html:'Flashcard Decks'}),h('h1',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'40px',fontWeight:'700',marginBottom:'8px'},html:'Study <em class="gold-em">Flashcards</em>'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'40px'},html:'Select a deck. Mark cards Easy, Iffy, or Hard as you go.'}));
const{data}=await (isFree?sb.from('flashcard_decks').select('*').eq('type','flashcard').eq('is_global',true).order('created_at',{ascending:false}):sb.from('flashcard_decks').select('*').or('user_id.eq.'+S.user.id+',user_id.is.null').order('created_at',{ascending:false}));
decks=data||[];
if(!decks.length){inner.append(div({cls:'card',style:{textAlign:'center',padding:'48px'}},[div({style:{fontSize:'40px',marginBottom:'16px'},html:' '}),h('p',{style:{fontSize:'14px',color:'var(--dim)'},html:'No flashcard decks yet.'})]));return;}
const grid=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'16px'}});
decks.forEach(deck=>{
const card=div({cls:'card',style:{cursor:'pointer'}});
card.append(div({style:{fontSize:'32px',marginBottom:'12px'},html:' '}),h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',color:'var(--text)',marginBottom:'8px'},html:deck.topic}),btn('Start Deck →','btn-gold',async()=>loadDeck(deck),{style:{width:'100%',marginTop:'16px'}}));
grid.append(card);
});
inner.append(grid);
// Show past performance
const{data:history}=await sb.from('anki_results').select('*').eq('user_id',S.user.id).order('created_at',{ascending:false}).limit(10);
if(history&&history.length){
const hCard=div({cls:'card',style:{marginTop:'24px'}});
hCard.append(h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'16px'},html:'Past Performance'}));
history.forEach(r=>{
const row=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)'}});
const gradeColor=r.grade==='A'?'var(--teal)':r.grade==='B'?'var(--gold)':'#ff8888';
row.append(
  h('span',{style:{fontSize:'13px',color:'var(--text)'},html:r.deck_topic||'—'}),
  div({style:{display:'flex',gap:'12px',alignItems:'center'}},[
    h('span',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'20px',color:gradeColor,fontWeight:'700'},html:r.grade}),
    h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)'},html:new Date(r.created_at).toLocaleDateString()})
  ])
);
hCard.append(row);
});
// Average grade
const gradeMap={A:4,B:3,C:2};
const avg=history.reduce((sum,r)=>sum+(gradeMap[r.grade]||0),0)/history.length;
const avgGrade=avg>=3.5?'A':avg>=2.5?'B':'C';
const avgColor=avgGrade==='A'?'var(--teal)':avgGrade==='B'?'var(--gold)':'#ff8888';
hCard.append(div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'12px',paddingTop:'12px',borderTop:'1px solid var(--border)'}},[
  div({cls:'mono',html:'Average Grade'}),
  h('span',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',color:avgColor,fontWeight:'700'},html:avgGrade})
]));
inner.append(hCard);
}
}
async function loadDeck(deck){
if(S.profile?.is_free_tier){
  const{data:attempts}=await sb.from('flashcard_progress').select('id').eq('user_id',S.user.id).limit(1);
  if(attempts&&attempts.length>0){
    inner.innerHTML='';
    inner.append(div({cls:'card',style:{textAlign:'center',padding:'40px 20px'}},[
      h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'14px',color:'var(--dim)',marginBottom:'20px'},html:'Free tier allows 1 deck only.'}),
      btn('Upgrade →','btn-gold',()=>showUpgradeModal())
    ]));
    return;
  }
}
selDeck=deck;
const{data:allCards}=await sb.from('flashcards').select('*').eq('deck_id',deck.id);
if(!allCards||!allCards.length){alert('No cards in this deck yet.');return;}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
const total=allCards.length;
const defaultCount=Math.min(20,total);
let selectedCount=defaultCount;
inner.innerHTML='';
const card=div({cls:'card',style:{textAlign:'center'}});
const backBtn=btn('← Back','',()=>showDecks(),{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'12px',fontFamily:"Inter,sans-serif",letterSpacing:'1px',marginBottom:'16px'}});
card.append(backBtn);
card.append(h('span',{cls:'chapter',html:'Configure Session'}));
card.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'28px',marginBottom:'8px'},html:deck.topic||deck.name}));
card.append(h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:total+' cards available'}));
card.append(h('label',{cls:'label',html:'How many cards do you want to study?'}));
const countInput=h('input',{type:'number',value:String(selectedCount),min:'1',max:String(total),style:{width:'100%',padding:'10px',margin:'12px 0',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'2px',color:'var(--text)',fontSize:'14px',textAlign:'center'}});
countInput.oninput=(e)=>{let val=parseInt(e.target.value);if(isNaN(val))val=defaultCount;if(val<1)val=1;if(val>total)val=total;selectedCount=val;countInput.value=String(selectedCount);updateButtons();};
const quickRow=div({style:{display:'flex',gap:'8px',marginBottom:'24px'}});
const tenBtn=btn('10','btn-outline',()=>{selectedCount=Math.min(10,total);countInput.value=String(selectedCount);updateButtons();},{style:{flex:'1'}});
const twentyBtn=btn('20','btn-outline',()=>{selectedCount=Math.min(20,total);countInput.value=String(selectedCount);updateButtons();},{style:{flex:'1'}});
const allBtn=btn('All','btn-outline',()=>{selectedCount=total;countInput.value=String(selectedCount);updateButtons();},{style:{flex:'1'}});
quickRow.append(tenBtn,twentyBtn,allBtn);
card.append(quickRow,countInput);
function updateButtons(){
  [tenBtn,twentyBtn,allBtn].forEach(b=>{
    b.style.background='transparent';
    b.style.color='var(--muted)';
    b.style.border='1px solid var(--border)';
  });
  if(selectedCount===Math.min(10,total)){tenBtn.style.background='var(--gold)';tenBtn.style.color='var(--bg)';tenBtn.style.border='1px solid var(--gold)';}
  else if(selectedCount===Math.min(20,total)){twentyBtn.style.background='var(--gold)';twentyBtn.style.color='var(--bg)';twentyBtn.style.border='1px solid var(--gold)';}
  else if(selectedCount===total){allBtn.style.background='var(--gold)';allBtn.style.color='var(--bg)';allBtn.style.border='1px solid var(--gold)';}
}
updateButtons();
const startBtn=btn('Start Session →','btn-gold',()=>{
  const shuffled=shuffle([...allCards]);
  cards=shuffled.slice(0,selectedCount);
  queue=[...cards];
  curIdx=0;
  flipped=false;
  prog={easy:0,iffy:0,hard:0};
  showCard();
},{style:{width:'100%',marginTop:'8px'}});
card.append(startBtn);
inner.append(card);
}
function showCard(){
inner.innerHTML='';
if(!queue.length||curIdx>=queue.length){showDone();return;}
const card=queue[curIdx];
const pct=cards.length>0?Math.round((prog.easy/cards.length)*100):0;
const hdr=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}});
hdr.append(btn('← Decks','',()=>showDecks(),{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'12px',fontFamily:"Inter,sans-serif",letterSpacing:'1px'}}),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--muted)'},html:selDeck?.topic||''}),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)'},html:(curIdx+1)+' / '+queue.length}));
inner.append(hdr);
const pb=div({cls:'progress-bar',style:{marginBottom:'8px'}});pb.append(div({cls:'progress-fill',style:{width:pct+'%',background:'var(--teal)'}}));
inner.append(pb);
const pr=div({style:{display:'flex',justifyContent:'space-between',marginBottom:'24px'}});
pr.append(h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--teal)'},html:'✓ '+prog.easy+' easy'}),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--gold)'},html:'~ '+prog.iffy+' iffy'}),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'#ff8888'},html:'✗ '+prog.hard+' hard'}));
inner.append(pr);
const fw=div({cls:'flip-card',style:{width:'100%',height:'240px',marginBottom:'24px'}});
const fi=div({cls:'flip-inner',style:{height:'100%'}});
const front=div({cls:'flip-front card',style:{position:'absolute',width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px'}});
front.append(div({cls:'mono',style:{marginBottom:'16px'},html:'Question — tap to flip'}),h('p',{style:{fontSize:'16px',color:'var(--text)',textAlign:'center',lineHeight:'1.7'},html:card.question}));
const back=div({cls:'flip-back card',style:{position:'absolute',width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px',background:'#0a1f18',borderColor:'var(--teal)'}});
back.append(div({style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--teal)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px'},html:'Answer'}),h('p',{style:{fontSize:'16px',color:'var(--teal)',textAlign:'center',lineHeight:'1.7'},html:card.answer}));
fi.append(front,back);fw.append(fi);
fw.onclick=()=>{flipped=!flipped;fi.classList.toggle('flipped',flipped);mbtns.style.display=flipped?'grid':'none';flipBtn.style.display=flipped?'none':'block';};
inner.append(fw);
const mbtns=div({style:{display:'none',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}});
[['easy',' ','EASY','#1a3a1a','#7EB8A4','#2a5a2a'],['iffy',' ','IFFY','#2a1f0a','var(--gold)','#4a3a1a'],['hard',' ','HARD','#3a1a1a','#ff8888','#5a2a2a']].forEach(([d,ico,lbl2,bg,color,border])=>{
const b=btn(ico+'\n'+lbl2,'',()=>markCard(d),{style:{background:bg,color,border:'1px solid '+border,padding:'16px 8px',fontSize:'10px',letterSpacing:'1px'}});
mbtns.append(b);
});
inner.append(mbtns);
const flipBtn=btn('Flip Card →','btn-outline',()=>{flipped=true;fi.classList.add('flipped');mbtns.style.display='grid';flipBtn.style.display='none';},{style:{width:'100%'}});
inner.append(flipBtn);
}
function markCard(d){
const cur=queue[curIdx];
const prev=cur._state||'none';
let nq=[...queue];
// Increment seen counter
cur._seen=(cur._seen||0)+1;
if(prev==='none'){
  cur._state=d;
  prog[d]++;
  if(d==='easy'){nq.splice(curIdx,1);}
  else if(d==='iffy'){nq.splice(curIdx,1);nq.push(cur);}
  else{nq.splice(curIdx,1);nq.splice(Math.min(curIdx+2,nq.length),0,cur);}
  (async()=>{await sb.from('flashcard_progress').upsert({user_id:S.user.id,flashcard_id:cur.id,difficulty:d.charAt(0).toUpperCase()+d.slice(1),updated_at:new Date().toISOString()},{onConflict:'user_id,flashcard_id'});})();
} else if(prev==='hard'){
  if(d==='hard'){nq.splice(curIdx,1);nq.splice(Math.min(curIdx+2,nq.length),0,cur);}
  else{prog.hard=Math.max(0,prog.hard-1);prog.iffy++;cur._state='iffy';nq.splice(curIdx,1);nq.push(cur);}
} else if(prev==='iffy'){
  if(d==='easy'){prog.iffy=Math.max(0,prog.iffy-1);prog.easy++;cur._state='easy';nq.splice(curIdx,1);}
  else{nq.splice(curIdx,1);nq.push(cur);}
} else if(prev==='easy'){
  nq.splice(curIdx,1);
}
// After 2 appearances card is permanently done
if(cur._seen>=2){
  nq=nq.filter(c=>c!==cur);
  queue=nq;curIdx=Math.min(curIdx,queue.length-1);
  if(!queue.length){checkForRemaining();return;}
  flipped=false;showCard();return;
}
if(!nq.length){checkForRemaining();return;}
queue=nq;curIdx=Math.min(curIdx,queue.length-1);flipped=false;showCard();
}
function checkForRemaining(){
  const remainingCards=cards.filter(c=>c._state==='hard'||c._state==='iffy');
  if(remainingCards.length>0){showRoundComplete(remainingCards);}
  else{showDone();}
}
function showRoundComplete(remainingCards){
  inner.innerHTML='';
  const card=div({cls:'card',style:{textAlign:'center'}});
  card.append(
    h('span',{cls:'chapter',html:'Round Complete'}),
    h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'28px',marginBottom:'8px'},html:selDeck?.topic||''}),
    h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'You have completed one full pass through the deck.'}),
    div({style:{background:'var(--card2)',borderRadius:'4px',padding:'20px',marginBottom:'24px'}},[
      h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',color:'var(--gold)',marginBottom:'8px'},html:remainingCards.length+' cards remaining'}),
      h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--dim)'},html:'Marked as Hard or Iffy — ready for another round.'})
    ]),
    div({style:{display:'grid',gap:'12px'}},[
      btn('Repeat Hard & Iffy →','btn-gold',()=>{
        queue=[...remainingCards];cards=[...remainingCards];
        curIdx=0;flipped=false;prog={easy:0,iffy:0,hard:0};showCard();
      }),
      btn('Finish Session','btn-outline',()=>showDone())
    ])
  );
  inner.append(card);
}
async function showDone(){
inner.innerHTML='';
const total=prog.easy+prog.iffy+prog.hard;
const grade=prog.easy>=prog.iffy&&prog.easy>=prog.hard?'A':prog.iffy>=prog.hard?'B':'C';
const gradeColor=grade==='A'?'var(--teal)':grade==='B'?'var(--gold)':'#ff8888';
const gradeMsg=grade==='A'?'Excellent mastery!':grade==='B'?'Good effort, keep reviewing.':'Needs more practice.';
// Save result and award points
// Save result and award points — paid only
if(!S.profile?.is_free_tier){
  await sb.from('anki_results').insert({user_id:S.user.id,deck_id:selDeck?.id,deck_topic:selDeck?.topic,grade,easy_count:prog.easy,iffy_count:prog.iffy,hard_count:prog.hard});
  await sb.from('profiles').update({total_points:(S.profile?.total_points||0)+20,total_anki_sessions:(S.profile?.total_anki_sessions||0)+1}).eq('id',S.user.id);

}
const card=div({cls:'card fade',style:{textAlign:'center'}});
card.append(
  div({style:{fontSize:'48px',marginBottom:'16px'},html:ICONS.sparkles}),
  h('span',{cls:'chapter',html:'Deck Complete'}),
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'28px',marginBottom:'8px'},html:selDeck?.topic||''}),
  div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'80px',color:gradeColor,lineHeight:'1',marginBottom:'8px'},html:grade}),
  div({cls:'mono',style:{marginBottom:'4px'},html:gradeMsg}),
  div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--gold)',marginBottom:'24px'},html:'+20 points earned'})
);
const sg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'24px'}});
[{l:'Easy',v:prog.easy,c:'var(--teal)'},{l:'Iffy',v:prog.iffy,c:'var(--gold)'},{l:'Hard',v:prog.hard,c:'#ff8888'}].forEach(s=>{const c=div({cls:'card',style:{padding:'16px',textAlign:'center'}});c.append(div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'28px',color:s.c},html:String(s.v)}),div({cls:'mono',html:s.l}));sg.append(c);});
card.append(sg);
const bw=div({style:{display:'grid',gap:'10px'}});
bw.append(btn('Redo All Cards','btn-gold',()=>{queue=[...cards];curIdx=0;flipped=false;prog={easy:0,iffy:0,hard:0};showCard();}),btn('Back to Decks','btn-outline',()=>showDecks()),btn('Dashboard','btn-outline',()=>go('dashboard')));
card.append(bw);inner.append(card);
}
showDecks();return page;
}
// ═══════════════════════════════
// VIGNETTE Q-BANK
// ═══════════════════════════════
function vignette(){
const page=div({});
const isFree=S.profile?.is_free_tier===true;
const nav=div({cls:'dash-nav'});
nav.append(div({cls:'logo',html:'Deo Fortis'}),btn('← Dashboard','btn-outline',()=>go('dashboard'),{style:{padding:'8px 16px'}}));
page.append(nav);
let questions=[],current=0,answers={},submitted=false,revealed={},ruledOut={},highlights={},timeLeft=0,tInterval=null,selTopic='',mode='',timeLimit=60;
let activeHighlightBtn=null;
const inner=div({cls:'inner-sm'});page.append(inner);
async function showSetup(){
inner.innerHTML='';
const savedQuiz=sessionStorage.getItem('vignette_resume');
if(savedQuiz){(()=>{const state=JSON.parse(savedQuiz);if(mode==='timed'&&state.timeLeft<=0){sessionStorage.removeItem('vignette_resume');}else{const banner=div({cls:'card',style:{marginBottom:'24px',padding:'16px',border:'1px solid var(--gold)',background:'rgba(200,169,110,0.08)'}},[ h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--gold)',marginBottom:'12px'}},['⏸ Quiz in progress — '+state.selTopic+' · '+Object.keys(state.answers).length+' of '+state.questions.length+' answered']), div({style:{display:'flex',gap:'10px'}},[ btn('Resume','btn-gold',()=>{questions=state.questions;current=state.current;answers=state.answers;selTopic=state.selTopic;mode=state.mode;timeLimit=state.timeLimit;timeLeft=state.timeLeft||0;submitted=false;revealed={};showQuiz();},{style:{padding:'6px 16px',fontSize:'11px'}}), btn('Discard','btn-outline',()=>{sessionStorage.removeItem('vignette_resume');showSetup();},{style:{padding:'6px 16px',fontSize:'11px'}}) ]) ]);inner.append(banner);}})();}
inner.append(h('span',{cls:'chapter',html:'Question Bank'}),h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'26px',marginBottom:'24px'},html:'Configure Your Quiz'}));
const{data}=await (isFree?sb.from('vignette_questions').select('topic').eq('is_global',true):sb.from('vignette_questions').select('topic').or('user_id.eq.'+S.user.id+',user_id.is.null'));
const topics=data?[...new Set(data.map(d=>d.topic))]:[];
if(!topics.length){inner.append(div({cls:'card',style:{textAlign:'center',padding:'48px'}},[h('p',{style:{fontSize:'14px',color:'var(--dim)'},html:'No questions available yet.'})]));return;}
const qCountI=inp('e.g. 40','number','');qCountI.min='1';qCountI.max='9999';
let selectedTopics=[];
let selectedSubsections=[];
const topicBtnContainer=div({style:{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'8px',marginBottom:'8px'}});
inner.append(h('label',{cls:'label',html:'Select Topics (choose at least one)'}),topicBtnContainer);
const countDisplay=div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',marginBottom:'12px'}},['Select at least one topic']);
inner.append(countDisplay);
function renderTopicButtons(){
  topicBtnContainer.innerHTML='';
  topics.forEach(topic=>{
    const isSelected=selectedTopics.includes(topic);
    const tb=btn(topic,isSelected?'btn-teal':'btn-outline',()=>{
      if(selectedTopics.includes(topic)){selectedTopics=selectedTopics.filter(t=>t!==topic);}
      else{selectedTopics.push(topic);}
      renderTopicButtons();
      (async()=>{selectedSubsections=[];await updateSubsectionUI();await updateCount();})();
    },{style:{padding:'6px 12px',fontSize:'12px'}});
    topicBtnContainer.append(tb);
  });
  topicBtnContainer.append(btn('Clear All','btn-outline',()=>{selectedTopics=[];selectedSubsections=[];renderTopicButtons();updateSubsectionUI();updateCount();},{style:{padding:'6px 12px',fontSize:'12px'}}));
}
renderTopicButtons();
const subBtnContainer=div({style:{display:'flex',flexWrap:'wrap',gap:'8px',marginTop:'8px'}});
const subsFilterWrap=div({style:{marginBottom:'16px',display:'none'}},[h('label',{cls:'label',html:'Filter by Subsection'}),subBtnContainer]);
inner.append(subsFilterWrap);
async function updateSubsectionUI(){
  if(!selectedTopics.length){subsFilterWrap.style.display='none';selectedSubsections=[];return;}
  const{data:subs}=await (isFree?sb.from('vignette_questions').select('subsection').in('topic',selectedTopics).eq('is_global',true).not('subsection','is',null):sb.from('vignette_questions').select('subsection').in('topic',selectedTopics).or('user_id.eq.'+S.user.id+',user_id.is.null').not('subsection','is',null));
  const uniqueSubs=[...new Set((subs||[]).map(s=>s.subsection).filter(Boolean))];
  if(!uniqueSubs.length){subsFilterWrap.style.display='none';selectedSubsections=[];return;}
  subsFilterWrap.style.display='block';
  subBtnContainer.innerHTML='';
  if(!selectedSubsections.length)selectedSubsections=[...uniqueSubs];
  uniqueSubs.forEach(sub=>{
    const isSelected=selectedSubsections.includes(sub);
    const sb2=btn(sub,isSelected?'btn-teal':'btn-outline',()=>{
      if(selectedSubsections.includes(sub)){selectedSubsections=selectedSubsections.filter(s=>s!==sub);}
      else{selectedSubsections.push(sub);}
      updateSubsectionUI();updateCount();
    },{style:{padding:'6px 12px',fontSize:'11px'}});
    subBtnContainer.append(sb2);
  });
  subBtnContainer.append(btn('All','btn-outline',()=>{selectedSubsections=[...uniqueSubs];updateSubsectionUI();updateCount();},{style:{padding:'6px 12px',fontSize:'11px'}}));
}
async function updateCount(){
  if(!selectedTopics.length){countDisplay.textContent='Select at least one topic';qCountI.value=0;qCountI.max=0;return;}
  let q=isFree?sb.from('vignette_questions').select('*',{count:'exact',head:true}).in('topic',selectedTopics).eq('is_global',true):sb.from('vignette_questions').select('*',{count:'exact',head:true}).in('topic',selectedTopics).or('user_id.eq.'+S.user.id+',user_id.is.null');
  if(selectedSubsections.length)q=q.in('subsection',selectedSubsections);
  const{count}=await q;
  countDisplay.textContent=(count||0)+' questions available';
  qCountI.value=count||0;qCountI.max=count||0;
}
inner.append(h('label',{cls:'label',html:'Mode'}));
const mb=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'20px'}});
[['tutor',' Tutor Mode'],['timed',' Timed Mode']].forEach(([v,l])=>{
const b=btn(l,'btn-outline',()=>{mode=v;mb.querySelectorAll('button').forEach(b2=>{b2.style.background='transparent';b2.style.color='var(--muted)';b2.style.border='1px solid var(--border)';});b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';tlWrap.style.display=v==='timed'?'block':'none';});
if(mode===v){b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';}
mb.append(b);
});
inner.append(mb);
const tlI=inp('60','number',String(timeLimit));tlI.min='1';tlI.max='180';tlI.oninput=e=>timeLimit=parseInt(e.target.value)||60;
const tlWrap=div({style:{marginBottom:'20px',display:mode==='timed'?'block':'none'}},[h('label',{cls:'label',html:'Time Limit (minutes)'}),tlI]);
inner.append(tlWrap);
const qCountWrap=div({style:{marginBottom:'20px'}},[h('label',{cls:'label',html:'Number of Questions'}),qCountI]);
inner.append(qCountWrap);
const startBtn=btn('Start Quiz →','btn-gold',async()=>{
if(!selectedTopics.length||!mode){alert('Please select at least one topic and mode');return;}
if(S.profile?.is_free_tier){
  const{data:sc}=await sb.from('vignette_scores').select('total').eq('user_id',S.user.id);
  const totalAnswered=(sc||[]).reduce((sum,s)=>sum+(s.total||0),0);
  if(totalAnswered>=10){
    inner.innerHTML='';
    inner.append(div({cls:'card',style:{textAlign:'center',padding:'40px 20px'}},[
      h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'14px',color:'var(--dim)',marginBottom:'20px'},html:"You've used your 10 free questions."}),
      btn('Upgrade for 4,000 Questions →','btn-gold',()=>showUpgradeModal())
    ]));
    return;
  }
  const remaining=Math.max(1,10-totalAnswered);
  const{data:qs}=await sb.from('vignette_questions').select('*').in('topic',selectedTopics).or('user_id.eq.'+S.user.id+',user_id.is.null').limit(remaining);
  if(!qs||!qs.length){alert('No questions for this topic yet.');return;}
  questions=qs;current=0;answers={};submitted=false;revealed={};
  if(mode==='timed')timeLeft=timeLimit*60;
  showQuiz();
  return;
}
const desiredCount=parseInt(qCountI.value)||40;
let qQuery=isFree?sb.from('vignette_questions').select('*').eq('is_global',true).in('topic',selectedTopics):sb.from('vignette_questions').select('*').in('topic',selectedTopics).or('user_id.eq.'+S.user.id+',user_id.is.null');
if(selectedSubsections&&selectedSubsections.length)qQuery=qQuery.in('subsection',selectedSubsections);
const{data:qs}=await qQuery.limit(desiredCount);
if(!qs||!qs.length){alert('No questions for this topic yet.');return;}
questions=qs;current=0;answers={};submitted=false;revealed={};
if(mode==='timed')timeLeft=timeLimit*60;
sessionStorage.setItem('vignette_resume',JSON.stringify({questions,current:0,answers:{},revealed:{},ruledOut:{},highlights:{},selectedTopics,selectedSubsections,mode,timeLimit,timeLeft:mode==='timed'?timeLimit*60:null}));
showQuiz();
},{style:{width:'100%'}});
inner.append(startBtn);
// Show past quiz performance
sb.from('vignette_scores').select('*').eq('user_id',S.user.id).order('created_at',{ascending:false}).limit(10).then(({data:scores})=>{
if(!scores||!scores.length)return;
const hCard=div({cls:'card',style:{marginTop:'24px'}});
hCard.append(h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'16px'},html:'Past Attempts'}));
scores.forEach(s=>{
const pct=Math.round(s.score/s.total*100);
const pctColor=pct>=80?'var(--teal)':pct>=50?'var(--gold)':'#ff8888';
const row=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}});
const left=div({},[h('span',{style:{fontSize:'13px',color:'var(--text)'},html:s.topic}),div({cls:'mono',style:{fontSize:'9px',marginTop:'2px'},html:s.mode+' mode · '+new Date(s.created_at).toLocaleDateString()})]);
const right=div({style:{display:'flex',gap:'12px',alignItems:'center'}});
right.append(h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',color:pctColor,fontWeight:'700'},html:pct+'%'}),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)'},html:s.score+'/'+s.total}));
if(s.questions&&s.answers){
right.append(btn('Review','btn-outline',()=>{
questions=s.questions;answers=s.answers;submitted=true;selTopic=s.topic;mode=s.mode;
showReview();
},{style:{fontSize:'10px',padding:'4px 10px'}}))}
row.append(left,right);hCard.append(row);});
const avgPct=Math.round(scores.reduce((sum,s)=>sum+(s.score/s.total*100),0)/scores.length);
const avgColor=avgPct>=80?'var(--teal)':avgPct>=50?'var(--gold)':'#ff8888';
hCard.append(div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'12px',paddingTop:'12px',borderTop:'1px solid var(--border)'}},[div({cls:'mono',html:'Average Score'}),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'20px',color:avgColor,fontWeight:'700'},html:avgPct+'%'})]));
inner.append(hCard);
});
}
function showQuiz(){
page.innerHTML='';page.append(nav);
const qNav=div({style:{background:'rgba(15,14,10,.97)',borderBottom:'1px solid var(--border)',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:'0',zIndex:'100'}});
const tEl=h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'16px',color:'var(--gold)',display:mode==='timed'?'inline':'none'},html:fmtMS(timeLeft)});
const pEl=h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--muted)'},html:(current+1)+' / '+questions.length});
qNav.append(h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--muted)',letterSpacing:'1px'},html:selTopic+' · '+(mode==='tutor'?'Tutor':'Timed')}),div({style:{display:'flex',gap:'16px',alignItems:'center'}},[tEl,pEl]));
page.append(qNav);
if(mode==='timed'){tInterval=setInterval(()=>{timeLeft--;tEl.textContent=fmtMS(timeLeft);if(timeLeft<60)tEl.style.color='#ff8888';if(timeLeft<=0){clearInterval(tInterval);submitQuiz();}},1000);}
const qi=div({style:{display:'grid',gridTemplateColumns:'200px 1fr',maxWidth:'1000px',margin:'0 auto',padding:'24px',gap:'24px'}});
const sidebar=div({});
sidebar.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Questions'}));
const ng=div({style:{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'4px'}});
questions.forEach((q,i)=>{
const nb=h('button',{style:{width:'32px',height:'32px',border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',fontFamily:"Inter,sans-serif",fontSize:'10px',cursor:'pointer',borderRadius:'2px'},html:String(i+1),id:'nb-'+i});
nb.onclick=()=>{current=i;updateQ();};ng.append(nb);
});
sidebar.append(ng);
if(mode==='timed'&&!submitted)sidebar.append(btn('Submit All →','btn-gold',()=>submitQuiz(),{style:{width:'100%',marginTop:'20px',fontSize:'11px'}}));
const mainArea=div({id:'quiz-main'});
qi.append(sidebar,mainArea);page.append(qi);
updateQ();
function updateQ(){
if(activeHighlightBtn){activeHighlightBtn.remove();activeHighlightBtn=null;}
const q=questions[current];mainArea.innerHTML='';pEl.textContent=(current+1)+' / '+questions.length;
questions.forEach((qq,i)=>{
const nb=document.getElementById('nb-'+i);if(!nb)return;
if(i===current){nb.style.border='1px solid var(--gold)';nb.style.background='#C8A96E22';nb.style.color='var(--gold)';}
else if(answers[qq.id]&&(submitted||mode==='tutor')){const ok=answers[qq.id]===qq.correct_answer;nb.style.border='1px solid '+(ok?'var(--teal)':'#8B0000');nb.style.background=ok?'#7EB8A422':'#8B000022';nb.style.color=ok?'var(--teal)':'#ff8888';}
else if(answers[qq.id]){nb.style.border='1px solid var(--gold)';nb.style.background='#C8A96E11';nb.style.color='var(--gold)';}
else{nb.style.border='1px solid var(--border)';nb.style.background='transparent';nb.style.color='var(--muted)';}
});
const qCard=div({cls:'card',style:{marginBottom:'16px'}});
qCard.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Question '+(current+1)}),h('p',{style:{fontSize:'15px',color:'var(--text)',lineHeight:'1.8'},html:q.question}));
mainArea.append(qCard);
// Highlight functionality
function removeHighlightBtn(){if(activeHighlightBtn){activeHighlightBtn.remove();activeHighlightBtn=null;}}
function saveHighlight(range,selectedText){
  if(!highlights[q.id])highlights[q.id]=[];
  const preRange=document.createRange();preRange.selectNodeContents(qCard);
  preRange.setEnd(range.startContainer,range.startOffset);const startOffset=preRange.toString().length;
  highlights[q.id].push({start:startOffset,text:selectedText});
  const sv=sessionStorage.getItem('vignette_resume');
  if(sv){const st=JSON.parse(sv);st.highlights=highlights;sessionStorage.setItem('vignette_resume',JSON.stringify(st));}
  updateQ();
}
function applyHighlights(){
  if(!highlights[q.id]||!highlights[q.id].length)return;
  const walker=document.createTreeWalker(qCard,NodeFilter.SHOW_TEXT,null,false);
  const textNodes=[];while(walker.nextNode())textNodes.push(walker.currentNode);
  highlights[q.id].forEach(hl=>{
    let remaining=hl.start;let targetNode=null;let targetStart=0;
    for(let node of textNodes){const len=node.nodeValue.length;if(remaining<len){targetNode=node;targetStart=remaining;break;}remaining-=len;}
    if(targetNode&&targetStart+hl.text.length<=targetNode.nodeValue.length){
      const rng=document.createRange();rng.setStart(targetNode,targetStart);rng.setEnd(targetNode,targetStart+hl.text.length);
      const span=document.createElement('span');span.className='highlight-text';span.textContent=hl.text;rng.deleteContents();rng.insertNode(span);
    }
  });
}
qCard.onmouseup=(e)=>{
  if(submitted)return;
  const sel=window.getSelection();
  if(!sel||sel.isCollapsed)return;
  const rng=sel.getRangeAt(0);const selectedText=rng.toString().trim();
  if(!selectedText||selectedText.length<3)return;
  saveHighlight(rng,selectedText);
  sel.removeAllRanges();
};
qCard.onclick=(e)=>{
  const target=e.target;
  if(target.classList&&target.classList.contains('highlight-text')){
    e.preventDefault();const text=target.textContent;
    if(highlights[q.id]){highlights[q.id]=highlights[q.id].filter(hl=>hl.text!==text);
    const sv=sessionStorage.getItem('vignette_resume');if(sv){const st=JSON.parse(sv);st.highlights=highlights;sessionStorage.setItem('vignette_resume',JSON.stringify(st));}updateQ();}
  }
};
applyHighlights();
['a','b','c','d','e'].forEach(opt=>{
const val=q['option_'+opt];if(!val)return;
const ob=h('button',{cls:'option-btn'});
const isSel=answers[q.id]===opt.toUpperCase();
const isCorr=q.correct_answer===opt.toUpperCase();
const isRev=revealed[q.id]||submitted;
const isRuledOut=ruledOut[q.id]?.includes(opt.toUpperCase());
if(isRev&&isCorr)ob.classList.add('correct');
else if(isRev&&isSel&&!isCorr)ob.classList.add('wrong');
else if(isSel)ob.classList.add('selected');
if(isRuledOut)ob.classList.add('ruled-out');
ob.append(h('strong',{style:{marginRight:'12px'},html:opt.toUpperCase()+'.'}),document.createTextNode(val));
ob.onclick=()=>{
  if(submitted)return;
  answers[q.id]=opt.toUpperCase();
  if(mode==='tutor')revealed[q.id]=true;
  const sv=sessionStorage.getItem('vignette_resume');
  if(sv){const st=JSON.parse(sv);st.current=current;st.answers=answers;st.revealed=revealed;st.ruledOut=ruledOut;st.highlights=highlights;sessionStorage.setItem('vignette_resume',JSON.stringify(st));}
  updateQ();
};
ob.oncontextmenu=(e)=>{
  e.preventDefault();
  if(submitted)return;
  if(!ruledOut[q.id])ruledOut[q.id]=[];
  const idx=ruledOut[q.id].indexOf(opt.toUpperCase());
  if(idx===-1){ruledOut[q.id].push(opt.toUpperCase());}else{ruledOut[q.id].splice(idx,1);}
  const sv=sessionStorage.getItem('vignette_resume');
  if(sv){const st=JSON.parse(sv);st.ruledOut=ruledOut;sessionStorage.setItem('vignette_resume',JSON.stringify(st));}
  updateQ();
};
mainArea.append(ob);
});
if((revealed[q.id]||submitted)&&q.explanation){
const exp=div({style:{background:'#0a1f18',border:'1px solid #7EB8A422',borderRadius:'2px',padding:'16px',marginTop:'16px'}});
exp.append(div({style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--teal)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'},html:'Explanation'}),h('p',{style:{fontSize:'14px',color:'var(--muted)',lineHeight:'1.7'},html:q.explanation}));
mainArea.append(exp);
}
const nr=div({style:{display:'flex',gap:'12px',marginTop:'16px'}});
if(current>0)nr.append(btn('← Prev','btn-outline',()=>{current--;updateQ();}));
if(current<questions.length-1)nr.append(btn('Next →','btn-gold',()=>{current++;updateQ();}));
if(current===questions.length-1&&mode==='tutor')nr.append(btn('See Results →','btn-gold',()=>submitQuiz()));
mainArea.append(nr);
}
}
async function submitQuiz(){
clearInterval(tInterval);submitted=true;
const score=questions.filter(q=>answers[q.id]===q.correct_answer).length;
await sb.from('vignette_scores').insert({user_id:S.user.id,topic:selTopic,score,total:questions.length,mode,answers:answers,questions:questions});
await sb.from('profiles').update({total_points:(S.profile?.total_points||0)+30}).eq('id',S.user.id);
showResults(score);
}
function showResults(score){
sessionStorage.removeItem('vignette_resume');
page.innerHTML='';page.append(nav);
const ri=div({cls:'inner-sm center',style:{minHeight:'80vh',flexDirection:'column'}});
const card=div({cls:'card fade',style:{maxWidth:'500px',width:'100%',textAlign:'center'}});
const pct=Math.round(score/questions.length*100);
card.append(
  h('span',{cls:'chapter',html:'Quiz Complete'}),
  div({style:{fontSize:'56px',margin:'16px 0'},html:pct>=70?ICONS.sparkles:ICONS.book}),
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'36px',marginBottom:'4px',color:'var(--gold)'},html:score+' / '+questions.length}),
  div({cls:'mono',style:{marginBottom:'8px'},html:pct+'% correct'}),
  h('p',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--muted)',marginBottom:'24px'},html:selTopic+' · '+mode+' mode'}),
  div({cls:'quote',style:{textAlign:'left',marginBottom:'24px'},html:pct>=80?'"Excellent. You know this topic well."':pct>=50?'"Good effort. Review the ones you missed."':'"Keep studying. Come back stronger."'})
);
const bw=div({style:{display:'grid',gap:'10px'}});
bw.append(
  btn('Review Answers →','btn-gold',()=>showReview()),
  btn('Try Again','btn-outline',()=>showSetup()),
  btn('Dashboard','btn-outline',()=>go('dashboard'))
);
card.append(bw);ri.append(card);page.append(ri);
}

function showReview(){
page.innerHTML='';page.append(nav);
const inner=div({cls:'inner-sm'});
inner.append(h('span',{cls:'chapter',html:'Review'}),h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'26px',marginBottom:'8px'},html:'Answer Review'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'32px'},html:selTopic+' — '+questions.length+' questions'}));
questions.forEach((q,i)=>{
const userAns=answers[q.id];
const correct=q.correct_answer;
const isCorrect=userAns===correct;
const qCard=div({style:{background:'var(--card)',border:'1px solid '+(isCorrect?'var(--teal)':'#8B000066'),borderRadius:'4px',padding:'20px',marginBottom:'16px'}});
qCard.append(
  div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}},[
    div({cls:'mono',style:{fontSize:'9px'},html:'Question '+(i+1)}),
    h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:isCorrect?'var(--teal)':'#ff8888',fontWeight:'700'},html:isCorrect?'✓ Correct':'✗ Incorrect'})
  ]),
  h('p',{style:{fontSize:'14px',color:'var(--text)',lineHeight:'1.8',marginBottom:'16px'},html:q.question})
);
['a','b','c','d','e'].forEach(opt=>{
  const val=q['option_'+opt];if(!val)return;
  const isUser=userAns===opt.toUpperCase();
  const isCorr=correct===opt.toUpperCase();
  const bg=isCorr?'#0a1f18':isUser&&!isCorr?'#1f0a0a':'transparent';
  const color=isCorr?'var(--teal)':isUser&&!isCorr?'#ff8888':'var(--muted)';
  const border=isCorr?'1px solid var(--teal)':isUser&&!isCorr?'1px solid #ff8888':'1px solid var(--border)';
  const row=div({style:{background:bg,border,borderRadius:'2px',padding:'10px 14px',marginBottom:'6px',display:'flex',gap:'10px'}});
  row.append(h('strong',{style:{color,flexShrink:'0'},html:opt.toUpperCase()+'.'}),div({style:{fontSize:'13px',color,lineHeight:'1.6'},html:val}));
  if(isCorr)row.append(h('span',{style:{marginLeft:'auto',color:'var(--teal)',fontSize:'11px'},html:'✓ Correct'}));
  if(isUser&&!isCorr)row.append(h('span',{style:{marginLeft:'auto',color:'#ff8888',fontSize:'11px'},html:'Your answer'}));
  qCard.append(row);
});
if(q.explanation){
  qCard.append(div({style:{background:'var(--bg)',border:'1px solid #7EB8A422',borderRadius:'2px',padding:'14px',marginTop:'12px'}},[
    div({style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--teal)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'},html:'Explanation'}),
    h('p',{style:{fontSize:'13px',color:'var(--muted)',lineHeight:'1.7'},html:q.explanation})
  ]));
}
inner.append(qCard);
});
inner.append(div({style:{display:'grid',gap:'10px',marginTop:'24px'}},[
  btn('Try Again','btn-gold',()=>showSetup()),
  btn('Dashboard','btn-outline',()=>go('dashboard'))
]));
page.append(inner);
}
showSetup();return page;
}
// ═══════════════════════════════
// LEADERBOARD
// ═══════════════════════════════
function feynman(){
const page=div({cls:'dash-page'});
if(S.profile?.is_free_tier===true){showUpgradeModal();return page;}
function getCurrentMonday(){const now=new Date();const day=now.getDay();const diff=day===0?6:day-1;const mon=new Date(now);mon.setDate(now.getDate()-diff);mon.setHours(0,0,0,0);return mon.toISOString().split('T')[0];}
const nav=div({cls:'dash-nav'},[
  div({cls:'logo',html:'Deo Fortis'}),
  div({style:{display:'flex',gap:'8px'}},[
    btn('Study','btn-outline',()=>go('study'),{style:{padding:'8px 16px'}}),
    btn('Dashboard','btn-outline',()=>go('dashboard'),{style:{padding:'8px 16px'}}),
    btn('Log Out','btn-outline',()=>sb.auth.signOut(),{style:{padding:'8px 16px'}})
  ])
]);
page.append(nav);
const container=div({cls:'inner'});
page.append(container);
container.append(div({style:{marginBottom:'32px'}},[
  h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--teal)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'},html:'Feynman Arena'}),
  h('h1',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'32px',color:'var(--gold)',marginBottom:'8px'},html:'Teach It. Own It.'}),
  h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--dim)'},html:"Explain like you're teaching a 6 year old. The best explanations get crowned 👑"})
]));
// TAB SYSTEM
let activeTab='submit';
const tabContainer=div({style:{display:'flex',gap:'12px',marginBottom:'24px',borderBottom:'1px solid var(--border)',paddingBottom:'12px'}});
const submitTabBtn=btn('Submit','btn',()=>{activeTab='submit';renderTabs();},{style:{padding:'8px 20px',background:'transparent',color:'var(--text)',border:'1px solid var(--border)',borderRadius:'4px'}});
const riddleTabBtn=btn('Riddle Decks','btn',()=>{activeTab='riddle';renderTabs();},{style:{padding:'8px 20px',background:'transparent',color:'var(--text)',border:'1px solid var(--border)',borderRadius:'4px'}});
const emojiTabBtn=btn('Emoji Bitz','btn',()=>{activeTab='emoji';renderTabs();},{style:{padding:'8px 20px',background:'transparent',color:'var(--text)',border:'1px solid var(--border)',borderRadius:'4px'}});
tabContainer.append(submitTabBtn,riddleTabBtn,emojiTabBtn);
container.append(tabContainer);
const submitSection=div({id:'submit-section'});
const riddleSection=div({id:'riddle-section',style:{display:'none'}});
const emojiSection=div({id:'emoji-section',style:{display:'none'}});
container.append(submitSection,riddleSection,emojiSection);
function renderTabs(){
  submitSection.style.display=activeTab==='submit'?'block':'none';
  riddleSection.style.display=activeTab==='riddle'?'block':'none';
  emojiSection.style.display=activeTab==='emoji'?'block':'none';
  const isSubmit=activeTab==='submit';const isRiddle=activeTab==='riddle';const isEmoji=activeTab==='emoji';
  submitTabBtn.style.background=isSubmit?'var(--gold)':'transparent';submitTabBtn.style.color=isSubmit?'var(--bg)':'var(--text)';submitTabBtn.style.border=isSubmit?'1px solid var(--gold)':'1px solid var(--border)';
  riddleTabBtn.style.background=isRiddle?'var(--gold)':'transparent';riddleTabBtn.style.color=isRiddle?'var(--bg)':'var(--text)';riddleTabBtn.style.border=isRiddle?'1px solid var(--gold)':'1px solid var(--border)';
  emojiTabBtn.style.background=isEmoji?'var(--gold)':'transparent';emojiTabBtn.style.color=isEmoji?'var(--bg)':'var(--text)';emojiTabBtn.style.border=isEmoji?'1px solid var(--gold)':'1px solid var(--border)';
  if(activeTab==='riddle')loadRiddleDecksPage();
  if(activeTab==='emoji')loadEmojiDecksPage();
}
// SUBMIT TAB
let selectedType=null,submitSuccessDiv=null;
const topicInput=inp('Topic e.g. Gram Positive Bacteria','text','');
topicInput.style.marginBottom='16px';
const contentTextarea=h('textarea',{cls:'input',placeholder:'Write your explanation here...',style:{minHeight:'120px',resize:'vertical',width:'100%',marginBottom:'16px'}});
const typeContainer=div({style:{display:'flex',gap:'8px',marginBottom:'16px'}});
const typeButtons=[{label:'Explain',value:'explain'},{label:'Riddle',value:'riddle'},{label:'Emoji Bitz',value:'emoji'}];
function updateTypeSelection(value){
  selectedType=value;
  typeButtons.forEach(bd=>{const el=document.getElementById('type-btn-'+bd.value);if(el){if(bd.value===value){el.style.background='var(--gold)';el.style.color='var(--bg)';el.style.border='1px solid var(--gold)';}else{el.style.background='transparent';el.style.color='var(--text)';el.style.border='1px solid var(--border)';}}});
}
typeButtons.forEach(bd=>{const tb=btn(bd.label,'btn-outline',()=>updateTypeSelection(bd.value),{style:{padding:'6px 14px',fontSize:'11px'}});tb.id='type-btn-'+bd.value;typeContainer.append(tb);});
const submitBtn=btn('Submit →','btn-gold',async()=>{
  const topic=topicInput.value.trim();const content=contentTextarea.value.trim();
  if(!topic){const e=div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'#8B3A3A',textAlign:'center',marginTop:'12px'},html:'Please enter a topic.'});submitCard.append(e);setTimeout(()=>e.remove(),2000);return;}
  if(!content){const e=div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'#8B3A3A',textAlign:'center',marginTop:'12px'},html:'Please enter your explanation.'});submitCard.append(e);setTimeout(()=>e.remove(),2000);return;}
  if(!selectedType){const e=div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'#8B3A3A',textAlign:'center',marginTop:'12px'},html:'Please select a type.'});submitCard.append(e);setTimeout(()=>e.remove(),2000);return;}
  const{error}=await sb.from('feynman_submissions').insert({user_id:S.user.id,user_name:S.profile?.full_name||S.user.email,topic,type:selectedType,content,status:'pending',week_of:getCurrentMonday(),is_king:false,points_awarded:false});
  if(!error){
    topicInput.value='';contentTextarea.value='';selectedType=null;updateTypeSelection(null);
    if(submitSuccessDiv)submitSuccessDiv.remove();
    submitSuccessDiv=div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--teal)',textAlign:'center',marginTop:'12px'},html:"✓ Submitted! We'll review it soon."});
    submitCard.append(submitSuccessDiv);
    setTimeout(()=>{if(submitSuccessDiv)submitSuccessDiv.remove();submitSuccessDiv=null;},1500);
    (async()=>{await loadWallOfFame();})();
  }else{const e=div({style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'#8B3A3A',textAlign:'center',marginTop:'12px'},html:'Failed to submit. Please try again.'});submitCard.append(e);setTimeout(()=>e.remove(),2000);}
},{style:{width:'100%'}});
const submitCard=div({cls:'card',style:{marginBottom:'32px'}});
// Voice recognition setup
let recognition=null;let isRecording=false;
const SpeechRecognitionAPI=window.SpeechRecognition||window.webkitSpeechRecognition;
const micWrapper=div({style:{display:'none',marginBottom:'12px'}});
if(SpeechRecognitionAPI){
  const micBtn=btn('','btn-outline',()=>{
    if(isRecording&&recognition){recognition.stop();return;}
    recognition=new SpeechRecognitionAPI();
    recognition.continuous=true;recognition.interimResults=true;recognition.lang='en-US';
    let baseText=contentTextarea.value;
    let finalAdded='';
    recognition.onstart=()=>{
      isRecording=true;
      micBtn.style.borderColor='#ff4444';micBtn.style.color='#ff4444';micBtn.style.background='rgba(255,68,68,0.08)';
      micBtn.innerHTML=ICONS.mic+'<span style="margin-left:6px;font-size:11px">Stop Recording</span>';
    };
    recognition.onresult=(event)=>{
      let interim='';
      for(let i=event.resultIndex;i<event.results.length;i++){
        const t=event.results[i][0].transcript;
        if(event.results[i].isFinal){finalAdded+=t+' ';}
        else{interim+=t;}
      }
      contentTextarea.value=baseText+(finalAdded?finalAdded:'')+( interim?'['+interim+']':'');
    };
    recognition.onerror=(e)=>{console.error('Speech error:',e.error);recognition.stop();};
    recognition.onend=()=>{
      isRecording=false;
      contentTextarea.value=(baseText+finalAdded).trim();
      micBtn.style.borderColor='';micBtn.style.color='';micBtn.style.background='';
      micBtn.innerHTML=ICONS.mic+'<span style="margin-left:6px;font-size:11px">Speak to Type</span>';
    };
    recognition.start();
  },{style:{display:'inline-flex',alignItems:'center',padding:'6px 14px',fontSize:'11px'}});
  micBtn.innerHTML=ICONS.mic+'<span style="margin-left:6px;font-size:11px">Speak to Type</span>';
  micWrapper.append(micBtn);
  // Hook into updateTypeSelection to show/hide mic
  const _origUpdate=updateTypeSelection;
  updateTypeSelection=(value)=>{
    _origUpdate(value);
    micWrapper.style.display=value==='explain'?'block':'none';
    if(value!=='explain'&&isRecording&&recognition)recognition.stop();
  };
}
submitCard.append(
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'4px'},html:'Submit Your Feynman'}),
  h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--dim)',marginBottom:'16px'},html:'explain / riddle / emoji'}),
  topicInput,typeContainer,contentTextarea,micWrapper,submitBtn
);
const wallCard=div({cls:'card',style:{marginBottom:'32px'}});
wallCard.append(
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'4px'},html:'Wall of Fame'}),
  h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--dim)',marginBottom:'16px'},html:'approved feynman submissions'})
);
const submissionsList=div({style:{display:'flex',flexDirection:'column',gap:'16px'}});
wallCard.append(submissionsList);
submitSection.append(submitCard,wallCard);
function showFullSubmission(sub){
  const overlay=div({style:{position:'fixed',top:'0',left:'0',right:'0',bottom:'0',background:'rgba(0,0,0,0.85)',zIndex:'9999',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}});
  let tc='var(--teal)';if(sub.type==='riddle')tc='var(--gold)';if(sub.type==='emoji')tc='#8B5CF6';
  const modal=div({style:{maxWidth:'600px',width:'100%',background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',padding:'32px',maxHeight:'90vh',overflowY:'auto'}});
  modal.append(
    div({style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px'}},[
      div({},[
        h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',fontWeight:'bold',color:'var(--text)',marginBottom:'8px'},html:sub.user_name||'Anonymous'}),
        div({style:{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}},[
          h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',padding:'2px 8px',borderRadius:'2px',background:tc,color:'var(--bg)'},html:sub.type.toUpperCase()}),
          h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)'},html:sub.topic}),
          h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--muted)'},html:'Week of '+sub.week_of})
        ])
      ]),
      btn('✕','',()=>overlay.remove(),{style:{background:'none',border:'none',color:'var(--dim)',fontSize:'20px',cursor:'pointer',padding:'4px'}})
    ]),
    h('div',{style:{background:'var(--card2)',padding:'20px',borderRadius:'4px',fontFamily:"Inter,sans-serif",fontSize:'13px',color:'var(--text)',lineHeight:'1.5',whiteSpace:'pre-wrap'},html:sub.content})
  );
  overlay.append(modal);document.body.append(overlay);
}
async function loadWallOfFame(){
  submissionsList.innerHTML='';
  const{data:subs}=await sb.from('feynman_submissions').select('*').eq('status','approved').order('created_at',{ascending:false}).limit(20);
  if(!subs||!subs.length){submissionsList.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',textAlign:'center',padding:'20px'},html:'No approved submissions yet. Be the first! ✨'}));return;}
  subs.forEach(sub=>{
    let tc='var(--teal)';if(sub.type==='riddle')tc='var(--gold)';if(sub.type==='emoji')tc='#8B5CF6';
    const card=div({style:{background:'var(--card2)',borderRadius:'4px',padding:'16px',border:sub.is_king?'1px solid var(--gold)':'1px solid var(--border)'}});
    if(sub.is_king){card.append(div({style:{float:'right',display:'flex',alignItems:'center',gap:'4px',background:'rgba(200,169,110,0.1)',padding:'4px 8px',borderRadius:'4px'}},[h('span',{style:{fontSize:'14px'},html:'👑'}),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--gold)'},html:'Feynman King'})]));}
    const preview=sub.content.length>120?sub.content.substring(0,120)+'...':sub.content;
    card.append(div({},[
      div({style:{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap',marginBottom:'12px'}},[
        h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',fontWeight:'bold',color:'var(--text)'},html:sub.user_name||'Anonymous'}),
        h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',padding:'2px 8px',borderRadius:'2px',background:tc,color:'var(--bg)'},html:sub.type.toUpperCase()}),
        h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)'},html:sub.topic}),
        h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--muted)'},html:'Week of '+sub.week_of})
      ]),
      h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--muted)',lineHeight:'1.5',marginBottom:'12px'},html:preview}),
      btn('See Feynman →','btn-outline',()=>showFullSubmission(sub),{style:{fontSize:'10px',padding:'4px 12px'}})
    ]));
    submissionsList.append(card);
  });
}
// RIDDLE DECKS TAB
async function loadRiddleDecksPage(){
  riddleSection.innerHTML='';
  const{data:decks}=await sb.from('flashcard_decks').select('*').eq('type','riddle').order('unlock_order',{ascending:true});
  const{data:progress}=await sb.from('flashcard_progress').select('deck_id,completed').eq('user_id',S.user.id);
  const completedMap=new Map();progress?.forEach(p=>completedMap.set(p.deck_id,p.completed));
  if(!decks||!decks.length){riddleSection.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--dim)',textAlign:'center',padding:'40px'},html:'No riddle decks available yet.'}));return;}
  const grid=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'16px'}});
  for(let i=0;i<decks.length;i++){
    const deck=decks[i];
    const isCompleted=completedMap.get(deck.id)===true;
    const isUnlocked=deck.unlock_order===1||completedMap.get(decks[i-1]?.id)===true;
    const card=div({style:{background:'var(--card2)',borderRadius:'4px',padding:'20px',border:isCompleted?'1px solid var(--teal)':(isUnlocked?'1px solid var(--gold)':'1px solid var(--border)'),opacity:isUnlocked?1:0.5}});
    card.append(div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}},[
      h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'20px',color:'var(--gold)'},html:deck.name}),
      h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)',background:'var(--card)',padding:'4px 8px',borderRadius:'4px'},html:`Level ${deck.unlock_order}`})
    ]));
    if(isCompleted){
      card.append(div({style:{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}},[h('span',{style:{fontSize:'16px'},html:'✓'}),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--teal)'},html:'Completed'})]),
      btn('Play Again →','btn-outline',()=>showDeckPlayer(deck,'riddle'),{style:{width:'100%'}}));
    }else if(isUnlocked){
      card.append(btn('Start →','btn-gold',()=>showDeckPlayer(deck,'riddle'),{style:{width:'100%'}}));
    }else{
      card.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',textAlign:'center',padding:'8px'},html:`Complete Level ${deck.unlock_order-1} first`}));
    }
    grid.append(card);
  }
  riddleSection.append(grid);
}
// EMOJI BITZ TAB
async function loadEmojiDecksPage(){
  emojiSection.innerHTML='';
  const{data:decks}=await sb.from('flashcard_decks').select('*').eq('type','emoji').order('unlock_order',{ascending:true});
  const{data:progress}=await sb.from('flashcard_progress').select('deck_id,completed').eq('user_id',S.user.id);
  const completedMap=new Map();progress?.forEach(p=>completedMap.set(p.deck_id,p.completed));
  if(!decks||!decks.length){emojiSection.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--dim)',textAlign:'center',padding:'40px'},html:'No emoji bitz decks available yet.'}));return;}
  const grid=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'16px'}});
  for(let i=0;i<decks.length;i++){
    const deck=decks[i];
    const isCompleted=completedMap.get(deck.id)===true;
    const isUnlocked=deck.unlock_order===1||completedMap.get(decks[i-1]?.id)===true;
    const card=div({style:{background:'var(--card2)',borderRadius:'4px',padding:'20px',border:isCompleted?'1px solid var(--teal)':(isUnlocked?'1px solid var(--gold)':'1px solid var(--border)'),opacity:isUnlocked?1:0.5}});
    card.append(div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}},[
      h('div',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'20px',color:'var(--gold)'},html:deck.name}),
      h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)',background:'var(--card)',padding:'4px 8px',borderRadius:'4px'},html:`Level ${deck.unlock_order}`})
    ]));
    if(isCompleted){
      card.append(div({style:{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}},[h('span',{style:{fontSize:'16px'},html:'✓'}),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--teal)'},html:'Completed'})]),
      btn('Play Again →','btn-outline',()=>showDeckPlayer(deck,'emoji'),{style:{width:'100%'}}));
    }else if(isUnlocked){
      card.append(btn('Start →','btn-gold',()=>showDeckPlayer(deck,'emoji'),{style:{width:'100%'}}));
    }else{
      card.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',textAlign:'center',padding:'8px'},html:`Complete Level ${deck.unlock_order-1} first`}));
    }
    grid.append(card);
  }
  emojiSection.append(grid);
}
// DECK PLAYER
async function showDeckPlayer(deck,type){
  const{data:cards}=await sb.from('flashcards').select('*').eq('deck_id',deck.id);
  if(!cards||!cards.length)return;
  let currentIndex=0,revealed=false,gotIt=0;
  const overlay=div({style:{position:'fixed',top:'0',left:'0',right:'0',bottom:'0',background:'rgba(0,0,0,0.95)',zIndex:'10000',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}});
  const modal=div({style:{maxWidth:'600px',width:'100%',background:'var(--card)',border:'1px solid var(--gold)',borderRadius:'8px',padding:'32px',maxHeight:'90vh',overflowY:'auto'}});
  function renderCard(){
    modal.innerHTML='';
    const card=cards[currentIndex];
    modal.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',marginBottom:'8px',textAlign:'right'},html:`${currentIndex+1} / ${cards.length}`}));
    modal.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--teal)',marginBottom:'16px',textAlign:'right'},html:`✓ ${gotIt} correct so far`}));
    modal.append(div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}},[
      h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',color:'var(--gold)'},html:deck.name}),
      btn('✕','',()=>overlay.remove(),{style:{background:'none',border:'none',color:'var(--dim)',fontSize:'24px',cursor:'pointer'}})
    ]));
    modal.append(div({style:{textAlign:'center',padding:'40px 20px',background:'var(--card2)',borderRadius:'8px',marginBottom:'24px'}},[
      h('div',{style:{fontFamily:type==='riddle'?"'Plus Jakarta Sans',sans-serif":'monospace',fontSize:type==='riddle'?'28px':'48px',color:'var(--text)',lineHeight:'1.3',whiteSpace:'pre-wrap'},html:card.question})
    ]));
    if(!revealed){
      modal.append(btn('Reveal Answer →','btn-outline',()=>{revealed=true;renderCard();},{style:{width:'100%',marginBottom:'16px'}}));
    }else{
      modal.append(div({style:{background:'rgba(200,169,110,0.1)',padding:'20px',borderRadius:'8px',marginBottom:'16px'}},[
        h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',color:'var(--gold)',marginBottom:'8px'},html:'Answer:'}),
        h('div',{style:{fontFamily:'monospace',fontSize:'14px',color:'var(--text)',lineHeight:'1.4'},html:card.answer})
      ]));
      if(card.hint){modal.append(div({style:{background:'var(--card2)',padding:'12px',borderRadius:'8px',marginBottom:'16px'}},[h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)'},html:'Hint: '+card.hint})]));}
      modal.append(div({style:{display:'flex',gap:'12px'}},[
        btn('✓ Got It','btn-teal',()=>{gotIt++;if(currentIndex+1<cards.length){currentIndex++;revealed=false;renderCard();}else{completeDeck();}},{style:{flex:'1'}}),
        btn("✗ Didn't Get It",'btn-outline',()=>{if(currentIndex+1<cards.length){currentIndex++;revealed=false;renderCard();}else{completeDeck();}},{style:{flex:'1'}})
      ]));
    }
  }
  async function completeDeck(){
    const total=cards.length;
    const score=Math.round((gotIt/total)*100);
    const passed=score>=65;
    modal.innerHTML='';
    if(passed){
      await sb.from('flashcard_progress').upsert({user_id:S.user.id,deck_id:deck.id,completed:true,completed_at:new Date().toISOString()});
    await sb.from('profiles').update({total_points:(S.profile?.total_points||0)+10}).eq('id',S.user.id);
    if(S.profile)S.profile.total_points=(S.profile.total_points||0)+10;
      const{data:nextDeck}=await sb.from('flashcard_decks').select('id').eq('type',type).eq('unlock_order',deck.unlock_order+1).maybeSingle();
      modal.append(
        h('div',{style:{fontSize:'48px',textAlign:'center',marginBottom:'16px'},html:ICONS.sparkles}),
        h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',color:'var(--gold)',textAlign:'center',marginBottom:'8px'},html:`Level ${deck.unlock_order} Complete!`}),
        h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'16px',color:'var(--teal)',textAlign:'center',marginBottom:'8px'},html:`You scored ${score}%`}),
        nextDeck?h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',color:'var(--teal)',textAlign:'center',marginBottom:'24px'},html:'Next Level Unlocked!'}):h('div',{style:{marginBottom:'24px'}}),
        btn('Close','btn-gold',()=>{overlay.remove();if(activeTab==='riddle')loadRiddleDecksPage();if(activeTab==='emoji')loadEmojiDecksPage();},{style:{width:'100%'}})
      );
    }else{
      modal.append(
        h('div',{style:{fontSize:'48px',textAlign:'center',marginBottom:'16px'},html:ICONS.zap}),
        h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'24px',color:'var(--gold)',textAlign:'center',marginBottom:'8px'},html:'So Close!'}),
        h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'16px',color:'var(--dim)',textAlign:'center',marginBottom:'8px'},html:`You scored ${score}% — you need 65% to unlock the next level.`}),
        h('div',{style:{marginBottom:'24px'}}),
        btn('Try Again →','btn-gold',()=>{currentIndex=0;gotIt=0;revealed=false;renderCard();},{style:{width:'100%',marginBottom:'12px'}}),
        btn('Exit','btn-outline',()=>{overlay.remove();if(activeTab==='riddle')loadRiddleDecksPage();if(activeTab==='emoji')loadEmojiDecksPage();},{style:{width:'100%'}})
      );
    }
  }
  renderCard();overlay.append(modal);document.body.append(overlay);
}
(async()=>{await loadWallOfFame();})();
renderTabs();
return page;
}

function leaderboard(){
const page=div({});
const nav=div({cls:'dash-nav'});
nav.append(div({cls:'logo',html:'Deo Fortis'}),btn('← Dashboard','btn-outline',()=>go('dashboard'),{style:{padding:'8px 16px'}}));
page.append(nav);
const inner=div({cls:'inner-sm'});
inner.append(h('span',{cls:'chapter',html:'Rankings'}),h('h1',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'48px',fontWeight:'700',marginBottom:'8px'},html:'The <em class="gold-em">Leaderboard</em>'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'40px'},html:'Rankings based on total study hours. Updated in real time.'}));
const board=div({cls:'card',style:{marginBottom:'32px'},id:'board',html:'<p style="font-size:14px;color:var(--dim);text-align:center;padding:20px">Loading...</p>'});
inner.append(board);
const bc=div({cls:'card',style:{textAlign:'center',borderColor:'#C8A96E33',borderTopWidth:'3px',borderTopColor:'var(--gold)'}});
bc.append(div({style:{fontSize:'32px',marginBottom:'12px'},html:ICONS.book}),h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'8px'},html:'Want Personal Tutoring?'}),h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.7',marginBottom:'20px'},html:'Work directly with me. Get personalised guidance and full portal access.'}),btn('Book a Session →','btn-gold',()=>showBooking()));
inner.append(bc);page.append(inner);
(async()=>{
const{data:leaderUsers}=await sb.from('profiles').select('id,full_name,total_points,total_study_minutes,streak_count').eq('status','approved').order('total_points',{ascending:false}).limit(20);
const b=document.getElementById('board');if(!b)return;
if(!leaderUsers||!leaderUsers.length){b.innerHTML='<p style="font-size:14px;color:var(--dim);text-align:center;padding:20px">No data yet. Be the first to clock in!</p>';return;}
const now=new Date();
const thisMonday=new Date(now);thisMonday.setDate(now.getDate()-now.getDay()+(now.getDay()===0?-6:1));thisMonday.setHours(0,0,0,0);
const lastMonday=new Date(thisMonday);lastMonday.setDate(lastMonday.getDate()-7);
const[twScores,lwScores,twDecks,lwDecks,twFeynman,lwFeynman]=await Promise.all([
  sb.from('vignette_scores').select('user_id,score').gte('created_at',thisMonday.toISOString()),
  sb.from('vignette_scores').select('user_id,score').gte('created_at',lastMonday.toISOString()).lt('created_at',thisMonday.toISOString()),
  sb.from('anki_results').select('user_id').gte('created_at',thisMonday.toISOString()),
  sb.from('anki_results').select('user_id').gte('created_at',lastMonday.toISOString()).lt('created_at',thisMonday.toISOString()),
  sb.from('feynman_submissions').select('user_id').eq('points_awarded',true).gte('created_at',thisMonday.toISOString()),
  sb.from('feynman_submissions').select('user_id').eq('points_awarded',true).gte('created_at',lastMonday.toISOString()).lt('created_at',thisMonday.toISOString())
]);
const calcPts=(scores,decks,feynman)=>{const m={};(scores.data||[]).forEach(s=>m[s.user_id]=(m[s.user_id]||0)+30);(decks.data||[]).forEach(d=>m[d.user_id]=(m[d.user_id]||0)+20);(feynman.data||[]).forEach(f=>m[f.user_id]=(m[f.user_id]||0)+50);return m;};
const thisPts=calcPts(twScores,twDecks,twFeynman);
const lastPts=calcPts(lwScores,lwDecks,lwFeynman);
const medals=['1st','2nd','3rd'];
b.innerHTML='';
leaderUsers.forEach((u,i)=>{
  const tw=thisPts[u.id]||0;const lw=lastPts[u.id]||0;
  const trend=tw>lw?'↑':tw<lw?'↓':'—';
  const trendColor=tw>lw?'#4ade80':tw<lw?'#ff4444':'var(--muted)';
  const r=div({cls:'leaderboard-row',style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--border)'}});
  const left=div({style:{display:'flex',alignItems:'center',gap:'12px'}});
  const rankEl=h('span',{style:{fontSize:'13px',color:'var(--gold)',fontWeight:'700',width:'36px',flexShrink:'0'}});rankEl.textContent=medals[i]||(i+1)+'.';
  const nameEl=h('span',{style:{fontSize:'15px',color:'var(--text)',fontWeight:'500'}});nameEl.textContent=u.full_name||'—';
  const streakEl=h('span',{style:{fontSize:'12px',color:'var(--muted)'}});streakEl.textContent='🔥 '+(u.streak_count||0);
  left.append(rankEl,nameEl,streakEl);
  const right2=div({style:{display:'flex',alignItems:'center',gap:'12px'}});
  const ptsEl=h('span',{style:{fontSize:'13px',color:'var(--gold)',fontWeight:'600'}});ptsEl.textContent=(u.total_points||0)+' pts';
  const hoursEl=h('span',{style:{fontSize:'12px',color:'var(--muted)'}});hoursEl.textContent=Math.floor((u.total_study_minutes||0)/60)+'h';
  const trendEl=h('span',{style:{fontSize:'16px',color:trendColor,fontWeight:'700'}});trendEl.textContent=trend;
  right2.append(hoursEl,ptsEl,trendEl);
  r.append(left,right2);b.append(r);
});
})();
async function showBooking(){
const{data:pkgs}=await sb.from('tutoring_packages').select('*').order('id');
const ov=div({cls:'modal-bg'});ov.onclick=e=>{if(e.target===ov)ov.remove();};
const box=div({cls:'card',style:{maxWidth:'480px',width:'100%'}});
const nI=inp('Your name');const eI=inp('your@email.com','email');
const pSel=h('select',{cls:'input',style:{cursor:'pointer'}});
pSel.append(h('option',{value:'',html:'Select a package'}));
(pkgs||[]).forEach(p=>pSel.append(h('option',{value:p.name,html:p.name+' — '+p.price})));
const mI=h('textarea',{cls:'input',placeholder:'Tell me about your study goals...',style:{minHeight:'80px',resize:'vertical'}});
const sBtn=btn('Send Request','btn-gold',async()=>{
if(!nI.value||!eI.value||!pSel.value)return;
await sb.from('booking_requests').insert({name:nI.value,email:eI.value,package:pSel.value,message:mI.value});
sendAdminEmail(' New Booking Request — Deo Fortis','<h2>New Tutoring Booking</h2><p><b>Name:</b> '+nI.value+'</p><p><b>Email:</b> '+eI.value+'</p><p><b>Package:</b> '+pSel.value+'</p><p><b>Message:</b> '+mI.value+'</p>');
box.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:48px;margin-bottom:16px"> </div><h2 style="font-family:Playfair Display,serif;font-size:22px;margin-bottom:12px">Request Sent!</h2><p style="color:var(--muted);font-size:14px;line-height:1.7">You will be contacted via email to confirm your booking.</p></div>';
setTimeout(()=>ov.remove(),3000);
});
box.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'20px'},html:'Book a Session'}),field('Full Name',nI),field('Email',eI),field('Package',pSel),field('What do you need help with?',mI),div({style:{display:'flex',gap:'12px'}},[sBtn,btn('Cancel','btn-outline',()=>ov.remove())]));
ov.append(box);document.body.append(ov);
}
return page;
}
// ═══════════════════════════════
// ADMIN
// ═══════════════════════════════
function admin(){
const page=div({});
const PASS='deofortis2024';
let authed=false;
function showLogin(){
page.innerHTML='';
const wrap=div({cls:'center',style:{minHeight:'100vh',padding:'24px'}});
const card=div({cls:'card fade',style:{maxWidth:'360px',width:'100%'}});
const pI=inp('Enter admin password','password');
const eEl=div({cls:'err hidden'});
const entBtn=btn('Enter','btn-gold',()=>{if(pI.value===PASS){authed=true;showAdminPanel();}else{eEl.classList.remove('hidden');eEl.textContent='Incorrect password.';}},{style:{width:'100%',marginBottom:'16px'}});
pI.onkeydown=e=>{if(e.key==='Enter')entBtn.click();};
card.append(div({style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'4px'},html:'Deo Fortis'}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'16px'},html:'Admin Access'}),eEl,h('label',{cls:'label',html:'Password'}),pI,h('br'),entBtn,h('p',{style:{fontSize:'12px',color:'var(--dim)',textAlign:'center'},html:'<button onclick="go(\'landing\')" style="background:none;border:none;color:var(--dim);cursor:pointer;font-size:12px">← Back to site</button>'}));
wrap.append(card);page.append(wrap);
}
async function showAdminPanel(){
page.innerHTML='';
const aN=div({style:{background:'rgba(15,14,10,.97)',borderBottom:'1px solid var(--border)',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:'0',zIndex:'100'}});
aN.append(div({cls:'logo',html:'Admin — Deo Fortis'}),btn('← Site','btn-outline',()=>go('landing'),{style:{padding:'8px 16px'}}));
page.append(aN);
const tabs=div({style:{display:'none'}});
const content=div({cls:'inner-md',style:{padding:'24px'}});
let curTab='settings';
const tabDefs=[['settings','⚙ Settings'],['users','Users'],['recalls','Recalls'],['flashcards','Flashcards'],['questions','Q-Bank'],['testimonials','Reviews'],['packages','Packages'],['bookings','Bookings'],['feynman','👑 Feynman']];
tabDefs.forEach(([id,label])=>{
const tb=h('button',{cls:'tab-btn'+(id===curTab?' active':''),html:label});
tb.onclick=()=>{curTab=id;loadTab(id);};
tabs.append(tb);
});

// Badge element refs and sidebar row refs
const badgeEls={};
const sidebarRows={};

function setActiveTab(tabId){
  Object.keys(sidebarRows).forEach(id=>{
    const row=sidebarRows[id];
    const active=id===tabId;
    row.style.borderLeftColor=active?'var(--gold)':'transparent';
    row.style.color=active?'var(--gold)':'var(--muted)';
    row.style.backgroundColor=active?'rgba(200,169,110,0.08)':'transparent';
    row.style.fontWeight=active?'600':'400';
  });
}

const tabIconMap={settings:ICONS.target,users:ICONS.layers,recalls:ICONS.pencil,flashcards:ICONS.book,questions:ICONS.question,testimonials:ICONS.star,packages:ICONS.zap,bookings:ICONS.mail,feynman:ICONS.brain};

// Build sidebar
const sidebar=div({style:{width:'220px',flexShrink:'0',background:'var(--card)',borderRight:'1px solid var(--border)',minHeight:'calc(100vh - 57px)',overflowY:'auto',position:'sticky',top:'57px',paddingTop:'8px'}});

tabDefs.forEach(([id,label])=>{
  const isActive=id===curTab;
  const hasBadge=id==='users'||id==='recalls'||id==='feynman';
  const iconEl=h('span',{style:{display:'inline-block',width:'20px',marginRight:'10px',verticalAlign:'middle',flexShrink:'0'},html:tabIconMap[id]||ICONS.file});
  const labelEl=h('span',{style:{flex:'1',verticalAlign:'middle'}});
  labelEl.textContent=label;
  const badgeEl=h('span',{style:{display:'none',background:'var(--gold)',color:'#0F0E0A',fontSize:'10px',fontWeight:'700',padding:'2px 6px',borderRadius:'10px',marginLeft:'6px',lineHeight:'1.4'}});
  badgeEl.textContent='0';
  if(hasBadge)badgeEls[id]=badgeEl;
  const row=div({style:{display:'flex',alignItems:'center',padding:'11px 16px',margin:'2px 8px',borderRadius:'4px',cursor:'pointer',borderLeft:'3px solid '+(isActive?'var(--gold)':'transparent'),color:isActive?'var(--gold)':'var(--muted)',background:isActive?'rgba(200,169,110,0.08)':'transparent',fontFamily:'Inter,sans-serif',fontSize:'13px',fontWeight:isActive?'600':'400',transition:'background 0.15s'}});
  row.append(iconEl,labelEl,badgeEl);
  row.onmouseenter=()=>{if(sidebarRows[id].style.backgroundColor!=='rgba(200,169,110,0.08)')row.style.background='rgba(200,169,110,0.04)';};
  row.onmouseleave=()=>{if(sidebarRows[id].style.backgroundColor!=='rgba(200,169,110,0.08)')row.style.background='transparent';};
  row.onclick=()=>{curTab=id;loadTab(id);setActiveTab(id);};
  sidebarRows[id]=row;
  sidebar.append(row);
});

// Fetch badge counts
(async()=>{
  const[uRes,rRes,fRes]=await Promise.all([
    sb.from('profiles').select('id',{count:'exact',head:true}).eq('status','pending'),
    sb.from('recall_requests').select('id',{count:'exact',head:true}).eq('status','pending'),
    sb.from('feynman_submissions').select('id',{count:'exact',head:true}).eq('status','pending')
  ]);
  const counts={users:uRes.count||0,recalls:rRes.count||0,feynman:fRes.count||0};
  Object.keys(badgeEls).forEach(id=>{
    const c=counts[id]||0;
    if(c>0){badgeEls[id].textContent=String(c);badgeEls[id].style.display='inline-block';}
    else{badgeEls[id].style.display='none';}
  });
})();

// Admin layout — sidebar + content
const adminLayout=div({style:{display:'flex',minHeight:'calc(100vh - 57px)'}});
adminLayout.append(sidebar,div({style:{flex:'1',overflowY:'auto'}},[tabs,content]));
page.append(adminLayout);
let currentFilter='pending';
async function loadTab(tab){
content.innerHTML='<p style="color:var(--dim);font-size:14px;padding:24px">Loading...</p>';
if(tab==='settings'){
const{data:s}=await sb.from('admin_settings').select('*').single();
const set=s||{};
const card=div({cls:'card fade'});
card.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'24px'},html:'Site Settings'}));
// Video
const vI=inp('https://www.youtube.com/embed/...','text',set.video_url||'');
card.append(field('Demo Video URL',vI),h('p',{cls:'mono',style:{marginBottom:'20px'},html:'YouTube: Share → Embed → copy the src URL only'}));
// Payment links
card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'24px 0'}}),h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'16px'},html:'Study Portal Payment Links'}));
const lIs={};
[['link_monthly','Monthly ($10)'],['link_sixmonth','6 Months ($39)'],['link_yearly','1 Year ($59)'],['link_custom','Custom Session ($15)']].forEach(([k,l])=>{const i=inp('https://selar.co/...','text',set[k]||'');lIs[k]=i;card.append(field(l,i));});
// Community & support
card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'24px 0'}}));
card.append(h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'16px'},html:'Platform Links'}));
const comI=inp('https://...','text',set.community_link||'');
const supI=inp('deofortistutors@gmail.com','email',set.support_email||'');
card.append(field('Community Link (Forum / Discord / WhatsApp)',comI),field('Support Email (shown on dashboard)',supI));
// White noise
card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'24px 0'}}));
card.append(h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'8px'},html:'White Noise Audio Links'}));
card.append(h('p',{cls:'mono',style:{marginBottom:'16px'},html:'Upload MP3 files to GitHub then paste raw URLs here'}));
const nrI=inp('Rain MP3 URL (.mp3)','text',set.noise_rain||'');
const noI=inp('Ocean MP3 URL (.mp3)','text',set.noise_ocean||'');
const ncI=inp('Cafe MP3 URL (.mp3)','text',set.noise_cafe||'');
const nwI=inp('White Noise MP3 URL (.mp3)','text',set.noise_white||'');
card.append(field(' Rain',nrI),field(' Ocean',noI),field(' Cafe',ncI),field(' White Noise',nwI));
// Save
const sm=div({cls:'ok',style:{display:'none',marginTop:'12px'},html:'✓ Settings saved!'});
const saveBtn=btn('Save Settings','btn-gold',async()=>{
const obj={id:1,video_url:vI.value,community_link:comI.value,support_email:supI.value,noise_rain:nrI.value,noise_ocean:noI.value,noise_cafe:ncI.value,noise_white:nwI.value};
Object.keys(lIs).forEach(k=>obj[k]=lIs[k].value);
const{error}=await sb.from('admin_settings').upsert(obj);
if(error){alert('Save error: '+error.message);return;}
sm.style.display='block';setTimeout(()=>sm.style.display='none',2000);
});
card.append(saveBtn,sm);
content.innerHTML='';content.append(card);
}
if(tab==='users'){
const{data:users}=await sb.from('profiles').select('*').order('created_at',{ascending:false});
const card=div({cls:'card fade'});
const pend=(users||[]).filter(u=>u.status==='pending').length;
const upgrades=(users||[]).filter(u=>u.status==='pending'&&u.is_free_tier===false).length;
card.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'8px'},html:'Users'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'4px'},html:pend+' pending approval'}),upgrades>0?h('p',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--gold)',marginBottom:'24px'},html:'⬆ '+upgrades+' upgrade'+(upgrades>1?'s':'')+' awaiting approval'}):h('p',{style:{marginBottom:'24px'}}));
const userRanks=[...(users||[])].sort((a,b)=>(b.total_points||0)-(a.total_points||0));
(users||[]).forEach(u=>{
  const isFree=u.is_free_tier===true||u.is_free_tier===null||u.is_free_tier===undefined;
  const rank=userRanks.findIndex(r=>r.id===u.id)+1;
  const daysActive=Math.max(1,Math.floor((Date.now()-new Date(u.created_at))/86400000));
  const dailyGoalMins=(u.study_goals?.daily_hours||0)*60;
  const avgDailyMins=(u.total_study_minutes||0)/daysActive;
  const belowGoal=dailyGoalMins>0&&avgDailyMins<(dailyGoalMins*0.8);
  const pointsInput=inp('Points','number','0');
  Object.assign(pointsInput.style,{width:'80px',fontSize:'12px',padding:'4px 8px'});
  const row=div({style:{padding:'14px 0',borderBottom:'1px solid var(--border)'}});
  const topRow=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}});
  const nameDiv=div({style:{fontSize:'14px',color:'var(--text)',fontWeight:'600'}});
  nameDiv.textContent=(u.full_name||u.email||'—')+' (#'+rank+')';
  const statusBadge=h('span',{style:{fontSize:'10px',textTransform:'uppercase',letterSpacing:'1px',color:u.status==='approved'?'var(--teal)':'var(--gold)',marginRight:'8px'}});
  statusBadge.textContent=u.status||'pending';
  const tierBadge=h('span',{style:{fontSize:'10px',textTransform:'uppercase',letterSpacing:'1px',color:isFree?'var(--dim)':'var(--gold)'}});
  tierBadge.textContent=isFree?'FREE':'PAID';
  const actionsDiv=div({style:{display:'flex',gap:'8px',alignItems:'center'}});
  actionsDiv.append(statusBadge,tierBadge);
  if(u.status!=='approved'){
    actionsDiv.append(btn('Approve','btn-teal',async()=>{const exp=new Date();exp.setMonth(exp.getMonth()+1);await sb.from('profiles').update({status:'approved',access_expires_at:exp.toISOString()}).eq('id',u.id);loadTab('users');},{style:{padding:'4px 12px',fontSize:'11px'}}));
    actionsDiv.append(btn('Decline','btn-outline',async()=>{if(!confirm('Delete this user permanently?'))return;await sb.from('profiles').delete().eq('id',u.id);loadTab('users');},{style:{padding:'4px 12px',fontSize:'11px',color:'#ff4444',borderColor:'#ff4444'}}));
  }
  actionsDiv.append(btn(isFree?'Set Paid':'Set Free',isFree?'btn-teal':'btn-outline',async()=>{await sb.from('profiles').update({is_free_tier:!isFree,status:'approved'}).eq('id',u.id);loadTab('users');},{style:{padding:'4px 12px',fontSize:'11px'}}));
  topRow.append(nameDiv,actionsDiv);
  const statsRow=div({style:{display:'flex',gap:'16px',fontSize:'12px',color:'var(--muted)',marginBottom:'8px',flexWrap:'wrap'}});
  const emailInfo=h('span',{});emailInfo.textContent=(u.email||'—')+' · '+(u.plan||'No plan');
  const streakInfo=h('span',{style:{color:'var(--text)'}});streakInfo.textContent='🔥 '+( u.streak_count||0)+' streak';
  const hoursInfo=h('span',{style:{color:'var(--text)'}});hoursInfo.textContent=Math.floor((u.total_study_minutes||0)/60)+'h studied';
  const ptsInfo=h('span',{style:{color:'var(--gold)'}});ptsInfo.textContent=(u.total_points||0)+' pts';
  statsRow.append(emailInfo,streakInfo,hoursInfo,ptsInfo);
  if(belowGoal){const warn=h('span',{style:{color:'#ff4444',fontWeight:'600'}});warn.textContent='Below Goal';statsRow.append(warn);}
  const pointsRow=div({style:{display:'flex',gap:'8px',alignItems:'center'}});
  pointsRow.append(pointsInput,btn('Add/Deduct Points','btn-outline',async()=>{
    const delta=parseInt(pointsInput.value,10);
    if(isNaN(delta)||delta===0)return;
    const newPts=(u.total_points||0)+delta;
    await sb.from('profiles').update({total_points:newPts}).eq('id',u.id);
    loadTab('users');
  },{style:{padding:'4px 12px',fontSize:'11px'}}));
  row.append(topRow,statsRow,pointsRow);
  card.append(row);
});
content.innerHTML='';content.append(card);
}
if(tab==='recalls'){
const{data:recs}=await sb.from('recall_requests').select('*').order('created_at',{ascending:false});
content.innerHTML='';
content.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'24px'},html:'Recall Requests'}));
if(!recs||!recs.length){content.append(div({cls:'card',style:{textAlign:'center',padding:'40px'}},[h('p',{style:{fontSize:'14px',color:'var(--dim)'},html:'No recall requests yet.'})]));return;}
const upSt=div({cls:'ok',style:{display:'none',marginTop:'16px'}});
recs.forEach(r=>{
const card=div({cls:'card',style:{marginBottom:'16px'}});
const hdr2=div({style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}});
hdr2.append(div({},[div({style:{fontSize:'15px',color:'var(--text)',marginBottom:'4px'},html:r.user_name||'—'}),div({style:{fontSize:'12px',color:'var(--muted)'},html:r.user_email||''})]),h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',color:r.status==='pending'?'var(--gold)':'var(--teal)'},html:r.status}));
card.append(hdr2);
const dg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}});
[[r.topic,'Topic'],[r.style,'Style']].forEach(([v,l])=>{const d=div({});d.append(div({cls:'mono',style:{marginBottom:'4px'},html:l}),div({style:{fontSize:'14px',color:l==='Style'?'var(--gold)':'var(--text)'},html:v||'—'}));dg.append(d);});
card.append(dg);
if(r.details)card.append(div({style:{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'2px',padding:'12px',marginBottom:'12px'}},[div({cls:'mono',style:{marginBottom:'4px'},html:'Notes'}),h('p',{style:{fontSize:'13px',color:'var(--muted)'},html:r.details})]));
const br2=div({style:{display:'flex',gap:'12px'}});
async function handleUpload(file,isCsv){
upSt.style.display='block';upSt.textContent='Uploading...';
const text=await file.text();
if(isCsv){
const lines=text.split('\n').filter(l=>l.trim());
const{data:deck}=await sb.from('flashcard_decks').insert({topic:r.topic,user_id:r.user_id}).select().single();
if(!deck){upSt.textContent='Error';return;}
const cards=lines.map(line=>{const parts=line.split(',');return{deck_id:deck.id,question:parts[0]?.trim(),answer:parts.slice(1).join(',').trim()};}).filter(c=>c.question&&c.answer);
await sb.from('flashcards').insert(cards);upSt.textContent='✓ Uploaded '+cards.length+' cards!';
}else{
const blocks=text.split('\n\n').filter(b=>b.trim());const qs=[];
for(const block of blocks){const lines=block.split('\n').filter(l=>l.trim());if(lines.length<3)continue;const q={topic:r.topic,question:'',option_a:'',option_b:'',option_c:'',option_d:'',option_e:'',correct_answer:'',explanation:'',is_global:false,user_id:r.user_id};q.question=lines[0];let expIdx=-1;for(let li=1;li<lines.length;li++){const line=lines[li];if(line.startsWith('A.')||line.startsWith('A)'))q.option_a=line.slice(2).trim();else if(line.startsWith('B.')||line.startsWith('B)'))q.option_b=line.slice(2).trim();else if(line.startsWith('C.')||line.startsWith('C)'))q.option_c=line.slice(2).trim();else if(line.startsWith('D.')||line.startsWith('D)'))q.option_d=line.slice(2).trim();else if(line.startsWith('E.')||line.startsWith('E)'))q.option_e=line.slice(2).trim();else if(line.toLowerCase().startsWith('answer:'))q.correct_answer=line.split(':')[1].trim().toUpperCase();else if(line.toLowerCase().startsWith('explanation:')){q.explanation=line.split(':').slice(1).join(':').trim();expIdx=li;}}if(expIdx>=0&&expIdx<lines.length-1){const extra=lines.slice(expIdx+1).filter(l=>!l.startsWith('A.')&&!l.startsWith('B.')&&!l.startsWith('C.')&&!l.startsWith('D.')&&!l.startsWith('E.')&&!l.toLowerCase().startsWith('answer:')).join(' ');if(extra)q.explanation+=' '+extra;}if(q.question&&q.correct_answer)qs.push(q);}
if(qs.length){await sb.from('vignette_questions').insert(qs);upSt.textContent='✓ Uploaded '+qs.length+' questions!';}else upSt.textContent='No valid questions found.';
}
setTimeout(()=>upSt.style.display='none',3000);
}
if(r.style==='flashcard'){const fi=h('input',{type:'file',accept:'.csv',style:{color:'var(--muted)',fontSize:'12px',fontFamily:"Inter,sans-serif"}});fi.onchange=e=>{if(e.target.files[0])handleUpload(e.target.files[0],true);};br2.append(div({},[h('label',{cls:'label',html:'Upload CSV'}),fi]));}
if(r.style==='vignette'){const fi=h('input',{type:'file',accept:'.txt',style:{color:'var(--muted)',fontSize:'12px',fontFamily:"Inter,sans-serif"}});fi.onchange=e=>{if(e.target.files[0])handleUpload(e.target.files[0],false);};br2.append(div({},[h('label',{cls:'label',html:'Upload TXT'}),fi]));}
if(r.style==='theory'){
const fi=h('input',{type:'file',accept:'.pdf',style:{color:'var(--muted)',fontSize:'12px',fontFamily:"Inter,sans-serif"}});
fi.onchange=async e=>{
const file=e.target.files[0];if(!file)return;
upSt.style.display='block';upSt.textContent='Uploading PDF...';
const reader=new FileReader();
reader.onload=async()=>{
const base64=reader.result.split(',')[1];
const{error}=await sb.from('theory_pdfs').insert({user_id:r.user_id,topic:r.topic,filename:file.name,data:base64,recall_request_id:r.id});
if(error){upSt.textContent='Error: '+error.message;}
else{upSt.textContent='✓ PDF uploaded!';await sb.from('profiles').update({has_new_content:true}).eq('id',r.user_id);}
setTimeout(()=>upSt.style.display='none',3000);
};
reader.readAsDataURL(file);
};
br2.append(div({},[h('label',{cls:'label',html:'Upload Theory PDF'}),fi]));
}
br2.append(btn('Reject','btn-outline',async()=>{await sb.from('recall_requests').update({status:'rejected',updated_at:new Date().toISOString()}).eq('id',r.id);loadTab('recalls');},{style:{padding:'8px 16px',fontSize:'11px',color:'#ff4444',borderColor:'#ff4444'}}));
br2.append(btn('Mark Done','btn-teal',async()=>{await sb.from('recall_requests').update({status:'fulfilled',updated_at:new Date().toISOString()}).eq('id',r.id);if(r.user_id)await sb.from('profiles').update({has_new_content:true}).eq('id',r.user_id);loadTab('recalls');},{style:{padding:'8px 16px',fontSize:'11px'}}));
card.append(br2);
(async()=>{
  const delSection=div({style:{marginTop:'16px',borderTop:'1px solid var(--border)',paddingTop:'12px'}});
  let found=false;
  if(r.style==='flashcard'){
    const{data:decks}=await sb.from('flashcard_decks').select('*').eq('user_id',r.user_id).eq('topic',r.topic).eq('type','flashcard');
    if(decks&&decks.length){
      found=true;
      for(const deck of decks){
        const{count}=await sb.from('flashcards').select('*',{count:'exact',head:true}).eq('deck_id',deck.id);
        delSection.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',marginBottom:'8px'}},[''+deck.name+' · '+(count||0)+' cards']));
        delSection.append(btn('Delete Deck','btn-outline',async()=>{if(!confirm('Delete this deck and all its cards?'))return;await sb.from('flashcards').delete().eq('deck_id',deck.id);await sb.from('flashcard_decks').delete().eq('id',deck.id);loadTab('recalls');},{style:{padding:'4px 12px',fontSize:'10px',color:'#ff4444',borderColor:'#ff4444',marginBottom:'8px'}}));
      }
    }
  } else if(r.style==='vignette'){
    const{count}=await sb.from('vignette_questions').select('*',{count:'exact',head:true}).eq('user_id',r.user_id).eq('topic',r.topic);
    if(count&&count>0){
      found=true;
      delSection.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',marginBottom:'8px'}},[''+count+' questions for '+r.topic]));
      delSection.append(btn('Delete All Questions','btn-outline',async()=>{if(!confirm('Delete all '+count+' questions for "'+r.topic+'"? Cannot be undone.'))return;await sb.from('vignette_questions').delete().eq('user_id',r.user_id).eq('topic',r.topic);loadTab('recalls');},{style:{padding:'4px 12px',fontSize:'10px',color:'#ff4444',borderColor:'#ff4444'}}));
    }
  } else if(r.style==='theory'){
    const{data:pdfs}=await sb.from('theory_pdfs').select('id,filename').eq('recall_request_id',r.id);
    if(pdfs&&pdfs.length){
      found=true;
      pdfs.forEach(pdf=>{delSection.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',marginBottom:'4px'}},[''+pdf.filename]));});
      delSection.append(btn('Delete PDF','btn-outline',async()=>{if(!confirm('Delete uploaded PDF(s)?'))return;for(const pdf of pdfs){await sb.from('theory_pdfs').delete().eq('id',pdf.id);}loadTab('recalls');},{style:{padding:'4px 12px',fontSize:'10px',color:'#ff4444',borderColor:'#ff4444',marginTop:'8px'}}));
    }
  }
  if(found)card.append(delSection);
})();
content.append(card);
});
content.append(upSt);
}
if(tab==='flashcards'){
const card=div({cls:'card fade'});
card.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'8px'},html:'Upload Flashcard Deck'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'CSV format: question, answer (one per line)'}));
const dnI=inp('e.g. Bacteriology Basics');
const upSt=div({cls:'ok',style:{display:'none',marginTop:'16px'}});
const fi=h('input',{type:'file',accept:'.csv',style:{color:'var(--muted)',fontSize:'13px',fontFamily:"Inter,sans-serif",marginTop:'16px'}});
const deckFreeToggleWrap=div({style:{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px',padding:'12px',background:'var(--card2)',border:'1px solid var(--border)',borderRadius:'4px'}});
const deckFreeToggle=h('input',{type:'checkbox'});
deckFreeToggle.style.width='16px';deckFreeToggle.style.height='16px';deckFreeToggle.style.accentColor='var(--gold)';
deckFreeToggleWrap.append(deckFreeToggle,h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',color:'var(--text)'},html:'Make available to free tier users'}));
const flashListDiv=div({style:{marginTop:'24px'}});
async function loadFlashcardList(){
  flashListDiv.innerHTML='';
  const{data:decks}=await sb.from('flashcard_decks').select('*').eq('type','flashcard').order('created_at',{ascending:false});
  if(!decks||!decks.length){flashListDiv.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',padding:'8px 0'}},['No flashcard decks uploaded yet.']));return;}
  flashListDiv.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--dim)',marginBottom:'12px'}},['Uploaded Decks']));
  for(const deck of decks){
    const{count}=await sb.from('flashcards').select('*',{count:'exact',head:true}).eq('deck_id',deck.id);
    const row=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}},[ 
      h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--text)'}},[ deck.name+' · '+(count||0)+' cards']),
      btn('Delete','btn-outline',async()=>{if(!confirm('Delete "'+deck.name+'" and all its cards?'))return;await sb.from('flashcards').delete().eq('deck_id',deck.id);await sb.from('flashcard_decks').delete().eq('id',deck.id);loadFlashcardList();},{style:{padding:'4px 12px',fontSize:'10px',color:'#ff4444',borderColor:'#ff4444'}})
    ]);
    flashListDiv.append(row);
  }
}
fi.onchange=async e=>{
const file=e.target.files[0];if(!file)return;
upSt.style.display='block';upSt.textContent='Uploading...';
const text=await file.text();const lines=text.split('\n').filter(l=>l.trim());
const deckTopic=dnI.value||file.name.replace('.csv','');
const{data:deck,error:deckErr}=await sb.from('flashcard_decks').insert({name:deckTopic,type:'flashcard',topic:deckTopic,user_id:null,is_global:deckFreeToggle.checked}).select().single();
if(deckErr){console.error('Deck insert error:',deckErr);upSt.textContent='Error: '+deckErr.message;return;}
if(!deck){upSt.textContent='Error: No deck returned';return;}
const cards=lines.map(line=>{const parts=line.split(',');return{deck_id:deck.id,question:parts[0]?.trim(),answer:parts.slice(1).join(',').trim()};}).filter(c=>c.question&&c.answer);
if(!cards.length){upSt.textContent='No valid cards found';return;}
const{error:cardsErr}=await sb.from('flashcards').insert(cards);
if(cardsErr){console.error('Cards insert error:',cardsErr);upSt.textContent='Error: '+cardsErr.message;return;}
upSt.textContent='✓ Uploaded '+cards.length+' cards!';loadFlashcardList();setTimeout(()=>upSt.style.display='none',3000);
};
const ex=div({style:{background:'var(--bg)',border:'1px dashed var(--border)',borderRadius:'4px',padding:'32px',marginBottom:'20px'}});
ex.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Example:'}),div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'2px',padding:'12px',marginBottom:'16px'},html:'<p style="font-family:\'DM Mono\',monospace;font-size:12px;color:var(--muted);line-height:1.8">What causes malaria?, Plasmodium falciparum<br>What stain is used for TB?, Ziehl-Neelsen stain</p>'}),field('Deck Name',dnI),deckFreeToggleWrap,fi);
card.append(ex,upSt,flashListDiv);content.innerHTML='';content.append(card);
(async()=>{await loadFlashcardList();})();
}
if(tab==='questions'){
const card=div({cls:'card fade'});
card.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'8px'},html:'Upload Vignette Questions'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'Add a subject, then add subsections with TXT files.'}));
const tI=inp('e.g. Paediatrics','text','');
card.append(h('label',{cls:'label',html:'Subject Name'}),tI);
const subsRowsDiv=div({style:{marginBottom:'16px',marginTop:'16px'}});
card.append(h('label',{cls:'label',html:'Subsections (at least one)'}),subsRowsDiv);
const subsectionRows=[];
function addSubsectionRow(){
  const rowId=Date.now()+'_'+Math.random();
  const rowDiv=div({style:{marginBottom:'12px',padding:'12px',background:'var(--card2)',border:'1px solid var(--border)',borderRadius:'4px'}});
  const nameInp=inp('e.g. Gastroenterology','text','');
  const fileInp=h('input',{type:'file',accept:'.txt',style:{color:'var(--muted)',fontSize:'13px',fontFamily:"Inter,sans-serif",marginTop:'8px',display:'block'}});
  const removeBtn=btn('✕ Remove','btn-outline',()=>{rowDiv.remove();const idx=subsectionRows.findIndex(r=>r.id===rowId);if(idx!==-1)subsectionRows.splice(idx,1);},{style:{padding:'4px 12px',fontSize:'10px',color:'#ff4444',borderColor:'#ff4444',marginLeft:'12px'}});
  const topRow=div({style:{display:'flex',alignItems:'center',gap:'8px'}},[nameInp,removeBtn]);
  rowDiv.append(topRow,fileInp);
  subsRowsDiv.append(rowDiv);
  subsectionRows.push({id:rowId,nameInp,fileInp});
}
card.append(btn('+ Add Subsection','btn-outline',()=>addSubsectionRow(),{style:{marginBottom:'20px'}}));
const freeToggleWrap=div({style:{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px',padding:'12px',background:'var(--card2)',border:'1px solid var(--border)',borderRadius:'4px'}});
const freeToggle=h('input',{type:'checkbox'});
freeToggle.style.width='16px';freeToggle.style.height='16px';freeToggle.style.accentColor='var(--gold)';
freeToggleWrap.append(freeToggle,h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',color:'var(--text)'},html:'Make available to free tier users'}));
card.append(freeToggleWrap);
const upSt=div({style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--dim)',marginTop:'12px'}},['']);
const uploadBtn=btn('Upload All Subsections','btn-gold',async()=>{
  const subject=tI.value.trim();
  if(!subject){upSt.textContent='Please enter a subject name';return;}
  if(!subsectionRows.length){upSt.textContent='Please add at least one subsection';return;}
  for(let i=0;i<subsectionRows.length;i++){
    const row=subsectionRows[i];
    if(!row.nameInp.value.trim()){upSt.textContent='Subsection '+(i+1)+' has no name';return;}
    if(!row.fileInp.files||!row.fileInp.files.length){upSt.textContent='Subsection "'+row.nameInp.value.trim()+'" has no file';return;}
  }
  upSt.textContent='Uploading '+subsectionRows.length+' subsection(s)...';
  let total=0;
  for(let i=0;i<subsectionRows.length;i++){
    const row=subsectionRows[i];
    const subName=row.nameInp.value.trim();
    upSt.textContent='Processing "'+subName+'" ('+(i+1)+'/'+subsectionRows.length+')...';
    const text=await row.fileInp.files[0].text();
    const blocks=text.split('\n\n').filter(b=>b.trim());
    const qs=[];
    for(const block of blocks){
      const lines=block.split('\n').filter(l=>l.trim());
      if(lines.length<3)continue;
      const q={topic:subject,subsection:subName,question:'',option_a:'',option_b:'',option_c:'',option_d:'',correct_answer:'',explanation:'',is_global:freeToggle.checked,user_id:null};
      q.question=lines[0];
      let expIdx=-1;
      for(let li=1;li<lines.length;li++){
        const line=lines[li];
        if(line.startsWith('A.')||line.startsWith('A)'))q.option_a=line.slice(2).trim();
        if(line.startsWith('B.')||line.startsWith('B)'))q.option_b=line.slice(2).trim();
        if(line.startsWith('C.')||line.startsWith('C)'))q.option_c=line.slice(2).trim();
        if(line.startsWith('D.')||line.startsWith('D)'))q.option_d=line.slice(2).trim();
        if(line.toLowerCase().startsWith('answer:'))q.correct_answer=line.split(':')[1]?.trim().toUpperCase()||'';
        if(line.toLowerCase().startsWith('explanation:')){q.explanation=line.split(':').slice(1).join(':').trim();expIdx=li;}
      }
      if(expIdx>=0&&expIdx<lines.length-1){const extra=lines.slice(expIdx+1).filter(l=>!l.startsWith('A.')&&!l.startsWith('B.')&&!l.startsWith('C.')&&!l.startsWith('D.')&&!l.toLowerCase().startsWith('answer:')).join(' ');if(extra)q.explanation+=' '+extra;}
      if(q.question&&q.correct_answer)qs.push(q);
    }
    if(qs.length){
      const{error}=await sb.from('vignette_questions').insert(qs);
      if(error){upSt.textContent='Error in "'+subName+'": '+error.message;return;}
      total+=qs.length;
    }
  }
  upSt.textContent='Uploaded '+total+' questions across '+subsectionRows.length+' subsection(s)';
  await loadQuestionList();
},{});
card.append(uploadBtn,upSt);
const qListDiv=div({style:{marginTop:'24px'}});
let selectedIds=new Set();
async function loadQuestionList(){
  qListDiv.innerHTML='';selectedIds=new Set();
  const{data:questions}=await sb.from('vignette_questions').select('id,topic,subsection,question').is('user_id',null).order('topic,subsection,created_at',{ascending:false});
  if(!questions||!questions.length){qListDiv.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',padding:'8px 0'}},['No questions uploaded yet.']));return;}
  // Header row
  const headerRow=div({style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}});
  const selectAllChk=h('input',{type:'checkbox',style:{accentColor:'var(--gold)',width:'14px',height:'14px',cursor:'pointer'}});
  const totalLabel=h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--dim)',marginLeft:'8px'}},[questions.length+' Questions in Bank']);
  const delSelBtn=btn('Delete Selected','btn-outline',null,{style:{padding:'4px 12px',fontSize:'10px',color:'#ff4444',borderColor:'#ff4444'}});
  delSelBtn._confirming=false;
  delSelBtn.onclick=async()=>{
    if(!selectedIds.size)return;
    if(!delSelBtn._confirming){delSelBtn._confirming=true;delSelBtn.textContent='Click again to confirm ('+selectedIds.size+')';setTimeout(()=>{delSelBtn._confirming=false;delSelBtn.textContent='Delete Selected';},3000);return;}
    delSelBtn._confirming=false;delSelBtn.textContent='Delete Selected';
    const ids=Array.from(selectedIds);
    await sb.from('vignette_questions').delete().in('id',ids);
    loadQuestionList();
  };
  const leftSide=div({style:{display:'flex',alignItems:'center'}});
  leftSide.append(selectAllChk,totalLabel);
  headerRow.append(leftSide,delSelBtn);
  qListDiv.append(headerRow);
  // Group by topic then subsection
  const grouped={};
  questions.forEach(q=>{
    if(!grouped[q.topic])grouped[q.topic]={};
    const sub=q.subsection||'__none__';
    if(!grouped[q.topic][sub])grouped[q.topic][sub]=[];
    grouped[q.topic][sub].push(q);
  });
  const allChks=[];
  for(const topic of Object.keys(grouped)){
    const topicIds=Object.values(grouped[topic]).flat().map(q=>q.id);
    const topicBlock=div({style:{marginBottom:'16px',border:'1px solid var(--border)',borderRadius:'2px',overflow:'hidden'}});
    const topicHdr=div({style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 12px',background:'var(--card)',borderBottom:'1px solid var(--border)'}});
    const delSubjectBtn=btn('Delete Subject','btn-outline',null,{style:{padding:'4px 10px',fontSize:'10px',color:'#ff4444',borderColor:'#ff4444'}});
    delSubjectBtn._confirming=false;
    delSubjectBtn.onclick=async()=>{
      if(!delSubjectBtn._confirming){delSubjectBtn._confirming=true;delSubjectBtn.textContent='Click again to confirm';setTimeout(()=>{delSubjectBtn._confirming=false;delSubjectBtn.textContent='Delete Subject';},3000);return;}
      delSubjectBtn._confirming=false;delSubjectBtn.textContent='Delete Subject';
      await sb.from('vignette_questions').delete().eq('topic',topic).is('user_id',null);loadQuestionList();
    };
    topicHdr.append(
      h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--gold)',fontWeight:'600'}},[topic+' ('+topicIds.length+')']),
      delSubjectBtn
    );
    topicBlock.append(topicHdr);
    for(const sub of Object.keys(grouped[topic])){
      const subQs=grouped[topic][sub];
      const subIds=subQs.map(q=>q.id);
      const subLabel=sub==='__none__'?'(no subsection)':sub;
      const subHdr=div({style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 12px',borderBottom:'1px solid var(--border)',background:'#0F0E0A'}});
      subHdr.append(
        h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--muted)'}},[subLabel+' — '+subIds.length+' questions']),
        (()=>{const delSubBtn=btn('Delete Subsection','btn-outline',null,{style:{padding:'3px 8px',fontSize:'10px',color:'#ff4444',borderColor:'#ff4444'}});
        delSubBtn._confirming=false;
        delSubBtn.onclick=async()=>{
          if(!delSubBtn._confirming){delSubBtn._confirming=true;delSubBtn.textContent='Click again to confirm';setTimeout(()=>{delSubBtn._confirming=false;delSubBtn.textContent='Delete Subsection';},3000);return;}
          delSubBtn._confirming=false;delSubBtn.textContent='Delete Subsection';
          await sb.from('vignette_questions').delete().in('id',subIds);loadQuestionList();
        };return delSubBtn;})()
      );
      topicBlock.append(subHdr);
      for(const q of subQs){
        const preview=q.question.length>80?q.question.substring(0,80)+'...':q.question;
        const chk=h('input',{type:'checkbox',style:{accentColor:'var(--gold)',width:'13px',height:'13px',cursor:'pointer',flexShrink:'0'}});
        allChks.push(chk);
        chk.onchange=()=>{if(chk.checked)selectedIds.add(q.id);else selectedIds.delete(q.id);};
        const row=div({style:{display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',borderBottom:'1px solid var(--border)'}});
        row.append(chk,h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--muted)',flex:'1'}},[preview]));
        topicBlock.append(row);
      }
    }
    qListDiv.append(topicBlock);
  }
  selectAllChk.onchange=()=>{
    allChks.forEach(c=>{c.checked=selectAllChk.checked;if(selectAllChk.checked)selectedIds.add(Number(c._qid)||c._qid);else selectedIds.clear();});
    if(selectAllChk.checked)questions.forEach(q=>selectedIds.add(q.id));else selectedIds.clear();
  };
}
card.append(qListDiv);content.innerHTML='';content.append(card);
(async()=>{await loadQuestionList();})();
}
if(tab==='testimonials'){
const{data:tlist}=await sb.from('testimonials').select('*').order('created_at',{ascending:false});
content.innerHTML='';
const addCard=div({cls:'card',style:{marginBottom:'24px'}});
addCard.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'20px'},html:'Add Testimonial'}));
const nI=inp('e.g. Sarah K.');const tI=inp('e.g. USMLE Step 1 Student');
const cI=h('textarea',{cls:'input',placeholder:"What did they say?",style:{minHeight:'100px',resize:'vertical',marginBottom:'20px'}});
const sm=div({cls:'ok',style:{display:'none',marginTop:'12px'},html:'✓ Added!'});
addCard.append(field('Student Name',nI),field('Title / Course (optional)',tI),h('label',{cls:'label',html:'Testimonial'}),cI,btn('Add Testimonial','btn-gold',async()=>{if(!nI.value||!cI.value)return;await sb.from('testimonials').insert({name:nI.value,title:tI.value,content:cI.value});sm.style.display='block';setTimeout(()=>{sm.style.display='none';loadTab('testimonials');},1500);}),sm);
content.append(addCard);
if(tlist&&tlist.length){
const lc=div({cls:'card'});
lc.append(h('h3',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'16px'},html:'Current Testimonials ('+tlist.length+')'}));
tlist.forEach(t=>{
const row=div({style:{padding:'16px 0',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}});
const info=div({style:{flex:'1'}});info.append(div({style:{fontSize:'14px',color:'var(--text)',marginBottom:'4px'},html:t.name+(t.title?' · <span style="color:var(--dim);font-size:12px">'+t.title+'</span>':'')}),h('p',{style:{fontSize:'13px',color:'var(--muted)',fontStyle:'italic'},html:t.content}));
row.append(info,btn('✕','',async()=>{await sb.from('testimonials').delete().eq('id',t.id);loadTab('testimonials');},{style:{background:'none',border:'none',color:'#8B0000',cursor:'pointer',fontSize:'16px',marginLeft:'12px'}}));
lc.append(row);
});
content.append(lc);
}
}
if(tab==='packages'){
const{data:pkgs}=await sb.from('tutoring_packages').select('*').order('id');
const card=div({cls:'card fade'});
card.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'24px'},html:'Tutoring Packages'}));
const pkgData=[...(pkgs||[])];const inps={};
pkgData.forEach((pkg,i)=>{
const box=div({style:{marginBottom:'24px',padding:'20px',border:'1px solid var(--border)',borderRadius:'4px'}});
box.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Package '+(i+1)}));inps[pkg.id]={};
const g=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}});
['name','price'].forEach(k=>{const i2=inp(k,'text',pkg[k]||'');inps[pkg.id][k]=i2;g.append(div({},[h('label',{cls:'label',html:k.charAt(0).toUpperCase()+k.slice(1)}),i2]));});
box.append(g);
['sessions','features','selar_link'].forEach(k=>{const i2=inp(k==='selar_link'?'https://selar.co/...':'','text',pkg[k]||'');inps[pkg.id][k]=i2;box.append(div({style:{marginBottom:'12px'}},[h('label',{cls:'label',html:k.replace('_',' ')}),i2]));});
card.append(box);
});
const sm=div({cls:'ok',style:{display:'none',marginTop:'12px'},html:'✓ Saved!'});
card.append(btn('Save Packages','btn-gold',async()=>{for(const pkg of pkgData){const upd={id:pkg.id};Object.keys(inps[pkg.id]).forEach(k=>upd[k]=inps[pkg.id][k].value);await sb.from('tutoring_packages').upsert(upd);}sm.style.display='block';setTimeout(()=>sm.style.display='none',2000);}),sm);
content.innerHTML='';content.append(card);
}
if(tab==='bookings'){
const{data:books}=await sb.from('booking_requests').select('*').order('created_at',{ascending:false});
const card=div({cls:'card fade'});
const pend=(books||[]).filter(b=>b.status==='pending').length;
card.append(h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'22px',marginBottom:'8px'},html:'Booking Requests'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:pend+' new bookings'}));
if(!books||!books.length){card.append(h('p',{style:{fontSize:'14px',color:'var(--dim)',textAlign:'center',padding:'20px'},html:'No bookings yet.'}));content.innerHTML='';content.append(card);return;}
books.forEach(b=>{
const row=div({style:{padding:'16px 0',borderBottom:'1px solid var(--border)'}});
const inner2=div({style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}});
const info=div({});info.append(div({style:{fontSize:'15px',color:'var(--text)',marginBottom:'4px'},html:b.name||'—'}),div({style:{fontSize:'12px',color:'var(--muted)',marginBottom:'4px'},html:(b.email||'—')+' · '+(b.package||'—')}));
if(b.message)info.append(h('p',{style:{fontSize:'13px',color:'var(--dim)',fontStyle:'italic'},html:b.message}));
info.append(div({cls:'mono',style:{marginTop:'4px'},html:new Date(b.created_at).toLocaleDateString()}));
inner2.append(info,h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',color:b.status==='pending'?'var(--gold)':'var(--teal)'},html:b.status}));
row.append(inner2);card.append(row);
});
content.innerHTML='';content.append(card);
}
if(tab==='feynman'){
content.innerHTML='';
function parseCSVRow(row){const result=[];let cur='';let inQuotes=false;for(let ch of row){if(ch==='"'){inQuotes=!inQuotes;}else if(ch===','&&!inQuotes){result.push(cur.trim());cur='';}else{cur+=ch;}}result.push(cur.trim());return result;}
function getCurrentMonday(){const now=new Date();const day=now.getDay();const diff=day===0?6:day-1;const mon=new Date(now);mon.setDate(now.getDate()-diff);mon.setHours(0,0,0,0);return mon.toISOString().split('T')[0];}
const{data:allSubs}=await sb.from('feynman_submissions').select('*').order('created_at',{ascending:false});
const submissions=allSubs||[];
const totalCount=submissions.length;
const pendingCount=submissions.filter(s=>s.status==='pending').length;
const approvedCount=submissions.filter(s=>s.status==='approved').length;
const currentMonday=getCurrentMonday();
const currentKing=submissions.find(s=>s.is_king===true&&s.week_of===currentMonday);
const statsRow=div({style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'24px'}},[
  div({style:{background:'var(--card)',padding:'16px',borderRadius:'4px',textAlign:'center',borderLeft:'2px solid var(--gold)'}},[h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',color:'var(--gold)',marginBottom:'4px'},html:String(totalCount)}),h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'8px',textTransform:'uppercase',color:'var(--dim)'},html:'Total'})]),
  div({style:{background:'var(--card)',padding:'16px',borderRadius:'4px',textAlign:'center',borderLeft:'2px solid var(--gold)'}},[h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',color:'var(--gold)',marginBottom:'4px'},html:String(pendingCount)}),h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'8px',textTransform:'uppercase',color:'var(--dim)'},html:'Pending'})]),
  div({style:{background:'var(--card)',padding:'16px',borderRadius:'4px',textAlign:'center',borderLeft:'2px solid var(--teal)'}},[h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',color:'var(--teal)',marginBottom:'4px'},html:String(approvedCount)}),h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'8px',textTransform:'uppercase',color:'var(--dim)'},html:'Approved'})]),
  div({style:{background:'var(--card)',padding:'16px',borderRadius:'4px',textAlign:'center',borderLeft:'2px solid #8B5CF6'}},[h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',color:'#8B5CF6',marginBottom:'4px'},html:currentKing?currentKing.user_name:'—'}),h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'8px',textTransform:'uppercase',color:'var(--dim)'},html:'Week King'})])
]);
content.append(statsRow);
const filterRow=div({style:{display:'flex',gap:'8px',marginBottom:'24px'}});
['All','Pending','Approved','Rejected'].forEach(filter=>{
  const fv=filter.toLowerCase();
  const isActive=currentFilter===fv;
  filterRow.append(btn(filter,isActive?'btn-gold':'btn-outline',()=>{currentFilter=fv;loadTab('feynman');},{style:{padding:'6px 16px',fontSize:'11px'}}));
});
content.append(filterRow);
const filteredSubs=currentFilter==='all'?submissions:submissions.filter(s=>s.status===currentFilter);
if(!filteredSubs.length){
  content.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'12px',color:'var(--dim)',textAlign:'center',padding:'40px'},html:'No submissions yet.'}));
}else{
  const list=div({style:{display:'flex',flexDirection:'column',gap:'16px'}});
  filteredSubs.forEach(sub=>{
    let typeColor='var(--teal)';
    if(sub.type==='riddle')typeColor='var(--gold)';
    if(sub.type==='emoji')typeColor='#8B5CF6';
    const card=div({style:{background:'var(--card2)',borderRadius:'4px',padding:'20px',border:'1px solid var(--border)'}});
    const hdr=div({style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px',flexWrap:'wrap',gap:'8px'}});
    const left=div({style:{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}});
    left.append(
      h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',fontWeight:'bold',color:'var(--text)'},html:sub.user_name||'Anonymous'}),
      h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',padding:'2px 8px',borderRadius:'2px',background:typeColor,color:'var(--bg)'},html:sub.type.toUpperCase()}),
      h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',color:'var(--dim)'},html:sub.topic||'—'}),
      h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--muted)'},html:'Week of '+(sub.week_of||'—')})
    );
    hdr.append(left);
    if(sub.status!=='pending'){hdr.append(h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'10px',padding:'4px 8px',borderRadius:'2px',background:sub.status==='approved'?'rgba(126,184,164,0.15)':'rgba(139,58,58,0.15)',color:sub.status==='approved'?'var(--teal)':'#8B3A3A',border:'1px solid '+(sub.status==='approved'?'var(--teal)':'#8B3A3A')},html:sub.status.toUpperCase()}));}
    card.append(hdr);
    card.append(div({style:{background:'var(--card)',padding:'16px',borderRadius:'4px',marginBottom:'16px',fontFamily:"Inter,sans-serif",fontSize:'13px',color:'var(--text)',lineHeight:'1.5',whiteSpace:'pre-wrap'},html:sub.content||''}));
    if(sub.status==='pending'){
      const actions=div({style:{display:'flex',gap:'10px',marginTop:'12px'}});
      actions.append(btn('✓ Approve','btn-teal',async()=>{
        if(!sub.points_awarded){const{data:up}=await sb.from('profiles').select('total_points').eq('id',sub.user_id).single();if(up)await sb.from('profiles').update({total_points:(up.total_points||0)+50}).eq('id',sub.user_id);}
        await sb.from('feynman_submissions').update({status:'approved',points_awarded:true}).eq('id',sub.id);
        loadTab('feynman');
      },{style:{padding:'6px 16px',fontSize:'11px'}}));
      actions.append(btn('✕ Reject','btn-outline',async()=>{
        await sb.from('feynman_submissions').update({status:'rejected'}).eq('id',sub.id);
        loadTab('feynman');
      },{style:{padding:'6px 16px',fontSize:'11px'}}));
      actions.append(btn('👑 King','btn-gold',async()=>{
        await sb.from('feynman_submissions').update({is_king:false}).eq('week_of',currentMonday).eq('is_king',true);
        if(!sub.points_awarded){const{data:up}=await sb.from('profiles').select('total_points').eq('id',sub.user_id).single();if(up)await sb.from('profiles').update({total_points:(up.total_points||0)+50}).eq('id',sub.user_id);}
        await sb.from('feynman_submissions').update({is_king:true,status:'approved',points_awarded:true,week_of:currentMonday}).eq('id',sub.id);
        loadTab('feynman');
      },{style:{padding:'6px 16px',fontSize:'11px'}}));
      card.append(actions);
    }else if(sub.is_king){
      card.append(div({style:{marginTop:'12px',display:'flex',alignItems:'center',gap:'8px',background:'rgba(200,169,110,0.1)',padding:'8px 12px',borderRadius:'4px'}},[
        h('span',{style:{fontSize:'16px'},html:'👑'}),
        h('span',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--gold)'},html:'Feynman King — Week of '+(sub.week_of||'—')})
      ]));
    }
    list.append(card);
  });
  content.append(list);
}
// RIDDLE DECKS SECTION
const riddleSection=div({cls:'card',style:{marginTop:'32px',marginBottom:'32px'}});
riddleSection.append(
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'4px'},html:'Riddle Decks'}),
  h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--dim)',marginBottom:'16px'},html:'upload riddle deck csv'})
);
const riddleDeckName=inp('Deck name e.g. Microbiology Riddles','text','');
riddleDeckName.style.marginBottom='12px';
const riddleFileInput=h('input',{type:'file',accept:'.csv',style:{marginBottom:'12px'}});
const riddleUploadBtn=btn('Upload Riddle Deck','btn-gold',()=>{
  const deckName=riddleDeckName.value.trim();
  const file=riddleFileInput.files[0];
  if(!deckName||!file){alert('Please enter deck name and select CSV file');return;}
  const reader=new FileReader();
  reader.onload=(e)=>{(async()=>{
    const text=e.target.result;
    const rows=text.split('\n').slice(1);
    const cards=[];
    for(let row of rows){if(!row.trim())continue;const cols=parseCSVRow(row);if(cols.length>=2)cards.push({question:cols[0],answer:cols[1],hint:cols[2]||''});}
    if(!cards.length){alert('No valid cards found');return;}
    const{data:existing}=await sb.from('flashcard_decks').select('unlock_order').eq('type','riddle').order('unlock_order',{ascending:false}).limit(1);
    const nextLevel=(existing&&existing[0]?.unlock_order||0)+1;
    const{data:newDeck,error:deckError}=await sb.from('flashcard_decks').insert({name:deckName,topic:deckName,type:'riddle',unlock_order:nextLevel,user_id:null}).select().single();
    if(deckError){alert('Failed to create deck: '+deckError.message);return;}
    for(let card of cards){await sb.from('flashcards').insert({deck_id:newDeck.id,question:card.question,answer:card.answer});}
    alert(`✓ Riddle Deck uploaded — Level ${nextLevel} with ${cards.length} cards`);
    riddleDeckName.value='';riddleFileInput.value='';loadTab('feynman');
  })();};
  reader.readAsText(file);
},{style:{marginBottom:'16px'}});
riddleSection.append(riddleDeckName,riddleFileInput,riddleUploadBtn);
const riddleList=div({style:{marginTop:'16px'}});
async function loadRiddleDecks(){
  riddleList.innerHTML='';
  const{data:decks}=await sb.from('flashcard_decks').select('*').eq('type','riddle').order('unlock_order',{ascending:true});
  if(!decks||!decks.length){riddleList.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',textAlign:'center',padding:'16px'},html:'No riddle decks yet.'}));return;}
  for(let deck of decks){
    const{count}=await sb.from('flashcards').select('*',{count:'exact',head:true}).eq('deck_id',deck.id);
    const deckRow=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',borderBottom:'1px solid var(--border)'}},[
      div({},[h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',fontWeight:'bold'},html:deck.name}),h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--dim)'},html:`Level ${deck.unlock_order} · ${count||0} cards`})]),
      btn('Delete','btn-outline',async()=>{await sb.from('flashcards').delete().eq('deck_id',deck.id);await sb.from('flashcard_decks').delete().eq('id',deck.id);loadRiddleDecks();},{style:{padding:'4px 12px',fontSize:'10px'}})
    ]);
    riddleList.append(deckRow);
  }
}
riddleSection.append(riddleList);
content.append(riddleSection);
await loadRiddleDecks();
// EMOJI BITZ SECTION
const emojiSection=div({cls:'card',style:{marginTop:'32px',marginBottom:'32px'}});
emojiSection.append(
  h('h2',{style:{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'18px',marginBottom:'4px'},html:'Emoji Bitz'}),
  h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--dim)',marginBottom:'16px'},html:'upload emoji bitz csv'})
);
const emojiDeckName=inp('Deck name e.g. Bacteria Emojis','text','');
emojiDeckName.style.marginBottom='12px';
const emojiFileInput=h('input',{type:'file',accept:'.csv',style:{marginBottom:'12px'}});
const emojiUploadBtn=btn('Upload Emoji Bitz','btn-gold',()=>{
  const deckName=emojiDeckName.value.trim();
  const file=emojiFileInput.files[0];
  if(!deckName||!file){alert('Please enter deck name and select CSV file');return;}
  const reader=new FileReader();
  reader.onload=(e)=>{(async()=>{
    const text=e.target.result;
    const rows=text.split('\n').slice(1);
    const cards=[];
    for(let row of rows){if(!row.trim())continue;const cols=parseCSVRow(row);if(cols.length>=2)cards.push({question:cols[0],answer:cols[1],hint:cols[2]||''});}
    if(!cards.length){alert('No valid cards found');return;}
    const{data:existing}=await sb.from('flashcard_decks').select('unlock_order').eq('type','emoji').order('unlock_order',{ascending:false}).limit(1);
    const nextLevel=(existing&&existing[0]?.unlock_order||0)+1;
    const{data:newDeck,error:deckError}=await sb.from('flashcard_decks').insert({name:deckName,topic:deckName,type:'emoji',unlock_order:nextLevel,user_id:null}).select().single();
    if(deckError){alert('Failed to create deck: '+deckError.message);return;}
    for(let card of cards){await sb.from('flashcards').insert({deck_id:newDeck.id,question:card.question,answer:card.answer});}
    alert(`✓ Emoji Bitz Deck uploaded — Level ${nextLevel} with ${cards.length} cards`);
    emojiDeckName.value='';emojiFileInput.value='';loadTab('feynman');
  })();};
  reader.readAsText(file);
},{style:{marginBottom:'16px'}});
emojiSection.append(emojiDeckName,emojiFileInput,emojiUploadBtn);
const emojiList=div({style:{marginTop:'16px'}});
async function loadEmojiDecks(){
  emojiList.innerHTML='';
  const{data:decks}=await sb.from('flashcard_decks').select('*').eq('type','emoji').order('unlock_order',{ascending:true});
  if(!decks||!decks.length){emojiList.append(h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'11px',color:'var(--dim)',textAlign:'center',padding:'16px'},html:'No emoji bitz decks yet.'}));return;}
  for(let deck of decks){
    const{count}=await sb.from('flashcards').select('*',{count:'exact',head:true}).eq('deck_id',deck.id);
    const deckRow=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',borderBottom:'1px solid var(--border)'}},[
      div({},[h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'13px',fontWeight:'bold'},html:deck.name}),h('div',{style:{fontFamily:"Inter,sans-serif",fontSize:'9px',color:'var(--dim)'},html:`Level ${deck.unlock_order} · ${count||0} cards`})]),
      btn('Delete','btn-outline',async()=>{await sb.from('flashcards').delete().eq('deck_id',deck.id);await sb.from('flashcard_decks').delete().eq('id',deck.id);loadEmojiDecks();},{style:{padding:'4px 12px',fontSize:'10px'}})
    ]);
    emojiList.append(deckRow);
  }
}
emojiSection.append(emojiList);
content.append(emojiSection);
await loadEmojiDecks();
}
}
loadTab('settings');
}
showLogin();return page;
}
// ═══════════════════════════════
// AI TUTOR CHAT PANEL
// ═══════════════════════════════
let freeMessagesCount=0;
let currentMessages=[];

function initAIChat(){
  if(document.getElementById('ai-chat-btn'))return;
  const chatBtn=document.createElement('button');
  chatBtn.id='ai-chat-btn';
  chatBtn.innerHTML=ICONS.brain+' Ask Tutor';
  chatBtn.style.cssText='position:fixed;bottom:20px;right:20px;z-index:10000;display:inline-flex;align-items:center;gap:8px;padding:12px 20px;background:var(--gold);color:var(--bg);border:none;border-radius:40px;font-size:13px;font-family:"DM Mono",monospace;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);width:auto;';
  chatBtn.addEventListener('click',()=>toggleChat());
  document.body.appendChild(chatBtn);
  let isOpen=false;let panel=null;let thinkingDiv=null;
  function toggleChat(){
    if(isOpen){if(panel)panel.remove();panel=null;}
    else{panel=buildChatPanel();document.body.appendChild(panel);}
    isOpen=!isOpen;
  }
  function buildChatPanel(){
    const panelDiv=div({style:{position:'fixed',bottom:'80px',right:'20px',width:'350px',height:'500px',background:'var(--card)',border:'1px solid var(--gold)',borderRadius:'12px',zIndex:10000,display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 8px 24px rgba(0,0,0,0.4)'}});
    const header=div({style:{padding:'12px 16px',background:'var(--gold)',color:'var(--bg)',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:'bold'}},[
      h('span',{style:{display:'inline-flex',alignItems:'center',gap:'8px'},html:ICONS.brain+' Deo Tutor'}),
      btn('✕','',()=>toggleChat(),{style:{background:'none',border:'none',color:'var(--bg)',fontSize:'18px',cursor:'pointer',padding:'0'}})
    ]);
    const messagesDiv=div({style:{flex:'1',overflowY:'auto',padding:'12px',display:'flex',flexDirection:'column',gap:'8px'}});
    const inputArea=div({style:{padding:'12px',borderTop:'1px solid var(--border)',display:'flex',gap:'8px'}});
    const input=h('input',{type:'text',placeholder:'Ask a medical question...',style:{flex:'1',padding:'8px',borderRadius:'4px',border:'1px solid var(--border)',background:'var(--bg)',color:'var(--text)',fontFamily:"'Inter',sans-serif",fontSize:'13px'}});
    const sendBtn=btn('Send','btn-gold',()=>sendMessage(),{style:{padding:'8px 16px',fontSize:'13px'}});
    inputArea.append(input,sendBtn);
    panelDiv.append(header,messagesDiv,inputArea);
    if(currentMessages.length===0){currentMessages=[{role:'assistant',content:"Hi! I'm your Deo Tutor. Ask me anything about medicine."}];}
    function addMessage(role,content){
      const isUser=role==='user';
      const msgDiv=div({style:{alignSelf:isUser?'flex-end':'flex-start',background:isUser?'var(--gold)':'var(--card)',color:isUser?'var(--bg)':'var(--text)',padding:'8px 12px',borderRadius:'12px',maxWidth:'80%',fontSize:'13px',fontFamily:"'Inter',sans-serif",lineHeight:'1.5',wordBreak:'break-word'}});
      msgDiv.textContent=content;
      messagesDiv.appendChild(msgDiv);
      messagesDiv.scrollTop=messagesDiv.scrollHeight;
    }
    currentMessages.forEach(m=>addMessage(m.role,m.content));
    async function sendMessage(){
      const text=input.value.trim();if(!text)return;
      input.value='';
      const isFree=S.profile?.is_free_tier===true;
      if(isFree&&freeMessagesCount>=5){addMessage('assistant','Free tier limit reached (5 messages per session). 👑 Upgrade to continue chatting.');return;}
      addMessage('user',text);
      currentMessages.push({role:'user',content:text});
      if(isFree)freeMessagesCount++;
      thinkingDiv=div({style:{alignSelf:'flex-start',background:'var(--card)',padding:'8px 12px',borderRadius:'12px',fontSize:'12px',color:'var(--dim)'}});
      thinkingDiv.textContent='...';
      messagesDiv.appendChild(thinkingDiv);
      messagesDiv.scrollTop=messagesDiv.scrollHeight;
      try{
        const topic=window._currentTopic||'general medicine';
        const response=await fetch('https://ai-tutor.ambahtamaratubor.workers.dev',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:currentMessages,topic})});
        const data=await response.json();
        if(thinkingDiv)thinkingDiv.remove();thinkingDiv=null;
        const reply=data.reply||"Sorry, I couldn't process that. Try again.";
        addMessage('assistant',reply);
        currentMessages.push({role:'assistant',content:reply});
      }catch(err){
        if(thinkingDiv)thinkingDiv.remove();thinkingDiv=null;
        addMessage('assistant','Sorry, the tutor is offline. Try again later.');
      }
    }
    return panelDiv;
  }
}

function setAITopic(topic){window._currentTopic=topic;}


render();