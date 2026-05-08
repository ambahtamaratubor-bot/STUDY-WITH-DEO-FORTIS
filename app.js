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
function go(p){S.page=p;render();}
sb.auth.getSession().then(({data:{session}})=>{if(session){S.user=session.user;getProfile(session.user.id);}});
sb.auth.onAuthStateChange((_,session)=>{if(session){S.user=session.user;getProfile(session.user.id);}else{S.user=null;S.profile=null;go('landing');}});
async function getProfile(id){
const{data}=await sb.from('profiles').select('*').eq('id',id).single();
if(data){S.profile=data;go(data.status==='approved'?'dashboard':'pending');}
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
function render(){
const root=document.getElementById('root');
root.innerHTML='';
const pages={landing,signup,login,pending,dashboard,study,flashcards,vignette,leaderboard,admin};
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
[['rain','🌧️ Rain',links.rain],['ocean','🌊 Ocean',links.ocean],['cafe','☕ Cafe',links.cafe],['white','🤍 White',links.white]].forEach(([key,lbl2,url])=>{
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
const saved=localStorage.getItem('pomodoroState');
if(!saved)return;
try{
const st=JSON.parse(saved);
const mt=(st.isBreak?(st.cfg?.breakMins||5):(st.cfg?.workMins||25))*60;
const segStart=Date.now()-(st.timer*1000);
const elapsed=Math.floor((Date.now()-segStart)/1000);
const rem=Math.max(0,mt-elapsed);
const t=document.getElementById('timer-bar-time');
const s=document.getElementById('timer-bar-session');
if(t)t.textContent=fmtMS(rem);
if(t)t.style.color=st.isBreak?'var(--teal)':'var(--gold)';
if(s)s.textContent=st.isBreak?'BREAK':'FOCUS · Session '+(st.curSess||1);
}catch(e){}
}

function removeTimerBar(){
const bar=document.getElementById('timer-bar');
if(bar)bar.remove();
if(window._timerBarInterval)clearInterval(window._timerBarInterval);
document.body.style.paddingTop='0';
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
const vbtn=div({style:{display:'inline-flex',alignItems:'center',gap:'10px',padding:'12px 24px',border:'1px solid var(--border)',borderRadius:'2px',fontFamily:"'DM Mono',monospace",fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)',cursor:'pointer'}});
vbtn.append(div({style:{width:'24px',height:'24px',borderRadius:'50%',border:'1px solid var(--dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'var(--gold)',html:'▶'}}),document.createTextNode('Watch Demo (Optional)'));
vbtn.onclick=()=>showVidModal(cfg.video);
hbtns.append(vbtn);
hc.append(hbtns);
const stats=div({style:{display:'flex',gap:'48px',marginTop:'56px',flexWrap:'wrap'}});
[['3','Recall Formats'],['100%','Full Access'],['∞','Sessions']].forEach(([n,l])=>{
const s=div({style:{borderLeft:'2px solid var(--border)',paddingLeft:'16px'}});
s.append(div({style:{fontFamily:"'Playfair Display',serif",fontSize:'36px',color:'var(--gold)',lineHeight:'1',fontWeight:'700'},html:n}),div({cls:'mono',style:{marginTop:'6px'},html:l}));
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
card.append(div({style:{display:'flex',alignItems:'baseline',gap:'6px',marginBottom:'4px'}},[h('span',{style:{fontFamily:"'Playfair Display',serif",fontSize:'52px',color:plan.color,lineHeight:'1',fontWeight:'700'},html:plan.price}),h('span',{style:{fontSize:'14px',color:'var(--dim)',fontWeight:'300'},html:plan.period})]));
card.append(div({style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:plan.color,letterSpacing:'1px',marginBottom:'24px',opacity:'.8'},html:plan.dur+' of full access'}));
card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',marginBottom:'20px'}}));
const fl=div({style:{marginBottom:'28px'}});
features.forEach(f=>{const item=div({cls:'check-item'});item.append(h('span',{style:{color:plan.color,fontSize:'12px',marginTop:'2px',flexShrink:'0'},html:'✦'}),h('span',{},[f]));fl.append(item);});
card.append(fl);
const eb=h('a',{cls:'btn btn-gold',style:{background:plan.color,color:'#0F0E0A',width:'100%',textAlign:'center',display:'block'},html:'Enrol — '+plan.price,id:'enrol-'+plan.key});
eb.href='#';
eb.onclick=e=>{e.preventDefault();showEnrolModal(plan,cfg.links[plan.key]||'#');};
card.append(eb);
card.append(h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)',textAlign:'center',marginTop:'12px',letterSpacing:'1px',textTransform:'uppercase'},html:'Approval required · Payment via Selar'}));
plansGrid.append(card);
});
plansSection.append(plansGrid);
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
card.append(div({style:{fontSize:'28px',marginBottom:'14px'},html:r.icon}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontWeight:'600',fontSize:'17px',marginBottom:'8px',color:'var(--text)'},html:r.title}),h('p',{style:{fontSize:'14px',color:'#6A6050',lineHeight:'1.7',fontWeight:'300'},html:r.desc}));
rg.append(card);
});
whySection.append(rg);
page.append(whySection);
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
s.append(div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'48px',color:'var(--border)',lineHeight:'1',marginBottom:'16px'},html:step.num}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'17px',color:'var(--text)',marginBottom:'8px',fontWeight:'600'},html:step.title}),h('p',{style:{fontSize:'14px',color:'#6A6050',lineHeight:'1.7',fontWeight:'300'},html:step.desc}));
hg.append(s);
});
howSection.append(hg);
page.append(howSection);
// FOOTER
const footer=div({style:{borderTop:'1px solid var(--border)',padding:'48px',textAlign:'center'}});
footer.append(div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'28px',color:'var(--gold)',marginBottom:'10px'},html:'Deo Fortis'}),div({style:{color:'var(--gold)',opacity:'.4',letterSpacing:'8px',marginBottom:'12px'},html:'✦ ✦ ✦'}),h('p',{style:{fontSize:'14px',color:'var(--dim)',fontWeight:'300'},html:'Study with purpose. Results follow.'}),btn('Admin','',()=>go('admin'),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'11px',marginTop:'24px',fontFamily:"'DM Mono',monospace",letterSpacing:'2px',textTransform:'uppercase'}}));
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
card.append(div({cls:'mono',style:{marginBottom:'8px'},html:pkg.name}),div({style:{fontFamily:"'Playfair Display',serif",fontSize:'48px',color:i===0?'var(--gold)':'var(--purple)',lineHeight:'1',fontWeight:'700',marginBottom:'8px'},html:pkg.price}),div({style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:i===0?'var(--gold)':'var(--purple)',letterSpacing:'1px',marginBottom:'24px',opacity:'.8'},html:pkg.sessions}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',marginBottom:'20px'}}));
const fl=div({style:{marginBottom:'28px'}});
(pkg.features||'').split(',').forEach(f=>{const item=div({cls:'check-item'});item.append(h('span',{style:{color:i===0?'var(--gold)':'var(--purple)',fontSize:'12px',flexShrink:'0'},html:'✦'}),h('span',{},[f.trim()]));fl.append(item);});
card.append(fl);
const ab=h('a',{cls:'btn',style:{background:i===0?'var(--gold)':'var(--purple)',color:'#0F0E0A',width:'100%',textAlign:'center',display:'block'},html:'Book — '+pkg.price});
ab.href=pkg.selar_link||'#';ab.target='_blank';
card.append(ab,h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)',textAlign:'center',marginTop:'12px',letterSpacing:'1px',textTransform:'uppercase'},html:'Includes study portal access'}));
pg.append(card);
});
// Custom session card
if(pg){
const customCard=div({cls:'plan-card',style:{borderTopWidth:'3px',borderTopColor:'var(--gold)',borderColor:'#C8A96E33'}});
customCard.append(
div({cls:'mono',style:{marginBottom:'8px'},html:'Custom Session'}),
div({style:{fontFamily:"'Playfair Display',serif",fontSize:'48px',color:'var(--gold)',lineHeight:'1',fontWeight:'700',marginBottom:'8px'},html:'$15'}),
div({style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--gold)',letterSpacing:'1px',marginBottom:'24px',opacity:'.8'},html:'per session'}),
h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',marginBottom:'20px'}}),
h('p',{style:{fontSize:'14px',color:'var(--muted)',lineHeight:'1.8',marginBottom:'28px'},html:"Need help with a specific topic, your study timetable, or just not sure where to start? Book a single session with one of our tutors — we'll figure it out together. No commitment, no package required."})
);
const customBtn=h('a',{cls:'btn',style:{background:'var(--gold)',color:'#0F0E0A',width:'100%',textAlign:'center',display:'block'},html:'Book a Session — $15',id:'custom-session-btn'});
customBtn.href=s?.link_custom||'#';customBtn.target='_blank';
customCard.append(customBtn,h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)',textAlign:'center',marginTop:'12px',letterSpacing:'1px',textTransform:'uppercase'},html:'One session · No commitment'}));
pg.append(customCard);
}}
const{data:ts}=await sb.from('testimonials').select('*').order('created_at',{ascending:false});
const tss=document.getElementById('ts-section');
const tsg=document.getElementById('ts-grid');
if(ts&&ts.length&&tss&&tsg){tss.style.display='block';ts.forEach(t=>{const c=div({cls:'card'});c.append(div({style:{fontSize:'24px',color:'var(--gold)',marginBottom:'16px',opacity:'.6'},html:'"'}),h('p',{style:{fontSize:'15px',color:'var(--muted)',lineHeight:'1.8',marginBottom:'20px',fontStyle:'italic',fontWeight:'300'},html:t.content}),div({style:{borderTop:'1px solid var(--border)',paddingTop:'16px'}},[div({style:{fontFamily:"'Playfair Display',serif",fontSize:'15px',color:'var(--text)',fontWeight:'600'},html:t.name}),t.title?div({cls:'mono',style:{marginTop:'4px'},html:t.title}):null].filter(Boolean)));tsg.append(c);});}
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
const badge=div({style:{background:plan.color,color:'#0F0E0A',borderRadius:'4px',padding:'12px 16px',marginBottom:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}});
badge.append(div({},[div({style:{fontFamily:"'DM Mono',monospace",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'4px'},html:'Selected Plan'}),div({style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',fontWeight:'700'},html:plan.name+' — '+plan.price})]),div({style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'1px'},html:plan.dur+' access'}));
const submitBtn=btn('Create Account & Pay','btn-gold',async()=>{
errEl.classList.add('hidden');
if(!nameI.value||!emailI.value||!passI.value){errEl.classList.remove('hidden');errEl.textContent='Please fill in all fields.';return;}
if(passI.value.length<6){errEl.classList.remove('hidden');errEl.textContent='Password must be at least 6 characters.';return;}
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
box.append(div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}},[h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px'},html:'Create Account'}),btn('x','',()=>ov.remove(),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'18px',cursor:'pointer'}})]),badge,errEl,field('Full Name',nameI),field('Email',emailI),field('Password',passI),submitBtn,h('p',{style:{fontSize:'12px',color:'var(--dim)',textAlign:'center',marginTop:'12px',fontFamily:"'DM Mono',monospace",letterSpacing:'1px'},html:'You will be redirected to Selar to complete payment'}),h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'12px'},html:'Already have an account? <button onclick="go(\'login\')" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px">Log in</button>'}));
ov.append(box);document.body.append(ov);
}
function showSignupSuccess(name,selarLink){
const ov=div({cls:'modal-bg'});
const box=div({cls:'card',style:{maxWidth:'440px',width:'100%',textAlign:'center'}});
box.append(div({style:{fontSize:'48px',marginBottom:'16px'},html:' '}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'12px'},html:'Account Created!'}),h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.8',marginBottom:'24px'},html:'Hi '+name+'! Complete your payment on Selar to get approved and gain full access.'}),h('a',{cls:'btn btn-gold',style:{display:'block',textAlign:'center',marginBottom:'12px'},href:selarLink,target:'_blank',html:'Complete Payment on Selar →'}),h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'16px'},html:"You'll be approved as soon as your payment is verified"}),btn('Log In After Paying','btn-outline',()=>{ov.remove();go('login');},{style:{marginTop:'16px',width:'100%'}}));
ov.append(box);document.body.append(ov);
}
function showVidModal(url){
const ov=div({cls:'modal-bg'});
ov.onclick=e=>{if(e.target===ov)ov.remove();};
const box=div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',width:'100%',maxWidth:'720px',overflow:'hidden'}});
const hdr=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',borderBottom:'1px solid var(--border)'}});
hdr.append(h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)'},html:'Platform Demo'}),btn('✕','',()=>ov.remove(),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'18px'}}));
const va=div({style:{aspectRatio:'16/9',background:'#000',display:'flex',alignItems:'center',justifyContent:'center'}});
if(url){const ifr=h('iframe',{src:url,style:{width:'100%',height:'100%',border:'none'},allowFullscreen:true});va.append(ifr);}
else va.append(h('p',{style:{fontFamily:"'DM Mono',monospace",color:'var(--dim)',fontSize:'11px',letterSpacing:'2px'},html:'VIDEO NOT UPLOADED YET'}));
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
h('div',{style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'4px'},html:'Deo Fortis'}),
h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),
h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'4px'},html:'Create Account'}),
h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'20px'},html:'Fill in your details to get started.'})
);
if(sel){
const badge=div({style:{borderRadius:'4px',padding:'12px 16px',marginBottom:'16px',display:'flex',justifyContent:'space-between',alignItems:'center',background:sel.color,color:'#0F0E0A'}});
const bl=div({});bl.append(h('div',{style:{fontFamily:"'DM Mono',monospace",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'4px'},html:'Selected Plan'}),h('div',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',fontWeight:'700'},html:sel.name+' — '+sel.price}));
badge.append(bl,h('div',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px'},html:sel.dur+' access'}));fc.append(badge);
}
const errEl=div({cls:'err hidden',id:'su-err'});fc.append(errEl);
// All inputs use unique IDs for reliable value capture
const nameInput=document.createElement('input');nameInput.id='su-name';nameInput.type='text';nameInput.placeholder='Your full name';nameInput.style.cssText='width:100%;background:var(--bg);border:1px solid var(--border);border-radius:2px;padding:12px 16px;color:var(--text);font-size:14px;outline:none;box-sizing:border-box;font-family:Georgia,serif;';
const emailInput=document.createElement('input');emailInput.id='su-email';emailInput.type='email';emailInput.placeholder='your@email.com';emailInput.style.cssText=nameInput.style.cssText;
const passInput=document.createElement('input');passInput.id='su-pass';passInput.type='password';passInput.placeholder='Min. 6 characters';passInput.style.cssText=nameInput.style.cssText;
const pass2Input=document.createElement('input');pass2Input.id='su-pass2';pass2Input.type='password';pass2Input.placeholder='Confirm your password';pass2Input.style.cssText=nameInput.style.cssText;
function wrapField(labelText,input){const w=div({style:{marginBottom:'16px'}});const l=h('label',{cls:'label',html:labelText});w.append(l,input);return w;}
fc.append(wrapField('Full Name',nameInput),wrapField('Email',emailInput),wrapField('Password',passInput),wrapField('Confirm Password',pass2Input));
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
const{data,error}=await sb.auth.signUp({email:emailVal,password:passVal});
if(error){errBox.classList.remove('hidden');errBox.textContent=error.message;submitBtn.textContent=sel?'Create Account — '+sel.price:'Create Account';submitBtn.disabled=false;return;}
if(data&&data.user){
const profileData={id:data.user.id,email:emailVal,full_name:nameVal,status:'pending'};
if(sel)profileData.plan=sel.name;
await sb.from('profiles').upsert(profileData,{onConflict:'id'});
sendAdminEmail('New Signup — Deo Fortis','<h2>New Student</h2><p>Name: '+nameVal+'</p><p>Email: '+emailVal+'</p><p>Plan: '+(sel?sel.name:'None')+'</p>');
sessionStorage.removeItem('selPlan');
const link=sel?(payLinks[sel.key]||sel.link||'#'):'#';
if(link&&link!=='#')window.open(link,'_blank');
wrap.innerHTML='';
const dc=div({cls:'card',style:{textAlign:'center'}});
dc.append(h('div',{style:{fontSize:'48px',marginBottom:'16px'},html:' '}),h('div',{style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'16px'},html:'Deo Fortis'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'12px'},html:'Account Created!'}),h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.8',marginBottom:'24px'},html:'Hi '+nameVal+'! Complete your payment to get approved.'}));
if(link&&link!=='#'){const payBtn=document.createElement('a');payBtn.href=link;payBtn.target='_blank';payBtn.textContent='Complete Payment '+(sel?'— '+sel.price:'')+' →';payBtn.style.cssText='display:block;text-align:center;padding:12px 28px;font-family:"DM Mono",monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;background:var(--gold);color:#0F0E0A;text-decoration:none;border-radius:2px;margin-bottom:12px;';dc.append(payBtn);}
dc.append(h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'16px'},html:"You'll be approved as soon as your payment is verified"}));
const lb=btn('Log In After Paying','btn-outline',()=>go('login'),{style:{marginTop:'16px',width:'100%'}});dc.append(lb);wrap.append(dc);
}
}catch(e){const eb2=document.getElementById('su-err');if(eb2){eb2.classList.remove('hidden');eb2.textContent='Something went wrong. Please try again.';}submitBtn.textContent=sel?'Create Account — '+sel.price:'Create Account';submitBtn.disabled=false;}
};
fc.append(submitBtn);wrap.append(fc);
if(!sel){
const ps=div({style:{marginBottom:'20px'}});
ps.append(h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',marginBottom:'16px'},html:'Select Your Plan'}));
const pl=div({style:{display:'grid',gap:'12px'}});
let links2={monthly:'#',sixmonth:'#',yearly:'#'};
sb.from('admin_settings').select('*').single().then(({data})=>{if(data)links2={monthly:data.link_monthly||'#',sixmonth:data.link_sixmonth||'#',yearly:data.link_yearly||'#'};});
[{name:'Monthly',price:'$10',period:'/ month',dur:'1 Month',color:'var(--gold)',key:'monthly'},{name:'6 Months',price:'$39',period:'/ 6 months',dur:'6 Months',color:'var(--teal)',popular:true,key:'sixmonth'},{name:'1 Year',price:'$59',period:'/ year',dur:'12 Months',color:'var(--purple)',key:'yearly'}].forEach(plan=>{
const card=div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',padding:'20px 24px',cursor:'pointer',transition:'all .2s',position:'relative'},id:'pc-'+plan.key});
if(plan.popular)card.append(h('span',{style:{position:'absolute',top:'-1px',right:'16px',background:'var(--teal)',color:'#0F0E0A',fontFamily:"'DM Mono',monospace",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',padding:'3px 10px',borderRadius:'0 0 4px 4px'},html:'Best Value'}));
const row=div({style:{display:'flex',alignItems:'center',justifyContent:'space-between'}});
const left=div({});left.append(h('div',{cls:'mono',style:{marginBottom:'4px'},html:plan.name}),h('div',{style:{fontFamily:"'Playfair Display',serif",fontSize:'28px',color:plan.color,fontWeight:'700',lineHeight:'1'},html:plan.price+' <span style="font-size:13px;color:var(--dim);font-weight:300">'+plan.period+'</span>'}));
const radio=div({style:{width:'22px',height:'22px',borderRadius:'50%',border:'2px solid var(--border)',flexShrink:'0'}});radio.id='pr-'+plan.key;row.append(left,radio);card.append(row,h('div',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:plan.color,letterSpacing:'1px',marginTop:'6px',opacity:'.7'},html:plan.dur+' of full access'}));
card.onclick=()=>{
[{name:'Monthly',key:'monthly'},{name:'6 Months',key:'sixmonth'},{name:'1 Year',key:'yearly'}].forEach(p2=>{const c=document.getElementById('pc-'+p2.key);const r=document.getElementById('pr-'+p2.key);if(c){c.style.border='1px solid var(--border)';c.style.background='var(--card)';}if(r){r.innerHTML='';r.style.border='2px solid var(--border)';}});
card.style.border='1px solid '+plan.color;card.style.background='#1a1a0f';radio.style.border='2px solid '+plan.color;radio.innerHTML='<div style="width:10px;height:10px;border-radius:50%;background:'+plan.color+'"></div>';
sel={...plan,link:links2[plan.key]||'#'};submitBtn.textContent='Create Account — '+plan.price;
};pl.append(card);
});
ps.append(pl);wrap.append(ps);
}
const lp=div({style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'16px'}});lp.append(document.createTextNode('Already have an account? '));const ll=document.createElement('button');ll.style.cssText='background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px;';ll.textContent='Log in';ll.onclick=()=>go('login');lp.append(ll);
const bp=div({style:{textAlign:'center',marginTop:'8px'}});const bl2=document.createElement('button');bl2.style.cssText="background:none;border:none;color:var(--dim);cursor:pointer;font-size:12px;font-family:'DM Mono',monospace;letter-spacing:1px;";bl2.textContent='← Back to home';bl2.onclick=()=>go('landing');bp.append(bl2);
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
// Forgot password
const fpBtn=document.createElement('button');fpBtn.style.cssText='background:none;border:none;color:var(--gold);cursor:pointer;font-size:12px;font-family:"DM Mono",monospace;letter-spacing:1px;display:block;margin-bottom:16px;';fpBtn.textContent='Forgot password?';
fpBtn.onclick=async()=>{const em=emailInp.value.trim();if(!em){errEl.classList.remove('hidden');errEl.textContent='Enter your email first.';return;}const{error}=await sb.auth.resetPasswordForEmail(em,{redirectTo:window.location.origin});if(error){errEl.classList.remove('hidden');errEl.textContent=error.message;}else{errEl.classList.remove('hidden');errEl.style.background='#0a1f18';errEl.style.border='1px solid var(--teal)';errEl.style.color='var(--teal)';errEl.textContent='Password reset email sent! Check your inbox.';}};
const sb2=btn('Log In','btn-gold',async()=>{
errEl.classList.add('hidden');sb2.textContent='Logging in...';sb2.disabled=true;
const{data,error}=await sb.auth.signInWithPassword({email:emailI.value,password:passI.value});
if(error){errEl.classList.remove('hidden');errEl.textContent=error.message;sb2.textContent='Log In';sb2.disabled=false;return;}
await getProfile(data.user.id);
},{style:{width:'100%',marginBottom:'16px'}});
passI.onkeydown=e=>{if(e.key==='Enter')sb2.click();};
card.append(div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'4px'},html:'Deo Fortis'}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'4px'},html:'Welcome Back'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'Log in to continue your studies.'}),errEl,field('Email',emailI),field('Password',passI,{mb:'mb-24'}),sb2,h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'16px'},html:"Don't have an account? <button onclick=\"go('signup')\" style=\"background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px\">Sign up</button>"}),h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'8px'},html:"<button onclick=\"go('landing')\" style=\"background:none;border:none;color:var(--dim);cursor:pointer;font-size:12px\">← Back to home</button>"}));
page.append(card);return page;
}
// ═══════════════════════════════
// PENDING
// ═══════════════════════════════
function pending(){
const page=div({cls:'center',style:{minHeight:'100vh',padding:'24px'}});
const card=div({cls:'card fade',style:{width:'100%',maxWidth:'480px',textAlign:'center'}});
card.append(div({style:{fontSize:'48px',marginBottom:'20px'},html:' '}),div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'16px'},html:'Deo Fortis'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'12px'},html:'Awaiting Approval'}),h('p',{cls:'muted',style:{fontSize:'15px',lineHeight:'1.7',marginBottom:'24px'},html:'Thanks for joining Deo Fortis! Your account is pending approval. You will be approved as soon as your payment is verified.'}),div({cls:'quote',style:{marginBottom:'24px',textAlign:'left'},html:'"Great students are patient students."'}),btn('Log Out','btn-outline',()=>sb.auth.signOut()));
page.append(card);return page;
}
// ═══════════════════════════════
// DASHBOARD
// ═══════════════════════════════
function dashboard(){
const page=div({});
let clockedIn=false,curSess=null,elapsed=0,ticker=null;
const p=S.profile||{};
const nav=div({cls:'dash-nav'});
nav.append(div({cls:'logo',html:'Deo Fortis'}),div({style:{display:'flex',gap:'8px'}},[btn(' Study','btn-outline',()=>go('study'),{style:{padding:'8px 16px'}}),btn(' Cards','btn-outline',()=>go('flashcards'),{style:{padding:'8px 16px'}}),btn(' Q-Bank','btn-outline',()=>go('vignette'),{style:{padding:'8px 16px'}}),btn(' ','btn-outline',()=>go('leaderboard'),{style:{padding:'8px 16px'}}),btn('Log Out','btn-outline',()=>sb.auth.signOut(),{style:{padding:'8px 16px'}})]));
page.append(nav);
const inner=div({cls:'inner'});
const th=Math.floor((p.total_study_minutes||0)/60),tm=(p.total_study_minutes||0)%60;
// Check for new content notification
if(S.profile?.has_new_content){
const banner=div({style:{background:'linear-gradient(135deg,#0a1f18,#0d2a1e)',border:'1px solid var(--teal)',borderRadius:'4px',padding:'14px 20px',marginBottom:'24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}});
banner.append(div({style:{display:'flex',alignItems:'center',gap:'12px'}},[div({style:{fontSize:'24px'},html:'🧠'}),div({},[div({style:{fontFamily:"'Playfair Display',serif",fontSize:'16px',color:'var(--teal)',fontWeight:'600',marginBottom:'2px'},html:'Your recall content is ready!'}),div({style:{fontSize:'13px',color:'var(--muted)'},html:'Your active recall request has been fulfilled. Go to Flashcards or Q-Bank to access it.'})])]),btn('Dismiss','',async()=>{await sb.from('profiles').update({has_new_content:false}).eq('id',S.user.id);banner.remove();},{style:{background:'none',border:'1px solid var(--teal)',color:'var(--teal)',fontSize:'11px',padding:'6px 12px',flexShrink:'0'}}));
inner.append(banner);
}
inner.append(div({cls:'fade'},[h('span',{cls:'chapter',html:'Welcome Back'}),h('h1',{style:{fontFamily:"'Playfair Display',serif",fontSize:'40px',fontWeight:'700',marginBottom:'4px'},html:(p.full_name||'Scholar')+' <em style="font-style:italic;color:var(--gold);font-size:32px">📖</em>'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'40px'},html:'Plan: <span style="color:var(--gold)">'+(p.plan||'Active')+'</span> · Expires: <span style="color:var(--text)">'+(p.access_expires_at?new Date(p.access_expires_at).toLocaleDateString():'Active')+'</span>'})]));
const sg=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'40px'}});
[{label:'Total Study Time',val:th+'h '+tm+'m',color:'var(--gold)'},{label:'Sessions',val:'0',color:'var(--teal)',id:'sc'},{label:'Status',val:'Active',color:'var(--purple)'}].forEach(s=>{
const c=div({cls:'card',style:{textAlign:'center'}});
c.append(div({style:{fontFamily:"'Playfair Display',serif",fontSize:'32px',color:s.color,fontWeight:'700',marginBottom:'4px'},html:s.val,id:s.id||''}),div({cls:'mono',html:s.label}));
sg.append(c);
});
inner.append(sg);
const cg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px',marginBottom:'24px'}});
const cc=div({cls:'card'});
const timerD=div({style:{fontFamily:"'DM Mono',monospace",fontSize:'36px',color:'var(--gold)',textAlign:'center',marginBottom:'20px',display:'none'},html:'00:00:00',id:'tdis'});
const cdesc=h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'20px'},html:'Ready to study? Clock in to start tracking.'});
const cinBtn=btn('Clock In','btn-gold',async()=>{
const{data,error}=await sb.from('study_sessions').insert({user_id:S.user.id,topic:'General Study',started_at:new Date().toISOString()}).select().single();if(error){console.log('Clock in error:',error);return;}
if(data){curSess=data;clockedIn=true;elapsed=0;timerD.style.display='block';cdesc.style.display='none';cinBtn.style.display='none';coutBtn.style.display='block';ticker=setInterval(()=>{elapsed++;const td=document.getElementById('tdis');if(td)td.textContent=fmtHMS(elapsed);},1000);}
},{style:{width:'100%'}});
const coutBtn=btn('Clock Out','btn-red',async()=>{
clearInterval(ticker);const mins=Math.floor(elapsed/60);
if(curSess)await sb.from('study_sessions').update({ended_at:new Date().toISOString(),duration_minutes:mins}).eq('id',curSess.id);
await sb.from('profiles').update({total_study_minutes:(p.total_study_minutes||0)+mins}).eq('id',S.user.id);
clockedIn=false;curSess=null;elapsed=0;timerD.style.display='none';cdesc.style.display='block';cinBtn.style.display='block';coutBtn.style.display='none';loadSess();
},{style:{width:'100%',display:'none'}});
cc.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',marginBottom:'20px'},html:'Clock In / Out'}),timerD,cdesc,cinBtn,coutBtn);
const sc2=div({cls:'card'});
sc2.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',marginBottom:'20px'},html:'Recent Sessions'}),div({id:'slist',html:'<p style="font-size:14px;color:var(--dim)">Loading...</p>'}));
cg.append(cc,sc2);inner.append(cg);
const ag=div({style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}});
ag.append(btn('Start Pomodoro →','btn-gold',()=>go('study'),{style:{padding:'18px',fontSize:'13px'}}),btn('Flashcards →','btn-outline',()=>go('flashcards'),{style:{padding:'18px',fontSize:'13px'}}),btn('Q-Bank →','btn-outline',()=>go('vignette'),{style:{padding:'18px',fontSize:'13px'}}));
inner.append(ag);
// Community button
const commCard=div({cls:'card',style:{marginTop:'16px',background:'linear-gradient(135deg,#1a1509,#141309)',border:'1px solid #C8A96E44',borderRadius:'4px',padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}});
const commLeft=div({style:{display:'flex',alignItems:'center',gap:'12px'}});
const commTxt=div({});commTxt.append(h('div',{style:{fontFamily:"'Playfair Display',serif",fontSize:'17px',color:'var(--text)',fontWeight:'600',marginBottom:'2px'},html:'Join Our Community'}),h('div',{style:{fontSize:'13px',color:'var(--muted)'},html:'Connect with other students and stay accountable.'}));
commLeft.append(h('div',{style:{fontSize:'28px'},html:' '}),commTxt);
const commBtn=document.createElement('a');commBtn.href='#';commBtn.target='_blank';commBtn.id='comm-btn';commBtn.textContent='Join Now →';commBtn.style.cssText='display:none;padding:10px 20px;font-family:"DM Mono",monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;background:var(--gold);color:#0F0E0A;text-decoration:none;border-radius:2px;flex-shrink:0;';
commCard.append(commLeft,commBtn);inner.append(commCard);
// Support email
const supCard=div({cls:'card',style:{marginTop:'12px',padding:'16px 24px',display:'flex',alignItems:'center',gap:'12px'}});
const supTxt=div({});supTxt.append(h('span',{style:{fontSize:'13px',color:'var(--muted)'},html:'Need help? '}));
const supLink=document.createElement('a');supLink.href='mailto:';supLink.id='sup-link';supLink.textContent='Contact support';supLink.style.color='var(--gold)';supLink.style.fontSize='13px';supTxt.append(supLink);
supCard.append(h('div',{style:{fontSize:'20px'},html:'✉️'}),supTxt);inner.append(supCard);
// Theory PDFs section
(async()=>{
const{data:pdfs}=await sb.from('theory_pdfs').select('*').eq('user_id',S.user.id).order('created_at',{ascending:false});
if(pdfs&&pdfs.length){
const pdfCard=div({cls:'card',style:{marginTop:'12px'}});
pdfCard.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',marginBottom:'16px'},html:'📄 Theory Questions'}));
pdfs.forEach(pdf=>{
const row=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}});
row.append(h('span',{style:{fontSize:'14px',color:'var(--text)'},html:pdf.topic+' — '+pdf.filename}));
const viewBtn=btn('View PDF','btn-outline',()=>{
const win=window.open();
win.document.write('<iframe src="data:application/pdf;base64,'+pdf.data+'" style="width:100%;height:100vh;border:none;"></iframe>');
},{style:{fontSize:'11px',padding:'6px 12px'}});
row.append(viewBtn);pdfCard.append(row);
});
inner.append(pdfCard);
}
})();
page.append(inner);
async function loadSess(){
const{data}=await sb.from('study_sessions').select('*').eq('user_id',S.user.id).order('started_at',{ascending:false}).limit(5);
const sl=document.getElementById('slist');const sc3=document.getElementById('sc');
if(!sl)return;
if(!data||!data.length){sl.innerHTML='<p style="font-size:14px;color:var(--dim)">No sessions yet.</p>';return;}
if(sc3)sc3.textContent=data.length;
sl.innerHTML='';
data.forEach(s=>{const row=div({style:{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)',fontSize:'13px'}});row.append(h('span',{style:{color:'var(--muted)'},html:new Date(s.started_at).toLocaleDateString()}),h('span',{style:{color:'var(--gold)'},html:(s.duration_minutes||0)+' mins'}));sl.append(row);});
}
loadSess();
// Load community link and support email
sb.from('admin_settings').select('community_link,support_email').single().then(({data})=>{
if(data){
if(data.community_link){const cb=document.getElementById('comm-btn');if(cb){cb.href=data.community_link;cb.style.display='block';}}
if(data.support_email){const sl=document.getElementById('sup-link');if(sl)sl.href='mailto:'+data.support_email;}
}
});
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
// If there's an active session, go straight to timer
if(window.activeSessionId){
  sb.from('admin_settings').select('noise_rain,noise_ocean,noise_cafe,noise_white').single().then(({data:nd})=>{
    if(nd)noiseLinks2={rain:nd.noise_rain||'',ocean:nd.noise_ocean||'',cafe:nd.noise_cafe||'',white:nd.noise_white||''};
    showTimer();
  });
  return page;
}
function showSetup(){
page.innerHTML='';
const card=div({cls:'card fade',style:{width:'100%',maxWidth:'540px'}});
card.append(btn('← Back','',()=>go('dashboard'),{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'12px',fontFamily:"'DM Mono',monospace",letterSpacing:'1px',marginBottom:'16px'}}));
card.append(h('span',{cls:'chapter',html:'Study Setup'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'26px',marginBottom:'24px'},html:'Configure Your Session'}));
const topI=inp('e.g. Bacteriology, Cardiology','text',cfg.topic);topI.id='st-topic';topI.oninput=e=>cfg.topic=e.target.value;
card.append(field('What topic are you studying?',topI));
card.append(h('label',{cls:'label',html:'Pomodoro Configuration'}));
const pg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'8px'}});
const wI=inp('25','number',String(cfg.workMins));wI.min='1';wI.max='120';wI.oninput=e=>cfg.workMins=parseInt(e.target.value)||25;
const bI=inp('5','number',String(cfg.breakMins));bI.min='1';bI.max='60';bI.oninput=e=>cfg.breakMins=parseInt(e.target.value)||5;
const sI=inp('4','number',String(cfg.sessions));sI.min='1';sI.max='20';sI.oninput=e=>cfg.sessions=parseInt(e.target.value)||4;
[[wI,'Work (mins)'],[bI,'Break (mins)'],[sI,'Sessions']].forEach(([i,l])=>{const w=div({});w.append(h('label',{cls:'label',style:{fontSize:'9px'},html:l}),i);pg.append(w);});
card.append(pg,h('p',{cls:'mono',style:{marginBottom:'20px'},html:'Set your own work time, break time and number of sessions'}));
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
  btn('← Back','',()=>showSetup(),{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'12px',fontFamily:"'DM Mono',monospace",letterSpacing:'1px',marginBottom:'16px',display:'block'}}),
  h('span',{cls:'chapter',html:'Ready to Study?'}),
  div({style:{fontSize:'64px',margin:'24px 0'},html:'📖'}),
  h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'28px',marginBottom:'8px'},html:'Clock In'}),
  h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'32px'},html:'Click below to start your session and begin the timer.'})
);
const cinBtn=btn('⏵ Clock In & Start Timer','btn-gold',async()=>{
  cinBtn.textContent='Clocking in...';cinBtn.disabled=true;
  const{data:sess,error}=await sb.from('study_sessions').insert({user_id:S.user.id,topic:cfg.topic||'General Study',started_at:new Date().toISOString()}).select().single();
  if(error){cinBtn.textContent='⏵ Clock In & Start Timer';cinBtn.disabled=false;alert('Failed to clock in. Try again.');return;}
  window.activeSessionId=sess.id;
  window.sessionStartTime=Date.now();
  showNoiseBar();showTimerBar();
  showTimer();
},{style:{width:'100%',padding:'16px'}});
card.append(cinBtn);
page.append(card);
}
function showClockOut(){
page.innerHTML='';
const mins=window.sessionStartTime?Math.round((Date.now()-window.sessionStartTime)/60000):0;
const card=div({cls:'card fade',style:{width:'100%',maxWidth:'400px',textAlign:'center'}});
card.append(
  div({style:{fontSize:'64px',margin:'24px 0'},html:'✅'}),
  h('span',{cls:'chapter',html:'Session Complete!'}),
  h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'28px',marginBottom:'8px'},html:'Clock Out'}),
  h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'8px'},html:'Great work! You studied for:'}),
  div({style:{fontFamily:"'Playfair Display',serif",fontSize:'48px',color:'var(--gold)',marginBottom:'32px'},html:mins+' mins'})
);
const coutBtn=btn('⏹ Clock Out & Save Session','btn-gold',async()=>{
  coutBtn.textContent='Saving...';coutBtn.disabled=true;
  if(window.activeSessionId){
    await sb.from('study_sessions').update({ended_at:new Date().toISOString(),duration_minutes:mins}).eq('id',window.activeSessionId);
    await sb.from('profiles').update({total_study_minutes:(S.profile?.total_study_minutes||0)+mins,total_points:(S.profile?.total_points||0)+5}).eq('id',S.user.id);
    window.activeSessionId=null;window.sessionStartTime=null;localStorage.removeItem('pomodoroState');removeNoiseBar();removeTimerBar();
  }
  go('dashboard');
},{style:{width:'100%',padding:'16px'}});
card.append(coutBtn,btn('Back to Dashboard','btn-outline',()=>go('dashboard'),{style:{width:'100%',marginTop:'12px'}}));
page.append(card);
}
function showTimer(){
page.innerHTML='';
const maxTime=isBreak?cfg.breakMins*60:cfg.workMins*60;
// Use wall clock for accuracy across tab switches
const segmentStartTime=Date.now()-(timer*1000);
const r=80,circ=2*Math.PI*r;
const card=div({cls:'card fade',style:{textAlign:'center',maxWidth:'400px',width:'100%'}});
card.append(h('span',{cls:'chapter',html:isBreak?' Break Time':'Session '+curSess+' of '+cfg.sessions}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',marginBottom:'8px',color:isBreak?'var(--teal)':'var(--text)'},html:cfg.topic}));
const svgNS='http://www.w3.org/2000/svg';
const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('width','200');svg.setAttribute('height','200');svg.style.transform='rotate(-90deg)';
const bgC=document.createElementNS(svgNS,'circle');bgC.setAttribute('cx','100');bgC.setAttribute('cy','100');bgC.setAttribute('r',String(r));bgC.setAttribute('fill','none');bgC.setAttribute('stroke','var(--border)');bgC.setAttribute('stroke-width','6');
const fgC=document.createElementNS(svgNS,'circle');fgC.setAttribute('cx','100');fgC.setAttribute('cy','100');fgC.setAttribute('r',String(r));fgC.setAttribute('fill','none');fgC.setAttribute('stroke',isBreak?'var(--teal)':'var(--gold)');fgC.setAttribute('stroke-width','6');fgC.setAttribute('stroke-dasharray',String(circ));fgC.setAttribute('stroke-dashoffset',String(circ));fgC.setAttribute('stroke-linecap','round');fgC.style.transition='stroke-dashoffset 1s linear';
svg.append(bgC,fgC);
const tw=div({style:{position:'relative',width:'200px',height:'200px',margin:'24px auto'}});
tw.append(svg);
const tc=div({style:{position:'absolute',inset:'0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}});
const td=div({style:{fontFamily:"'DM Mono',monospace",fontSize:'32px',color:isBreak?'var(--teal)':'var(--gold)'},html:fmtMS(maxTime)});
const ml=div({cls:'mono',style:{marginTop:'4px'},html:isBreak?'BREAK':'FOCUS'});
tc.append(td,ml);tw.append(tc);card.append(tw);
const br=div({style:{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'16px'}});
const pauseBtn=btn('Start','btn-gold',()=>{running=!running;if(running){interval=setInterval(tick,1000);pauseBtn.textContent='Pause';}else{clearInterval(interval);pauseBtn.textContent='Resume';}});
br.append(pauseBtn,btn('End Session','btn-outline',()=>{clearInterval(interval);showClockOut();}),btn('← Dashboard','btn-outline',()=>{go('dashboard');},{style:{fontSize:'11px'}}));
card.append(br);
const qr=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}});
qr.append(
  btn('🃏 Flashcards','btn-outline',()=>{go('flashcards');},{style:{fontSize:'11px'}}),
  btn('📝 Q-Bank','btn-outline',()=>{go('vignette');},{style:{fontSize:'11px'}})
);
card.append(qr);
const resumeNote=div({style:{fontFamily:"'DM Mono',monospace",fontSize:'9px',color:'var(--dim)',textAlign:'center',marginTop:'8px',letterSpacing:'1px'}});
resumeNote.textContent='Timer keeps running while you study — come back anytime';
card.append(resumeNote);
page.append(card);
function tick(){
const mt=isBreak?cfg.breakMins*60:cfg.workMins*60;
timer=Math.floor((Date.now()-segmentStartTime)/1000);
const rem=Math.max(0,mt-timer);
td.textContent=fmtMS(rem);fgC.setAttribute('stroke-dashoffset',String(circ*(1-timer/mt)));
localStorage.setItem('pomodoroState',JSON.stringify({timer,curSess,isBreak,cfg,activeSessionId:window.activeSessionId,sessionStartTime:window.sessionStartTime}));
if(timer>=mt){
clearInterval(interval);timer=0;
if(isBreak){
  isBreak=false;curSess++;
  if(curSess>cfg.sessions){showClockOut();return;}
  showTimer();
}else{
  if(curSess>=cfg.sessions){showClockOut();return;}
  isBreak=true;showTimer();
}
if(running)interval=setInterval(tick,1000);
}
}
// White noise YouTube players
if(noiseLinks2.rain||noiseLinks2.ocean||noiseLinks2.cafe||noiseLinks2.white){
const noiseSection=div({style:{marginTop:'16px',width:'100%',maxWidth:'400px'}});
noiseSection.append(div({cls:'mono',style:{marginBottom:'8px',textAlign:'center'},html:'White Noise'}));
const noiseGrid=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}});
[['rain','🌧️ Rain',noiseLinks2.rain],['ocean','🌊 Ocean',noiseLinks2.ocean],['cafe','☕ Cafe',noiseLinks2.cafe],['white','🤍 White',noiseLinks2.white]].forEach(([key,label,url])=>{
  if(!url)return;
  const wrap=div({style:{borderRadius:'4px',overflow:'hidden',border:'1px solid var(--border)'}});
  const ifr=h('iframe',{src:url+'?autoplay=0&controls=1',style:{width:'100%',height:'80px',border:'none'},allow:'autoplay'});
  wrap.append(div({style:{fontFamily:"'DM Mono',monospace",fontSize:'9px',color:'var(--muted)',letterSpacing:'1px',padding:'4px 8px',background:'var(--card)'},html:label}),ifr);
  noiseGrid.append(wrap);
});
noiseSection.append(noiseGrid);
page.append(noiseSection);
}
running=true;interval=setInterval(tick,1000);pauseBtn.textContent='Pause';
// Re-sync when tab becomes visible
document.addEventListener('visibilitychange',function onVisible(){
  if(!document.hidden&&running){
    clearInterval(interval);
    interval=setInterval(tick,1000);
    tick();
  }
},true);
}
showSetup();return page;
}
// ═══════════════════════════════
// FLASHCARDS
// ═══════════════════════════════
function flashcards(){
const page=div({});
const nav=div({cls:'dash-nav'});
nav.append(div({cls:'logo',html:'Deo Fortis'}),btn('← Dashboard','btn-outline',()=>go('dashboard'),{style:{padding:'8px 16px'}}));
page.append(nav);
let decks=[],selDeck=null,cards=[],queue=[],curIdx=0,flipped=false,prog={easy:0,iffy:0,hard:0};
const inner=div({cls:'inner-sm'});page.append(inner);
async function showDecks(){
inner.innerHTML='';
inner.append(h('span',{cls:'chapter',html:'Flashcard Decks'}),h('h1',{style:{fontFamily:"'Playfair Display',serif",fontSize:'40px',fontWeight:'700',marginBottom:'8px'},html:'Study <em class="gold-em">Flashcards</em>'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'40px'},html:'Select a deck. Mark cards Easy, Iffy, or Hard as you go.'}));
const{data}=await sb.from('flashcard_decks').select('*').or('user_id.eq.'+S.user.id+',user_id.is.null').order('created_at',{ascending:false});
decks=data||[];
if(!decks.length){inner.append(div({cls:'card',style:{textAlign:'center',padding:'48px'}},[div({style:{fontSize:'40px',marginBottom:'16px'},html:' '}),h('p',{style:{fontSize:'14px',color:'var(--dim)'},html:'No flashcard decks yet.'})]));return;}
const grid=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'16px'}});
decks.forEach(deck=>{
const card=div({cls:'card',style:{cursor:'pointer'}});
card.append(div({style:{fontSize:'32px',marginBottom:'12px'},html:' '}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',color:'var(--text)',marginBottom:'8px'},html:deck.topic}),btn('Start Deck →','btn-gold',async()=>loadDeck(deck),{style:{width:'100%',marginTop:'16px'}}));
grid.append(card);
});
inner.append(grid);
// Show past performance
const{data:history}=await sb.from('anki_results').select('*').eq('user_id',S.user.id).order('created_at',{ascending:false}).limit(10);
if(history&&history.length){
const hCard=div({cls:'card',style:{marginTop:'24px'}});
hCard.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',marginBottom:'16px'},html:'Past Performance'}));
history.forEach(r=>{
const row=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)'}});
const gradeColor=r.grade==='A'?'var(--teal)':r.grade==='B'?'var(--gold)':'#ff8888';
row.append(
  h('span',{style:{fontSize:'13px',color:'var(--text)'},html:r.deck_topic||'—'}),
  div({style:{display:'flex',gap:'12px',alignItems:'center'}},[
    h('span',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',color:gradeColor,fontWeight:'700'},html:r.grade}),
    h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)'},html:new Date(r.created_at).toLocaleDateString()})
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
  h('span',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',color:avgColor,fontWeight:'700'},html:avgGrade})
]));
inner.append(hCard);
}
}
async function loadDeck(deck){
selDeck=deck;
const{data}=await sb.from('flashcards').select('*').eq('deck_id',deck.id);
if(!data||!data.length){alert('No cards in this deck yet.');return;}
cards=[...data];queue=[...data];curIdx=0;flipped=false;prog={easy:0,iffy:0,hard:0};
showCard();
}
function showCard(){
inner.innerHTML='';
if(!queue.length||curIdx>=queue.length){showDone();return;}
const card=queue[curIdx];
const pct=cards.length>0?Math.round((prog.easy/cards.length)*100):0;
const hdr=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}});
hdr.append(btn('← Decks','',()=>showDecks(),{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'12px',fontFamily:"'DM Mono',monospace",letterSpacing:'1px'}}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--muted)'},html:selDeck?.topic||''}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--dim)'},html:(curIdx+1)+' / '+queue.length}));
inner.append(hdr);
const pb=div({cls:'progress-bar',style:{marginBottom:'8px'}});pb.append(div({cls:'progress-fill',style:{width:pct+'%',background:'var(--teal)'}}));
inner.append(pb);
const pr=div({style:{display:'flex',justifyContent:'space-between',marginBottom:'24px'}});
pr.append(h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--teal)'},html:'✓ '+prog.easy+' easy'}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--gold)'},html:'~ '+prog.iffy+' iffy'}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'#ff8888'},html:'✗ '+prog.hard+' hard'}));
inner.append(pr);
const fw=div({cls:'flip-card',style:{width:'100%',height:'240px',marginBottom:'24px'}});
const fi=div({cls:'flip-inner',style:{height:'100%'}});
const front=div({cls:'flip-front card',style:{position:'absolute',width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px'}});
front.append(div({cls:'mono',style:{marginBottom:'16px'},html:'Question — tap to flip'}),h('p',{style:{fontSize:'16px',color:'var(--text)',textAlign:'center',lineHeight:'1.7'},html:card.question}));
const back=div({cls:'flip-back card',style:{position:'absolute',width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px',background:'#0a1f18',borderColor:'var(--teal)'}});
back.append(div({style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--teal)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px'},html:'Answer'}),h('p',{style:{fontSize:'16px',color:'var(--teal)',textAlign:'center',lineHeight:'1.7'},html:card.answer}));
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
// Track previous state for proper movement
const prev=cur._state||'none';
cur._state=d;
// Update counts - move from previous bucket to new one
if(prev==='iffy'&&d==='easy'){prog.iffy=Math.max(0,prog.iffy-1);prog.easy++;}
else if(prev==='hard'&&d==='iffy'){prog.hard=Math.max(0,prog.hard-1);prog.iffy++;}
else if(prev==='hard'&&d==='easy'){prog.hard=Math.max(0,prog.hard-1);prog.easy++;}
else if(prev==='iffy'&&d==='iffy'){} // stays in iffy, no change
else{prog[d]++;}
let nq=[...queue];
if(d==='easy'){
  // Easy = done, remove from queue
  nq.splice(curIdx,1);
} else if(d==='iffy'){
  // Iffy = revisit at end
  nq.splice(curIdx,1);nq.push(cur);
} else if(d==='hard'){
  // Hard = revisit soon (2 cards later)
  nq.splice(curIdx,1);nq.splice(Math.min(curIdx+2,nq.length),0,cur);
}
if(!nq.length){showDone();return;}
queue=nq;curIdx=Math.min(curIdx,queue.length-1);flipped=false;showCard();
}
async function showDone(){
inner.innerHTML='';
const total=prog.easy+prog.iffy+prog.hard;
const grade=prog.easy>=prog.iffy&&prog.easy>=prog.hard?'A':prog.iffy>=prog.hard?'B':'C';
const gradeColor=grade==='A'?'var(--teal)':grade==='B'?'var(--gold)':'#ff8888';
const gradeMsg=grade==='A'?'Excellent mastery!':grade==='B'?'Good effort, keep reviewing.':'Needs more practice.';
// Save result and award points
await sb.from('anki_results').insert({user_id:S.user.id,deck_id:selDeck?.id,deck_topic:selDeck?.topic,grade,easy_count:prog.easy,iffy_count:prog.iffy,hard_count:prog.hard});
await sb.from('profiles').update({total_points:(S.profile?.total_points||0)+20,total_anki_sessions:(S.profile?.total_anki_sessions||0)+1}).eq('id',S.user.id);
const card=div({cls:'card fade',style:{textAlign:'center'}});
card.append(
  div({style:{fontSize:'48px',marginBottom:'16px'},html:'🎉'}),
  h('span',{cls:'chapter',html:'Deck Complete'}),
  h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'28px',marginBottom:'8px'},html:selDeck?.topic||''}),
  div({style:{fontFamily:"'Playfair Display',serif",fontSize:'80px',color:gradeColor,lineHeight:'1',marginBottom:'8px'},html:grade}),
  div({cls:'mono',style:{marginBottom:'4px'},html:gradeMsg}),
  div({style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--gold)',marginBottom:'24px'},html:'+20 points earned'})
);
const sg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'24px'}});
[{l:'Easy',v:prog.easy,c:'var(--teal)'},{l:'Iffy',v:prog.iffy,c:'var(--gold)'},{l:'Hard',v:prog.hard,c:'#ff8888'}].forEach(s=>{const c=div({cls:'card',style:{padding:'16px',textAlign:'center'}});c.append(div({style:{fontFamily:"'Playfair Display',serif",fontSize:'28px',color:s.c},html:String(s.v)}),div({cls:'mono',html:s.l}));sg.append(c);});
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
const nav=div({cls:'dash-nav'});
nav.append(div({cls:'logo',html:'Deo Fortis'}),btn('← Dashboard','btn-outline',()=>go('dashboard'),{style:{padding:'8px 16px'}}));
page.append(nav);
let questions=[],current=0,answers={},submitted=false,revealed={},timeLeft=0,tInterval=null,selTopic='',mode='',timeLimit=60;
const inner=div({cls:'inner-sm'});page.append(inner);
async function showSetup(){
inner.innerHTML='';
inner.append(h('span',{cls:'chapter',html:'Question Bank'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'26px',marginBottom:'24px'},html:'Configure Your Quiz'}));
const{data}=await sb.from('vignette_questions').select('topic').or('user_id.eq.'+S.user.id+',user_id.is.null');
const topics=data?[...new Set(data.map(d=>d.topic))]:[];
if(!topics.length){inner.append(div({cls:'card',style:{textAlign:'center',padding:'48px'}},[h('p',{style:{fontSize:'14px',color:'var(--dim)'},html:'No questions available yet.'})]));return;}
const tSel=h('select',{cls:'input',style:{cursor:'pointer',marginBottom:'20px'}});
tSel.append(h('option',{value:'',html:'Choose a topic...'}));
topics.forEach(t=>tSel.append(h('option',{value:t,html:t})));
tSel.onchange=e=>selTopic=e.target.value;
inner.append(h('label',{cls:'label',html:'Select Topic'}),tSel);
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
const startBtn=btn('Start Quiz →','btn-gold',async()=>{
if(!selTopic||!mode)return;
const{data:qs}=await sb.from('vignette_questions').select('*').eq('topic',selTopic).or('user_id.eq.'+S.user.id+',user_id.is.null').limit(40);
if(!qs||!qs.length){alert('No questions for this topic yet.');return;}
questions=qs;current=0;answers={};submitted=false;revealed={};
if(mode==='timed')timeLeft=timeLimit*60;
showQuiz();
},{style:{width:'100%'}});
inner.append(startBtn);
// Show past quiz performance
sb.from('vignette_scores').select('*').eq('user_id',S.user.id).order('created_at',{ascending:false}).limit(10).then(({data:scores})=>{
if(!scores||!scores.length)return;
const hCard=div({cls:'card',style:{marginTop:'24px'}});
hCard.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',marginBottom:'16px'},html:'Past Performance'}));
scores.forEach(s=>{
const pct=Math.round(s.score/s.total*100);
const pctColor=pct>=80?'var(--teal)':pct>=50?'var(--gold)':'#ff8888';
const row=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:'1px solid var(--border)'}});
row.append(div({},[h('span',{style:{fontSize:'13px',color:'var(--text)'},html:s.topic}),div({cls:'mono',style:{fontSize:'9px',marginTop:'2px'},html:s.mode+' mode'})]),div({style:{display:'flex',gap:'12px',alignItems:'center'}},[h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'13px',color:pctColor,fontWeight:'700'},html:pct+'%'}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)'},html:s.score+'/'+s.total}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)'},html:new Date(s.created_at).toLocaleDateString()})]));
hCard.append(row);});
const avgPct=Math.round(scores.reduce((sum,s)=>sum+(s.score/s.total*100),0)/scores.length);
const avgColor=avgPct>=80?'var(--teal)':avgPct>=50?'var(--gold)':'#ff8888';
hCard.append(div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'12px',paddingTop:'12px',borderTop:'1px solid var(--border)'}},[div({cls:'mono',html:'Average Score'}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'20px',color:avgColor,fontWeight:'700'},html:avgPct+'%'})]));
inner.append(hCard);
});
}
function showQuiz(){
page.innerHTML='';page.append(nav);
const qNav=div({style:{background:'rgba(15,14,10,.97)',borderBottom:'1px solid var(--border)',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:'0',zIndex:'100'}});
const tEl=h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'16px',color:'var(--gold)',display:mode==='timed'?'inline':'none'},html:fmtMS(timeLeft)});
const pEl=h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--muted)'},html:(current+1)+' / '+questions.length});
qNav.append(h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--muted)',letterSpacing:'1px'},html:selTopic+' · '+(mode==='tutor'?'Tutor':'Timed')}),div({style:{display:'flex',gap:'16px',alignItems:'center'}},[tEl,pEl]));
page.append(qNav);
if(mode==='timed'){tInterval=setInterval(()=>{timeLeft--;tEl.textContent=fmtMS(timeLeft);if(timeLeft<60)tEl.style.color='#ff8888';if(timeLeft<=0){clearInterval(tInterval);submitQuiz();}},1000);}
const qi=div({style:{display:'grid',gridTemplateColumns:'200px 1fr',maxWidth:'1000px',margin:'0 auto',padding:'24px',gap:'24px'}});
const sidebar=div({});
sidebar.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Questions'}));
const ng=div({style:{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'4px'}});
questions.forEach((q,i)=>{
const nb=h('button',{style:{width:'32px',height:'32px',border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',fontFamily:"'DM Mono',monospace",fontSize:'10px',cursor:'pointer',borderRadius:'2px'},html:String(i+1),id:'nb-'+i});
nb.onclick=()=>{current=i;updateQ();};ng.append(nb);
});
sidebar.append(ng);
if(mode==='timed'&&!submitted)sidebar.append(btn('Submit All →','btn-gold',()=>submitQuiz(),{style:{width:'100%',marginTop:'20px',fontSize:'11px'}}));
const mainArea=div({id:'quiz-main'});
qi.append(sidebar,mainArea);page.append(qi);
updateQ();
function updateQ(){
const q=questions[current];mainArea.innerHTML='';pEl.textContent=(current+1)+' / '+questions.length;
questions.forEach((qq,i)=>{
const nb=document.getElementById('nb-'+i);if(!nb)return;
if(i===current){nb.style.border='1px solid var(--gold)';nb.style.background='#C8A96E22';nb.style.color='var(--gold)';}
else if(answers[qq.id]){const ok=answers[qq.id]===qq.correct_answer;nb.style.border='1px solid '+(ok?'var(--teal)':'#8B0000');nb.style.background=ok?'#7EB8A422':'#8B000022';nb.style.color=ok?'var(--teal)':'#ff8888';}
else{nb.style.border='1px solid var(--border)';nb.style.background='transparent';nb.style.color='var(--muted)';}
});
const qCard=div({cls:'card',style:{marginBottom:'16px'}});
qCard.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Question '+(current+1)}),h('p',{style:{fontSize:'15px',color:'var(--text)',lineHeight:'1.8'},html:q.question}));
mainArea.append(qCard);
['a','b','c','d','e'].forEach(opt=>{
const val=q['option_'+opt];if(!val)return;
const ob=h('button',{cls:'option-btn'});
const isSel=answers[q.id]===opt.toUpperCase();
const isCorr=q.correct_answer===opt.toUpperCase();
const isRev=revealed[q.id]||submitted;
if(isRev&&isCorr)ob.classList.add('correct');
else if(isRev&&isSel&&!isCorr)ob.classList.add('wrong');
else if(isSel)ob.classList.add('selected');
ob.append(h('strong',{style:{marginRight:'12px'},html:opt.toUpperCase()+'.'}),document.createTextNode(val));
ob.onclick=()=>{if(submitted)return;answers[q.id]=opt.toUpperCase();if(mode==='tutor')revealed[q.id]=true;updateQ();};
mainArea.append(ob);
});
if((revealed[q.id]||submitted)&&q.explanation){
const exp=div({style:{background:'#0a1f18',border:'1px solid #7EB8A422',borderRadius:'2px',padding:'16px',marginTop:'16px'}});
exp.append(div({style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--teal)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'},html:'Explanation'}),h('p',{style:{fontSize:'14px',color:'var(--muted)',lineHeight:'1.7'},html:q.explanation}));
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
await sb.from('vignette_scores').insert({user_id:S.user.id,topic:selTopic,score,total:questions.length,mode});
await sb.from('profiles').update({total_points:(S.profile?.total_points||0)+30}).eq('id',S.user.id);
showResults(score);
}
function showResults(score){
page.innerHTML='';page.append(nav);
const ri=div({cls:'inner-sm center',style:{minHeight:'80vh',flexDirection:'column'}});
const card=div({cls:'card fade',style:{maxWidth:'500px',width:'100%',textAlign:'center'}});
card.append(h('span',{cls:'chapter',html:'Quiz Complete'}),div({style:{fontSize:'56px',margin:'16px 0'},html:score/questions.length>=.7?' ':' '}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'36px',marginBottom:'4px',color:'var(--gold)'},html:score+' / '+questions.length}),div({cls:'mono',style:{marginBottom:'8px'},html:Math.round(score/questions.length*100)+'% correct'}),h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--muted)',marginBottom:'24px'},html:selTopic+' · '+mode+' mode'}),div({cls:'quote',style:{textAlign:'left',marginBottom:'24px'},html:score/questions.length>=.8?'"Excellent. You know this topic well."':score/questions.length>=.5?'"Good effort. Review the ones you missed."':'"Keep studying. Come back stronger."'}));
const bw=div({style:{display:'grid',gap:'10px'}});
bw.append(btn('Try Again','btn-gold',()=>showSetup()),btn('Dashboard','btn-outline',()=>go('dashboard')));
card.append(bw);ri.append(card);page.append(ri);
}
showSetup();return page;
}
// ═══════════════════════════════
// LEADERBOARD
// ═══════════════════════════════
function leaderboard(){
const page=div({});
const nav=div({cls:'dash-nav'});
nav.append(div({cls:'logo',html:'Deo Fortis'}),btn('← Dashboard','btn-outline',()=>go('dashboard'),{style:{padding:'8px 16px'}}));
page.append(nav);
const inner=div({cls:'inner-sm'});
inner.append(h('span',{cls:'chapter',html:'Rankings'}),h('h1',{style:{fontFamily:"'Playfair Display',serif",fontSize:'48px',fontWeight:'700',marginBottom:'8px'},html:'🏆 The <em class="gold-em">Leaderboard</em>'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'40px'},html:'Rankings based on total study hours. Updated in real time.'}));
const board=div({cls:'card',style:{marginBottom:'32px'},id:'board',html:'<p style="font-size:14px;color:var(--dim);text-align:center;padding:20px">Loading...</p>'});
inner.append(board);
const bc=div({cls:'card',style:{textAlign:'center',borderColor:'#C8A96E33',borderTopWidth:'3px',borderTopColor:'var(--gold)'}});
bc.append(div({style:{fontSize:'32px',marginBottom:'12px'},html:'📚'}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Want Personal Tutoring?'}),h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.7',marginBottom:'20px'},html:'Work directly with me. Get personalised guidance and full portal access.'}),btn('Book a Session →','btn-gold',()=>showBooking()));
inner.append(bc);page.append(inner);
const medals=[' ',' ',' '];
sb.from('profiles').select('full_name,total_points,total_study_minutes').eq('status','approved').order('total_points',{ascending:false}).limit(20).then(({data})=>{
const b=document.getElementById('board');if(!b)return;
if(!data||!data.length){b.innerHTML='<p style="font-size:14px;color:var(--dim);text-align:center;padding:20px">No data yet. Be the first to clock in!</p>';return;}
b.innerHTML='';
data.forEach((row,i)=>{const r=div({cls:'leaderboard-row'});r.append(h('span',{style:{fontSize:'22px',width:'32px'},html:medals[i]||(i+1)+'.'}),h('span',{style:{flex:'1',fontSize:'15px',color:'var(--text)'},html:row.full_name}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'13px',color:'var(--gold)'},html:(row.total_points||0)+' pts'}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--dim)',marginLeft:'8px'},html:Math.floor((row.total_study_minutes||0)/60)+'h'}));b.append(r);});
});
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
box.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'20px'},html:'Book a Session'}),field('Full Name',nI),field('Email',eI),field('Package',pSel),field('What do you need help with?',mI),div({style:{display:'flex',gap:'12px'}},[sBtn,btn('Cancel','btn-outline',()=>ov.remove())]));
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
card.append(div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'4px'},html:'Deo Fortis'}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'16px'},html:'Admin Access'}),eEl,h('label',{cls:'label',html:'Password'}),pI,h('br'),entBtn,h('p',{style:{fontSize:'12px',color:'var(--dim)',textAlign:'center'},html:'<button onclick="go(\'landing\')" style="background:none;border:none;color:var(--dim);cursor:pointer;font-size:12px">← Back to site</button>'}));
wrap.append(card);page.append(wrap);
}
async function showAdminPanel(){
page.innerHTML='';
const aN=div({style:{background:'rgba(15,14,10,.97)',borderBottom:'1px solid var(--border)',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:'0',zIndex:'100'}});
aN.append(div({cls:'logo',html:'Admin — Deo Fortis'}),btn('← Site','btn-outline',()=>go('landing'),{style:{padding:'8px 16px'}}));
page.append(aN);
const tabs=div({style:{borderBottom:'1px solid var(--border)',display:'flex',overflowX:'auto'}});
const content=div({cls:'inner-md'});
let curTab='settings';
const tabDefs=[['settings','⚙ Settings'],['users',' Users'],['recalls',' Recalls'],['flashcards',' Flashcards'],['questions',' Q-Bank'],['testimonials',' Reviews'],['packages',' Packages'],['bookings',' Bookings']];
tabDefs.forEach(([id,label])=>{
const tb=h('button',{cls:'tab-btn'+(id===curTab?' active':''),html:label});
tb.onclick=()=>{curTab=id;tabs.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));tb.classList.add('active');loadTab(id);};
tabs.append(tb);
});
page.append(tabs,content);
async function loadTab(tab){
content.innerHTML='<p style="color:var(--dim);font-size:14px;padding:24px">Loading...</p>';
if(tab==='settings'){
const{data:s}=await sb.from('admin_settings').select('*').single();
const set=s||{};
const card=div({cls:'card fade'});
card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'24px'},html:'Site Settings'}));
// Video
const vI=inp('https://www.youtube.com/embed/...','text',set.video_url||'');
card.append(field('Demo Video URL',vI),h('p',{cls:'mono',style:{marginBottom:'20px'},html:'YouTube: Share → Embed → copy the src URL only'}));
// Payment links
card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'24px 0'}}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',marginBottom:'16px'},html:'Study Portal Payment Links'}));
const lIs={};
[['link_monthly','Monthly ($10)'],['link_sixmonth','6 Months ($39)'],['link_yearly','1 Year ($59)'],['link_custom','Custom Session ($15)']].forEach(([k,l])=>{const i=inp('https://selar.co/...','text',set[k]||'');lIs[k]=i;card.append(field(l,i));});
// Community & support
card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'24px 0'}}));
card.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',marginBottom:'16px'},html:'Platform Links'}));
const comI=inp('https://...','text',set.community_link||'');
const supI=inp('deofortistutors@gmail.com','email',set.support_email||'');
card.append(field('Community Link (Forum / Discord / WhatsApp)',comI),field('Support Email (shown on dashboard)',supI));
// White noise
card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'24px 0'}}));
card.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',marginBottom:'8px'},html:'White Noise Audio Links'}));
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
card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Users'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:pend+' pending approval'}));
(users||[]).forEach(u=>{
const row=div({style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid var(--border)'}});
const info=div({});
info.append(div({style:{fontSize:'15px',color:'var(--text)',marginBottom:'2px'},html:u.full_name||'—'}),div({style:{fontSize:'12px',color:'var(--muted)'},html:(u.email||'—')+' · '+(u.plan||'No plan')+' · '+new Date(u.created_at).toLocaleDateString()}));
const right=div({style:{display:'flex',alignItems:'center',gap:'12px'}});
right.append(h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',color:u.status==='approved'?'var(--teal)':'var(--gold)'},html:u.status||'pending'}));
if(u.status!=='approved'){right.append(btn('Approve','btn-teal',async()=>{const exp=new Date();exp.setMonth(exp.getMonth()+1);await sb.from('profiles').update({status:'approved',access_expires_at:exp.toISOString()}).eq('id',u.id);loadTab('users');},{style:{padding:'6px 16px',fontSize:'11px'}}));}
row.append(info,right);card.append(row);
});
content.innerHTML='';content.append(card);
}
if(tab==='recalls'){
const{data:recs}=await sb.from('recall_requests').select('*').order('created_at',{ascending:false});
content.innerHTML='';
content.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'24px'},html:'Recall Requests'}));
if(!recs||!recs.length){content.append(div({cls:'card',style:{textAlign:'center',padding:'40px'}},[h('p',{style:{fontSize:'14px',color:'var(--dim)'},html:'No recall requests yet.'})]));return;}
const upSt=div({cls:'ok',style:{display:'none',marginTop:'16px'}});
recs.forEach(r=>{
const card=div({cls:'card',style:{marginBottom:'16px'}});
const hdr2=div({style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}});
hdr2.append(div({},[div({style:{fontSize:'15px',color:'var(--text)',marginBottom:'4px'},html:r.user_name||'—'}),div({style:{fontSize:'12px',color:'var(--muted)'},html:r.user_email||''})]),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',color:r.status==='pending'?'var(--gold)':'var(--teal)'},html:r.status}));
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
for(const block of blocks){const lines=block.split('\n').filter(l=>l.trim());if(lines.length<3)continue;const q={topic:r.topic,question:'',option_a:'',option_b:'',option_c:'',option_d:'',option_e:'',correct_answer:'',explanation:'',is_global:false,user_id:r.user_id};q.question=lines[0];for(const line of lines.slice(1)){if(line.startsWith('A.')||line.startsWith('A)'))q.option_a=line.slice(2).trim();else if(line.startsWith('B.')||line.startsWith('B)'))q.option_b=line.slice(2).trim();else if(line.startsWith('C.')||line.startsWith('C)'))q.option_c=line.slice(2).trim();else if(line.startsWith('D.')||line.startsWith('D)'))q.option_d=line.slice(2).trim();else if(line.startsWith('E.')||line.startsWith('E)'))q.option_e=line.slice(2).trim();else if(line.toLowerCase().startsWith('answer:'))q.correct_answer=line.split(':')[1].trim().toUpperCase();else if(line.toLowerCase().startsWith('explanation:'))q.explanation=line.split(':').slice(1).join(':').trim();}if(q.question&&q.correct_answer)qs.push(q);}
if(qs.length){await sb.from('vignette_questions').insert(qs);upSt.textContent='✓ Uploaded '+qs.length+' questions!';}else upSt.textContent='No valid questions found.';
}
setTimeout(()=>upSt.style.display='none',3000);
}
if(r.style==='flashcard'){const fi=h('input',{type:'file',accept:'.csv',style:{color:'var(--muted)',fontSize:'12px',fontFamily:"'DM Mono',monospace"}});fi.onchange=e=>{if(e.target.files[0])handleUpload(e.target.files[0],true);};br2.append(div({},[h('label',{cls:'label',html:'Upload CSV'}),fi]));}
if(r.style==='vignette'){const fi=h('input',{type:'file',accept:'.txt',style:{color:'var(--muted)',fontSize:'12px',fontFamily:"'DM Mono',monospace"}});fi.onchange=e=>{if(e.target.files[0])handleUpload(e.target.files[0],false);};br2.append(div({},[h('label',{cls:'label',html:'Upload TXT'}),fi]));}
if(r.style==='theory'){
const fi=h('input',{type:'file',accept:'.pdf',style:{color:'var(--muted)',fontSize:'12px',fontFamily:"'DM Mono',monospace"}});
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
br2.append(btn('Mark Done','btn-teal',async()=>{await sb.from('recall_requests').update({status:'fulfilled'}).eq('id',r.id);if(r.user_id)await sb.from('profiles').update({has_new_content:true}).eq('id',r.user_id);loadTab('recalls');},{style:{padding:'8px 16px',fontSize:'11px'}}));
card.append(br2);content.append(card);
});
content.append(upSt);
}
if(tab==='flashcards'){
const card=div({cls:'card fade'});
card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Upload Flashcard Deck'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'CSV format: question, answer (one per line)'}));
const dnI=inp('e.g. Bacteriology Basics');
const upSt=div({cls:'ok',style:{display:'none',marginTop:'16px'}});
const fi=h('input',{type:'file',accept:'.csv',style:{color:'var(--muted)',fontSize:'13px',fontFamily:"'DM Mono',monospace",marginTop:'16px'}});
fi.onchange=async e=>{
const file=e.target.files[0];if(!file)return;
upSt.style.display='block';upSt.textContent='Uploading...';
const text=await file.text();const lines=text.split('\n').filter(l=>l.trim());
const{data:deck}=await sb.from('flashcard_decks').insert({topic:dnI.value||file.name.replace('.csv','')}).select().single();
if(!deck){upSt.textContent='Error';return;}
const cards=lines.map(line=>{const parts=line.split(',');return{deck_id:deck.id,question:parts[0]?.trim(),answer:parts.slice(1).join(',').trim()};}).filter(c=>c.question&&c.answer);
await sb.from('flashcards').insert(cards);upSt.textContent='✓ Uploaded '+cards.length+' cards!';setTimeout(()=>upSt.style.display='none',3000);
};
const ex=div({style:{background:'var(--bg)',border:'1px dashed var(--border)',borderRadius:'4px',padding:'32px',marginBottom:'20px'}});
ex.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Example:'}),div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'2px',padding:'12px',marginBottom:'16px'},html:'<p style="font-family:\'DM Mono\',monospace;font-size:12px;color:var(--muted);line-height:1.8">What causes malaria?, Plasmodium falciparum<br>What stain is used for TB?, Ziehl-Neelsen stain</p>'}),field('Deck Name',dnI),fi);
card.append(ex,upSt);content.innerHTML='';content.append(card);
}
if(tab==='questions'){
const card=div({cls:'card fade'});
card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Upload Vignette Questions'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'TXT format: separate questions with a blank line.'}));
const tI=inp('e.g. Bacteriology');
const upSt=div({cls:'ok',style:{display:'none',marginTop:'16px'}});
const fi=h('input',{type:'file',accept:'.txt',style:{color:'var(--muted)',fontSize:'13px',fontFamily:"'DM Mono',monospace",marginTop:'16px'}});
fi.onchange=async e=>{
const file=e.target.files[0];if(!file)return;
upSt.style.display='block';upSt.textContent='Uploading...';
const text=await file.text();const blocks=text.split('\n\n').filter(b=>b.trim());const qs=[];
for(const block of blocks){const lines=block.split('\n').filter(l=>l.trim());if(lines.length<3)continue;const q={topic:tI.value||'General',question:'',option_a:'',option_b:'',option_c:'',option_d:'',option_e:'',correct_answer:'',explanation:'',is_global:true};q.question=lines[0];for(const line of lines.slice(1)){if(line.startsWith('A.')||line.startsWith('A)'))q.option_a=line.slice(2).trim();else if(line.startsWith('B.')||line.startsWith('B)'))q.option_b=line.slice(2).trim();else if(line.startsWith('C.')||line.startsWith('C)'))q.option_c=line.slice(2).trim();else if(line.startsWith('D.')||line.startsWith('D)'))q.option_d=line.slice(2).trim();else if(line.startsWith('E.')||line.startsWith('E)'))q.option_e=line.slice(2).trim();else if(line.toLowerCase().startsWith('answer:'))q.correct_answer=line.split(':')[1].trim().toUpperCase();else if(line.toLowerCase().startsWith('explanation:'))q.explanation=line.split(':').slice(1).join(':').trim();}if(q.question&&q.correct_answer)qs.push(q);}
if(qs.length){await sb.from('vignette_questions').insert(qs);upSt.textContent='✓ Uploaded '+qs.length+' questions!';}else upSt.textContent='No valid questions found.';
setTimeout(()=>upSt.style.display='none',4000);
};
const ex=div({style:{background:'var(--bg)',border:'1px dashed var(--border)',borderRadius:'4px',padding:'32px',marginBottom:'20px'}});
ex.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Format:'}),div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'2px',padding:'12px',marginBottom:'16px'},html:'<p style="font-family:\'DM Mono\',monospace;font-size:12px;color:var(--muted);line-height:2">A 25-year-old presents with fever...<br>A. Streptococcus pyogenes<br>B. Staphylococcus aureus<br>C. Neisseria meningitidis<br>D. Haemophilus influenzae<br>Answer: C<br>Explanation: Classic presentation...</p>'}),field('Topic Name',tI),fi);
card.append(ex,upSt);content.innerHTML='';content.append(card);
}
if(tab==='testimonials'){
const{data:tlist}=await sb.from('testimonials').select('*').order('created_at',{ascending:false});
content.innerHTML='';
const addCard=div({cls:'card',style:{marginBottom:'24px'}});
addCard.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'20px'},html:'Add Testimonial'}));
const nI=inp('e.g. Sarah K.');const tI=inp('e.g. USMLE Step 1 Student');
const cI=h('textarea',{cls:'input',placeholder:"What did they say?",style:{minHeight:'100px',resize:'vertical',marginBottom:'20px'}});
const sm=div({cls:'ok',style:{display:'none',marginTop:'12px'},html:'✓ Added!'});
addCard.append(field('Student Name',nI),field('Title / Course (optional)',tI),h('label',{cls:'label',html:'Testimonial'}),cI,btn('Add Testimonial','btn-gold',async()=>{if(!nI.value||!cI.value)return;await sb.from('testimonials').insert({name:nI.value,title:tI.value,content:cI.value});sm.style.display='block';setTimeout(()=>{sm.style.display='none';loadTab('testimonials');},1500);}),sm);
content.append(addCard);
if(tlist&&tlist.length){
const lc=div({cls:'card'});
lc.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',marginBottom:'16px'},html:'Current Testimonials ('+tlist.length+')'}));
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
card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'24px'},html:'Tutoring Packages'}));
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
card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Booking Requests'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:pend+' new bookings'}));
if(!books||!books.length){card.append(h('p',{style:{fontSize:'14px',color:'var(--dim)',textAlign:'center',padding:'20px'},html:'No bookings yet.'}));content.innerHTML='';content.append(card);return;}
books.forEach(b=>{
const row=div({style:{padding:'16px 0',borderBottom:'1px solid var(--border)'}});
const inner2=div({style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}});
const info=div({});info.append(div({style:{fontSize:'15px',color:'var(--text)',marginBottom:'4px'},html:b.name||'—'}),div({style:{fontSize:'12px',color:'var(--muted)',marginBottom:'4px'},html:(b.email||'—')+' · '+(b.package||'—')}));
if(b.message)info.append(h('p',{style:{fontSize:'13px',color:'var(--dim)',fontStyle:'italic'},html:b.message}));
info.append(div({cls:'mono',style:{marginTop:'4px'},html:new Date(b.created_at).toLocaleDateString()}));
inner2.append(info,h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',color:b.status==='pending'?'var(--gold)':'var(--teal)'},html:b.status}));
row.append(inner2);card.append(row);
});
content.innerHTML='';content.append(card);
}
}
loadTab('settings');
}
showLogin();return page;
}
render();